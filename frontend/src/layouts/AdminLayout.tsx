import styled from "styled-components"
import SideBar from "../components/SideBar"
import { IChildren } from "../interfaces/children-interface"
import '../styles/index.css'

const LayoutContainer = styled.div`
  display: flex;
`

const Main = styled.main`
  flex: 1;
  padding: 1.5rem;
  background-color: var(--gray);
  height: 100vh;
  overflow-y: auto;
`

const AdminLayout = ({ children }: IChildren) => {
  return (
    <LayoutContainer>
      <SideBar />
      <Main>{children}</Main>
    </LayoutContainer>
  )
}

export default AdminLayout