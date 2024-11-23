import { TCreateOrder, TOrder } from "@/types/order.type";

import { TResponseNoPagination } from "@/types/common.type";
import http from "@/configs/instance.config";

export const orderApi = {
  // create order
  createOrder: async (body: TCreateOrder) => {
    const response = await http.post<{ message: string; success: boolean }>(
      `/order`,
      body
    );
    return response.data;
  },
  // get orders by userId
  getOrder: async () => {
    const response = await http.get<TResponseNoPagination<TOrder>>(`/order`);
    return response.data;
  },
};
