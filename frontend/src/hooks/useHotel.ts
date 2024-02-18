import { useEffect, useState } from "react";
import axios from "axios";
import { IHotel } from "../interfaces/hotel-interface";

export const useHotel = () => {
  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get_hotels",
      );

      if (response.status === 200) {
        setHotels(response.data);
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
    fetchHotels();
  }, []);

  return { hotels, isLoading, setHotels };
};
