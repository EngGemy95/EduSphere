import enrollmentRepository from '../repositories/enrollmentRepository.js';

const enrollmentController = {
  async enrollUser(req, res) {
    try {
      const userId = req.body.user;
      const courseId = req.body.course;
      const isUserEnrollCourse = await enrollmentRepository.isUserEnrollCourse(userId, courseId);
      if (isUserEnrollCourse) {
        return res.status(400).json({ error: "you already enroll this course" });
      }
      const enrollment = await enrollmentRepository.enrollUser(req.body);
      res.status(201).json({ message: "Course enrolled successfully", data: enrollment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEnrollmentsByUser(req, res) {
    try {
      const enrollments = await enrollmentRepository.getEnrollmentsByUser(req.params.userId);
      res.status(200).json({ message: "Enrolled Courses fetched successfully", data: enrollments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getEnrollmentsByCourse(req, res) {
    try {
      const enrollments = await enrollmentRepository.getEnrollmentsByCourse(req.params.courseId);
      res.status(200).json({ message: "Fetched data successfully", data: enrollments });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getStudentsByInstructor(req, res) {
    try {
      const instructorId = req.params.instructorId;
      const students = await enrollmentRepository.getStudentsByInstructor(instructorId);
      res.status(200).json({ 
        message: "Students fetched successfully", 
        data: students 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteStudentEnrollments(req, res) {
    try {
      const { studentId } = req.params;
      const { courseIds } = req.body; // Array of course IDs, or empty/null to delete all

      const result = await enrollmentRepository.deleteEnrollmentsByStudentAndCourses(
        studentId,
        courseIds
      );

      const message = courseIds && courseIds.length > 0
        ? `Student removed from ${result.deletedCount} course(s) successfully`
        : `Student removed from all courses successfully (${result.deletedCount} enrollment(s) deleted)`;

      res.status(200).json({ 
        message,
        deletedCount: result.deletedCount
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async enrollUserInCourses(req, res) {
    try {
      const { userId, courseIds } = req.body; // Array of course IDs

      if (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0) {
        return res.status(400).json({ error: "courseIds array is required" });
      }

      const enrollments = [];
      const errors = [];

      for (const courseId of courseIds) {
        const isEnrolled = await enrollmentRepository.isUserEnrollCourse(userId, courseId);
        if (isEnrolled) {
          errors.push({ courseId, error: "User already enrolled in this course" });
        } else {
          try {
            const enrollment = await enrollmentRepository.enrollUser({
              user: userId,
              course: courseId,
            });
            enrollments.push(enrollment);
          } catch (error) {
            errors.push({ courseId, error: error.message });
          }
        }
      }

      res.status(201).json({ 
        message: `User enrolled in ${enrollments.length} course(s) successfully`,
        data: enrollments,
        errors: errors.length > 0 ? errors : undefined
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async enrollWithActivationCode(req, res) {
    try {
      const { userId, activationCode } = req.body;

      if (!userId || !activationCode) {
        return res.status(400).json({ error: "userId and activationCode are required" });
      }

      const request = await enrollmentRepository.enrollUserWithActivationCode(userId, activationCode);
      
      res.status(201).json({ 
        message: "Enrollment request submitted successfully. Waiting for instructor approval.",
        data: request,
        isRequest: true
      });
    } catch (error) {
      if (error.message === 'Invalid activation code') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'You are already enrolled in this course') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'You already have a pending enrollment request for this course') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Get all pending enrollment requests for an instructor
  async getPendingRequests(req, res) {
    try {
      const { instructorId } = req.params;
      const requests = await enrollmentRepository.getPendingRequestsByInstructor(instructorId);
      res.status(200).json({
        message: "Enrollment requests fetched successfully",
        data: requests
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get pending enrollment requests for a student
  async getPendingRequestsByStudent(req, res) {
    try {
      const { userId } = req.params;
      const requests = await enrollmentRepository.getPendingRequestsByStudent(userId);
      res.status(200).json({
        message: "Pending enrollment requests fetched successfully",
        data: requests
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Approve an enrollment request
  async approveRequest(req, res) {
    try {
      const { requestId } = req.params;
      const instructorId = req.body.instructorId; // Get from body or use auth middleware

      if (!instructorId) {
        return res.status(400).json({ error: "instructorId is required" });
      }

      const enrollment = await enrollmentRepository.approveEnrollmentRequest(requestId, instructorId);
      
      res.status(200).json({
        message: "Enrollment request approved successfully",
        data: enrollment
      });
    } catch (error) {
      if (error.message === 'Enrollment request not found or already processed') {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === 'User is already enrolled in this course') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  },

  // Reject an enrollment request
  async rejectRequest(req, res) {
    try {
      const { requestId } = req.params;
      const { instructorId, rejectionReason } = req.body;

      if (!instructorId) {
        return res.status(400).json({ error: "instructorId is required" });
      }

      const request = await enrollmentRepository.rejectEnrollmentRequest(
        requestId,
        instructorId,
        rejectionReason
      );
      
      res.status(200).json({
        message: "Enrollment request rejected successfully",
        data: request
      });
    } catch (error) {
      if (error.message === 'Enrollment request not found or already processed') {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }
};

export default enrollmentController;
