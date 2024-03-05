import { createContext, useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user-interface";
import { IChildren } from "../interfaces/children-interface";
import axios from "axios";
import { ILoginData } from "../pages/normalPages/LoginPage";
import { useNavigate } from "react-router-dom";
import { ILoginOTPData } from "../pages/normalPages/OTPLoginPage";

interface IUserContext {
  user: IUser | null;
  login: (loginData: ILoginData) => Promise<void>;
  loginOTP: (loginOTPData: ILoginOTPData) => Promise<void>;
  logout: () => Promise<void>;
  refetchUserData: () => Promise<void>;
  errorMessage: string | null;
  isLoading: boolean;
}

const context = createContext<IUserContext>({} as IUserContext);

export const useAuth = () => {
  return useContext(context);
};

export const AuthProvider = ({ children }: IChildren) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const USER_KEY = "USER_TRAVELOHI_DOT_COM";

  const [user, setUser] = useState<IUser | null>(
    localStorage.getItem(USER_KEY)
      ? (JSON.parse(localStorage.getItem(USER_KEY) as string) as IUser)
      : null
  );

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/user", {
        withCredentials: true,
      });

      // Simpan data user ke dalam state
      setUser(response.data);
      // Simpan data user ke dalam localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  useEffect(() => {
    // Cek jika user sudah login dan belum memiliki data user
    if (user && !user.id) {
      // Ambil data user setelah render komponen pertama kali
      fetchUserData();
    }
  }, [user]);

  const refetchUserData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/auth/user", {
        withCredentials: true,
      });

      // Simpan data user ke dalam state
      setUser(response.data);
      // Simpan data user ke dalam localStorage
      localStorage.setItem(USER_KEY, JSON.stringify(response.data));
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const login = async (loginData: ILoginData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        loginData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        fetchUserData();
        setIsLoading(false);
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        // console.log(error.response?.data.message);
        setErrorMessage(error.response?.data.error);
      }
    }
  };

  const loginOTP = async (loginOTPData: ILoginOTPData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/verify_otp`,
        loginOTPData,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        fetchUserData();
        setIsLoading(false);
        navigate("/");
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data.error);
      }
    }
  };

  const logout = async () => {
    setIsLoading(true)
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        null,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log("Logout failed: ", error);
    }

    setUser(null);
    localStorage.removeItem(USER_KEY);
  };

  const data = { user, errorMessage, login, loginOTP, logout, refetchUserData, isLoading };

  return <context.Provider value={data}>{children}</context.Provider>;
};
