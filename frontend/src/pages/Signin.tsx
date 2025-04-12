import { AuthSignin } from "../components/AuthSignin";
import { Quote } from "../components/Quote";
import { ShoppingBag } from "lucide-react";

export const Signin = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Mobile header for smaller screens */}
      <div className="lg:hidden bg-blue-600 p-4 flex justify-center items-center">
        <div className="flex items-center gap-3">
          <ShoppingBag size={24} className="text-white" />
          <h1 className="text-xl font-bold text-white">MARKETPLACE</h1>
        </div>
      </div>

      {/* Two column layout */}
      <div className="flex-1 lg:order-2">
        <AuthSignin />
      </div>

      <div className="flex-1 lg:order-1">
        <Quote />
      </div>
    </div>
  );
};
