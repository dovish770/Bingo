import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { signInUser } from "../../service/userService";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { AnyAction } from "redux";
import { useNavigate, Link } from "react-router-dom";
import IMG from "../../../WhatsApp Image 2024-11-22 at 12.47.59_48201cde.jpg";
import "./SignUp.css"
const SignIn: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password || !email) {
      setError("Please enter all required fields");
      return;
    }

    try {
      const resultAction = await dispatch(
        signInUser({ username, email, password })
      );

      if (signInUser.fulfilled.match(resultAction)) {
        console.log("registered successfully");
        setUsername("");
        setPassword("");
        setEmail("");
        setError("");

        navigate("/");
      } else {
        setError("Registration failed");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="register">
       <img src={IMG} alt="" />
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input type="submit" value="Sign in" />
      </form>
      {<Link to="/">back to login</Link>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default SignIn;
