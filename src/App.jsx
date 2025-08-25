import { useState, useEffect } from "react";
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

  if (isLoggedIn) {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  return (
    <AdminLogin
      onLogin={handleLogin}
      title="Kyuna Dashboard"
      subtitle="Admin access portal"
    />
  );
}

export default App;
