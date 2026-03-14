import fs from 'fs';
import mongoose from 'mongoose'; // Use mongoose for ObjectId
import { GridFSBucket, ObjectId } from 'mongodb'; // Use MongoDB's native GridFSBucket


// This Code If We ( do not ) Use uploads Folder
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// Function to initialize GridFSBucket
const initGridFS = async () => {
    if (mongoose.connection.readyState === 1) {
        // Check if the connection is established
        return new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
    } else {
        throw new Error('Mongoose is not connected to MongoDB.');
    }
};

// Upload Image Directly from Memory (No Local File Storage)
const uploadImageGridFS = async (file) => {
    if (!file) throw new Error("No file provided");

    // Check file size before uploading
    if (file.size > MAX_FILE_SIZE) {
        throw new Error("File size exceeds limit (5MB)");
    }

    const bucket = await initGridFS();  // Get the GridFS bucket

    // Create an upload stream in GridFS
    const uploadStream = bucket.openUploadStream(file.originalname);
    uploadStream.end(file.buffer); // Directly write buffer to GridFS

    return new Promise((resolve, reject) => {
        uploadStream.on('finish', () => {
            resolve(uploadStream.id); // Return file ID after successful upload
        });

        uploadStream.on('error', (err) => {
            reject(err); // Handle upload error
        });
    });
};


const downloadImageFromGridFS = async (req, res) => {
    try {
        const { fileId } = req.params;

        const bucket = await initGridFS(); // Get the bucket after confirming connection

        // Check if file exists
        const file = await bucket
            .find({ _id: new mongoose.Types.ObjectId(fileId) })
            .toArray();
        if (file.length === 0) {
            return res.status(404).json({ error: "File not found" });
        }

        // set the headers
        res.set("Content-Type", 'image/jpeg');
        //res.set("Content-Disposition", `attachment; filename=${file[0].filename}`);

        // create a stream to read from the bucket
        const downloadStream = bucket.openDownloadStream(
            new mongoose.Types.ObjectId(fileId)
        );

        // pipe the stream to the response
        downloadStream.pipe(res);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: { text: `Unable to download file`, error } });
    }
};

const deleteImageFromGridFS = async (fileId) => {
    // try {
    const bucket = await initGridFS();
    // Convert fileId to ObjectId (if it's a string)
    const objectId = new mongoose.Types.ObjectId(fileId);
    // Delete the file from GridFS
    await bucket.delete(objectId);


    // return new Promise((resolve, reject) => {
    //     // Convert fileId to ObjectId if it's a string
    //     const id = new mongoose.Types.ObjectId(fileId);

    //     bucket.delete(id, (err) => {
    //         if (err) {
    //             reject(err);
    //         } else {
    //             resolve(true);
    //         }
    //     });
    // });

    // } catch (error) {
    //     console.error("Error deleting file:", error);
    //     return { success: false, message: "Failed to delete file.", error };
    // }
};

export { uploadImageGridFS, downloadImageFromGridFS, deleteImageFromGridFS };




// This Code If We Use uploads Folder
// const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
// // Function to initialize GridFSBucket
// const initGridFS = async () => {
//     if (mongoose.connection.readyState === 1) {
//         // Check if the connection is established
//         return new GridFSBucket(mongoose.connection.db, { bucketName: 'uploads' });
//     } else {
//         throw new Error('Mongoose is not connected to MongoDB.');
//     }
// };

// // Function to upload image to GridFS
// const uploadImageGridFS = async (file) => {
//     const bucket = await initGridFS();  // Get the bucket after confirming connection
//     const filePath = file.path; // Path to the uploaded file

//     // Check file size before uploading
//     const stats = fs.statSync(filePath);
//     if (stats.size > MAX_FILE_SIZE) {
//         throw new Error("File size exceeds limit (5MB)");
//     }

//     const uploadStream = bucket.openUploadStream(file.filename); // Create a write stream to upload to GridFS
//     const readStream = fs.createReadStream(filePath); // Read the uploaded file

//     // Pipe the file to GridFS
//     readStream.pipe(uploadStream);

//     return new Promise((resolve, reject) => {
//         uploadStream.on('finish', () => {
//             resolve(uploadStream.id); // Return the file ID after upload is complete
//             //const imagePath = `/uploads/${uploadStream.id}_${uploadStream.filename}`; // Store path format
//             //resolve(imagePath); // Return the image path instead of the file ID
//         });

//         uploadStream.on('error', (err) => {
//             reject(err); // Reject if there's an error
//         });
//     });
// };


// const downloadImageFromGridFS = async (req, res) => {
//     try {
//         const { fileId } = req.params;

//         const bucket = await initGridFS(); // Get the bucket after confirming connection

//         // Check if file exists
//         const file = await bucket
//             .find({ _id: new mongoose.Types.ObjectId(fileId) })
//             .toArray();
//         if (file.length === 0) {
//             return res.status(404).json({ error: { text: "File not found" } });
//         }

//         // set the headers
//         res.set("Content-Type", 'image/jpeg');
//         //res.set("Content-Disposition", `attachment; filename=${file[0].filename}`);

//         // create a stream to read from the bucket
//         const downloadStream = bucket.openDownloadStream(
//             new mongoose.Types.ObjectId(fileId)
//         );

//         // pipe the stream to the response
//         downloadStream.pipe(res);
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({ error: { text: `Unable to download file`, error } });
//     }
// };

// const deleteImageFromGridFS = async (fileId) => {
//     // try {
//     const bucket = await initGridFS();
//     // Convert fileId to ObjectId (if it's a string)
//     const objectId = new mongoose.Types.ObjectId(fileId);
//     // Delete the file from GridFS
//     await bucket.delete(objectId);


//     // return new Promise((resolve, reject) => {
//     //     // Convert fileId to ObjectId if it's a string
//     //     const id = new mongoose.Types.ObjectId(fileId);

//     //     bucket.delete(id, (err) => {
//     //         if (err) {
//     //             reject(err);
//     //         } else {
//     //             resolve(true);
//     //         }
//     //     });
//     // });

//     // } catch (error) {
//     //     console.error("Error deleting file:", error);
//     //     return { success: false, message: "Failed to delete file.", error };
//     // }
// };

// export { uploadImageGridFS, downloadImageFromGridFS, deleteImageFromGridFS };
