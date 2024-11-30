import { TProduct } from './product.type'

export type TInfoOrderShipping = {
  name: string
  phone: string
  address: string
  email: string
}
export type TOrderStatus = 'pending' | 'confirmed' | 'delivery' | 'completed' | 'cancelled'
export type TOrderProduct = {
  productId: Pick<TProduct, '_id' | 'nameProduct' | 'desc' | 'images'>
  quantity: number
  size: string
  color: string
  price: number
  _id: string
}
export type TOrderInfo = TInfoOrderShipping & { _id: string }
export type TOrder = {
  _id: string
  userId: {
    _id: string
    email: string
  }
  status: TOrderStatus
  note: string
  paymentMethod: string
  total: number
  products: TOrderProduct[]
  infoOrderShipping: TOrderInfo
  priceShipping: number
  reasonCancel: string
  createdAt: string
  updatedAt: string
}

export type TCancelOrder = {
  status: 'cancelled'
  message: string
}
