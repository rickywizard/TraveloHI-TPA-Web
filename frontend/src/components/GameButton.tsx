import { Link } from "react-router-dom";
import styled from "styled-components";
import gamegif from "../assets/game-button.gif";

const GameButton = () => {
  return (
    <LinkContainer to="/play-game">
      <img src={gamegif} alt="" />
    </LinkContainer>
  );
};

const LinkContainer = styled(Link)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;

  img {
    border-radius: 50%;
  }
`;

export default GameButton;
