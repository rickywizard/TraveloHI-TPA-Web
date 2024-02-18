import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useHotelDetail } from "../../hooks/useHotelDetail";
import location from "../../assets/location-dot-solid.svg";
import InputField from "../../components/InputField";
import LoadingPopup from "../../components/LoadingPopup";
import SliderModal from "../../components/SliderModal";
import axios from "axios";
import PopMessage from "../../components/PopMessage";
import RoomImageGrid from "../../components/RoomImageGrid";
import { IFacility, IRoom } from "../../interfaces/hotel-interface";

interface ChildData {
  room: IRoom;
  date: DateData;
}

export interface BookingData {
  room_id: number;
  check_in: string;
  check_out: string;
}

const CardContainer = styled.div`
  display: flex;
  background-color: var(--white);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  margin-bottom: 1rem;
`;

const InfoContainer = styled.div`
  width: 60%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RoomTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const RoomInfo = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
`;

const FacilityList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.5rem 4rem;
  padding: 0 1rem;
`;

const RoomFacilityItem = styled.li`
  font-size: 0.875rem;
`;

const RoomPrice = styled.div`
  text-align: right;
  font-weight: bold;

  p:nth-child(1) {
    font-size: 1.5rem;
    color: var(--orange-shade);
  }

  p:nth-child(2) {
    font-size: 0.75rem;
    color: var(--grey);
  }

  p:nth-child(3) {
    font-size: 0.75rem;
    color: var(--blue);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
`;

const CartButton = styled.button`
  background-color: var(--white);
  color: var(--orange);
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.6rem 1rem;
  border: 1px solid var(--orange);
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in-out;

  &:hover {
    color: var(--white);
    background-color: var(--orange-shade);
  }
`;

const BookingButton = styled.button`
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

const RoomCard = ({ room, date }: ChildData) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [transactionId, setTransactionId] = useState<number>(0);

  const formData: BookingData = {
    room_id: room.id,
    check_in: date.check_in,
    check_out: date.check_out,
  };

  const handleAddToCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Added to cart", formData);
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/add_hotel_cart",
        formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        // console.log(response.data.message);
        setIsLoading(false);
        setSuccess(response.data.message);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  const handleBooking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess("");
    setError("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/add_hotel_transaction",
        formData,
        { withCredentials: true }
      );

      if (response.status === 201) {
        // console.log(response.data.message);
        setIsLoading(false);
        setSuccess(response.data.message);
        setTransactionId(response.data.id);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    if (success && transactionId) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        navigate(`/hotel/booking`, { state: { transactionId: transactionId } });
      }, 3000);

      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [success]);

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      {success && <PopMessage type="success" text={success} />}
      {error && <PopMessage type="error" text={error} />}
      <CardContainer>
        <RoomImageGrid room={room} />
        <InfoContainer>
          <div>
            <RoomTitle>{room.room_type}</RoomTitle>
            <RoomInfo>
              <FacilityList>
                {room.facilities.map((facility: IFacility, index: number) => (
                  <RoomFacilityItem key={index}>{facility.name}</RoomFacilityItem>
                ))}
              </FacilityList>
              <RoomPrice>
                <p>Rp{room.price}</p>
                <p>/ kamar / malam</p>
                <p>Termasuk pajak</p>
              </RoomPrice>
            </RoomInfo>
          </div>
          <ButtonGroup>
            <CartButton onClick={handleAddToCart}>
              Tambah ke Keranjang
            </CartButton>
            <BookingButton onClick={handleBooking}>
              Booking Sekarang
            </BookingButton>
          </ButtonGroup>
        </InfoContainer>
      </CardContainer>
    </>
  );
};

export interface DateData {
  check_in: string;
  check_out: string;
}

const HotelHead = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem 0;
`;

const HotelName = styled.h2`
  font-size: 2rem;
  margin-top: 1rem;
`;

const HotelStars = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Tag = styled.p`
  background-color: var(--blue-soft);
  color: var(--blue-shade);
  font-size: 0.75rem;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
`;

const HotelAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
`;

const HotelHeadSide = styled.div`
  text-align: right;

  p:nth-child(1) {
    font-size: 0.875rem;
  }

  p:nth-child(2) {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--orange-shade);
    margin-bottom: 0.5rem;
  }

  button {
    outline: 0;
    border: none;
    padding: 0.5rem 1rem;
    background-color: var(--orange);
    color: var(--white);
    font-weight: bold;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
    transition: 0.3s background-color;
  }

  button:hover {
    background-color: var(--orange-shade);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: auto;
  margin-bottom: 1.5rem;
`;

const LargeImage = styled.img`
  width: 600px;
  height: auto;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 0.25rem;
`;

const SmallImageContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 0.25rem;
`;

const SmallImage = styled.img`
  width: 180px;
  height: 110px;
  object-fit: cover;
  border-radius: 5px;
  cursor: pointer;
`;

const SeeAllContainer = styled.div`
  position: relative;

  img {
    filter: brightness(50%);
  }

  p {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 0.875rem;
    color: var(--white);
    cursor: pointer;
  }
`;

const RateSection = styled.section`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  height: 400px;
`;

const LeftSide = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  width: 40%;
  height: inherit;
  // background: beige;
`;

const RightSide = styled.div`
  overflow: hidden;
  width: 60%;
  background: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: inherit;
  // background: aquamarine;
`;

const ReviewTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  button {
    outline: 0;
    background: transparent;
    border: none;
    font-weight: bold;
    font-size: 0.875rem;
    color: var(--blue);
  }

  button:hover {
    color: var(--blue-shade);
  }
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
`;

const Reviews = styled.div`
  background: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  p {
    font-size: 0.875rem;
  }
`;

const RatingAndUser = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-weight: bold;
    color: var(--blue);
  }

  p {
    font-size: 0.75rem;
  }
`;

const HotelDescription = styled.div`
  h4 {
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 0.875rem;
  }

  overflow: hidden;
  background: var(--white);
  height: 40%;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HotelFacility = styled.div`
  height: 60%;
  background: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FacilitiesList = styled.ul`
  padding: inherit;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0.5rem;
`;

const FacilityItem = styled.li`
  font-size: 0.875rem;
`;

const RoomSection = styled.section`
  background-color: var(--blue-thin);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;

  h3 {
    margin-bottom: 1rem;
  }
`;

const DatePicker = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--blue-hard);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  div {
    width: 45%;
  }

  label {
    color: var(--white);
  }
`;

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { hotel, isLoading } = useHotelDetail(id);

  // Truncate word
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  // Hotel star
  const countStars = () => {
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

  // Modal image slider
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
    if (hotel?.hotel_images && hotel.hotel_images.length > 0) {
      const newIndex =
        (currentIndex - 1 + hotel.hotel_images.length) %
        hotel.hotel_images.length;
      setSelectedImage(hotel.hotel_images[newIndex].image_url);
      setCurrentIndex(newIndex);
    }
  };

  const handleNextSlide = () => {
    if (hotel?.hotel_images && hotel.hotel_images.length > 0) {
      const newIndex = (currentIndex + 1) % hotel?.hotel_images.length;
      setSelectedImage(hotel?.hotel_images[newIndex].image_url);
      setCurrentIndex(newIndex);
    }
  };

  // Scroll to room
  const roomSectionRef = useRef<HTMLDivElement>(null);

  const handleToRoom = () => {
    // Scroll ke RoomSection
    if (roomSectionRef.current) {
      roomSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Check-in and Check-out, room data
  const [dateData, setDateData] = useState<DateData>({
    check_in: "",
    check_out: "",
  });

  useEffect(() => {
    // Fungsi untuk mendapatkan tanggal besok dalam format YYYY-MM-DD
    const getTomorrowDate = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    };
    const getTomorrowOutDate = () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);
      return tomorrow.toISOString().split("T")[0];
    };

    setDateData({
      check_in: getTomorrowDate(),
      check_out: getTomorrowOutDate(),
    });
  }, []);

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <HotelHead>
        <div>
          <HotelName>{hotel?.name}</HotelName>
          <HotelStars>
            <Tag>Hotels</Tag>
            <div className="flex">{countStars()}</div>
          </HotelStars>
          <HotelAddress>
            <img src={location} alt="" width="16px" />
            {hotel?.address}
          </HotelAddress>
        </div>

        <HotelHeadSide>
          <p>Harga/kamar/malam mulai dari</p>
          <p>Rp{hotel?.starting_price}</p>
          <button onClick={handleToRoom}>Pilih Kamar</button>
        </HotelHeadSide>
      </HotelHead>

      <ImageContainer>
        <LargeImage
          src={hotel?.hotel_images[0].image_url}
          alt="Hotel"
          onClick={() =>
            handleImageClick(hotel?.hotel_images[0].image_url ?? "", 0)
          }
        />

        <SmallImageContainer>
          {hotel?.hotel_images.slice(1, 6).map((image, index: number) => (
            <SmallImage
              key={index}
              src={image.image_url}
              alt={`Thumbnail ${index + 1}`}
              onClick={() => handleImageClick(image.image_url, index + 1)}
            />
          ))}
          <SeeAllContainer
            onClick={() => {
              const images = hotel?.hotel_images;
              if (images && images.length > 0) {
                handleImageClick(
                  images[images.length - 1].image_url,
                  images.length - 1
                );
              }
            }}
          >
            <SmallImage
              key={hotel?.hotel_images.length}
              src={
                hotel?.hotel_images[hotel?.hotel_images.length - 1].image_url
              }
              alt="Last"
            />
            <p>Lihat semua gambar</p>
          </SeeAllContainer>
        </SmallImageContainer>
      </ImageContainer>

      <RateSection>
        <LeftSide>
          <HotelDescription>
            <h4>Tentang Akomodasi</h4>
            <p>{truncateText(hotel?.description ?? "", 200)}</p>
          </HotelDescription>

          <HotelFacility>
            <h4>Fasilitas Utama</h4>
            <FacilitiesList>
              {hotel?.facilities.map((facility, index) => (
                <FacilityItem key={index}>{facility.name}</FacilityItem>
              ))}
            </FacilitiesList>
          </HotelFacility>
        </LeftSide>

        <RightSide>
          <ReviewTitle>
            <h4>Apa Yang Tamu Katakan Tentang Menginapnya</h4>
            <button>Lihat Semua Ulasan &gt;</button>
          </ReviewTitle>
          <ReviewContainer>
            {hotel?.reviews.map((review, index) => (
              <Reviews key={index}>
                <RatingAndUser>
                  <div>
                    <span>{review.rating}</span>/10
                  </div>
                  <p>
                    {review.user.first_name} {review.user.last_name}
                  </p>
                </RatingAndUser>
                <p>{truncateText(review.comment_text, 165)}</p>
              </Reviews>
            ))}
          </ReviewContainer>
        </RightSide>
      </RateSection>

      <RoomSection ref={roomSectionRef}>
        <h3>Tipe Kamar Tersedia di {hotel?.name}</h3>
        <DatePicker>
          <InputField
            labelName="Check-in Date"
            type="date"
            name="check_in"
            placeholder=""
            value={dateData.check_in}
            handleChange={(e) =>
              setDateData((prevData) => ({
                ...prevData,
                check_in: e.target.value,
              }))
            }
          />
          <InputField
            labelName="Check-out Date"
            type="date"
            name="check_out"
            placeholder=""
            value={dateData.check_out}
            handleChange={(e) =>
              setDateData((prevData) => ({
                ...prevData,
                check_out: e.target.value,
              }))
            }
          />
        </DatePicker>

        {/* Room */}
        {hotel?.rooms.map((room, index) => (
          <RoomCard room={room} date={dateData} key={index} />
        ))}
      </RoomSection>

      {/* Image slider */}
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

export default HotelDetailPage;
