import { useEffect, useState } from "react";
import { IAirline } from "../interfaces/flight-interface";
import axios from "axios";

export const useAirline = () => {
  const [airlines, setAirlines] = useState<IAirline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/auth/get_airlines",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setAirlines(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log("Error fetching airlines", error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  return { airlines, isLoading, setAirlines };
}