import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios";
import { UserContext } from "../context/user.context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !isLoading) {
      if (!localStorage.getItem("justLoggedIn")) {
        toast.info("You are already logged in!");
      }
      navigate("/");
    }
  }, [user, navigate]);

  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    axios
      .post("/users/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("justLoggedIn", "true"); // Prevent immediate toast from useEffect
        setUser(res.data.user);
        toast.success("Login successful!");
        navigate("/");

        setTimeout(() => {
          localStorage.removeItem("justLoggedIn"); // Clear flag after redirection
        }, 1000);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Login failed. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 px-4 overflow-hidden">
      {/* Tech Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        {/* Computer/Tech Illustrations */}
        <div className="absolute top-10 left-10 w-48 h-48 opacity-20">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
          </svg>
        </div>

        <div className="absolute bottom-10 right-10 w-64 h-64 opacity-20">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zm0 4h4v6h-4zm-6-4h5v3H6z" />
          </svg>
        </div>

        {/* AI/Brain Illustration */}
        <div className="absolute top-1/4 right-1/4 w-56 h-56 opacity-20">
          <svg
            viewBox="0 0 24 24"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 3c-4.97 0-9 4.03-9 9H0l4 4l4-4H5c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C7.63 20.35 9.73 21 12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.25 2.52.77-1.28-3.52-2.09V8z" />
          </svg>
        </div>

        {/* Circuit Patterns */}
        <div className="absolute top-3/4 left-1/3 w-64 h-64 opacity-20">
          <svg
            viewBox="0 0 100 100"
            stroke="white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10,30 L30,30 L30,10" strokeWidth="1" />
            <path d="M70,10 L70,30 L90,30" strokeWidth="1" />
            <path d="M90,70 L70,70 L70,90" strokeWidth="1" />
            <path d="M30,90 L30,70 L10,70" strokeWidth="1" />
            <circle cx="50" cy="50" r="20" strokeWidth="1" />
            <path d="M30,50 L10,50" strokeWidth="1" />
            <path d="M90,50 L70,50" strokeWidth="1" />
            <path d="M50,30 L50,10" strokeWidth="1" />
            <path d="M50,90 L50,70" strokeWidth="1" />
          </svg>
        </div>

        {/* Code Elements */}
        <div className="absolute top-1/4 left-1/4 text-blue-300 text-6xl opacity-30">
          &lt;/&gt;
        </div>
        <div className="absolute bottom-1/4 right-1/4 text-cyan-300 text-6xl opacity-30">{`{ }`}</div>
        <div className="absolute top-3/4 left-1/3 text-green-300 text-4xl opacity-30">
          010101
        </div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-white/20 relative z-10">
        {/* SOEN Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl inline-block shadow-lg">
            <div className="text-white font-bold text-3xl tracking-wider">
              SOEN
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Welcome Back
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/30 border border-red-500/40 rounded-lg text-white text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-sm font-medium ml-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-blue-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
                className="w-full pl-10 p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition duration-200 outline-none placeholder-blue-200/70"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white text-sm font-medium ml-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-blue-300"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Enter your password"
                required
                className="w-full pl-10 p-4 rounded-xl bg-white/10 text-white border border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition duration-200 outline-none placeholder-blue-200/70"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-white/30 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-white"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-blue-300 hover:text-blue-200"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold transform transition duration-200 hover:translate-y-px hover:shadow-lg focus:ring-2 focus:ring-blue-500/50 disabled:opacity-70"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Logging in...</span>
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>

        <p className="text-white mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-cyan-300 font-medium hover:text-cyan-200 transition duration-200"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
