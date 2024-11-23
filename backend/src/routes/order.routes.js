import { checkPermission } from '../middlewares/check-permission.middleware.js';
import express from 'express';
import { orderController } from '../controllers/order.controller.js';
import { orderMiddleware } from '../middlewares/order.middleware.js';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handler.util.js';

const router = express.Router();

// thêm mới đơn hàng
router.post(
  '/order',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(orderMiddleware),
  wrapRequestHandler(orderController.createOrder),
);

// lấy danh sách đơn hàng theo userId
router.get('/order', wrapRequestHandler(verifyToken), wrapRequestHandler(orderController.getOrdersByUserId));

// lấy danh sách đơn hàng
router.get(
  '/orders',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.getAllOrders),
);

// lấy order từ email
router.get(
  '/order',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.getOrderByEmail),
);

// update status đơn hàng
router.patch(
  '/order/:orderId',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.updateOrder),
);

// get order by day
router.get(
  '/order/day',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(orderController.getOrderByDay),
);

// router cancel order
router.patch(
  '/order/cancel/:orderId',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(orderController.cancelOrder),
);
export default router;
