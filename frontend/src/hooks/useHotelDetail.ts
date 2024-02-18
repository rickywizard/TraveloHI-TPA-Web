import { useEffect, useState } from "react";
import { IHotel } from "../interfaces/hotel-interface";
import axios from "axios";

export const useHotelDetail = (id: string | undefined) => {
  const [hotel, setHotel] = useState<IHotel>();
  const [isLoading, setIsLoading] = useState<boolean>();

  const fetchHotelDetail = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_hotel_detail/${id}`,
      );

      if (response.status === 200) {
        setHotel(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log("Error fetching hotel detail", error);
      }
    }
  };

  useEffect(() => {
    fetchHotelDetail();
  }, []);

  return { hotel, isLoading };
};
