import multer from "multer";
import { v4 as uuid } from "uuid";

const routeToFolder = {
    'users': './public/users',
    'chats': './public/chats',
}

const getDestinationFolder = (url: string) => {
    for (const route in routeToFolder) {
        if (url.includes(route)) {
            return routeToFolder[route as keyof typeof routeToFolder];
        }
    }
    return './public/uploads';
};

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const destinationFolder = getDestinationFolder(req.originalUrl);
        callback(null, destinationFolder);
    },
    filename(req, file, callback) {
        const id = uuid();
        const extName = file.originalname.split('.').pop();
        callback(null, `${id}.${extName}`);
    },
});

export const multerSingleUpload = (field: string) => multer({ storage }).single(field);
export const multerMultipleUpload = (field: string) => multer({ storage }).array(field);