import axios from "axios";
import {  useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "../components/NotificationModel";
import { Spinner } from "../components/Spinner";

interface AdForm {
  category: string;
  price: string;
  title: string;
  description: string;
  file: File| null;
}

export const AddItem = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [formData, setFormData] = useState<AdForm>({
    category: "others",
    price: "",
    title: "",
    description: "",
    file: null, // Change this to null initially
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "file" && files) {
      setFormData((prevData) => ({
        ...prevData,
        file: files[0], // Set the file directly
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
    setLoading(true);
    const data = new FormData();
  data.append('title', formData.title);
  data.append('category', formData.category);
  data.append('price', String(formData.price));
  data.append('description', formData.description);
  data.append('file', formData.file);

    axios
      .post(`${DATABASE_URL}/api/v1/ads/createAd`,data,{
        withCredentials:true,
        headers: {
          Authorization: localStorage.getItem("token") || "",
        'Content-Type': 'multipart/form-data',     
         }

      })
      .then((res) => {
        setNotification({ message: 'Ad Created Successfully!', type: 'success' });
        setTimeout(() => {
            window.location.reload()
        }, 1000);
      })

      .catch((e) => {
        setNotification({ message: `${e.response.data}`, type: 'error' });
      }).finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      {loading && <Spinner />}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="p-10 mt-10 max-w-lg mx-auto bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Create Ad</h2>

        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 mb-2">Category:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 mb-2">Price:</label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 mb-2">Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 mb-2">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        
          />
        </div>

        <div className="mb-4">
          <label htmlFor="file" className="block text-gray-700 mb-2">Image Link:</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"
        >
          Create Ad
        </button>
      </form>
    </div>
  );
};
