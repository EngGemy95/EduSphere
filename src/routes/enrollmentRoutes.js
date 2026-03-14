import express from 'express';
import enrollmentController from '../controllers/enrollmentController.js';

const router = express.Router();

router.post('/create', enrollmentController.enrollUser);
router.post('/enroll-multiple', enrollmentController.enrollUserInCourses);
router.post('/enroll-with-code', enrollmentController.enrollWithActivationCode);
router.get('/user/:userId', enrollmentController.getEnrollmentsByUser);
router.get('/course/:courseId', enrollmentController.getEnrollmentsByCourse);
router.get('/instructor/:instructorId/students', enrollmentController.getStudentsByInstructor);
router.delete('/student/:studentId', enrollmentController.deleteStudentEnrollments);

// Enrollment request routes
router.get('/requests/instructor/:instructorId', enrollmentController.getPendingRequests);
router.get('/requests/student/:userId', enrollmentController.getPendingRequestsByStudent);
router.post('/requests/:requestId/approve', enrollmentController.approveRequest);
router.post('/requests/:requestId/reject', enrollmentController.rejectRequest);

export default router;
