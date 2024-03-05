import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dummy from "../../assets/dummy-post.jpg";
import axios from "axios";
import LoadingPopup from "../../components/LoadingPopup";

const AISearchPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  const handleSearchButtonClick = async () => {
    if (fileInputRef.current && fileInputRef.current.files) {
      const formData = new FormData();
      formData.append("image", fileInputRef.current.files[0]);

      try {
        const response = await axios.post(
          "http://localhost:5000/predict",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // console.log("Class", response.data.class);
        setSearchTerm(response.data.class);
        setSuccess(true);
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    }
  };

  useEffect(() => {
    if (success) {
      setIsLoading(true);
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
        navigate(`/search?term=${encodeURIComponent(searchTerm.trim())}`);
      }, 3000);

      // Cleanup the timeout to avoid memory leaks
      return () => clearTimeout(timeoutId);
    }
  }, [success]);

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <SearchContainer>
        <ImageUploader onClick={handleUploaderClick}>
          <UploadLabel htmlFor="image">
            Masukkan Gambar Untuk Dicari
          </UploadLabel>
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
        <SearchButton onClick={handleSearchButtonClick}>Cari</SearchButton>
      </SearchContainer>
    </>
  );
};

const SearchContainer = styled.div`
  width: 400px;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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

const SearchButton = styled.button`
  width: 100%;
  background: var(--blue);
  outline: 0;
  border: none;
  border-radius: 5px;
  padding: 0.5rem;
  color: var(--white);
  transition: 0.3s background;
  cursor: pointer;

  &:hover {
    background: var(--blue-shade);
  }
`;

export default AISearchPage;
