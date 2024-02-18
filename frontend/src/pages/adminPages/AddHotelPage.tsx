import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { storage } from "../../utils/firebase";
import InputField from "../../components/InputField";
import LoadingPopup from "../../components/LoadingPopup";
import axios from "axios";
import ErrorMessage from "../../components/ErrorMessage";

interface HotelData {
  name: string;
  address: string;
  star: string;
  description: string;
  image_urls: string[];
  facilities: number[];
}

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
`;

const FormContainer = styled.div`
  background: var(--white);
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ImageUploader = styled.div`
  width: 400px;
  height: 200px;
  cursor: pointer;
  border: 1rem dashed var(--blue);
  border-radius: 1rem;
  margin-bottom: 0.5rem;

  span {
    position: relative;
    top: 75px;
    display: grid;
    place-items: center;
  }
`;

const UploadLabel = styled.label`
  display: block;
  color: var(--text);
  font-size: 0.875rem;
`;

const ImageInput = styled.input`
  width: 100%;
`;

const Previews = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PreviewContainer = styled.div`
  display: flex;

  button {
    outline: 0;
    border: none;
    border-radius: 0 5px 5px 0;
    color: var(--white);
    background-color: var(--red);
    padding: 0 0.5rem;
    transition: 0.3s background-color;
    cursor: pointer;
  }

  button:hover {
    background-color: var(--red-shade);
  }
`;

const ImagePreview = styled.img`
  width: 200px;
  object-fit: cover;
  border-radius: 5px 0 0 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;

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

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
  display: inline-block;
`;

const DropdownButton = styled.button`
  width: 100%;
  backround-color: transparent;
  border: 1px solid var(--grey);
  border-radius: 5px;
  padding: 0.5rem;
  cursor: pointer;

  &:hover {
    background-color: var(--gray);
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  width: 100%;
  top: 3rem;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  z-index: 1;
`;

const FacilityItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;

  label,
  input {
    cursor: pointer;
  }
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

const AddHotelPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [readySend, setReadySend] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<HotelData>({
    name: "",
    address: "",
    star: "",
    description: "",
    image_urls: [],
    facilities: [],
  });

  const facilitiesList = [
    { id: 1, name: "AC" },
    { id: 2, name: "Restaurant" },
    { id: 3, name: "Swimming Pool" },
    { id: 4, name: "24-Hour Front Desk" },
    { id: 5, name: "Parking" },
    { id: 6, name: "Elevator" },
    { id: 7, name: "WiFi" },
    { id: 8, name: "Gym" },
  ];

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploaderClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const newPreviews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );

      setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
      setImageFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
    }
  };

  const handleDeleteImage = (index: number) => {
    const newPreviews = [...imagePreviews];
    const newFiles = [...imageFiles];

    newPreviews.splice(index, 1);
    newFiles.splice(index, 1);

    setImagePreviews(newPreviews);
    setImageFiles(newFiles);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // facility dropdown
  const [isFacilityDropdownOpen, setIsFacilityDropdownOpen] =
    useState<boolean>(false);

  const toggleFacilityDropdown = () => {
    setIsFacilityDropdownOpen((prevState) => !prevState);
  };

  const handleFacilityCheckboxChange = (facilityId: number) => {
    setFormData((prevData) => {
      const isSelected = prevData.facilities.includes(facilityId);

      if (isSelected) {
        const updatedFacilities = prevData.facilities.filter(
          (id) => id !== facilityId
        );
        return { ...prevData, facilities: updatedFacilities };
      } else {
        return {
          ...prevData,
          facilities: [...prevData.facilities, facilityId],
        };
      }
    });
  };

  useEffect(() => {
    const sendDataToBackend = async () => {
      setIsLoading(true);
      setReadySend(false);

      // console.log("Submitted", formData);
      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/auth/add_hotel",
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
          // console.log("Error creating promo", error.response?.data.error);
          setError(error.response?.data.error);
        }
      }
    };

    if (formData.image_urls.length > 0 && readySend) {
      sendDataToBackend();
    }
  }, [formData, readySend]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // console.log("submitted", formData);

    setReadySend(true);

    if (imageFiles) {
      setIsLoading(true);
      const uploadPromises = imageFiles.map(async (file) => {
        const storageRef = ref(storage, `hotels/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
      });

      const imageUrls = await Promise.all(uploadPromises);

      setFormData((prevData) => ({
        ...prevData,
        image_urls: imageUrls,
      }));

      console.log("Image uploaded successfully. URL:", imageUrls);

      setImagePreviews([]);
      setImageFiles([]);
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      <FormContainer>
        <h2 style={{ marginBottom: "1rem" }}>Add Hotel</h2>
        <form onSubmit={handleSubmit}>
          <UploadLabel htmlFor="image">Hotel Image</UploadLabel>
          <ImageUploader onClick={handleUploaderClick}>
            <ImageInput
              ref={fileInputRef}
              type="file"
              name="image_url"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <span>Click to Upload Image</span>
          </ImageUploader>

          <Previews>
            {imagePreviews.map((preview, index) => (
              <PreviewContainer key={index}>
                <ImagePreview src={preview} alt={`Preview ${index + 1}`} />
                <button type="button" onClick={() => handleDeleteImage(index)}>
                  Delete
                </button>
              </PreviewContainer>
            ))}
          </Previews>

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

          <Label htmlFor="star">Hotel Star</Label>
          <RadioContainer>
            <Radio>
              <input
                type="radio"
                name="star"
                value="1"
                onChange={handleInputChange}
              />{" "}
              <p>1⭐</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="2"
                onChange={handleInputChange}
              />{" "}
              <p>2⭐</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="3"
                onChange={handleInputChange}
              />{" "}
              <p>3⭐</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="4"
                onChange={handleInputChange}
              />{" "}
              <p>4⭐</p>
            </Radio>
            <Radio>
              <input
                type="radio"
                name="star"
                value="5"
                onChange={handleInputChange}
              />{" "}
              <p>5⭐</p>
            </Radio>
          </RadioContainer>

          <div style={{ marginBottom: '0.5rem' }}>
            <Label htmlFor="facilities">Select Facilities</Label>
            <DropdownContainer>
              <DropdownButton type="button" onClick={toggleFacilityDropdown}>
                Choose Facility
              </DropdownButton>
              {isFacilityDropdownOpen && (
                <DropdownContent>
                  {facilitiesList.map((facility) => (
                    <FacilityItem key={facility.id}>
                      <input
                        type="checkbox"
                        id={`facility-${facility.id}`}
                        checked={formData.facilities.includes(facility.id)}
                        onChange={() =>
                          handleFacilityCheckboxChange(facility.id)
                        }
                      />
                      <label htmlFor={`facility-${facility.id}`}>
                        {facility.name}
                      </label>
                    </FacilityItem>
                  ))}
                </DropdownContent>
              )}
            </DropdownContainer>
          </div>

          <Label htmlFor="description">Hotel Description</Label>
          <TextArea
            name="description"
            placeholder="Description..."
            value={formData.description}
            onChange={handleInputChange}
          />

          <ErrorMessage error={error} />

          <ButtonGroup>
            <button type="submit">Add Hotel</button>

            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </>
  );
};

export default AddHotelPage;
