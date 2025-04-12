import axios from "axios";
import { useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "../components/NotificationModel";
import { Spinner } from "../components/Spinner";

interface AdForm {
  category: string;
  price: string;
  title: string;
  description: string;
  file: File | null;
}

export const AddItem = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [formData, setFormData] = useState<AdForm>({
    category: "others",
    price: "",
    title: "",
    description: "",
    file: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file" && files) {
      setFormData((prevData) => ({
        ...prevData,
        file: files[0],
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isNaN(Number(formData.price)) || formData.price === "") {
      setNotification({
        message: "Please enter a valid price.",
        type: "error",
      });
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("price", String(formData.price));
    data.append("description", formData.description);
    if (formData.file) {
      data.append("file", formData.file);
    }
    axios
      .post(`${DATABASE_URL}/api/v1/ads/createAd`, data, {
        withCredentials: true,
        headers: {
          Authorization: localStorage.getItem("token") || "",
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setNotification({
          message: "Ad Created Successfully!",
          type: "success",
        });
        setFormData({
          title: "",
          category: "",
          price: "",
          description: "",
          file: null,
        });
      })
      .catch((e) => {
        setNotification({ message: `${e.response.data}`, type: "error" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="dark:bg-gray-900 min-h-screen py-10">
      {loading && <Spinner />}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="p-10 mt-10 max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white text-center">
          Create Ad
        </h2>

        {[
          { id: "category", label: "Category", type: "text" },
          { id: "price", label: "Price", type: "text", required: true },
          { id: "title", label: "Title", type: "text" },
          { id: "description", label: "Description", type: "text" },
        ].map(({ id, label, type, required }) => (
          <div key={id} className="mb-5">
            <label
              htmlFor={id}
              className="block mb-2 text-gray-700 dark:text-gray-300 font-medium"
            >
              {label}
            </label>
            <input
              type={type}
              id={id}
              name={id}
              value={(formData as any)[id]}
              onChange={handleInputChange}
              required={required}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}

        <div className="mb-6">
          <label
            htmlFor="file"
            className="block mb-2 text-gray-700 dark:text-gray-300 font-medium"
          >
            Image Upload
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleInputChange}
              required
              className="block w-full text-sm text-gray-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 dark:file:bg-blue-900 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-200 dark:hover:file:bg-blue-800"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition duration-200"
        >
          Create Ad
        </button>
      </form>
    </div>
  );
};
