import mongoose from 'mongoose';
import Grid from 'gridfs-stream';

const gfs = Grid(mongoose.connection.db, mongoose.mongo);
gfs.collection('uploads'); // Define the collection for GridFS

// Get image by fileId
const getImage = (req, res) => {
    const fileId = req.params.id;

    gfs.files.findOne({ _id: mongoose.Types.ObjectId(fileId) }, (err, file) => {
        if (err || !file) {
            return res.status(404).json({ message: 'File not found' });
        }

        const readStream = gfs.createReadStream({ _id: file._id });
        res.set('Content-Type', file.contentType);
        readStream.pipe(res);
    });
};

export { getImage };
