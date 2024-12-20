import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Package } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DialogViewOrder from "./dialog-view-order";
import { Separator } from "@/components/ui/separator";
import { TOrder } from "@/types/order.type";
import { formatCurrency } from "@/utils/format-currency.util";
import { formatDate } from "@/utils/format-date";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return {
        title: "Đã giao hàng",
        color: "bg-green-500",
      };
    case "delivery":
      return {
        title: "Đang vận chuyển",
        color: "bg-blue-500",
      };
    case "confirmed":
      return {
        title: "Đã xác nhận",
        color: "bg-orange-500",
      };
    case "pending":
      return {
        title: "Đang xử lý",
        color: "bg-yellow-500",
      };
    case "cancelled":
      return {
        title: "Đã huỷ",
        color: "bg-red-500",
      };
    default:
      return {
        title: "",
        color: "bg-gray-500",
      };
  }
};

const OrderInfo = ({ order: orderInfo }: { order: TOrder }) => {
  const { color, title } = getStatusColor(orderInfo.status);
  const order = orderInfo;
  return (
    <Card key={order._id} className="w-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">
          Đơn hàng #{order._id}
        </CardTitle>
        <Badge className={color}>{title}</Badge>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(Number(order.total))}
        </div>
        <p className="text-xs text-muted-foreground">
          Ngày đặt hàng: {formatDate(order.createdAt)}
        </p>
      </CardContent>

      <div className="mt-auto">
        <Separator />

        <CardFooter className="flex justify-between mt-2 pb-2">
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Package className="size-4" />
            <span className="">{order.products.length} sản phẩm</span>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"ghost"} size={"sm"}>
                <Eye className="mr-2 size-4" />
                Xem chi tiết
              </Button>
            </DialogTrigger>

            <DialogViewOrder order={order} />
          </Dialog>
        </CardFooter>
      </div>
    </Card>
  );
};

export default OrderInfo;
