import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import dummy from "../../assets/dummy-post.jpg";
import { storage } from "../../utils/firebase";
import InputField from "../../components/InputField";

interface HotelData {
  name: string;
  address: string;
  star: string;
  image_url: string[];
}

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

const RadioContainer = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 0.5rem;
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

const AddHotelPage = () => {
  const [formData, setFormData] = useState<HotelData>({
    name: "",
    address: "",
    star: "",
    image_url: [],
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
      setImagePreview(URL.createObjectURL(file));
    }
  };

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
      // setFormData((prevData) => ({
      //   ...prevData,
      //   image_url: imageUrl,
      // }));
    }
  };

  return (
    <FormContainer>
      <h2 style={{ marginBottom: "1rem" }}>Add Promo</h2>
      <form onSubmit={handleSubmit}>
        <ImageUploader onClick={handleUploaderClick}>
          <UploadLabel htmlFor="image">Promo Image</UploadLabel>
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
          labelName="Hotel Name"
          type="text"
          name="name"
          placeholder="Enter hotel name"
          handleChange={handleInputChange}
          value={formData.name}
        />
        <InputField
          labelName="Hotel Address"
          type="text"
          name="address"
          placeholder="Enter hotel address"
          handleChange={handleInputChange}
          value={formData.address}
        />

        <RadioContainer>
            <Radio>
              <input
                type="radio"
                name="star"
                value="1"
                onChange={handleInputChange}
              />{" "}
              <p>1</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="2"
                onChange={handleInputChange}
              />{" "}
              <p>2</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="3"
                onChange={handleInputChange}
              />{" "}
              <p>3</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="4"
                onChange={handleInputChange}
              />{" "}
              <p>4</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="5"
                onChange={handleInputChange}
              />{" "}
              <p>5</p>
            </Radio>
          </RadioContainer>

        <ButtonGroup>
          <button type="submit">Add Promo</button>

          <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default AddHotelPage;
