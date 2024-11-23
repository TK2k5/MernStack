import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import OrderInfo, { getStatusColor } from "./components/order-info";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DialogViewOrder from "./components/dialog-view-order";
import { Loader } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { Separator } from "@/components/ui/separator";
import { TOrderGroupByStatus } from "@/types/order.type";
import { Textarea } from "@/components/ui/textarea";
import _ from "lodash";
import { formatCurrency } from "@/utils/format-currency.util";
import { formatDate } from "@/utils/format-date";
import { orderApi } from "@/api/order.api";
import { useQuery } from "@tanstack/react-query";

const OrderStatus = () => {
  const [orderGroupByStatus, setOrderGroupByStatus] = useState<
    TOrderGroupByStatus[]
  >([]);
  console.log("🚀 ~ OrderStatus ~ orderGroupByStatus:", orderGroupByStatus);

  const { data, isLoading } = useQuery({
    queryKey: ["order-info"],
    queryFn: () => orderApi.getOrder(),
  });
  const orders = data?.data;

  useEffect(() => {
    if (!orders) return;
    const result = _.groupBy(orders, "status");
    const orderGroupByStatus = Object.entries(result).map(([key, value]) => {
      return {
        status: key,
        children: _.reverse(value),
      };
    });
    setOrderGroupByStatus(orderGroupByStatus as TOrderGroupByStatus[]);
  }, [orders]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container p-4 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Quản lý trạng thái đơn hàng</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {orderGroupByStatus &&
          orderGroupByStatus.length > 0 &&
          orderGroupByStatus.map((orderGroupByStatu: TOrderGroupByStatus) => {
            const order = orderGroupByStatu.children[0];
            return <OrderInfo order={order} key={order._id} />;
          })}
      </div>

      <Separator className="my-6" />

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chi tiết đơn hàng gần đây</CardTitle>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn hàng</TableHead>
                <TableHead>Ngày đặt hàng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead className="text-center">Số lượng sản phẩm</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders &&
                orders.length > 0 &&
                orders.map((order) => {
                  const { color, title } = getStatusColor(order.status);
                  return (
                    <TableRow key={order._id}>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant={"ghost"}>#{order._id}</Button>
                          </DialogTrigger>

                          <DialogViewOrder order={order} />
                        </Dialog>
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt, {
                          format: "DD/MM/YYYY HH:mm",
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge className={color}>{title}</Badge>
                      </TableCell>
                      <TableCell>
                        {formatCurrency(Number(order.total))}
                      </TableCell>
                      <TableCell className="text-center">
                        {order.products.length}
                      </TableCell>
                      {order.status === "pending" && (
                        <TableCell>
                          <Popover>
                            <PopoverTrigger>
                              <Button>Huỷ đơn hàng</Button>
                            </PopoverTrigger>
                            <PopoverContent side="top">
                              <div className="">
                                <p className="mb-4 text-base font-medium text-center">
                                  Bạn có muốn huỷ đơn hàng?
                                </p>

                                <div className="flex items-center justify-center space-x-3">
                                  <PopoverClose>
                                    <Button variant={"outline"}>Huỷ</Button>
                                  </PopoverClose>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button>Xác nhận</Button>
                                    </DialogTrigger>

                                    <DialogContent className="[&>button]:hidden">
                                      <p className="text-base font-medium">
                                        Lý do huỷ đơn
                                      </p>

                                      <Textarea placeholder="Lý do huỷ đơn"></Textarea>

                                      <div className="flex justify-end w-full">
                                        <Button className="w-full">Gửi</Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderStatus;

/*

[
	{
		status: "pending",
    children: [

    ]
	},
  {
    status: 'ship',
    children: []
  }
];
*/
