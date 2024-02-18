import styled from "styled-components";
import NavBar from "../components/NavBar";
import { IChildren } from "../interfaces/children-interface";
import Footer from "../components/Footer";

const Main = styled.main`
  background-color: var(--white);
`;

const BaseLayout = ({ children }: IChildren) => {
  return (
    <>
      <NavBar />
      <Main>{children}</Main>
      <Footer />
    </>
  );
};

export default BaseLayout;
