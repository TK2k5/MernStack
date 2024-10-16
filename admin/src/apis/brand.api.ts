import { TBrand } from '@/types/brand.type'
import { TResponseNoPagination } from '@/types/common.type'
import api from './base-url.api'

export const getBrands = async (token: string, query?: string): Promise<TResponseNoPagination<TBrand>> => {
  const response = await api.get<TResponseNoPagination<TBrand>>(`/brand${query ? query : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}
