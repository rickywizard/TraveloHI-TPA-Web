import LoadingPopup from "../../components/LoadingPopup";
import styled from "styled-components";
import RoomImageGrid from "../../components/RoomImageGrid";
import { useHotelTransaction } from "../../hooks/useHotelTransaction";
import ErrorMessage from "../../components/ErrorMessage";
import { useNavigate } from "react-router-dom";

const MyOrderPage = () => {
  const { hotelTransactions, isLoading } = useHotelTransaction();
  const navigate = useNavigate();

  // console.log(hotelTransactions);

  const handleToPayment = (transactionId: number) => {
    navigate(`/hotel/booking`, { state: { transactionId: transactionId } });
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <MyOrderContainer>
        <h2>Pesanan Saya</h2>
        {hotelTransactions.map((transaction, index) => (
          <MyOrderItem key={index}>
            <RoomImageGrid room={transaction.room} />
            <InfoContainer>
              <RoomTitle>{transaction.room.room_type}</RoomTitle>
              <RoomCartInfo>
                <CheckDate>
                  <p>
                    Check-in Date:{" "}
                    <span className="date">{transaction?.check_in}</span>
                  </p>
                  <p>
                    Check-out Date:{" "}
                    <span className="date">{transaction?.check_out}</span>
                  </p>
                </CheckDate>
                <SubPrice>
                  <p>Rp{transaction.total_price}</p>
                  <p>Termasuk pajak</p>
                </SubPrice>
              </RoomCartInfo>
              {transaction.is_expired ? (
                <ErrorMessage error="Transaksi sudah kadaluarsa" />
              ) : transaction.is_paid ? (
                <Paid>Transaksi sudah dibayar</Paid>
              ) : (
                <ButtonGroup>
                  <p>Anda belum melakukan pembayaran</p>
                  <PayButton onClick={() => handleToPayment(transaction.id)}>
                    Bayar Sekarang
                  </PayButton>
                </ButtonGroup>
              )}
            </InfoContainer>
          </MyOrderItem>
        ))}
      </MyOrderContainer>
    </>
  );
};

const MyOrderContainer = styled.div`
  max-width: 1024px;
  margin: 1rem auto;

  h2 {
    margin-bottom: 0.5rem;
  }
`;

const MyOrderItem = styled.div`
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
  gap: 2rem;
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

  p {
    color: var(--black);
  }

  span {
    color: var(--blue);
    font-weight: bold;
  }
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

const Paid = styled.p`
  text-align: right;
  color: var(--green);
  font-weight: bold;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: 0.5rem;

  p {
    font-size: 0.75rem;
    font-weight: bold;
    color: var(--red);
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

export default MyOrderPage;
