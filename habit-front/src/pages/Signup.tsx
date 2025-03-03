// src/pages/Signup.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Navbar from "../components/Navbar";

const Signup = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        username,
        email,
        password,
      });

      alert(response.data.message); // Show success or failure message

      if (response.data.message.includes('Signup successful')) {
        // alert("Signup Successful");
        window.location.href = '/login';
        
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Try again.');
    }
  };

  return (
    <div
      className="container-fluid position-relative"
      style={{
        // backgroundImage: 'url("https://picsum.photos/1200/500")',
        backgroundImage: 'url("/bg/bg2.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Navbar />

      {/* Signup Card */}
      <div className="container mt-5">
        <div className="card mx-auto shadow-lg" style={{ maxWidth: "400px" }}>
        <img src="/bg/bg5.jpg" className="d-block w-100" style={{ height: "150px", objectFit: "cover" }}  />
          <div className="card-body">
            <h2 className="text-center">Signup Here</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Enter your full name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

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

              <div className="d-grid">
                <button type="submit" className="btn btn-success">
                  Signup
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <Link to="/login" className="text-decoration-none">
                Already a user? Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
