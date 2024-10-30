import Order from '../models/order.model.js';
import Product from '../models/product.model.js';

export const orderService = {
  // create Order
  createOrder: async (body) => {
    return await Order.create(body);
  },

  // get Orders By User Id
  getOrdersByUserId: async (userId) => {
    return await Order.find({ userId }).populate([
      { path: 'products.productId', select: '_id nameProduct desc images category brand' },
      { path: 'userId', select: '_id email' },
      { path: 'assignee' },
    ]);
  },

  // get all orders
  getAllOrders: async (query, option) => {
    return await Order.paginate(query, option);
  },

  // get order by email
  getOrderByEmail: async (email) => {
    return await Order.find({ 'infoOrderShipping.email': email }).populate([
      { path: 'products.productId', select: '_id nameProduct desc images' },
      { path: 'userId', select: '_id email' },
    ]);
  },

  // get order by id
  getOrderById: async (orderId) => {
    return await Order.findById(orderId).populate([
      { path: 'products.productId', select: '_id nameProduct desc images' },
      { path: 'userId', select: '_id email' },
      { path: 'assignee', select: '_id email avatar role status' },
    ]);
  },

  // update status order
  updateOrder: async (_id, body) => {
    return await Order.findByIdAndUpdate(_id, body, { new: true });
  },

  // get order by day
  getOrderByDay: async (startDate, endDate) => {
    return await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });
  },

  // update quantity product when order
  updateQuantityProduct: async (productId, sizeId, quantity) => {
    return await Product.findOneAndUpdate(
      { _id: productId, 'sizes._id': sizeId },
      { $set: { 'sizes.$.quantity': quantity } },
      { new: true },
    );
  },
};
