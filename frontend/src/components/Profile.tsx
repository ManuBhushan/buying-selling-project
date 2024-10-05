import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";

interface UserProfile {
  name:string,
  email:string,
  createdAt:string,
  updatedAt:string
}

export const Profile: React.FC = () => {
  const [info, setInfo] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UserProfile>(
    {
        name: "",
        email: "",
        createdAt: "",
        updatedAt: "",
    }
  );

  useEffect(() => {
    axios
      .get(`${DATABASE_URL}/api/v1/user/profile`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setInfo(res.data);
        setFormData(res.data); // Initialize form with the fetched profile data
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post(`${DATABASE_URL}/api/v1/user/update-profile`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log("Profile updated", res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
     Profile
    </>
  );
};
