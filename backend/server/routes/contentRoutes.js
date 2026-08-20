import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  getProfile,
  updateProfile,
  viewResume,
  downloadResume,
  crud,
  createAchievement,
  updateAchievement,
} from '../controllers/contentController.js';
import {
  Skill,
  Experience,
  Education,
  Achievement,
  SocialLink,
} from '../models/Content.js';
import { upload } from '../services/upload.js';

const router = Router();

// Helper to register standard CRUD routes
const resource = (path, Model) => {
  const c = crud(Model);
  router.get(path, c.list);
  router.post(path, protect, c.create);
  router.put(`${path}/:id`, protect, c.update);
  router.delete(`${path}/:id`, protect, c.remove);
};

// Resume routes
router.get('/profile/resume/view', viewResume);
router.get('/profile/resume/download', downloadResume);

// Profile routes
router.get('/profile', getProfile);
router.put(
  '/profile',
  protect,
  upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'aboutImage', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
]),
  updateProfile
);

// Dynamic Content Resources (Without file uploads)
resource('/skills', Skill);
resource('/experience', Experience);
resource('/education', Education);
resource('/social', SocialLink);

// Achievements CRUD (With Certificate Upload Support)
const achievementCrud = crud(Achievement);
router.get('/achievements', achievementCrud.list);
router.post(
  '/achievements',
  protect,
  upload.single('certificate'),
  createAchievement
);
router.put(
  '/achievements/:id',
  protect,
  upload.single('certificate'),
  updateAchievement
);
router.delete('/achievements/:id', protect, achievementCrud.remove);

export default router;