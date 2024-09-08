import { PrintSearchAds } from "../components/PrintSearchAds"
import { Filter } from "./Filter"




const  SearchAds=()=>{
  return (
    <div className="grid grid-cols-[15%_85%] min-h-screen bg-zinc-600">
    <Filter/>

    <PrintSearchAds/>

    </div>
  
    
  )
}

export default SearchAds