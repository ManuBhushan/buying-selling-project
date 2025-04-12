import { ShoppingBag, Star } from "lucide-react";

export const Quote = () => {
  return (
    <div className="hidden lg:block h-full">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 h-full flex flex-col justify-center items-center px-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 rounded-full bg-white"></div>
        </div>

        <div className="relative z-10 max-w-md text-center space-y-8">
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <ShoppingBag size={40} className="text-blue-600" />
            </div>
          </div>

          <blockquote className="text-3xl font-bold text-white leading-tight">
            "Find what you need, sell what you don't. Connect, trade, and save
            right in your neighborhood."
          </blockquote>

          <div className="flex justify-center gap-1 my-6">
            <Star size={20} className="text-yellow-300 fill-yellow-300" />
            <Star size={20} className="text-yellow-300 fill-yellow-300" />
            <Star size={20} className="text-yellow-300 fill-yellow-300" />
            <Star size={20} className="text-yellow-300 fill-yellow-300" />
            <Star size={20} className="text-yellow-300 fill-yellow-300" />
          </div>

          <p className="text-xl font-medium text-blue-100">
            Start exploring the best deals near you today!
          </p>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center text-blue-200 text-sm">
          Join thousands of satisfied users in your community
        </div>
      </div>
    </div>
  );
};
