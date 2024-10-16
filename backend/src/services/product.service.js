import Product from '../models/product.model.js';

export const productService = {
  // create brand
  addProduct: async (body) => {
    return await Product.create(body);
  },

  // get all Product
  getAllProducts: async (query, options) => {
    return await Product.paginate(query, options);
  },

  // update Product
  updateProduct: async (id, body) => {
    return await Product.findByIdAndUpdate({ _id: id }, body, { new: true });
  },

  // delete product
  deleteProduct: async (id) => {
    return await Product.findByIdAndDelete(id);
  },

  // get Product by id
  getProductById: async (id) => {
    return await Product.findById({ _id: id }).populate([
      { path: 'category', select: '_id nameCategory images desc' },
      { path: 'brand', select: '_id nameBrand images desc' },
    ]);
  },

  // update status
  updateStatus: async (productId, status) => {
    return await Product.findByIdAndUpdate({ _id: productId }, { status }, { new: true });
  },
  // update is_deleted
  updateDeleted: async (productId, is_deleted) => {
    return await Product.findByIdAndUpdate({ _id: productId }, { is_deleted }, { new: true });
  },
};

// check product is exist
export const checkIsExistProduct = async (id) => {
  const product = await Product.findById({ _id: id });

  return product;
};
