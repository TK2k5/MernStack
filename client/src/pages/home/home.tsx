import { productApi } from '@/api/product.api';
import { useQuery } from '@tanstack/react-query';
import Aside from './components/aside';
import Card from './components/card';

const HomePage = () => {
	const { data } = useQuery({
		queryKey: ['products'],
		queryFn: () =>
			productApi.getProducts({ deleted: 'false', status: 'active' }),
	});
	const products = data?.docs;

	return (
		<main className="container flex flex-grow px-4 py-8 mx-auto">
			<Aside />

			<section className="w-9/12">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4 lg:grid-cols-3">
					{products &&
						products.length > 0 &&
						products.map((product) => {
							return <Card key={product._id} product={product} />;
						})}
				</div>
			</section>
		</main>
	);
};

export default HomePage;
