import React from "react";
import Login from "./Login";
import Register from "./Register";
import { NavLink } from "react-router-dom";
const AuthenticationPage = () => {
  return (
    <div className="AuthenticationPage">
      <p>
        Login as : <NavLink>Admin</NavLink> <NavLink>User</NavLink>
      </p>
      <Login />
      <Register />
    </div>
  );
};

export default AuthenticationPage;
