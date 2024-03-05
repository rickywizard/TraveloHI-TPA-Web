import LoadingPopup from "../../components/LoadingPopup";
import styled from "styled-components";
import { useOnGoingHotel } from "../../hooks/useOnGoingHotel";
import { useOnGoingFlight } from "../../hooks/useOnGoingFlight";
import HotelTransaction from "../../components/HotelTransaction";
import FlightTransaction from "../../components/FlightTransaction";
import { useState } from "react";

const MyOrderPage = () => {
  const { onGoingHotel, isLoading } = useOnGoingHotel();
  const { onGoingFlight } = useOnGoingFlight();

  const [activeTab, setActiveTab] = useState("hotels");

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <MyOrderContainer>
        <h2>Pesanan Saya</h2>
        <Tabs>
          <TabButton
            onClick={() => setActiveTab("hotels")}
            $active={activeTab === "hotels"}
          >
            Hotels &emsp;<span>( {onGoingHotel ? onGoingHotel?.length : 0} )</span>
          </TabButton>
          <TabButton
            onClick={() => setActiveTab("flights")}
            $active={activeTab === "flights"}
          >
            Flights &emsp;<span>( {onGoingFlight ? onGoingFlight?.length : 0} )</span>
          </TabButton>
        </Tabs>

        {/* Content based on active tab */}
        <Content>
          {activeTab === "hotels" && (
            <HotelTransaction hotelTransactions={onGoingHotel} />
          )}

          {activeTab === "flights" && (
            <FlightTransaction flightTransactions={onGoingFlight} />
          )}
        </Content>
      </MyOrderContainer>
    </>
  );
};

const Tabs = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TabButton = styled.button<{ $active: boolean }>`
  width: 50%;
  background-color: transparent;
  outline: 0;
  border: none;
  border-bottom: ${({ $active }) =>
    $active ? "3px solid var(--blue)" : "3px solid transparent"};
  color: var(--text);
  font-weight: bold;
  padding: 1rem 0;
  margin-bottom: 1rem;
  cursor: pointer;

  span {
    color: var(--blue);
  }
`;

const Content = styled.div`
  /* Tambahkan gaya sesuai kebutuhan */
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin-bottom: 10px;
  }
`;

const MyOrderContainer = styled.div`
  max-width: 1024px;
  margin: 1rem auto;

  h2 {
    margin-bottom: 0.5rem;
  }
`;

export default MyOrderPage;
