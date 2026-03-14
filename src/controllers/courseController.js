import courseRepository from '../repositories/courseRepository.js';
import Course from '../models/Course.js';
import { uploadImageGridFS, downloadImageFromGridFS, deleteImageFromGridFS } from '../middlewares/uploadImageGridFS.js';  // Import saveToGridFS
import utils from '../utilities/utils.js';
import processEntity from './entityTypeController.js';
import EntityTypes from '../utilities/enums/entityTypes.js';
import enrollmentRepository from '../repositories/enrollmentRepository.js';
import { getPaginationParams, buildPaginatedResponse } from '../utilities/pagination.js';


const courseController = {


    // Get course image by GridFS ID
    async getCourseImage(req, res) {

        // Get image stream from GridFS
        await downloadImageFromGridFS(req, res);

    },

    async createCourse(req, res) {
        try {
            const { name, price, description, visible, activationCode, instructor } = req.body;

            let imageId;


            // Check if image is uploaded and save it to GridFS
            // If an image is uploaded, save it to GridFS and get the file ID
            if (req.file) {
                imageId = req.body.fileId; // Save to GridFS
                // imageId = `${process.env.BASE_URL}/api/users/image/${imageId}`; // Store full image URL
            }

            const newCourse = new Course({
                name,
                price,
                description,
                imageId: imageId,
                visible,
                activationCode,
                instructor
            });

            const course = await courseRepository.createCourse(newCourse);
            const updatedCourse = utils.editObjImageUrl(processEntity(EntityTypes.COURSE), course);
            //(await courseRepository.getCourseById(email)).toObject();

            //updatedCourse.imageId ? updatedCourse.imageId = `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${updatedCourse.imageId}` : null

            res.status(201).json({ message: 'Created Successfully', data: updatedCourse });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Error creating course', error });


        }
    },

    async updateCourse(req, res) {
        const { courseId } = req.params;
        const updateData = req.body; // Get updated course data

        try {
            // If an image is provided, upload it to GridFS
            if (req.file) {
                //const newImageId = await uploadImageGridFS(req.image);

                // Delete old image from GridFS if exists
                const course = await courseRepository.getCourseById(courseId);

                if (!course) {
                    return res.status(404).json({ error: 'Course not found' });
                }
                if (course?.imageId) {
                    await deleteImageFromGridFS(course.imageId);
                }

                // Update course with new image
                // Update user with new image
                updateData.imageId = req.body.fileId;
            }

            // Call the repository to update the course
            const courseObj = await courseRepository.updateCourse(courseId, updateData);

            if (!courseObj) {
                if (updateData.imageId) {
                    await deleteImageFromGridFS(updateData.imageId);
                }
                return res.status(404).json({ error: 'Course not updated' });
            }


            const updatedCourse = utils.editObjImageUrl(processEntity(EntityTypes.COURSE), courseObj);
            res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    async getCoursesPagination(req, res) {
        try {
            const { page, limit, search } = getPaginationParams(req, {
                defaultPage: 1,
                defaultLimit: 10,
            });

            const {
                courses,
                totalItems,
                totalPages,
                currentPage,
                pageSize,
            } = await courseRepository.getCoursesPagination({
                page,
                limit,
                search,
            });

            const coursesWithUpdatedImageUrl = await Promise.all(
                courses.map(async (course) => {
                    const enrollmentCount =
                        await enrollmentRepository.getEnrollmentCountByCourse(
                            course._id
                        );
                    return {
                        ...course,
                        imageId: course.imageId
                            ? `${process.env.BASE_URL}/${process.env.COURSE_IMAGE_API}/${course.imageId}`
                            : course.imageId,
                        enrollmentCount,
                    };
                })
            );

            // New, generic paginated response envelope (preferred)
            const responseBody = buildPaginatedResponse({
                message: "Courses Fetched Successfully",
                dataKey: "data",
                data: coursesWithUpdatedImageUrl,
                total: totalItems,
                page: currentPage,
                limit: pageSize,
            });

            // Keep legacy fields for backward compatibility
            responseBody.totalPages = totalPages;
            responseBody.currentPage = currentPage;

            res.status(200).json(responseBody);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },


    async getAllCourses(req, res) {
        try {
            // Get instructorId from query parameter, request body, or authenticated user
            let instructorId = req.query.instructorId || req.body.instructorId;
            
            // Convert string "null" to actual null
            if (instructorId === 'null' || instructorId === 'undefined') {
                instructorId = null;
            }
            
            // If no instructorId provided and user is authenticated, use authenticated user's ID only if instructor
            // This allows students to see all courses by not providing instructorId
            if (!instructorId && req.user && req.user.type === 'instructor') {
                instructorId = req.user.id;
            }
            
            // For students, only show courses with visible: 'ON'
            // For instructors, show all their courses regardless of visible status
            const visibleOnly = req.user && req.user.type === 'student';
            
            const courses = await courseRepository.getAllCourses(instructorId, visibleOnly);

            const coursesWithExtra = await Promise.all(
                courses.map(async course => {
                    const enrollmentCount = await enrollmentRepository.getEnrollmentCountByCourse(course._id);
                    return {
                        ...course,
                        imageId: course.imageId ? `${process.env.BASE_URL}/${process.env.COURSE_IMAGE_API}/${course.imageId}` : course.imageId,
                        enrollmentCount
                    };
                }));
            res.status(200).json({ message: 'Courses Fetched Successfully', data: coursesWithExtra });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getCourseById(req, res) {
        try {
            const course = await courseRepository.getCourseById(req.params.courseId);
            if (!course) return res.status(404).json({ message: 'Course not found' });

            const updatedCourse = utils.editObjImageUrl(processEntity(EntityTypes.COURSE), course);

            const enrollmentCount = await enrollmentRepository.getEnrollmentCountByCourse(course._id);

            res.status(200).json({ message: 'Course Fetched Successfully', data: {...updatedCourse , enrollmentCount} });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    async deleteCourse(req, res) {
        try {
            const deletedCourse = await courseRepository.deleteCourse(req.params.courseId);
            if (!deletedCourse) return res.status(404).json({ message: 'Course not found' });
            if (deletedCourse.imageId) {
                await deleteImageFromGridFS(deletedCourse.imageId);
            }
            res.status(200).json({ message: 'Course and related data deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default courseController;
