import styled from "styled-components";
import { IHotelTransaction } from "../interfaces/transaction-interface";
import RoomImageGrid from "./RoomImageGrid";
import PriceDisplay from "./PriceDisplay";

interface HotelTransactionProps {
  hotelTransactions: IHotelTransaction[];
}

const HotelTransaction = ({ hotelTransactions }: HotelTransactionProps) => {
  const readDate = (dateTimeString: string) => {
    const departureDate = new Date(dateTimeString);
  
    // Konversi tanggal ke dalam format yang sesuai dengan zona waktu lokal
    const formattedDepartureDate = departureDate.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short',
    });

    return formattedDepartureDate
  }

  return (
    <>
      {hotelTransactions?.map((transaction, index) => (
        <MyOrderItem key={index}>
          <RoomImageGrid room={transaction.room} />
          <InfoContainer>
            <RoomTitle>{transaction.room.room_type}</RoomTitle>
            <RoomCartInfo>
              <CheckDate>
                <p>
                  Check-in Date:{" "}
                  <span className="date">{transaction.check_in}</span>
                </p>
                <p>
                  Check-out Date:{" "}
                  <span className="date">{transaction.check_out}</span>
                </p>
              </CheckDate>
              <SubPrice>
                <PriceDisplay price={transaction.total_price} />
                <p>Termasuk pajak</p>
              </SubPrice>
            </RoomCartInfo>
            <Paid>
              Tiket berlaku sampai
              <br />
              {readDate(transaction.check_out)}
            </Paid>
          </InfoContainer>
        </MyOrderItem>
      ))}
    </>
  );
};

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

export default HotelTransaction;
