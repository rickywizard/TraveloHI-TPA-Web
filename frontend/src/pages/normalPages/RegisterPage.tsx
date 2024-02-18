import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputField from "../../components/InputField";
import styled from "styled-components";
import "../../styles/index.css";
import SelectField from "../../components/SelectField";
import up from "../../assets/arrow-up-from-bracket-solid.svg";
import dummy from "../../assets/dummy.webp";
import { storage } from "../../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ReCAPTCHA from "react-google-recaptcha";
import LoadingPopup from "../../components/LoadingPopup";
import ErrorMessage from "../../components/ErrorMessage";

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  date_of_birth: string;
  gender: string;
  profile_picture_url: string;
  security_question: string;
  security_answer: string;
  is_subscriber: boolean;
}

const RadioContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
`;
const CheckboxContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;

  & > p {
    color: var(--text);
    font-size: 0.875rem;
  }
`;

const Radio = styled.label`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;

  & > p {
    color: var(--text);
    font-size: 0.875rem;
  }
`;

const Headline = styled.h2`
  margin-bottom: 1rem;
  color: var(--black);
`;

const Button = styled.button`
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
  max-width: 520px;
  margin: 0 auto;
  border-radius: 5px;
`;

const Uploader = styled.div`
  --profile-size: 6rem;
  border-radius: var(--profile-size);
  cursor: pointer;
`;

const ImagePreview = styled.div`
  width: var(--profile-size);
  height: var(--profile-size);
  border-radius: var(--profile-size);
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UploadIcon = styled.div`
  position: relative;
  bottom: 1.5rem;
  left: 4.5rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: var(--gray);
  display: grid;
  place-items: center;
`;

const LoginLink = styled.p`
  text-align: center;
  margin: 0.5rem 0;
  color: var(--text);
  font-size: 0.875rem;

  span {
    font-weight: bold;
    color: var(--blue);
  }

  span:hover {
    text-decoration: underline;
  }
`;

const RegisterPage = () => {
  const [error, setError] = useState<string>("");
  const [readySend, setReadySend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const recaptcha = useRef<ReCAPTCHA>(null);

  const [formData, setFormData] = useState<RegisterData>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    date_of_birth: "",
    gender: "",
    profile_picture_url: "",
    security_question: "",
    security_answer: "",
    is_subscriber: false,
  });

  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState<string | null>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploaderClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Menampilkan pratinjau gambar
      setImagePreview(URL.createObjectURL(file));
    }
  };

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

  useEffect(() => {
    const sendDataToBackend = async () => {
      setIsLoading(true);
      setReadySend(false);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/register",
          formData
        );

        if (response.status === 200) {
          console.log(response.data.message);
          setIsLoading(false);
          navigate("/login");
        }
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          // console.log("Error register", error.response?.data.message);
          setError(error.response?.data.error);
        }
      }
    };

    if (formData.profile_picture_url && readySend) {
      sendDataToBackend();
    }
  }, [formData, readySend]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    console.log(formData);
    setReadySend(true);

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
          const file = fileInputRef.current?.files?.[0];

          if (file) {
            const storageRef = ref(storage, `profile_images/${file.name}`);

            // Upload ke storage
            await uploadBytes(storageRef, file);

            // Mendapatkan URL gambar dari Firebase Storage
            const imageUrl = await getDownloadURL(storageRef);

            console.log("Image uploaded successfully. URL:", imageUrl);

            // Mengatur URL gambar di objek formData
            setFormData((prevData) => ({
              ...prevData,
              profile_picture_url: imageUrl,
            }));
          } else {
            // Jika tidak ada file gambar yang disubmit, berikan nilai default pada profile_picture_url
            setFormData((prevData) => ({
              ...prevData,
              profile_picture_url:
                "https://firebasestorage.googleapis.com/v0/b/travelohi-f39a6.appspot.com/o/profile_images%2Fdummy.webp?alt=media&token=987e1dd5-9224-4d88-b522-9065cb958bb9",
            }));
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error("Error verifying captcha:", error.response?.data.error);
        }
      }
    }
  };

  return (
    <Container>
      <LoadingPopup isLoading={isLoading} />
      <FormCard>
        <form onSubmit={handleSubmit}>
          <Headline>Daftar Pengguna Baru</Headline>

          {/* input profile image */}
          <div className="center">
            <Uploader onClick={handleUploaderClick}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
              <ImagePreview>
                <ProfileImage
                  src={imagePreview ? imagePreview : dummy}
                  alt="Preview"
                />
              </ImagePreview>
              <UploadIcon>
                <img src={up} alt="upload" width="10px" />
              </UploadIcon>
            </Uploader>
          </div>

          {/* input first name */}
          <InputField
            labelName="Nama Depan"
            type="text"
            name="first_name"
            placeholder="Michael"
            handleChange={handleInputChange}
            value={formData.first_name}
          />

          {/* input last name */}
          <InputField
            labelName="Nama Belakang"
            type="text"
            name="last_name"
            placeholder="Myers"
            handleChange={handleInputChange}
            value={formData.last_name}
          />

          {/* input email */}
          <InputField
            labelName="Email"
            type="email"
            name="email"
            placeholder="travelohi@travelohi.com"
            handleChange={handleInputChange}
            value={formData.email}
          />

          {/* input password */}
          <InputField
            labelName="Password"
            type="password"
            name="password"
            placeholder="Password"
            handleChange={handleInputChange}
            value={formData.password}
          />

          {/* input date */}
          <InputField
            labelName="Tanggal Lahir"
            type="date"
            name="date_of_birth"
            placeholder=""
            handleChange={handleInputChange}
            value={formData.date_of_birth}
          />

          {/* input gender */}
          <RadioContainer>
            <Radio>
              <input
                type="radio"
                name="gender"
                value="Pria"
                onChange={handleInputChange}
              />{" "}
              <p>Pria</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="gender"
                value="Wanita"
                onChange={handleInputChange}
              />{" "}
              <p>Wanita</p>
            </Radio>
          </RadioContainer>

          {/* select security question */}
          <SelectField
            labelName="Pertanyaan Keamanan"
            name="security_question"
            options={[
              {
                value: "",
                label: "Pilih pertanyaan",
              },
              {
                value: "What is your favorite childhood pet's name?",
                label: "What is your favorite childhood pet's name?",
              },
              {
                value: "In which city where you born?",
                label: "In which city where you born?",
              },
              {
                value: "What is the name of your favorite book or movie?",
                label: "What is the name of your favorite book or movie?",
              },
              {
                value:
                  "What is the name of the elementary school you attended?",
                label:
                  "What is the name of the elementary school you attended?",
              },
              {
                value: "What is the model of your first car?",
                label: "What is the model of your first car?",
              },
            ]}
            value={formData.security_question}
            handleChange={handleInputChange}
          />

          {/* input security answer */}
          <InputField
            labelName="Jawaban Keamanan"
            type="text"
            name="security_answer"
            placeholder=""
            handleChange={handleInputChange}
            value={formData.security_answer}
          />

          {/* input checkbox */}
          <CheckboxContainer>
            <input
              type="checkbox"
              name="is_subscriber"
              onChange={handleInputChange}
            />
            <p>Dapatkan informasi terbaru</p>
          </CheckboxContainer>

          <ErrorMessage error={error} />

          <ReCAPTCHA
            style={{ marginTop: "0.5rem" }}
            ref={recaptcha}
            sitekey={import.meta.env.VITE_SITE_KEY}
          />
          
          <Button type="submit">Register</Button>

          <Link to="/login">
            <LoginLink>
              Sudah punya akun? <span>Login sekarang!</span>
            </LoginLink>
          </Link>
        </form>
      </FormCard>
    </Container>
  );
};

export default RegisterPage;
