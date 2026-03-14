import express from 'express';
import appVersionController from '../controllers/appVersionController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get app version (public endpoint)
router.get('/', appVersionController.getVersion);

// Update app version (admin only)
router.put('/update', authenticateToken, appVersionController.updateVersion);

export default router;
