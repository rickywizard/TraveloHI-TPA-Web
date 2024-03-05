import { Link } from "react-router-dom";
import LoadingPopup from "../../components/LoadingPopup"
import styled from "styled-components";
import { IAirline } from "../../interfaces/flight-interface";
import { useAirline } from "../../hooks/useAirline";

interface AirlineCardProps {
  airline: IAirline;
}

const AirlineCard: React.FC<AirlineCardProps> = ({ airline }) => {
  return (
    <AirlineCardContainer>
      <AirlineImage src={airline.airline_image_url} alt={airline.name} />
      <AirlineName>{airline.name}</AirlineName>
      <ActionButtons>
        <AddRoomButton to={`/admin/airlines/${airline.id}/add-flight`}>
          Add Flight
        </AddRoomButton>
      </ActionButtons>
    </AirlineCardContainer>
  );
};

const AirlineCardContainer = styled.div`
  border: 1px solid var(--gray);
  background-color: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 17rem;
`;

const AirlineImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const AirlineName = styled.h3`
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AddRoomButton = styled(Link)`
  background-color: var(--blue);
  color: var(--white);
  padding: 0.5rem 1rem;
  text-align: center;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--blue-shade);
  }
`;

const AdminFlightPage = () => {
  const { airlines, isLoading } = useAirline()

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <Title>Manage Airline/Flight Page</Title>
      <Link to="/admin/airlines/add" style={{ textDecoration: "none" }}>
        <AddButton>Add New Airline</AddButton>
      </Link>

      <ListAirlineContainer>
        {airlines.map((airline) => (
          <AirlineCard key={airline.id} airline={airline} />
        ))}
      </ListAirlineContainer>
    </>
  )
}

const Title = styled.h2`
  color: var(--text);
  margin-bottom: 1rem;
`;

const AddButton = styled.button`
  outline: 0;
  border: none;
  border-radius: 5px;
  background-color: var(--blue);
  color: var(--white);
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  transition: 0.3s background-color;
  cursor: pointer;

  &:hover {
    background-color: var(--blue-shade);
  }
`;

const ListAirlineContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

export default AdminFlightPage