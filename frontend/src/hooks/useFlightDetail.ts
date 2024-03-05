import { useEffect, useState } from "react";
import axios from "axios";
import { IFlight } from "../interfaces/flight-interface";

export const useFlightDetail = (id: string | undefined) => {
  const [flight, setFlight] = useState<IFlight>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const fetchFlightDetail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_flight_detail/${id}`,
      );

      if (response.status === 200) {
        setFlight(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log("Error fetching flight detail", error);
      }
    }
  };

  useEffect(() => {
    fetchFlightDetail();
  }, []);

  return { flight, isLoading, setIsLoading };
};
