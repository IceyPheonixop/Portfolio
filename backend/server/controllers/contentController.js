import Profile from '../models/Profile.js';
import { Achievement } from '../models/Content.js';
import { uploadBuffer, destroyAsset } from '../services/upload.js';

export function crud(Model) {
  return {
    list: async (req, res) => {
      try {
        const items = await Model.find().sort({ order: 1, _id: -1 }).lean();
        return res.json({ items: items || [] });
      } catch (error) {
        console.error(`[CRUD List Error]:`, error);
        return res.status(500).json({ message: error.message || 'Error fetching items.' });
      }
    },

    create: async (req, res) => {
      try {
        const payload = { ...req.body };
        ['startYear', 'endYear', 'order'].forEach((k) => {
          if (payload[k] === '' || payload[k] === null) delete payload[k];
        });

        const item = await Model.create(payload);
        return res.status(201).json({ item });
      } catch (error) {
        console.error(`[CRUD Create Error]:`, error);
        return res.status(400).json({ message: error.message || 'Error creating item.' });
      }
    },

    update: async (req, res) => {
      try {
        const payload = { ...req.body };
        
        delete payload._id;
        delete payload.__v;
        delete payload.createdAt;
        delete payload.updatedAt;

        ['startYear', 'endYear', 'order'].forEach((k) => {
          if (payload[k] === '' || payload[k] === null) {
            payload[k] = undefined;
          }
        });

        const item = await Model.findByIdAndUpdate(
          req.params.id,
          { $set: payload },
          { new: true, runValidators: true }
        );

        if (!item) return res.status(404).json({ message: 'Item not found.' });
        return res.json({ item });
      } catch (error) {
        console.error(`[CRUD Update Error]:`, error);
        return res.status(400).json({ message: error.message || 'Error updating item.' });
      }
    },

    remove: async (req, res) => {
      try {
        const item = await Model.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found.' });
        if (item.image?.publicId) {
          await destroyAsset(item.image.publicId).catch(() => {});
        }
        return res.json({ message: 'Item deleted.' });
      } catch (error) {
        console.error(`[CRUD Delete Error]:`, error);
        return res.status(500).json({ message: error.message || 'Error deleting item.' });
      }
    },
  };
}

// Achievement Handlers with File Upload Support
export async function createAchievement(req, res) {
  try {
    const payload = { ...req.body };
    if (req.file) {
      const isPdf = req.file.mimetype === 'application/pdf';
      payload.image = await uploadBuffer(
        req.file,
        'portfolio/certificates',
        isPdf ? 'raw' : 'image'
      );
    }
    const item = await Achievement.create(payload);
    return res.status(201).json({ item });
  } catch (error) {
    console.error('Create Achievement Error:', error);
    return res.status(400).json({ message: error.message || 'Failed to create achievement.' });
  }
}

export async function updateAchievement(req, res) {
  try {
    const payload = { ...req.body };
    delete payload._id;
    delete payload.__v;

    const existing = await Achievement.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: 'Achievement not found.' });

    if (req.file) {
      if (existing.image?.publicId) {
        await destroyAsset(existing.image.publicId).catch(() => {});
      }
      const isPdf = req.file.mimetype === 'application/pdf';
      payload.image = await uploadBuffer(
        req.file,
        'portfolio/certificates',
        isPdf ? 'raw' : 'image'
      );
    }

    const item = await Achievement.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );
    return res.json({ item });
  } catch (error) {
    console.error('Update Achievement Error:', error);
    return res.status(400).json({ message: error.message || 'Failed to update achievement.' });
  }
}

export async function getProfile(req, res) {
  try {
    let profile = await Profile.findOne().lean();
    if (!profile) {
      profile = await Profile.create({});
    }
    return res.json({ profile });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ message: error.message || 'Error retrieving profile.' });
  }
}

export async function updateProfile(req, res) {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }
    Object.assign(profile, req.body);

    // 1. Sidebar / Avatar Profile Photo
    if (req.files?.image?.[0]) {
      if (profile.image?.publicId) {
        await destroyAsset(profile.image.publicId, 'image').catch(() => {});
      }
      profile.image = await uploadBuffer(req.files.image[0], 'portfolio/profile', 'image');
    }

    // 2. About Me Page Photo
    if (req.files?.aboutImage?.[0]) {
      if (profile.aboutImage?.publicId) {
        await destroyAsset(profile.aboutImage.publicId, 'image').catch(() => {});
      }
      profile.aboutImage = await uploadBuffer(req.files.aboutImage[0], 'portfolio/about', 'image');
    }

    // 3. Resume Document (PDF / Raw)
    if (req.files?.resume?.[0]) {
      if (profile.resume?.publicId) {
        await destroyAsset(profile.resume.publicId, 'raw').catch(() => {});
      }
      profile.resume = await uploadBuffer(req.files.resume[0], 'portfolio/resume', 'raw');
    }

    await profile.save();
    return res.json({ profile });
  } catch (error) {
    console.error('Update Profile Error:', error);
    return res.status(500).json({ message: error.message || 'Failed to update profile.' });
  }
}

export async function viewResume(req, res) {
  try {
    const profile = await Profile.findOne().lean();
    const resumeUrl = profile?.resume?.url || (typeof profile?.resume === 'string' ? profile.resume : null);

    if (!resumeUrl) {
      return res.status(404).send('No resume found.');
    }

    return res.redirect(resumeUrl);
  } catch (error) {
    console.error('View Resume Error:', error);
    return res.status(500).send('Failed to fetch resume.');
  }
}

export async function downloadResume(req, res) {
  try {
    const profile = await Profile.findOne().lean();
    let resumeUrl = profile?.resume?.url || (typeof profile?.resume === 'string' ? profile.resume : null);

    if (!resumeUrl) {
      return res.status(404).send('No resume found.');
    }

    if (resumeUrl.includes('cloudinary.com') && !resumeUrl.includes('fl_attachment')) {
      resumeUrl = resumeUrl.replace('/upload/', '/upload/fl_attachment/');
    }

    return res.redirect(resumeUrl);
  } catch (error) {
    console.error('Download Resume Error:', error);
    return res.status(500).send('Failed to process download.');
  }
}