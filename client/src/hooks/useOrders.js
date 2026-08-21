import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orderApi";

export default function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
}
