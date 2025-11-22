import { Request, Response } from "express";
// import { s3Uploader } from "./s3-uploader";

interface Uploader {
    upload: (filename: string) => Promise<boolean>;
}

// export const fileController = {
//     upload: async (req: Request, res: Response, {uploader}: {uploader: Uploader}) => {
//         // Logic to handle file upload
//         // await s3Uploader.upload('sample-file.mp4');

//         // dependency injection in action
//         // now this uploader can be s3Uploader or clUploader based on what is injected
//         await uploader.upload('sample-file.mp4');

//         res.json({ message: 'File uploaded successfully!' });
//     }
// }

export class FileController {
    // private uploader: Uploader;
    // constructor(uploader: Uploader) {
    //     this.uploader = uploader;
    // }
    constructor(private uploader: Uploader) {}

    upload(req: Request, res: Response) {
        // Logic to handle file upload
        // await s3Uploader.upload('sample-file.mp4');

        this.uploader.upload("sample-file.mp4");
        res.json({ message: "File uploaded successfully!" });
    }
}
