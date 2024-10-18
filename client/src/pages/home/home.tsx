import Aside from "./components/aside";
import Card from "./components/card";
import { productApi } from "@/api/product.api";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "@/hooks/useQueryParams";

const HomePage = () => {
  const params = useQueryParams();

  const { data } = useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      productApi.getProducts({ ...params, deleted: "false", status: "active" }),
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
          {!products || (products.length === 0 && <div>No Product</div>)}
        </div>
      </section>
    </main>
  );
};

export default HomePage;
