import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronRight, CreditCard, ShoppingCart, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const ProductDetail = () => {
	const [mainImage, setMainImage] = useState('https://picsum.photos/536/354');
	const [selectedColor, setSelectedColor] = useState('black');
	const [selectedSize, setSelectedSize] = useState('m');

	const productImages = [
		'https://picsum.photos/536/354',
		'https://picsum.photos/536/354',
		'https://picsum.photos/536/354',
		'https://picsum.photos/536/354',
	];

	const colors = [
		{ name: 'Black', value: 'black' },
		{ name: 'White', value: 'white' },
		{ name: 'Blue', value: 'blue' },
	];

	const sizes = ['xs', 's', 'm', 'l', 'xl'];

	const relatedProducts = [
		{
			id: 1,
			name: 'Related Product 1',
			price: 89.99,
			image: '/placeholder.svg?height=200&width=200',
		},
		{
			id: 2,
			name: 'Related Product 2',
			price: 79.99,
			image: '/placeholder.svg?height=200&width=200',
		},
		{
			id: 3,
			name: 'Related Product 3',
			price: 99.99,
			image: '/placeholder.svg?height=200&width=200',
		},
		{
			id: 4,
			name: 'Related Product 4',
			price: 69.99,
			image: '/placeholder.svg?height=200&width=200',
		},
	];

	return (
		<div className="flex flex-col h-full">
			<nav className="py-2 bg-gray-100">
				<div className="container px-4 mx-auto">
					<div className="flex items-center space-x-2 text-sm text-gray-600">
						<a href="#" className="hover:text-gray-900">
							Home
						</a>
						<ChevronRight className="w-4 h-4" />
						<a href="#" className="hover:text-gray-900">
							Products
						</a>
						<ChevronRight className="w-4 h-4" />
						<span className="text-gray-900">Product Name</span>
					</div>
				</div>
			</nav>

			<main className="container flex-grow px-4 py-8 mx-auto">
				<div className="grid gap-8 mb-12 md:grid-cols-2">
					<div className="space-y-4">
						<img
							src={mainImage}
							alt="Product"
							className="w-full h-auto rounded-lg"
						/>
						<div className="flex space-x-2">
							{productImages.map((img, index) => (
								<button
									key={index}
									onClick={() => setMainImage(img)}
									className="focus:outline-none"
								>
									<img
										src={img}
										alt={`Product view ${index + 1}`}
										className="object-cover w-20 h-20 rounded-md"
									/>
								</button>
							))}
						</div>
					</div>
					<div className="space-y-6">
						<h1 className="text-3xl font-bold">Product Name</h1>
						<div className="flex items-center space-x-2">
							<div className="flex">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-5 h-5 text-yellow-400"
										fill={i < 4 ? 'currentColor' : 'none'}
									/>
								))}
							</div>
							<span className="text-gray-600">(120 reviews)</span>
						</div>
						<p className="text-2xl font-bold">$129.99</p>

						<div className="space-y-4">
							<div>
								<h3 className="mb-2 text-lg font-semibold">Color</h3>
								<RadioGroup
									value={selectedColor}
									onValueChange={setSelectedColor}
									className="flex space-x-2"
								>
									{colors.map((color) => (
										<div key={color.value}>
											<RadioGroupItem
												value={color.value}
												id={`color-${color.value}`}
												className="sr-only peer"
											/>
											<Label
												htmlFor={`color-${color.value}`}
												className="flex items-center justify-center w-8 h-8 bg-white border-2 border-gray-200 rounded-full cursor-pointer peer-checked:border-blue-500"
												style={{ backgroundColor: color.value }}
											>
												<span className="sr-only">{color.name}</span>
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>

							<div>
								<h3 className="mb-2 text-lg font-semibold">Size</h3>
								<RadioGroup
									value={selectedSize}
									onValueChange={setSelectedSize}
									className="flex space-x-2"
								>
									{sizes.map((size) => (
										<div key={size}>
											<RadioGroupItem
												value={size}
												id={`size-${size}`}
												className="sr-only peer"
											/>
											<Label
												htmlFor={`size-${size}`}
												className="flex items-center justify-center w-10 h-10 bg-white border-2 border-gray-200 rounded-md cursor-pointer peer-checked:border-blue-500 peer-checked:bg-blue-50"
											>
												{size.toUpperCase()}
											</Label>
										</div>
									))}
								</RadioGroup>
							</div>
						</div>

						<div className="flex space-x-4">
							<Button className="flex-1">
								<ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
							</Button>
							<Button variant="secondary" className="flex-1">
								<CreditCard className="w-4 h-4 mr-2" /> Buy Now
							</Button>
						</div>
					</div>
				</div>

				<Tabs defaultValue="description" className="mb-12">
					<TabsList>
						<TabsTrigger value="description">Description</TabsTrigger>
						<TabsTrigger value="specifications">Specifications</TabsTrigger>
						<TabsTrigger value="reviews">Reviews</TabsTrigger>
					</TabsList>
					<TabsContent value="description" className="mt-4">
						<p>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
							eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
							enim ad minim veniam, quis nostrud exercitation ullamco laboris
							nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
							reprehenderit in voluptate velit esse cillum dolore eu fugiat
							nulla pariatur.
						</p>
					</TabsContent>
					<TabsContent value="specifications" className="mt-4">
						<ul className="pl-5 space-y-2 list-disc">
							<li>Specification 1: Value</li>
							<li>Specification 2: Value</li>
							<li>Specification 3: Value</li>
							<li>Specification 4: Value</li>
						</ul>
					</TabsContent>
					<TabsContent value="reviews" className="mt-4">
						<p>Customer reviews will be displayed here.</p>
					</TabsContent>
				</Tabs>

				<section className="mb-12">
					<h2 className="mb-6 text-2xl font-bold">Related Products</h2>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
						{relatedProducts.map((product) => (
							<div key={product.id} className="p-4 border rounded-lg">
								<img
									src={'https://picsum.photos/536/354'}
									alt={product.name}
									className="object-cover w-full h-48 mb-4 rounded-md"
								/>
								<h3 className="font-semibold">{product.name}</h3>
								<p className="text-gray-600">${product.price.toFixed(2)}</p>
							</div>
						))}
					</div>
				</section>
			</main>
		</div>
	);
};

export default ProductDetail;
