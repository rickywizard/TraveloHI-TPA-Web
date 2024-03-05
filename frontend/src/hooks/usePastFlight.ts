import axios from "axios";
import { useEffect, useState } from "react";
import { IFlightTransaction } from "../interfaces/transaction-interface";

export const usePastFlight = () => {
  const [pastFlight, setPastFlight] = useState<
    IFlightTransaction[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFlightTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/auth/get_past_flight",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setPastFlight(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log(
          "Error fetching flight transactions",
          error.response?.data.error
        );
      }
    }
  };

  useEffect(() => {
    fetchFlightTransactions();
  }, []);

  return { pastFlight, isLoading, setPastFlight };
};
