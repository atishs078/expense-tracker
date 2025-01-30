import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import hostContext from "../context/HostContext";

const SignUp = () => {
  const [value, setValue] = useState({ name: "", email: "", password: "" });
  const context = useContext(hostContext);
  const { host } = context;
  const navigate = useNavigate();

  const onHandelChange = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value,
    });
  };

  const onHandelSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${host}api/user/register`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({ name: value.name, email: value.email, password: value.password }),
    });

    const jsonResponse = await response.json();
    console.log(jsonResponse);

    if (jsonResponse.authToken) {
      localStorage.setItem("authToken", jsonResponse.authtoken);
      localStorage.setItem("userId", jsonResponse.user);
      navigate("/");
    } else {
      alert(jsonResponse.error);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(145deg, #6a11cb, #2575fc)",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "12px",
          background: "#fff",
        }}
      >
        <h2 className="text-center mb-3" style={{ fontWeight: "bold", color: "#333" }}>
          Create Your Account
        </h2>
        <form>
          {/* Name Field */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-bold">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              className="form-control p-2"
              id="name"
              onChange={onHandelChange}
              value={value.name}
              required
              style={{
                borderRadius: "8px",
                border: "1px solid #ccc",
                transition: "0.3s",
              }}
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="form-control p-2"
              id="email"
              value={value.email}
              onChange={onHandelChange}
              required
              style={{
                borderRadius: "8px",
                border: "1px solid #ccc",
                transition: "0.3s",
              }}
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-bold">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              className="form-control p-2"
              id="password"
              value={value.password}
              onChange={onHandelChange}
              required
              style={{
                borderRadius: "8px",
                border: "1px solid #ccc",
                transition: "0.3s",
              }}
            />
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="btn  w-100 mt-3"
            onClick={onHandelSubmit}
            style={{
              padding: "10px",
              fontSize: "16px",
              fontWeight: "bold",
              borderRadius: "8px",
              background: "linear-gradient(145deg, #6a11cb, #2575fc)",
              border: "none",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.background = "linear-gradient(145deg, #6a11cb, #2575fc)")}
            onMouseOut={(e) => (e.target.style.background = "linear-gradient(145deg, #6a11cb, #2575fc)")}
          >
            Sign Up
          </button>
        </form>

        {/* Already Have Account */}
        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-decoration-none fw-bold" style={{ color: "#007bff" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
