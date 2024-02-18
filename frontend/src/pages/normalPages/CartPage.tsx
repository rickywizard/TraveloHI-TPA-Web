import { useState } from "react";
import styled, { keyframes } from "styled-components";
import { useCart } from "../../hooks/useCart";
import RoomImageGrid from "../../components/RoomImageGrid";
import InputField from "../../components/InputField";
import axios from "axios";
import LoadingPopup from "../../components/LoadingPopup";
import PopMessage from "../../components/PopMessage";
import { IHotelCart } from "../../interfaces/cart-interface";
import wallet from "../../assets/wallet-solid.svg";
import debt from "../../assets/tag-solid.svg";
import credit from "../../assets/credit-card-solid.svg";
import ticket from "../../assets/ticket-solid.svg";
import { usePromo } from "../../hooks/usePromo";

const slideUp = keyframes`
  from {
    max-height: 0;
  }
  to {
    max-height: 500px; 
  }
`;

const slideDown = keyframes`
  from {
    max-height: 500px;
  }
  to {
    max-height: 0;
  }
`;

const CartContainer = styled.div`
  max-width: 1024px;
  margin: 1rem auto;
`;

const Accordion = styled.div`
  margin-bottom: 1rem;
`;

const AccordionHeader = styled.div`
  background-color: var(--gray);
  padding: 0.5rem;
  border-radius: 5px 5px 0 0;
  cursor: pointer;
`;

const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "fit-content" : "0")};
  overflow: hidden;
  animation: ${({ $isOpen }) => ($isOpen ? slideUp : slideDown)} 0.5s
    ease-in-out;
`;

const TotalPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const CheckoutButton = styled.button`
  background-color: var(--orange);
  color: white;
  padding: 0.75rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s background-color;

  &:hover {
    background-color: var(--orange-shade);
  }
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  background-color: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InfoContainer = styled.div`
  width: 60%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RoomTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: var(--text);
`;

const RoomCartInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CheckDate = styled.div`
  width: 50%;
`;

const SubPrice = styled.div`
  width: 50%;
  text-align: right;
  font-weight: bold;

  p:nth-child(1) {
    font-size: 1.5rem;
    color: var(--orange-shade);
  }

  p:nth-child(2) {
    font-size: 0.75rem;
    color: var(--blue);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
`;

const RemoveButton = styled.button`
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

const UpdateButton = styled.button`
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

// Dummy data

const flightItems = [
  { id: 1, name: "Flight X", price: 200 },
  { id: 2, name: "Flight Y", price: 250 },
];

const CartPage = () => {
  const { promos } = usePromo();
  const { carts, setCarts } = useCart();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hotelAccordionOpen, setHotelAccordionOpen] = useState<boolean>(true);
  const [flightAccordionOpen, setFlightAccordionOpen] = useState<boolean>(true);

  // console.log(carts);
  const [formData, setFormData] = useState({
    payment_method: "",
    promo_code: "",
    total_price: 0,
  });

  const [showPayDropdown, setShowPayDropdown] = useState<boolean>(false);
  const [showPromoDropdown, setShowPromoDropdown] = useState<boolean>(false);

  const toggleHotelAccordion = () => setHotelAccordionOpen(!hotelAccordionOpen);
  const toggleFlightAccordion = () =>
    setFlightAccordionOpen(!flightAccordionOpen);

  const handleRemoveHotel = async (cartId: number) => {
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/auth/remove_hotel_cart/${cartId}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoading(false);
        setSuccess(response.data.message);

        // Menghitung total dari total_price yang masih ada dalam hotel_cart
        const remainingTotal = carts.hotel_cart
          .filter((cart) => cart.id !== cartId)
          .reduce((total, cart) => total + cart.total_price, 0);

        setCarts((prevCarts) => ({
          cart_total_price: remainingTotal,
          hotel_cart: prevCarts.hotel_cart.filter((cart) => cart.id !== cartId),
        }));
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setCarts((prevCart) => ({
      ...prevCart,
      hotel_cart: prevCart.hotel_cart.map((cart, i) =>
        i === index
          ? {
              ...cart,
              [name]: value,
            }
          : cart
      ),
    }));
  };

  const handleUpdateHotel = async (
    e: React.MouseEvent<HTMLButtonElement>,
    cart: IHotelCart
  ) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/auth/update_hotel_cart/${cart.id}`,
        {
          check_in: cart.check_in,
          check_out: cart.check_out,
        },
        { withCredentials: true }
      );

      if (response.status === 200) {
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

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      {success && <PopMessage type="success" text={success} />}
      {error && <PopMessage type="error" text={error} />}
      <CartContainer>
        <h2>Keranjang</h2>
        <Accordion>
          {/* Hotel Cart */}
          <AccordionHeader onClick={toggleHotelAccordion}>
            Hotel Items
          </AccordionHeader>
          <AccordionContent $isOpen={hotelAccordionOpen}>
            {carts?.hotel_cart.map((cart, index) => (
              <CartItem key={cart.id || index}>
                <RoomImageGrid room={cart.room} />
                <InfoContainer>
                  <div>
                    <RoomTitle>{cart.room.room_type}</RoomTitle>
                    <RoomCartInfo>
                      <CheckDate>
                        <InputField
                          labelName="Check-in Date"
                          type="date"
                          name="check_in"
                          placeholder=""
                          value={cart.check_in}
                          handleChange={(e) => handleChange(e, index)}
                        />
                        <InputField
                          labelName="Check-out Date"
                          type="date"
                          name="check_out"
                          placeholder=""
                          value={cart.check_out}
                          handleChange={(e) => handleChange(e, index)}
                        />
                      </CheckDate>
                      <SubPrice>
                        <p>Rp{cart.total_price}</p>
                        <p>Termasuk pajak</p>
                      </SubPrice>
                    </RoomCartInfo>
                  </div>
                  <ButtonGroup>
                    <RemoveButton onClick={() => handleRemoveHotel(cart.id)}>
                      Hapus
                    </RemoveButton>
                    <UpdateButton onClick={(e) => handleUpdateHotel(e, cart)}>
                      Perbarui
                    </UpdateButton>
                  </ButtonGroup>
                </InfoContainer>
              </CartItem>
            ))}
          </AccordionContent>
        </Accordion>

        <Accordion>
          <AccordionHeader onClick={toggleFlightAccordion}>
            Flight Items
          </AccordionHeader>
          <AccordionContent $isOpen={flightAccordionOpen}>
            {flightItems.map((item) => (
              <CartItem key={item.id}>
                {item.name} - ${item.price}
              </CartItem>
            ))}
          </AccordionContent>
        </Accordion>

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
          <p>Total Price</p>
          <p>Rp{carts?.cart_total_price}</p>
        </TotalPrice>

        <CheckoutButton>Check Out</CheckoutButton>
      </CartContainer>
    </>
  );
};

export default CartPage;
