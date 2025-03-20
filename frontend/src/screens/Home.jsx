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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <header className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              SOEN
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Your workspace
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
                  className="w-5 h-5 text-gray-700"
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
                  {/* <div className="text-gray-700 dark:text-gray-300">
                    {user.email}
                  </div> */}
                  <div className="text-gray-700 dark:text-gray-300">
                    {user.email?.split("@")[0]}
                  </div>
                </div>

                {/* Profile dropdown menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 top-12 w-48 py-2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"
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

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Your Projects
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium flex items-center space-x-2 hover:opacity-90 transition-all duration-200 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20"
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
        ) : projects.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center">
            <div className="inline-flex bg-gray-100 dark:bg-gray-700/50 p-4 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-500 dark:text-gray-400"
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
            <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Create your first project to get started with collaboration
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium"
            >
              Create New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              onClick={() => setIsModalOpen(true)}
              className="h-56 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-all duration-300 group shadow-sm hover:shadow-md"
            >
              <div className="h-14 w-14 bg-gray-100 dark:bg-gray-700/70 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-7 h-7 text-gray-600 dark:text-gray-300"
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
              <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">
                New Project
              </p>
            </div>

            {projects.map((project) => (
              <div
                key={project._id}
                onClick={() => {
                  navigate(`/project`, {
                    state: { project },
                  });
                }}
                className="h-56 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl p-6 flex flex-col hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:scale-[1.02] cursor-pointer relative overflow-hidden group"
              >
                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 dark:from-blue-500/10 dark:to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 truncate">
                      {project.name}
                    </h3>
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors duration-300"
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

                  {/* <div className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </div> */}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-200/70 dark:border-gray-700/50">
                  <div className="flex items-center">
                    <svg
                      className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2"
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
                    <span className="text-gray-700 dark:text-gray-300">
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
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-2xl w-full max-w-md relative z-10 animate-fadeIn">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
              Create New Project
            </h2>
            <form onSubmit={createProject}>
              <div className="mb-6">
                <label
                  className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2"
                  htmlFor="projectName"
                >
                  Project Name
                </label>
                <input
                  id="projectName"
                  onChange={(e) => setProjectName(e.target.value)}
                  value={projectName}
                  type="text"
                  className="w-full p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Enter project name"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 rounded-lg transition-colors"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
