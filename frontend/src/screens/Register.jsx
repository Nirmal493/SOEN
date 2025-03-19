// import React, { useState, useContext } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { UserContext } from "../context/user.context";
// import axios from "../config/axios";

// const Register = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const { setUser } = useContext(UserContext);

//   const navigate = useNavigate();

//   function submitHandler(e) {
//     e.preventDefault();

//     axios
//       .post("/users/register", {
//         email,
//         password,
//       })
//       .then((res) => {
//         console.log(res.data);
//         localStorage.setItem("token", res.data.token);
//         setUser(res.data.user);
//         navigate("/");
//       })
//       .catch((err) => {
//         console.log(err.response.data);
//       });
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-900">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
//         <h2 className="text-2xl font-bold text-white mb-6">Register</h2>
//         <form onSubmit={submitHandler}>
//           <div className="mb-4">
//             <label className="block text-gray-400 mb-2" htmlFor="email">
//               Email
//             </label>
//             <input
//               onChange={(e) => setEmail(e.target.value)}
//               type="email"
//               id="email"
//               className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your email"
//             />
//           </div>
//           <div className="mb-6">
//             <label className="block text-gray-400 mb-2" htmlFor="password">
//               Password
//             </label>
//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               type="password"
//               id="password"
//               className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter your password"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full p-3 rounded bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Register
//           </button>
//         </form>
//         <p className="text-gray-400 mt-4">
//           Already have an account?{" "}
//           <Link to="/login" className="text-blue-500 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  function submitHandler(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    axios
      .post("/users/register", {
        email,
        password,
      })
      .then((res) => {
        // localStorage.setItem("token", res.data.token);
        // localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user data
        console.log(res.data.user);
        // setUser(res.data.user);
        toast.success("Registration successful! Welcome 🎉"); // Show success popup
        navigate("/login");
      })
      .catch((err) => {
        console.log(err.response.data);
        setError(
          err.response.data.message || "Registration failed. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute w-96 h-96 bg-purple-600/20 blur-3xl rounded-full -top-10 -right-10 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 bg-blue-600/20 blur-3xl rounded-full bottom-0 left-0 animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute w-64 h-64 bg-teal-600/20 blur-3xl rounded-full top-1/2 right-1/3 animate-pulse"
          style={{ animationDelay: "2.5s" }}
        ></div>

        {/* Animated floating particles */}
        <div className="absolute w-2 h-2 bg-white/40 rounded-full top-1/3 right-1/4 animate-float"></div>
        <div
          className="absolute w-1 h-1 bg-white/30 rounded-full top-2/3 left-1/3 animate-float"
          style={{ animationDelay: "2.2s" }}
        ></div>
        <div
          className="absolute w-3 h-3 bg-white/20 rounded-full top-1/2 left-2/3 animate-float"
          style={{ animationDelay: "1.3s" }}
        ></div>
        <div
          className="absolute w-2 h-2 bg-white/30 rounded-full bottom-1/3 right-1/2 animate-float"
          style={{ animationDelay: "3.1s" }}
        ></div>
      </div>

      {/* Glassmorphic Card with enhanced design */}
      <div className="w-full max-w-md bg-gray-800/40 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-gray-700/50 relative z-10 transform transition-all duration-300 hover:scale-[1.01]">
        {/* Logo with glow effect */}
        <div className="flex justify-center mb-2">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-600 relative">
            SOEN
            <span className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full -z-10"></span>
          </h1>
        </div>
        <p className="text-gray-300 text-center mb-8 italic">
          Join our collaborative ecosystem.
        </p>

        <h2 className="text-2xl font-semibold text-white mb-8 text-center">
          Create Your Account
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-6">
          <div className="space-y-2">
            <label
              className="block text-gray-300 text-sm font-medium pl-1"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full p-4 pl-5 rounded-xl bg-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 backdrop-blur-sm border border-gray-600/50"
                placeholder="Enter your email"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="block text-gray-300 text-sm font-medium pl-1"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                id="password"
                className="w-full p-4 pl-5 rounded-xl bg-gray-700/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-all duration-300 backdrop-blur-sm border border-gray-600/50"
                placeholder="Enter your password"
                required
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 hover:opacity-100 pointer-events-none transition-opacity duration-300"></div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white font-semibold hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
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
                Creating account...
              </span>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center space-x-2">
          <div className="h-px bg-gray-600/50 w-full"></div>
          <span className="text-gray-400 text-sm px-4">OR</span>
          <div className="h-px bg-gray-600/50 w-full"></div>
        </div>

        <p className="text-gray-300 mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 font-medium hover:from-purple-300 hover:to-blue-400 transition-all duration-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
