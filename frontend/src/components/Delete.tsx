import axios from "axios";
import {  useState } from "react";
import { DATABASE_URL } from "../config";
import { NotificationModel } from "../components/NotificationModel";
import {  useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { validUser } from "../hooks/CustomAds";
import {Spinner} from "./Spinner";




export const Delete = () => {

  const [loading, setLoading] = useState<boolean>(false);
  const setUser=useSetRecoilState(validUser);
    const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [password, setUpadatePassword] = useState<string>("");
  const navigate= useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpadatePassword(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    setLoading(true);
    axios
      .delete(`${DATABASE_URL}/api/v1/user/delete`,  {
        data:{password},
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then(() => {
        setNotification({ message: 'Account Deleted Successfully!', type: 'success' });
        setUpadatePassword("");
        localStorage.removeItem("token");
        setUser({isValid:false,userId:0,userName:"Invalid User"});
        setLoading(false);
        setTimeout(()=>{
        navigate('/');
        },1000);
       
      })
      .catch((e) => {
        setNotification({ message:  `${e.response.data}`, type: 'error' });
      }).finally(() => {
      
      });
  };

  return (
    <div>
      {loading && <Spinner/>}
      {notification && (
        <NotificationModel
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="p-10 mt-10 max-w-100% mx-auto p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Delete Account</h2>

        <div className="mb-4">
          <label htmlFor="oldPassword" className="block text-gray-700 mb-2">Enter Password:</label>
          <input
            type="password"
            id="oldPassword"
            name="oldPassword"
            value={password}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-200"> 
          Submit
        </button>
      </form>
    </div>
  );
};
