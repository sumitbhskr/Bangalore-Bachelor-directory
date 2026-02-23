import dotenv from 'dotenv'
dotenv.config() 

import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



const storage = new CloudinaryStorage({
  cloudinary,
  // params: {
  //   folder: "bangalore-bachelor",
  //   allowed_formats: ["jpg", "jpeg", "png", "webp"],
  //   transformation: [
  //     { width: 800, height: 600, crop: "limit", quality: "auto" },
  //   ],
  // },
  params: async (req, file) => {
  return {
    folder: "bangalore-bachelor",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [
      { width: 800, height: 600, crop: "limit", quality: "auto" },
    ],
  };
},
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});
