import axios from "axios";
import { useEffect, useState } from "react";
import { ICart } from "../interfaces/cart-interface";

export const useCart = () => {
  const [carts, setCarts] = useState<ICart>({
    cart_total_price: 0,
    hotel_cart: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCarts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/get_cart", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setCarts(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  return { carts, isLoading, setCarts }
};
