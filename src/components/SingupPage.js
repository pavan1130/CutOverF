import React, { useState } from "react";
import "../Styles/SignupPage.css";
import signupImage from "../images/Login-bro.png";
import { Link } from "react-router-dom";

const SingupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://amused-khakis-fly.cyclic.app/api/users/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        // Successful registration, you can redirect or show a success message
        console.log("Registration successful!");
        alert("Successfully Signup!!!");
        window.location.href = "/";

        return;
      } else {
        // Registration failed, handle errors here
        console.error("Registration failed");
        alert("SignUp Failed!!!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <div className="signup-image">
          <img src={signupImage} alt="Signup" />
        </div>
        <div className="signup-form">
          <h2 className="signup-title">Create an Account</h2>
          <p>Welcome back! Please enter your details</p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="button-container">
              <button
                type="submit"
                className="signup-button"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
            </div>
          </form>
          <div className="login-link">
            Already have an account? <Link to="/">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingupPage;
