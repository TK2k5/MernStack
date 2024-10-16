import Brand from '../models/brand.model.js';

// create brand
export const createBrandService = async (body) => {
  const newBrand = await Brand.create(body);

  return newBrand;
};

// get all brand
export const getAllBrand = async () => {
  const brands = await Brand.find().populate([{ path: 'products', select: '-category -brand' }]);

  return brands;
};

// get one brand
export const getBrandByIdService = async (brandId) => {
  const brand = await Brand.findById({ _id: brandId });

  return brand;
};

// update brand
export const updateBrandService = async (brandId, body) => {
  const brand = await Brand.findByIdAndUpdate({ _id: brandId }, body, { new: true });

  return brand;
};

// Check id Brand is exist
export const checkIsExistBrand = async (body) => {
  const brand = await Brand.findById({
    _id: body.brand,
  });

  return brand;
};

// Thêm id product vào mảng products của category
export const addIdProductToBrand = async (body, product) => {
  const brand = await Brand.findByIdAndUpdate(
    { _id: body.brand },
    { $addToSet: { products: product._id } },
    { new: true },
  );

  return brand;
};

// Xóa id product khỏi mảng products của Brand
export const deleteIdProductFromBrand = async (isExistBrand, isExistProduct) => {
  const brand = await Brand.findByIdAndUpdate(
    { _id: isExistBrand.id },
    { $pull: { products: isExistProduct._id } },
    { new: true },
  );

  return brand;
};
