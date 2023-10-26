import React, { useState } from "react";
import { useUser } from "./UserContext";
import "../Styles/LoginPage.css";
import loginImage from "../images/Login-bro.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const { setUserData } = useUser();
  const navigate = useNavigate(); // Get the navigate function from react-router-dom

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginSuccess = async (userData) => {
    window.alert("Login successful!");
    console.log(userData);

    const userEmail = formData.email;
    setUserData(userData);
    navigate(`/welcome?userEmail=${userEmail}`); // Use navigate to navigate
  };

  const handleLoginFailure = () => {
    window.alert("Login failed. Please check your email and password.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://amused-khakis-fly.cyclic.app/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const userData = await response.json();
        handleLoginSuccess(userData);
      } else {
        handleLoginFailure();
        const data = await response.json();
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form">
          <h2 className="login-title">Welcome</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
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
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="button-container">
              <button type="submit" className="login-button1">
                Sign In
              </button>
            </div>
          </form>
          <div className="signup-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </div>
        <div className="login-image">
          <img src={loginImage} alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

//========================================================================>>>
// import React, { useState } from "react";
// import { useUser } from "./UserContext";
// import "../Styles/LoginPage.css";
// import loginImage from "../images/Login-bro.png";
// import { Link } from "react-router-dom";

// const LoginPage = () => {
//   const { setUserData } = useUser();

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // const handleLoginSuccess = (userData) => {
//   //   window.alert("Login successful!");
//   //   setUserDetails(userData);
//   //   console.log(userData);
//   //   onLogin(userData);
//   //   window.location.href = `/welcome?userEmail=${userEmail}`;
//   // };

//   const handleLoginSuccess = async (userData) => {
//     window.alert("Login successful!");
//     console.log(userData);

//     const userEmail = formData.email;
//     // Set user data in the context
//     setUserData(userData);
//     window.location.href = `/welcome?userEmail=${userEmail}`;
//   };
//   // const handleLoginSuccess = async (userData) => {
//   //   window.alert("Login successful!");
//   //   console.log(userData);

//   //   const userEmail = formData.email;

//   //   // try {
//   //   //   const response = await fetch(
//   //   //     `http://localhost:3000/api/users/${userEmail}`
//   //   //   );
//   //   //   const userData = await response.json();

//   //   //   if (response.ok) {
//   //   //     setUserData(userData); // Update the user data in context
//   //   //     onLogin(userData); // Pass userData to onLogin function
//   //   //   } else {
//   //   //     console.error("Failed to retrieve user details");
//   //   //   }
//   //   // } catch (error) {
//   //   //   console.error(error);
//   //   // }

//   //   window.location.href = `/welcome?userEmail=${userEmail}`;
//   // };

//   const handleLoginFailure = () => {
//     window.alert("Login failed. Please check your email and password.");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:3000/api/users/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         // Extract user data from response

//         handleLoginSuccess(userData);
//         // Pass user data to handleLoginSuccess
//       } else {
//         handleLoginFailure();
//         const data = await response.json();
//         setError(data.error || "Login failed");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-content">
//         <div className="login-form">
//           <h2 className="login-title">Welcome</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             {error && <p className="error-message">{error}</p>}
//             <div className="button-container">
//               <button type="submit" className="login-button1">
//                 Sign In
//               </button>
//             </div>
//           </form>
//           <div className="signup-link">
//             Don't have an account? <Link to="/signup">Sign Up</Link>
//           </div>
//         </div>
//         <div className="login-image">
//           <img src={loginImage} alt="Login" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
//=============================================================>>>>>>Usecontext
// import React, { useState } from "react";
// import "../Styles/LoginPage.css";
// import loginImage from "../images/Login-bro.png";
// import { Link } from "react-router-dom";

// import { useUser } from "./UserContext";

// const LoginPage = ({ onLogin }) => {
//   const { setLoggedInUser } = useUser();

//   const [userDetails, setUserDetails] = useState(null);

//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   //   const handleLoginSuccess = (userData) => {
//   //     window.alert("Login successful!");
//   //     setUserDetails(userData);
//   //     console.log(userData);
//   //     onLogin(userData);
//   //     window.location.href = `/welcome?userEmail=${userData.email}`;
//   // };

//   // const handleLoginSuccess = async (userData) => {
//   //   window.alert("Login successful!");
//   //   // setUserDetails(userData);
//   //   console.log(userData);
//   //   // onLogin(userData);
//   //   const userEmail = formData.email;

//   //   try {
//   //     const response = await fetch(
//   //       `http://localhost:3000/api/users/${userEmail}`
//   //     );
//   //     const userData = await response.json();

//   //     if (response.ok) {
//   //       setUserDetails(userData);
//   //       console.log(userData); // Log the user details
//   //       onLogin(userData); // Pass userData to onLogin function
//   //     } else {
//   //       console.error("Failed to retrieve user details");
//   //     }
//   //   } catch (error) {
//   //     console.error(error);
//   //   }
//   //   window.location.href = `/welcome?userEmail=${userData.email}`;
//   // };
//   //all user data saving in : userData
//   const handleLoginSuccess = async (userData) => {
//     window.alert("Login successful!");
//     console.log(userData);

//     const userEmail = formData.email;

//     try {
//       const response = await fetch(
//         `http://localhost:3000/api/users/${userEmail}`
//       );
//       const userData = await response.json();

//       if (response.ok) {
//         setUserDetails(userData);
//         console.log(userData); // Log the user details
//         onLogin(userData); // Pass userData to onLogin function
//       } else {
//         console.error("Failed to retrieve user details");
//       }
//     } catch (error) {
//       console.error(error);
//     }

//     window.location.href = `/welcome?userEmail=${userEmail}`;
//   };

//   const handleLoginFailure = () => {
//     window.alert("Login failed. Please check your email and password.");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:3000/api/users/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         const userData = await response.json();
//         // Extract user data from response

//         handleLoginSuccess(userData);
//         // Pass user data to handleLoginSuccess
//       } else {
//         handleLoginFailure();
//         const data = await response.json();
//         setError(data.error || "Login failed");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-content">
//         <div className="login-form">
//           <h2 className="login-title">Welcome</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             {error && <p className="error-message">{error}</p>}
//             <div className="button-container">
//               <button type="submit" className="login-button1">
//                 Sign In
//               </button>
//             </div>
//           </form>
//           <div className="signup-link">
//             Don't have an account? <Link to="/signup">Sign Up</Link>
//           </div>
//         </div>
//         <div className="login-image">
//           <img src={loginImage} alt="Login" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;

//===========================================================>>>login okay
// import React, { useState } from "react";
// import "../Styles/LoginPage.css";
// import loginImage from "../images/Login-bro.png";
// import { Link } from "react-router-dom";

// const LoginPage = ({ onLogin }) => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   const [error, setError] = useState(null);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLoginSuccess = () => {
//     window.alert("Login successful!");

//     const userEmail = formData.email; // Get the user's email
//     window.location.href = `/welcome?userEmail=${userEmail}`; // Add email as a query parameter
//   };

//   const handleLoginFailure = () => {
//     window.alert("Login failed. Please check your email and password.");
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await fetch("http://localhost:3000/api/users/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         // Successful login
//         handleLoginSuccess();
//         onLogin(formData);
//       } else {
//         // Login failed
//         handleLoginFailure();
//         const data = await response.json();
//         setError(data.error || "Login failed");
//       }
//     } catch (error) {
//       console.error(error);
//       setError("An error occurred. Please try again later.");
//     }
//   };

//   return (
//     <div className="login-container">
//       <div className="login-content">
//         <div className="login-form">
//           <h2 className="login-title">Welcome</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="input-group">
//               <label htmlFor="email">Email</label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="input-group">
//               <label htmlFor="password">Password</label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             {error && <p className="error-message">{error}</p>}
//             <div className="button-container">
//               <button type="submit" className="login-button1">
//                 Sign In
//               </button>
//             </div>
//           </form>
//           <div className="signup-link">
//             Don't have an account? <Link to="/signup">Sign Up</Link>
//           </div>
//         </div>
//         <div className="login-image">
//           <img src={loginImage} alt="Login" />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
