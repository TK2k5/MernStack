import { createBrand, deleteBrand, getBrand, getBrandById, updateBrand } from '../controllers/brand.controller.js';

import { BrandMiddleware } from '../middlewares/brand.middleware.js';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import express from 'express';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handler.util.js';

const router = express.Router();

// create brand
router.post(
  '/brand',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(BrandMiddleware),
  wrapRequestHandler(createBrand),
);

// get all brand
router.get('/brand', wrapRequestHandler(getBrand));

// get one brand
router.get('/brand/:brandId', wrapRequestHandler(getBrandById));

// delete brand
router.delete('/brand/:brandId', wrapRequestHandler(deleteBrand));

// update brand
router.patch(
  '/brand/:brandId',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(BrandMiddleware),
  wrapRequestHandler(updateBrand),
);

export default router;
