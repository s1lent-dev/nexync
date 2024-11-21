import fs from "fs";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } from "../config/config.js";
const s3Client = new S3Client({
    region: AWS_REGION,
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
});
const uploadToS3 = async (filePath, fileName, contentType) => {
    try {
        const file = fs.readFileSync(filePath);
        await s3Client.send(new PutObjectCommand({
            Bucket: "nexync",
            Key: `avatars/${fileName}`,
            Body: file,
            ContentType: contentType,
        }));
        fs.unlinkSync(filePath);
        const url = await getSignedUrlFromS3(`avatars/${fileName}`);
        return url;
    }
    catch (err) {
        fs.unlinkSync(filePath);
        console.error(err);
        return null;
    }
};
const getSignedUrlFromS3 = async (key) => {
    try {
        const command = new GetObjectCommand({
            Bucket: "nexync",
            Key: key,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 604800 });
        return url;
    }
    catch (err) {
        console.error(err);
        return null;
    }
};
export { uploadToS3, getSignedUrlFromS3 };
