import EntityTypes from "../utilities/enums/entityTypes.js";


const processEntity = (entityType) => {
    if (!Object.values(EntityTypes).includes(entityType)) {
        throw new Error(`Invalid entity type: ${entityType}`);
    }

    switch (entityType) {
        case EntityTypes.USER:
            //console.log("Processing user...");
            return 'user';
        case EntityTypes.COURSE:
            //console.log("Processing course...");
            return 'course';
        default:
            //console.log("Unknown entity");
            return null;
    }
};

export default processEntity;
