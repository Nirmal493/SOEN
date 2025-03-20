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
  const [pageLoaded, setPageLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showConferenceOptions, setShowConferenceOptions] = useState(false);

  const profileMenuRef = useRef(null);
  const conferenceMenuRef = useRef(null);

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  const navigate = useNavigate();

  // Handle page load animation
  useEffect(() => {
    setPageLoaded(true);
  }, []);

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle clicks outside of the profile menu to close it
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
      
      if (
        conferenceMenuRef.current &&
        !conferenceMenuRef.current.contains(event.target)
      ) {
        setShowConferenceOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef, conferenceMenuRef]);

  useEffect(() => {
    // Check if user is logged in
    if (!user) {
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

  const toggleConferenceOptions = () => {
    setShowConferenceOptions(!showConferenceOptions);
  };

  const handleConferenceRedirect = (platform) => {
    let url;
    switch(platform) {
      case 'google':
        url = 'https://meet.google.com/';
        break;
      case 'zoom':
        url = 'https://zoom.us/join';
        break;
      case 'microsoft':
        url = 'https://teams.microsoft.com/';
        break;
      default:
        url = '';
    }
    
    if (url) {
      window.open(url, '_blank');
    }
    setShowConferenceOptions(false);
  };

  const handleLogout = () => {
    setUser(null);
    toast.success("Logged out successfully!");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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

  if (!user) {
    return null;
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 bg-fixed ${
        pageLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-700`}
    >
      {/* Enhanced Background with Particles and Logo */}
      <div className="fixed inset-0 z-0">
        {/* Animated floating particles for light mode */}
        <div className="absolute inset-0 overflow-hidden opacity-30 dark:opacity-10">
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 animate-float"
              style={{
                width: `${Math.random() * 20 + 10}px`,
                height: `${Math.random() * 20 + 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 10 + 15}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Dynamic background pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-20"></div>

        {/* Abstract geometric shapes - Enhanced for light mode */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-blue-500/30 dark:bg-blue-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-500/30 dark:bg-purple-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-amber-500/20 dark:bg-amber-400/5 rounded-full blur-3xl animate-pulse-slow-delayed"></div>
        <div className="absolute bottom-1/3 left-1/4 w-44 h-44 bg-teal-500/20 dark:bg-teal-400/5 rounded-full blur-3xl animate-pulse-slow-delayed"></div>

        {/* Logo watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-10 dark:opacity-[0.02]">
          <svg
            className="w-96 h-96"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
            />
            <path
              d="M30 50 L70 50 M50 30 L50 70"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      <header
        className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40 transition-all duration-300 ${
          isScrolled ? "shadow-lg py-2" : "shadow-md py-3"
        }`}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo and app name - Changed from ProjectHub to SOEN */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-800 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent animate-gradient-x">
              SOEN
            </h1>
          </div>

          {/* Search bar */}
          <div className="max-w-md w-full mx-4 relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 px-4 pr-10 rounded-full border border-gray-300 dark:border-gray-600 bg-white/90 dark:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-300 hover:shadow-md focus:shadow-md"
            />
            <div className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* User profile and theme toggle */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 text-gray-700 dark:text-gray-300 transform hover:scale-110"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={toggleProfileMenu}
                className="flex items-center space-x-2 focus:outline-none group"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white font-medium shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {user?.name || "User"}
                </span>
                <svg
                  className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                    showProfileMenu ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50 transition-all duration-200 ${
                  showProfileMenu
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform -translate-y-2 pointer-events-none"
                }`}
              >
                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  Your Profile
                </a>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  Settings
                </a>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white animate-fade-in-left">
            Your Projects
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center hover:scale-105 group animate-fade-in-right"
          >
            <svg
              className="w-5 h-5 mr-2 transform group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            New Project
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 animate-slide-in">
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 bg-white/80 dark:bg-gray-800/60 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden relative animate-fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="absolute inset-0 skeleton-loading"></div>
                <div className="absolute top-6 left-6 h-6 w-3/4 bg-white/70 dark:bg-gray-700/70 rounded"></div>
                <div className="absolute bottom-6 left-6 h-4 w-1/4 bg-white/70 dark:bg-gray-700/70 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white/70 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 dark:border-gray-700/50 px-6 animate-fade-in">
            <div className="bg-blue-50 dark:bg-gray-700/60 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-inner animate-bounce-slow">
              <svg
                className="w-10 h-10 text-blue-500 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchTerm
                ? "No projects found matching your search"
                : "No projects yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Create your first project to get started"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow inline-flex items-center hover:shadow-lg transition-all duration-300 hover:scale-105 transform group"
              >
                <svg
                  className="w-5 h-5 mr-2 transform group-hover:rotate-90 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Create Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <div
                key={project._id}
                className="bg-white/80 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl p-6 shadow-md border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative transform group-hover:scale-105 transition-transform duration-300">
                  {/* Glow effect on hover (only visible in light mode) */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl opacity-0 group-hover:opacity-20 dark:group-hover:opacity-0 blur-md transition-opacity duration-300"></div>

                  {/* Card content */}
                  <div className="relative">
                    {/* Decorative element */}
                    <div className="absolute -top-3 -left-3 w-16 h-16 bg-gradient-to-br from-blue-500/30 to-indigo-600/30 rounded-lg blur-md"></div>

                    <div className="relative">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 truncate">
                        {project.name}
                      </h3>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs font-medium rounded-full">
                            {project.status || "Active"}
                          </span>
                        </div>

                        <button
                          onClick={() => navigate(`/project/${project._id}`)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors group-hover:animate-pulse"
                        >
                          <svg
                            className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Conference Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border-t border-gray-200/60 dark:border-gray-700/60 py-2 px-4 z-30 shadow-lg">
        <div className="container mx-auto">
          <div className="flex items-center justify-center space-x-2 relative">
            <div className="relative" ref={conferenceMenuRef}>
              <button
                onClick={toggleConferenceOptions}
                className="py-2 px-4 flex items-center space-x-2 text-gray-700 dark:text-gray-300 font-medium bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/40 rounded-lg transition-colors duration-300 group"
              >
                <svg 
                  className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:animate-pulse" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" 
                  />
                </svg>
                <span>Conference</span>
                <svg
                  className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform duration-300 ${
                    showConferenceOptions ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Conference options dropdown */}
              <div
                className={`absolute bottom-full left-0 mb-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 border border-gray-200 dark:border-gray-700 z-50 transition-all duration-200 ${
                  showConferenceOptions
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform translate-y-2 pointer-events-none"
                }`}
              >
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Choose platform</h3>
                </div>
                
                <button
                  onClick={() => handleConferenceRedirect('google')}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-white rounded overflow-hidden shadow-sm">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path 
                        d="M5.37,5.2c1.35-.3,2.64-.39,4.06-.35.68.07,1.32.24,1.95.5.64.51,1.22,1.16,1.65,1.9.19.3.35.63.47.97-.61.35-1.23.7-1.84,1.06-.38-.55-.85-1.04-1.49-1.32-1.1-.52-2.5-.52-3.54.13-.53.3-.96.75-1.26,1.27-.9,1.64-.06,3.82,1.66,4.58.68.31,1.46.33,2.2.19.76-.15,1.37-.66,1.77-1.3.36-.5.5-1.12.48-1.73-1.06,0-2.12,0-3.17-.01v-1.8h4.96,0c1.67,0,3.34,0,5.01,0,0,.24,0,.48,0,.72-1.46,0-2.93,0-4.39,0,.02,1.23-.7,2.43-1.8,2.94-.83.42-1.79.53-2.72.45-.74-.11-1.46-.35-2.09-.76-1.61-1.02-2.59-2.95-2.33-4.85.13-1.27.84-2.46,1.87-3.25.77-.58,1.68-.98,2.65-1.09Z" 
                        fill="#e33629" 
                      />
                      <path 
                        d="M19.44,5.2c1.52.08,2.98.8,3.9,2.04.91,1.2,1.25,2.75.95,4.19-1.28.01-2.55.01-3.83,0-.08-.94-.5-1.85-1.23-2.42-.37-.32-.8-.56-1.26-.71.41-.3.83-.58,1.24-.88.41-.29.81-.59,1.22-.88.01-.45.01-.89,0-1.34Z" 
                        fill="#f8bd00" 
                      />
                      <path 
                        d="M10.97,9.73c.56-.32,1.12-.64,1.68-.96.64.47,1.08,1.2,1.18,1.98.13,1.11-.45,2.28-1.44,2.83-.57.32-1.13.64-1.7.95-1.52,0-3.05,0-4.57,0v-4.8c1.62,0,3.24,0,4.85,0Z" 
                        fill="#587dbd" 
                      />
                      <path 
                        d="M19.44,11.43c1.27,0,2.55,0,3.82,0-.01,1.37-.51,2.76-1.41,3.82-1.24,1.5-3.27,2.31-5.23,2.01-.64-.1-1.25-.3-1.82-.6-.61-.31-1.17-.72-1.65-1.21.57-.57,1.13-1.13,1.7-1.7.79.77,1.93,1.16,3.02.99.95-.11,1.8-.72,2.28-1.52.4-.63.55-1.43.47-2.18.28-.2.55-.4.82-.61Z" 
                        fill="#2fb457" 
                      />
                    </svg>
                  </div>
                  <span>Google Meet</span>
                  <svg 
                    className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleConferenceRedirect('zoom')}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-white rounded overflow-hidden shadow-sm">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path
                        d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M12,18c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S15.31,18,12,18z"
                        fill="#4A8CFF"
                      />
                      <path 
                        d="M15.75,12c0,2.07-1.68,3.75-3.75,3.75c-2.07,0-3.75-1.68-3.75-3.75c0-2.07,1.68-3.75,3.75-3.75C14.07,8.25,15.75,9.93,15.75,12z" 
                        fill="#4A8CFF" 
                      />
                    </svg>
                  </div>
                  <span>Zoom</span>
                  <svg 
                    className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => handleConferenceRedirect('microsoft')}
                  className="flex items-center space-x-3 w-full px-4 py-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-150 group"
                >
                  <div className="w-6 h-6 flex items-center justify-center bg-white rounded overflow-hidden shadow-sm">
                    <svg viewBox="0 0 24 24" width="18" height="18">
                      <path fill="#4A5BA6" d="M11.7 8.2H4.8V2.5c0-.3.2-.5.5-.5h6.4c.3 0 .5.2.5.5v5.2c0 .3-.2.5-.5.5z" />
                      <path fill="#7D86C4" d="M18.7 8.2h-7v-6c0-.3.2-.5.5-.5h6.5c.3 0 .5.2.5.5v5.5c0 .3-.2.5-.5.5z" />
                      <path fill="#4A5BA6" d="M11.7 21.5H4.8v-5.7c0-.3.2-.5.5-.5h6.4c.3 0 .5.2.5.5v5.2c0 .3-.2.5-.5.5z" />
                      <path fill="#7D86C4" d="M18.7 21.5h-7v-6c0-.3.2-.5.5-.5h6.5c.3 0 .5.2.5.5v5.5c0 .3-.2.5-.5.5z" />
                    </svg>
                  </div>
                  <span>Microsoft Teams</span>
                  <svg 
                    className="w-4 h-4 ml-auto text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transform group-hover:translate-x-1 transition-transform duration-300" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={createProject} className="p-6">
              <div className="mb-4">
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  id="projectName"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium rounded-lg shadow hover:shadow-lg transition-all duration-200"
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