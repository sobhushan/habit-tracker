// src/pages/Login.tsx
import { useState } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import Navbar from "../components/Navbar";

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
        // alert("Login Successful");
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Invalid credentials. Try again.");
    }
  };
  

  return (
    <div
      className="container-fluid"
      style={{
        backgroundImage: 'url("/bg/bg3.jpg")',
        // backgroundImage: 'url("https://picsum.photos/1200/500")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        left:"0",
        right:0,
        position: "absolute",
      }}
    >
      <Navbar />
      {/* Login Card */}
      <div className="container mt-5">
        <div className="card mx-auto shadow-lg" style={{ maxWidth: "400px" }}>
        <img src="/bg/bg5.jpg" className="d-block w-100" style={{ height: "150px", objectFit: "cover" }}  />
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