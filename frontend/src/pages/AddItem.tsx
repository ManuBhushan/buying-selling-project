import axios from "axios";
import { useState } from "react";
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
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const API_URL = import.meta.env.VITE_API_BASE_URL;
const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  console.log("CLOUDINARY_URL:", CLOUDINARY_URL);
  console.log("CLOUD_NAME:", CLOUD_NAME);
  console.log("UPLOAD_PRESET:", UPLOAD_PRESET);

  if (isNaN(Number(formData.price)) || formData.price === "") {
    setNotification({
      message: "Please enter a valid price.",
      type: "error",
    });
    return;
  }

  setLoading(true);

  try {
    const data = new FormData();
    data.append("file", formData.file as Blob);
    data.append("upload_preset", UPLOAD_PRESET);

    console.log("z");

    // ✅ AXIOS instead of fetch
    const cloudinaryRes = await axios.post(
      `${CLOUDINARY_URL}/${CLOUD_NAME}/image/upload`,
      data
    );

    console.log("zb");
    console.log(cloudinaryRes.data);

    const uploadedImage = cloudinaryRes.data;

    if (!uploadedImage.secure_url || !uploadedImage.public_id) {
      throw new Error("Image upload failed");
    }

    console.log("zc");

    // ✅ Your API call (unchanged)
    await axios.post(
      `${API_URL}/api/v1/ads/createAd`,
      {
        title: formData.title,
        category: formData.category,
        price: Number(formData.price),
        description: formData.description,
        imageLink: uploadedImage.secure_url,
        publicId: uploadedImage.public_id,
      },
      {
        headers: {
          Authorization: localStorage.getItem("token") || "",
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

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

  } catch (e: any) {
    console.log("a");
    console.log(e);

    // ✅ Better error handling
    const errorMessage =
      e?.response?.data?.error?.message || // Cloudinary error
      e?.response?.data ||                // your backend error
      e.message ||                        // generic error
      "Something went wrong";

    setNotification({
      message: errorMessage,
      type: "error",
    });
  } finally {
    setLoading(false);
  }
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
