import axios from "axios";
import { atom } from "recoil";
import { DATABASE_URL } from "../config";
import { recoilPersist } from 'recoil-persist';

interface Ads{
    category:string,
    description:string,
    id:number,
    imageLink:string,
    price:number,
    sold:boolean,
    title:string,
    userId:number,
    liked:boolean
}
const { persistAtom } = recoilPersist();


const checkValidUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) return false; // If no token, user is not valid

  try {
    // Make an API call to validate the token
    const response = await axios.get(`${DATABASE_URL}/api/v1/ads`, {
        headers:{
                Authorization: localStorage.getItem("token")
        }
    });
    
    // If token is valid, return true, else false
    return response.data.isValid;
  } catch (error) {
    console.error("Token validation failed", error);
    return false;
  }
};

// Recoil atom for validUser state
export const validUser = atom<boolean>({
  key: "validUser",
  default: false, // Initial value false
  effects_UNSTABLE: [
    ({ setSelf }) => {
      // Check token validity asynchronously
      checkValidUser().then(isValid => {
        setSelf(isValid); // Set validUser state based on the token's validity
      });
    },
    persistAtom,
  ],
});



export const customAds = atom<Ads[]>({
    key: "customAds",
    default: [], 
});




export const category=atom<string>({
    key:"category",
    default:"others"
})