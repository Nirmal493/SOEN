// import React, { useState, useRef, useEffect } from "react";
// import { sendMessage } from "../config/socket";

// const CallButton = ({ projectId, user, participants }) => {
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isCallMinimized, setIsCallMinimized] = useState(false);

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null);

//   // WebRTC configuration
//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },
//       { urls: "stun:stun1.l.google.com:19302" },
//     ],
//   };

//   const startCall = async () => {
//     try {
//       // Get user media
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: isVideoEnabled,
//         audio: isAudioEnabled,
//       });

//       localStreamRef.current = stream;
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       // Create RTCPeerConnection
//       const peerConnection = new RTCPeerConnection(configuration);
//       peerConnectionRef.current = peerConnection;

//       // Add local stream to peer connection
//       stream.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, stream);
//       });

//       // Set up event handlers for ICE candidates
//       peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//           // Send ICE candidate to other peers via socket
//           sendMessage("rtc-ice-candidate", {
//             candidate: event.candidate,
//             sender: user._id,
//             projectId,
//           });
//         }
//       };

//       // Handle incoming tracks
//       peerConnection.ontrack = (event) => {
//         if (remoteVideoRef.current) {
//           remoteVideoRef.current.srcObject = event.streams[0];
//         }
//       };

//       // Create and send offer
//       const offer = await peerConnection.createOffer();
//       await peerConnection.setLocalDescription(offer);

//       // Send offer to other peers via socket
//       sendMessage("rtc-offer", {
//         offer: peerConnection.localDescription,
//         sender: user._id,
//         projectId,
//       });

//       setIsCallActive(true);
//     } catch (error) {
//       console.error("Error starting call:", error);
//     }
//   };

//   const endCall = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//     }

//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//     }

//     setIsCallActive(false);
//   };

//   const toggleAudio = () => {
//     if (localStreamRef.current) {
//       const audioTrack = localStreamRef.current.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioEnabled(audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = () => {
//     if (localStreamRef.current) {
//       const videoTrack = localStreamRef.current.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoEnabled(videoTrack.enabled);
//       }
//     }
//   };

//   const toggleMinimize = () => {
//     setIsCallMinimized(!isCallMinimized);
//   };

//   useEffect(() => {
//     // Set up socket event listeners for WebRTC signaling
//     const handleRtcOffer = async (data) => {
//       if (data.sender !== user._id) {
//         // Create peer connection if it doesn't exist
//         if (!peerConnectionRef.current) {
//           const peerConnection = new RTCPeerConnection(configuration);
//           peerConnectionRef.current = peerConnection;

//           // Get user media
//           const stream = await navigator.mediaDevices.getUserMedia({
//             video: isVideoEnabled,
//             audio: isAudioEnabled,
//           });

//           localStreamRef.current = stream;
//           if (localVideoRef.current) {
//             localVideoRef.current.srcObject = stream;
//           }

//           // Add local stream to peer connection
//           stream.getTracks().forEach((track) => {
//             peerConnection.addTrack(track, stream);
//           });

//           // Set up event handlers
//           peerConnection.onicecandidate = (event) => {
//             if (event.candidate) {
//               sendMessage("rtc-ice-candidate", {
//                 candidate: event.candidate,
//                 sender: user._id,
//                 projectId,
//               });
//             }
//           };

//           peerConnection.ontrack = (event) => {
//             if (remoteVideoRef.current) {
//               remoteVideoRef.current.srcObject = event.streams[0];
//             }
//           };
//         }

//         // Set remote description (the offer)
//         await peerConnectionRef.current.setRemoteDescription(
//           new RTCSessionDescription(data.offer)
//         );

//         // Create and send answer
//         const answer = await peerConnectionRef.current.createAnswer();
//         await peerConnectionRef.current.setLocalDescription(answer);

//         sendMessage("rtc-answer", {
//           answer: peerConnectionRef.current.localDescription,
//           sender: user._id,
//           projectId,
//         });

//         setIsCallActive(true);
//       }
//     };

//     const handleRtcAnswer = async (data) => {
//       if (data.sender !== user._id && peerConnectionRef.current) {
//         await peerConnectionRef.current.setRemoteDescription(
//           new RTCSessionDescription(data.answer)
//         );
//       }
//     };

//     const handleRtcIceCandidate = async (data) => {
//       if (data.sender !== user._id && peerConnectionRef.current) {
//         await peerConnectionRef.current.addIceCandidate(
//           new RTCIceCandidate(data.candidate)
//         );
//       }
//     };

//     // Add these event listeners to your socket configuration
//     // In a real implementation, you would need to connect these to your socket instance

//     // Cleanup function
//     return () => {
//       endCall();
//     };
//   }, [projectId, user._id]);

//   return (
//     <>
//       <button
//         onClick={isCallActive ? endCall : startCall}
//         className={`flex items-center gap-1 p-2 rounded ${
//           isCallActive
//             ? "bg-red-500 hover:bg-red-600"
//             : "bg-green-500 hover:bg-green-600"
//         } text-white transition-colors`}
//         title={isCallActive ? "End call" : "Start call"}
//       >
//         <i
//           className={`ri-${isCallActive ? "phone-off-fill" : "phone-fill"}`}
//         ></i>
//         <span className="text-sm">
//           {isCallActive ? "End Call" : "Start Call"}
//         </span>
//       </button>

//       {isCallActive && (
//         <div
//           className={`fixed ${
//             isCallMinimized
//               ? "bottom-4 right-4 w-64 h-24"
//               : "inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
//           }`}
//         >
//           <div
//             className={`bg-slate-800 rounded-lg shadow-lg overflow-hidden ${
//               isCallMinimized ? "w-full h-full" : "w-4/5 max-w-4xl"
//             }`}
//           >
//             <div className="relative">
//               {/* Remote video (big) */}
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className={`w-full ${
//                   isCallMinimized ? "h-24" : "h-[70vh]"
//                 } bg-black object-cover`}
//               ></video>

//               {/* Local video (small overlay) */}
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className={`absolute ${
//                   isCallMinimized
//                     ? "right-1 top-1 w-16 h-16"
//                     : "right-4 bottom-4 w-48"
//                 } rounded border-2 border-white bg-slate-900 object-cover shadow-lg`}
//               ></video>

//               {/* Call controls */}
//               <div
//                 className={`absolute ${
//                   isCallMinimized
//                     ? "left-2 bottom-2"
//                     : "left-0 right-0 bottom-4 flex justify-center"
//                 }`}
//               >
//                 <div
//                   className={`flex ${
//                     isCallMinimized ? "gap-1" : "gap-4"
//                   } bg-slate-800 bg-opacity-75 p-2 rounded-full`}
//                 >
//                   <button
//                     onClick={toggleAudio}
//                     className={`rounded-full p-3 ${
//                       isAudioEnabled ? "bg-slate-600" : "bg-red-500"
//                     }`}
//                     title={
//                       isAudioEnabled ? "Mute microphone" : "Unmute microphone"
//                     }
//                   >
//                     <i
//                       className={`ri-${
//                         isAudioEnabled ? "mic-fill" : "mic-off-fill"
//                       } text-white`}
//                     ></i>
//                   </button>

//                   <button
//                     onClick={toggleVideo}
//                     className={`rounded-full p-3 ${
//                       isVideoEnabled ? "bg-slate-600" : "bg-red-500"
//                     }`}
//                     title={
//                       isVideoEnabled ? "Turn off camera" : "Turn on camera"
//                     }
//                   >
//                     <i
//                       className={`ri-${
//                         isVideoEnabled ? "video-fill" : "video-off-fill"
//                       } text-white`}
//                     ></i>
//                   </button>

//                   <button
//                     onClick={endCall}
//                     className="rounded-full p-3 bg-red-500"
//                     title="End call"
//                   >
//                     <i className="ri-phone-off-fill text-white"></i>
//                   </button>

//                   {!isCallMinimized && (
//                     <button
//                       onClick={toggleMinimize}
//                       className="rounded-full p-3 bg-slate-600"
//                       title="Minimize call"
//                     >
//                       <i className="ri-subtract-line text-white"></i>
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Maximize button when minimized */}
//               {isCallMinimized && (
//                 <button
//                   onClick={toggleMinimize}
//                   className="absolute top-1 right-1 bg-slate-700 rounded-full p-1"
//                   title="Maximize call"
//                 >
//                   <i className="ri-fullscreen-line text-white text-xs"></i>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CallButton;

// import React, { useState, useRef, useEffect } from "react";
// import { sendMessage, registerCallHandlers } from "../config/socket";

// const CallButton = ({ projectId, user, participants }) => {
//   const [isCallActive, setIsCallActive] = useState(false);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isCallMinimized, setIsCallMinimized] = useState(false);
//   const [mediaError, setMediaError] = useState(null);
//   const [connectionState, setConnectionState] = useState("new"); // For debugging

//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const peerConnectionRef = useRef(null);
//   const localStreamRef = useRef(null);

//   // WebRTC configuration
//   const configuration = {
//     iceServers: [
//       { urls: "stun:stun.l.google.com:19302" },
//       { urls: "stun:stun1.l.google.com:19302" },
//     ],
//   };

//   const startCall = async () => {
//     try {
//       console.log("Starting call...");
//       // Reset error state
//       setMediaError(null);

//       // Get user media with graceful fallback
//       let stream;
//       try {
//         // First try to get both audio and video
//         stream = await navigator.mediaDevices.getUserMedia({
//           video: false,
//           audio: true,
//         });
//       } catch (error) {
//         console.warn("Couldn't get audio and video, trying audio only:", error);

//         try {
//           // Fallback to audio only
//           stream = await navigator.mediaDevices.getUserMedia({
//             video: false,
//             audio: true,
//           });
//           // Update the UI state
//           setIsVideoEnabled(false);
//         } catch (audioError) {
//           // If both fail, throw the error to be caught below
//           throw audioError;
//         }
//       }

//       localStreamRef.current = stream;
//       if (localVideoRef.current) {
//         localVideoRef.current.srcObject = stream;
//       }

//       // Create RTCPeerConnection
//       const peerConnection = new RTCPeerConnection(configuration);
//       peerConnectionRef.current = peerConnection;

//       // Debug connection state changes
//       peerConnection.onconnectionstatechange = () => {
//         console.log("Connection state:", peerConnection.connectionState);
//         setConnectionState(peerConnection.connectionState);
//       };

//       peerConnection.oniceconnectionstatechange = () => {
//         console.log("ICE connection state:", peerConnection.iceConnectionState);
//       };

//       // Add local stream to peer connection
//       stream.getTracks().forEach((track) => {
//         peerConnection.addTrack(track, stream);
//       });

//       // Set up event handlers for ICE candidates
//       peerConnection.onicecandidate = (event) => {
//         if (event.candidate) {
//           console.log("Sending ICE candidate", event.candidate);
//           // Send ICE candidate to other peers via socket
//           sendMessage("rtc-ice-candidate", {
//             candidate: event.candidate,
//             sender: user._id,
//             projectId,
//           });
//         }
//       };

//       // Handle incoming tracks
//       peerConnection.ontrack = (event) => {
//         console.log("Received remote track", event);
//         if (remoteVideoRef.current && event.streams && event.streams[0]) {
//           remoteVideoRef.current.srcObject = event.streams[0];
//         }
//       };

//       // Create and send offer
//       const offer = await peerConnection.createOffer();
//       await peerConnection.setLocalDescription(offer);
//       console.log("Created offer", offer);

//       // Send offer to other peers via socket
//       sendMessage("rtc-offer", {
//         offer: peerConnection.localDescription,
//         sender: user._id,
//         projectId,
//       });

//       setIsCallActive(true);
//       console.log("Call initiated successfully");
//     } catch (error) {
//       console.error("Error starting call:", error);
//       setMediaError(error.message || "Could not access camera or microphone");

//       // Show an alert to the user
//       alert(
//         `Call Error: ${
//           error.message ||
//           "Could not access camera or microphone. Please check your device permissions in browser settings."
//         }`
//       );
//     }
//   };

//   const endCall = () => {
//     console.log("Ending call");
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//     }

//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//     }

//     setIsCallActive(false);
//     setMediaError(null);

//     // Notify other participants that call has ended
//     sendMessage("rtc-call-ended", {
//       sender: user._id,
//       projectId,
//     });

//     console.log("Call ended");
//   };

//   const toggleAudio = () => {
//     if (localStreamRef.current) {
//       const audioTrack = localStreamRef.current.getAudioTracks()[0];
//       if (audioTrack) {
//         audioTrack.enabled = !audioTrack.enabled;
//         setIsAudioEnabled(audioTrack.enabled);
//         console.log("Audio toggled:", audioTrack.enabled);
//       }
//     }
//   };

//   const toggleVideo = () => {
//     if (localStreamRef.current) {
//       const videoTrack = localStreamRef.current.getVideoTracks()[0];
//       if (videoTrack) {
//         videoTrack.enabled = !videoTrack.enabled;
//         setIsVideoEnabled(videoTrack.enabled);
//         console.log("Video toggled:", videoTrack.enabled);
//       } else if (isVideoEnabled) {
//         // If we wanted video but don't have it, try to get it
//         navigator.mediaDevices
//           .getUserMedia({ video: true })
//           .then((stream) => {
//             const videoTrack = stream.getVideoTracks()[0];
//             const sender = peerConnectionRef.current
//               ?.getSenders()
//               .find((s) => s.track && s.track.kind === "video");

//             if (sender) {
//               sender.replaceTrack(videoTrack);
//             } else if (peerConnectionRef.current) {
//               peerConnectionRef.current.addTrack(
//                 videoTrack,
//                 localStreamRef.current
//               );
//             }

//             // Add the new track to our local stream
//             localStreamRef.current.addTrack(videoTrack);
//             if (localVideoRef.current) {
//               localVideoRef.current.srcObject = localStreamRef.current;
//             }
//             console.log("Added video track");
//           })
//           .catch((err) => {
//             console.warn("Could not add video track:", err);
//             setIsVideoEnabled(false);
//           });
//       }

//       setIsVideoEnabled(!isVideoEnabled);
//     }
//   };

//   const toggleMinimize = () => {
//     setIsCallMinimized(!isCallMinimized);
//   };

//   useEffect(() => {
//     // Check if browser supports getUserMedia
//     if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
//       setMediaError("Your browser does not support video calls");
//       return;
//     }

//     // Define WebRTC signaling handlers
//     const handleRtcOffer = async (data) => {
//       console.log("Handling RTC offer", data);
//       if (data.sender !== user._id) {
//         try {
//           // Reset error state
//           setMediaError(null);

//           // Create peer connection if it doesn't exist
//           if (!peerConnectionRef.current) {
//             const peerConnection = new RTCPeerConnection(configuration);
//             peerConnectionRef.current = peerConnection;

//             // Debug connection state changes
//             peerConnection.onconnectionstatechange = () => {
//               console.log("Connection state:", peerConnection.connectionState);
//               setConnectionState(peerConnection.connectionState);
//             };

//             peerConnection.oniceconnectionstatechange = () => {
//               console.log(
//                 "ICE connection state:",
//                 peerConnection.iceConnectionState
//               );
//             };

//             // Get user media with fallback options
//             let stream;
//             try {
//               // Try to get both audio and video
//               stream = await navigator.mediaDevices.getUserMedia({
//                 video: false,
//                 audio: true,
//               });
//             } catch (error) {
//               console.warn(
//                 "Incoming call: Couldn't get audio and video, trying audio only:",
//                 error
//               );

//               try {
//                 // Fallback to audio only
//                 stream = await navigator.mediaDevices.getUserMedia({
//                   video: false,
//                   audio: true,
//                 });
//                 setIsVideoEnabled(false);
//               } catch (audioError) {
//                 throw audioError;
//               }
//             }

//             localStreamRef.current = stream;
//             if (localVideoRef.current) {
//               localVideoRef.current.srcObject = stream;
//             }

//             // Add local stream to peer connection
//             stream.getTracks().forEach((track) => {
//               peerConnection.addTrack(track, stream);
//             });

//             // Set up event handlers
//             peerConnection.onicecandidate = (event) => {
//               if (event.candidate) {
//                 console.log("Sending ICE candidate", event.candidate);
//                 sendMessage("rtc-ice-candidate", {
//                   candidate: event.candidate,
//                   sender: user._id,
//                   projectId,
//                 });
//               }
//             };

//             peerConnection.ontrack = (event) => {
//               console.log("Received remote track", event);
//               if (remoteVideoRef.current && event.streams && event.streams[0]) {
//                 remoteVideoRef.current.srcObject = event.streams[0];
//               }
//             };
//           }

//           // Set remote description (the offer)
//           console.log("Setting remote description (offer)");
//           await peerConnectionRef.current.setRemoteDescription(
//             new RTCSessionDescription(data.offer)
//           );

//           // Create and send answer
//           console.log("Creating answer");
//           const answer = await peerConnectionRef.current.createAnswer();
//           await peerConnectionRef.current.setLocalDescription(answer);

//           console.log("Sending answer", answer);
//           sendMessage("rtc-answer", {
//             answer: peerConnectionRef.current.localDescription,
//             sender: user._id,
//             projectId,
//           });

//           setIsCallActive(true);
//           console.log("Call answered successfully");
//         } catch (error) {
//           console.error("Error handling offer:", error);
//           setMediaError(
//             error.message || "Could not access camera or microphone"
//           );
//           alert(
//             `Call Error: ${
//               error.message ||
//               "Could not access camera or microphone. Please check your device permissions in browser settings."
//             }`
//           );
//         }
//       }
//     };

//     const handleRtcAnswer = async (data) => {
//       console.log("Handling RTC answer", data);
//       if (data.sender !== user._id && peerConnectionRef.current) {
//         try {
//           console.log("Setting remote description (answer)");
//           await peerConnectionRef.current.setRemoteDescription(
//             new RTCSessionDescription(data.answer)
//           );
//           console.log("Remote description set successfully");
//         } catch (error) {
//           console.error("Error handling answer:", error);
//         }
//       }
//     };

//     const handleRtcIceCandidate = async (data) => {
//       console.log("Handling ICE candidate", data);
//       if (data.sender !== user._id && peerConnectionRef.current) {
//         try {
//           console.log("Adding ICE candidate", data.candidate);
//           await peerConnectionRef.current.addIceCandidate(
//             new RTCIceCandidate(data.candidate)
//           );
//           console.log("ICE candidate added successfully");
//         } catch (error) {
//           console.error("Error handling ICE candidate:", error);
//         }
//       }
//     };

//     // Handle call ended notification
//     const handleCallEnded = (data) => {
//       if (data.sender !== user._id && isCallActive) {
//         console.log("Remote peer ended call");
//         // Clean up resources but don't send another call-ended event
//         if (localStreamRef.current) {
//           localStreamRef.current.getTracks().forEach((track) => track.stop());
//         }

//         if (peerConnectionRef.current) {
//           peerConnectionRef.current.close();
//         }

//         setIsCallActive(false);
//         setMediaError(null);
//         alert("Call ended by other participant");
//       }
//     };

//     // Register handlers
//     const handlers = {
//       handleRtcOffer,
//       handleRtcAnswer,
//       handleRtcIceCandidate,
//     };

//     registerCallHandlers(handlers);

//     // Cleanup function
//     return () => {
//       if (isCallActive) {
//         endCall();
//       }
//     };
//   }, [projectId, user._id, isVideoEnabled, isAudioEnabled, isCallActive]);

//   return (
//     <>
//       <button
//         onClick={isCallActive ? endCall : startCall}
//         className={`flex items-center gap-1 p-2 rounded ${
//           isCallActive
//             ? "bg-red-500 hover:bg-red-600"
//             : "bg-green-500 hover:bg-green-600"
//         } text-white transition-colors`}
//         title={isCallActive ? "End call" : "Start call"}
//         disabled={!!mediaError && !isCallActive}
//       >
//         <i
//           className={`ri-${isCallActive ? "phone-off-fill" : "phone-fill"}`}
//         ></i>
//         <span className="text-sm">
//           {isCallActive ? "End Call" : "Start Call"}
//         </span>
//       </button>

//       {mediaError && !isCallActive && (
//         <div className="text-red-500 text-xs mt-1">{mediaError}</div>
//       )}

//       {/* Add connection state debug info */}
//       {isCallActive && (
//         <div className="text-xs mt-1">Connection: {connectionState}</div>
//       )}

//       {isCallActive && (
//         <div
//           className={`fixed ${
//             isCallMinimized
//               ? "bottom-4 right-4 w-64 h-24"
//               : "inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center"
//           }`}
//         >
//           <div
//             className={`bg-slate-800 rounded-lg shadow-lg overflow-hidden ${
//               isCallMinimized ? "w-full h-full" : "w-4/5 max-w-4xl"
//             }`}
//           >
//             <div className="relative">
//               {/* Remote video (big) */}
//               <video
//                 ref={remoteVideoRef}
//                 autoPlay
//                 playsInline
//                 className={`w-full ${
//                   isCallMinimized ? "h-24" : "h-[70vh]"
//                 } bg-black object-cover`}
//               ></video>

//               {/* Local video (small overlay) */}
//               <video
//                 ref={localVideoRef}
//                 autoPlay
//                 playsInline
//                 muted
//                 className={`absolute ${
//                   isCallMinimized
//                     ? "right-1 top-1 w-16 h-16"
//                     : "right-4 bottom-4 w-48"
//                 } rounded border-2 border-white bg-slate-900 object-cover shadow-lg`}
//               ></video>

//               {/* Call controls */}
//               <div
//                 className={`absolute ${
//                   isCallMinimized
//                     ? "left-2 bottom-2"
//                     : "left-0 right-0 bottom-4 flex justify-center"
//                 }`}
//               >
//                 <div
//                   className={`flex ${
//                     isCallMinimized ? "gap-1" : "gap-4"
//                   } bg-slate-800 bg-opacity-75 p-2 rounded-full`}
//                 >
//                   <button
//                     onClick={toggleAudio}
//                     className={`rounded-full p-3 ${
//                       isAudioEnabled ? "bg-slate-600" : "bg-red-500"
//                     }`}
//                     title={
//                       isAudioEnabled ? "Mute microphone" : "Unmute microphone"
//                     }
//                   >
//                     <i
//                       className={`ri-${
//                         isAudioEnabled ? "mic-fill" : "mic-off-fill"
//                       } text-white`}
//                     ></i>
//                   </button>

//                   <button
//                     onClick={toggleVideo}
//                     className={`rounded-full p-3 ${
//                       isVideoEnabled ? "bg-slate-600" : "bg-red-500"
//                     }`}
//                     title={
//                       isVideoEnabled ? "Turn off camera" : "Turn on camera"
//                     }
//                   >
//                     <i
//                       className={`ri-${
//                         isVideoEnabled ? "video-fill" : "video-off-fill"
//                       } text-white`}
//                     ></i>
//                   </button>

//                   <button
//                     onClick={endCall}
//                     className="rounded-full p-3 bg-red-500"
//                     title="End call"
//                   >
//                     <i className="ri-phone-off-fill text-white"></i>
//                   </button>

//                   {!isCallMinimized && (
//                     <button
//                       onClick={toggleMinimize}
//                       className="rounded-full p-3 bg-slate-600"
//                       title="Minimize call"
//                     >
//                       <i className="ri-subtract-line text-white"></i>
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* Maximize button when minimized */}
//               {isCallMinimized && (
//                 <button
//                   onClick={toggleMinimize}
//                   className="absolute top-1 right-1 bg-slate-700 rounded-full p-1"
//                   title="Maximize call"
//                 >
//                   <i className="ri-fullscreen-line text-white text-xs"></i>
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default CallButton;

import React, { useState, useRef, useEffect } from "react";
import { sendMessage, registerCallHandlers } from "../config/socket";

const CallButton = ({ projectId, user, participants }) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [mediaError, setMediaError] = useState(null);
  const [connectionState, setConnectionState] = useState("new");
  const [pendingCandidates, setPendingCandidates] = useState([]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);

  // WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Function to apply pending ICE candidates
  const applyPendingCandidates = async () => {
    if (peerConnectionRef.current && pendingCandidates.length > 0) {
      console.log(
        `Applying ${pendingCandidates.length} pending ICE candidates`
      );

      for (const candidate of pendingCandidates) {
        try {
          await peerConnectionRef.current.addIceCandidate(
            new RTCIceCandidate(candidate)
          );
          console.log("Applied pending ICE candidate successfully");
        } catch (error) {
          console.error("Error applying pending ICE candidate:", error);
        }
      }

      setPendingCandidates([]);
    }
  };

  const startCall = async () => {
    try {
      console.log("Starting call...");
      setMediaError(null);

      // Get user media with appropriate constraints
      let stream;
      try {
        // Request both audio and video if video is enabled
        stream = await navigator.mediaDevices.getUserMedia({
          video: isVideoEnabled,
          audio: true,
        });
      } catch (error) {
        console.warn("Couldn't get requested media, trying audio only:", error);

        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          setIsVideoEnabled(false);
        } catch (audioError) {
          throw audioError;
        }
      }

      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create RTCPeerConnection
      const peerConnection = new RTCPeerConnection(configuration);
      peerConnectionRef.current = peerConnection;

      // Debug connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log("Connection state:", peerConnection.connectionState);
        setConnectionState(peerConnection.connectionState);
      };

      peerConnection.oniceconnectionstatechange = () => {
        console.log("ICE connection state:", peerConnection.iceConnectionState);
      };

      // Add local stream to peer connection
      stream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, stream);
      });

      // Set up event handlers for ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate", event.candidate);
          sendMessage("rtc-ice-candidate", {
            candidate: event.candidate,
            sender: user._id,
            projectId,
          });
        }
      };

      // Handle incoming tracks
      peerConnection.ontrack = (event) => {
        console.log("Received remote track", event);
        if (remoteVideoRef.current && event.streams && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Create and send offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log("Created offer", offer);

      // Send offer to other peers via socket
      sendMessage("rtc-offer", {
        offer: peerConnection.localDescription,
        sender: user._id,
        projectId,
      });

      setIsCallActive(true);
      console.log("Call initiated successfully");
    } catch (error) {
      console.error("Error starting call:", error);
      setMediaError(error.message || "Could not access camera or microphone");

      alert(
        `Call Error: ${
          error.message ||
          "Could not access camera or microphone. Please check your device permissions in browser settings."
        }`
      );
    }
  };

  const endCall = () => {
    console.log("Ending call");
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsCallActive(false);
    setMediaError(null);
    setPendingCandidates([]);

    // Notify other participants that call has ended
    sendMessage("rtc-call-ended", {
      sender: user._id,
      projectId,
    });

    console.log("Call ended");
  };

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        console.log("Audio toggled:", audioTrack.enabled);
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();

      if (videoTracks.length > 0) {
        // We have video tracks, toggle them
        const videoTrack = videoTracks[0];
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        console.log("Video toggled:", videoTrack.enabled);
      } else if (isVideoEnabled === false) {
        // We want to add video
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            const videoTrack = stream.getVideoTracks()[0];

            // Add to peer connection if active
            if (peerConnectionRef.current) {
              const sender = peerConnectionRef.current
                .getSenders()
                .find((s) => s.track && s.track.kind === "video");

              if (sender) {
                sender.replaceTrack(videoTrack);
              } else {
                peerConnectionRef.current.addTrack(
                  videoTrack,
                  localStreamRef.current
                );
              }
            }

            // Add to local stream and display
            localStreamRef.current.addTrack(videoTrack);
            if (localVideoRef.current) {
              localVideoRef.current.srcObject = localStreamRef.current;
            }

            setIsVideoEnabled(true);
            console.log("Added video track");
          })
          .catch((err) => {
            console.warn("Could not add video track:", err);
            alert(
              "Could not access camera. Please check your device permissions."
            );
            setIsVideoEnabled(false);
          });
      } else {
        // No video tracks but isVideoEnabled is true, disable it
        setIsVideoEnabled(false);
      }
    }
  };

  const toggleMinimize = () => {
    setIsCallMinimized(!isCallMinimized);
  };

  useEffect(() => {
    // Check if browser supports getUserMedia
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMediaError("Your browser does not support video calls");
      return;
    }

    // Define WebRTC signaling handlers
    const handleRtcOffer = async (data) => {
      console.log("Handling RTC offer", data);
      if (data.sender !== user._id) {
        try {
          setMediaError(null);

          // Clean up any existing call
          if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
          }

          if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
          }

          // Create new peer connection
          const peerConnection = new RTCPeerConnection(configuration);
          peerConnectionRef.current = peerConnection;

          // Debug connection state changes
          peerConnection.onconnectionstatechange = () => {
            console.log("Connection state:", peerConnection.connectionState);
            setConnectionState(peerConnection.connectionState);
          };

          peerConnection.oniceconnectionstatechange = () => {
            console.log(
              "ICE connection state:",
              peerConnection.iceConnectionState
            );
          };

          // Get user media with appropriate constraints
          let stream;
          try {
            stream = await navigator.mediaDevices.getUserMedia({
              video: isVideoEnabled,
              audio: true,
            });
          } catch (error) {
            console.warn(
              "Incoming call: Couldn't get requested media, trying audio only:",
              error
            );

            try {
              stream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true,
              });
              setIsVideoEnabled(false);
            } catch (audioError) {
              throw audioError;
            }
          }

          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          // Add local stream to peer connection
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });

          // Set up event handlers
          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              console.log("Sending ICE candidate", event.candidate);
              sendMessage("rtc-ice-candidate", {
                candidate: event.candidate,
                sender: user._id,
                projectId,
              });
            }
          };

          peerConnection.ontrack = (event) => {
            console.log("Received remote track", event);
            if (remoteVideoRef.current && event.streams && event.streams[0]) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };

          // Set remote description (the offer)
          console.log("Setting remote description (offer)");
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );

          // Apply any pending ICE candidates now that remote description is set
          await applyPendingCandidates();

          // Create and send answer
          console.log("Creating answer");
          const answer = await peerConnectionRef.current.createAnswer();
          await peerConnectionRef.current.setLocalDescription(answer);

          console.log("Sending answer", answer);
          sendMessage("rtc-answer", {
            answer: peerConnectionRef.current.localDescription,
            sender: user._id,
            projectId,
          });

          setIsCallActive(true);
          console.log("Call answered successfully");
        } catch (error) {
          console.error("Error handling offer:", error);
          setMediaError(
            error.message || "Could not access camera or microphone"
          );

          alert(
            `Call Error: ${
              error.message ||
              "Could not access camera or microphone. Please check your device permissions in browser settings."
            }`
          );
        }
      }
    };

    const handleRtcAnswer = async (data) => {
      console.log("Handling RTC answer", data);
      if (data.sender !== user._id && peerConnectionRef.current) {
        try {
          console.log("Setting remote description (answer)");
          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );

          // Apply any pending ICE candidates now that remote description is set
          await applyPendingCandidates();

          console.log("Remote description set successfully");
        } catch (error) {
          console.error("Error handling answer:", error);
        }
      }
    };

    const handleRtcIceCandidate = async (data) => {
      console.log("Handling ICE candidate", data);
      if (data.sender !== user._id) {
        if (
          peerConnectionRef.current &&
          peerConnectionRef.current.remoteDescription
        ) {
          try {
            console.log("Adding ICE candidate immediately", data.candidate);
            await peerConnectionRef.current.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
            console.log("ICE candidate added successfully");
          } catch (error) {
            console.error("Error handling ICE candidate:", error);
          }
        } else {
          // Store the candidate to apply later
          console.log("Storing ICE candidate for later", data.candidate);
          setPendingCandidates((prev) => [...prev, data.candidate]);
        }
      }
    };

    // Handle call ended notification
    const handleCallEnded = (data) => {
      if (data.sender !== user._id && isCallActive) {
        console.log("Remote peer ended call");

        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop());
        }

        if (peerConnectionRef.current) {
          peerConnectionRef.current.close();
          peerConnectionRef.current = null;
        }

        setIsCallActive(false);
        setMediaError(null);
        setPendingCandidates([]);

        alert("Call ended by other participant");
      }
    };

    // Register handlers
    const handlers = {
      handleRtcOffer,
      handleRtcAnswer,
      handleRtcIceCandidate,
      handleCallEnded,
    };

    registerCallHandlers(handlers);

    // Cleanup function
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

      {/* Add connection state debug info */}
      {isCallActive && (
        <div className="text-xs mt-1">Connection: {connectionState}</div>
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
              {/* Remote video (big) */}
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className={`w-full ${
                  isCallMinimized ? "h-24" : "h-[70vh]"
                } bg-black object-cover`}
              ></video>

              {/* Local video (small overlay) */}
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

              {/* Call controls */}
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

              {/* Maximize button when minimized */}
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
