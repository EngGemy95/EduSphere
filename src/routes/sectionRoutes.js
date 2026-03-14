import express from 'express';
import sectionController from '../controllers/sectionController.js';

const router = express.Router();

router.post('/create', sectionController.createSection);
router.put('/update/:sectionId', sectionController.updateSection);
router.get('/sectionsByCourse/:courseId', sectionController.getSectionsByCourse);
router.get('/:sectionId', sectionController.getSectionById);
router.delete('/delete/:sectionId', sectionController.deleteSection);
router.put('/reorder/:courseId', sectionController.reorderSections);

export default router;
