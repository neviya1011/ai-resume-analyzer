import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePuterStore } from "../store/lib/puterstore";

const Auth = () => {
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [message, setMessage] = useState("");

  const {
    isLoading,
    error,
    auth: { isAuthenticated, signIn },
  } = usePuterStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const clearInputs = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setChecked(false);
    setMessage("");
  };

  const handleRegister = () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setMessage("Please fill all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    if (!checked) {
      setMessage("Please agree to the Terms and Privacy Policy.");
      return;
    }

    localStorage.setItem(
      "resumindUser",
      JSON.stringify({
        fullName,
        email,
        password,
      })
    );

    setMessage("Account created. Now login.");
    setIsRegister(false);
    setPassword("");
    setConfirmPassword("");
    setChecked(false);
  };

  const handleLogin = async () => {
    const savedUser = JSON.parse(localStorage.getItem("resumindUser"));

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    if (!savedUser) {
      setMessage("Please register first.");
      return;
    }

    if (email !== savedUser.email || password !== savedUser.password) {
      setMessage("Wrong email or password.");
      return;
    }

    setMessage("");
    await signIn();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 overflow-hidden px-4">
      <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl tracking-widest">RESUMIND</h1>

          <h2 className="font-bold text-3xl mt-5">
            {isRegister ? "Create Account" : "Welcome Back"}
          </h2>

          <p className="text-gray-500 text-sm mt-2">
            {isRegister
              ? "Register to start analyzing resumes"
              : "Login to continue to your dashboard"}
          </p>
        </div>

        <div className="space-y-4">
          {isRegister && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl px-11 py-3 outline-none bg-white border border-gray-200 focus:border-[rgb(98,109,210)]"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl px-11 py-3 outline-none bg-white border border-gray-200 focus:border-[rgb(98,109,210)]"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl px-11 py-3 outline-none bg-white border border-gray-200 focus:border-[rgb(98,109,210)]"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {isRegister && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl px-11 py-3 outline-none bg-white border border-gray-200 focus:border-[rgb(98,109,210)]"
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="accent-[rgb(98,109,210)]"
            />

            {isRegister ? "I agree to terms" : "Remember me"}
          </label>

          {!isRegister && (
            <button className="text-[rgb(98,109,210)]">
              Forgot Password?
            </button>
          )}
        </div>

        {(message || error) && (
          <p className="text-red-500 text-sm text-center mt-4">
            {message || error}
          </p>
        )}

        <button
          onClick={isRegister ? handleRegister : handleLogin}
          disabled={isLoading}
          className="w-full mt-6 bg-[rgb(98,109,210)] text-white rounded-2xl py-3 font-semibold hover:bg-indigo-600 active:scale-95 transition disabled:opacity-60"
        >
          {isLoading
            ? "Loading..."
            : isRegister
            ? "Register"
            : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              clearInputs();
            }}
            className="text-[rgb(98,109,210)] font-semibold"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;