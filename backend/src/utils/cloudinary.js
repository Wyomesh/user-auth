import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const uploadOnCloudinary = async function (localFilePath) {
  try {
    if (!localFilePath) {
      return null;
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // check after completion once

    console.log(response);
    fs.unlinkSync(localFilePath);
    return response.url;
  } catch (error) {
    console.log("error   ---> ", error);
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
