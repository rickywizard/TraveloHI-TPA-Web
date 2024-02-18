import styled from "styled-components";

interface ModalData {
  showModal: boolean,
  handleCloseModal: () => void;
  handlePrevSlide: () => void
  handleNextSlide: () => void
  selectedImage: string | null;
}

const ModalContainer = styled.div<{ $show: boolean }>`
  display: ${({ $show }) => ($show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 15;
  overflow: auto;
`;

const ModalContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const ModalImage = styled.img`
  border-radius: 5px;
`;

const ModalImageContainer = styled.div`
  position: relative;
`;

const ModalPrevButton = styled.span`
  position: absolute;
  top: 50%;
  left: -3rem;
  font-size: 3rem;
  color: white;
  cursor: pointer;
  transform: translateY(-50%);
  transition: 0.3s color;

  &:hover {
    color: var(--grey);
  }
`;

const ModalNextButton = styled.span`
  position: absolute;
  top: 50%;
  right: -3rem;
  font-size: 3rem;
  color: white;
  cursor: pointer;
  transform: translateY(-50%);
  transition: 0.3s color;

  &:hover {
    color: var(--grey);
  }
`;

const CloseButton = styled.span`
  color: white;
  font-size: 3rem;
  position: absolute;
  right: 2rem;
  cursor: pointer;
`;

const SliderModal = ( { showModal, handleCloseModal, handlePrevSlide, handleNextSlide, selectedImage }: ModalData ) => {
  return (
    <ModalContainer $show={showModal}>
      <CloseButton onClick={handleCloseModal}>&times;</CloseButton>
      <ModalContent>
        <ModalImageContainer>
          <ModalPrevButton onClick={handlePrevSlide}>&lt;</ModalPrevButton>
          <ModalImage src={selectedImage || ""} alt="Modal" />
          <ModalNextButton onClick={handleNextSlide}>&gt;</ModalNextButton>
        </ModalImageContainer>
      </ModalContent>
    </ModalContainer>
  );
};

export default SliderModal;
