import FlightList from "../../components/FlightList";
import LoadingPopup from "../../components/LoadingPopup";
import { useFlight } from "../../hooks/useFlight";

const AllFlightsPage = () => {
  const { flights, isLoading } = useFlight();

  // console.log(flights);  

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <h2 style={{ marginTop: "1rem" }}>Semua Penerbangan di TraveLoHI</h2>
      <FlightList flights={flights} />
    </>
  );
};

export default AllFlightsPage;
