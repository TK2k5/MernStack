import { Link, createSearchParams } from "react-router-dom";

import { Slider } from "@/components/ui/slider";
import { brandApi } from "@/api/brand.api";
import { categoryApi } from "@/api/category.api";
import path from "@/configs/path.config";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "@/hooks/useQueryParams";
import { useState } from "react";

const Aside = () => {
  const params = useQueryParams();

  const [priceRange, setPriceRange] = useState([0, 1000]);

  // get all categories
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => categoryApi.getAllCategories({ status: "active" }),
  });
  const categories = data?.data;

  // get all brands
  const { data: responseBrands } = useQuery({
    queryKey: ["brands"],
    queryFn: () => brandApi.getAllBrands({ status: "active" }),
  });
  const brands = responseBrands?.data;

  return (
    <aside className="w-3/12 pr-8">
      <div className="space-y-6">
        <div>
          <h3 className="mb-2 text-lg font-semibold">Danh mục sản phẩm</h3>
          <ul className="space-y-2">
            {categories &&
              categories?.length > 0 &&
              categories.map((category) => {
                return (
                  <li key={category._id}>
                    <Link
                      to={{
                        pathname: path.home,
                        search: createSearchParams({
                          ...params,
                          category: category._id,
                        }).toString(),
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {category.nameCategory}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 text-lg font-semibold">Thương hiệu</h3>
          <ul className="space-y-2">
            {brands &&
              brands?.length > 0 &&
              brands.map((brand) => {
                return (
                  <li key={brand._id}>
                    <Link
                      to={{
                        pathname: path.home,
                        search: createSearchParams({
                          ...params,
                          brand: brand._id,
                        }).toString(),
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      {brand.nameBrand}
                    </Link>
                  </li>
                );
              })}
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
