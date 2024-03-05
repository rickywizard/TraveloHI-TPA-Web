import { useEffect, useState } from "react";
import axios from "axios";
import { IFlight } from "../interfaces/flight-interface";

export const useFlight = () => {
  const [flights, setFlights] = useState<IFlight[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFlights = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get_flights",
      );

      if (response.status === 200) {
        setFlights(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log("Error fetching flights", error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  return { flights, isLoading, setFlights };
};
