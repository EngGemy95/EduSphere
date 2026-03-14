import express from 'express';
import { getImage } from '../controllers/imageController.js';

const router = express.Router();

// Get image by fileId
router.get('/image/:id', getImage);

export default router;
