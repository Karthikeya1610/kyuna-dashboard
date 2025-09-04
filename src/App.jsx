import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./Views/components/AdminLogin";
import AdminDashboard from "./Views/components/AdminDashboard";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (credentials?.user?.role === "admin") {
      console.log("Login successful:", credentials);
      localStorage.setItem("token", credentials?.token);
      setIsLoggedIn(true);
    } else {
      throw new Error("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    console.log("Logged out successfully");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <AdminLogin
                onLogin={handleLogin}
                title="Kyuna Dashboard"
                subtitle="Admin access portal"
              />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />
        <Route
          path="/dashboard/*"
          element={
            isLoggedIn ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
