import { useCurrency } from "../context/CurrencyContext";

interface IPriceDisplay {
  price: number
}

const PriceDisplay = ({ price }: IPriceDisplay) => {
  const { currency, exchangeRate } = useCurrency();
  const convertedPrice = price / exchangeRate;

  return (
    <p>
      {currency === "USD"
        ? `$${convertedPrice.toFixed(2)}`
        : `Rp ${convertedPrice.toFixed(0)}`}
    </p>
  );
};

export default PriceDisplay;
