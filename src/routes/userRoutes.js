import express from 'express';
import userController from '../controllers/userController.js';
import uploadMiddleware from '../middlewares/uploadMemoryFilesMiddleware.js';
import gridFsUploadMiddleware from '../middlewares/uploadFilesMiddleware.js';
import { deleteImageFromGridFS } from '../middlewares/uploadImageGridFS.js';

const router = express.Router();

// Upload route (using Multer's memory storage)
// Create user with image
router.post('/create', uploadMiddleware, gridFsUploadMiddleware, userController.createUser);

router.post('/login', userController.login);

// Get user image by stored GridFS ID
router.get('/image/:fileId', userController.getUserImage);

// Update user with image
router.put('/update/:userId', uploadMiddleware, gridFsUploadMiddleware, userController.updateUser);

// Create multiple users
router.post('/create-multiple/:count', userController.createMultipleUsers);

// Get all users (non-paginated, mainly for small datasets / statistics)
router.get('/', userController.getAllUsers);

// Get users with pagination & search
router.get('/pagination/list', userController.getUsersPagination);

// Get user by ID
router.get('/:userId', userController.getUserById);

// Delete user
router.delete('/:userId', userController.deleteUser);

export default router;
