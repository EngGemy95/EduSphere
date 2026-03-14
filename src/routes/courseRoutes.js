import express from 'express';
import courseController from '../controllers/courseController.js';
import uploadMiddleware from '../middlewares/uploadMemoryFilesMiddleware.js';
import gridFsUploadMiddleware from '../middlewares/uploadFilesMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create course with image (requires authentication)
router.post('/create', authenticateToken, uploadMiddleware, gridFsUploadMiddleware, courseController.createCourse);

// Get course image by stored GridFS ID
router.get('/image/:fileId', courseController.getCourseImage);

// Update course with image (requires authentication)
router.put('/update/:courseId', authenticateToken, uploadMiddleware, gridFsUploadMiddleware, courseController.updateCourse);

// Get all courses pagination
router.get('/getAllPagination', courseController.getCoursesPagination);

// Get all courses (optional authentication - if authenticated, filter by instructor)
router.get('/', authenticateToken, courseController.getAllCourses);

// Get course by ID
router.get('/:courseId', courseController.getCourseById);

// Delete course
router.delete('/:courseId', courseController.deleteCourse);

export default router;
