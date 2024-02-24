import styled from "styled-components";
import NavBar from "../components/NavBar";
import { IChildren } from "../interfaces/children-interface";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";

const Main = styled.main`
  @media (max-width: 768px) {
    overflow: hidden;
  }  
`;

const BaseLayout = ({ children }: IChildren) => {
  const { darkMode } = useTheme();

  return (
    <div>
      <NavBar />
      <Main className={darkMode ? 'dark' : 'light'}>{children}</Main>
      <Footer />
    </div>
  );
};

export default BaseLayout;
