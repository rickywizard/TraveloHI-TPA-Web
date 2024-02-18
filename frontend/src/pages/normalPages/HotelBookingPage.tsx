import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IFacility } from "../../interfaces/hotel-interface";
import { useEffect, useState } from "react";
import wallet from "../../assets/wallet-solid.svg";
import debt from "../../assets/tag-solid.svg";
import credit from "../../assets/credit-card-solid.svg";
import ticket from "../../assets/ticket-solid.svg";
import { usePromo } from "../../hooks/usePromo";
import axios from "axios";
import LoadingPopup from "../../components/LoadingPopup";
import PopMessage from "../../components/PopMessage";
import RoomImageGrid from "../../components/RoomImageGrid";
import { useHotelTransactionDetail } from "../../hooks/useHotelTransactionDetail";

interface PaymentData {
  transaction_id: number;
  payment_method: string;
  promo_code: string;
}

const CheckoutContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  background-color: var(--white);
`;

const CardContainer = styled.div`
  display: flex;
  background-color: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InfoContainer = styled.div`
  width: 60%;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const FacilityList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.5rem 4rem;
  padding: 0 1rem;
`;

const FacilityItem = styled.li`
  font-size: 0.875rem;
`;

const RoomPrice = styled.div`
  text-align: right;
  font-weight: bold;

  p:nth-child(1) {
    font-size: 1.5rem;
    color: var(--orange-shade);
  }

  p:nth-child(2) {
    font-size: 0.75rem;
    color: var(--grey);
  }

  p:nth-child(3) {
    font-size: 0.75rem;
    color: var(--blue);
  }
`;

const BookingDetails = styled.div`
  margin-bottom: 1rem;

  p {
    font-weight: bold;
    margin: 0.5rem 0;
  }

  .date {
    color: var(--blue);
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

const HotelBookingPage = () => {
  const location = useLocation();
  const transactionId = location.state.transactionId;
  const { transaction } = useHotelTransactionDetail(transactionId);
  const { promos } = usePromo();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const [showPayDropdown, setShowPayDropdown] = useState<boolean>(false);
  const [showPromoDropdown, setShowPromoDropdown] = useState<boolean>(false);

  const [formData, setFormData] = useState<PaymentData>({
    transaction_id: transactionId,
    payment_method: "",
    promo_code: "",
  });

  const handlePay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await axios.put(
        "http://127.0.0.1:8000/api/auth/pay_hotel",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
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
      <CheckoutContainer>
        <h2>Booking Check Out Page</h2>
        <BookingDetails>
          {/* room detail */}
          <p>Room:</p>
          <CardContainer>
            <RoomImageGrid room={transaction?.room} />
            <InfoContainer>
              <div>
                <RoomTitle>{transaction?.room.room_type}</RoomTitle>
                <FacilityList>
                  {transaction?.room.facilities.map((facility: IFacility, index: number) => (
                    <FacilityItem key={index}>{facility.name}</FacilityItem>
                  ))}
                </FacilityList>
              </div>
              <RoomPrice>
                <p>Rp{transaction?.room.price}</p>
                <p>/ kamar / malam</p>
                <p>Termasuk pajak</p>
              </RoomPrice>
            </InfoContainer>
          </CardContainer>

          {/* date detail */}
          <p>
            Check-in Date: <span className="date">{transaction?.check_in}</span>
          </p>
          <p>
            Check-out Date:{" "}
            <span className="date">{transaction?.check_out}</span>
          </p>
        </BookingDetails>
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
            <Dropdown onClick={() => setShowPromoDropdown(!showPromoDropdown)}>
              <Menu>
                <div className="flex" style={{ gap: "1rem" }}>
                  <img src={ticket} alt="" width="16px" />
                  <p>{!formData.promo_code ? "Promo" : formData.promo_code}</p>
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
          <p>{transaction?.total_price}</p>
        </TotalPrice>
        <PaymentButtonContainer>
          <CancelButton onClick={() => navigate(-1)}>Nanti Dulu Bayarnya</CancelButton>
          <PayButton onClick={handlePay}>Bayar Sekarang</PayButton>
        </PaymentButtonContainer>
      </CheckoutContainer>
    </>
  );
};

export default HotelBookingPage;
