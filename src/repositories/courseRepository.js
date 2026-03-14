import Course from '../models/Course.js';

const populateOption = [
    { path: 'instructor' },  // Populate instructor details
    {
        path: 'sections',
        options: { sort: { order: 1 } }, // Sort sections by order
        populate: { 
            path: 'lectures',
            options: { sort: { order: 1 } } // Sort lectures by order
        }
    }
];

const courseRepository = {
    async createCourse(courseData) {
        return (await Course.create(courseData));
    },

    /**
     * Generic pagination for courses.
     * Supports optional text search on course name.
     */
    async getCoursesPagination({ page = 1, limit = 10, search = "" }) {
        const skip = (page - 1) * limit;
        const query = search
            ? { name: { $regex: search, $options: "i" } }
            : {};

        const [courses, total] = await Promise.all([
            Course.find(query)
                .populate(populateOption)
                .skip(skip)
                .limit(limit)
                .lean(),
            Course.countDocuments(query),
        ]);

        return {
            courses,
            totalItems: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            pageSize: limit,
        };
    },

    async getAllCourses(instructorId = null, visibleOnly = false) {
        const query = instructorId ? { instructor: instructorId } : {};
        // If visibleOnly is true, only return courses with visible: 'ON'
        if (visibleOnly) {
            query.visible = 'ON';
        }
        return await Course.find(query).populate(populateOption).lean();
    },

    async getCourseById(courseId) {
        return await Course.findById(courseId).populate(populateOption);
    },

    async updateCourse(courseId, updateData) {
        return await Course.findByIdAndUpdate(courseId, updateData, { new: true, runValidators: true }).populate(populateOption);
    },

    async deleteCourse(courseId) {
        return await Course.findByIdAndDelete(courseId);
    }
};

export default courseRepository;
