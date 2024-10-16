import Voucher from '../models/voucher.model.js';

export const voucherService = {
  // create
  createVoucher: async (body) => {
    return await Voucher.create(body);
  },

  // update
  updateVoucher: async (id, body) => {
    return await Voucher.findByIdAndUpdate({ _id: id }, body, { new: true });
  },

  // find voucher by id
  getVoucherById: async (id) => {
    return await Voucher.findById(id);
  },

  // get all voucher
  getAllVouchers: async (query) => {
    return await Voucher.find(query);
  },
};
