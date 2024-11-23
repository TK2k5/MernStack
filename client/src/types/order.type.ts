import { TProduct } from "./product.type";

export type TCreateOrder = {
  userId: string;
  status: "pending";
  note: string;
  paymentMethod: string;
  total: number;
  products: TProductRefCreateOrder[];
  infoOrderShipping: TInfoOrderShipping;
  priceShipping: number;
  voucher: string;
};

export type TProductRefCreateOrder = {
  productId: string;
  quantity: number;
  size: string;
  color: string;
  price: number;
};

export type TInfoOrderShipping = {
  name: string;
  phone: string;
  address: string;
  email: string;
};

export type TOrderStatus =
  | "pending"
  | "confirmed"
  | "delivery"
  | "completed"
  | "cancelled";
export type TOrderInfo = TInfoOrderShipping & { _id: string };

export type TOrderProduct = {
  productId: Pick<TProduct, "_id" | "nameProduct" | "desc" | "images">;
  quantity: number;
  size: string;
  color: string;
  price: number;
  _id: string;
};

export type TOrder = {
  _id: string;
  userId: {
    _id: string;
    email: string;
  };
  status: TOrderStatus;
  note: string;
  paymentMethod: string;
  total: number;
  products: TOrderProduct[];
  infoOrderShipping: TOrderInfo;
  priceShipping: number;
  reasonCancel: string;
  createdAt: string;
  updatedAt: string;
};

export type TOrderGroupByStatus = {
  status: TOrderStatus;
  children: TOrder[];
};

export type TCancelOrder = {
  status: "cancelled";
  message: string;
};
