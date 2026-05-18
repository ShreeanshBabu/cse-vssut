import { Router } from 'express';
import { chat } from '../controllers/chatController.js';

const router = Router();

// chat is already wrapped by asyncHandler inside chatController.js
router.post('/', chat);

export default router;
