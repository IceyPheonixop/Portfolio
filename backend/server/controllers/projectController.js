import Project from '../models/Project.js';
import { uploadBuffer, destroyAsset } from '../services/upload.js';

// Resilient parser: handles JSON arrays or comma-separated text strings
const parseArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
  }
  return [];
};

// Auto-generate a unique slug
const generateUniqueSlug = async (text, currentId = null) => {
  let base = (text || 'project')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  let slug = base;
  let count = 1;

  while (true) {
    const existing = await Project.findOne({ slug });
    if (!existing || (currentId && existing._id.toString() === currentId.toString())) {
      break;
    }
    slug = `${base}-${count++}`;
  }

  return slug;
};

const extractBody = (req) => {
  const payload = { ...req.body };

  if (payload.features !== undefined) {
    payload.features = parseArray(payload.features);
  }
  if (payload.technologies !== undefined) {
    payload.technologies = parseArray(payload.technologies);
  }
  if (payload.featured !== undefined) {
    payload.featured = payload.featured === 'true' || payload.featured === true;
  }
  if (payload.order !== undefined) {
    payload.order = Number(payload.order) || 0;
  }

  return payload;
};

export async function listPublic(req, res) {
  try {
    const projects = await Project.find({ status: 'published' }).sort({ order: 1, createdAt: -1 });
    return res.json({ projects });
  } catch (error) {
    console.error('List Public Error:', error);
    return res.status(500).json({ message: 'Error fetching projects.' });
  }
}

export async function getPublic(req, res) {
  try {
    const project = await Project.findOne({ slug: req.params.slug, status: 'published' });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.json({ project });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project.' });
  }
}

export async function getPublicById(req, res) {
  try {
    const project = await Project.findOne({ _id: req.params.id, status: 'published' });
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.json({ project });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project.' });
  }
}

export async function listAdmin(req, res) {
  try {
    const { search = '', status, category, page = 1, limit = 12 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { shortDescription: new RegExp(search, 'i') },
      ];
    }

    const [projects, total] = await Promise.all([
      Project.find(filter)
        .sort({ order: 1, updatedAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Project.countDocuments(filter),
    ]);

    return res.json({
      projects,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('List Admin Error:', error);
    return res.status(500).json({ message: 'Error fetching projects.' });
  }
}

export async function getAdmin(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    return res.json({ project });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching project.' });
  }
}

export async function create(req, res) {
  try {
    const data = extractBody(req);

    if (!data.title || !data.shortDescription || !data.category) {
      return res.status(400).json({
        message: 'Title, short description, and category are required.',
      });
    }

    // Auto-generate safe unique slug if not provided
    data.slug = await generateUniqueSlug(data.slug || data.title);

    if (req.files?.image?.[0]) {
      data.image = await uploadBuffer(req.files.image[0], 'portfolio/projects', 'image');
    }

    if (req.files?.gallery?.length) {
      data.gallery = await Promise.all(
        req.files.gallery.map((file) => uploadBuffer(file, 'portfolio/projects', 'image'))
      );
    }

    const project = await Project.create(data);
    return res.status(201).json({ project });
  } catch (error) {
    console.error('Create Project Error:', error);
    return res.status(400).json({ message: error.message || 'Failed to create project.' });
  }
}

export async function update(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const data = extractBody(req);

    // Update slug safely if title or slug changed
    if (data.title && data.title !== project.title) {
      data.slug = await generateUniqueSlug(data.slug || data.title, project._id);
    }

    if (req.files?.image?.[0]) {
      if (project.image?.publicId) {
        await destroyAsset(project.image.publicId).catch(() => {});
      }
      data.image = await uploadBuffer(req.files.image[0], 'portfolio/projects', 'image');
    }

    if (req.files?.gallery?.length) {
      const newGallery = await Promise.all(
        req.files.gallery.map((file) => uploadBuffer(file, 'portfolio/projects', 'image'))
      );
      data.gallery = [...(project.gallery || []), ...newGallery];
    }

    Object.assign(project, data);
    await project.save();
    return res.json({ project });
  } catch (error) {
    console.error('Update Project Error:', error);
    return res.status(400).json({ message: error.message || 'Failed to update project.' });
  }
}

export async function removeGallery(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    const asset = project.gallery?.id(req.params.assetId);
    if (!asset) return res.status(404).json({ message: 'Image not found.' });

    if (asset.publicId) {
      await destroyAsset(asset.publicId).catch(() => {});
    }
    asset.deleteOne();
    await project.save();
    return res.json({ project });
  } catch (error) {
    console.error('Remove Gallery Error:', error);
    return res.status(500).json({ message: 'Failed to remove gallery image.' });
  }
}

export async function remove(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });

    if (project.image?.publicId) {
      await destroyAsset(project.image.publicId).catch(() => {});
    }

    if (Array.isArray(project.gallery)) {
      await Promise.all(
        project.gallery.map((asset) => {
          if (asset?.publicId) {
            return destroyAsset(asset.publicId).catch(() => {});
          }
        })
      );
    }

    await project.deleteOne();
    return res.json({ message: 'Project deleted.' });
  } catch (error) {
    console.error('Delete Project Error:', error);
    return res.status(500).json({ message: error.message || 'Failed to delete project.' });
  }
}