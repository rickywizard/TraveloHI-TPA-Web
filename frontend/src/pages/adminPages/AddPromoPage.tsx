import { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField";
import styled from "styled-components";
import dummy from "../../assets/dummy-post.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { storage } from "../../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import axios from "axios";

interface PromoData {
  name: string;
  code: string;
  expired_date: string;
  image_url: string;
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

const AddPromoPage = () => {
  const { id } = useParams();
  const [isUpdateMode, setIsUpdateMode] = useState<boolean>(false);
  const [readyUpdate, setReadyUpdate] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      setIsUpdateMode(true);
      fetchPromoData();
    }
  }, [id]);

  const fetchPromoData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.01:8000/api/auth/get_promo/${id}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        const promoData = response.data;

        const backendDate = new Date(promoData.expired_date);
        const formattedDatetime = backendDate.toISOString().slice(0, 19);

        setFormData({
          ...promoData,
          expired_date: formattedDatetime,
        });

        setImagePreview(promoData.image_url || dummy);
      }
    } catch (error) {
      console.error("Error fetching promo data:", error);
    }
  };

  const [formData, setFormData] = useState<PromoData>({
    name: "",
    code: "",
    expired_date: "",
    image_url: "",
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

  useEffect(() => {
    const sendDataToBackend = async () => {
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/add_promo",
          formData,
          { withCredentials: true }
        );

        console.log(response.data.message);

        navigate(-1);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("Error creating promo", error.response?.data.error);
        }
      }
    };

    // Pastikan image_url sudah terisi sebelum mengirim ke backend
    if (formData.image_url && !isUpdateMode) {
      sendDataToBackend();
    }
  }, [formData.image_url]);

  useEffect(() => {
    const sendDataToBackend = async () => {
      const filteredFormData = {
        code: formData.code,
        expired_date: formData.expired_date,
        image_url: formData.image_url,
        name: formData.name,
      };
      console.log(filteredFormData);
      
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/auth/update_promo/${id}`,
          filteredFormData,
          { withCredentials: true }
        );
        console.log(response.data.message);

        navigate(-1);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("Error updating promo", error.response?.data.error);
        }
      }
    };

    // Pastikan image_url sudah terisi sebelum mengirim ke backend
    if (id && readyUpdate) {
      sendDataToBackend();
    }
  }, [readyUpdate]);

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
      setFormData((prevData) => ({
        ...prevData,
        image_url: imageUrl,
      }));
    }

    if (isUpdateMode) {
      setReadyUpdate(true);
    }
  };

  return (
    <>
      <FormContainer>
        <h2 style={{ marginBottom: "1rem" }}>
          {isUpdateMode ? "Update Promo" : "Add Promo"}
        </h2>
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
            labelName="Promo Name"
            type="text"
            name="name"
            placeholder="Enter promo name"
            handleChange={handleInputChange}
            value={formData.name}
          />
          <InputField
            labelName="Promo Code"
            type="text"
            name="code"
            placeholder="Enter promo code"
            handleChange={handleInputChange}
            value={formData.code}
          />
          <InputField
            labelName="Expired Date"
            type="datetime-local"
            name="expired_date"
            placeholder=""
            step="1"
            handleChange={handleInputChange}
            value={formData.expired_date}
          />

          <ButtonGroup>
            <button type="submit">
              {isUpdateMode ? "Update Promo" : "Add Promo"}
            </button>

            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </>
  );
};

export default AddPromoPage;
