import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import { FiMenu } from "react-icons/fi";
import { notification } from "antd";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";

const Navbar = () => {
  const [iconActive, setIconActive] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if there's a token in cookies
  useEffect(() => {
    const userToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("usertoken"))
        ?.split("=")[1]; // Get token from cookies
    if (userToken) {
        setToken(userToken);

        // Fetch user info from the backend using the token
        axios
            .get("http://localhost:8000/api/paldoc/authenticate", {
                headers: { Authorization: `Bearer ${userToken}` },
                withCredentials: true, // Ensure cookies are sent with the request
            })
            .then((response) => {
                setUser(response.data.user);
            })
            .catch((error) => {
                console.log(error);
                setToken(null); // Clear token if error fetching user info
            });
    }
   }, []);

  const logoutFunc = () => {
    axios.post('http://localhost:8000/api/paldoc/logout', {}, { withCredentials: true })
      .then(() => {
        setToken(null); // Clear token on logout
        setUser(null); // Clear user info on logout
        navigate("/");
        notification.success({ message: "Logout successful!" });
      })
      .catch((error) => {
        console.log(error);
        // Optionally handle error here
      });
  };

  return (
    <header>
      <nav className={iconActive ? "nav-active" : ""}>
        <h2 className="nav-logo">
          <NavLink to={"/"}>PalDoc</NavLink>
        </h2>
        <ul className="nav-links">
          <li>
            <NavLink to={"/"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/doctors"}>Our Doctors</NavLink>
          </li>
          {token && (
            <>
              <li>
                <NavLink to={"/appointments"}>Appointments</NavLink>
              </li>
              <li>
                <NavLink to={"/messages"}>Messages</NavLink>
              </li>
              <li>
                <NavLink to={"/profile"}>Profile</NavLink>
              </li>
              {user?.isAdmin && (
                <li>
                  <NavLink to={"/admin/patients"}>Admin Dashboard</NavLink>
                </li>
              )}
            </>
          )}
          {!token ? (
            <>
              <li>
                <NavLink className="btn" to={"/login"}>
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink className="btn" to={"/register"}>
                  Register
                </NavLink>
              </li>
            </>
          ) : (
            <li>
              <span className="btn" onClick={logoutFunc}>
                Logout
              </span>
            </li>
          )}
        </ul>
      </nav>
      <div className="menu-icons">
        {!iconActive && (
          <FiMenu
            className="menu-open"
            onClick={() => {
              setIconActive(true);
            }}
          />
        )}
        {iconActive && (
          <RxCross1
            className="menu-close"
            onClick={() => {
              setIconActive(false);
            }}
          />
        )}
      </div>
    </header>
  );
};

export default Navbar;