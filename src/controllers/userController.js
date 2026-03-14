import userRepository from '../repositories/userRepository.js';
import User from '../models/User.js';
import { uploadImageGridFS, downloadImageFromGridFS, deleteImageFromGridFS } from '../middlewares/uploadImageGridFS.js';  // Import saveToGridFS
import dotenv from 'dotenv';
import utils from '../utilities/utils.js';
import processEntity from './entityTypeController.js';
import EntityTypes from '../utilities/enums/entityTypes.js';
import { getPaginationParams, buildPaginatedResponse } from '../utilities/pagination.js';

dotenv.config();

const userController = {


    // Get user image by GridFS ID
    async getUserImage(req, res) {
        // try {
        // const { fileId } = req.params;

        // Get image stream from GridFS
        await downloadImageFromGridFS(req, res);

        // } catch (error) {
        //     res.status(404).json({ error: 'Image not found' });
        // }
    },


    async createUser(req, res) {
        try {
            const { name, phone, type, deviceId, password, instructorId, paymentType } = req.body;

            let imageId;
            const email = await utils.getEmail();

            // Check if image is uploaded and save it to GridFS
            // If an image is uploaded, save it to GridFS and get the file ID
            if (req.file) {
                imageId = req.body.fileId; // Save to GridFS
                // imageId = `${process.env.BASE_URL}/api/users/image/${imageId}`; // Store full image URL
            }

            const newUser = new User({
                name,
                email,
                phone,
                imageId: imageId, // Store the GridFS file ID or the URL
                // imageId: `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${imageId}`, // Store the GridFS file ID or the URL
                type,
                deviceId,
                password, // You should hash the password before storing it
                createdBy: instructorId || null, // Set the instructor who created this student
                paymentType: paymentType || null, // 'half', 'full', or null
            });

            //await newUser.save();

            
            const user = await userRepository.createUser(newUser);
            const updatedUser = utils.editObjImageUrl(processEntity(EntityTypes.USER),user);
            // const updatedUser = {
            //     ...user,
            //     imageId: user?.imageId ? `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${user.imageId}` : user?.imageId
            // };


            res.status(201).json({ message: 'Created Successfully', data: updatedUser });
        } catch (error) {
            res.status(500).json({ message: `Error creating user  ${error.message}`, });
        }
    },

    // Function to create multiple users based on count in request params
    async createMultipleUsers(req, res) {
        try {
            const { count } = req.params; // Get the count from request params

            if (!count || isNaN(count) || count <= 0) {
                return res.status(400).json({ message: 'Invalid count parameter' });
            }

            let users = [];

            for (let i = 0; i < parseInt(count); i++) {

                const email = await utils.getEmail();

                const newUser = new User({
                    // name: '',
                    email: email,
                    password: process.env.DEFAULT_USER_PASSWORD,
                    type: 'student',
                    //deviceId: '',
                    imageId: null
                });
                let user = await userRepository.createUser(newUser);
                users.push(user);
            }

            // Insert multiple users into the database
            //const savedUsers = users;

            res.status(201).json({
                message: `${count} users created successfully`,
                data: users
            });

        } catch (error) {
            console.error('Error creating multiple users:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },



    async login(req, res) {

        const { email, password, deviceId } = req.body;

        // 1. Check if user exists
        const user = await userRepository.getUserByEmail(email);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Verify Password
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 3. Handle deviceId logic
        if (!user.deviceId || user.deviceId === '') {
            // First login: Update deviceId
            const userObj = await userRepository.updateDeviceId(user._id, deviceId);
            const updatedUser = utils.editObjImageUrl(processEntity(EntityTypes.USER),userObj);

            // const updatedUser = {
            //     ...(userObj).toObject(),
            //     imageId: userObj?.imageId ? `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${userObj.imageId}` : userObj?.imageId
            // };

            // Generate JWT tokens for first login
            const { generateToken, generateRefreshToken } = await import('../middlewares/authMiddleware.js');
            const token = generateToken(userObj);
            const refreshToken = generateRefreshToken(userObj);

            return res.json({ 
                message: "Login Successfully", 
                data: {
                    ...updatedUser,
                    token: token,
                    refreshToken: refreshToken
                }
            });
        } else if (user.deviceId !== deviceId) {
            return res.status(403).json({ message: "Login not allowed from a different device" });
        }

        // 4. Generate JWT tokens
        const { generateToken, generateRefreshToken } = await import('../middlewares/authMiddleware.js');
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        const updatedUser = utils.editObjImageUrl(processEntity(EntityTypes.USER),user);
        // const updatedUser = {
        //     ...(user).toObject(),
        //     imageId: user?.imageId ? `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${user.imageId}` : user?.imageId
        // };
        res.json({ 
            message: "Login Successfully", 
            data: {
                ...updatedUser,
                token: token,
                refreshToken: refreshToken
            }
        });

    },

    async updateUser(req, res) {
        const { userId } = req.params;
        const updateData = req.body; // Get updated user data

        try {
        // If an image is provided, upload it to GridFS
        if (req.file) {

            const user = await userRepository.getUserById(userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            if (user?.imageId) {
                // const fileId = utils.extractIdFromUrl(user.imageId);
                // Delete old image from GridFS if exists
                await deleteImageFromGridFS(user.imageId);
            }
            // Update user with new image
            updateData.imageId = req.body.fileId;
            // updateData.imageId = `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${newImageId}`;
        }

        const userObj = await userRepository.updateUser(userId, updateData);

        if (!userObj) {
            if(updateData.imageId){
                await deleteImageFromGridFS(updateData.imageId);
            }
            return res.status(404).json({ error: 'User not updated' });
        }

        const updatedUser = utils.editObjImageUrl(processEntity(EntityTypes.USER),userObj);
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getAllUsers(req, res) {
        try {
            const users = await userRepository.getAllUsers();

            const usersWithUpdatedImageUrl = users.map(user => ({
                ...user,
                imageId: user.imageId ? `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${user.imageId}` : user.imageId
            }));
            
            res.status(200).json({ message : 'Users Fetched Successfully', data : usersWithUpdatedImageUrl});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    // Generic paginated users endpoint using shared pagination utilities
    async getUsersPagination(req, res) {
        try {
            const { page, limit, search } = getPaginationParams(req, {
                defaultPage: 1,
                defaultLimit: 20,
            });

            const {
                users,
                totalItems,
                totalPages,
                currentPage,
                pageSize,
            } = await userRepository.getUsersPagination({
                page,
                limit,
                search,
            });

            const usersWithUpdatedImageUrl = users.map((user) => ({
                ...user,
                imageId: user.imageId
                    ? `${process.env.BASE_URL}/${process.env.USER_IMAGE_API}/${user.imageId}`
                    : user.imageId,
            }));

            const responseBody = buildPaginatedResponse({
                message: 'Users Fetched Successfully',
                dataKey: 'data',
                data: usersWithUpdatedImageUrl,
                total: totalItems,
                page: currentPage,
                limit: pageSize,
            });

            // Legacy fields for simple clients (optional)
            responseBody.totalPages = totalPages;
            responseBody.currentPage = currentPage;

            res.status(200).json(responseBody);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async getUserById(req, res) {
        try {
            const user = await userRepository.getUserById(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            const updatedUser = utils.editObjImageUrl(processEntity(EntityTypes.USER),user);
            res.status(200).json({message : 'User Fetched Successfully', data : updatedUser});
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },



    async deleteUser(req, res) {
        try {
            const user = await userRepository.deleteUser(req.params.userId);
            if (!user) return res.status(404).json({ message: 'User not found' });
            if(user.imageId){
                await deleteImageFromGridFS(user.imageId);
            }
            res.status(200).json({ message: 'User and related data deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

export default userController;
