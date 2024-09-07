import { AllAds } from "./AllAds";
import { Filter } from "./Filter";

export const HomePage = () => {
    return (
        <div className="grid grid-cols-[15%_85%] min-h-screen bg-zinc-600">
            <Filter/>

            <AllAds/>
        </div>
    );
};
