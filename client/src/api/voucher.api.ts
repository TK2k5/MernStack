import { TQueryParams, TResponseNoPagination } from "@/types/common.type";

import { TVoucher } from "@/types/voucher.type";
import http from "@/configs/instance.config";

export const voucherApi = {
  getVouchers: async (params: TQueryParams) => {
    const response = await http.get<TResponseNoPagination<TVoucher>>(
      "/voucher",
      { params }
    );
    return response.data;
  },
};
