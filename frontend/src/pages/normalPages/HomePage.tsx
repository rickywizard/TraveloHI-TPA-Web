import styled from "styled-components";
import background from "../../assets/home1.webp";
import { useState } from "react";
import { usePromo } from "../../hooks/usePromo";
import why1 from "../../assets/why1.webp";
import why2 from "../../assets/why2.webp";
import why3 from "../../assets/why3.webp";
import why4 from "../../assets/why4.webp";
import { IHotel } from "../../interfaces/hotel-interface";
import { Link } from "react-router-dom";
import { IPromo } from "../../interfaces/promo-interface";
import PriceDisplay from "../../components/PriceDisplay";
import { useTheme } from "../../context/ThemeContext";
import { usePopularHotel } from "../../hooks/usePopularHotel";
import { usePopularFlight } from "../../hooks/usePopularFlight";
import FlightItem from "../../components/FlightItem";

const HomePage = () => {
  const { darkMode } = useTheme();
  const { promos } = usePromo();
  const { popularHotels } = usePopularHotel();
  const { popularFlights } = usePopularFlight();

  // console.log(popularHotels);
  // console.log(popularFlights);

  const whyData = [
    {
      image: 0,
      subtitle: "Hassle-Free",
      content:
        "Make a transaction from anywhere at any time, from desktop, mobile app, or mobile web.",
    },
    {
      image: 1,
      subtitle: "Service You Can Trust",
      content: "You get what you paid for guaranteed.",
    },
    {
      image: 2,
      subtitle: "Various Payment Options",
      content:
        "Be more flexible with various payment methods from ATM, Bank Transfer, Credit Card, and Internet Banking, to Cash.",
    },
    {
      image: 3,
      subtitle: "Secure Transaction Guaranteed",
      content:
        "Security and privacy of your online transaction are protected by RapidSSL authorized technology. Receive instant confirmation and e-ticket or voucher directly in your email.",
    },
  ];

  const imgMap = [why1, why2, why3, why4];

  return (
    <>
      <Background>
        <Carousel promos={promos} />
      </Background>
      <Why className={darkMode ? "dark" : "light"}>
        <h3>Why book with TraveLoHI?</h3>
        <div className="center" style={{ gap: "2rem" }}>
          {whyData.map((data, index) => (
            <WhyCard
              key={index}
              image={imgMap[data.image]}
              subtitle={data.subtitle}
              content={data.content}
            />
          ))}
        </div>
      </Why>
      <HotelReccomendation className={darkMode ? "dark" : "light"}>
        <RecommendHead>
          <h4>Hotel Terpopuler</h4>
          <Link to="/hotels">Lihat lebih banyak &gt;</Link>
        </RecommendHead>
        <Hotels>
          {popularHotels?.map((hotel, index) => (
            <HotelCard key={index} hotel={hotel} />
          ))}
        </Hotels>
      </HotelReccomendation>
      <FlightReccomendation className={darkMode ? "dark" : "light"}>
        <RecommendHead>
          <h4>Penerbangan Terpopuler</h4>
          <Link to="/flights">Lihat lebih banyak &gt;</Link>
        </RecommendHead>
        {popularFlights?.map((flight, index) => (
          <FlightItem key={index} flight={flight} />
        ))}
      </FlightReccomendation>
    </>
  );
};

const Background = styled.section`
  background: url(${background}) no-repeat;
  background-size: cover;
  background-position: center;
  height: 50vh;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const Why = styled.section`
  height: 110vh;
  // background-color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  h3 {
    font-size: 2rem;
  }
`;

const HotelReccomendation = styled.section`
  // height: 65vh;
  // background-color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 1rem;
  max-width: 1024px;
  margin: 0 auto;
`;

const Hotels = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const FlightReccomendation = styled.section`
  // height: 65vh;
  // background-color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: start;
  gap: 1rem;
  max-width: 1024px;
  margin: 0 auto;
`;

const RecommendHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h4 {
    font-size: 1.25rem;
  }

  a {
    color: var(--blue);
    font-size: 0.875rem;
    font-weight: bold;
    transition: 0.3s color;
  }

  a:hover {
    color: var(--blue-shade);
    text-decoration: underline;
  }
`;

// COMPONENT
interface WhyData {
  image: string;
  subtitle: string;
  content: string;
}

const WhyCard = ({ image, subtitle, content }: WhyData) => {
  return (
    <WhyContainer>
      <img src={image} width="100px" />
      <Subtitle>{subtitle}</Subtitle>
      <Content>{content}</Content>
    </WhyContainer>
  );
};

const WhyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 0.5rem;
  height: 80%;
  width: 15%;
`;

const Subtitle = styled.h5`
  text-align: center;
  font-size: 1.25rem;
  color: var(--black);
`;

const Content = styled.p`
  text-align: center;
  font-size: 0.875rem;
  color: var(--black);
`;

interface HotelCardProps {
  hotel: IHotel;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const { darkMode } = useTheme();

  return (
    <HotelCardContainer className={darkMode ? "dark" : "light"}>
      <HotelImage src={hotel.hotel_images[0].image_url} alt={hotel.name} />
      <Info>
        <HotelName>{hotel.name}</HotelName>
        <StartingPrice>
          <p>Harga mulai dari</p>
          <PriceDisplay price={hotel.starting_price} />
        </StartingPrice>
      </Info>
      <ButtonContainer>
        <ViewButton to={`/hotel/${hotel.id}`}>Lihat Detail</ViewButton>
      </ButtonContainer>
    </HotelCardContainer>
  );
};

const HotelCardContainer = styled.div`
  border: 1px solid var(--gray);
  // background-color: var(--white);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 12rem;
  height: 25rem;
  display: flex;
  flex-direction: column;
  align-items: flex;
  justify-content: space-between;
  margin-bottom: 2rem;
`;

const Info = styled.div`
  padding: 0.5rem;
`;

const HotelImage = styled.img`
  width: 100%;
  height: 12rem;
  object-fit: cover;
  border-radius: 5px;
`;

const HotelName = styled.h4`
  margin-bottom: 0.5rem;
`;

const StartingPrice = styled.div`
  margin-bottom: 0.5rem;

  p:nth-child(1) {
    color: var(--blue);
    font-size: 0.75rem;
    font-weight: bold;
  }

  p:nth-child(2) {
    color: var(--orange);
    font-weight: bold;
    font-size: 1.75rem;
  }
`;

const ButtonContainer = styled.div`
  padding: 0.5rem;
`

const ViewButton = styled(Link)`
  width: 100%;
  background-color: transparent;
  color: var(--blue);
  padding: 0.5rem 1rem;
  text-align: center;
  font-weight: bold;
  outline: 0;
  border: 1px solid var(--blue);
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--gray);
  }
`;

interface ICarouselProps {
  promos: IPromo[];
}

const Carousel = ({ promos }: ICarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  return (
    <div>
      <CarouselContainer>
        <SlideContainer
          style={{
            transform: `translateX(${-currentSlide * (400 + 8)}px)`,
          }}
        >
          {promos.map((promo, index) => (
            <Slide
              key={index}
              src={promo.image_url}
              alt={`Slide ${index + 1}`}
            />
          ))}
        </SlideContainer>
        <ButtonGroup>
          <button
            onClick={() => {
              setCurrentSlide(
                (currentSlide - 1 + promos.length) % promos.length
              );
            }}
          >
            &lt;
          </button>
          <p>Geser untuk lihat promo</p>
          <button
            onClick={() => {
              setCurrentSlide((currentSlide + 1) % promos.length);
            }}
          >
            &gt;
          </button>
        </ButtonGroup>
      </CarouselContainer>
    </div>
  );
};

const CarouselContainer = styled.div`
  overflow: hidden;
  width: 100%;
  position: relative;
  margin: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const SlideContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  transition: transform 0.5s ease-in-out;
`;

const Slide = styled.img`
  width: 100%;
  max-width: 400px;
  border-radius: 5px;
`;

const ButtonGroup = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  color: var(--white);

  p {
    font-size: 0.875rem;
  }

  button {
    outline: 0;
    background: transparent;
    border: none;
    color: var(--white);
    font-size: 1.75rem;
    font-weight: bold;
    transition: 0.3s color;
    cursor: pointer;
  }

  button:hover {
    color: var(--grey);
  }
`;

export default HomePage;
