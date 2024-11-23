import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CheckCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TOrder } from "@/types/order.type";
import { formatCurrency } from "@/utils/format-currency.util";
import { formatDate } from "@/utils/format-date";
import { getStatusColor } from "./order-info";
import { useMemo } from "react";

const DialogViewOrder = ({ order }: { order: TOrder }) => {
  console.log("🚀 ~ DialogViewOrder ~ order:", order);
  const products = order.products;

  const total = useMemo(() => {
    return products.reduce((acc, product) => {
      return acc + Number(product.price) * product.quantity;
    }, 0);
  }, [products]);
  return (
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Chi tiết đơn hàng #{order._id}</DialogTitle>
      </DialogHeader>

      <div className="">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="text-green-500 size-5" />
            <span className="font-semibold">
              {getStatusColor(order.status).title}
            </span>
          </div>

          <span className="text-sm text-muted-foreground">
            Ngày đặt hàng: {formatDate(order.createdAt)}
          </span>
        </div>

        <Separator className="my-4" />

        <h3 className="mb-2 font-semibold">Sản phẩm</h3>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên sản phẩm</TableHead>
              <TableHead>Màu sắc</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Giá</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products &&
              products.length > 0 &&
              products.map((product) => {
                return (
                  <TableRow key={product._id}>
                    <TableCell>{product.productId.nameProduct}</TableCell>
                    <TableCell>{product.color}</TableCell>
                    <TableCell>{product.quantity}</TableCell>
                    <TableCell>
                      {formatCurrency(Number(product.price))}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>

        <div className="flex justify-end mt-2">
          <span className="font-medium text-sm">
            Tổng tiền: {formatCurrency(Number(total))}
          </span>
        </div>

        <div className="flex justify-end mt-2">
          <span className="font-medium text-sm">
            Phí vận chuyển: {formatCurrency(Number(order.priceShipping))}
          </span>
        </div>

        <div className="flex justify-end mt-2">
          <span className="font-semibold">
            Tổng cộng: {formatCurrency(Number(order.total))}
          </span>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div className="">
            <h3 className="mb-2 font-semibold">Địa chỉ giao hàng</h3>
            <p className="text-sm">{order.infoOrderShipping.address}</p>
          </div>
          <div className="">
            <h3 className="mb-2 font-semibold">Phương thức thanh toán</h3>
            <p className="text-sm">{order.paymentMethod}</p>
          </div>
        </div>
      </div>
    </DialogContent>
  );
};

export default DialogViewOrder;
