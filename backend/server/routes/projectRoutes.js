// server/routes/projectRoutes.js
import express from 'express';
import Project from '../models/Project.js';
import { protect as verifyToken } from '../middleware/auth.js';
import { upload, uploadBuffer, destroyAsset } from '../services/upload.js';

const router = express.Router();

const parseArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  try {
    const parsed = JSON.parse(input);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    return input.split(',').map((x) => x.trim()).filter(Boolean);
  }
};

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

// 1. Admin: Get all projects
router.get('/admin/all', verifyToken, async (req, res) => {
  try {
    const { search, limit = 100 } = req.query;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const projects = await Project.find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ projects, count: projects.length });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 2. Admin: Get single project by ID for editing
router.get('/admin/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 3. Public: Get published projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'published' }).sort({ order: 1, createdAt: -1 });
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 4. Public: Get single project by slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug, status: 'published' });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json({ project });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// 5. Protected: Create a new project (With Multer File Handling)
router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        shortDescription,
        description,
        problemStatement,
        solution,
        features,
        technologies,
        category,
        githubUrl,
        liveDemoUrl,
        status,
        featured,
        order,
      } = req.body;

      if (!title || !shortDescription) {
        return res.status(400).json({ message: 'Title and short description are required.' });
      }

      const slug = await generateUniqueSlug(title);

      let image = undefined;
      if (req.files?.image?.[0]) {
        image = await uploadBuffer(req.files.image[0], 'portfolio/projects', 'image');
      }

      let gallery = [];
      if (req.files?.gallery?.length) {
        gallery = await Promise.all(
          req.files.gallery.map((f) => uploadBuffer(f, 'portfolio/projects/gallery', 'image'))
        );
      }

      const newProject = new Project({
        title,
        slug,
        shortDescription,
        description,
        problemStatement,
        solution,
        features: parseArray(features),
        technologies: parseArray(technologies),
        category: category || 'Web Development',
        githubUrl,
        liveDemoUrl,
        status: status || 'published',
        featured: featured === 'true' || featured === true,
        order: Number(order) || 0,
        image,
        gallery,
      });

      const savedProject = await newProject.save();
      res.status(201).json({ project: savedProject });
    } catch (err) {
      console.error('Create Project Error:', err);
      res.status(400).json({ message: err.message || 'Failed to create project' });
    }
  }
);

// 6. Protected: Update an existing project
router.put(
  '/:id',
  verifyToken,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      const updateData = { ...req.body };

      if (updateData.features !== undefined) {
        updateData.features = parseArray(updateData.features);
      }
      if (updateData.technologies !== undefined) {
        updateData.technologies = parseArray(updateData.technologies);
      }
      if (updateData.featured !== undefined) {
        updateData.featured = updateData.featured === 'true' || updateData.featured === true;
      }
      if (updateData.order !== undefined) {
        updateData.order = Number(updateData.order) || 0;
      }

      if (updateData.title && updateData.title !== project.title) {
        updateData.slug = await generateUniqueSlug(updateData.title, project._id);
      }

      if (req.files?.image?.[0]) {
        if (project.image?.publicId) {
          await destroyAsset(project.image.publicId).catch(() => {});
        }
        updateData.image = await uploadBuffer(req.files.image[0], 'portfolio/projects', 'image');
      }

      if (req.files?.gallery?.length) {
        const newGallery = await Promise.all(
          req.files.gallery.map((f) => uploadBuffer(f, 'portfolio/projects/gallery', 'image'))
        );
        updateData.gallery = [...(project.gallery || []), ...newGallery];
      }

      const updated = await Project.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      res.json({ project: updated });
    } catch (err) {
      console.error('Update Project Error:', err);
      res.status(400).json({ message: err.message || 'Failed to update project' });
    }
  }
);

// 7. Protected: Delete a project
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.image?.publicId) {
      await destroyAsset(project.image.publicId).catch(() => {});
    }

    if (Array.isArray(project.gallery)) {
      await Promise.all(
        project.gallery.map((asset) => {
          if (asset?.publicId) return destroyAsset(asset.publicId).catch(() => {});
        })
      );
    }

    await project.deleteOne();
    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;