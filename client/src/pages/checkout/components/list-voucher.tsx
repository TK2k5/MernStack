import { CalendarCheck2, TicketCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { TVoucher } from "@/types/voucher.type";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/format-currency.util";
import { useQuery } from "@tanstack/react-query";
import { voucherApi } from "@/api/voucher.api";

type ListVoucherProps = {
  onSelectedVoucher: (voucher: TVoucher) => void;
};

const ListVoucher = ({ onSelectedVoucher }: ListVoucherProps) => {
  // call api voucher
  const { data: responseVouchers } = useQuery({
    queryKey: ["voucher"],
    queryFn: () =>
      voucherApi.getVouchers({ status: "active", is_deleted: false }),
  });
  const vouchers = responseVouchers?.data;

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="mb-4 text-xl font-semibold">Mã giảm giá</h2>

      <div className="space-y-4 h-[380px] overflow-y-scroll scrollbar-hide">
        {vouchers &&
          vouchers.length > 0 &&
          vouchers.map((voucher) => {
            return (
              <Card
                className="cursor-pointer hover:shadow-md hover:bg-gray-100"
                key={voucher._id}
                onClick={() => onSelectedVoucher(voucher)}
              >
                <CardHeader className="pb-0 flex-row justify-between">
                  <CardTitle className="font-medium text-base">
                    {voucher.code}
                  </CardTitle>
                  <p className="flex items-center gap-2">
                    <TicketCheck /> {formatCurrency(voucher.voucherPrice)}đ
                  </p>
                </CardHeader>
                <CardContent className="pb-0 flex justify-between items-center">
                  <Button variant={"transparent"} className="px-0 gap-3">
                    <CalendarCheck2 />
                    {dayjs(voucher.startDate).format("DD/MM/YYYY")} -{" "}
                    {dayjs(voucher.endDate).format("DD/MM/YYYY")}
                  </Button>
                  <CardDescription>
                    <p>Quantity: {voucher.discount}</p>
                  </CardDescription>
                </CardContent>
                <CardContent>
                  <CardDescription>
                    <p className="text-xs line-clamp-2">{voucher.desc}</p>
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
};

export default ListVoucher;
