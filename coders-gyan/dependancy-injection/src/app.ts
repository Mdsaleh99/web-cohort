import express from "express";
import { FileController } from "./file-controller";
import { S3Uploader } from "./s3-uploader";
import { ClUploader } from "./cloudinary";
// import { s3Uploader } from "./s3-uploader";
// import { clUploader } from "./cloudinary";

const app = express();

app.get("/file-upload", (req, res) => {
    const uploaderStr = req.query.uploader;
    if (uploaderStr == 's3') {
        const uploader = new S3Uploader("my-s3-bucket");
        new FileController(uploader).upload(req, res)
        // new FileController(s3Uploader).upload(req, res)
        // fileController.upload(req, res, {
        //     uploader: s3Uploader /* inject desired uploader here */,
        // });
        return
    } else if (uploaderStr == 'cloudinary') {
        const uploader = new ClUploader("my-cloudinary-bucket");
        new FileController(uploader).upload(req, res);
        // new FileController(clUploader).upload(req, res);
        // fileController.upload(req, res, {
        //     uploader: clUploader /* inject desired uploader here */,
        // });
        return
    } else {
        res.status(400).json({ message: 'Invalid uploader specified. Use ?uploader=s3 or ?uploader=cloudinary' });
    }
});

export default app;
