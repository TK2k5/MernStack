import { Slider } from '@/components/ui/slider';
import { useState } from 'react';

const Aside = () => {
	const [priceRange, setPriceRange] = useState([0, 1000]);

	return (
		<aside className="w-3/12 pr-8">
			<div className="space-y-6">
				<div>
					<h3 className="mb-2 text-lg font-semibold">Danh mục sản phẩm</h3>
					<ul className="space-y-2">
						<li>
							<a href="#" className="text-blue-600 hover:underline">
								Điện thoại
							</a>
						</li>
						<li>
							<a href="#" className="text-blue-600 hover:underline">
								Laptop
							</a>
						</li>
						<li>
							<a href="#" className="text-blue-600 hover:underline">
								Máy tính bảng
							</a>
						</li>
						<li>
							<a href="#" className="text-blue-600 hover:underline">
								Phụ kiện
							</a>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="mb-2 text-lg font-semibold">Thương hiệu</h3>
					<ul className="space-y-2">
						<li>
							<label className="flex items-center">
								<input type="checkbox" className="mr-2" />
								Apple
							</label>
						</li>
						<li>
							<label className="flex items-center">
								<input type="checkbox" className="mr-2" />
								Samsung
							</label>
						</li>
						<li>
							<label className="flex items-center">
								<input type="checkbox" className="mr-2" />
								Xiaomi
							</label>
						</li>
						<li>
							<label className="flex items-center">
								<input type="checkbox" className="mr-2" />
								Oppo
							</label>
						</li>
					</ul>
				</div>
				<div>
					<h3 className="mb-2 text-lg font-semibold">Giá sản phẩm</h3>
					<Slider
						defaultValue={[0, 1000]}
						max={1000}
						step={1}
						value={priceRange}
						onValueChange={setPriceRange}
						className="mb-2"
					/>
					<div className="flex justify-between">
						<span>${priceRange[0]}</span>
						<span>${priceRange[1]}</span>
					</div>
				</div>
			</div>
		</aside>
	);
};

export default Aside;
