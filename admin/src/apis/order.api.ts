import { TCancelOrder, TOrder, TOrderStatus } from '@/types/order.type'
import { TQueryParams, TResponse } from '@/types/common.type'

import api from './base-url.api'

export const orderApi = {
  // get orders
  getAllOrders: async (params: TQueryParams, token: string) => {
    const response = await api.get<TResponse<TOrder>>(`/orders`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },
  // update status order
  updateOrderStatus: async (idOrder: string, body: { status: TOrderStatus }, token: string) => {
    const response = await api.patch<{ message: string; success: boolean }>(`/order/${idOrder}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },
  // cancel order
  cancelOrder: async (orderId: string, body: TCancelOrder) => {
    const response = await api.patch<{ message: string; success: boolean }>(`/order/cancel/${orderId}`, body)
    return response.data
  }
}
