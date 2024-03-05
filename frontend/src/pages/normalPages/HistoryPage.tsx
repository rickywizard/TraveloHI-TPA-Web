import styled from "styled-components";
import LoadingPopup from "../../components/LoadingPopup";
import { useState } from "react";
import { usePastHotel } from "../../hooks/usePastHotel";
import { usePastFlight } from "../../hooks/usePastFlight";
import HotelTransaction from "../../components/HotelTransaction";
import FlightTransaction from "../../components/FlightTransaction";

const HistoryPage = () => {
  const { pastHotel, isLoading } = usePastHotel();
  const { pastFlight } = usePastFlight();

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
            Hotels &emsp;<span>( {pastHotel ? pastHotel?.length : 0} )</span>
          </TabButton>
          <TabButton
            onClick={() => setActiveTab("flights")}
            $active={activeTab === "flights"}
          >
            Flights &emsp;<span>( {pastFlight ? pastFlight?.length : 0} )</span>
          </TabButton>
        </Tabs>

        {/* Content based on active tab */}
        <Content>
          {activeTab === "hotels" && (
            <HotelTransaction hotelTransactions={pastHotel} />
          )}

          {activeTab === "flights" && (
            <FlightTransaction flightTransactions={pastFlight} />
          )}
        </Content>
      </MyOrderContainer>
    </>
  );
}

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

export default HistoryPage