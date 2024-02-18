import styled from "styled-components";
import logo from "../assets/TraveLoHI-plain.png";
import bank from "../assets/bank.png";
import { Link } from "react-router-dom";

const FooterContainer = styled.footer`
  background-color: var(--black-soft);
  color: var(--white);
  padding: 1rem;

  hr {
    border: 0;
    border-top: 1px solid var(--text);
  }
`;

const UpFooter = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 1rem;
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 30%;
  margin-left: 1rem;
`;

const RightSection = styled.div`
  width: 70%;
  display: flex;
  justify-content: space-around;
`;

const Links = styled.div`
  display: flex;
  flex-direction: column;

  a {
    color: var(--grey);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  a:hover {
    color: var(--white);
    text-decoration: underline;
  }
`;

const SocMedContainer = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  img {
    filter: grayscale(100%);
    opacity: 0.5;
  }

  &:hover {
    img {
      filter: grayscale(0);
      opacity: 1;
    }

    p {
      color: var(--white);
      text-decoration: underline;
    }
  }
`;

const Copyright = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: var(--white);
  font-size: 0.875rem;
  font-weight: semi-bold;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <UpFooter>
        <LeftSection>
          <img src={logo} alt="TraveLoHI" width="300px" />
          <h4 style={{ marginBottom: "0.5rem" }}>Payment Partners</h4>
          <img src={bank} alt="bank" width="300px" />
        </LeftSection>
        <RightSection>
          <Links>
            <h4 style={{ marginBottom: "1rem" }}>About Traveloka</h4>
            <Link to="/help-center">Help Center</Link>
            <Link to="/advertisement">Advertisement</Link>
            <Link to="/articles">Articles</Link>
            <Link to="/about-us">About Us</Link>
          </Links>
          <Links>
            <h4 style={{ marginBottom: "1rem" }}>Social Media</h4>
            <SocMedContainer
              href="https://twitter.com/Traveloka"
              target="_blank"
            >
              <img
                src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/f/f1bc6ea729dc438511f45244f72d6380.svg"
                alt="X"
                width="16px"
              />
              <p>Twitter (X)</p>
            </SocMedContainer>
            <SocMedContainer
              href="https://www.facebook.com/Traveloka.id"
              target="_blank"
            >
              <img
                src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/6/6904cd2e74ef73120833cff12185a320.svg"
                alt="FB"
                width="16px"
              />
              <p>Facebook</p>
            </SocMedContainer>
            <SocMedContainer
              href="https://www.instagram.com/traveloka.id/"
              target="_blank"
            >
              <img
                src="	https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/6/62a2fc240d7e00b05d0d6f6b4e785110.svg"
                alt="IG"
                width="16px"
              />
              <p>Instagram</p>
            </SocMedContainer>
            <SocMedContainer
              href="https://www.youtube.com/Traveloka"
              target="_blank"
            >
              <img
                src="	https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/b/b593add66303beb2a0cae9e96963e68b.svg"
                alt="YT"
                width="16px"
              />
              <p>Youtube</p>
            </SocMedContainer>
            <SocMedContainer
              href="https://www.tiktok.com/@traveloka.id"
              target="_blank"
            >
              <img
                src="https://d1785e74lyxkqq.cloudfront.net/_next/static/v2/4/471f17c1510d49a98bec08a48b84c607.svg"
                alt="TT"
                width="16px"
              />
              <p>Tiktok</p>
            </SocMedContainer>
          </Links>
          <Links>
            <h4 style={{ marginBottom: "1rem" }}>Others</h4>
            <a
              href="https://corporates.ctv.traveloka.com/en-id/"
              target="_blank"
            >
              Traveloka for Corporates
            </a>
            <a href="https://www.traveloka.com/en-id/affiliate" target="_blank">
              Traveloka Affiliate
            </a>
            <a href="https://www.traveloka.com/en-id/explore" target="_blank">
              Blog
            </a>
            <a
              href="https://www.traveloka.com/en-id/privacy-notice"
              target="_blank"
            >
              Privacy Notice
            </a>
            <a
              href="https://www.traveloka.com/en-id/termsandconditions"
              target="_blank"
            >
              Terms & Conditions
            </a>
            <a href="https://tera.traveloka.com/v2/landing" target="_blank">
              Register Your Accomodation
            </a>
            <a href="https://axes.traveloka.com/" target="_blank">
              Register Your Experience Bussiness
            </a>
            <a href="https://press.traveloka.com/" target="_blank">
              TraveLoHI Press Room
            </a>
            <a href="https://www.traveloka.com/en-id/ads" target="_blank">
              TraveLoHI Ads
            </a>
          </Links>
        </RightSection>
      </UpFooter>
      <hr />
      <Copyright>Copyright © 2024 Traveloka. All rights reserved</Copyright>
    </FooterContainer>
  );
};

export default Footer;
