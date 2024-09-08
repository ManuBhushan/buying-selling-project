import { atom } from "recoil";

interface Ads{
    category:string,
    description:string,
    id:number,
    imageLink:string,
    price:number,
    sold:boolean,
    title:string,
    userId:number
}


export const customAds = atom<Ads[]>({
    key: "customAds",
    default: [], 
});