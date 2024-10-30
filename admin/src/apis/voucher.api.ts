import { TQueryParams, TResponseNoPagination } from '@/types/common.type'

import { TVoucher } from '@/types/voucher.type'
import api from './base-url.api'

export const voucherApi = {
  getVouchers: async (params: TQueryParams) => {
    const response = await api.get<TResponseNoPagination<TVoucher>>('/vouchers', {
      params
    })
    return response.data
  }
}
