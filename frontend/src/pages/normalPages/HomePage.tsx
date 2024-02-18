import styled, { css } from "styled-components";
import background from "../../assets/home1.webp";
import { useState } from "react";
import { usePromo } from "../../hooks/usePromo";
import why1 from "../../assets/why1.webp";
import why2 from "../../assets/why2.webp";
import why3 from "../../assets/why3.webp";
import why4 from "../../assets/why4.webp";
import { IHotel } from "../../interfaces/hotel-interface";
import { Link } from "react-router-dom";
import { useHotel } from "../../hooks/useHotel";

const HomePage = () => {
  const { promos } = usePromo();
  const { hotels } = useHotel();

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
        <Carousel>
          {promos.map((promo, index) => (
            <img key={index} src={promo.image_url} alt={promo.code} />
          ))}
        </Carousel>
      </Background>
      <Why>
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
      <HotelReccomendation>
        <RecommendHead>
          <h4>Hotel Terpopuler</h4>
          <Link to="/hotels">Lihat lebih banyak &gt;</Link>
        </RecommendHead>
        {hotels.slice(0, 4).map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} />
        ))}
      </HotelReccomendation>
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
`;

const HotelReccomendation = styled.section`
  height: 75vh;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  }
`;

interface HotelCardProps {
  hotel: IHotel;
}

const HotelCardContainer = styled.div`
  border: 1px solid var(--gray);
  background-color: var(--white);
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 15rem;
  height: 17rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex;
  overflow: hidden;
`;

const Info = styled.div`
  padding: 0.5rem;
`;

const HotelImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 5px;
`;

const HotelName = styled.h3`
  margin-bottom: 1rem;
`

const ViewButton = styled(Link)`
  width: 100%;
  background-color: var(--orange);
  color: var(--white);
  padding: 0.5rem 1rem;
  text-align: center;
  font-weight: bold;
  outline: 0;
  border: 0;
  border-radius: 5px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--orange-shade);
  }
`;

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  return (
    <HotelCardContainer>
      <HotelImage src={hotel.hotel_images[0].image_url} alt={hotel.name} />
      <Info>
        <HotelName>{hotel.name}</HotelName>
        <ViewButton to={`/hotel/${hotel.id}`}>View Detail</ViewButton>
      </Info>
    </HotelCardContainer>
  );
};

const Why = styled.section`
  height: 100vh;
  background-color: var(--white);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;

  h3 {
    font-size: 2rem;
  }
`;

interface WhyData {
  image: string;
  subtitle: string;
  content: string;
}

const WhyCard: React.FC<WhyData> = ({ image, subtitle, content }: WhyData) => {
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

interface IProps {
  children: JSX.Element[];
}

const Carousel = ({ children }: IProps) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const activeSlide = children.map((slide, index) => (
    <SCarouselSlide $active={currentSlide === index} key={index}>
      {slide}
    </SCarouselSlide>
  ));

  return (
    <div>
      <SCarouselWrapper>
        <SCarouselSlides $currentSlide={currentSlide}>
          {activeSlide}
        </SCarouselSlides>
      </SCarouselWrapper>
      <ButtonGroup>
        <button
          onClick={() => {
            setCurrentSlide(
              (currentSlide - 1 + activeSlide.length) % activeSlide.length
            );
          }}
        >
          &lt;
        </button>
        <p>Geser untuk lihat promo</p>
        <button
          onClick={() => {
            setCurrentSlide((currentSlide + 1) % activeSlide.length);
          }}
        >
          &gt;
        </button>
      </ButtonGroup>
    </div>
  );
};

const SCarouselWrapper = styled.div`
  display: flex;
`;

const SCarouselSlide = styled.div<{ $active?: boolean }>`
  transition: all 0.5s ease;
  width: 100%;

  img {
    width: 20rem;
    border-radius: 5px;
  }
`;

const SCarouselSlides = styled.div<{ $currentSlide: number }>`
  display: flex;
  gap: 1rem;
  ${({ $currentSlide }) =>
    $currentSlide &&
    css`
      transform: translateX(-${$currentSlide * 20}rem);
    `};
  transition: all 0.5s ease;
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
