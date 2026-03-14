import sectionRepository from '../repositories/sectionRepository.js';


const sectionController = {
  async createSection(req, res) {
    try {
      const section = await sectionRepository.createSection(req.body);
      res.status(201).json(section);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },


  async updateSection(req, res) {
    const { sectionId } = req.params;
    const updateData = req.body; // Get updated section data

    try {
      const section = await sectionRepository.updateSection(sectionId, updateData);

      if (!section) {
        return res.status(404).json({ error: 'Section not found' });
      }

      res.status(200).json({ message: 'Section updated successfully', section });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSectionsByCourse(req, res) {
    try {
      const sections = await sectionRepository.getSectionsByCourse(req.params.courseId);
      res.status(200).json({ message: 'Sections Fetched Successfully', data: sections });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getSectionById(req, res) {
    try {
      const section = await sectionRepository.getSectionById(req.params.sectionId);
      if (!section) return res.status(404).json({ message: 'Section not found' });
      res.status(200).json({ message: 'Section Fetched Successfully', data: section });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteSection(req, res) {
    try {
      const section = await sectionRepository.deleteSection(req.params.sectionId);
      if (!section) return res.status(404).json({ message: 'Section not found' });
      res.status(200).json({ message: 'Section and related data deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async reorderSections(req, res) {
    try {
      const { courseId } = req.params;
      const { sectionOrders } = req.body; // Array of { sectionId, order }

      if (!sectionOrders || !Array.isArray(sectionOrders)) {
        return res.status(400).json({ error: 'sectionOrders must be an array' });
      }

      // Verify user is instructor and owns the course
      if (req.user && req.user.type !== 'instructor') {
        return res.status(403).json({ error: 'Only instructors can reorder sections' });
      }

      const sections = await sectionRepository.reorderSections(courseId, sectionOrders);
      res.status(200).json({ 
        message: 'Sections reordered successfully', 
        data: sections 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default sectionController;
