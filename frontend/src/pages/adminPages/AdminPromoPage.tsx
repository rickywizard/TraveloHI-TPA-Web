import { Link } from "react-router-dom";
import styled from "styled-components";
import { IPromo } from "../../interfaces/promo-interface";
import axios from "axios";
import { usePromo } from "../../hooks/usePromo";

const Title = styled.h2`
  color: var(--text);
  margin-bottom: 1rem;
`

const PromoCardContainer = styled.div`
  border: 1px solid var(--gray);
  background-color: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const PromoImage = styled.img`
  width: 400px;
  height: auto;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`;

const PromoName = styled.h3`
  margin-bottom: 0.5rem;
`;

const PromoCode = styled.p`
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
`;

const PromoExpiration = styled.p`
  font-size: 0.875rem;
  color: var(--grey);
  margin-bottom: 0.5rem;
`;

const UpdateButton = styled(Link)`
  background-color: var(--blue);
  color: var(--white);
  padding: 0.5rem 1rem;
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

const Control = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 1rem;
`
interface PromoCardProps {
  promo: IPromo;
  onDelete: (id: number) => void;
}

const PromoCard: React.FC<PromoCardProps> = ({ promo, onDelete }) => {

  const expirationDate = new Date(promo.expired_date);

  // Konversi tanggal ke dalam format yang sesuai dengan zona waktu lokal
  const formattedExpirationDate = expirationDate.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZoneName: 'short',
  });

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/auth/delete_promo/${promo.id}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        onDelete(promo.id);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting promo:", error);
    }
  };

  return (
    <PromoCardContainer>
      <PromoImage src={promo.image_url} alt={promo.name} />
      <PromoName>{promo.name}</PromoName>
      <PromoCode>Code: {promo.code}</PromoCode>
      <PromoExpiration>Expires on: {formattedExpirationDate}</PromoExpiration>
      <Control>
        <UpdateButton to={`/admin/promos/update/${promo.id}`}>Update</UpdateButton>
        <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      </Control>
    </PromoCardContainer>
  );
};

const AdminPromoPage = () => {
  // Assume promos is an array of promo data fetched from the backend
  const { promos, setPromos } = usePromo();

  const handleDeletePromo = (id: number) => {
    // Filter promos untuk menghilangkan promo dengan ID yang dihapus
    const updatedPromos = promos.filter((promo) => promo.id !== id);
    setPromos(updatedPromos);
  };

  return (
    <>
      <Title>Manage Promo Page</Title>

      <Link to="/admin/promos/add" style={{ textDecoration: "none" }}>
        <AddButton>Add New Promo</AddButton>
      </Link>

      {promos.map((promo) => (
        <PromoCard key={promo.id} promo={promo} onDelete={handleDeletePromo} />
      ))}
    </>
  );
};

export default AdminPromoPage;
