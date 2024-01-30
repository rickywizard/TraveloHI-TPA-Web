import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import InputField from "../../components/InputField";
import styled from "styled-components";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export interface ILoginOTPData {
  email: string;
  otp: string;
}

const Container = styled.div`
  background-color: var(--blue);
  min-height: 100vh;
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

const EmailText = styled.p`
  font-size: 1rem;
  color: var(--text);
  text-align: center;
  margin-bottom: 1rem;

  span {
    font-weight: bold;
    color: var(--black);
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

const ResendContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  button {
    outline: 0;
    border: none;
    background: transparent;
    margin: 0.5rem 0;
    color: var(--blue);
    font-weight: bold;
    cursor: pointer;
    font-size: 0.875rem;

    &:hover {
      text-decoration: underline;
    }
  }

  span {
    font-size: 0.875rem;
    font-weight: bold;
  }
`;

const ErrorDiv = styled.div`
  color: red;
  font-size: 0.875rem;
`;

const OTPLoginPage = () => {
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";
  const [timeRemaining, setTimeRemaining] = useState<number>(60);

  const { loginOTP, errorMessage } = useAuth();

  const [formData, setFormData] = useState<ILoginOTPData>({
    email: email,
    otp: "",
  });

  const sendOTP = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/send_otp?email=${encodeURIComponent(email)}`
      );
      console.log(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error sending OTP:", error.response?.data.error);
      }
    }
  };

  useEffect(() => {
    if (timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      // Bersihkan interval saat komponen tidak lagi dimuat
      return () => clearInterval(interval);
    }
  }, [timeRemaining])

  useEffect(() => {
    const hasSendOTP = sessionStorage.getItem("sentOTP")

    if (!hasSendOTP) {
      sendOTP();

      sessionStorage.setItem("sentOTP", "true");
    }
  }, []);

  const handleResendClick = () => {
    sendOTP();
    setTimeRemaining(60);
  }

  // Handler input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      await loginOTP(formData);
    } catch (error) {
      console.log("Login error: ", error);
    }
  };

  return (
    <Container>
      <FormCard>
        <form onSubmit={handleSubmit}>
          <EmailText>
            OTP telah dikirimkan ke email <span>{email}</span>
          </EmailText>

          <InputField
            labelName=""
            type="text"
            name="otp"
            placeholder="OTP ex. 123456"
            handleChange={handleInputChange}
            value={formData.otp}
          />

          <Button type="submit">Verifikasi OTP</Button>

          {errorMessage && <ErrorDiv>{errorMessage}</ErrorDiv>}

          <ResendContainer>
            <button onClick={handleResendClick} disabled={timeRemaining > 0}>{timeRemaining < 1 ? "Resend OTP" : timeRemaining}</button>
          </ResendContainer>
        </form>
      </FormCard>
    </Container>
  );
};

export default OTPLoginPage;
