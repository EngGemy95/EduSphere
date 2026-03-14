import Lecture from '../models/Lecture.js';
import Section from '../models/Section.js';

const lectureRepository = {
    async createLecture(lectureData) {
        const lecture = await Lecture.create(lectureData);

        await Section.findByIdAndUpdate(lectureData.sectionId, { $push : {lectures : lecture._id}});
        return lecture;
    },

    async getLecturesBySection(sectionId) {
        return await Lecture.find({ sectionId: sectionId }).sort({ order: 1 });
    },

    async getLectureById(lectureId) {
        return await Lecture.findById(lectureId).populate('sectionId');
    },

    async getAllLectures() {
        return await Lecture.find().populate('sectionId');
    },

    async updateLecture(lectureId, updateData) {
        return await Lecture.findByIdAndUpdate(lectureId, updateData, { new: true , runValidators : true});
    },

    async deleteLecture(lectureId) {
        return await Lecture.findByIdAndDelete(lectureId);
    },

    async reorderLectures(sectionId, lectureOrders) {
        // lectureOrders is an array of { lectureId, order } objects
        const updatePromises = lectureOrders.map(({ lectureId, order }) =>
            Lecture.findByIdAndUpdate(lectureId, { order }, { new: true })
        );
        await Promise.all(updatePromises);
        // Return updated lectures sorted by order
        return await Lecture.find({ sectionId: sectionId }).sort({ order: 1 });
    }
};

export default lectureRepository;
