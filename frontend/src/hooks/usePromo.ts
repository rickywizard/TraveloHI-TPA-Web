import { useEffect, useState } from "react";
import { IPromo } from "../interfaces/promo-interface";
import axios from "axios";

export const usePromo = () => {
  const [promos, setPromos] = useState<IPromo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchPromos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.01:8000/api/get_promos",
      );

      if (response.status === 200) {
        setPromos(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Error fetching promo", error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  return { promos, isLoading, setPromos };
};
