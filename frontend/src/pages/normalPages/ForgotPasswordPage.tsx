import styled from "styled-components";
import InputField from "../../components/InputField";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import LoadingPopup from "../../components/LoadingPopup";
import ErrorMessage from "../../components/ErrorMessage";

export interface IForgotPasswordData {
  email: string;
  new_password: string;
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

const AnswerButton = styled.button`
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

const Text = styled.p`
  margin: 0.5rem 0;
  font-weight: bold;
`;

const BackLogin = styled.button`
  background: transparent;
  outline: 0;
  border: none;
  margin: 0.5rem 0;
  color: var(--blue);
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const location = useLocation();
  const email = new URLSearchParams(location.search).get("email") || "";

  const [securityQuestion, setSecurityQuestion] = useState<string>("");
  const [securityAnswer, setSecurityAnswer] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<IForgotPasswordData>({
    email: email,
    new_password: "",
  });

  useEffect(() => {
    const fetchSecurityQuestion = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/get_security_question?email=${email}`
        );

        if (response.status === 200) {
          setSecurityQuestion(response.data.security_question);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          console.error(
            "Failed to fetch security question",
            error.response?.data.error
          );
        }
      }
    };

    fetchSecurityQuestion();
  }, [email]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCheckAnswer = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/check_security_answer",
        {
          email: email,
          security_answer: securityAnswer,
        }
      );
      if (response.status === 200) {
        console.log(response.data.message);
        setIsPasswordVisible(true);
        setError("");
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        // console.error("Failed to answer", error.response?.data.error);
        setError(error.response?.data.error);
      }
    }
  };

  const handleSubmitPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/update_password",
        formData
      );

      if (response.status === 200) {
        setError("");
        console.log(response.data.message);
        setIsLoading(false);
        navigate("/login");
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  return (
    <Container>
      <LoadingPopup isLoading={isLoading} />
      <FormCard>
        <form onSubmit={handleSubmitPassword}>
          {/* Pertanyaan */}
          <Text>{securityQuestion}</Text>

          <InputField
            labelName=""
            type="text"
            name="security_answer"
            placeholder="Jawaban"
            handleChange={(e) => setSecurityAnswer(e.target.value)}
            value={securityAnswer}
          />

          {!isPasswordVisible && (
            <ErrorMessage error={error} />
          )}

          <AnswerButton type="button" onClick={handleCheckAnswer}>
            Jawab
          </AnswerButton>

          {isPasswordVisible && (
            <>
              <Text>Masukkan Password Baru</Text>
              <InputField
                labelName=""
                type="password"
                name="new_password"
                placeholder="New Password"
                handleChange={handleInputChange}
                value={formData.new_password}
              />

              <ErrorMessage error={error} />

              <Button type="submit">Konfirmasi Password Baru</Button>
            </>
          )}
          <Link to="/login">
            <BackLogin>Kembali ke login</BackLogin>
          </Link>
        </form>
      </FormCard>
    </Container>
  );
};

export default ForgotPasswordPage;
