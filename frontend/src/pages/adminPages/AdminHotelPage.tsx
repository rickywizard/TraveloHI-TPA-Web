import { Link } from "react-router-dom";
import styled from "styled-components";
import { IHotel } from "../../interfaces/hotel-interface";

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

const HotelCardContainer = styled.div`
  border: 1px solid var(--gray);
  background-color: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 17rem;
`;

const HotelImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const HotelName = styled.h3`
  margin-bottom: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AddRoomButton = styled(Link)`
  background-color: transparent;
  color: var(--text);
  padding: 0.5rem 1rem;
  text-align: center;
  font-weight: bold;
  border: 1px solid var(--text);
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--gray);
  }
`;

const DeleteButton = styled.button`
  outline: 0;
  border: none;
  border-radius: 5px;
  background-color: var(--red);
  color: var(--white);
  padding: 0.5rem 1rem;
  transition: 0.3s background-color;
  cursor: pointer;

  &:hover {
    background-color: var(--red-shade);
  }
`;

const ListHotelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

interface HotelCardProps {
  hotel: IHotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <HotelCardContainer>
      <HotelImage src={hotel.image_url[0]} alt={hotel.name} />
      <HotelName>{hotel.name}</HotelName>
      <ActionButtons>
        <AddRoomButton to={`/admin/hotels/${hotel.id}/add-room`}>
          Add Room
        </AddRoomButton>
        <DeleteButton>Delete</DeleteButton>
      </ActionButtons>
    </HotelCardContainer>
  );
};

const AdminHotelPage = () => {
  

  return (
    <>
      <Title>Manage Hotel Page</Title>
      <Link to="/admin/hotels/add" style={{ textDecoration: "none" }}>
        <AddButton>Add New Hotel</AddButton>
      </Link>

      <ListHotelContainer>
        {/* {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))} */}
      </ListHotelContainer>
    </>
  );
};

export default AdminHotelPage;
