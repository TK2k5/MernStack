import { addToCartMiddleware } from '../middlewares/cart.middleware.js';
import { cartController } from '../controllers/cart.controller.js';
import { checkPermission } from '../middlewares/check-permission.middleware.js';
import express from 'express';
import { verifyToken } from '../middlewares/verify-token.middleware.js';
import { wrapRequestHandler } from '../utils/handler.util.js';

const router = express.Router();

// add to cart
router.post(
  '/cart',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(addToCartMiddleware),
  wrapRequestHandler(cartController.addCart),
);

// get carts by userId
router.get('/cart', wrapRequestHandler(verifyToken), wrapRequestHandler(cartController.getCartByUserId));

// get all carts
router.get(
  '/carts',
  wrapRequestHandler(verifyToken),
  wrapRequestHandler(checkPermission),
  wrapRequestHandler(cartController.getAllCarts),
);

// update quantity product in cart
router.patch('/cart', wrapRequestHandler(verifyToken), wrapRequestHandler(cartController.updateQuantityProductInCart));

// delete product in cart
router.delete('/cart', wrapRequestHandler(verifyToken), wrapRequestHandler(cartController.deleteProductInCart));
export default router;

// async to cart
router.post('/cart/async', wrapRequestHandler(verifyToken), wrapRequestHandler(cartController.asyncToCart));
