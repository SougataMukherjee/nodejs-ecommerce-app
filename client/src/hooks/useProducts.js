import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";

const useProducts = (filters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: async () => {
      const response = await getProducts(filters);
      return response.data;
    },
  });
};

export default useProducts;