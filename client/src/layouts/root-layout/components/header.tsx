import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, ShoppingCart } from 'lucide-react';

import { Button } from '@/components/ui/button';

const HeaderLayout = () => {
	return (
		<header className="bg-white shadow-md">
			<div className="container flex items-center justify-between px-4 py-4 mx-auto">
				<div className="flex items-center space-x-4">
					<h2>Logo</h2>
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
					<Button variant="ghost" size="icon">
						<ShoppingCart className="w-6 h-6" />
					</Button>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant={'ghost'}
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
										Người dùng
									</p>
									<p className="text-xs leading-none text-left text-muted-foreground">
										user@example.com
									</p>
								</div>
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Hồ sơ</DropdownMenuItem>
							<DropdownMenuItem>Đăng xuất</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
};

export default HeaderLayout;
