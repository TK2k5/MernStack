import { HTTP_STATUS } from '../common/http-status.common.js';
import dayjs from 'dayjs';
import { orderService } from '../services/order.service.js';
import { productService } from '../services/product.service.js';
import { voucherService } from '../services/voucher.service.js';

export const orderController = {
  optionOrder: (params) => {
    const { _limit = 10, _page = 1, q, populate, ...rest } = params;

    let populateDefault = [
      { path: 'products.productId', select: '_id nameProduct desc images' },
      { path: 'userId', select: '_id email' },
    ];
    if (populate) {
      if (Array.isArray(populate)) {
        populateDefault = [...populateDefault, ...populate];
      } else {
        populateDefault.push(populate);
      }
    }
    let query = {};
    if (q) {
      query = {
        $and: [
          {
            $or: [{ nameProduct: { $regex: new RegExp(q), $options: 'i' } }],
          },
        ],
      };
    }
    // filter status
    if (rest.status) {
      query = {
        ...query,
        status: rest.status,
      };
    }

    const option = {
      limit: parseInt(_limit),
      page: parseInt(_page),
      populate: populateDefault,
    };
    return { option, query };
  },

  // create order
  createOrder: async (req, res) => {
    const { _id } = req.user;

    // check userId có trùng nhau hay không
    if (_id !== req.body.userId) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'Unauthorized!', success: false });
    }

    if (req.body.voucher) {
      // check voucher is existing
      const voucher = await voucherService.getVoucherById(req.body.voucher);
      if (!voucher) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Voucher is not existing!', success: false });
      }

      // check voucher is expired
      const now = dayjs();
      if (now.isAfter(voucher.endDate)) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Voucher is expired!', success: false });
      }

      // check voucher discount
      if (voucher.discount <= 0) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Voucher discount is invalid!', success: false });
      }

      // decrease voucher quantity
      const updateVoucher = await voucherService.updateVoucher(req.body.voucher, { discount: voucher.discount - 1 });

      if (!updateVoucher) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Voucher is invalid!', success: false });
      }
    }

    // thêm mới đơn hàng
    const newOrder = await orderService.createOrder(req.body);

    if (!newOrder) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create category faild!', success: false });
    }

    // check voucher

    // trừ đi số lượng sản phẩm trong kho
    newOrder.products.forEach(async (product) => {
      // lấy ra thông tin sản phẩm theo productId
      const productInfo = await productService.getProductById(product.productId);
      // tìm ra size và màu của sản phẩm đó và trừ đi số lượng sản phẩm
      const productSize = productInfo.sizes.find((size) => size.size === product.size && size.color === product.color);
      if (productSize) {
        const newQuantity = productSize.quantity - product.quantity;
        // cập nhật lại số lượng sản phẩm
        const result = await productService.updateProduct(product.productId, productSize._id, newQuantity);
        if (!result) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Đặt hàng thất bại!', success: false });
        }
      }
    });

    return res.status(HTTP_STATUS.CREATED).json({ message: 'Create category success!', success: true });
  },

  // get order by id
  getOrdersByUserId: async (req, res) => {
    const { _id } = req.user;
    // const { userId } = req.params;

    // check userId có trùng nhau hay không
    // if (_id !== userId) {
    //   return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'No Permission!', success: false });
    // }

    // lấy danh sách đơn hàng theo userId
    const orders = await orderService.getOrdersByUserId(_id);

    if (!orders) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Order not found!', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Get order success!', success: true, data: orders });
  },

  // get all orders
  getAllOrders: async (req, res) => {
    const { _limit = 10, _page = 1, q, status } = req.query;
    const { option, query } = orderController.optionOrder({
      _limit,
      _page,
      q,
      status,
    });

    const orders = await orderService.getAllOrders(query, option);

    if (!orders) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Order not found!', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Get order success!', success: true, ...orders });
  },

  // get order by email
  getOrderByEmail: async (req, res) => {
    const { email } = req.query;

    const order = await orderService.getOrderByEmail(email);

    if (!order) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Order not found!', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Get order success!', success: true, ...order });
  },

  // check status
  checkStatus: (previousStatus, currentStatus) => {
    switch (currentStatus) {
      case 'confirmed':
        if (previousStatus === 'pending') {
          return true;
        }
        return false;
      case 'delivery':
        if (previousStatus === 'confirmed') {
          return true;
        }
        return false;
      case 'completed':
        if (previousStatus === 'delivery') {
          return true;
        }
        return false;
      case 'cancelled':
        if (previousStatus === 'pending' || previousStatus === 'confirmed') {
          return true;
        }
        return false;
      default:
        return false;
    }
  },

  // update status order
  updateOrder: async (req, res) => {
    const { _id } = req.user;
    const { orderId } = req.params;
    const { status, message } = req.body;

    // lấy ra thông tin đơn hàng từ orderId
    const order = await orderService.getOrderById(orderId);

    // check xem có trường assignee ko
    if (!order.assignee && order.status === 'pending') {
      // gán _id của user hiện tại vào trường assignee và cập nhật trạng thái đơn hàng
      const updateOrder = await orderService.updateOrder({ _id: orderId }, { assignee: _id, status });
      if (!updateOrder) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update order failed!', success: false });
      }
      return res.status(HTTP_STATUS.OK).json({ message: 'Update order success!', success: true });
    }

    // check xem có phải là người được gán đơn hàng không
    if (order.assignee._id.toString() !== _id) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({ message: 'No permission!', success: false });
    }

    // check xem trạng thái đơn hàng có hợp lệ không
    const checkStatusInvalid = orderController.checkStatus(order.status, status);
    if (!checkStatusInvalid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Trạng thái đơn hàng không hợp lệ!', success: false });
    }

    if (status === 'cancelled' && (!message || message.trim() === '')) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Vui lòng nhập lý do hủy đơn hàng!', success: false });
    }

    if (status === 'cancelled' && message.trim() !== '') {
      // cập nhật trạng thái đơn hàng và lý do hủy đơn hàng
      const updateOrder = await orderService.updateOrder({ _id: orderId }, { status, reasonCancel: message });
      if (!updateOrder) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Cập nhật đơn hàng thất bại!', success: false });
      }
      return res.status(HTTP_STATUS.OK).json({ message: 'Cập nhật đơn hàng thành công!', success: true });
    }

    // cập nhật trạng thái đơn hàng
    const updateOrder = await orderService.updateOrder({ _id: orderId }, { status, reasonCancel: '' });
    if (!updateOrder) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Cập nhật đơn hàng thất bại!', success: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Cập nhật đơn hàng thành công!', success: true });
  },

  // get order by day
  getOrderByDay: async (req, res) => {
    const { startDate, endDate } = req.query;

    const startDateF = dayjs(startDate).toDate();
    const endDateF = dayjs(endDate).toDate();

    const order = await orderService.getOrderByDay(startDateF, endDateF);

    if (!order) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Order not found!', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Get order success!', success: true, ...order });
  },

  // cancel order
  cancelOrder: async (req, res) => {
    const { role } = req.user;
    const { orderId } = req.params;
    const { message, status } = req.body;

    // lấy ra thông tin đơn hàng theo orderId
    const order = await orderService.getOrderById(orderId);
    // check role xem là admin hay user
    if (role === 'customer') {
      // check xem userId có trùng nhau không
      if (order.userId._id.toString() !== req.user._id) {
        return res
          .status(HTTP_STATUS.FORBIDDEN)
          .json({ message: 'Bạn không có quyền hủy đơn hàng này!', success: false });
      }

      // check status === pending
      if (order.status !== 'pending') {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Không thể hủy đơn hàng!', success: false });
      }

      // cập nhật trạng thái đơn hàng và lý do hủy đơn hàng
      if (status !== 'cancelled' || !message || (message && message.trim() === '')) {
        return res
          .status(HTTP_STATUS.BAD_REQUEST)
          .json({ message: 'Vui lòng nhập lý do hủy đơn hàng!', success: false });
      }

      if (status === 'cancelled' && message.trim() !== '') {
        const updateOrder = await orderService.updateOrder({ _id: orderId }, { status, reasonCancel: message });
        if (!updateOrder) {
          return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Hủy đơn hàng thất bại!', success: false });
        }

        // cập nhật lại số lượng sản phẩm trong kho
        order.products.forEach(async (product) => {
          const productInfo = await productService.getProductById(product.productId);
          const productSize = productInfo.sizes.find(
            (size) => size.size === product.size && size.color === product.color,
          );
          if (productSize) {
            const newQuantity = productSize.quantity + product.quantity;
            // cập nhật lại số lượng sản phẩm
            const result = await productService.updateQuantityProduct(product.productId, productSize._id, newQuantity);
            if (!result) {
              return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Huỷ đơn hàng thất bại!', success: false });
            }
          }
        });

        return res.status(HTTP_STATUS.OK).json({ message: 'Hủy đơn hàng thành công!', success: true });
      }
    } else {
      // check role là customer
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Khong phai customers', success: false });
    }
  },
};
