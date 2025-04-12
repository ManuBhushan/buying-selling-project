import axios from "axios";
import { useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "../components/NotificationModel";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { validUser } from "../hooks/CustomAds";
import { Spinner } from "./Spinner";

export const Delete = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const setUser = useSetRecoilState(validUser);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [password, setUpdatePassword] = useState<string>("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatePassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    axios
      .delete(`${DATABASE_URL}/api/v1/user/delete`, {
        data: { password },
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(() => {
        setNotification({
          message: "Account Deleted Successfully!",
          type: "success",
        });
        setUpdatePassword("");
        localStorage.removeItem("token");
        setUser({ isValid: false, userId: 0, userName: "Invalid User" });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch((e) => {
        setNotification({ message: `${e.response.data}`, type: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      {loading && <Spinner />}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Delete Account
        </h2>

        <div className="mb-6">
          <label
            htmlFor="oldPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter Password
          </label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={password}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-300"
        >
          Delete Account
        </button>
      </form>
    </div>
  );
};
