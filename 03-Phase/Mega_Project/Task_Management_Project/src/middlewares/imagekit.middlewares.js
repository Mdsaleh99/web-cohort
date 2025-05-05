import ImageKit from "imagekit"
import fs from "fs"
import path from 'path'
import dotenv from "dotenv"

dotenv.config()

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// const imagekit = new ImageKit({
//     publicKey: "public_9oXhUKaFxXTZpLk00pywvHy/OOM=",
//     privateKey: "private_b17zA03IFGFSqy/I+5mqh9DrjG8=",
//     urlEndpoint: "https://ik.imagekit.io/al9zl3lbh",
// });

const uploadOnImageKit = async (loacalFilePath) => {
    try {
        if (!loacalFilePath) return null;

        // Read the file content as a Buffer
        const fileContent = fs.readFileSync(loacalFilePath);

        // upload to imagekit
        const response = await imagekit.upload({
            file: fileContent,
            folder: "task-management-img",
            fileName: `${Date.now()}-${path.basename(loacalFilePath)}`,
            extensions: [
                {
                    name: "google-auto-tagging",
                    maxTags: 5,
                    minConfidence: 95,
                },
            ],
        });

        fs.unlinkSync(loacalFilePath);
        // console.log(response);
        return response;
    } catch (error) {
        console.error("ImageKit upload error:", error);
        fs.unlinkSync(loacalFilePath); // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}

export {uploadOnImageKit}