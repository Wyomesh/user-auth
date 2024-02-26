import React, { useState } from "react";
import "../componentStyles/Login.css";
import PhoneInput from "react-phone-number-input";
const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState();
  const [disabled, setDisabled] = useState(true);
  const handlePhoneNumber = (e) => {
    setPhoneNumber(e);
  };

  const handleClick = (e) => {
    setDisabled(false);
    const phoneInpt = document.querySelector(".phoneInpt");
    const emailInput = document.querySelector(".emailInput");
    if (e.target.value === "phone") {
      emailInput.style.display = "none";
      phoneInpt.style.display = "grid";
    } else {
      emailInput.style.display = "grid";
      phoneInpt.style.display = "none";
    }
  };
  return (
    <div className="loginContainer">
      <form className="loginForm">
        <input
          className="emailInput"
          type="email"
          placeholder="Enter your email"
        />
        <div className="phoneInpt">
          <PhoneInput
            defaultCountry="IN"
            value={phoneNumber}
            onChange={handlePhoneNumber}
            className="phoneInput"
            placeholder="Enter your phone number"
          />
        </div>

        <input
          type="password"
          id="password"
          disabled={disabled}
          placeholder="Enter your password"
        />
        <p>
          Login with{" "}
          <span>
            <input
              type="radio"
              name="loginOpt"
              value="phone"
              id="phone"
              onClick={handleClick}
            />{" "}
            <label htmlFor="phone">Phone</label>
          </span>{" "}
          <span>
            <input
              type="radio"
              name="loginOpt"
              value="email"
              id="email"
              onClick={handleClick}
            />{" "}
            <label htmlFor="email">Email</label>
          </span>
        </p>
        <button>Login</button>
      </form>
    </div>
  );
};

export default Login;
