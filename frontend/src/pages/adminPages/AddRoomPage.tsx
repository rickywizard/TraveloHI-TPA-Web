import styled from "styled-components";
import InputField from "../../components/InputField";
import { useEffect, useRef, useState } from "react";
import LoadingPopup from "../../components/LoadingPopup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { storage } from "../../utils/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import ErrorMessage from "../../components/ErrorMessage";

interface RoomData {
  type: string;
  price: string;
  total: string;
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

const AddRoomPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [readySend, setReadySend] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RoomData>({
    type: "",
    price: "",
    total: "",
    image_urls: [],
    facilities: [],
  });

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // facility dropdown
  const facilitiesList = [
    { id: 9, name: "Desk" },
    { id: 10, name: "Hairdryer" },
    { id: 11, name: "In-Room safe" },
    { id: 12, name: "Refrigerator" },
    { id: 13, name: "Shower" },
    { id: 14, name: "TV" },
    { id: 15, name: "Mini bar" },
  ];

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

      console.log("Submitted", formData);
      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/auth/add_room/${id}`,
          formData,
          { withCredentials: true }
        );

        if (response.status === 201) {
          console.log(response.data.message);
          setIsLoading(false);
          setError("");
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
        <h2 style={{ marginBottom: "1rem" }}>Add Room</h2>
        <form onSubmit={handleSubmit}>
          <UploadLabel htmlFor="image">Room Photos</UploadLabel>
          <ImageUploader onClick={handleUploaderClick}>
            <ImageInput
              ref={fileInputRef}
              type="file"
              name="image_url"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />

            <span>Click to Upload Photo</span>
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
            labelName="Room Type"
            type="text"
            name="type"
            placeholder="Enter room type"
            handleChange={handleInputChange}
            value={formData.type}
          />
          <InputField
            labelName="Room Price"
            type="number"
            name="price"
            placeholder="Enter room price"
            handleChange={handleInputChange}
            value={formData.price.toString()}
          />
          <InputField
            labelName="Room Total"
            type="number"
            name="total"
            placeholder="Enter room total"
            handleChange={handleInputChange}
            value={formData.total.toString()}
          />

          <div>
            <Label htmlFor="facilities">Select Room Facilities</Label>
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

          <ErrorMessage error={error} />

          <ButtonGroup>
            <button type="submit">Add Room</button>

            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </ButtonGroup>
        </form>
      </FormContainer>
    </>
  );
};

export default AddRoomPage;
