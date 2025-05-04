import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../service/userService";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { RootState } from "../../store/store";
import { AnyAction } from "redux";
import { Link, useNavigate } from "react-router-dom";
import IMG from "../../../WhatsApp Image 2024-11-22 at 12.47.59_48201cde.jpg";
import "./Login .css";
const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const loginData = { username, password };
      const resultAction = await dispatch(loginUser(loginData));

      if (loginUser.fulfilled.match(resultAction)) {
        console.log("Logged is successfully");
        setPassword("");
        setUsername("");
        setError("");
        if (resultAction.payload.data.user.isAdmin) {
          navigate("/admin");
        } else {
          navigate("/allProducts");
        }
      } else {
        setError((resultAction.payload as string) || "Login failed");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="Login">
      <img src={IMG} alt="" />

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <input type="submit" value="Login" />
      </form>
      {<Link to="/register">register new </Link>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Login;
