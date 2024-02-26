import React from "react";
import "../componentStyles/Authorization.css";
const Authorization = () => {
  return (
    <div className="authorizationContainer">
      <div className="authorization">
        <p>
          Select your role :{" "}
          <span>
            <input type="radio" id="admin" name="role" />
            <label htmlFor="admin">Admin</label>
          </span>{" "}
          <span>
            <input type="radio" id="user" name="role" />
            <label htmlFor="user">User</label>
          </span>{" "}
        </p>
        <button>Confirm</button>
      </div>
    </div>
  );
};

export default Authorization;
