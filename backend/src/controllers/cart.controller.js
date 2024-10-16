import Cart from '../models/cart.model.js';
import { HTTP_STATUS } from '../common/http-status.common.js';
import { TypeRole } from '../common/type.common.js';
import { cartService } from '../services/cart.service.js';
import { checkUserExist } from '../services/user.service.js';
import { productService } from '../services/product.service.js';

export const cartController = {
  // check product có trong cart hay ko
  checkProductInCart: (carts, productIdInCart) => {
    const productInCart = carts.find((item) => item._id.toString() === productIdInCart);

    return productInCart;
  },

  // check user match with user token
  checkUserToken: (userId, id, res) => {
    // check userId gửi lên có trùng với userId trong token không
    if (userId !== id) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'Unauthorized',
        success: false,
      });
    }
  },

  // check role và params
  checkRoleIsAdmin: (role, params, res) => {
    // kiểm tra role của user và check params có là 1 obejct rỗng hay không
    if (role !== TypeRole.ADMIN && Object.keys(params).length > 0) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        message: 'You do not have permission to access',
        success: false,
      });
    }
  },

  // check user có tồn tại không
  checkUserIsExist: async (userId) => {
    // check user tồn tại hay không
    const userExist = await checkUserExist(userId);

    return userExist;
  },

  // check product có tồn tại ko
  checkProductIsExist: async (productId) => {
    const productExist = await productService.getProductById(productId);

    return productExist;
  },

  // total calculate
  totalCalculate: (productExist, product) => {
    const total =
      productExist.sale > 0
        ? product.quantity * (productExist.price - productExist.sale)
        : product.quantity * productExist.price;

    return total;
  },

  // add to cart
  addCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, ...product } = body;

    // check userId gửi lên có trùng với userId trong token không
    cartController.checkUserToken(userId, _id, res);

    // check user tồn tại hay không
    const userExist = await cartController.checkUserIsExist(userId);

    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'User not found',
        success: false,
      });
    }
    // check product tồn tại hay không
    const productExist = await cartController.checkProductIsExist(product.productId);

    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({ userId });
    if (!result) {
      // tạo mới giỏ hàng
      const newCart = await cartService.createCart(userId, []);

      // thêm sản phẩm vào giỏ hàng
      newCart.carts.push(product);

      // tính tổng tiền
      const total = cartController.totalCalculate(productExist, product);

      newCart.total = total;
      await newCart.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Add to cart successfully',
        success: true,
      });
    }

    // lấy giỏ hàng của user nếu user đã có giỏ hàng
    const { carts } = result;

    // check product tồn tại trong giỏ hàng hay chưa
    const productExitInCarts = carts.filter((item) => item.productId.toString() === product.productId);

    // nếu tồn tại rồi thì cập nhật số lượng
    if (productExitInCarts && productExitInCarts.length > 0) {
      // check color & size có trùng không
      const itemExist = productExitInCarts.find((item) => item.size === product.size && item.color === product.color);
      if (itemExist) {
        itemExist.quantity += product.quantity;
        // tính tổng tiền
        const total = cartController.totalCalculate(productExist, product);
        result.total += total;
        await result.save();
        return res.status(HTTP_STATUS.OK).json({
          message: 'Add to cart successfully',
          success: true,
        });
      }
      // nếu không trùng thì thêm mới vào giỏ hàng
      else {
        // thêm sản phẩm vào giỏ hàng
        carts.push(product);

        // tính tổng tiền
        const total = cartController.totalCalculate(productExist, product);

        result.total += total;
        await result.save();

        return res.status(HTTP_STATUS.OK).json({
          message: 'Add to cart successfully',
          success: true,
        });
      }
    }

    // nếu chưa chưa tồn tại thêm mới vào giỏ hàng
    else {
      // thêm sản phẩm vào giỏ hàng
      carts.push(product);

      // tính tổng tiền
      const total = cartController.totalCalculate(productExist, product);

      result.total += total;
      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Add to cart successfully',
        success: true,
      });
    }
  },

  // get cart by userId
  getCartByUserId: async (req, res) => {
    const { _id, role } = req.user;
    const params = req.query;
    const { statusUser } = params;

    let query = {};
    // kiểm tra role của user vaf check params có là 1 obejct rỗng hay không
    cartController.checkRoleIsAdmin(role, params, res);

    if (statusUser) {
      query = { status: statusUser };
    }

    query = { ...query, userId: _id };

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId(query, params);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get cart successfully',
      success: true,
      data: result,
    });
  },

  // get all carts
  getAllCarts: async (req, res) => {
    const { role } = req.user;
    const params = req.query;
    const { statusUser, _limit = 10, _page = 1, q } = params;

    const option = {
      page: parseInt(_page, 10),
      limit: parseInt(_limit, 10),
      populate: [
        {
          path: 'userId',
          select: '_id email avatar fullname phone status',
        },
        { path: 'carts.productId', select: '_id nameProduct price sale images is_deleted status' },
      ],
    };

    let query = {};
    // kiểm tra role của user vaf check params có là 1 obejct rỗng hay không
    cartController.checkRoleIsAdmin(role, params, res);

    if (q) {
      query = {
        ...query,
        // $or: [{ userId: { $regex: new RegExp(q), $options: 'i' } }],
      };
    }

    // lấy tất cả giỏ hàng
    const result = await Cart.paginate(query, option);
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    return res.status(HTTP_STATUS.OK).json({
      message: 'Get all carts successfully',
      success: true,
      ...result,
    });
  },

  updateQuantityProductInCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, productId, productIdInCart } = body;
    const { status } = req.query;

    // check userId gửi lên có trùng với userId trong token không
    cartController.checkUserToken(userId, _id, res);

    // check user tồn tại hay không
    const userExist = cartController.checkUserIsExist(userId);

    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'User not found',
        success: false,
      });
    }

    // check product tồn tại hay không
    const productExist = cartController.checkProductIsExist(productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({ userId });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    const { carts } = result;

    // check productInCart tồn tại trong giỏ hàng hay không
    const productInCart = cartController.checkProductInCart(carts, productIdInCart);
    if (!productInCart) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    let isMax = false;

    if (!status || status === 'increase') {
      // tăng số lượng
      carts.forEach((item) => {
        if (item._id.toString() === productIdInCart) {
          item.quantity += 1;

          // nếu vượt quá quantity
          // lấy ra size và color có trùng ko
          const sizeExist = productExist.sizes.find((size) => size.size === item.size && size.color === item.color);
          if (sizeExist && sizeExist.quantity < item.quantity) {
            item.quantity -= 1;
            isMax = true;
          }

          // tính lại tổng tiền
          if (!isMax) {
            result.total =
              productExist.sale > 0
                ? productExist.price - productExist.sale + result.total
                : productExist.price + result.total;
          }
        }
      });

      if (isMax) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'The quantity is greater than in stock',
          success: false,
        });
      }

      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Increase product quantiy successfully',
        success: true,
      });
    } else {
      // giảm số lượng
      carts.forEach((item) => {
        if (item._id.toString() === productIdInCart) {
          item.quantity -= 1;

          // quantity sản phẩm nhỏ hơn 1
          if (item.quantity < 1) {
            // xóa sản phẩm
            result.carts = carts.filter((item) => item._id.toString() !== productIdInCart);
          }

          // tính lại tổng tiền
          result.total =
            productExist.sale > 0
              ? result.total - (productExist.price - productExist.sale)
              : result.total - productExist.price;
          // nếu tổng tiền nhỏ hơn 0
          if (result.total < 0) {
            result.total = 0;
          }
        }
      });

      await result.save();

      return res.status(HTTP_STATUS.OK).json({
        message: 'Decrease product quantiy successfully',
        success: true,
      });
    }
  },

  // delete product in cart
  deleteProductInCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, productIdInCart } = body;

    // check userId gửi lên có trùng với userId trong token không
    cartController.checkUserToken(userId, _id, res);

    // check user tồn tại hay không
    const userExist = cartController.checkUserIsExist(userId);
    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'User not found',
        success: false,
      });
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({ userId });
    if (!result) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        message: 'Cart not found',
        success: false,
      });
    }

    const { carts } = result;

    //check product có tồn tại hay ko
    const productInCart = cartController.checkProductInCart(carts, productIdInCart);
    if (!productInCart) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    // xóa sản phẩm
    result.carts = carts.filter((item) => item._id.toString() !== productIdInCart);

    // check product tồn tại hay không
    const productExist = await cartController.checkProductIsExist(productInCart.productId);
    if (!productExist) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'Product not found',
        success: false,
      });
    }

    // Tính tổng tiền
    result.total =
      productExist.sale > 0
        ? result.total - (productExist.price - productExist.sale) * productInCart.quantity
        : result.total - productExist.price * productInCart.quantity;

    if (result.total < 0) {
      result.total = 0;
    }

    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Delete product quantiy successfully',
      success: true,
    });
  },

  // async to cart
  asyncToCart: async (req, res) => {
    const { _id } = req.user;
    const body = req.body;
    const { userId, carts: cartLocalUser, total: totalLocalUser } = body;

    // check userId gửi lên có trùng với userId trong token không
    cartController.checkUserToken(userId, _id, res);

    // check user tồn tại hay không
    const userExist = await checkUserExist(userId);
    if (!userExist) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: 'User not found',
        success: false,
      });
    }

    const productExist = [];
    for (var i = 0; i < cartLocalUser.length; i++) {
      productExist[i] = await cartController.checkProductIsExist(cartLocalUser[i].productId);
      if (!productExist) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: 'Product not found',
          success: false,
        });
      }
    }

    // lấy giỏ hàng của user
    const result = await cartService.getCartsByUserId({
      userId,
    });
    if (!result) {
      // tạo mới giỏ hàng
      const newCart = await cartService.createCart(userId, []);

      // thêm sản phẩm vào giỏ hàng
      newCart.carts.push(...cartLocalUser);

      // tính tổng tiền
      newCart.total += totalLocalUser;

      await newCart.save();
      return res.status(HTTP_STATUS.OK).json({
        message: 'Add to cart successfully',
        success: true,
      });
    }

    // lấy giỏ hàng của user nếu user đã có giỏ hàng
    const { carts } = result;

    let isMax = false;
    for (let i = 0; i < cartLocalUser.length; i++) {
      // check product đã có trong giỏ hàng hay chưa
      const productInCart = carts.find(
        (item) =>
          item.productId.toString() === cartLocalUser[i].productId &&
          item.color === cartLocalUser[i].color &&
          item.size === cartLocalUser[i].size,
      );

      if (productInCart) {
        const sizeExist = [];
        productInCart.quantity += cartLocalUser[i].quantity;
        sizeExist[i] = productExist[i].sizes.find(
          (size) => size.size === carts[i].size && size.color === carts[i].color,
        );
        if (sizeExist && sizeExist[i].quantity < carts[i].quantity) {
          carts[i].quantity -= 1;
          isMax = true;
        }

        // tính lại tổng tiền
        if (!isMax) {
          carts.total += totalLocalUser;
        }
      } else {
        carts.push(cartLocalUser[i]);
      }
    }

    if (isMax) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: 'The quantity is greater than in stock',
        success: false,
      });
    }

    // tính tổng tiền
    result.total += totalLocalUser;

    await result.save();

    return res.status(HTTP_STATUS.OK).json({
      message: 'Add to cart successfully',
      success: true,
    });
  },
};
