// src/pages/Signup.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

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
        alert("Signup Successful");
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
      {/* Navbar - Positioned Absolutely Over the Background */}
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.3)", // Transparent White
          backdropFilter: "blur(8px)", // Glassmorphism Effect
          zIndex: 10,
        }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-dark fw-bold" to="/">
            Habit Tracker
          </Link>
        </div>
      </nav>

      {/* Signup Card */}
      <div className="container mt-5">
        <div className="card mx-auto shadow-lg" style={{ maxWidth: "400px" }}>
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
