import { useState, useEffect } from "react";
import {useNavigate} from 'react-router-dom'

const Register = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localError) {
      const timer = setTimeout(() => {
        setLocalError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [localError]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    navigate("/confirm-email")
  };

  const handleGoogleLogin = async () => {};

  return (
    <div className="min-h-screen bg-[#F8F4F1] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 space-y-6">
        <div>
          <h2 className="text-[24px] font-semibold text-gray-900">Sign in</h2>
          <p className="text-sm text-gray-600 mt-1">Hi, what's your email?</p>
        </div>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#F7E353]"
              
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-medium text-[#4F4E50] bg-[#F2E205] hover:bg-[#F7E353] focus:outline-none ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-[#FFFEF7] text-sm font-medium text-gray-700 hover:bg-[#FFFEF0] focus:outline-none ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Continue with Google</>
          )}
        </button>

        {localError && (
          <div className="text-red-500 text-sm text-center mt-2">
            {localError}
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
