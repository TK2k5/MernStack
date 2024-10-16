import { HTTP_STATUS } from '../common/http-status.common.js';
import _ from 'lodash';
import { voucherService } from '../services/voucher.service.js';

export const voucherController = {
  // options voucher
  optionOrder: (params) => {
    const { q, ...rest } = params;

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
  // create voucher
  createVoucher: async (req, res) => {
    const voucher = await voucherService.createVoucher(req.body);

    if (!voucher) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Create voucher faild!', status: false });
    }

    return res.status(HTTP_STATUS.CREATED).json({
      message: 'Create voucher successfully!',
      status: true,
      data: voucher,
    });
  },

  // get all voucher
  getAllVouchers: async (req, res) => {
    const { status, is_deleted, q } = req.query;

    let query = {};

    if (status) {
      query = {
        ...query,
        status,
      };
    }

    if (is_deleted) {
      query = {
        ...query,
        is_deleted,
      };
    }

    const vouchers = await voucherService.getAllVouchers(query);
    if (!vouchers) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'No voucher found!', status: false });
    }

    const result = vouchers.map((item) => _.omit(item._doc, 'createdBy'));

    return res.status(HTTP_STATUS.OK).json({ message: 'Get all vouchers successfully!', status: true, data: result });
  },

  // update voucher
  updateVoucher: async (req, res) => {
    const { id } = req.params;
    const voucher = await voucherService.updateVoucher(id, req.body);

    if (!voucher) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Voucher not found!', status: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Update voucher successfully!', status: true, data: voucher });
  },

  // get voucher by id
  getVoucherById: async (req, res) => {
    const { id } = req.params;
    const voucher = await voucherService.getVoucherById(id);

    if (!voucher) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Voucher not found!', status: false });
    }
    return res.status(HTTP_STATUS.OK).json({ message: 'Get voucher successfully!', status: true, data: voucher });
  },

  // delete voucher
  deleteVoucher: async (req, res) => {
    const { id } = req.params;
    const voucher = await voucherService.updateVoucher(id, { is_deleted: true });

    if (!voucher) {
      return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Voucher not found!', status: false });
    }

    return res.status(HTTP_STATUS.OK).json({ message: 'Delete voucher successfully!', status: true, data: voucher });
  },
};
