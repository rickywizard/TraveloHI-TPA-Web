import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import styled from "styled-components";
import InputField from "../../components/InputField";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import LoadingPopup from "../../components/LoadingPopup";

export interface ILoginData {
  email: string;
  password: string;
}

const Headline = styled.h2`
  margin-bottom: 1rem;
  color: var(--black);
`;

const Container = styled.div`
  background-color: var(--blue);
  min-height: 100vh; /* Menjaga tinggi minimal agar sesuai tinggi viewport */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const FormCard = styled.div`
  background-color: var(--white);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 5px;
`;

const RegisterButton = styled.button`
  border: none;
  outline: 0;
  background-color: var(--blue);
  color: var(--white);
  padding: 0.5rem 0;
  border-radius: 5px;
  width: 100%;
  margin-top: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: var(--blue-shade);
  }
`;

const Button = styled.button`
  border: none;
  outline: 0;
  background-color: var(--orange);
  color: var(--white);
  padding: 0.5rem 0;
  border-radius: 5px;
  width: 100%;
  margin-top: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: var(--orange-shade);
  }
`;

const OTPButton = styled.button`
  border: 1px solid var(--grey);
  outline: 0;
  background-color: var(--white);
  color: var(--black);
  font-weight: bold;
  padding: 0.5rem 0;
  border-radius: 5px;
  width: 100%;
  margin-bottom: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: var(--gray);
  }
`;

const ErrorDiv = styled.div`
  color: red;
  font-size: 0.875rem;
`;

const Border = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;

  p {
    color: var(--grey);
    font-size: 0.875rem;
  }

  hr {
    flex: 1;
    border: none;
    border-top: 1.25px solid var(--grey);
    margin: 0 auto; /* Jarak antara garis dengan elemen lainnya */
  }
`;

const PasswordLink = styled.button`
  background: transparent;
  outline: 0;
  border: none;
  margin: 0.5rem 0;
  color: var(--blue);
  font-size: 0.875rem;

  &:hover {
    text-decoration: underline;
  }
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const recaptcha = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState<ILoginData>({
    email: "",
    password: "",
  });

  const { login, errorMessage, isLoading } = useAuth();

  useEffect(() => {
    if (sessionStorage.getItem("sentOTP")) {
      sessionStorage.removeItem("sentOTP");
    }
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (!emailRegex.test(formData.email)) {
      console.error("Format email tidak valid");
      return;
    }

    const captchaValue = recaptcha.current?.getValue();

    if (!captchaValue) {
      alert("ReCAPTCHA not verified!");
      return;
    } else {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/verify_captcha",
          {
            captchaValue,
          }
        );

        const data = response.data;

        if (data.success) {
          try {
            await login(formData);
            setError("");
          } catch (error) {
            console.log("Login error: ", error);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error verifying captcha:", error.response?.data.error);
        }
      }
    }
  };

  const handleNext = () => {
    if (formData.email.trim() === "") {
      setError("Email must be filled");
      return;
    }
    setError("");
    setIsPasswordVisible(true);
  };

  const handlePageOTP = () => {
    if (formData.email.trim() === "") {
      setError("Fill email to send OTP");
      return;
    }
    setError("");
    navigate(`/login-otp?email=${encodeURIComponent(formData.email)}`);
  };

  const handleForgotPage = () => {
    if (formData.email.trim() === "") {
      setError("Fill email to reset password");
      return;
    }
    setError("");
    navigate(`/forgot-password?email=${encodeURIComponent(formData.email)}`);
  };

  return (
    <Container>
      <LoadingPopup isLoading={isLoading} />
      <FormCard>
        <form onSubmit={handleSubmit}>
          <Headline>Login</Headline>

          <InputField
            labelName="Email"
            type="email"
            name="email"
            placeholder="travelohi@email.com"
            handleChange={handleInputChange}
            value={formData.email}
          />

          {isPasswordVisible && (
            <>
              <InputField
                labelName="Password"
                type="password"
                name="password"
                placeholder="Password"
                handleChange={handleInputChange}
                value={formData.password}
              />

              <Button type="submit">Login</Button>

              <ReCAPTCHA
                style={{ marginTop: "1rem" }}
                ref={recaptcha}
                sitekey={import.meta.env.VITE_SITE_KEY}
              />
            </>
          )}

          {!isPasswordVisible && (
            <>
              {error && <ErrorDiv>{error}</ErrorDiv>}

              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            </>
          )}

          {errorMessage && <ErrorDiv>{errorMessage}</ErrorDiv>}

          <Border>
            <hr />
            <p>atau login/daftar dengan</p>
            <hr />
          </Border>

          <OTPButton type="button" onClick={handlePageOTP}>
            Login with OTP
          </OTPButton>

          <Link to="/register">
            <RegisterButton>Daftar akun baru</RegisterButton>
          </Link>

          <PasswordLink type="button" onClick={handleForgotPage}>
            Lupa Password?
          </PasswordLink>
        </form>
      </FormCard>
    </Container>
  );
};

export default LoginPage;
