import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/lib/amplifyServices";

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    const form = e.target as HTMLFormElement;
    const currentEmail = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    setEmail(currentEmail);

    try {
      const result = await authService.signUp(currentEmail, password);
      if (result.nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setSuccess("User successfully registered. Please check your email for the confirmation code.");
        setShowConfirmation(true);
      } else if (result.isSignUpComplete) {
         navigate("/admin/login");
      }
    } catch (err: any) {
      setError(err.message || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.target as HTMLFormElement;
    const confirmationCode = (form.elements.namedItem("confirmationCode") as HTMLInputElement).value;

    try {
      const result = await authService.confirmSignUp(email, confirmationCode);
      if (result.isSignUpComplete) {
        setSuccess("Account confirmed successfully! Redirecting to login...");
        setTimeout(() => navigate("/admin/login"), 2000);
      }
    } catch (err: any) {
      setError(err.message || "Confirmation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-[#181c2f] dark:via-[#23263a] dark:to-[#181c2f] transition-colors">
      <div className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg mb-2">
            <span className="text-2xl font-bold text-white">FT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            {showConfirmation ? "Confirm Your Account" : "Create an Account"}
          </h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">
            {showConfirmation ? "Enter the code sent to your email." : "Join us to get started."}
          </p>
        </div>

        {!showConfirmation ? (
          <form className="space-y-6" onSubmit={handleSignUp} autoComplete="off">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="bg-white/80 dark:bg-[#23263a]/60 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-400"
                placeholder="you@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="bg-white/80 dark:bg-[#23263a]/60 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-400 pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>
            {error && <div className="text-red-500 text-sm text-center animate-shake">{error}</div>}
            {success && <div className="text-green-500 text-sm text-center">{success}</div>}
            <Button
              type="submit"
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-lg bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg",
                loading && "opacity-70 cursor-not-allowed"
              )}
              disabled={loading}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleConfirmation} autoComplete="off">
            <div>
              <label htmlFor="confirmationCode" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Confirmation Code
              </label>
              <Input
                id="confirmationCode"
                name="confirmationCode"
                type="text"
                required
                className="bg-white/80 dark:bg-[#23263a]/60 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your code"
              />
            </div>
            {error && <div className="text-red-500 text-sm text-center animate-shake">{error}</div>}
            {success && <div className="text-green-500 text-sm text-center">{success}</div>}
            <Button
              type="submit"
              className={cn(
                "w-full py-3 rounded-xl font-semibold text-lg bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg",
                loading && "opacity-70 cursor-not-allowed"
              )}
              disabled={loading}
            >
              {loading ? "Confirming..." : "Confirm Account"}
            </Button>
          </form>
        )}

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/admin/login" className="text-indigo-600 hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
} 