import axios from "axios";
import { useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "../components/NotificationModel";
import { Spinner } from "./Spinner";

interface UpdatePasswordInfo {
  oldPassword: string;
  newPassword: string;
}

export const UpdatePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formData, setFormData] = useState<UpdatePasswordInfo>({
    oldPassword: "",
    newPassword: "",
  });

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
      .post(`${DATABASE_URL}/api/v1/user/update-password`, formData, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(() => {
        setNotification({
          message: "Password Updated Successfully!",
          type: "success",
        });
        setFormData({ oldPassword: "", newPassword: "" });
      })
      .catch((e) => {
        setNotification({ message: `${e.response.data}`, type: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center px-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm z-10">
          <Spinner />
        </div>
      )}

      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-slate-700 relative z-0"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800 dark:text-white">
          Update Password
        </h2>

        <div className="mb-5">
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            Old Password
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
        >
          Update Password
        </button>
      </form>
    </div>
  );
};
