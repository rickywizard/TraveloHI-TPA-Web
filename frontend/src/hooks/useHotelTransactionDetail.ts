import { useEffect, useState } from "react";
import axios from "axios";
import { IHotelTransaction } from "../interfaces/transaction-interface";

export const useHotelTransactionDetail = (id: string | undefined) => {
  const [transaction, setTransaction] = useState<IHotelTransaction>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const fetchTransactionDetail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/auth/get_hotel_transaction_detail/${id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setTransaction(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log("Error fetching transaction detail", error);
      }
    }
  };

  useEffect(() => {
    fetchTransactionDetail();
  }, []);

  return { transaction, isLoading };
};
