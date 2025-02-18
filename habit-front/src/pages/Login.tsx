// src/pages/Login.tsx
import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      
      alert(response.data.message);
      if (response.data.message.includes("Login successful")) {
        // Store user_id and username in localStorage
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("username", response.data.username);
        alert("Login Successful");
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Invalid credentials. Try again.");
    }
  };
  

  return (
    <div
      className="container-fluid position-relative"
      style={{
        backgroundImage: 'url("https://picsum.photos/1200/500")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      {/* Navbar - Overlapping Effect */}
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(8px)",
          zIndex: 10,
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-dark fw-bold" to="/">
            Habit Tracker
          </Link>
        </div>
      </nav>

      {/* Login Card */}
      <div className="container mt-5">
        <div className="card mx-auto shadow-lg" style={{ maxWidth: "400px" }}>
          <div className="card-body">
            <h2 className="text-center">Login</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="position-absolute border-0 bg-transparent"
                  style={{ top: "55%", right: "10px", cursor: "pointer" }}
                >
                  <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="text-end">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>

              <div className="d-grid mt-3">
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <Link to="/signup" className="text-decoration-none">
                New User? Signup Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;