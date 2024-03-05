import { useEffect, useState } from "react";
import axios from "axios";
import { IFlight } from "../interfaces/flight-interface";

export const usePopularFlight = () => {
  const [popularFlights, setPopularFlights] = useState<IFlight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFlights = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get_popular_flights",
      );

      if (response.status === 200) {
        setPopularFlights(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log("Error fetching hotel", error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return { popularFlights, isLoading, setPopularFlights };
};
