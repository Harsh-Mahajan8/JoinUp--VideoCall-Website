import "../styles/videoComponent.css";
import { useRef, useState } from "react";
import { io } from "socket.io-client";
import { TextField, Button } from "@mui/material";
import { useEffect } from "react";

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
  let [audioAvailable, setAudioAvailable] = useState(true);
  let [video, setVideo] = useState([]);
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

  const getPermissions = async () => {
    try {
      //video permission
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
      } else {
        setVideoAvailable(false);
      }
      //audio permission
      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
      } else {
        setAudioAvailable(false);
      }

      //screensharing permission
      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      //for streaming of video//audio
      if (videoAvailable || audioAvailable) {
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMedia) {
          window.localStream = userMedia;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = userMedia;
          }
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);
  //function that close the media for stream if the media for the whole stream is closed by the user
  let getUserMediaSuccess = (stream) => {};

  const getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess) //getusermedia success
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);

  let getMessageFromServer = (fromId, message) => {};
  //add message -> todo
  let addMessage = () => {};
  let connectToSocketServer = () => {
    socketIdRef.current = io.connect(server_url, { secure: false });
    socketIdRef.current.on("signal",getMessageFromServer);
    socketIdRef.current.on("connect", () => {
      socketIdRef.current.emit("joinCall", window.location.href);
      socketIdRef.current = socketIdRef.current.id;
      socketIdRef.current.on("chatMessage", addMessage);
      socketIdRef.current.on("userLeft", (id) => {
        setVideo((video) => video.filter((video) => video.socketId !== id));
      });
      socketIdRef.current.on("userJoined", (id, clients) => {
        clients.forEach((sockedListId) => {
          connections[sockedListId] = new RTCPeerConnection(
            peerConfigConnections
          );
        });
      });
    });
  };

  const getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    // connectToSocketServer();
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  return (
    <div>
      {askForUserName === true ? (
        <div>
          <h1>Enter into Lobby</h1>
          <TextField
            id="outlined-basic"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            label="Username"
            variant="outlined"
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>
          <div>
            <video ref={localVideoRef} autoPlay muted src=""></video>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
