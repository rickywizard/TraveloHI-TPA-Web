import styled from "styled-components";
import { IHotel } from "../interfaces/hotel-interface";
import PriceDisplay from "./PriceDisplay";
import { useState } from "react";
import SelectField from "./SelectField";
import SliderModal from "./SliderModal";
import dummy from "../assets/dummy-post.jpg";
import location from "../assets/location-dot-solid.svg";
import { Link } from "react-router-dom";

const HotelImageContainer = styled.div`
  display: grid;
  grid-template-row: repeat(2, 1fr);
  grid-gap: 0.15rem;
  width: 40%;
  border-radius: 0.5rem 0 0 0.5rem;
  overflow: hidden;
`;

const MainImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
  cursor: pointer;
`;

const ThumbnailContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.15rem;
`;

const Thumbnail = styled.img`
  object-fit: cover;
  width: 100%;
  height: 60px;
  cursor: pointer;
`;

interface ImageGridProps {
  hotel: IHotel | undefined;
}

const HotelImageGrid = ({ hotel }: ImageGridProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleImageClick = (image: string, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePrevSlide = () => {
    if (hotel?.hotel_images && hotel?.hotel_images.length > 0) {
      const newIndex =
        (currentIndex - 1 + hotel?.hotel_images.length) %
        hotel?.hotel_images.length;
      setSelectedImage(hotel?.hotel_images[newIndex].image_url);
      setCurrentIndex(newIndex);
    }
  };

  const handleNextSlide = () => {
    if (hotel?.hotel_images && hotel?.hotel_images.length > 0) {
      const newIndex = (currentIndex + 1) % hotel?.hotel_images.length;
      setSelectedImage(hotel?.hotel_images[newIndex].image_url);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <>
      <HotelImageContainer>
        <MainImage
          key={0}
          src={hotel?.hotel_images[0].image_url || dummy}
          alt="Hotel"
          onClick={() =>
            handleImageClick(hotel?.hotel_images[0].image_url ?? "", 0)
          }
        />
        <ThumbnailContainer>
          {hotel?.hotel_images
            .slice(1, 4)
            .map((image, index) => (
              <Thumbnail
                key={image?.id || index}
                src={image?.image_url}
                alt={`Thumbnail ${index}`}
                onClick={() =>
                  handleImageClick(image.image_url ?? "", index + 1)
                }
              />
            ))
            .concat(
              Array(Math.max(0, 4 - hotel?.hotel_images.length))
                .fill(null)
                .map((_, index) => (
                  <Thumbnail
                    key={`dummy-${index}`}
                    src={dummy}
                    alt={`Dummy ${index}`}
                  />
                ))
            )}
        </ThumbnailContainer>
      </HotelImageContainer>

      <SliderModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handlePrevSlide={handlePrevSlide}
        handleNextSlide={handleNextSlide}
        selectedImage={selectedImage}
      />
    </>
  );
};

interface HotelListProps {
  hotels: IHotel[];
}

const HotelList = ({ hotels }: HotelListProps) => {
  const [starFilters, setStarFilters] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const [facilityFilters, setFacilityFilters] = useState<string[]>([]);

  const [minPrice, setMinPrice] = useState<number | undefined>(undefined);
  const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

  const [sortCriteria, setSortCriteria] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>("asc");

  // Hotel star
  const countStars = (hotel: IHotel) => {
    const stars = parseInt(hotel?.star ?? "0", 10);
    const starArray = [];

    for (let i = 0; i < stars; i++) {
      starArray.push(
        <img
          key={i}
          src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/e/e4cb5ddfa3d1399bc496ee6b6539a5a7.svg"
          alt="⭐"
          width="16px"
        />
      );
    }

    return starArray;
  };

  const starFilter = (count: number) => {
    const starArray = [];

    for (let i = 0; i < count; i++) {
      starArray.push(
        <img
          key={i}
          src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/e/e4cb5ddfa3d1399bc496ee6b6539a5a7.svg"
          alt="⭐"
          width="16px"
        />
      );
    }

    return starArray;
  };

  // Filter handler
  const handleStarFilterChange = (index: number) => {
    const updatedStarFilters = [...starFilters];
    updatedStarFilters[index] = !updatedStarFilters[index];
    setStarFilters(updatedStarFilters);
  };

  const handleFacilityFilterChange = (facilityName: string) => {
    setFacilityFilters((prevFilters) => {
      if (prevFilters.includes(facilityName)) {
        // If the filter is already present, remove it
        return prevFilters.filter((filter) => filter !== facilityName);
      } else {
        // Otherwise, add the filter
        return [...prevFilters, facilityName];
      }
    });
  };

  const handleMinPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setMinPrice(event.target.value === "" ? undefined : value);
  };

  const handleMaxPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setMaxPrice(event.target.value === "" ? undefined : value);
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

  // Filter result
  const filteredHotels = hotels
    .filter((hotel) => {
      console.log(hotel);

      const starFilterPassed = starFilters[parseInt(hotel.star || "0", 10) - 1];
      const priceFilterPassed =
        (minPrice === undefined || hotel.starting_price >= minPrice) &&
        (maxPrice === undefined || hotel.starting_price <= maxPrice);

      const facilityFilterPassed = facilityFilters.every((facilityName) =>
        hotel.facilities.some((facility) => facility.name === facilityName)
      );

      return (
        (!starFilters.some((filter) => filter) || starFilterPassed) &&
        priceFilterPassed &&
        facilityFilterPassed
      );
    })
    .sort((a, b) => {
      // Logika pengurutan berdasarkan kriteria tertentu
      switch (sortCriteria) {
        case "rating":
          return sortOrder === "asc"
            ? parseInt(a.star, 10) - parseInt(b.star, 10)
            : parseInt(b.star, 10) - parseInt(a.star, 10);
        case "reviewCount":
          return sortOrder === "asc"
            ? a.reviews.length - b.reviews.length
            : b.reviews.length - a.reviews.length;
        case "price":
          return sortOrder === "asc"
            ? a.starting_price - b.starting_price
            : b.starting_price - a.starting_price;
        default:
          return 0;
      }
    });

  return (
    <ComponentContainer>
      <Filter>
        {/* Filter star rating */}
        <div className="sec">
          <h4>Star Rating</h4>
          {[1, 2, 3, 4, 5].map((count) => (
            <CheckboxContainer key={count}>
              <input
                type="checkbox"
                checked={starFilters[count - 1]}
                onChange={() => handleStarFilterChange(count - 1)}
              />
              <span>{starFilter(count)}</span>
            </CheckboxContainer>
          ))}
        </div>
        {/* Filter fasilitas */}
        <div className="sec">
          <h4>Fasilitas</h4>
          {Array.from(
            new Set(
              hotels.flatMap((hotel) =>
                hotel.facilities.map((facility) => facility.name)
              )
            )
          ).map((facilityName) => (
            <CheckboxContainer key={facilityName}>
              <input
                type="checkbox"
                checked={facilityFilters.includes(facilityName)}
                onChange={() => handleFacilityFilterChange(facilityName)}
              />
              <span>{facilityName}</span>
            </CheckboxContainer>
          ))}
        </div>
        {/* Filter harga */}
        <div className="sec">
          <h4>Harga mulai</h4>
          <div>
            <input
              type="number"
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="Harga Minimal"
              onWheel={(e) => (e.target as HTMLElement).blur()}
            />
          </div>
          <br />
          <div>
            <input
              type="number"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              placeholder="Harga Maksimal"
              onWheel={(e) => (e.target as HTMLElement).blur()}
            />
          </div>
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
                value: "rating",
                label: "Rating",
              },
              {
                value: "reviewCount",
                label: "Jumlah Ulasan",
              },
              {
                value: "price",
                label: "Harga",
              },
              {
                value: "availability",
                label: "Availability",
              },
            ]}
            value={sortCriteria}
            handleChange={handleSortChange}
          />
        </div>
      </Filter>
      <HotelView>
        {filteredHotels.map((hotel, index) => (
          <HotelItem key={hotel.id || index}>
            <HotelImageGrid hotel={hotel} />
            <InfoContainer>
              <Info>
                <HotelTitle>{hotel.name}</HotelTitle>
                <HotelInfo>
                  <HotelInfoDetail>
                    <div>
                      <p>Hotels</p>
                      <span>{countStars(hotel)}</span>
                    </div>
                    <HotelAddress>
                      <img src={location} alt="" width="16px" />
                      {hotel?.address}
                    </HotelAddress>
                  </HotelInfoDetail>
                  <SubPrice>
                    <PriceDisplay price={hotel.starting_price} />
                    <p>Termasuk pajak</p>
                  </SubPrice>
                </HotelInfo>
              </Info>
              <ButtonGroup>
                <Link to={`/hotel/${hotel.id}`}>
                  <SelectRoomButton>Pilih Kamar</SelectRoomButton>
                </Link>
              </ButtonGroup>
            </InfoContainer>
          </HotelItem>
        ))}
      </HotelView>
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

const HotelView = styled.div`
  // background: aquamarine;
  width: 75%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const HotelItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  margin-bottom: 1rem;
`;

const InfoContainer = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0 0.75rem;
`;

const HotelTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text);
`;

const HotelInfo = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HotelInfoDetail = styled.div`
  width: 60%;

  div:nth-child(1) {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;

    p {
      background-color: var(--blue-soft);
      color: var(--blue-shade);
      font-size: 0.75rem;
      padding: 0.1rem 0.5rem;
      border-radius: 1rem;
    }

    span {
      display: flex;
    }
  }
`;

const HotelAddress = styled.div`
  display: flex;
  align-items: start;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

const SubPrice = styled.div`
  width: 40%;
  text-align: right;
  font-weight: bold;

  p:nth-child(1) {
    font-size: 1.5rem;
    color: var(--orange-shade);
  }

  p:nth-child(2) {
    font-size: 0.75rem;
    color: var(--blue);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
`;

const SelectRoomButton = styled.button`
  background-color: var(--orange);
  color: var(--white);
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.6rem 1rem;
  border: 1px solid var(--orange);
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    color: var(--orange);
    background-color: var(--white);
  }
`;

export default HotelList;
