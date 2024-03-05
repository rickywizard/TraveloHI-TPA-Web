import { useNavigate, useParams } from "react-router-dom";
import { useFlightDetail } from "../../hooks/useFlightDetail";
import LoadingPopup from "../../components/LoadingPopup";
import styled from "styled-components";
import { useEffect, useState } from "react";
import PriceDisplay from "../../components/PriceDisplay";
import { usePromo } from "../../hooks/usePromo";
import wallet from "../../assets/wallet-solid.svg";
import debt from "../../assets/tag-solid.svg";
import credit from "../../assets/credit-card-solid.svg";
import ticket from "../../assets/ticket-solid.svg";
import axios from "axios";
import PopMessage from "../../components/PopMessage";

interface PaymentData {
  flight_id: number;
  seats: number[];
  add_luggage: boolean;
  payment_method: string;
  promo_code: string;
}

const FlightDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const numericId: number = id !== undefined ? parseInt(id, 10) : 0;
  const { flight } = useFlightDetail(id);
  const { promos } = usePromo();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [showPayDropdown, setShowPayDropdown] = useState<boolean>(false);
  const [showPromoDropdown, setShowPromoDropdown] = useState<boolean>(false);

  const [formData, setFormData] = useState<PaymentData>({
    flight_id: numericId,
    seats: [],
    add_luggage: false,
    payment_method: "",
    promo_code: "",
  });

  function getFormattedTime(dateTimeString: string | undefined) {
    const dateTime = new Date(dateTimeString || "");
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  }

  const totalSeats = flight?.total_seat;
  const bookedSeats = flight?.booked_seats.map(
    (booking) => booking.seat_number
  );
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const handleSeatClick = (seatNumber: number) => {
    if (!bookedSeats?.includes(seatNumber)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.includes(seatNumber)
          ? prevSelectedSeats.filter(
              (selectedSeat) => selectedSeat !== seatNumber
            )
          : [...prevSelectedSeats, seatNumber]
      );

      setFormData((prevData) => ({
        ...prevData,
        seats: prevData.seats.includes(seatNumber)
          ? prevData.seats.filter((selectedSeat) => selectedSeat !== seatNumber)
          : [...prevData.seats, seatNumber],
      }));
    }
  };

  const isSeatBooked = (seatNumber: number) =>
    bookedSeats?.includes(seatNumber);

  const calculateTotalPrice = () => {
    const selectedSeatCount = selectedSeats.length;
    const seatPrice = flight?.price || 0;
    const luggagePrice = formData.add_luggage ? 300000 : 0;
    let discount = 0;
    if (formData.promo_code) {
      const selectedPromo = promos.find((promo) => promo.code === formData.promo_code);

      if (selectedPromo) {
        discount = parseInt(selectedPromo.discount)
      }
    }
     
    return selectedSeatCount * seatPrice + luggagePrice - discount;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddCart = () => {

  };

  const handlePay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(formData);
    
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/add_flight_transaction",
        formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        // console.log(response.data.message);
        setIsLoading(false);
        setSuccess(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    if (success) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        navigate("/");
      }, 3000);

      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [success]);

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      {success && <PopMessage type="success" text={success} />}
      {error && <PopMessage type="error" text={error} />}
      <FlightDetailContainer>
        <SeatMapContainer>
          {[...Array(totalSeats)].map((_, index) => {
            const seatNumber = index + 1;

            return (
              <SeatLabel
                key={seatNumber}
                booked={isSeatBooked(seatNumber)}
                selected={selectedSeats.includes(seatNumber)}
              >
                <SeatCheckbox
                  type="checkbox"
                  checked={selectedSeats.includes(seatNumber)}
                  onChange={() => handleSeatClick(seatNumber)}
                  disabled={isSeatBooked(seatNumber)}
                />
                {seatNumber}
              </SeatLabel>
            );
          })}
        </SeatMapContainer>
        <FlightInfoContainer>
          <h2>{flight?.flight_number}</h2>
          <h4>{flight?.airline.name}</h4>
          <Timeline>
            <div>
              <p>{getFormattedTime(flight?.departure_datetime)}</p>
              <p>{flight?.departure_airport}</p>
            </div>
            <hr />
            {flight?.transits.map((transit, index) => (
              <Timeline key={index}>
                <div>
                  <p>{getFormattedTime(transit.arrival_transit_time)}</p>
                  <p>{transit.transit_airport}</p>
                </div>
                <hr />
              </Timeline>
            ))}
            <div>
              <p>{getFormattedTime(flight?.arrival_datetime)}</p>
              <p>{flight?.arrival_airport}</p>
            </div>
          </Timeline>
          <CheckboxContainer>
            <input
              type="checkbox"
              name="add_luggage"
              onChange={handleInputChange}
            />
            <p>Tambah bagasi 20 kilogram</p>
          </CheckboxContainer>
          <Others>
            {/* payment method */}
            <div>
              <p className="label">Pilih Metode Pembayaran</p>
              <Dropdown onClick={() => setShowPayDropdown(!showPayDropdown)}>
                <Menu>
                  <div className="flex" style={{ gap: "1rem" }}>
                    <img
                      src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/6/6c5690b014faad362b0d07ebe1e24fdf.svg"
                      alt=""
                    />
                    <p>
                      {!formData.payment_method
                        ? "Bayar"
                        : formData.payment_method}
                    </p>
                  </div>
                  <img
                    src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/a/abdf7b00a3ad782bbad1f00c298a3c30.svg"
                    alt="▼"
                  />
                </Menu>
                {showPayDropdown && (
                  <DropdownContent>
                    <p>
                      <b>Payment</b>
                    </p>

                    <p>From TraveLoHI</p>
                    <TravelohiPay>
                      <button
                        id="hi__wallet"
                        onClick={() =>
                          setFormData((prevData) => ({
                            ...prevData,
                            payment_method: "HI Wallet",
                          }))
                        }
                      >
                        HI Wallet
                      </button>
                      <button
                        id="credit__card"
                        onClick={() =>
                          setFormData((prevData) => ({
                            ...prevData,
                            payment_method: "Credit Card",
                          }))
                        }
                      >
                        Credit Card
                      </button>
                    </TravelohiPay>

                    <p>Another Method</p>
                    <TravelohiPay>
                      <button
                        id="hi__debt"
                        onClick={() =>
                          setFormData((prevData) => ({
                            ...prevData,
                            payment_method: "HI Debt",
                          }))
                        }
                      >
                        HI Debt
                      </button>
                    </TravelohiPay>
                  </DropdownContent>
                )}
              </Dropdown>
            </div>
            {/* promo */}
            <div>
              <p className="label">Pilih Promo</p>
              <Dropdown
                onClick={() => setShowPromoDropdown(!showPromoDropdown)}
              >
                <Menu>
                  <div className="flex" style={{ gap: "1rem" }}>
                    <img src={ticket} alt="" width="16px" />
                    <p>
                      {!formData.promo_code ? "Promo" : formData.promo_code}
                    </p>
                  </div>
                  <img
                    src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/a/abdf7b00a3ad782bbad1f00c298a3c30.svg"
                    alt="▼"
                  />
                </Menu>
                {showPromoDropdown && (
                  <DropdownContent>
                    {promos.map((promo, index) => (
                      <Promo
                        key={index}
                        onClick={() =>
                          setFormData((prevData) => ({
                            ...prevData,
                            promo_code: promo.code,
                          }))
                        }
                      >
                        {promo.code} - {promo.name}
                      </Promo>
                    ))}
                  </DropdownContent>
                )}
              </Dropdown>
            </div>
          </Others>
          <TotalPrice>
            <p>Total Pembayaran</p>
            <PriceDisplay price={calculateTotalPrice()} />
          </TotalPrice>
          <PaymentButtonContainer>
            <AddCartButton onClick={handleAddCart}>Tambah Keranjang</AddCartButton>
            <CancelButton onClick={() => navigate(-1)}>
              Gak Jadi Booking
            </CancelButton>
            <PayButton onClick={handlePay}>Bayar Sekarang</PayButton>
          </PaymentButtonContainer>
        </FlightInfoContainer>
      </FlightDetailContainer>
    </>
  );
};

const FlightDetailContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  flex-wrap: wrap;
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;

  & > p {
    color: var(--text);
    font-size: 0.875rem;
  }
`;

const PaymentButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  button {
    width: 100%;
  }
`;

const AddCartButton = styled.button`
  background-color: var(--blue);
  color: var(--white);
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.6rem 1rem;
  outline: 0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s background-color;

  &:hover {
    background-color: var(--blue-shade);
  }
`;

const CancelButton = styled.button`
  background-color: var(--white);
  color: var(--orange);
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.6rem 1rem;
  border: 1px solid var(--orange);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    color: var(--white);
    background-color: var(--orange-shade);
  }
`;

const PayButton = styled.button`
  background-color: var(--orange);
  color: var(--white);
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.6rem 1rem;
  border: 1px solid var(--orange);
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    color: var(--orange);
    background-color: var(--white);
  }
`;

const Others = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;

  div {
    width: 100%;
  }

  .label {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const Menu = styled.div`
  border: 1px solid var(--gray);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem;
  transition: 0.3s ease-in;

  span {
    color: var(--blue);
  }

  &:hover {
    background-color: var(--gray);
  }
`;

const DropdownContent = styled.div`
  width: inherit;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .currency {
    transition: 0.3s ease-in;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 0 0.5rem;
    gap: 0.5rem;
    cursor: pointer;
  }

  .currency:hover {
    background-color: var(--gray);
  }
`;

const TravelohiPay = styled.div`
  display: flex;
  justify-content: start;
  gap: 1rem;

  button {
    outline: 0;
    border: none;
    background-color: transparent;
    border-radius: 5px;
    transition: 0.3s ease-in;
    padding: 5px;
    cursor: pointer;
  }

  button::before {
    margin-right: 5px;
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
    display: inline-block;
    width: 20px;
  }

  button#hi__wallet::before {
    content: url(${wallet});
  }

  button#credit__card::before {
    content: url(${credit});
  }

  button#hi__debt::before {
    content: url(${debt});
  }

  button:hover {
    background-color: var(--gray);
  }
`;

const Promo = styled.p`
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s background-color;

  &:hover {
    background-color: var(--gray);
  }
`;

const TotalPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  p {
    font-size: 1.5rem;
    font-weight: bold;
  }

  p:nth-child(2) {
    font-size: 2rem;
    color: var(--orange-shade);
  }
`;

const SeatMapContainer = styled.div`
  // background: beige;
  width: 40%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 0.75rem;
`;

interface SeatLabelProps {
  booked: boolean | undefined;
  selected: boolean;
}

const SeatLabel = styled.label<SeatLabelProps>`
  width: 50px;
  height: 50px;
  background-color: ${(props) =>
    props.booked
      ? "var(--red)"
      : props.selected
      ? "var(--orange)"
      : "var(--blue)"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #fff;
  cursor: ${(props) => (props.booked ? "not-allowed" : "pointer")};
  user-select: none;
`;

const SeatCheckbox = styled.input`
  display: none;
`;

const FlightInfoContainer = styled.div`
  // background: aquamarine;
  width: 58%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
`;

const Timeline = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  p {
    font-size: 0.875rem;
  }

  div {
    text-align: center;
  }

  hr {
    width: 2rem;
    flex: 1;
    border: none;
    border-top: 1.25px solid var(--grey);
  }
`;

export default FlightDetailPage;
