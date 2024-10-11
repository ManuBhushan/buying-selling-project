import { AllAds } from "./AllAds";
import { Filter } from "./Filter";

export const HomePage = () => {
    return (
        <div className="min-h-screen bg-zinc-600">
            {/* Flexbox for mobile, grid for larger screens */}
            <div className="lg:grid lg:grid-cols-[15%_85%] flex flex-col">
                {/* Filter: hidden on small screens, visible on lg and above */}
                <div className="hidden lg:block  border-r-2">
                    <Filter />
                </div>
                {/* AllAds: takes full width on small screens, auto width on larger */}
                <div className="flex-grow">
                    <AllAds />
                </div>
            </div>
        </div>
    );
};
