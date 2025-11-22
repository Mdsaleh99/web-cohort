// export const clUploader = {
//     upload: async (filename: string) => {
//         // upload logic to cloudinary

//         console.log(`Uploading ${filename} to Cloudinary...`);
//         return true;
//     },
// };


export class ClUploader {
    constructor(private bucket: string) {}
    async upload(filename: string) {
        // upload logic to Cloudinary

        console.log(`Uploading ${filename} to Cloudinary in bucket ${this.bucket}...`);
        return true;
    }
}