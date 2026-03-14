import lectureRepository from '../repositories/lectureRepository.js';
import { downloadPdfFromGridFS } from '../middlewares/uploadPdfGridFS.js';

const lectureController = {
    async createLecture(req, res) {
        try {
            const { title, url, sectionId, visible, type, pdfFileId } = req.body;

            console.log('Create Lecture Request Body:', req.body);
            console.log('PDF File ID:', pdfFileId);
            console.log('Has File:', !!req.file);

            // Validation
            if (!title || !sectionId) {
                return res.status(400).json({ 
                    message: 'Title and Section ID are required' 
                });
            }

            // Validate type if provided
            const validTypes = ['video', 'pdf', 'quiz', 'lesson'];
            const lectureType = type && validTypes.includes(type.toLowerCase()) 
                ? type.toLowerCase() 
                : 'video'; // Default to video if not provided or invalid

            // For PDF type, require either pdfFileId (uploaded file) or url
            let finalUrl = url || '';
            if (lectureType === 'pdf') {
                if (pdfFileId) {
                    // Construct URL from fileId
                    const baseUrl = req.protocol + '://' + req.get('host');
                    finalUrl = `${baseUrl}/api/lectures/pdf/${pdfFileId}`;
                } else if (!url || url.trim() === '') {
                    return res.status(400).json({ 
                        message: 'PDF file or URL is required for PDF type lecture' 
                    });
                }
            } else {
                // For other types (video, quiz, lesson), URL is required
                if (!url || url.trim() === '') {
                    return res.status(400).json({ 
                        message: 'URL is required' 
                    });
                }
            }

            const lectureData = {
                title: title.trim(),
                url: finalUrl,
                sectionId,
                visible: visible || 'OFF',
                type: lectureType
            };

            console.log('Lecture Data to Create:', lectureData);

            const lecture = await lectureRepository.createLecture(lectureData);
            
            // Convert Mongoose document to plain object
            const lectureObj = lecture.toObject ? lecture.toObject() : lecture;
            
            console.log('Created Lecture:', lectureObj);
            
            res.status(201).json({ 
                message: 'Lecture created successfully', 
                data: lectureObj 
            });
        } catch (error) {
            console.error('Error creating lecture:', error);
            res.status(500).json({ 
                error: error.message || 'Internal server error',
                details: error.stack 
            });
        }
    },

    async getLecturesBySection(req, res) {
        try {
            const lectures = await lectureRepository.getLecturesBySection(req.params.sectionId);
            res.status(200).json({ message: 'Lectures fetched successfully', data: lectures });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getLectureById(req, res) {
        try {
            const lecture = await lectureRepository.getLectureById(req.params.lectureId);
            if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
            res.status(200).json({ message: 'Lecture fetched successfully', data: lecture });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },


    async getAllLectures(req, res) {
        try {
            const lectures = await lectureRepository.getAllLectures();
            res.status(200).json({ message: 'Lectures fetched successfully', data: lectures });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async updateLecture(req, res) {
        try {
            const { lectureId } = req.params;
            const { title, url, visible, type, pdfFileId } = req.body;

            console.log('Update Lecture Request Body:', req.body);
            console.log('PDF File ID:', pdfFileId);
            console.log('Has File:', !!req.file);

            // Get existing lecture to check current type
            const existingLecture = await lectureRepository.getLectureById(lectureId);
            if (!existingLecture) {
                return res.status(404).json({ message: 'Lecture not found' });
            }

            const updateData = {};

            // Update title if provided
            if (title) {
                updateData.title = title.trim();
            }

            // Validate type if provided in update
            if (type) {
                const validTypes = ['video', 'pdf', 'quiz', 'lesson'];
                if (validTypes.includes(type.toLowerCase())) {
                    updateData.type = type.toLowerCase();
                } else {
                    return res.status(400).json({ 
                        message: 'Invalid type. Must be one of: video, pdf, quiz, lesson' 
                    });
                }
            }

            // Update visibility if provided
            if (visible) {
                updateData.visible = visible;
            }

            // Handle URL update based on type
            const lectureType = updateData.type || existingLecture.type;
            let finalUrl = url;

            if (lectureType === 'pdf') {
                // For PDF type, if new PDF file is uploaded, use it
                if (pdfFileId) {
                    console.log('PDF file uploaded, creating new URL with fileId:', pdfFileId);
                    // Construct URL from fileId
                    const baseUrl = req.protocol + '://' + req.get('host');
                    finalUrl = `${baseUrl}/api/lectures/pdf/${pdfFileId}`;
                    updateData.url = finalUrl;
                    console.log('New PDF URL created:', finalUrl);
                } else if (url && url.trim() !== '') {
                    // If URL is provided and no file, use the URL
                    updateData.url = url.trim();
                }
                // If neither file nor URL provided, keep existing URL (don't update URL)
            } else {
                // For other types (video, quiz, lesson), URL is required if provided
                if (url && url.trim() !== '') {
                    updateData.url = url.trim();
                } else if (!existingLecture.url) {
                    return res.status(400).json({ 
                        message: 'URL is required for this lecture type' 
                    });
                }
            }

            console.log('Update Data:', updateData);

            const updatedLecture = await lectureRepository.updateLecture(lectureId, updateData);
            if (!updatedLecture) return res.status(404).json({ message: 'Lecture not found' });
            
            // Convert Mongoose document to plain object
            const lectureObj = updatedLecture.toObject ? updatedLecture.toObject() : updatedLecture;
            
            res.status(200).json({ message: 'Lecture updated successfully', data: lectureObj });
        } catch (error) {
            console.error('Error updating lecture:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async deleteLecture(req, res) {
        try {
            const lecture = await lectureRepository.deleteLecture(req.params.lectureId);
            if (!lecture) return res.status(404).json({ message: 'Lecture not found' });
            res.status(200).json({ message: 'Lecture deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Get PDF file by fileId
    async getPdf(req, res) {
        try {
            await downloadPdfFromGridFS(req, res);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async reorderLectures(req, res) {
        try {
            const { sectionId } = req.params;
            const { lectureOrders } = req.body; // Array of { lectureId, order }

            if (!lectureOrders || !Array.isArray(lectureOrders)) {
                return res.status(400).json({ error: 'lectureOrders must be an array' });
            }

            // Verify user is instructor
            if (req.user && req.user.type !== 'instructor') {
                return res.status(403).json({ error: 'Only instructors can reorder lectures' });
            }

            const lectures = await lectureRepository.reorderLectures(sectionId, lectureOrders);
            res.status(200).json({ 
                message: 'Lectures reordered successfully', 
                data: lectures 
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default lectureController;
