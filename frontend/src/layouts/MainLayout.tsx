import styled from "styled-components";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import { IChildren } from "../interfaces/children-interface";

const Main = styled.main`
  background-color: var(--gray);
  height: 100vh;
  width: 100%;
`;

const MainLayout = ({ children }: IChildren) => {
  return (
    <>
      <NavBar />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default MainLayout;
