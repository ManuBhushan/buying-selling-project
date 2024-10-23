import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "../components/NotificationModel";
import { Spinner } from "./Spinner";

interface UserProfile {
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UpdateInfo {
  name: string;
  email: string;
}

export const Profile: React.FC = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [info, setInfo] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateInfo>({
    name: "",
    email: "",
  });

  useEffect(() => {
    axios
      .get(`${DATABASE_URL}/api/v1/user/profile`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        const { name, email } = res.data;
        setInfo(res.data);
        setFormData({ name, email }); // Initialize form with the fetched profile data
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
    setLoading(true);
    axios
      .post(`${DATABASE_URL}/api/v1/user/update-profile`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setNotification({ message: 'Profile Updated Successfully!', type: 'success' });
      })
      .catch((e) => {
        setNotification({ message:  `${e.response.data}`, type: 'success' });
      }).finally(()=>{
        setLoading(false);
      })
  };

  return (
    <div >
      {loading && <Spinner />}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="p-10 mt-10 max-w-100% mx-auto p-4 bg-white rounded-lg shadow-md  ">
        <h2 className="text-xl font-semibold mb-4">Update Profile</h2>
  
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
  
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
  
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
  
};
