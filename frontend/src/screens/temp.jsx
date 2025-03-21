import React, { useEffect, useRef, useState } from "react";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";

const VideoCall = ({ projectId, userId }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);

  useEffect(() => {
    // Initialize socket when component mounts
    socket.current = initializeSocket(projectId);

    // Listen for incoming call events
    receiveMessage("incoming-call", ({ from, offer }) => {
      setIncomingCall({ from, offer });
    });

    receiveMessage("call-answered", ({ from, answer }) => {
      peerConnection.current?.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    receiveMessage("ice-candidate", ({ from, candidate }) => {
      peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [projectId]);

  // Create WebRTC Peer Connection
  const createPeerConnection = (to) => {
    peerConnection.current = new RTCPeerConnection();

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendMessage("ice-candidate", { to, candidate: event.candidate });
      }
    };

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };
  };

  // Start a Call
  const startCall = async () => {
    createPeerConnection(userId);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);

    sendMessage("call-user", { to: userId, offer });
    setIsCalling(true);
  };

  // Accept an Incoming Call
  const answerCall = async () => {
    createPeerConnection(incomingCall.from);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    localVideoRef.current.srcObject = stream;
    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));

    await peerConnection.current.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );
    const answer = await peerConnection.current.createAnswer();
    await peerConnection.current.setLocalDescription(answer);

    sendMessage("answer-call", { to: incomingCall.from, answer });
    setIncomingCall(null);
    setIsCalling(true);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md flex flex-col items-center">
      <div className="flex gap-4 mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={startCall}
        >
          Start Call
        </button>
      </div>

      {incomingCall && (
        <div className="bg-yellow-300 p-3 rounded-lg shadow-md">
          <p>Incoming Call from {incomingCall.from}...</p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={answerCall}
          >
            Accept
          </button>
        </div>
      )}

      <div className="flex gap-4 mt-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          className="w-40 h-40 bg-black rounded-lg"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-40 h-40 bg-black rounded-lg"
        />
      </div>
    </div>
  );
};

export default VideoCall;
