import path from '@/configs/path.config';
import RootLayout from '@/layouts/root-layout';
import ProductDetail from '@/pages/[productId]';
import Cart from '@/pages/cart';
import Checkout from '@/pages/checkout';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';
import { createBrowserRouter } from 'react-router-dom';

export const routes = createBrowserRouter([
	{
		path: path.home,
		element: (
			<RootLayout>
				<HomePage />
			</RootLayout>
		),
	},
	{
		path: path.productDetail,
		element: (
			<RootLayout>
				<ProductDetail />
			</RootLayout>
		),
	},
	{
		path: path.cart,
		element: (
			<RootLayout>
				<Cart />
			</RootLayout>
		),
	},
	{
		path: path.checkout,
		element: (
			<RootLayout>
				<Checkout />
			</RootLayout>
		),
	},
	{
		path: path.login,
		element: <LoginPage />,
	},
]);
