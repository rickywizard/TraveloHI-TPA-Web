import styled from "styled-components";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { IChildren } from "../interfaces/children-interface";
import GameButton from "../components/GameButton";

const Template = styled.div`
  width: 100%;
`;

const InnerTemplate = styled.div`
  width: 100%;
  min-height: 100vh;
`;

const Main = styled.main`
  background-color: var(--white);
  max-width: 1024px;
  padding: 0 1.5rem;
  margin: 0 auto;
`;

const MainLayout = ({ children }: IChildren) => {
  return (
    <Template className="center">
      <InnerTemplate>
        <NavBar />
        <Main>{children}</Main>
        <GameButton />
        <Footer />
      </InnerTemplate>
    </Template>
  );
};

export default MainLayout;
