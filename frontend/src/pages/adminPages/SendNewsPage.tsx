import styled from "styled-components";
import InputField from "../../components/InputField";
import { useState } from "react";
import axios from "axios";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingPopup from "../../components/LoadingPopup";

interface NewsData {
  subject: string;
  body: string;
}

const SuccessPopup = styled.div<{ visible: string }>`
  display: ${(props) => (props.visible ? "flex" : "none")};
  align-items: center;
  justify-content: space-between;
  background-color: var(--green);
  color: var(--white);
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 1rem;
  z-index: 1000;

  button {
    background-color: transparent;
    color: #fff;
    border: none;
    border-radius: 50%;
    padding: 0.1rem 0.5rem;
    cursor: pointer;
    transition: 0.3s background-color;

    &:hover {
      background-color: var(--green-shade);
    }
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const ContentContainer = styled.div`
  width: 50rem;
  background-color: var(--white);
  padding: 1.5rem;
  border-radius: 0.75rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 10rem;
  padding: 0.75rem;
  border: 1px solid var(--grey);
  border-radius: 5px;
  box-sizing: border-box;
  resize: none;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-top: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const SendNewsPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [formData, setFormData] = useState<NewsData>({
    subject: "",
    body: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/send_newsletter",
        formData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        setError("");
        setSuccess(response.data.message);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  const handleCloseSuccessPopup = () => {
    setSuccess("");
  };

  return (
    <>
      <SuccessPopup visible={success}>
        <p>{success}</p>
        <button onClick={handleCloseSuccessPopup}>X</button>
      </SuccessPopup>
      <Container>
        <LoadingPopup isLoading={isLoading} />
        <ContentContainer>
          <h2>Send Newsletter</h2>
          <form onSubmit={handleSubmit}>
            <InputField
              labelName="Subject"
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              handleChange={handleInputChange}
            />
            <Label htmlFor="body">Body</Label>
            <TextArea
              name="body"
              placeholder="Type your newsletter here..."
              value={formData.body}
              onChange={handleInputChange}
            />

            <ErrorMessage error={error} />

            <Button type="submit">Send</Button>
          </form>
        </ContentContainer>
      </Container>
    </>
  );
};

export default SendNewsPage;
