import axios from "axios";
import { useEffect, useState } from "react";
import { IHotelTransaction } from "../interfaces/transaction-interface";

export const useHotelTransaction = () => {
  const [hotelTransactions, setHotelTransactions] = useState<
    IHotelTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHotelTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/auth/get_hotel_transactions",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setHotelTransactions(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log(
          "Error fetching hotel transactions",
          error.response?.data.error
        );
      }
    }
  };

  useEffect(() => {
    fetchHotelTransactions();
  }, []);

  return { hotelTransactions, isLoading, setHotelTransactions };
};
