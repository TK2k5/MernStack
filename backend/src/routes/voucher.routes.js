import { checkPermission } from '../middlewares/check-permission.middleware.js';
import express from 'express';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { voucherController } from '../controllers/voucher.controller.js';
import { voucherMiddleware } from '../middlewares/voucher.middleware.js';
import { wrapRequestHandler } from '../utils/handler.util.js';

const router = express.Router();

// create voucher
router.post(
  '/voucher',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherMiddleware),
  wrapRequestHandler(voucherController.createVoucher),
);

// get all voucher
router.get('/voucher', wrapRequestHandler(verifyToken), wrapRequestHandler(voucherController.getAllVouchers));

// update voucher
router.put(
  '/voucher/:id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherMiddleware),
  wrapRequestHandler(voucherController.updateVoucher),
);

// delete voucher

router.patch(
  '/voucher/:id',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(voucherController.deleteVoucher),
);

// get voucher by id
router.get('/voucher/:id', wrapRequestHandler(verifyToken), wrapRequestHandler(voucherController.getVoucherById));

export default router;
