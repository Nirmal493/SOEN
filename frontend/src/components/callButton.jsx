import React, { useState, useRef, useEffect } from "react";
import { sendMessage, registerCallHandlers } from "../config/socket";

const CallButton = ({ projectId, user, participants }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [mediaError, setMediaError] = useState(null);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const startCall = async () => {
    try {
      setMediaError(null);

      // Get local media stream
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Notify other participants to start their streams
      sendMessage("start-call", {
        sender: user._id,
        projectId,
      });

      setIsCallActive(true);
    } catch (error) {
      console.error("Error starting call:", error);
      setMediaError("Could not access camera or microphone.");
    }
  };

  const endCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setIsCallActive(false);
    setMediaError(null);

    // Notify other participants to end the call
    sendMessage("end-call", {
      sender: user._id,
      projectId,
    });
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleMinimize = () => {
    setIsCallMinimized(!isCallMinimized);
  };

  useEffect(() => {
    const handleStartCall = async (data) => {
      if (data.sender !== user._id) {
        try {
          setMediaError(null);

          // Get local media stream
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Notify the caller to start their stream
          sendMessage("start-call-response", {
            sender: user._id,
            projectId,
          });

          setIsCallActive(true);
        } catch (error) {
          console.error("Error handling call:", error);
          setMediaError("Could not access camera or microphone.");
        }
      }
    };

    const handleStartCallResponse = async (data) => {
      if (data.sender !== user._id) {
        try {
          // Get remote media stream (for demonstration, we use the local stream)
          const stream = localStreamRef.current;
          remoteStreamRef.current = stream;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error("Error handling call response:", error);
        }
      }
    };

    const handleEndCall = (data) => {
      if (data.sender !== user._id && isCallActive) {
        console.log("Remote peer ended call");
        endCall();
      }
    };

    // Register handlers
    registerCallHandlers({
      handleStartCall,
      handleStartCallResponse,
      handleEndCall,
    });

    // Cleanup
    return () => {
      if (isCallActive) {
        endCall();
      }
    };
  }, [projectId, user._id, isCallActive]);

  return (
    <>
      <button
        onClick={isCallActive ? endCall : startCall}
        className={`flex items-center gap-1 p-2 rounded ${
          isCallActive
            ? "bg-red-500 hover:bg-red-600"
            : "bg-green-500 hover:bg-green-600"
        } text-white transition-colors`}
        title={isCallActive ? "End call" : "Start call"}
        disabled={!!mediaError && !isCallActive}
      >
        <i
          className={`ri-${isCallActive ? "phone-off-fill" : "phone-fill"}`}
        ></i>
        <span className="text-sm">
          {isCallActive ? "End Call" : "Start Call"}
        </span>
      </button>

      {mediaError && !isCallActive && (
        <div className="text-red-500 text-xs mt-1">{mediaError}</div>
      )}

      {isCallActive && (
        <div
          className={`fixed ${
            isCallMinimized
              ? "bottom-4 right-4 w-64 h-24"
              : "inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
          }`}
        >
          <div
            className={`bg-slate-800 rounded-lg shadow-lg overflow-hidden ${
              isCallMinimized ? "w-full h-full" : "w-4/5 max-w-4xl"
            }`}
          >
            <div className="relative">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full ${
                  isCallMinimized ? "h-24" : "h-[70vh]"
                } bg-black object-cover`}
              ></video>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`absolute ${
                  isCallMinimized
                    ? "right-1 top-1 w-16 h-16"
                    : "right-4 bottom-4 w-48"
                } rounded border-2 border-white bg-slate-900 object-cover shadow-lg`}
              ></video>
              <div
                className={`absolute ${
                  isCallMinimized
                    ? "left-2 bottom-2"
                    : "left-0 right-0 bottom-4 flex justify-center"
                }`}
              >
                <div
                  className={`flex ${
                    isCallMinimized ? "gap-1" : "gap-4"
                  } bg-slate-800 bg-opacity-75 p-2 rounded-full`}
                >
                  <button
                    onClick={toggleAudio}
                    className={`rounded-full p-3 ${
                      isAudioEnabled ? "bg-slate-600" : "bg-red-500"
                    }`}
                    title={
                      isAudioEnabled ? "Mute microphone" : "Unmute microphone"
                    }
                  >
                    <i
                      className={`ri-${
                        isAudioEnabled ? "mic-fill" : "mic-off-fill"
                      } text-white`}
                    ></i>
                  </button>
                  <button
                    onClick={toggleVideo}
                    className={`rounded-full p-3 ${
                      isVideoEnabled ? "bg-slate-600" : "bg-red-500"
                    }`}
                    title={
                      isVideoEnabled ? "Turn off camera" : "Turn on camera"
                    }
                  >
                    <i
                      className={`ri-${
                        isVideoEnabled ? "video-fill" : "video-off-fill"
                      } text-white`}
                    ></i>
                  </button>
                  <button
                    onClick={endCall}
                    className="rounded-full p-3 bg-red-500"
                    title="End call"
                  >
                    <i className="ri-phone-off-fill text-white"></i>
                  </button>
                  {!isCallMinimized && (
                    <button
                      onClick={toggleMinimize}
                      className="rounded-full p-3 bg-slate-600"
                      title="Minimize call"
                    >
                      <i className="ri-subtract-line text-white"></i>
                    </button>
                  )}
                </div>
              </div>
              {isCallMinimized && (
                <button
                  onClick={toggleMinimize}
                  className="absolute top-1 right-1 bg-slate-700 rounded-full p-1"
                  title="Maximize call"
                >
                  <i className="ri-fullscreen-line text-white text-xs"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CallButton;
