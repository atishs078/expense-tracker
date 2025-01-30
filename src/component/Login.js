import React, { useState, useContext } from "react";
import hostContext from "../context/HostContext";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [credential, setCredential] = useState({ email: "", password: "" });
  const [error, setError] = useState('')
  const context = useContext(hostContext);
  const { host } = context;
  const navigate = useNavigate();

  const onHandelSubmiClick = async (e) => {
    e.preventDefault();
    const { email, password } = credential;
    const response = await fetch(`${host}api/user/login`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const jsonResponse = await response.json();
    console.log(jsonResponse);
    if (jsonResponse.authtoken) {
      localStorage.setItem("authToken", jsonResponse.authtoken);
      localStorage.setItem("userId", jsonResponse.user);
      navigate("/");
    } else {
      alert("Invalid credentials. Please try again.");
    }
  };

  const onChangeHandel = (e) => {
    setCredential({
      ...credential,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div
      className=" d-flex justify-content-center align-items-center "
      style={{ minHeight: "100vh", background: "linear-gradient(145deg, #6a11cb, #2575fc)" }}
    >
      <div
        className="card shadow-lg p-4 border-0"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(10px)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-5px)";
          e.currentTarget.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.1)";
        }}
      >
        <h2 className="text-center mb-4" style={{ color: "#333", fontWeight: "600" }}>
          Login
        </h2>
        <form>
          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label" style={{ color: "#555", fontWeight: "500" }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={credential.email}
              onChange={onChangeHandel}
              className="form-control"
              id="email"
              aria-describedby="emailHelp"
              required
              style={{ borderRadius: "10px", padding: "10px", border: "1px solid #ddd" }}
            />
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label" style={{ color: "#555", fontWeight: "500" }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={credential.password}
              onChange={onChangeHandel}
              className="form-control"
              id="password"
              required
              style={{ borderRadius: "10px", padding: "10px", border: "1px solid #ddd" }}
            />
          </div>
          <button
            type="submit"
            className="btn w-100 mt-3"
            onClick={onHandelSubmiClick}
            style={{
              borderRadius: "10px",
              padding: "10px",
              fontWeight: "600",
              background: "linear-gradient(145deg, #6a11cb, #2575fc)",
              border: "none",
              color: "#fff",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Login
          </button>
        </form>

        <p className="text-center mt-3 mb-0" style={{ color: "#555" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#6a11cb", fontWeight: "500", textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;