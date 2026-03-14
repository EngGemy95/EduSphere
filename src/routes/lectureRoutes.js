import express from 'express';
import lectureController from '../controllers/lectureController.js';
import uploadPdfMiddleware from '../middlewares/uploadPdfMiddleware.js';
import gridFsUploadPdfMiddleware from '../middlewares/uploadPdfFilesMiddleware.js';

const router = express.Router();

// Create lecture (with PDF upload support)
router.post('/create', uploadPdfMiddleware, gridFsUploadPdfMiddleware, lectureController.createLecture);

// Get PDF file by fileId
router.get('/pdf/:fileId', lectureController.getPdf);

// Get all lectures
router.get('/', lectureController.getAllLectures);

// Get lectures by section
router.get('/sectionLectures/:sectionId', lectureController.getLecturesBySection);

// Get lecture by ID (must be after other specific routes)
router.get('/:lectureId', lectureController.getLectureById);

// Update lecture (with PDF upload support)
router.put('/update/:lectureId', uploadPdfMiddleware, gridFsUploadPdfMiddleware, lectureController.updateLecture);

// Delete lecture
router.delete('/delete/:lectureId', lectureController.deleteLecture);

// Reorder lectures
router.put('/reorder/:sectionId', lectureController.reorderLectures);

export default router;