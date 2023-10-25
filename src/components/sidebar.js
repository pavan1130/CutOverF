import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom"; // Changed from Link to NavLink
import "../Styles/sidebar.css";
import { IoSpeedometerSharp } from "react-icons/io5";
import { AiOutlineMenu, AiOutlineLogout } from "react-icons/ai";
import { FaSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
function Sidebar() {
  const [activeComponent, setActiveComponent] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    // Extract the path from the URL to determine the active component
    const currentPath = window.location.pathname;
    setActiveComponent(currentPath);
  }, []);

  const handleComponentClick = (component) => {
    setActiveComponent(component);
  };
  const handleLogout = () => {
    navigate("/");
  };
  return (
    <div className="Sidebar">
      <NavLink to="/welcome">
        <div
          className={activeComponent === "/welcome" ? "active-icon" : ""}
          onClick={() => handleComponentClick("/welcome")}
        >
          <IoSpeedometerSharp className="icon-svg" />
        </div>
      </NavLink>
      <NavLink to="/tasktable">
        <div
          className={activeComponent === "/tasktable" ? "active-icon" : ""}
          onClick={() => handleComponentClick("/tasktable")}
        >
          <AiOutlineMenu className="icon-svg1" />
        </div>
      </NavLink>

      <NavLink to="/save">
        <div
          className={activeComponent === "/save" ? "active-icon" : ""}
          onClick={() => handleComponentClick("/save")}
        >
          <FaSave className="icon-svg4" />
        </div>
      </NavLink>
      <AiOutlineLogout className="icon-svg3" onClick={handleLogout} />
    </div>
  );
}

export default Sidebar;
