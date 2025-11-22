// export const s3Uploader = {
//     upload: async (filename: string) => {
//         // upload logic to S3

//         console.log(`Uploading ${filename} to S3...`);
//         return true;
//     }
// }

export class S3Uploader {
    constructor(private bucket: string){}
    async upload(filename: string) {
        // upload logic to S3

        console.log(`Uploading ${filename} to S3 in bucket ${this.bucket}...`);
        return true;
    }
}
