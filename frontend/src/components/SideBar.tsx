import { FC, useState } from "react";
import logo from "../assets/TraveLoHI-plain.png";
import styled from "styled-components";
import user from "../assets/user-solid.svg";
import hotel from "../assets/hotel-solid.svg";
import plane from "../assets/plane-solid.svg";
import ticket from "../assets/ticket-solid.svg";
import mail from "../assets/envelope-solid.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import left from "../assets/caret-left-solid.svg";
import right from "../assets/caret-right-solid.svg";

const menuItems = [
  {
    name: "Manage User",
    icon: 0,
    route: "/admin/users",
  },
  {
    name: "Manage Hotel",
    icon: 1,
    route: "/admin/hotels",
  },
  {
    name: "Manage Flight",
    icon: 2,
    route: "/admin/airlines",
  },
  {
    name: "Manage Promo",
    icon: 3,
    route: "/admin/promos",
  },
  {
    name: "Newsletter Email",
    icon: 4,
    route: "/admin/newsletter",
  },
];

const iconMappings = [user, hotel, plane, ticket, mail];

const AdminText = styled.p`
  font-size: 0.75rem;
  margin-bottom: 1rem;
  color: var(--blue);
`;

interface ButtonProps {
  onClick: (item: string) => void;
  name: string;
  icon: number;
  isActive: boolean;
}

const Aside = styled.aside<{ $isSidebarVisible: boolean }>`
  // position: fixed;
  top: 0;
  left: 0;
  width: ${({ $isSidebarVisible }) => ($isSidebarVisible ? "18rem" : "4rem")};
  height: 100%;
  background: var(--white);
  transition: width 0.4s;
`;

const Logo = styled.div`
  margin-left: 1.5rem;
`

const Menu = styled.button`
  transition: background-color 0.3s ease;
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
  height: 3rem;
  width: 100%;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  padding: 0 1.5rem;
  color: var(--blue);
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;

  &.active {
    background-color: var(--blue);
    color: var(--white);
  }

  &:hover {
    background-color: var(--gray);
  }

  &.active:hover {
    background-color: var(--blue-shade);
  }
`;

const Icon = styled.img<{ $isActive: boolean }>`
  width: 1rem;
  filter: ${({ $isActive }) => ($isActive ? "brightness(0) invert(1);" : "")};
`;

const NavButton: FC<ButtonProps> = ({ onClick, name, icon, isActive }) => {
  const selectedIcon = iconMappings[icon];

  return (
    <Menu onClick={() => onClick(name)} className={isActive ? "active" : ""}>
      <Icon src={selectedIcon} alt={selectedIcon} $isActive={isActive} />
      <p>{name}</p>
    </Menu>
  );
};

const BackButton = styled.button`
  width: 18rem;
  height: 3rem;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  padding: 0 1.5rem;
  color: var(--blue);
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
  position: fixed;
  bottom: 3rem; 
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--gray);
  }
`;

const LogoutButton = styled.button`
  width: 18rem;
  height: 3rem;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  line-height: 1;
  padding: 0 1.5rem;
  color: var(--blue);
  background: transparent;
  border: 0;
  cursor: pointer;
  text-align: left;
  position: fixed;
  bottom: 0;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--gray);
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  button {
    margin-top: 0.5rem;
  }
`;

const Arrow = styled.div`
  border-radius: 50%;
  padding: 0.5rem 1rem;
  transition: 0.3s ease-in;

  &:hover {
    background: var(--gray);
  }
`;

const ToggleButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--blue);
`;

const SideBar = () => {
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [activeItem, setActiveItem] = useState<string>("");
  const navigate = useNavigate();

  const { logout } = useAuth();

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const handleSelect = (item: string) => {
    setActiveItem(item !== activeItem ? item : "");
  };

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/");
    } catch (error) {
      console.log("Logout error: ", error);
    }
  };

  return (
    <Aside $isSidebarVisible={isSidebarVisible}>
      {isSidebarVisible ? (
        <>
          <Header>
            <Logo>
              <img src={logo} alt="TraveLoHI" width="200px" />
              <AdminText>For Admin</AdminText>
            </Logo>
            <ToggleButton onClick={toggleSidebar}>
              <Arrow>
                <img src={left} alt="‹" width="16px" />
              </Arrow>
            </ToggleButton>
          </Header>

          {menuItems.map((item, index) => (
            <div key={index}>
              <Link to={item.route}>
                <NavButton
                  onClick={handleSelect}
                  name={item.name}
                  icon={item.icon}
                  isActive={activeItem === item.name}
                />
              </Link>
            </div>
          ))}

          {/* Tombol Back */}
          <Link to="/">
            <BackButton>Back to Home</BackButton>
          </Link>

          {/* Tombol Logout */}
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </>
      ) : (
        <Header>
          <ToggleButton onClick={toggleSidebar}>
            <Arrow>
              <img src={right} alt=">" width="16px" />
            </Arrow>
          </ToggleButton>
        </Header>
      )}
    </Aside>
  );
};

export default SideBar;
