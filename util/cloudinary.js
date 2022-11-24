import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

import { v2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: v2,
  params: {
    folder: "Fundvest",
    allowedFormats: ["jpeg", "jpeg", "jpg"],
  },
});

export default storage;
