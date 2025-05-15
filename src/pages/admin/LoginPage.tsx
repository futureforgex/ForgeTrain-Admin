import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-200 dark:from-[#181c2f] dark:via-[#23263a] dark:to-[#181c2f] transition-colors">
      <div className="relative w-full max-w-md p-8 rounded-3xl shadow-2xl bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-lg border border-gray-200 dark:border-gray-700">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg mb-2">
            <span className="text-2xl font-bold text-white">FT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Sign in to ForgeTrain</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-1">Welcome back! Please login to your account.</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin} autoComplete="off">
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
                autoComplete="current-password"
                required
                className="bg-white/80 dark:bg-[#23263a]/60 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-indigo-400 pr-12"
                placeholder="Your password"
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
          {error && (
            <div className="text-red-500 text-sm text-center animate-shake">{error}</div>
          )}
          <Button
            type="submit"
            className={cn(
              "w-full py-3 rounded-xl font-semibold text-lg bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg",
              loading && "opacity-70 cursor-not-allowed"
            )}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-indigo-600 hover:underline font-medium">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
