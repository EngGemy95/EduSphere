import Course from '../models/Course.js';
import Section from '../models/Section.js';

const sectionRepository = {
    async createSection(sectionData) {
        const section = await Section.create(sectionData);

        // Update the course to include this section
        await Course.findByIdAndUpdate(sectionData.courseId, { $push: { sections: section._id } });
        return section;
    },

    async getSectionsByCourse(courseId) {
        return await Section.find({ courseId: courseId }).populate('lectures').sort({ order: 1 });
    },

    async getSectionById(sectionId) {
        return await Section.findById(sectionId).populate('lectures');
    },

    async updateSection(sectionId, updateData) {
        return await Section.findByIdAndUpdate(sectionId, updateData, { new: true, runValidators: true }).populate('lectures');
    },

    async deleteSection(sectionId) {
        // Get section first to get courseId
        const section = await Section.findById(sectionId);
        if (!section) {
            return null;
        }

        // Delete the section (this will trigger pre-hook to delete lectures)
        const deletedSection = await Section.findByIdAndDelete(sectionId);

        // Remove section from course's sections array
        if (deletedSection && section.courseId) {
            await Course.findByIdAndUpdate(
                section.courseId,
                { $pull: { sections: sectionId } }
            );
        }

        return deletedSection;
    },

    async reorderSections(courseId, sectionOrders) {
        // sectionOrders is an array of { sectionId, order } objects
        const updatePromises = sectionOrders.map(({ sectionId, order }) =>
            Section.findByIdAndUpdate(sectionId, { order }, { new: true })
        );
        await Promise.all(updatePromises);
        // Return updated sections sorted by order
        return await Section.find({ courseId: courseId }).populate('lectures').sort({ order: 1 });
    }
};

export default sectionRepository;
