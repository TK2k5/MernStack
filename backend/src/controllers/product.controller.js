import { addIdProductToBrand, checkIsExistBrand, deleteIdProductFromBrand } from '../services/brand.service.js';
import {
  addIdProductToCategory,
  checkIsExistCategory,
  deleteIdProductFromCategory,
} from '../services/category.service.js';
import { checkIsExistProduct, productService } from '../services/product.service.js';

import { HTTP_STATUS } from '../common/http-status.common.js';
import Product from '../models/product.model.js';
import mongoose from 'mongoose';

// option product
export const optionProduct = (params) => {
  const { _limit = 10, _page = 1, q, populate, rest } = params;

  const populateDefault = [
    { path: 'category', select: '_id nameCategory images desc' },
    { path: 'brand', select: '_id nameBrand images desc' },
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
  // filter deleted
  if (rest.deleted) {
    query = {
      ...query,
      is_deleted: rest.deleted === 'true' ? true : false,
    };
  }

  // filter category
  if (rest.category) {
    query = {
      ...query,
      category: rest.category,
    };
  }
  // filter brand
  if (rest.brand) {
    query = {
      ...query,
      brand: rest.brand,
    };
  }

  const options = {
    limit: parseInt(_limit),
    page: parseInt(_page),
    populate: populateDefault,
    sort: { createAt: -1 },
  };

  return { options, query };
};

// query product
// export const queryProduct = (params) => {
//   const { q } = params;

//   let query = {};
//   if (q) {
//     query = {
//       $and: [
//         {
//           $or: [
//             { nameProduct: { $regex: new RegExp(q), $options: 'i' } },
//             { image: { $regex: new RegExp(q), $options: 'i' } },
//           ],
//         },
//       ],
//     };
//   }
//   return query;
// };

// create Product
export const createProduct = async (req, res) => {
  const body = req.body;

  const newProduct = await productService.addProduct(body);
  if (!newProduct) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create Product faild!', success: false });
  }

  // Check id category
  const isExistCategory = await checkIsExistCategory(body);
  if (!isExistCategory) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Category not found!', success: false });
  }

  // Check id Brand
  const isExistBrand = await checkIsExistBrand(body);
  if (!isExistBrand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Brand not found!', success: false });
  }

  // Tiến hành thêm id product vào mảng productIds của category và brand
  const [category, brand] = await Promise.all([
    addIdProductToCategory(body, newProduct),
    addIdProductToBrand(body, newProduct),
  ]);

  if (!category) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Add product to category failed!', success: false });
  }

  if (!brand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Add product to brand failed!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Create Product success!', success: true, data: newProduct });
};

// get Products
export const getProducts = async (req, res) => {
  const { _page = 1, _limit = 10, q, ...rest } = req.query;
  const { options, query } = optionProduct({ _limit, _page, q, rest });

  // const result = queryProduct({
  //   q,
  // });

  const product = await productService.getAllProducts(query, options);

  if (!product) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get Products faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get Products success!', success: true, ...product });
};

// get category by id
export const getProductById = async (req, res) => {
  const { productId } = req.params;

  const result = await productService.getProductById(productId);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get cateogry faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get cateogry success!', success: true, data: result });
};

// update Product
export const updateProduct = async (req, res) => {
  const { productId } = req.params;
  const body = req.body;

  // Check id product có tồn tại ko
  const isExistProduct = await checkIsExistProduct(productId);
  if (!isExistProduct) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Product not found!', success: false });
  }

  // Check id category
  const isExistCategory = await checkIsExistCategory(isExistProduct);
  if (!isExistCategory) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Category not found!', success: false });
  }

  // Check id Brand
  const isExistBrand = await checkIsExistBrand(isExistProduct);
  if (!isExistBrand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Brand not found!', success: false });
  }

  // Xóa product id trong category
  // Tiến hành xóa id product ra khỏi mảng products của category
  const [category, brand] = await Promise.all([
    deleteIdProductFromCategory(isExistCategory, isExistProduct),
    deleteIdProductFromBrand(isExistBrand, isExistProduct),
  ]);

  if (!category || !brand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Delete product id failed!', success: false });
  }

  const result = await productService.updateProduct(productId, body);
  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update Product faild!', success: false });
  }

  // Checkcategory
  const isExistCategoryUpdate = await checkIsExistCategory(body);
  if (!isExistCategoryUpdate) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Category not found!', success: false });
  }

  // Tiến hành thêm id product vào mảng products của category và brand
  const [categoryUpdate, brandUpdate] = await Promise.all([
    addIdProductToCategory(body, result),
    addIdProductToBrand(body, result),
  ]);

  if (!categoryUpdate || !brandUpdate) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Add product failed!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Update Product success!', success: true, data: result });
};

// Delete product
export const deleteProduct = async (req, res) => {
  const { productId } = req.params;

  // Check id product có tồn tại ko
  const isExistProduct = await checkIsExistProduct(productId);
  if (!isExistProduct) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Product not found!', success: false });
  }

  // Check id category
  const isExistCategory = await checkIsExistCategory(isExistProduct);
  if (!isExistCategory) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Category not found!', success: false });
  }

  // Check id Brand
  const isExistBrand = await checkIsExistBrand(isExistProduct);
  if (!isExistBrand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Brand not found!', success: false });
  }

  // Xóa product id trong category
  // Tiến hành xóa id product ra khỏi mảng products của category
  const [category, brand] = await Promise.all([
    deleteIdProductFromCategory(isExistCategory, isExistProduct),
    deleteIdProductFromBrand(isExistBrand, isExistProduct),
  ]);

  if (!category || !brand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Delete product id failed!', success: false });
  }

  const product = await productService.deleteProduct(productId);

  if (!product) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Delete product failed!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Delete product successfully!', success: true, data: product });
};

// get product with status
export const getProductWithStatus = async (req, res) => {
  const { _page = 1, _limit = 10, q } = req.query;
  const { status, deleted } = req.params;
  const { options, query } = optionProduct({ _limit, _page, q, status, deleted });

  const product = await productService.getAllProducts(query, options);

  if (!product) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Get Products faild!', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Get Products success!', success: true, ...product });
};

// update status
export const updateStatus = async (req, res) => {
  const { productId } = req.params;
  const { is_deleted, status } = req.query;

  if (!is_deleted || !status) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update is_deleted and status failed', success: false });
  }

  const deleted = is_deleted === 'true' ? true : false;
  const statusProduct = status === 'active' ? 'active' : 'inactive';

  if (is_deleted) {
    const product = await productService.updateDeleted(productId, deleted);
    if (!product) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update is_deleted failed', success: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Update is_deleted successfully', success: true, data: product });
  }

  const product = await productService.updateStatus(productId, statusProduct);
  if (!product) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Update status failed', success: false });
  }

  return res.status(HTTP_STATUS.OK).json({ message: 'Update status successfully', success: true, data: product });
};

// delete mutiple
export const deleteMultiple = async (req, res) => {
  const { id: ids } = req.query;

  if (!ids || !ids.length) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
  }

  // check id product invalid
  const checkIds = ids.map((id) => {
    return mongoose.Types.ObjectId.isValid(id);
  });

  // include
  if (checkIds.includes(false)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
  }

  const result = await Product.deleteMany({ _id: { $in: ids } });
  if (!result) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'Delete multiple failed', success: false, status: HTTP_STATUS.BAD_REQUEST });
  }

  return res
    .status(HTTP_STATUS.OK)
    .json({ message: 'Delete multiple successfully', success: true, status: HTTP_STATUS.OK });
};

// update many
export const updateManyProduct = async (req, res) => {
  const { id: ids, deleted } = req.query;
  if (!ids || !ids.length) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
  }

  const idsArray = Array.isArray(ids) ? ids : [ids];

  // check id product invalid
  const checkIds = idsArray.map((id) => {
    return mongoose.Types.ObjectId.isValid(id);
  });
  // include
  if (checkIds.includes(false)) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Ids invalid', success: false });
  }

  // update many id field is_deleted = true
  const result = await Product.updateMany({ _id: { $in: idsArray } }, { is_deleted: deleted }, { new: true });

  if (!result) {
    return res
      .status(HTTP_STATUS.BAD_REQUEST)
      .json({ message: 'Update many failed', success: false, status: HTTP_STATUS.BAD_REQUEST });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: deleted ? 'Restore product success!' : 'Update many successfully',
    success: true,
    status: HTTP_STATUS.OK,
  });
};
