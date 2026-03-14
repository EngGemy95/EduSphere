import multer from 'multer';

// PDF upload middleware using memory storage
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB for PDF files

// Use memory storage to avoid saving files to disk
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    console.log('File filter - mimetype:', file.mimetype);
    // Accept PDF files (check both mimetype and extension)
    if (file.mimetype === 'application/pdf' || 
        file.originalname.toLowerCase().endsWith('.pdf')) {
      cb(null, true);
    } else {
      console.log('File rejected - not a PDF:', file.mimetype);
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
});

// Error handling middleware
const uploadPdfMiddleware = (req, res, next) => {
  upload.single('pdf')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ 
            error: 'File too large. Maximum size is 50MB' 
          });
        }
        return res.status(400).json({ 
          error: `Upload error: ${err.message}` 
        });
      }
      return res.status(400).json({ 
        error: err.message || 'File upload error' 
      });
    }
    next();
  });
};

export default uploadPdfMiddleware;
