
import userRepository from "../repositories/userRepository.js";
import url from 'url';
import EntityTypes from "./enums/entityTypes.js";

const utils = {

    async getEmail() {
        let email;
        let emailExists = null;

        do {
            email = userRepository.generateRandomEmail();
            emailExists = await userRepository.getUserByEmail(email);
        } while (emailExists);

        return email;
    },

    extractIdFromUrl(urlString) {
        // Parse the URL
        const parsedUrl = url.parse(urlString);

        // Split the pathname by '/' and get the last segment
        const pathSegments = parsedUrl.pathname.split('/');
        const id = pathSegments[pathSegments.length - 1];


        return id;
    },

    editObjImageUrl(entityType , modelObj) {
        const type = entityType === EntityTypes.USER ? `${process.env.USER_IMAGE_API}` : `${process.env.COURSE_IMAGE_API}`;
        
        const updatedObj = {
            ...(modelObj.toObject()),
            imageId: modelObj?.imageId ? `${process.env.BASE_URL}/${type}/${modelObj.imageId}` : modelObj?.imageId
        };
        return updatedObj;
    }

}


export default utils; 