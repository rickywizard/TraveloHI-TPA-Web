import axios from "axios";
import { useEffect, useState } from "react";

interface ISearch {
  id: number;
  search_word: string;
}

interface SearchData {
  recent: ISearch[];
  popular: ISearch[];
}

export const useRecentSearch = () => {
  const [data, setData] = useState<SearchData>({
    recent: [],
    popular: [],
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRecent = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get_recent_search",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoading(false);
        setData((prevData) => ({
          ...prevData,
          recent: response.data,
        }));
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.error);
      }
    }
  };

  const fetchPopular = async () => {
    setIsLoading(true);

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/get_popular_search"
      );

      if (response.status === 200) {
        setIsLoading(false);
        setData((prevData) => ({
          ...prevData,
          popular: response.data,
        }));
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    fetchRecent();
    fetchPopular();
  }, []);

  return { data, isLoading };
};
