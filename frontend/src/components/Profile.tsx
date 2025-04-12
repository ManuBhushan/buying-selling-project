import axios from "axios";
import { useEffect, useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "../components/NotificationModel";
import { Spinner } from "./Spinner";

interface UpdateInfo {
  name: string;
  email: string;
}

export const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isFetchingProfile, setIsFetchingProfile] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
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
        setFormData({ name, email });
      })
      .catch((e) => {
        console.log(e);
        setNotification({ message: "Failed to load profile", type: "error" });
      })
      .finally(() => {
        setIsFetchingProfile(false);
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
      .then(() => {
        setNotification({
          message: "Profile Updated Successfully!",
          type: "success",
        });
      })
      .catch((e) => {
        setNotification({ message: `${e.response.data}`, type: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  if (isFetchingProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)] bg-gradient-to-br from-slate-100 to-blue-100 dark:from-slate-900 dark:to-slate-800 py-10 px-4">
      {loading && <Spinner />}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-slate-700"
      >
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
            Your Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Update your name and email address
          </p>
        </div>

        <div className="mb-6">
          <label
            htmlFor="name"
            className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Full Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Email Address
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200 text-lg"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};
