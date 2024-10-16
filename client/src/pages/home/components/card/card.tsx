import path from '@/configs/path.config';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Card = () => {
	return (
		<Link
			to={{
				pathname: `${path.product}/1`,
			}}
		>
			<div className="overflow-hidden bg-white rounded-lg shadow-md">
				<img
					src="https://picsum.photos/536/354"
					alt="Product"
					className="object-cover w-full h-48"
				/>
				<div className="p-4">
					<h3 className="mb-2 text-lg font-semibold">Tên sản phẩm</h3>
					<div className="flex items-center mb-2">
						<span className="mr-2 font-bold text-red-600">$99.99</span>
						<span className="text-sm text-gray-500 line-through">$129.99</span>
						<span className="ml-auto text-sm text-green-600">-23%</span>
					</div>
					<div className="flex items-center">
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
						<Star className="w-4 h-4 text-yellow-400" />
						<span className="ml-1 text-sm text-gray-500">(4.0)</span>
					</div>
				</div>
			</div>
		</Link>
	);
};

export default Card;
