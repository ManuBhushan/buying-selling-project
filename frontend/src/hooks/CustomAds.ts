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


export const validUser=atom<boolean>({
    key:"validUser",
    default:false
})


export const category=atom<string>({
    key:"category",
    default:"others"
})