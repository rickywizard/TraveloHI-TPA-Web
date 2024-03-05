import { useEffect, useState } from "react";
import axios from "axios";
import { IHotel } from "../interfaces/hotel-interface";

export const usePopularHotel = () => {
  const [popularHotels, setPopularHotels] = useState<IHotel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchHotels = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get_popular_hotels",
      );

      if (response.status === 200) {
        setPopularHotels(response.data);
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

  return { popularHotels, isLoading, setPopularHotels };
};
