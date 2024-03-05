import styled from "styled-components";
import { IFlight } from "../interfaces/flight-interface";
import SelectField from "./SelectField";
import { useState } from "react";
import InputField from "./InputField";
import FlightItem from "./FlightItem";

interface FlightListProps {
  flights: IFlight[];
}

const FlightList = ({ flights }: FlightListProps) => {
  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [transitFilters, setTransitFilters] = useState<string[]>([]);
  const [searchDate, setSearchDate] = useState<string>("");

  // Date search
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(event.target.value);
  };

  const filterFlightsByDate = (flight: IFlight) => {
    if (!searchDate) {
      return true;
    }

    const flightDate = new Date(flight.departure_datetime)
      .toISOString()
      .split("T")[0];
    
    return flightDate === searchDate;
  };

  // Filter handler
  const handleTransitFilterChange = (transitOption: string) => {
    setTransitFilters((prevFilters) => {
      if (prevFilters.includes(transitOption)) {
        // If the filter is already present, remove it
        return prevFilters.filter((filter) => filter !== transitOption);
      } else {
        // Otherwise, add the filter
        return [...prevFilters, transitOption];
      }
    });
  };

  // Sort handler
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(event.target.value);
  };

  const handleSortOrderChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSortOrder(event.target.value);
  };

  const filteredFlights = flights
    .filter((flight) => {
      if (transitFilters.length === 0) {
        return true;
      } else {
        return transitFilters.includes(
          flight.transits.length === 0
            ? "direct"
            : flight.transits.length === 1
            ? "1_transit"
            : "2_plus_transits"
        );
      }
    })
    .filter(filterFlightsByDate)
    .sort((a, b) => {
      // Logika pengurutan berdasarkan kriteria tertentu
      switch (sortCriteria) {
        case "duration":
          return sortOrder === "asc"
            ? a.duration - b.duration
            : b.duration - a.duration;
        case "transit":
          return sortOrder === "asc"
            ? a.transits.length - b.transits.length
            : b.transits.length - a.transits.length;
        case "price":
          return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
        default:
          return 0;
      }
    });

  return (
    <ComponentContainer>
      <Filter>
        {/* Filter jumlah transit */}
        <div className="sec">
          <h4>Jumlah Transit</h4>
          {[
            { option: "direct", label: "Langsung" },
            { option: "1_transit", label: "1 Transit" },
            { option: "2_plus_transits", label: "2+ Transit" },
          ].map((transitOption) => (
            <CheckboxContainer key={transitOption.option}>
              <input
                type="checkbox"
                onChange={() => handleTransitFilterChange(transitOption.option)}
              />
              <span>{transitOption.label}</span>
            </CheckboxContainer>
          ))}
        </div>
        <div className="sec">
          <h4>Urutkan berdasarkan</h4>
          <SelectField
            labelName=""
            name=""
            options={[
              {
                value: "asc",
                label: "Terendah",
              },
              {
                value: "dsc",
                label: "Tertinggi",
              },
            ]}
            value={sortOrder}
            handleChange={handleSortOrderChange}
          />
          <SelectField
            labelName=""
            name=""
            options={[
              {
                value: "",
                label: "Pilih kategori",
              },
              {
                value: "duration",
                label: "Durasi",
              },
              {
                value: "price",
                label: "Harga",
              },
              {
                value: "transit",
                label: "Jumlah Transit",
              },
            ]}
            value={sortCriteria}
            handleChange={handleSortChange}
          />
        </div>
      </Filter>
      <FlightResult>
        <SearchDate>
          <h5>Cari Tanggal</h5>
          <InputField
            labelName=""
            type="date"
            name=""
            placeholder=""
            value={searchDate}
            handleChange={handleDateChange}
          />
        </SearchDate>
        <FlightView>
          {filteredFlights.map((flight, index) => (
            <FlightItem flight={flight} key={index} />
          ))}
        </FlightView>
      </FlightResult>
    </ComponentContainer>
  );
};

const ComponentContainer = styled.div`
  // background: var(--gray);
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 1rem 0;
  margin-bottom: 1rem;
`;

const Filter = styled.div`
  // background: beige;
  width: 23%;

  div.sec {
    border-radius: 0.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    padding: 1rem;
    margin-bottom: 1rem;

    h4 {
      margin-bottom: 0.5rem;
    }

    input {
      padding: 0.25rem 0.5rem;
      outline: 0;
      border: 1px solid var(--grey);
      border-radius: 5px;
    }
  }
`;

const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FlightResult = styled.div`
  width: 75%;
`;

const SearchDate = styled.div`
  background: linear-gradient(120deg, rgba(37, 92, 159, 1),var(--blue-shade) 35%, var(--blue) 100%);
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1rem;

  h5 {
    color: var(--white);
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  div {
    margin: 0;
  }
`;

const FlightView = styled.div`
  // background: aquamarine;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export default FlightList;
