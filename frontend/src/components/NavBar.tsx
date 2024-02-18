import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import logo from "../assets/TraveLoHI-plain.png";
import styled from "styled-components";
import dummy from "../assets/dummy.webp";
import glass from "../assets/magnifying-glass-solid.svg";
import wallet from "../assets/wallet-solid.svg";
import debt from "../assets/tag-solid.svg";
import credit from "../assets/credit-card-solid.svg";
import cart from "../assets/cart-shopping-solid.svg";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
`;

const Nav = styled.nav`
  width: 100%;
  height: 4.5rem;
  background-color: var(--white);
  box-shadow: 0rem 1rem 1rem -1rem var(--grey);
  display: flex;
  padding: 0.25rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

// const Burger = styled.div`
//   color: var(--blue);
//   font-size: 1.5em;
//   cursor: pointer;
//   border-radius: 50%;
//   padding: 0 0.5rem;
//   transition: 0.3s ease-in;

//   &:hover {
//     background: var(--gray);
//   }
// `;

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
  background-color: var(--white);
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
`;

const DropdownContent = styled.div`
  width: max-content;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
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
`;

const TravelohiPay = styled.div`
  display: flex;
  justify-content: start;

  button {
    outline: 0;
    border: none;
    background-color: transparent;
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

const NavBar = () => {
  const { user, logout } = useAuth();

  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showPayDropdown, setShowPayDropdown] = useState(false);

  const [selectedCurrency, setSelectedCurrency] = useState("IDR");

  const handleCurrencyChange = (currency: string) => {
    setSelectedCurrency(currency);
    setShowCurrencyDropdown(false); // Tutup dropdown setelah memilih mata uang
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
      <Nav>
        {user?.is_admin && (
          <Link to="/admin">
            <AdminButton>Admin Page</AdminButton>
          </Link>
        )}

        {/* burger menu */}
        {/* <Burger>☰</Burger> */}

        {/* logo */}
        <Link to="/">
          <img src={logo} alt="TraveLoHI" width="150px" />
        </Link>

        {/* search bar */}
        <SearchBar>
          <input type="text" placeholder="Search..." />
        </SearchBar>

        {/* cart */}
        <Link to="/cart">
          <Menu>
            <img
              src={cart}
              alt="cart"
              width="20px"
            />
            <p>Keranjang</p>
          </Menu>
        </Link>
        {/* pesanan saya */}
        <Link to="/my-order">
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
        >
          <Menu>
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
            <DropdownContent>
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
        <Dropdown onClick={() => setShowPayDropdown(!showPayDropdown)}>
          <Menu>
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
            <DropdownContent>
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
        {user ? (
          // profile & logout
          <AccountContainer>
            <Link to="/profile">
              <Menu>
                <div>
                  <Profile
                    src={user.profile_picture_url}
                    alt="👤"
                  />
                </div>
                <p>
                  {user.first_name} {user.last_name} <br />
                  <span>{user.points} pts.</span>
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
      </Nav>
    </Header>
  );
};

export default NavBar;
