import styled from "styled-components";
import loadingSpinner from "../assets/loading.gif";

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const LoadingSpinner = styled.img`
  width: 50px;
  height: 50px;
`;

const LoadingPopup = ({ isLoading }: { isLoading: boolean | undefined}) => {
  if (!isLoading) {
    return null;
  }

  return (
    <LoadingOverlay>
      <LoadingSpinner src={loadingSpinner} alt="Loading" />
    </LoadingOverlay>
  );
};

export default LoadingPopup;
