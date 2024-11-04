import multer from "multer";
import { v4 as uuid } from "uuid";

const storage = multer.diskStorage({
    destination(req, file, callback) {
        const destinationFolder = './public/uploads';
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