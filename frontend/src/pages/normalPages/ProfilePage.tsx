import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useRef, useState } from "react";
import { IUser } from "../../interfaces/user-interface";
import up from "../../assets/arrow-up-from-bracket-solid.svg";
import InputField from "../../components/InputField";
import ErrorMessage from "../../components/ErrorMessage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../utils/firebase";
import axios from "axios";
import LoadingPopup from "../../components/LoadingPopup";
import PopMessage from "../../components/PopMessage";
import PriceDisplay from "../../components/PriceDisplay";
import { useNavigate } from "react-router-dom";

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth: string;
  phone: string;
  address: string;
  profile_picture_url: string;
  is_subscriber: boolean;
}

const EditProfileContainer = styled.div`
  padding: 1rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
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

const EditProfileContent = ({
  user,
  refetchUserData,
}: ProfileComponentProps) => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [readySend, setReadySend] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<ProfileData>({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    date_of_birth: user?.date_of_birth || "",
    phone: user?.phone || "",
    address: user?.address || "",
    profile_picture_url: user?.profile_picture_url || "",
    is_subscriber: user?.is_subscriber || false,
  });

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Submit
  useEffect(() => {
    const sendDataToBackend = async () => {
      // console.log(formData);
      setIsLoading(true);
      setReadySend(false);
      try {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/auth/update_profile`,
          formData,
          { withCredentials: true }
        );

        if (response.status === 200) {
          setSuccess(response.data.message);
          setError("");
          setIsLoading(false);
          refetchUserData();
        }
      } catch (error) {
        setIsLoading(false);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data.error);
        }
      }
    };

    if (user?.id && readySend) {
      sendDataToBackend();
    }
  }, [readySend]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setReadySend(true);

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
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      {success && <PopMessage type="success" text={success} />}
      <EditProfileContainer>
        <h3>Edit Profile</h3>
        <form onSubmit={handleSubmit}>
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
                src={imagePreview ? imagePreview : user?.profile_picture_url}
                alt="Preview"
              />
            </ImagePreview>
            <UploadIcon>
              <img src={up} alt="upload" width="10px" />
            </UploadIcon>
          </Uploader>

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

          {/* input date */}
          <InputField
            labelName="Tanggal Lahir"
            type="date"
            name="date_of_birth"
            placeholder=""
            handleChange={handleInputChange}
            value={formData.date_of_birth}
          />

          {/* input phone */}
          <InputField
            labelName="Nomor Telepon"
            type="text"
            name="phone"
            placeholder="08123456789"
            handleChange={handleInputChange}
            value={formData.phone}
          />

          <Label htmlFor="address">Alamat</Label>
          <TextArea
            name="address"
            placeholder="Jalan ABC"
            value={formData.address}
            onChange={handleInputChange}
          />

          {/* input checkbox */}
          <CheckboxContainer>
            <input
              checked={formData.is_subscriber}
              type="checkbox"
              name="is_subscriber"
              onChange={handleInputChange}
            />
            <p>Dapatkan informasi terbaru</p>
          </CheckboxContainer>

          <ErrorMessage error={error} />

          <Button type="submit">Update Profile</Button>
        </form>
      </EditProfileContainer>
    </>
  );
};

const HIWalletContainer = styled.div`
  padding: 1rem;

  h5 {
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    color: var(--blue);
  }

  p {
    font-weight: bold;
    font-size: 3rem;
    color: var(--orange);
  }
`;

const HIWalletContent = ({ user }: ProfileComponentProps) => (
  <HIWalletContainer>
    <h5>Saldo Anda</h5>
    <PriceDisplay price={user?.hi_wallet || 0} />
  </HIWalletContainer>
);

interface CreditCardData {
  bank: string;
  credit_card: string;
}

const CreditCardContainer = styled.div`
  padding: 1rem;

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
`;

const CreditCardContent = ({
  user,
  refetchUserData,
}: ProfileComponentProps) => {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<CreditCardData>({
    bank: user?.bank || "",
    credit_card: user?.credit_card || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/add_credit_card",
        formData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsLoading(false);
        setError("");
        setSuccess(response.data.message);
        refetchUserData();
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      }
    }
  };

  return (
    <>
      <LoadingPopup isLoading={isLoading} />
      {success && <PopMessage type="success" text={success} />}
      {error && <PopMessage type="error" text={error} />}
      <CreditCardContainer>
        <form onSubmit={handleSubmit}>
          {/* input bank account */}
          <InputField
            labelName="Bank Account"
            type="text"
            name="bank"
            placeholder="No. Rekening"
            handleChange={handleInputChange}
            value={formData.bank}
          />
          {/* input credit card number */}
          <InputField
            labelName="Credit Card Number"
            type="text"
            name="credit_card"
            placeholder="1234 1234 1234 1234"
            handleChange={handleInputChange}
            value={formData.credit_card}
          />

          {!user?.bank && !user?.credit_card && (
            <Button type="submit">Add Credit Card</Button>
          )}
        </form>
      </CreditCardContainer>
    </>
  );
};

interface ProfileComponentProps {
  user: IUser | null;
  refetchUserData: () => Promise<void>;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout, refetchUserData } = useAuth();
  const [selectedMenu, setSelectedMenu] = useState<string>("Edit Profile");

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("Logout error: ", error);
    }
  };

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "Edit Profile":
        return (
          <EditProfileContent user={user} refetchUserData={refetchUserData} />
        );
      case "HI Wallet":
        return (
          <HIWalletContent user={user} refetchUserData={refetchUserData} />
        );
      case "Credit Card":
        return (
          <CreditCardContent user={user} refetchUserData={refetchUserData} />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Heading>Profil Saya</Heading>
      <ProfileContainer>
        <ProfileMenuSide>
          <ProfileView>
            <img src={user?.profile_picture_url} alt="" />
            <div>
              <p>
                {user?.first_name} {user?.last_name}
              </p>
              <p>{user?.email}</p>
            </div>
          </ProfileView>
          <MenuLink onClick={() => handleMenuClick("Edit Profile")}>
            Edit Profile
          </MenuLink>
          <MenuLink onClick={() => handleMenuClick("HI Wallet")}>
            HI Wallet
          </MenuLink>
          <MenuLink onClick={() => handleMenuClick("Credit Card")}>
            Credit Card
          </MenuLink>
          <MenuLink onClick={() => navigate("/history")}>History</MenuLink>
          <MenuLink onClick={handleLogout}>Log out</MenuLink>
        </ProfileMenuSide>
        <ProfileInfoSide>{renderContent()}</ProfileInfoSide>
      </ProfileContainer>
    </>
  );
};

const ProfileContainer = styled.div`
  // background: var(--gray);
  width: 100%;
  display: flex;
  align-items: start;
  justify-content: space-between;
  padding: 1rem 0;
  margin-bottom: 1rem;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin: 1rem 0;
`;

const ProfileMenuSide = styled.div`
  // background: beige;
  width: 30%;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const ProfileView = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid var(--gray);

  img {
    border-radius: 50%;
    max-width: 5rem;
    max-height: 5rem;
  }

  div {
    width: 60%;

    p:nth-child(1) {
      font-weight: bold;
    }
    p:nth-child(2) {
      font-size: 0.75rem;
    }
  }
`;

const MenuLink = styled.div`
  padding: 1rem;
  border-bottom: 1px solid var(--gray);
  cursor: pointer;
  transition: 0.3s background-color;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: var(--gray);
  }
`;

const ProfileInfoSide = styled.div`
  // background: aquamarine;
  width: 68%;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

export default ProfilePage;
