// import React, { useContext, useState, useEffect } from "react";
// import { UserContext } from "../context/user.context";
// import axios from "../config/axios";
// import { useNavigate } from "react-router-dom";

// const Home = () => {
//   const { user } = useContext(UserContext);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [projectName, setProjectName] = useState(null);
//   const [project, setProject] = useState([]);

//   const navigate = useNavigate();

//   function createProject(e) {
//     e.preventDefault();
//     console.log({ projectName });

//     axios
//       .post("/projects/create", {
//         name: projectName,
//       })
//       .then((res) => {
//         console.log(res);
//         setIsModalOpen(false);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   }

//   useEffect(() => {
//     axios
//       .get("/projects/all")
//       .then((res) => {
//         setProject(res.data.projects);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   return (
//     <main className="p-4">
//       <div className="projects flex flex-wrap gap-3">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="project p-4 border border-slate-300 rounded-md"
//         >
//           New Project
//           <i className="ri-link ml-2"></i>
//         </button>

//         {project.map((project) => (
//           <div
//             key={project._id}
//             onClick={() => {
//               navigate(`/project`, {
//                 state: { project },
//               });
//             }}
//             className="project flex flex-col gap-2 cursor-pointer p-4 border border-slate-300 rounded-md min-w-52 hover:bg-slate-200"
//           >
//             <h2 className="font-semibold">{project.name}</h2>

//             <div className="flex gap-2">
//               <p>
//                 {" "}
//                 <small>
//                   {" "}
//                   <i className="ri-user-line"></i> Collaborators
//                 </small>{" "}
//                 :
//               </p>
//               {project.users.length}
//             </div>
//           </div>
//         ))}
//       </div>

//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-md shadow-md w-1/3">
//             <h2 className="text-xl mb-4">Create New Project</h2>
//             <form onSubmit={createProject}>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Project Name
//                 </label>
//                 <input
//                   onChange={(e) => setProjectName(e.target.value)}
//                   value={projectName}
//                   type="text"
//                   className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//                   required
//                 />
//               </div>
//               <div className="flex justify-end">
//                 <button
//                   type="button"
//                   className="mr-2 px-4 py-2 bg-gray-300 rounded-md"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-md"
//                 >
//                   Create
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// };

// export default Home;

// import React, { useContext, useState, useEffect, useRef } from "react";
// import { UserContext } from "../context/user.context";
// import axios from "../config/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Home = () => {
//   const { user, setUser } = useContext(UserContext);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [projectName, setProjectName] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);

//   const profileMenuRef = useRef(null);

//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("theme") === "dark"
//   );

//   const navigate = useNavigate();

//   // Handle clicks outside of the profile menu to close it
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target)
//       ) {
//         setShowProfileMenu(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [profileMenuRef]);

//   useEffect(() => {
//     // Check if user is logged in
//     if (!user) {
//       // toast.error("You need to log in first!");
//       navigate("/login");
//       return;
//     }

//     // Set initial theme based on localStorage or system preference
//     if (
//       localStorage.getItem("theme") === "dark" ||
//       (!localStorage.getItem("theme") &&
//         window.matchMedia("(prefers-color-scheme: dark)").matches)
//     ) {
//       document.documentElement.classList.add("dark");
//       setDarkMode(true);
//     } else {
//       document.documentElement.classList.remove("dark");
//       setDarkMode(false);
//     }
//   }, [user, navigate]);

//   const toggleTheme = () => {
//     if (darkMode) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       setDarkMode(false);
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       setDarkMode(true);
//     }
//   };

//   const toggleProfileMenu = () => {
//     setShowProfileMenu(!showProfileMenu);
//   };

//   const handleLogout = () => {
//     // Clear user data from context
//     setUser(null);
//     toast.success("Logged out successfully!");
//     // Remove token from localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     // Redirect to login page
//     navigate("/login");
//   };

//   function createProject(e) {
//     e.preventDefault();
//     if (!projectName?.trim()) return;

//     axios
//       .post("/projects/create", {
//         name: projectName,
//       })
//       .then((res) => {
//         console.log(res);
//         setIsModalOpen(false);
//         setProjectName("");
//         // Refresh project list
//         fetchProjects();
//       })
//       .catch((error) => {
//         console.log(error);
//         setError("Failed to create project. Please try again.");
//       });
//   }

//   const fetchProjects = () => {
//     if (!user) return;

//     setIsLoading(true);
//     axios
//       .get("/projects/all")
//       .then((res) => {
//         console.log(res.data.projects);
//         setProjects(res.data.projects);
//         setError(null);
//       })
//       .catch((err) => {
//         console.log(err);
//         setError("Failed to load projects. Please refresh the page.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   useEffect(() => {
//     if (user) {
//       fetchProjects();
//     }
//   }, [user]);

//   // If user is not logged in, don't render the component
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
//       <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
//               SOEN
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
//               Your workspace
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//               aria-label="Toggle theme"
//             >
//               {darkMode ? (
//                 <svg
//                   className="w-5 h-5 text-yellow-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                   ></path>
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5 text-gray-700"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
//                 </svg>
//               )}
//             </button>
//             {user && (
//               <div className="flex items-center relative" ref={profileMenuRef}>
//                 <div
//                   onClick={toggleProfileMenu}
//                   className="flex items-center space-x-2 cursor-pointer"
//                 >
//                   <span className="bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 rounded-full">
//                     <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-800 dark:text-gray-100 font-semibold">
//                       {user.email?.charAt(0).toUpperCase()}
//                     </div>
//                   </span>
//                   {/* <div className="text-gray-700 dark:text-gray-300">
//                     {user.email}
//                   </div> */}
//                   <div className="text-gray-700 dark:text-gray-300">
//                     {user.email?.split("@")[0]}
//                   </div>
//                 </div>

//                 {/* Profile dropdown menu */}
//                 {showProfileMenu && (
//                   <div className="absolute right-0 top-12 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                     >
//                       <div className="flex items-center">
//                         <svg
//                           className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                           ></path>
//                         </svg>
//                         Logout
//                       </div>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
//             Your Projects
//           </h2>
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 4v16m8-8H4"
//               ></path>
//             </svg>
//             <span>New Project</span>
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4 mb-6 text-red-700 dark:text-red-200">
//             {error}
//           </div>
//         )}

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : projects.length === 0 ? (
//           <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
//             <div className="inline-flex bg-gray-100 dark:bg-gray-700/50 p-4 rounded-full mb-4">
//               <svg
//                 className="w-8 h-8 text-gray-500 dark:text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                 ></path>
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
//               No projects yet
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Create your first project to get started with collaboration
//             </p>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
//             >
//               Create New Project
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             <div
//               onClick={() => setIsModalOpen(true)}
//               className="h-56 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-300 group shadow-sm hover:shadow-md"
//             >
//               <div className="h-14 w-14 bg-gray-100 dark:bg-gray-700/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                 <svg
//                   className="w-7 h-7 text-gray-600 dark:text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 4v16m8-8H4"
//                   ></path>
//                 </svg>
//               </div>
//               <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
//                 New Project
//               </p>
//             </div>

//             {projects.map((project) => (
//               <div
//                 key={project._id}
//                 onClick={() => {
//                   navigate(`/project`, {
//                     state: { project },
//                   });
//                 }}
//                 className="h-56 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 flex flex-col hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden group"
//               >
//                 {/* Hover effect */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-blue-500/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

//                 <div className="flex-grow">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
//                       {project.name}
//                     </h3>
//                     <svg
//                       className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M14 5l7 7m0 0l-7 7m7-7H3"
//                       ></path>
//                     </svg>
//                   </div>

//                   {/* <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
//                     Created {new Date(project.createdAt).toLocaleDateString()}
//                   </div> */}
//                 </div>

//                 <div className="mt-auto pt-4 border-t border-gray-200/70 dark:border-gray-700/50">
//                   <div className="flex items-center">
//                     <svg
//                       className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                       ></path>
//                     </svg>
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {project.users.length}{" "}
//                       {project.users.length === 1
//                         ? "Collaborator"
//                         : "Collaborators"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div
//             className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           ></div>
//           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-2xl w-full max-w-md relative z-10 animate-fadeIn">
//             <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
//               Create New Project
//             </h2>
//             <form onSubmit={createProject}>
//               <div className="mb-6">
//                 <label
//                   className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
//                   htmlFor="projectName"
//                 >
//                   Project Name
//                 </label>
//                 <input
//                   id="projectName"
//                   onChange={(e) => setProjectName(e.target.value)}
//                   value={projectName}
//                   type="text"
//                   className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                   placeholder="Enter project name"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg transition-colors"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
//                 >
//                   Create Project
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Home;

// import React, { useContext, useState, useEffect, useRef } from "react";
// import { UserContext } from "../context/user.context";
// import axios from "../config/axios";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Home = () => {
//   const { user, setUser } = useContext(UserContext);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [projectName, setProjectName] = useState("");
//   const [projects, setProjects] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [showProfileMenu, setShowProfileMenu] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredProjects, setFilteredProjects] = useState([]);

//   const profileMenuRef = useRef(null);

//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("theme") === "dark"
//   );

//   const navigate = useNavigate();

//   // Handle clicks outside of the profile menu to close it
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (
//         profileMenuRef.current &&
//         !profileMenuRef.current.contains(event.target)
//       ) {
//         setShowProfileMenu(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [profileMenuRef]);

//   useEffect(() => {
//     // Check if user is logged in
//     if (!user) {
//       // toast.error("You need to log in first!");
//       navigate("/login");
//       return;
//     }

//     // Set initial theme based on localStorage or system preference
//     if (
//       localStorage.getItem("theme") === "dark" ||
//       (!localStorage.getItem("theme") &&
//         window.matchMedia("(prefers-color-scheme: dark)").matches)
//     ) {
//       document.documentElement.classList.add("dark");
//       setDarkMode(true);
//     } else {
//       document.documentElement.classList.remove("dark");
//       setDarkMode(false);
//     }
//   }, [user, navigate]);

//   // Filter projects based on search term
//   useEffect(() => {
//     if (projects.length > 0) {
//       const results = projects.filter((project) =>
//         project.name.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredProjects(results);
//     }
//   }, [searchTerm, projects]);

//   const toggleTheme = () => {
//     if (darkMode) {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("theme", "light");
//       setDarkMode(false);
//     } else {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("theme", "dark");
//       setDarkMode(true);
//     }
//   };

//   const toggleProfileMenu = () => {
//     setShowProfileMenu(!showProfileMenu);
//   };

//   const handleLogout = () => {
//     // Clear user data from context
//     setUser(null);
//     toast.success("Logged out successfully!");
//     // Remove token from localStorage
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     // Redirect to login page
//     navigate("/login");
//   };

//   function createProject(e) {
//     e.preventDefault();
//     if (!projectName?.trim()) return;

//     axios
//       .post("/projects/create", {
//         name: projectName,
//       })
//       .then((res) => {
//         console.log(res);
//         setIsModalOpen(false);
//         setProjectName("");
//         // Refresh project list
//         fetchProjects();
//       })
//       .catch((error) => {
//         console.log(error);
//         setError("Failed to create project. Please try again.");
//       });
//   }

//   const fetchProjects = () => {
//     if (!user) return;

//     setIsLoading(true);
//     axios
//       .get("/projects/all")
//       .then((res) => {
//         console.log(res.data.projects);
//         setProjects(res.data.projects);
//         setFilteredProjects(res.data.projects);
//         setError(null);
//       })
//       .catch((err) => {
//         console.log(err);
//         setError("Failed to load projects. Please refresh the page.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   useEffect(() => {
//     if (user) {
//       fetchProjects();
//     }
//   }, [user]);

//   // If user is not logged in, don't render the component
//   if (!user) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 bg-fixed">
//       {/* Background pattern overlay */}
//       <div className="fixed inset-0 bg-opacity-50 pointer-events-none z-0">
//         <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10"></div>
//       </div>

//       <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg sticky top-0 z-40">
//         <div className="container mx-auto px-6 py-4 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
//               SOEN
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
//               Your workspace
//             </p>
//           </div>
//           <div className="flex items-center space-x-4">
//             <button
//               onClick={toggleTheme}
//               className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
//               aria-label="Toggle theme"
//             >
//               {darkMode ? (
//                 <svg
//                   className="w-5 h-5 text-yellow-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
//                     fillRule="evenodd"
//                     clipRule="evenodd"
//                   ></path>
//                 </svg>
//               ) : (
//                 <svg
//                   className="w-5 h-5 text-gray-700"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
//                 </svg>
//               )}
//             </button>
//             {user && (
//               <div className="flex items-center relative" ref={profileMenuRef}>
//                 <div
//                   onClick={toggleProfileMenu}
//                   className="flex items-center space-x-2 cursor-pointer"
//                 >
//                   <span className="bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 rounded-full">
//                     <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-800 dark:text-gray-100 font-semibold">
//                       {user.email?.charAt(0).toUpperCase()}
//                     </div>
//                   </span>
//                   <div className="text-gray-700 dark:text-gray-300">
//                     {user.email?.split("@")[0]}
//                   </div>
//                 </div>

//                 {/* Profile dropdown menu - fixed z-index to be higher than any other content */}
//                 {showProfileMenu && (
//                   <div className="absolute right-0 top-12 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
//                     <button
//                       onClick={handleLogout}
//                       className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                     >
//                       <div className="flex items-center">
//                         <svg
//                           className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                           xmlns="http://www.w3.org/2000/svg"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                           ></path>
//                         </svg>
//                         Logout
//                       </div>
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto px-6 py-8 relative z-10">
//         <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
//           <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
//             Your Projects
//           </h2>

//           {/* Search bar */}
//           <div className="relative flex-grow max-w-md">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <svg
//                 className="w-5 h-5 text-gray-500 dark:text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 ></path>
//               </svg>
//             </div>
//             <input
//               type="text"
//               placeholder="Search projects..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-white/80 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20 min-w-[140px]"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M12 4v16m8-8H4"
//               ></path>
//             </svg>
//             <span>New Project</span>
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4 mb-6 text-red-700 dark:text-red-200">
//             {error}
//           </div>
//         )}

//         {isLoading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//           </div>
//         ) : filteredProjects.length === 0 && searchTerm ? (
//           <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
//             <div className="inline-flex bg-gray-100 dark:bg-gray-700/50 p-4 rounded-full mb-4">
//               <svg
//                 className="w-8 h-8 text-gray-500 dark:text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 ></path>
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
//               No matching projects
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               We couldn't find any projects matching "{searchTerm}"
//             </p>
//             <button
//               onClick={() => setSearchTerm("")}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
//             >
//               Clear Search
//             </button>
//           </div>
//         ) : projects.length === 0 ? (
//           <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
//             <div className="inline-flex bg-gray-100 dark:bg-gray-700/50 p-4 rounded-full mb-4">
//               <svg
//                 className="w-8 h-8 text-gray-500 dark:text-gray-400"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M12 6v6m0 0v6m0-6h6m-6 0H6"
//                 ></path>
//               </svg>
//             </div>
//             <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
//               No projects yet
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               Create your first project to get started with collaboration
//             </p>
//             <button
//               onClick={() => setIsModalOpen(true)}
//               className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
//             >
//               Create New Project
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             <div
//               onClick={() => setIsModalOpen(true)}
//               className="h-56 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-300 group shadow-sm hover:shadow-md"
//             >
//               <div className="h-14 w-14 bg-gray-100 dark:bg-gray-700/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
//                 <svg
//                   className="w-7 h-7 text-gray-600 dark:text-gray-300"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M12 4v16m8-8H4"
//                   ></path>
//                 </svg>
//               </div>
//               <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
//                 New Project
//               </p>
//             </div>

//             {filteredProjects.map((project) => (
//               <div
//                 key={project._id}
//                 onClick={() => {
//                   navigate(`/project`, {
//                     state: { project },
//                   });
//                 }}
//                 className="h-56 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 flex flex-col hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden group"
//               >
//                 {/* Card glow effect on hover */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-blue-500/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                 {/* Card border glow effect */}
//                 <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-500/20 dark:group-hover:border-purple-500/30 transition-colors duration-300"></div>

//                 <div className="flex-grow">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
//                       {project.name}
//                     </h3>
//                     <svg
//                       className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M14 5l7 7m0 0l-7 7m7-7H3"
//                       ></path>
//                     </svg>
//                   </div>

//                   <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
//                     Created {new Date(project.createdAt).toLocaleDateString()}
//                   </div>
//                 </div>

//                 <div className="mt-auto pt-4 border-t border-gray-200/70 dark:border-gray-700/50">
//                   <div className="flex items-center">
//                     <svg
//                       className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
//                       ></path>
//                     </svg>
//                     <span className="text-gray-700 dark:text-gray-300">
//                       {project.users.length}{" "}
//                       {project.users.length === 1
//                         ? "Collaborator"
//                         : "Collaborators"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div
//             className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
//             onClick={() => setIsModalOpen(false)}
//           ></div>
//           <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-2xl w-full max-w-md relative z-10 animate-fadeIn">
//             <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
//               Create New Project
//             </h2>
//             <form onSubmit={createProject}>
//               <div className="mb-6">
//                 <label
//                   className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
//                   htmlFor="projectName"
//                 >
//                   Project Name
//                 </label>
//                 <input
//                   id="projectName"
//                   onChange={(e) => setProjectName(e.target.value)}
//                   value={projectName}
//                   type="text"
//                   className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   required
//                   placeholder="Enter project name"
//                 />
//               </div>
//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg transition-colors"
//                   onClick={() => setIsModalOpen(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
//                 >
//                   Create Project
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* CSS for background grid pattern */}
//       <style jsx>{`
//         .bg-grid-pattern {
//           background-image: linear-gradient(
//               to right,
//               rgba(128, 128, 128, 0.1) 1px,
//               transparent 1px
//             ),
//             linear-gradient(
//               to bottom,
//               rgba(128, 128, 128, 0.1) 1px,
//               transparent 1px
//             );
//           background-size: 24px 24px;
//         }

//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: scale(0.9);
//           }
//           to {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Home;

import React, { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../context/user.context";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const { user, setUser } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);

  const profileMenuRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  // Handle clicks outside of the profile menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef]);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      // toast.error("You need to log in first!");
      navigate("/login");
      return;
    }

    // Set initial theme based on localStorage or system preference
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove("dark");
      setDarkMode(false);
    }
  }, [user, navigate]);

  // Filter projects based on search term
  useEffect(() => {
    if (projects.length > 0) {
      const results = projects.filter((project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(results);
    }
  }, [searchTerm, projects]);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleLogout = () => {
    // Clear user data from context
    setUser(null);
    toast.success("Logged out successfully!");
    // Remove token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login page
    navigate("/login");
  };

  function createProject(e) {
    e.preventDefault();
    if (!projectName?.trim()) return;

    axios
      .post("/projects/create", {
        name: projectName,
      })
      .then((res) => {
        console.log(res);
        setIsModalOpen(false);
        setProjectName("");
        // Refresh project list
        fetchProjects();
      })
      .catch((error) => {
        console.log(error);
        setError("Failed to create project. Please try again.");
      });
  }

  const fetchProjects = () => {
    if (!user) return;

    setIsLoading(true);
    axios
      .get("/projects/all")
      .then((res) => {
        console.log(res.data.projects);
        setProjects(res.data.projects);
        setFilteredProjects(res.data.projects);
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        setError("Failed to load projects. Please refresh the page.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  // If user is not logged in, don't render the component
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 bg-fixed">
      {/* Circuit board background pattern */}
      <div className="fixed inset-0 bg-opacity-50 pointer-events-none z-0">
        {/* Circuit pattern overlay */}
        <div className="absolute inset-0 circuit-board-pattern opacity-10 dark:opacity-15"></div>

        {/* Light mode particles */}
        <div className="light-mode-particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>

        {/* Light mode waves with improved animation */}
        <div className="light-mode-wave" style={{ top: "25%" }}></div>
        <div
          className="light-mode-wave"
          style={{ top: "45%", animationDelay: "3s" }}
        ></div>
        <div
          className="light-mode-wave"
          style={{ top: "65%", animationDelay: "6s" }}
        ></div>
        <div
          className="light-mode-wave"
          style={{ top: "85%", animationDelay: "9s" }}
        ></div>

        {/* Enhanced floating elements */}
        <div className="chip chip-1"></div>
        <div className="chip chip-2"></div>
        <div className="chip chip-3"></div>
        <div className="chip chip-4"></div>
        <div className="chip chip-5"></div>

        {/* Binary code floating in background */}
        <div className="binary binary-1">010110</div>
        <div className="binary binary-2">101001</div>
        <div className="binary binary-3">110101</div>
        <div className="binary binary-4">001101</div>

        {/* PC and monitor designs */}
        <div className="pc-monitor pc-1"></div>
        <div className="pc-monitor pc-2"></div>
        <div className="pc-monitor pc-3"></div>

        {/* Mouse designs */}
        <div className="mouse mouse-1"></div>
        <div className="mouse mouse-2"></div>

        {/* Light mode specific elements */}
        <div className="light-mode-only light-bubble bubble-1"></div>
        <div className="light-mode-only light-bubble bubble-2"></div>
        <div className="light-mode-only light-bubble bubble-3"></div>
        <div className="light-mode-only light-bubble bubble-4"></div>
        <div className="light-mode-only light-bubble bubble-5"></div>

        {/* Abstract tech shapes for light mode */}
        <div className="light-mode-only tech-shape shape-1"></div>
        <div className="light-mode-only tech-shape shape-2"></div>
        <div className="light-mode-only tech-shape shape-3"></div>

        {/* Collaboration elements */}
        <div className="collab collab-1">
          <div className="collab-line"></div>
          <div className="collab-dot"></div>
        </div>
        <div className="collab collab-2">
          <div className="collab-line"></div>
          <div className="collab-dot"></div>
        </div>
        <div className="collab collab-3">
          <div className="collab-line"></div>
          <div className="collab-dot"></div>
        </div>
      </div>

      <header className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border-b border-blue-200 dark:border-gray-700/50 shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-600">
              SOEN
            </h1>
            <p className="text-blue-700 dark:text-gray-400 text-sm mt-1">
              Your workspace
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 transition-colors theme-toggle-btn"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <svg
                  className="w-5 h-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
            {user && (
              <div className="flex items-center relative" ref={profileMenuRef}>
                <div
                  onClick={toggleProfileMenu}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 p-0.5 rounded-full">
                    <div className="h-10 w-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-800 dark:text-gray-100 font-semibold">
                      {user.email?.charAt(0).toUpperCase()}
                    </div>
                  </span>
                  <div className="text-blue-800 dark:text-gray-300">
                    {user.email?.split("@")[0]}
                  </div>
                </div>

                {/* Profile dropdown menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-blue-200 dark:border-gray-700 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-blue-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-blue-500 dark:text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
                        Logout
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
          <h2 className="text-2xl font-semibold text-blue-800 dark:text-gray-200">
            Your Projects
          </h2>

          {/* Search bar */}
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="w-5 h-5 text-blue-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/90 dark:bg-gray-800/50 border border-blue-200 dark:border-gray-700 rounded-lg text-blue-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 search-input"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20 min-w-[140px] create-btn"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            <span>New Project</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 rounded-lg p-4 mb-6 text-red-700 dark:text-red-200">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredProjects.length === 0 && searchTerm ? (
          <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-blue-200/50 dark:border-gray-700/50 p-12 text-center">
            <div className="inline-flex bg-blue-100 dark:bg-gray-700/50 p-4 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-blue-700 dark:text-gray-300 mb-2">
              No matching projects
            </h3>
            <p className="text-blue-600 dark:text-gray-400 mb-6">
              We couldn't find any projects matching "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium create-btn"
            >
              Clear Search
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-blue-200/50 dark:border-gray-700/50 p-12 text-center">
            <div className="inline-flex bg-blue-100 dark:bg-gray-700/50 p-4 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-blue-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
            </div>
            <h3 className="text-xl font-medium text-blue-700 dark:text-gray-300 mb-2">
              No projects yet
            </h3>
            <p className="text-blue-600 dark:text-gray-400 mb-6">
              Create your first project to get started with collaboration
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium create-btn"
            >
              Create New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              onClick={() => setIsModalOpen(true)}
              className="h-56 bg-white/90 dark:bg-gray-800/40 backdrop-blur-sm border border-blue-200/50 dark:border-gray-700/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/80 dark:hover:bg-gray-700/40 transition-all duration-300 group shadow-sm hover:shadow-md new-project-card"
            >
              <div className="h-14 w-14 bg-blue-100 dark:bg-gray-700/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-blue-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
              </div>
              <p className="mt-4 text-blue-600 dark:text-gray-400 font-medium">
                New Project
              </p>
            </div>

            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => {
                  navigate(`/project`, {
                    state: { project },
                  });
                }}
                className="h-56 bg-white/90 dark:bg-gray-800/40 backdrop-blur-sm border border-blue-200/50 dark:border-gray-700/50 rounded-xl p-6 flex flex-col hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden group project-card"
              >
                {/* Light mode gradient overlay on cards */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-blue-500/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Light mode animated border */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-400/40 dark:group-hover:border-purple-500/30 transition-colors duration-300"></div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-blue-800 dark:text-gray-200 truncate">
                      {project.name}
                    </h3>
                    <svg
                      className="w-5 h-5 text-blue-500 dark:text-gray-400 group-hover:text-blue-600 transition-colors duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-blue-200/70 dark:border-gray-700/50">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-500 dark:text-gray-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                    <span className="text-blue-700 dark:text-gray-300">
                      {project.users.length}{" "}
                      {project.users.length === 1
                        ? "Collaborator"
                        : "Collaborators"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 rounded-xl p-6 shadow-2xl w-full max-w-md relative z-10 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-blue-800 dark:text-gray-200 mb-6">
              Create New Project
            </h2>
            <form onSubmit={createProject}>
              <div className="mb-6">
                <label
                  className="block text-blue-700 dark:text-gray-300 text-sm font-medium mb-2"
                  htmlFor="projectName"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="w-full p-3 bg-blue-50 dark:bg-gray-700/50 border border-blue-300 dark:border-gray-600 rounded-lg text-blue-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter project name"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-blue-100 dark:bg-gray-700 hover:bg-blue-200 dark:hover:bg-gray-600 text-blue-800 dark:text-gray-300 rounded-lg transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity create-btn"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSS for tech-themed patterns and animations */}
      <style jsx>
        {`
          .circuit-board-pattern {
            background-image: radial-gradient(
                circle at 25px 25px,
                rgba(59, 130, 246, 0.15) 2px,
                transparent 0
              ),
              linear-gradient(
                to right,
                rgba(59, 130, 246, 0.1) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(59, 130, 246, 0.1) 1px,
                transparent 1px
              );
            background-size: 50px 50px, 25px 25px, 25px 25px;
          }

          /* Chip animations */
          .chip {
            position: absolute;
            border-radius: 4px;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.1),
              rgba(124, 58, 237, 0.15)
            );
            border: 1px solid rgba(59, 130, 246, 0.2);
            box-shadow: 0 0 15px rgba(59, 130, 246, 0.15);
            opacity: 0.6;
          }

          .chip-1 {
            top: 15%;
            left: 10%;
            width: 80px;
            height: 80px;
            animation: float 15s ease-in-out infinite;
          }

          .chip-2 {
            top: 25%;
            right: 5%;
            width: 120px;
            height: 60px;
            animation: float 18s ease-in-out infinite reverse;
          }

          .chip-3 {
            bottom: 30%;
            left: 15%;
            width: 100px;
            height: 100px;
            animation: float 20s ease-in-out infinite 2s;
          }

          .chip-4 {
            bottom: 15%;
            right: 25%;
            width: 70px;
            height: 70px;
            animation: float 12s ease-in-out infinite 1s;
          }

          .chip-5 {
            top: 50%;
            left: 50%;
            width: 90px;
            height: 40px;
            animation: float 25s ease-in-out infinite 3s;
          }

          /* Binary code animations */
          .binary {
            position: absolute;
            font-family: monospace;
            color: rgba(59, 130, 246, 0.2);
            opacity: 0.4;
            font-size: 24px;
            text-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
          }

          .binary-1 {
            top: 20%;
            left: 30%;
            animation: fade 10s ease-in-out infinite;
          }

          .binary-2 {
            top: 70%;
            right: 15%;
            animation: fade 15s ease-in-out infinite 2s;
          }

          .binary-3 {
            bottom: 25%;
            left: 40%;
            animation: fade 12s ease-in-out infinite 5s;
          }

          .binary-4 {
            top: 35%;
            right: 35%;
            animation: fade 18s ease-in-out infinite 7s;
          }

          /* PC Monitor designs */
          .pc-monitor {
            position: absolute;
            opacity: 0.3;
            border-radius: 4px;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.08),
              rgba(124, 58, 237, 0.12)
            );
            border: 1px solid rgba(59, 130, 246, 0.15);
            box-shadow: 0 0 10px rgba(59, 130, 246, 0.1);
            position: relative;
          }

          .pc-monitor:after {
            content: "";
            position: absolute;
            bottom: -12px;
            left: 50%;
            transform: translateX(-50%);
            width: 40%;
            height: 12px;
            background: rgba(59, 130, 246, 0.1);
            border-radius: 0 0 4px 4px;
          }

          .pc-1 {
            top: 8%;
            right: 22%;
            width: 100px;
            height: 70px;
            animation: pulse 20s ease-in-out infinite;
          }

          .pc-2 {
            bottom: 15%;
            left: 8%;
            width: 140px;
            height: 90px;
            animation: pulse 25s ease-in-out infinite 7s;
          }

          .pc-3 {
            top: 40%;
            right: 12%;
            width: 120px;
            height: 80px;
            animation: pulse 22s ease-in-out infinite 3s;
          }

          /* Mouse designs */
          .mouse {
            position: absolute;
            border-radius: 20px;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.05),
              rgba(124, 58, 237, 0.08)
            );
            border: 1px solid rgba(59, 130, 246, 0.12);
            opacity: 0.4;
          }

          .mouse:after {
            content: "";
            position: absolute;
            top: 8px;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 10px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 1px;
          }

          .mouse-1 {
            bottom: 20%;
            right: 40%;
            width: 20px;
            height: 35px;
            animation: float 15s ease-in-out infinite 10s;
          }

          .mouse-2 {
            top: 25%;
            left: 18%;
            width: 20px;
            height: 35px;
            animation: float 18s ease-in-out infinite 5s;
          }

          /* Light mode specific bubbles */
          .light-mode-only {
            display: block;
          }

          .dark .light-mode-only {
            display: none;
          }

          .light-bubble {
            position: absolute;
            border-radius: 50%;
            background: linear-gradient(
              135deg,
              rgba(96, 165, 250, 0.4),
              rgba(124, 58, 237, 0.3)
            );
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
            filter: blur(1px);
            opacity: 0.3;
          }

          .bubble-1 {
            top: 20%;
            left: 25%;
            width: 150px;
            height: 150px;
            animation: pulse 20s ease-in-out infinite;
          }

          .bubble-2 {
            top: 40%;
            right: 15%;
            width: 180px;
            height: 180px;
            animation: pulse 25s ease-in-out infinite 3s;
          }

          .bubble-3 {
            bottom: 30%;
            left: 10%;
            width: 120px;
            height: 120px;
            animation: pulse 18s ease-in-out infinite 7s;
          }

          .bubble-4 {
            bottom: 15%;
            right: 25%;
            width: 200px;
            height: 200px;
            animation: pulse 22s ease-in-out infinite 10s;
          }

          .bubble-5 {
            top: 60%;
            left: 30%;
            width: 100px;
            height: 100px;
            animation: pulse 15s ease-in-out infinite 5s;
          }

          /* Abstract tech shapes */
          .tech-shape {
            position: absolute;
            opacity: 0.2;
            filter: blur(1px);
          }

          .shape-1 {
            top: 15%;
            left: 10%;
            width: 200px;
            height: 200px;
            border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.2),
              rgba(124, 58, 237, 0.3)
            );
            animation: morph 15s ease-in-out infinite;
          }

          .shape-2 {
            bottom: 20%;
            right: 15%;
            width: 250px;
            height: 250px;
            border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
            background: linear-gradient(
              135deg,
              rgba(124, 58, 237, 0.2),
              rgba(59, 130, 246, 0.3)
            );
            animation: morph 18s ease-in-out infinite 3s;
          }

          .shape-3 {
            top: 50%;
            left: 20%;
            width: 180px;
            height: 180px;
            border-radius: 50% 50% 20% 80% / 25% 80% 20% 75%;
            background: linear-gradient(
              135deg,
              rgba(59, 130, 246, 0.15),
              rgba(124, 58, 237, 0.25)
            );
            animation: morph 20s ease-in-out infinite 7s;
          }

          /* Collaboration network elements */
          .collab {
            position: absolute;
            opacity: 0.2;
          }

          .collab-line {
            position: absolute;
            background: linear-gradient(
              90deg,
              rgba(59, 130, 246, 0.1),
              rgba(124, 58, 237, 0.2)
            );
            height: 1px;
            animation: pulse 15s ease-in-out infinite;
          }

          .collab-dot {
            position: absolute;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(59, 130, 246, 0.3);
            animation: pulse 15s ease-in-out infinite;
          }

          .collab-1 {
            top: 30%;
            left: 20%;
          }

          .collab-1 .collab-line {
            width: 100px;
            transform: rotate(45deg);
            transform-origin: left center;
          }

          .collab-1 .collab-dot {
            left: 100px;
            top: 100px;
          }

          .collab-2 {
            top: 60%;
            right: 30%;
          }

          .collab-2 .collab-line {
            width: 150px;
            transform: rotate(-30deg);
            transform-origin: right center;
          }

          .collab-2 .collab-dot {
            right: 150px;
            top: -75px;
          }

          .collab-3 {
            bottom: 25%;
            left: 40%;
          }

          .collab-3 .collab-line {
            width: 120px;
            transform: rotate(15deg);
            transform-origin: left center;
          }

          .collab-3 .collab-dot {
            left: 115px;
            top: -30px;
          }

          /* Light mode particles */
          .light-mode-particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            opacity: 0.3;
          }

          .dark .light-mode-particles {
            opacity: 0.15;
          }

          .particle {
            position: absolute;
            width: 2px;
            height: 2px;
            background-color: rgba(59, 130, 246, 0.6);
            border-radius: 50%;
            animation: particleFloat 20s linear infinite;
            animation-delay: calc(var(--delay) * -1s);
            opacity: calc(var(--opacity) * 1);
          }

          .particle:nth-child(1) {
            --delay: 0;
            --opacity: 0.7;
            left: 10%;
            top: 20%;
          }
          .particle:nth-child(2) {
            --delay: 2;
            --opacity: 0.5;
            left: 20%;
            top: 40%;
          }
          .particle:nth-child(3) {
            --delay: 4;
            --opacity: 0.8;
            left: 30%;
            top: 10%;
          }
          .particle:nth-child(4) {
            --delay: 6;
            --opacity: 0.6;
            left: 40%;
            top: 30%;
          }
          .particle:nth-child(5) {
            --delay: 8;
            --opacity: 0.9;
            left: 50%;
            top: 50%;
          }
          .particle:nth-child(6) {
            --delay: 10;
            --opacity: 0.7;
            left: 60%;
            top: 15%;
          }
          .particle:nth-child(7) {
            --delay: 12;
            --opacity: 0.5;
            left: 70%;
            top: 35%;
          }
          .particle:nth-child(8) {
            --delay: 14;
            --opacity: 0.8;
            left: 80%;
            top: 45%;
          }
          .particle:nth-child(9) {
            --delay: 16;
            --opacity: 0.6;
            left: 90%;
            top: 25%;
          }
          .particle:nth-child(10) {
            --delay: 18;
            --opacity: 0.9;
            left: 15%;
            top: 65%;
          }
          .particle:nth-child(11) {
            --delay: 1;
            --opacity: 0.7;
            left: 25%;
            top: 85%;
          }
          .particle:nth-child(12) {
            --delay: 3;
            --opacity: 0.5;
            left: 35%;
            top: 75%;
          }
          .particle:nth-child(13) {
            --delay: 5;
            --opacity: 0.8;
            left: 45%;
            top: 95%;
          }
          .particle:nth-child(14) {
            --delay: 7;
            --opacity: 0.6;
            left: 55%;
            top: 85%;
          }
          .particle:nth-child(15) {
            --delay: 9;
            --opacity: 0.9;
            left: 65%;
            top: 75%;
          }
          .particle:nth-child(16) {
            --delay: 11;
            --opacity: 0.7;
            left: 75%;
            top: 95%;
          }
          .particle:nth-child(17) {
            --delay: 13;
            --opacity: 0.5;
            left: 85%;
            top: 70%;
          }
          .particle:nth-child(18) {
            --delay: 15;
            --opacity: 0.8;
            left: 95%;
            top: 90%;
          }
          .particle:nth-child(19) {
            --delay: 17;
            --opacity: 0.6;
            left: 5%;
            top: 55%;
          }
          .particle:nth-child(20) {
            --delay: 19;
            --opacity: 0.9;
            left: 32%;
            top: 95%;
          }

          /* Light mode waves */
          .light-mode-wave {
            position: absolute;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(59, 130, 246, 0.2),
              rgba(124, 58, 237, 0.3),
              rgba(59, 130, 246, 0.2),
              transparent
            );
            animation: waveMove 12s linear infinite;
            opacity: 0.3;
          }

          /* Animations */
          @keyframes float {
            0%,
            100% {
              transform: translateY(0) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(2deg);
            }
          }

          @keyframes fade {
            0%,
            100% {
              opacity: 0.1;
            }
            50% {
              opacity: 0.4;
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 0.2;
              transform: scale(1);
            }
            50% {
              opacity: 0.4;
              transform: scale(1.05);
            }
          }

          @keyframes morph {
            0%,
            100% {
              border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%;
            }
            34% {
              border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
            }
            67% {
              border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
            }
          }

          @keyframes particleFloat {
            0% {
              transform: translateY(0) translateX(0);
            }
            25% {
              transform: translateY(-20px) translateX(10px);
            }
            50% {
              transform: translateY(-40px) translateX(0);
            }
            75% {
              transform: translateY(-20px) translateX(-10px);
            }
            100% {
              transform: translateY(0) translateX(0);
            }
          }

          @keyframes waveMove {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 100vw 0;
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Card and element hover effects */
          .project-card:hover .chip,
          .new-project-card:hover .chip {
            opacity: 0.8;
            animation-play-state: paused;
          }

          /* Search input focus effect */
          .search-input:focus {
            background-color: rgba(255, 255, 255, 0.98);
          }

          .dark .search-input:focus {
            background-color: rgba(31, 41, 55, 0.8);
          }

          /* Button hover effects */
          .create-btn:hover {
            box-shadow: 0 5px 15px rgba(59, 130, 246, 0.4);
          }

          /* Theme toggle button animation */
          .theme-toggle-btn {
            transition: all 0.3s ease;
          }

          .theme-toggle-btn:hover {
            transform: rotate(12deg);
          }

          /* Modal animation */
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
        `}
      </style>
    </div>
  );
};
export default Home;
