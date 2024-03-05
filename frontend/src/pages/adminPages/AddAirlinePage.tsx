import { useNavigate } from "react-router-dom"
import ErrorMessage from "../../components/ErrorMessage"
import InputField from "../../components/InputField"
import LoadingPopup from "../../components/LoadingPopup"
import { useEffect, useRef, useState } from "react"
import styled from "styled-components"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from "../../utils/firebase"
import dummy from "../../assets/dummy-post.jpg";
import axios from "axios"

const FormContainer = styled.div`
  background: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ImagePreview = styled.img`
  width: 100%;
  border-radius: 5px;
  object-fit: cover;
`;

const ImageUploader = styled.div`
  width: 400px;
  cursor: pointer;

  span {
    position: relative;
    bottom: 120px;
    display: grid;
    place-items: center;
    visibility: hidden;
  }

  &:hover {
    span {
      visibility: visible;
    }
  }
`;

const UploadLabel = styled.label`
  display: block;
  color: var(--text);
  font-size: 0.875rem;
`;

const ImageInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--grey);
  border-radius: 0.375rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  outline: 0;
  color: var(--text);

  &:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 0.125em rgba(66, 153, 225, 0.25);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;

  button {
    outline: 0;
    border: none;
    border-radius: 5px;
    padding: 0.5rem;
    color: var(--white);
    transition: 0.3s background;
    cursor: pointer;
  }

  button:nth-child(1) {
    background: var(--blue);
  }
  button:nth-child(1):hover {
    background: var(--blue-shade);
  }

  button:nth-child(2) {
    background: var(--red);
  }
  button:nth-child(2):hover {
    background: var(--red-shade);
  }
`;

const AddAirlinePage = () => {
  const navigate = useNavigate()
  const [readySend, setReadySend] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    image_url: ""
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const sendDataToBackend = async () => {
      setIsLoading(true);
      setReadySend(false);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/add_airline",
          formData,
          { withCredentials: true }
        );

        if (response.status === 201) {
          console.log(response.data.message);
          setIsLoading(false);
          navigate(-1);
        }
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.error);
        }
      }
    };

    // Pastikan image_url sudah terisi sebelum mengirim ke backend
    if (formData.image_url && readySend) {
      sendDataToBackend();
    }
  }, [formData, readySend]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setReadySend(true);

    // upload file gambar
    const file = fileInputRef.current?.files?.[0];

    if (file) {
      const storageRef = ref(storage, `promos/${file.name}`);

      // Upload ke storage
      await uploadBytes(storageRef, file);

      // Mendapatkan URL gambar dari Firebase Storage
      const imageUrl = await getDownloadURL(storageRef);

      console.log("Image uploaded successfully. URL:", imageUrl);

      // Mengatur URL gambar di objek formData
      setFormData((prevData) => ({
        ...prevData,
        image_url: imageUrl,
      }));
    }
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <FormContainer>
        <h2 style={{ marginBottom: "1rem" }}>Add Airline</h2>
        <form onSubmit={handleSubmit}>
          <ImageUploader onClick={handleUploaderClick}>
            <UploadLabel htmlFor="image">Airline Logo Image</UploadLabel>
            <ImageInput
              ref={fileInputRef}
              type="file"
              name="image_url"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
            <ImagePreview
              src={imagePreview ? imagePreview : dummy}
              alt="Preview"
            />
            <span>Upload Image</span>
          </ImageUploader>

          <InputField
            labelName="Airline Name"
            type="text"
            name="name"
            placeholder="Enter airline name"
            handleChange={handleInputChange}
            value={formData.name}
          />

          <ErrorMessage error={error} />

          <ButtonGroup>
            <button type="submit">Add Airline</button>

            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </>
  )
}

export default AddAirlinePage