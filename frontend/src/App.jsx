// import React from "react";
// import AppRoutes from "./routes/AppRoutes";
// import { UserProvider } from "./context/user.context";

// const App = () => {
//   return (
//     <UserProvider>
//       <AppRoutes />
//     </UserProvider>
//   );
// };

// export default App;

import React, { useEffect, useContext } from "react";
import AppRoutes from "./routes/AppRoutes";
import { UserProvider, UserContext } from "./context/user.context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppContent = () => {
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
