import styled from "styled-components";
import LoadingPopup from "../../components/LoadingPopup";
import InputField from "../../components/InputField";
import ErrorMessage from "../../components/ErrorMessage";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import trash from "../../assets/trash-solid.svg";
import axios from "axios";

interface FlightData {
  flight_number: string;
  price: string;
  departure_airport: string;
  departure_datetime: string;
  arrival_airport: string;
  arrival_datetime: string;
  is_transit: boolean;
  transit_airport: string[];
  transit_datetime: string[];
}

const AddFlightPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [formData, setFormData] = useState<FlightData>({
    flight_number: "",
    price: "",
    departure_airport: "",
    departure_datetime: "",
    arrival_airport: "",
    arrival_datetime: "",
    is_transit: false,
    transit_airport: [],
    transit_datetime: [],
  });

  const handleAddTransit = () => {
    setFormData((prevData) => ({
      ...prevData,
      is_transit: true,
      transit_airport: [...prevData.transit_airport, ""],
      transit_datetime: [...prevData.transit_datetime, ""],
    }));
  };

  const handleTransitInputChange = (
    index: number,
    field: "airport" | "time",
    value: string
  ) => {
    setFormData((prevData) => {
      const updatedTransitAirport = [...prevData.transit_airport];
      const updatedTransitTime = [...prevData.transit_datetime];

      if (field === "airport") {
        updatedTransitAirport[index] = value;
      } else if (field === "time") {
        updatedTransitTime[index] = value;
      }

      return {
        ...prevData,
        transit_airport: updatedTransitAirport,
        transit_datetime: updatedTransitTime,
      };
    });
  };

  const handleRemoveTransit = (index: number) => {
    setFormData((prevData) => {
      const updatedTransitAirport = [...prevData.transit_airport];
      const updatedTransitTime = [...prevData.transit_datetime];

      updatedTransitAirport.splice(index, 1);
      updatedTransitTime.splice(index, 1);

      const isTransit = updatedTransitAirport.length > 0;

      return {
        ...prevData,
        is_transit: isTransit,
        transit_airport: updatedTransitAirport,
        transit_datetime: updatedTransitTime,
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(formData);
    setIsLoading(true);
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/auth/add_flight/${id}`,
        formData,
        { withCredentials: true }
      )

      if (response.status === 201) {
        console.log(response.data.message);
        setIsLoading(false);
        setError("");
        navigate(-1);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <FormContainer>
        <h2 style={{ marginBottom: "1rem" }}>Add Flight</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            labelName="Flight Number"
            type="text"
            name="flight_number"
            placeholder="Enter flight number"
            handleChange={handleInputChange}
            value={formData.flight_number}
          />

          <InputField
            labelName="Ticket Price"
            type="number"
            name="price"
            placeholder="Enter ticket price"
            handleChange={handleInputChange}
            value={formData.price.toString()}
          />

          <AirportContainer>
            <InputField
              labelName="Departure Airport"
              type="text"
              name="departure_airport"
              placeholder="Enter departure airport"
              handleChange={handleInputChange}
              value={formData.departure_airport}
            />

            <InputField
              labelName="Departure Time"
              type="datetime-local"
              name="departure_datetime"
              placeholder="Enter departure time"
              handleChange={handleInputChange}
              value={formData.departure_datetime}
            />
          </AirportContainer>

          {formData.transit_airport.map((transitAirport, index) => (
            <AirportContainer key={index}>
              <InputField
                labelName={`Transit Airport ${index + 1}`}
                type="text"
                name={`transit_airport_${index}`}
                placeholder="Enter transit airport"
                handleChange={(e) =>
                  handleTransitInputChange(index, "airport", e.target.value)
                }
                value={transitAirport}
              />

              <InputField
                labelName={`Transit Time ${index + 1}`}
                type="datetime-local"
                name={`transit_datetime_${index}`}
                placeholder="Enter transit time"
                handleChange={(e) =>
                  handleTransitInputChange(index, "time", e.target.value)
                }
                value={formData.transit_datetime[index]}
              />

              <button type="button" onClick={() => handleRemoveTransit(index)}>
                <img src={trash} alt="✖" width="20px" />
              </button>
            </AirportContainer>
          ))}

          <AddTransitButton type="button" onClick={handleAddTransit}>
            Add Transit
          </AddTransitButton>

          <AirportContainer>
            <InputField
              labelName="Arrival Airport"
              type="text"
              name="arrival_airport"
              placeholder="Enter arrival airport"
              handleChange={handleInputChange}
              value={formData.arrival_airport}
            />

            <InputField
              labelName="Arrival Time"
              type="datetime-local"
              name="arrival_datetime"
              placeholder="Enter arrival time"
              handleChange={handleInputChange}
              value={formData.arrival_datetime}
            />
          </AirportContainer>

          <ErrorMessage error={error} />

          <ButtonGroup>
            <button type="submit">Add Flight</button>

            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </>
  );
};

const FormContainer = styled.div`
  background: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const AirportContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  button {
    outline: 0;
    border: none;
    background-color: var(--red);
    padding: 1rem;
    border-radius: 5px;
    transition: 0.3s background-color;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--red-shade);
  }
`;

const AddTransitButton = styled.button`
  outline: 0;
  border: none;
  background-color: var(--orange);
  color: var(--white);
  padding: 0.5rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: 0.3s background-color;

  &:hover {
    background-color: var(--orange-shade);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  button {
    outline: 0;
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
    color: var(--white);
    transition: 0.3s background;
    cursor: pointer;
  }

  button:nth-child(1) {
    background: var(--blue);
  }
  button:nth-child(1):hover {
    background: var(--blue-shade);
  }

  button:nth-child(2) {
    background: var(--red);
  }
  button:nth-child(2):hover {
    background: var(--red-shade);
  }
`;

export default AddFlightPage;
