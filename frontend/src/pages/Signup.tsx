import { AuthSignup } from "../components/AuthSignup";
import { Quote } from "../components/Quote";

export const Signup = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 ">
      <AuthSignup />

      <Quote />
    </div>
  );
};
