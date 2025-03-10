import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        // console.log("File has been successfully uploaded", response);
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as upload got failed
        return response


    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the loacally saved temporary file on the local server as upload operation is got failed
        return null
    }
}


export { uploadOnCloudinary }