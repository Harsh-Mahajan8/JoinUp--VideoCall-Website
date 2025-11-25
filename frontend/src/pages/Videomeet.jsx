import { useRef, useState } from "react";
import "../styles/videoComponent.css";

const server_url = import.meta.env.backendServer;
const connections = {};
const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
export default function Videomeet() {
  var socketRef = useRef();
  let socketIdRef = useRef();
  let localVideoRef = useRef();
  let [videoAvailable, setVideoAvailable] = useState(true);
  let [audioAvailable, setAudeioAvailable] = useState(true);
  let [video, setVideo] = useState();
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModal, setShowModal] = useState();
  let [screenAvaiable, setScreenAvailable] = useState();
  let [msgs, setMsgs] = useState();
  let [msg, setMsg] = useState();
  let [newMsgs, setNewMsgs] = useState(0);
  let [askForUserName, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  let videoRef = useState([]);
  let [videos, setvideos] = useState([]);

  // if(isChrome()===false){}

  return <div>{askForUserName === true ? <div></div> : <></>}</div>;
}
