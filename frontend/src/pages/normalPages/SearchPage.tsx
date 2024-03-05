import styled from "styled-components";
import LoadingPopup from "../../components/LoadingPopup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import HotelList from "../../components/HotelList";
import FlightList from "../../components/FlightList";

const SearchPage = () => {
  const searchTerm = new URLSearchParams(location.search).get("term");

  const { searchResults, isLoading } = useSearch(searchTerm);
  console.log(searchResults);

  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      navigate(`/search?term=${encodeURIComponent(searchTerm)}`);
    }
  }, [searchTerm, navigate]);

  const [activeTab, setActiveTab] = useState("hotels");

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <Container>
        <h2>Hasil Pencarian Untuk "{searchTerm}"</h2>

        {/* Tabs */}
        <Tabs>
          <TabButton
            onClick={() => setActiveTab("hotels")}
            $active={activeTab === "hotels"}
          >
            Hotels &emsp;<span>( {searchResults.hotels.length} )</span>
          </TabButton>
          <TabButton
            onClick={() => setActiveTab("flights")}
            $active={activeTab === "flights"}
          >
            Flights &emsp;<span>( {searchResults.flights.length} )</span>
          </TabButton>
        </Tabs>

        {/* Content based on active tab */}
        <Content>
          {activeTab === "hotels" && (
            <HotelList hotels={searchResults.hotels} />
          )}

          {activeTab === "flights" && (
            <FlightList flights={searchResults.flights} />
          )}
        </Content>
      </Container>
    </>
  );
};

const Container = styled.div`
  max-width: 1024px;
  margin: 0 auto;

  h2 {
    margin-top: 1rem;
  }
`;

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

export default SearchPage;
