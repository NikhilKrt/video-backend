import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUINARY_CLOUD_NAME,
    api_key: process.env.CLOUINARY_CLOUD_KEY,
    api_secret: process.env.CLOUINARY_CLOUD_SECRET,
});

const uploadOnCloudinary = async (loaclFilePath) => {
    try {
        if(!loaclFilePath) return null;
        const response = await cloudinary.uploader.upload(loaclFilePath, {
            resource_type: "auto"
        });
        console.log("File uploaded on Cloudinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(loaclFilePath); // remove the locally saved file
        return null;
    }
};

export { uploadOnCloudinary };