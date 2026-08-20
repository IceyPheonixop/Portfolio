import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { sendMessage, getMessages, deleteMessage } from '../controllers/messageController.js';

const router = Router();

// Public submission
router.post('/', sendMessage);

// Admin operations
router.get('/', protect, getMessages);
router.delete('/:id', protect, deleteMessage);

export default router;