import { useHotel } from '../../hooks/useHotel'
import HotelList from '../../components/HotelList';
import LoadingPopup from '../../components/LoadingPopup';

const AllHotelsPage = () => {
  const { hotels, isLoading } = useHotel();

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <h2 style={{ marginTop: "1rem" }}>Semua Hotel di TraveLoHI</h2>
      <HotelList hotels={hotels} />
    </>
  )
}

export default AllHotelsPage