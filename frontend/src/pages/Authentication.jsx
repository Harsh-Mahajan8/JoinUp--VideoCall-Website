import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import Snackbar from "@mui/material/Snackbar";

export default function Authentication() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [msg, setmsg] = useState("");

  const [formState, setFormState] = useState(0);
  const [open, setOpen] = useState(false);

  const { handleRegister, handleLogin } = useContext(AuthContext);

  let handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (formState === 0) {
        //login logic
        let res = await handleLogin(email, password);
        console.log(res);
        setmsg(res.message);
        setOpen(true);
      }
      if (formState === 1) {
        //register logic
        let res = await handleRegister(username, email, password);
        console.log(res);
        setmsg(res.message);
        setOpen(true); //model displays
        setFormState(0);
      }

      setError("");
      setPassword("");
      setUsername("");
    } catch (e) {
      console.log(e);
      const msg = e.response?.data?.message || "Something went wrong!!";
      setError(msg);
    }
  };

  return (
    <div className="authcontainer">
      <form action="" onSubmit={handleAuth}>
        <div className="top">
          <div className="left"></div>
          <div className="center">
            <img className="mainIcon" src="./video-call.png" alt="" />
            <h2 className="navHeader">JoinUp</h2>
          </div>
          <div className="right">
            <Link to={".."}>
              <CloseIcon className="cross" />
            </Link>
          </div>
        </div>

        <div className="authHeadBtns">
          <button
            type="button"
            className={formState === 0 ? "activate " : "btn"}
            onClick={() => setFormState(0)}
          >
            Log In
          </button>
          <button
            type="button"
            className={formState === 1 ? "activate" : "btn"}
            onClick={() => setFormState(1)}
          >
            Register
          </button>
        </div>

        <br />
        <div className="input">
          {formState === 1 ? (
            <div>
              <label htmlFor="username" name="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                autoComplete="username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
            </div>
          ) : (
            <></>
          )}
          <br />
          <div>
            <label htmlFor="email" name="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              required
            />
          </div>

          <br />

          <div>
            <label htmlFor="password" name="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              autoComplete="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              required
            />
          </div>
          <br />
        </div>
        <p style={{ color: "red" }}>{error}</p>
        <button className="button authBtn" type="submit">
          {formState === 0 ? "Log In" : "Register"}
        </button>
      </form>
      <Snackbar
        open={open}
        message={msg}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
