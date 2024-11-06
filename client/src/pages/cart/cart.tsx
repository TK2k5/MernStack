/* eslint-disable @typescript-eslint/no-unused-vars */

import { Cart as CartType, TUpdateQuantityInCart } from "@/types/cart.type";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { addToListCheckout } from "@/stores/features/cart/cart-slice";
import { cartApi } from "@/api/cart.api";
import { formatCurrency } from "@/utils/format-currency.util";
import { omit } from "lodash";
import path from "@/configs/path.config";
import { toast } from "sonner";
import { useAppDispatch } from "@/stores/hooks";
import { userApi } from "@/api/user.api";

type CartItem = CartType & { checked: boolean };

const Cart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getProfile(),
  });
  const myInfo = data?.data;

  // get all cars
  const { data: responseCarts } = useQuery({
    queryKey: ["carts"],
    queryFn: () => cartApi.getAllCarts(),
  });
  const total = responseCarts?.data?.total;
  const carts = responseCarts?.data?.carts;

  const [cartItems, setCartItems] = useState<CartItem[] | undefined>([]);

  // lấy ra những sản phẩm có checked là true
  const checkedPurchases = useMemo(
    () => cartItems?.filter((cart) => cart.checked),
    [cartItems]
  );

  // tính tổng tiền các sản phẩm có checked là true
  const totalCheckedPurchase = useMemo(() => {
    const totalProductChecked = checkedPurchases?.reduce((total, purchase) => {
      return total + purchase.quantity * purchase.productId.price;
    }, 0);
    return totalProductChecked;
  }, [checkedPurchases]);

  const updateQuatityMutation = useMutation({
    mutationKey: ["update-quantity"],
    mutationFn: (
      body: TUpdateQuantityInCart & { status: "increase" | "decrease" }
    ) =>
      cartApi.updateQuantityInCart(omit(body, ["status"]), {
        status: body.status,
      }),
  });

  const handleUpdateQuantity = (
    productId: string,
    productIdInCart: string,
    type: "increase" | "decrease"
  ) => {
    if (!myInfo) return;
    const body: TUpdateQuantityInCart & { status: "increase" | "decrease" } = {
      userId: myInfo._id,
      productId,
      productIdInCart,
      status: type,
    };
    updateQuatityMutation.mutate(body, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["carts"] });
        toast.success(body.status === "increase" ? "Increase" : "Decrease");
      },
    });
  };

  const handleCheckedChange = (value: boolean, productId: string) => {
    const newCarts = cartItems?.map((cart) => {
      if (cart._id === productId) {
        return { ...cart, checked: value };
      }
      return cart;
    });
    setCartItems(newCarts);
  };
  /* ------------------------------------------------------------- */

  /*
  công dụng reduce
  1. tính tổng(tổng số, tổng giá trị ....)
  2. chuyển mảng thành một đối tượng
  3. thực hiện các phép tính toán phức tạp
  */

  /*
  cú pháp của reduce
  array.reduce((accumulator, currentValue, currentIndex, array) => {}, initialValue)
  1. accumulator: giá trị tích lũy (gía trị mà bạn muốn tính toán qua từng vòng lặp). Nó bắt đầu từ
  initialValue và được cập nhật sau mỗi lần lặp
  2. currentValue: giá trị của phần tử hiện tại trong mảng sau mỗi lần lặp
  3. currentIndex: chỉ số của phần tử hiện tại trong mảng
  4. array: mảng được duyệt
  */

  /*
  const numbers = [1, 2, 3, 4, 5];

  // let sum = 0; // initialValue
  // for (let i = 0; i < numbers.length; i++) {
  // 	sum += numbers[i]; // accumulator
  // 	// numbers[i] // currentValue
  // 	// i // currentIndex
  // 	// numbers // array
  // }

  // console.log(sum);

  /*
  const total1 = numbers.reduce((accumulator, currentValue) => {
    // vòng lặp 1: accumulator = 0, currentValue = 1 => return 0 + 1 = 1
    // vòng lặp 2: accumulator = 1, currentValue = 2 => return 1 + 2 = 3
    // vòng lặp 3: accumulator = 3, currentValue = 3 => return 3 + 3 = 6
    // vòng lặp 4: accumulator = 6, currentValue = 4 => return 6 + 4 = 10
    // vòng lặp 5: accumulator = 10, currentValue = 5 => return 10 + 5 = 15
    return accumulator + currentValue;
  }, 0);

  /*
  // chuyển mảng thành một đối tượng với các key là id và value là {id: number, name: string}
  const users = [
    { id: 1, name: "A" },
    { id: 2, name: "B" },
    { id: 3, name: "C" },
  ];

  /*
  const resultUsers = users.reduce((accumulator, user) => {
    accumulator[user.id] = user;
    return accumulator;
    // accumulator: là đổi tượng mình xây dựng trong quá trình lặp
    // user.id: mỗi đối tượng user có thuộc tính id, và ta sử dụng id làm key trong obj
    // accumulator[user.id] = user; => trở thành accumulator[1] = {id: 1, name: "A"} => {1: {id: 1, name: 'A}}
    // accumulator[user.id] = user; => trở thành accumulator[2] = {id: 2, name: "B"} => {{1: {id: 1, name: 'A}}, 2: {id: 2, name: 'B'}}
    // accumulator[user.id] = user; => trở thành accumulator[3] = {id: 3, name: "C"} => {{1: {id: 1, name: 'A}, 2: {id: 2, name: 'B'}, 3: {id: 3, name: 'C'}}
  }, {});
  console.log("🚀 ~ resultUsers ~ resultUsers:", resultUsers);

  /* ------------------------------------------------------------- */

  useEffect(() => {
    if (carts) {
      const purchases = carts.map((cart) => ({ ...cart, checked: false }));
      setCartItems(purchases);
    }
  }, [carts]);

  if (!cartItems || cartItems.length === 0)
    return <p>Giỏ hàng của bạn đang trống.</p>;

  const handleCheckout = () => {
    dispatch(addToListCheckout(cartItems));
    navigate(path.checkout);
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <nav className="py-2 bg-gray-100">
        <div className="container px-4 mx-auto">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to={path.home} className="hover:text-gray-900">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Giỏ hàng của bạn</span>
          </div>
        </div>
      </nav>

      {cartItems.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-2/3">
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center py-4 border-b">
                <div className="mr-4">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(value) => {
                      handleCheckedChange(value as boolean, item._id);
                    }}
                  />
                </div>
                <img
                  src={item?.productId?.images[0]?.url}
                  alt={item?.productId?.nameProduct}
                  className="object-cover w-20 h-20 rounded"
                />
                <div className="flex-grow ml-4">
                  <label
                    htmlFor={`terms-${item._id}`}
                    className="font-semibold"
                  >
                    {item?.productId?.nameProduct}
                  </label>
                  <p className="">Size: {item?.size}</p>
                  <div className="flex items-center gap-3">
                    <span className="">Color: </span>
                    <button
                      type="button"
                      className={"size-6 rounded-full border"}
                      style={{ backgroundColor: item.color }}
                    ></button>
                  </div>
                  <p className="text-gray-600">
                    {formatCurrency(item?.productId?.price)}đ
                  </p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    // onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label="Giảm số lượng"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item._id,
                        "decrease"
                      )
                    }
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  {/* <Input
										type="number"
										min="1"
										value={item.quantity}
										// onChange={(e) =>
										// 	updateQuantity(item.id, parseInt(e.target.value))
										// }
										className="w-16 mx-2 text-center"
									/> */}
                  <div className="w-16 mx-2 text-center">{item.quantity}</div>
                  <Button
                    variant="outline"
                    size="icon"
                    // onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label="Tăng số lượng"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId._id,
                        item._id,
                        "increase"
                      )
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:w-1/3">
            <div className="p-6 bg-gray-100 rounded-lg">
              <h2 className="mb-4 text-xl font-semibold">Tổng đơn hàng</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{total ? formatCurrency(total) : 0}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Giá ship:</span>
                  <span>10.000đ</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Tổng cộng:</span>
                  <span>{total ? formatCurrency(total + 10000) : 0}đ</span>
                </div>
              </div>
              <Button className="w-full mt-6" onClick={() => handleCheckout()}>
                Tiến hành thanh toán
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate(path.home)}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
