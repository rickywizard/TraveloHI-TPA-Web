import { createContext, useContext, useState } from "react";
import { IChildren } from "../interfaces/children-interface";

interface ICurrencyContext {
  currency: string;
  exchangeRate: number;
  setCurrency: (newCurrency: string) => void;
}

const CurrencyContext = createContext<ICurrencyContext>({} as ICurrencyContext)

export const useCurrency = () => {
  return useContext(CurrencyContext);
}

export const CurrencyProvider = ({ children }: IChildren ) => {
  const [currency, setCurrency] = useState<string>("IDR");
  const exchangeRate = currency === "USD" ? 15000 : 1;

  const contextValue: ICurrencyContext = {
    currency,
    exchangeRate,
    setCurrency,
  }

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  )
}
