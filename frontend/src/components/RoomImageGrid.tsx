import styled from "styled-components";
import { IRoom } from "../interfaces/hotel-interface";
import dummy from "../assets/dummy-post.jpg";
import { useState } from "react";
import SliderModal from "./SliderModal";

const RoomImageContainer = styled.div`
  display: grid;
  grid-template-row: repeat(2, 1fr);
  grid-gap: 0.15rem;
  width: 40%;
  border-radius: 0.5rem;
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

const RoomImageGrid = ({ room }: { room: IRoom | undefined }) => {
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
    if (room?.room_images && room?.room_images.length > 0) {
      const newIndex =
        (currentIndex - 1 + room?.room_images.length) % room?.room_images.length;
      setSelectedImage(room?.room_images[newIndex].image_url);
      setCurrentIndex(newIndex);
    }
  };

  const handleNextSlide = () => {
    if (room?.room_images && room?.room_images.length > 0) {
      const newIndex = (currentIndex + 1) % room?.room_images.length;
      setSelectedImage(room?.room_images[newIndex].image_url);
      setCurrentIndex(newIndex);
    }
  };

  return (
    <>
      <RoomImageContainer>
        <MainImage
          key={0}
          src={room?.room_images[0].image_url || dummy}
          alt="Hotel Room"
          onClick={() =>
            handleImageClick(room?.room_images[0].image_url ?? "", 0)
          }
        />
        <ThumbnailContainer>
          {room?.room_images
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
              Array(Math.max(0, 4 - room?.room_images.length))
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
      </RoomImageContainer>

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

export default RoomImageGrid;
