import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

export const AuthContext = createContext({
  handleLogin: () => {},
  handleRegister: () => {},
});

const client = axios.create({
  baseURL: "http://localhost:3000/api/v1/user",
});

export const AuthContextProvider = ({ children }) => {
  const authCxt = useContext(AuthContext);
  const router = useNavigate();

  const [userData, setUserData] = useState(authCxt);

  const handleRegister = async (username, email, password) => {
    try {
      const res = await client.post("/register", {
        username,
        email,
        password,
      });

      if (res.status === httpStatus.CREATED) {
        return res.data.message;
      }
    } catch (e) {
      throw e;
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await client.post("/login", {
        email,
        password,
      });

      if (res.status === httpStatus.OK) {
        localStorage.setItem("token", res.data.token);
        router("/");
        return res.data.message;
      }
    } catch (e) {
      throw e;
    }
  };

  const data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
  };

  return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
};
