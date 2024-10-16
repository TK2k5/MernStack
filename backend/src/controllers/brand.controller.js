import { createBrandService, getAllBrand, getBrandByIdService, updateBrandService } from '../services/brand.service.js';

import Brand from '../models/brand.model.js';
import { HTTP_STATUS } from '../common/http-status.common.js';

/* Create brand */
export const createBrand = async (req, res) => {
  const body = req.body;

  const newBrand = await createBrandService(body);

  if (!newBrand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Cannot create brand',
      success: false,
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: 'Create brand successfully',
    success: true,
    brand: newBrand,
  });
};

/* Get all brand */
export const getBrand = async (_, res) => {
  const result = await getAllBrand();

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Cannot get brand',
      success: false,
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: 'Get brand successfully',
    success: true,
    data: result,
  });
};

/* Delete brand */
export const deleteBrand = async (req, res) => {
  const id = req.params.brandId;

  const brand = await Brand.findByIdAndDelete(id);

  if (!brand) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Cannot delete brand',
      success: false,
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: 'Delete brand successfully',
    success: true,
    brand: brand,
  });
};

/* Get one brand */
export const getBrandById = async (req, res) => {
  const { brandId } = req.params;

  const result = await getBrandByIdService(brandId);

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Cannot get brand',
      success: false,
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: 'Get brand successfully',
    success: true,
    brand: result,
  });
};

/* Update brand */
export const updateBrand = async (req, res) => {
  const { brandId } = req.params;
  const body = req.body;

  const result = await updateBrandService(brandId, body);

  if (!result) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      message: 'Cannot update brand',
      success: false,
    });
  }

  return res.status(HTTP_STATUS.OK).json({
    message: 'Update brand successfully',
    success: true,
    brand: result,
  });
};
