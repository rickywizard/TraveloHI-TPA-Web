import styled from "styled-components";
import NavBar from "../components/NavBar";
import { IChildren } from "../interfaces/children-interface";

const Main = styled.main`
  background-color: var(--white);
  padding: 0 2rem;
  margin: 0 auto;
`;

const NormalLayout = ({ children }: IChildren) => {
  return (
    <>
      <NavBar />
      <Main>{children}</Main>
    </>
  );
};

export default NormalLayout;
