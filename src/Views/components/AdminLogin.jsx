import { useState, useContext, useEffect } from "react";
import "./AdminLogin.css";
import Context from "../../Context/context";
import MessageBanner from "./MessageBanner.jsx";

const AdminLogin = ({
  onLogin,
  title = "Admin Login",
  subtitle = "Enter your credentials to access the dashboard",
  imageUrl = "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
}) => {
  const {
    auth: { login },
  } = useContext(Context);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [info, setInfo] = useState({
    showBanner: false,
    status: {
      message: "",
      type: "",
    },
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData?.email?.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData?.password?.trim()) {
      setError("Password is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData?.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 4) {
      setPasswordError("Password must be at least 4 characters");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(formData);
      console.log("Login response:", response);

      if (response.status === 200 && response?.data?.user?.role === "admin") {
        onLogin(response.data);
      } else {
        setInfo({
          ...info,
          showBanner: true,
          status: { message: "Loginfailed", type: "error" },
          isSubmitting: false,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.errors?.error ||
          "Login failed. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-wrapper">
        {/* Left Side - Jewellery Image */}
        <div className="admin-login-image-section">
          <img
            src={imageUrl}
            alt="Luxury Jewellery"
            className="admin-login-image"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="admin-login-form-section">
          <div className="admin-login-card">
            <div className="admin-login-header">
              <h1 className="admin-login-title">{title}</h1>
              <p className="admin-login-subtitle">{subtitle}</p>
            </div>
            {error && (
              <div className="error-alert">
                <span className="error-icon">!</span>
                <span className="error-message">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="admin-login-form">
              {info.showBanner && (
                <MessageBanner
                  type={info.status.type}
                  message={info.status.message}
                  onClose={() => setInfo({ ...info, showBanner: false })}
                />
              )}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading-spinner">
                    <div className="spinner"></div>
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="admin-login-footer">
              <a href="#" className="forgot-password">
                Forgot Password?
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
