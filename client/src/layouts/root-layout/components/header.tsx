import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, ShoppingCart } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cartApi } from "@/api/cart.api";
import path from "@/configs/path.config";
import { removeAccessTokenFromLS } from "@/utils/auth.util";
import { useAuth } from "@/contexts/auth.context";
import { userApi } from "@/api/user.api";

const HeaderLayout = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => userApi.getProfile(),
    retry: false,
    enabled: isAuthenticated,
  });
  const myInfo = data?.data;
  // get all cars
  const { data: responseCarts } = useQuery({
    queryKey: ["carts"],
    queryFn: () => cartApi.getAllCarts(),
    enabled: isAuthenticated,
    retry: 2,
  });
  const carts = responseCarts?.data;

  // logout
  const handleLogout = () => {
    queryClient.removeQueries({ queryKey: ["carts"] });
    removeAccessTokenFromLS();
    setIsAuthenticated(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 right-0 left-0 z-50">
      <div className="container flex items-center justify-between px-4 py-4 mx-auto">
        <div className="flex items-center space-x-4">
          <Link to={path.home}>
            <h2>Logo</h2>
          </Link>
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-64 py-2 pl-10 pr-4 border rounded-full"
            />
            <Search className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link to={path.cart}>
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="w-6 h-6" />

              <div className="absolute size-5 rounded-full top-0 right-0 bg-blue-500 text-white flex items-center justify-center text-xs">
                {carts?.carts?.length ?? 0}
              </div>
            </Button>
          </Link>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="bg-transparent hover:bg-transparent"
                >
                  <img
                    className="rounded-full !h-8 !w-8"
                    src="https://picsum.photos/536/354"
                    alt="Avatar"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 bg-white border shadow-md"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col justify-start space-y-1">
                    <p className="text-sm font-medium leading-none text-left">
                      {myInfo?.email}
                    </p>
                    <p className="text-xs leading-none text-left text-muted-foreground">
                      {myInfo?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to={path.profile}>Hồ sơ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Button
                    variant={"ghost"}
                    className="justify-start w-full p-0 text-left h-fit hover:bg-transparent"
                    onClick={handleLogout}
                  >
                    Đăng xuất
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to={path.login} className="text-sm font-medium">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderLayout;
