import styled from "styled-components";
import { IFlightTransaction } from "../interfaces/transaction-interface";
import PriceDisplay from "./PriceDisplay";

interface FlightTransactionProps {
  flightTransactions: IFlightTransaction[];
}

const FlightTransaction = ({ flightTransactions }: FlightTransactionProps) => {
  const getFormattedTime = (dateTimeString: string) => {
    const dateTime = new Date(dateTimeString);
    const hours = dateTime.getHours().toString().padStart(2, "0");
    const minutes = dateTime.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

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
      {flightTransactions?.map((transaction, index) => (
        <Container key={index}>
          <AirlineImage>
            <img src={transaction.flight.airline.airline_image_url} alt="" />
          </AirlineImage>
          <FlightInfo>
            <p>{transaction.flight.airline.name}</p>
            <p>{transaction.flight.flight_number}</p>
            <Timeline>
              <div>
                <p>{getFormattedTime(transaction.flight.departure_datetime)}</p>
                <p>{transaction.flight.departure_airport}</p>
              </div>
              <hr />
              {transaction.flight.transits?.map((transit, index) => (
                <Timeline key={index}>
                  <div>
                    <p>{getFormattedTime(transit.arrival_transit_time)}</p>
                    <p>{transit.transit_airport}</p>
                  </div>
                  <hr />
                </Timeline>
              ))}
              <div>
                <p>{getFormattedTime(transaction.flight.arrival_datetime)}</p>
                <p>{transaction.flight.arrival_airport}</p>
              </div>
            </Timeline>
          </FlightInfo>
          <FlightPrice>
            <div>
              <PriceDisplay price={transaction.total_price} />
              <span>/pax</span>
            </div>
            <Paid>
              Tiket berlaku sampai
              <br />
              {readDate(transaction.flight.departure_datetime)}
            </Paid>
          </FlightPrice>
        </Container>
      ))}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background-color: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

const AirlineImage = styled.div`
  // background: beige;
  width: 10%;

  img {
    object-fit: cover;
  }
`;

const FlightInfo = styled.div`
  // background: aquamarine;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 65%;
  height: 100%;
  gap: 0.5rem;

  p:nth-child(1) {
    font-weight: bold;
  }

  p:nth-child(2) {
    font-size: 0.875rem;
  }
`;

const Timeline = styled.div`
  width: fit-content;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  p {
    font-size: 0.75rem;
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

const FlightPrice = styled.div`
  // background: yellow;
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: end;
  justify-content: space-between;

  p:nth-child(1) {
    display: inline;
    color: var(--orange);
    font-weight: bold;
    font-size: 1.25rem;
  }

  span {
    font-size: 0.875rem;
    font-weight: bold;
    color: var(--grey);
  }
`;

const Paid = styled.p`
  text-align: right;
  color: var(--green);
  font-weight: bold;
  font-size: 0.875rem;
`;

export default FlightTransaction;
