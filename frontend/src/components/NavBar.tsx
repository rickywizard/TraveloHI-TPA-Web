import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { KeyboardEvent, useState } from "react";
import logo from "../assets/TraveLoHI-plain.png";
import styled from "styled-components";
import dummy from "../assets/dummy.webp";
import glass from "../assets/magnifying-glass-solid.svg";
import wallet from "../assets/wallet-solid.svg";
import debt from "../assets/tag-solid.svg";
import credit from "../assets/credit-card-solid.svg";
import cart from "../assets/cart-shopping-solid.svg";
import theme from "../assets/circle-half-stroke-solid.svg";
import { useCurrency } from "../context/CurrencyContext";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { useRecentSearch } from "../hooks/useRecentSearch";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Nav = styled.nav`
  width: 100%;
  height: 4.5rem;
  // background-color: var(--white);
  box-shadow: 0rem 1rem 1rem -1rem var(--grey);
  display: flex;
  padding: 0.25rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;

  @media (max-width: 768px) {
    .to-hide {
      display: none;
    }

    .burger {
      display: block;
    }

    .logo {
      width: 80px;
    }
  }
`;

const Burger = styled.div`
  color: var(--blue);
  font-size: 1.5em;
  cursor: pointer;
  border-radius: 50%;
  padding: 0 0.5rem;
  transition: 0.3s ease-in;
  display: none;

  &:hover {
    background: var(--gray);
  }
`;

const ThemeButton = styled.div`
  cursor: pointer;
  border-radius: 50%;
  padding: 0.5rem;
  transition: 0.3s ease-in;

  &:hover {
    background: var(--gray);
  }
`;

const SearchBar = styled.div`
  position: relative;

  input {
    padding: 0.25rem 0.5rem;
    border: 1px var(--grey) solid;
    border-radius: 5px;
    width: calc(100% + 0.5rem);
  }

  &::after {
    content: "";
    background: url(${glass}) no-repeat center center;
    background-size: contain;
    width: 1rem;
    height: 1rem;
    position: absolute;
    top: 50%;
    right: 0rem;
    transform: translateY(-50%);
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
  padding: 0.5rem;
  transition: 0.3s ease-in;

  span {
    color: var(--blue);
  }

  &:hover {
    background-color: var(--gray);
    border-radius: 5px;
  }
`;

const AccountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const RegisterLogoutButton = styled.div`
  background-color: var(--blue);
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: var(--blue-shade);
  }
`;

const Profile = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 1.5rem;
  height: 1.5rem;
`;

const Flag = styled.img`
  border: 2px var(--blue) solid;
  border-radius: 50%;
  padding: 0;
`;

const AdminButton = styled.button`
  border: none;
  outline: 0;
  // background-color: var(--white);
  color: var(--blue);
  padding: 0.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease-in;

  &:hover {
    background-color: var(--gray);
  }
`;

const Dropdown = styled.div`
  position: relative;

  .dark:hover {
    background-color: var(--black-back);
  }
`;

const DropdownContent = styled.div`
  width: max-content;
  position: absolute;
  top: 100%;
  left: 0;
  // background-color: var(--white);
  box-shadow: 1px 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .currency {
    transition: 0.3s ease-in;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 0 0.5rem;
    gap: 0.5rem;
    cursor: pointer;
  }

  .currency:hover {
    background-color: var(--gray);
  }

  .dark {
    background-color: var(--black-back);
  }
`;

const TravelohiPay = styled.div`
  display: flex;
  justify-content: start;

  button {
    outline: 0;
    border: none;
    // background-color: transparent;
    border-radius: 5px;
    transition: 0.3s ease-in;
    padding: 5px;
    cursor: pointer;
  }

  button::before {
    margin-right: 5px;
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: middle;
    display: inline-block;
    width: 20px;
  }

  button#hi__wallet::before {
    content: url(${wallet});
  }

  button#credit__card::before {
    content: url(${credit});
  }

  button#hi__debt::before {
    content: url(${debt});
  }

  button:hover {
    background-color: var(--gray);
  }
`;

const AIButton = styled.button`
  width: 100%;
  font-size: 0.875rem;
  outline: 0;
  border: none;
  padding: 0.5rem;
  border-radius: 5px;
  background-color: var(--blue);
  color: white;
  transition: 0.3s background-color;
  cursor: pointer;

  &:hover {
    background-color: var(--blue-shade);
  }
`

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { setCurrency } = useCurrency();
  const { data } = useRecentSearch();

  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showPayDropdown, setShowPayDropdown] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState("IDR");

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchEnter = async (e: KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      // Redirect to search page with the search term
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/save_search",
          { search_word: searchTerm },
          { withCredentials: true }
        );

        if (response.status === 200) {
          console.log(response.data.message);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.error);
        }
      }
      setShowSearchDropdown(false);
      navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    setCurrency(currency);
    setShowCurrencyDropdown(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout error: ", error);
    }
  };

  return (
    <Header className="center">
      <Nav className={darkMode ? "dark" : "light"}>
        {user?.is_admin && (
          <Link to="/admin">
            <AdminButton className={darkMode ? "dark" : "light"}>
              Admin
            </AdminButton>
          </Link>
        )}

        {/* burger menu */}
        <Burger className="burger">☰</Burger>

        {/* Theme button */}
        <ThemeButton onClick={toggleDarkMode}>
          <img src={theme} alt="❤" width="16px" />
        </ThemeButton>

        {/* logo */}
        <div>
          <Link to="/" className="logo">
            <img src={logo} alt="TraveLoHI" width="150px" />
          </Link>
        </div>

        {/* search bar */}
        <SearchBar onClick={() => setShowSearchDropdown(!showSearchDropdown)}>
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearchInputChange}
            onKeyDown={handleSearchEnter}
          />
          {showSearchDropdown && (
            <DropdownContent
              className={darkMode ? "dark" : "light"}
              style={{ width: "100%" }}
            >
              <Link to="/ai-search">
                <AIButton>Coba Pencarian AI Kami</AIButton>
              </Link>
              <h5>Pencarian Sebelumnya</h5>
              {data.recent.map((rec, index) => (
                <p style={{ fontSize: "0.875rem" }} key={index}>
                  {rec.search_word}
                </p>
              ))}
              <h5>Pencarian Terpopuler</h5>
              {data.popular.map((pop, index) => (
                <p style={{ fontSize: "0.875rem" }} key={index}>
                  {pop.search_word}
                </p>
              ))}
            </DropdownContent>
          )}
        </SearchBar>

        {/* cart */}
        <Link to="/cart" className="to-hide">
          <Menu>
            <img src={cart} alt="cart" width="20px" />
            <p>Keranjang</p>
          </Menu>
        </Link>
        {/* pesanan saya */}
        <Link to="/my-order" className="to-hide">
          <Menu>
            <img
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/8/8c9954122d8006592fbcbd4a82ac994c.svg"
              alt="history"
            />
            <p>Pesanan Saya</p>
          </Menu>
        </Link>

        {/* currency */}
        <Dropdown
          onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
          className="to-hide"
        >
          <Menu className={darkMode ? "dark" : "light"}>
            <Flag
              src={
                selectedCurrency === "IDR"
                  ? "https://static.vecteezy.com/system/resources/previews/011/571/451/non_2x/circle-flag-of-indonesia-free-png.png"
                  : "https://vectorflags.s3-us-west-2.amazonaws.com/flags/us-circle-01.png"
              }
              alt="flag"
              width="20px"
            />
            <p>{selectedCurrency}</p>
            <img
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/a/abdf7b00a3ad782bbad1f00c298a3c30.svg"
              alt="▼"
            />
          </Menu>

          {showCurrencyDropdown && (
            <DropdownContent className={darkMode ? "dark" : "light"}>
              <div
                className="currency"
                onClick={() => handleCurrencyChange("IDR")}
              >
                <Flag
                  src={
                    "https://static.vecteezy.com/system/resources/previews/011/571/451/non_2x/circle-flag-of-indonesia-free-png.png"
                  }
                  alt="flag"
                  width="20px"
                />
                <span>IDR</span>
              </div>
              <div
                className="currency"
                onClick={() => handleCurrencyChange("USD")}
              >
                <Flag
                  src={
                    "https://vectorflags.s3-us-west-2.amazonaws.com/flags/us-circle-01.png"
                  }
                  alt="flag"
                  width="20px"
                />
                <span>USD</span>
              </div>
            </DropdownContent>
          )}
        </Dropdown>

        {/* pay */}
        <Dropdown
          onClick={() => setShowPayDropdown(!showPayDropdown)}
          className="to-hide"
        >
          <Menu className={darkMode ? "dark" : "light"}>
            <img
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/6/6c5690b014faad362b0d07ebe1e24fdf.svg"
              alt=""
            />
            <p>Bayar</p>
            <img
              src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/a/abdf7b00a3ad782bbad1f00c298a3c30.svg"
              alt="▼"
            />
          </Menu>
          {showPayDropdown && (
            <DropdownContent className={darkMode ? "dark" : "light"}>
              <p>
                <b>Payment</b>
              </p>

              <p>From TraveLoHI</p>
              <TravelohiPay>
                <button id="hi__wallet">HI Wallet</button>
                <button id="credit__card">Credit Card</button>
              </TravelohiPay>

              <p>Another Method</p>
              <TravelohiPay>
                <button id="hi__debt">HI Debt</button>
              </TravelohiPay>
            </DropdownContent>
          )}
        </Dropdown>

        {/* Account things */}
        <div className="to-hide">
          {user ? (
            // profile & logout
            <AccountContainer>
              <Link to="/profile">
                <Menu>
                  <div>
                    <Profile src={user.profile_picture_url} alt="👤" />
                  </div>
                  <p>
                    {user.first_name} {user.last_name}
                  </p>
                </Menu>
              </Link>
              <RegisterLogoutButton onClick={handleLogout}>
                Log out
              </RegisterLogoutButton>
            </AccountContainer>
          ) : (
            // no user and register
            <AccountContainer>
              <Link to="/login">
                <Menu>
                  <div>
                    <Profile src={dummy} alt="👤" width="24px" />
                  </div>
                  <p>Log in</p>
                </Menu>
              </Link>
              <Link to="/register">
                <RegisterLogoutButton>Daftar</RegisterLogoutButton>
              </Link>
            </AccountContainer>
          )}
        </div>
      </Nav>
    </Header>
  );
};

export default NavBar;
