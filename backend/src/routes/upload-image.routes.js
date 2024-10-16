import * as dotenv from 'dotenv';

import { deleteImage, uploadImage } from '../controllers/upload-imgae.controller.js';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import cloudinary from '../configs/cloudinary.config.js';
import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handler.util.js';

dotenv.config();

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER,
  },
});

const parser = multer({ storage: storage });

router.post(
  '/image/upload',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  parser.array('images', 2),
  wrapRequestHandler(uploadImage),
);

router.delete(
  '/images/:public_id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(deleteImage),
);

export default router;
