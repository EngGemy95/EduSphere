import { populate } from 'dotenv';
import Enrollment from '../models/Enrollment.js';
import EnrollmentRequest from '../models/EnrollmentRequest.js';

const enrollmentRepository = {
    async enrollUser(enrollmentData) {
        return await Enrollment.create(enrollmentData);
    },

    async isUserEnrollCourse(userId, courseId) {
        return await Enrollment.findOne({ user: userId, course: courseId });
    },

    async getEnrollmentsByUser(userId) {
        return await Enrollment.find({ user: userId }).populate({
            path: 'course',
            populate: [
                {
                    path: 'instructor'
                },
                {
                    path: 'sections',
                    options: { sort: { order: 1 } }, // Sort sections by order
                    populate: {
                        path: 'lectures',
                        options: { sort: { order: 1 } } // Sort lectures by order
                    }
                }
            ]
        });
    },

    async getEnrollmentsByCourse(courseId) {
        return await Enrollment.find({ course: courseId }).populate([
            { path: 'user' },
            { path: 'course' }
        ]);
    },

    async getEnrollmentCountByCourse(courseId) {
        return Enrollment.countDocuments({ course: courseId });
    },


    async activateEnrollment(userId, courseId, activationCode) {
        return await Enrollment.findOneAndUpdate(
            { user: userId, course: courseId, activationCode },
            { activated: true },
            { new: true }
        );
    },

    async deleteEnrollment(enrollmentId) {
        return await Enrollment.findByIdAndDelete(enrollmentId);
    },

    async deleteEnrollmentsByStudentAndCourses(studentId, courseIds) {
        // If courseIds is empty or null, delete all enrollments for the student
        if (!courseIds || courseIds.length === 0) {
            return await Enrollment.deleteMany({ user: studentId });
        }
        // Delete enrollments for specific courses
        return await Enrollment.deleteMany({ 
            user: studentId, 
            course: { $in: courseIds } 
        });
    },

    async enrollUserWithActivationCode(userId, activationCode) {
        const Course = (await import('../models/Course.js')).default;
        
        // Find course by activation code
        const course = await Course.findOne({ activationCode });
        if (!course) {
            throw new Error('Invalid activation code');
        }

        // Check if user is already enrolled
        const existingEnrollment = await this.isUserEnrollCourse(userId, course._id);
        if (existingEnrollment) {
            throw new Error('You are already enrolled in this course');
        }

        // Check if there's already a pending request
        const existingRequest = await EnrollmentRequest.findOne({
            user: userId,
            course: course._id,
            status: 'pending'
        });
        if (existingRequest) {
            throw new Error('You already have a pending enrollment request for this course');
        }

        // Create enrollment request instead of direct enrollment
        const enrollmentRequest = await EnrollmentRequest.create({
            user: userId,
            course: course._id,
            activationCode: activationCode,
            status: 'pending',
            instructor: course.instructor
        });

        // Populate and return request data
        return await EnrollmentRequest.findById(enrollmentRequest._id).populate([
            {
                path: 'course',
                populate: {
                    path: 'sections',
                    populate: 'lectures'
                }
            },
            {
                path: 'user',
                select: 'name email phone'
            }
        ]);
    },

    // Get all pending enrollment requests for an instructor
    async getPendingRequestsByInstructor(instructorId) {
        return await EnrollmentRequest.find({
            instructor: instructorId,
            status: 'pending'
        }).populate([
            {
                path: 'user',
                select: 'name email phone type'
            },
            {
                path: 'course',
                select: 'name activationCode'
            }
        ]).sort({ createdAt: -1 }); // Newest first
    },

    // Get pending enrollment requests for a student
    async getPendingRequestsByStudent(userId) {
        return await EnrollmentRequest.find({
            user: userId,
            status: 'pending'
        }).populate([
            {
                path: 'course',
                select: 'name activationCode _id'
            }
        ]).sort({ createdAt: -1 }); // Newest first
    },

    // Approve an enrollment request
    async approveEnrollmentRequest(requestId, instructorId) {
        // Find the request
        const request = await EnrollmentRequest.findOne({
            _id: requestId,
            instructor: instructorId,
            status: 'pending'
        });

        if (!request) {
            throw new Error('Enrollment request not found or already processed');
        }

        // Check if user is already enrolled
        const existingEnrollment = await this.isUserEnrollCourse(request.user, request.course);
        if (existingEnrollment) {
            // Update request status to approved even if already enrolled
            await EnrollmentRequest.findByIdAndUpdate(requestId, { status: 'approved' });
            throw new Error('User is already enrolled in this course');
        }

        // Create the actual enrollment
        const enrollment = await this.enrollUser({
            user: request.user,
            course: request.course,
        });

        // Update request status to approved
        await EnrollmentRequest.findByIdAndUpdate(requestId, { status: 'approved' });

        // Return enrollment with populated data
        return await Enrollment.findById(enrollment._id).populate([
            {
                path: 'course',
                populate: {
                    path: 'sections',
                    populate: 'lectures'
                }
            },
            {
                path: 'user',
                select: 'name email phone'
            }
        ]);
    },

    // Reject an enrollment request
    async rejectEnrollmentRequest(requestId, instructorId, rejectionReason = null) {
        const request = await EnrollmentRequest.findOne({
            _id: requestId,
            instructor: instructorId,
            status: 'pending'
        });

        if (!request) {
            throw new Error('Enrollment request not found or already processed');
        }

        // Update request status to rejected
        return await EnrollmentRequest.findByIdAndUpdate(
            requestId,
            {
                status: 'rejected',
                rejectionReason: rejectionReason
            },
            { new: true }
        ).populate([
            {
                path: 'user',
                select: 'name email phone'
            },
            {
                path: 'course',
                select: 'name'
            }
        ]);
    },

    async getStudentsByInstructor(instructorId) {
        const User = (await import('../models/User.js')).default;
        const Course = (await import('../models/Course.js')).default;
        
        // Get all courses by instructor
        const courses = await Course.find({ instructor: instructorId }).select('_id name');
        const courseIds = courses.map(course => course._id);

        // Get all students created by this instructor (even if not enrolled in any course)
        const studentsCreatedByInstructor = await User.find({
            type: 'student',
            createdBy: instructorId
        }).lean();

        // Get all enrollments for these courses and populate user data
        const enrollments = await Enrollment.find({ 
            course: { $in: courseIds } 
        }).populate([
            { 
                path: 'user',
                match: { 
                    type: 'student',
                    $or: [
                        { createdBy: instructorId }, // Students created by this instructor
                        { createdBy: null } // Students without createdBy (for backward compatibility)
                    ]
                }
            },
            { 
                path: 'course',
                select: 'name' // Only get course name
            }
        ]);

        // Filter out enrollments where user is null (in case of type mismatch or createdBy mismatch)
        const validEnrollments = enrollments.filter(e => e.user !== null);

        // Create a map to store unique students with their courses
        const uniqueStudents = new Map();

        // First, add all students created by instructor (even without enrollments)
        studentsCreatedByInstructor.forEach(student => {
            const userId = student._id.toString();
            if (!uniqueStudents.has(userId)) {
                uniqueStudents.set(userId, {
                    user: student,
                    courses: [],
                    enrollmentDate: student.createdAt
                });
            }
        });

        // Then, add enrollments to populate courses for each student
        validEnrollments.forEach(enrollment => {
            const userId = enrollment.user._id.toString();
            if (!uniqueStudents.has(userId)) {
                uniqueStudents.set(userId, {
                    user: enrollment.user,
                    courses: [enrollment.course],
                    enrollmentDate: enrollment.createdAt
                });
            } else {
                // Add course if not already in the list
                const existing = uniqueStudents.get(userId);
                const courseExists = existing.courses.some(c => {
                    const courseId = c._id ? c._id.toString() : c.toString();
                    const enrollmentCourseId = enrollment.course._id ? enrollment.course._id.toString() : enrollment.course.toString();
                    return courseId === enrollmentCourseId;
                });
                if (!courseExists) {
                    existing.courses.push(enrollment.course);
                }
            }
        });

        return Array.from(uniqueStudents.values());
    }
};

export default enrollmentRepository;
