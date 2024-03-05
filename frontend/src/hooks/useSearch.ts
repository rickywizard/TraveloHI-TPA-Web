import { useEffect, useState } from "react";
import { IHotel } from "../interfaces/hotel-interface";
import { IFlight } from "../interfaces/flight-interface";
import axios from "axios";

interface ISearch {
  hotels: IHotel[];
  flights: IFlight[];
}

export const useSearch = (searchTerm: string | null) => {
  const [searchResults, setSearchResults] = useState<ISearch>({
    hotels: [],
    flights: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchSearchResult = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/search?term=${searchTerm}`
      );

      if (response.status === 200) {
        setIsLoading(false)
        setSearchResults({
          hotels: response.data.hotels,
          flights: response.data.flights
        })
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log("Search error", error);
      }
    }
  };

  useEffect(() => {
    fetchSearchResult();
  }, [searchTerm]);

  return { searchResults, isLoading };
};
