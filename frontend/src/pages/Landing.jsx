import { Link } from "react-router-dom";
export default function Landing() {
  return (
    <div className="landingContainer">
      <nav>
        <div className="navHeader">
          <img src="../video-call.png" alt="" className="mainIcon"/>
          <h2>JoinUp</h2>
        </div>
        <div className="navLink">
          <h2>Join as Guest</h2>
          <h2>Register</h2>
          <div className="button" role="button">
            <Link to={"/auth"}> Login</Link>
          </div>
        </div>
      </nav>
      <div className="mainLC">
        <div className="main-left">
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> with your Lover
            ones
          </h1>
          <p>Cover a distance by VideoCall</p>
          <div role="button">
            <Link to={"/auth"} className="button">
              Get Started
            </Link>
          </div>
        </div>
        <div className="main-right">
          <img src="/mobile.png" alt="" />
        </div>
      </div>
    </div>
  );
}
