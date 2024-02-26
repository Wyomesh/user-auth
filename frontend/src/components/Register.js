import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "../componentStyles/Register.css";
import user from "../images/user.svg";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Link } from "react-router-dom";
import Login from "./Login";

const Register = () => {
  const [userData, setUserData] = useState([]);
  const [avatar, setAvatar] = useState(user);
  const [coverImage, setCoverImage] = useState("");
  const [phoneNumber, setPhoneNumber] = useState();
  const hiddenAvatar = useRef(null);
  const hiddenCoverImage = useRef(null);
  const [inputValues, setInputValues] = useState([]);
  const handleAvatarUpload = (e) => {
    try {
      const userAvatar = URL.createObjectURL(e.target.files[0]);
      console.log(e.target.files[0]);
      setAvatar(userAvatar);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCoverImageUpload = (e) => {
    try {
      const coverImage = URL.createObjectURL(e.target.files[0]);
      setCoverImage(coverImage);
      const avatar = document.querySelector(".left").querySelector(".avatar");
      avatar.style.display = "grid";
      avatar.style.background = `url(${coverImage})`;
    } catch (error) {
      console.error(error);
    }
  };
  const handleAvatarClick = () => {
    hiddenAvatar.current.click();
  };
  const handleCoverImageClick = () => {
    hiddenCoverImage.current.click();
  };
  const handlePhoneNumber = (e) => {
    setPhoneNumber(e);
  };
  const handleChange = (e) => {
    const inputNames = e.target.name;
    const inputValues = e.target.value;
    setInputValues((inputVals) => ({
      ...inputVals,
      [inputNames]: inputValues,
    }));
    console.log(process.env.PORT);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`http://localhost:8000/api/v1/users/register`, [
        { inputValues },
        { avatar },
        { coverImage },
      ])
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <div className="registerPage">
      <div className="left">
        <input ref={hiddenAvatar} type="file" onChange={handleAvatarUpload} />
        <img className="avatar" src={avatar} alt="User" />
        <button onClick={handleAvatarClick}>Change Avatar</button>
        <input
          ref={hiddenCoverImage}
          type="file"
          onChange={handleCoverImageUpload}
        />
        <button onClick={handleCoverImageClick}>Change Cover Image</button>
      </div>
      <div className="right">
        <form className="registerForm" onSubmit={handleSubmit}>
          <label htmlFor="name">Enter your full name</label>
          <input
            name="name"
            type="text"
            value={inputValues.name}
            placeholder="John Doe"
            onChange={handleChange}
          />
          <label htmlFor="phone">Enter your phone number</label>
          <PhoneInput
            defaultCountry="IN"
            value={phoneNumber}
            name="phone"
            onChange={handlePhoneNumber}
            className="phoneInput"
            placeholder="1234567890"
          />
          <label htmlFor="email">Enter you email</label>
          <input
            name="email"
            type="email"
            value={inputValues.email}
            placeholder="abc@gmail.com"
            onChange={handleChange}
          />
          <label htmlFor="password">Enter your password</label>
          <input
            name="password"
            type="password"
            value={inputValues.password}
            placeholder="password"
            onChange={handleChange}
          />
          <div className="loginRedirect">
            <span>Already have an account, </span>
            <Link to={Login}>Login here</Link>
          </div>
          <button>Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
