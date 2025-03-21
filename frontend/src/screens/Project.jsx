// import React, { useState, useEffect, useContext, useRef } from "react";
// import { UserContext } from "../context/user.context";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "../config/axios";
// import {
//   initializeSocket,
//   receiveMessage,
//   sendMessage,
// } from "../config/socket";
// import Markdown from "markdown-to-jsx";
// import hljs from "highlight.js";
// import { getWebContainer } from "../config/webcontainer";
// import ReactMarkdown from "react-markdown";

// function SyntaxHighlightedCode(props) {
//   const ref = useRef(null);

//   React.useEffect(() => {
//     if (ref.current && props.className?.includes("lang-") && window.hljs) {
//       window.hljs.highlightElement(ref.current);

//       // hljs won't reprocess the element unless this attribute is removed
//       ref.current.removeAttribute("data-highlighted");
//     }
//   }, [props.className, props.children]);

//   return <code {...props} ref={ref} />;
// }

// const Project = () => {
//   const location = useLocation();

//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(new Set()); // Initialized as Set
//   const [project, setProject] = useState(location.state.project);
//   const [message, setMessage] = useState("");
//   const { user } = useContext(UserContext);
//   const messageBox = React.createRef();

//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]); // New state variable for messages
//   const [fileTree, setFileTree] = useState({});

//   const [currentFile, setCurrentFile] = useState(null);
//   const [openFiles, setOpenFiles] = useState([]);

//   const [webContainer, setWebContainer] = useState(null);
//   const [iframeUrl, setIframeUrl] = useState(null);

//   const [runProcess, setRunProcess] = useState(null);

//   const handleUserClick = (id) => {
//     setSelectedUserId((prevSelectedUserId) => {
//       const newSelectedUserId = new Set(prevSelectedUserId);
//       if (newSelectedUserId.has(id)) {
//         newSelectedUserId.delete(id);
//       } else {
//         newSelectedUserId.add(id);
//       }

//       return newSelectedUserId;
//     });
//   };

//   function addCollaborators() {
//     axios
//       .put("/projects/add-user", {
//         projectId: location.state.project._id,
//         users: Array.from(selectedUserId),
//       })
//       .then((res) => {
//         console.log(res.data);
//         setIsModalOpen(false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   const send = () => {
//     sendMessage("project-message", {
//       message,
//       sender: user,
//     });
//     setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
//     setMessage("");
//   };

//   function WriteAiMessage(message) {
//     let messageObject;

//     try {
//       messageObject = JSON.parse(message);
//     } catch (error) {
//       console.error("Invalid JSON message:", message);
//       return <p>{message}</p>; // If parsing fails, show the raw message
//     }

//     if (messageObject.text) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           <ReactMarkdown>{messageObject.text}</ReactMarkdown>
//         </div>
//       );
//     }

//     // Extract all attributes instead of only 3
//     const keys = Object.keys(messageObject);
//     if (keys.length > 0) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           {keys.map((key) => (
//             <div key={key}>
//               <strong>{key}:</strong>{" "}
//               <ReactMarkdown>{String(messageObject[key])}</ReactMarkdown>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     return <p>Unknown response format</p>;
//   }
//   useEffect(() => {
//     initializeSocket(project._id);

//     if (!webContainer) {
//       getWebContainer().then((container) => {
//         setWebContainer(container);
//         console.log("container started");
//       });
//     }

//     receiveMessage("project-message", (data) => {
//       console.log(data);

//       if (data.sender._id == "ai") {
//         const message = JSON.parse(data.message);

//         // console.log(message);

//         webContainer?.mount(message.fileTree);

//         if (message.fileTree) {
//           setFileTree(message.fileTree || {});
//         }
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       } else {
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       }
//     });

//     axios
//       .get(`/projects/get-project/${location.state.project._id}`)
//       .then((res) => {
//         console.log(res.data.project);

//         setProject(res.data.project);
//         setFileTree(res.data.project.fileTree || {});
//       });

//     axios
//       .get("/users/all")
//       .then((res) => {
//         setUsers(res.data.users);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   function saveFileTree(ft) {
//     axios
//       .put("/projects/update-file-tree", {
//         projectId: project._id,
//         fileTree: ft,
//       })
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   // Removed appendIncomingMessage and appendOutgoingMessage functions

//   function scrollToBottom() {
//     messageBox.current.scrollTop = messageBox.current.scrollHeight;
//   }

//   return (
//     <main className="h-screen w-screen flex">
//       <section className="left relative flex flex-col h-screen min-w-96 bg-slate-300">
//         <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-100 absolute z-10 top-0">
//           <button className="flex gap-2" onClick={() => setIsModalOpen(true)}>
//             <i className="ri-add-fill mr-1"></i>
//             <p>Add collaborator</p>
//           </button>
//           <button
//             onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//             className="p-2"
//           >
//             <i className="ri-group-fill"></i>
//           </button>
//         </header>
//         <div className="conversation-area pt-14 pb-10 flex-grow flex flex-col h-full relative">
//           <div
//             ref={messageBox}
//             className="message-box p-1 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide"
//           >
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`${
//                   msg.sender._id === "ai" ? "max-w-80" : "max-w-52"
//                 } ${
//                   msg.sender._id == user._id.toString() && "ml-auto"
//                 }  message flex flex-col p-2 bg-slate-50 w-fit rounded-md`}
//               >
//                 <small className="opacity-65 text-xs">{msg.sender.email}</small>
//                 <div className="text-sm">
//                   {msg.sender._id === "ai" ? (
//                     WriteAiMessage(msg.message)
//                   ) : (
//                     <p>{msg.message}</p>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="inputField w-full flex absolute bottom-0">
//             <input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   send(); // Call the send function when Enter is pressed
//                 }
//               }}
//               className="p-2 px-4 border-none outline-none flex-grow"
//               type="text"
//               placeholder="Enter message"
//             />
//             <button onClick={send} className="px-5 bg-slate-950 text-white">
//               <i className="ri-send-plane-fill"></i>
//             </button>
//           </div>
//         </div>
//         <div
//           className={`sidePanel w-full h-full flex flex-col gap-2 bg-slate-50 absolute transition-all ${
//             isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
//           } top-0`}
//         >
//           <header className="flex justify-between items-center px-4 p-2 bg-slate-200">
//             <h1 className="font-semibold text-lg">Collaborators</h1>

//             <button
//               onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//               className="p-2"
//             >
//               <i className="ri-close-fill"></i>
//             </button>
//           </header>
//           <div className="users flex flex-col gap-2">
//             {project.users &&
//               project.users.map((user) => {
//                 return (
//                   <div className="user cursor-pointer hover:bg-slate-200 p-2 flex gap-2 items-center">
//                     <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
//                       <i className="ri-user-fill absolute"></i>
//                     </div>
//                     <h1 className="font-semibold text-lg">{user.email}</h1>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </section>

//       <section className="right  bg-red-50 flex-grow h-full flex">
//         <div className="explorer h-full max-w-64 min-w-52 bg-slate-200">
//           <div className="file-tree w-full">
//             {Object.keys(fileTree).map((file, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setCurrentFile(file);
//                   setOpenFiles([...new Set([...openFiles, file])]);
//                 }}
//                 className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 bg-slate-300 w-full"
//               >
//                 <p className="font-semibold text-lg">{file}</p>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="code-editor flex flex-col flex-grow h-full shrink">
//           <div className="top flex justify-between w-full">
//             <div className="files flex">
//               {openFiles.map((file, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentFile(file)}
//                   className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 bg-slate-300 ${
//                     currentFile === file ? "bg-slate-400" : ""
//                   }`}
//                 >
//                   <p className="font-semibold text-lg">{file}</p>
//                 </button>
//               ))}
//             </div>

//             <div className="actions flex gap-2">
//               <button
//                 onClick={async () => {
//                   await webContainer.mount(fileTree);

//                   const installProcess = await webContainer.spawn("npm", [
//                     "install",
//                   ]);

//                   installProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   if (runProcess) {
//                     runProcess.kill();
//                   }

//                   let tempRunProcess = await webContainer.spawn("npm", [
//                     "start",
//                   ]);

//                   tempRunProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   setRunProcess(tempRunProcess);

//                   webContainer.on("server-ready", (port, url) => {
//                     console.log(port, url);
//                     setIframeUrl(url);
//                   });
//                 }}
//                 className="p-2 px-4 bg-slate-300 text-white"
//               >
//                 run
//               </button>
//             </div>
//           </div>
//           <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
//             {fileTree[currentFile] && (
//               <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
//                 <pre className="hljs h-full">
//                   <code
//                     className="hljs h-full outline-none"
//                     contentEditable
//                     suppressContentEditableWarning
//                     onBlur={(e) => {
//                       const updatedContent = e.target.innerText;
//                       const ft = {
//                         ...fileTree,
//                         [currentFile]: {
//                           file: {
//                             contents: updatedContent,
//                           },
//                         },
//                       };
//                       setFileTree(ft);
//                       saveFileTree(ft);
//                     }}
//                     dangerouslySetInnerHTML={{
//                       __html: hljs.highlight(
//                         "javascript",
//                         fileTree[currentFile].file.contents
//                       ).value,
//                     }}
//                     style={{
//                       whiteSpace: "pre-wrap",
//                       paddingBottom: "25rem",
//                       counterSet: "line-numbering",
//                     }}
//                   />
//                 </pre>
//               </div>
//             )}
//           </div>
//         </div>

//         {iframeUrl && webContainer && (
//           <div className="flex min-w-96 flex-col h-full">
//             <div className="address-bar">
//               <input
//                 type="text"
//                 onChange={(e) => setIframeUrl(e.target.value)}
//                 value={iframeUrl}
//                 className="w-full p-2 px-4 bg-slate-200"
//               />
//             </div>
//             <iframe src={iframeUrl} className="w-full h-full"></iframe>
//           </div>
//         )}
//       </section>

//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-4 rounded-md w-96 max-w-full relative">
//             <header className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">Select User</h2>
//               <button onClick={() => setIsModalOpen(false)} className="p-2">
//                 <i className="ri-close-fill"></i>
//               </button>
//             </header>
//             <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
//               {users.map((user) => (
//                 <div
//                   key={user.id}
//                   className={`user cursor-pointer hover:bg-slate-200 ${
//                     Array.from(selectedUserId).indexOf(user._id) != -1
//                       ? "bg-slate-200"
//                       : ""
//                   } p-2 flex gap-2 items-center`}
//                   onClick={() => handleUserClick(user._id)}
//                 >
//                   <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-slate-600">
//                     <i className="ri-user-fill absolute"></i>
//                   </div>
//                   <h1 className="font-semibold text-lg">{user.email}</h1>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={addCollaborators}
//               className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-600 text-white rounded-md"
//             >
//               Add Collaborators
//             </button>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// };

// export default Project;
// ---------------------------------------------------

// import React, { useState, useEffect, useContext, useRef } from "react";
// import { UserContext } from "../context/user.context";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "../config/axios";
// import {
//   initializeSocket,
//   receiveMessage,
//   sendMessage,
// } from "../config/socket";
// import Markdown from "markdown-to-jsx";
// import hljs from "highlight.js";
// import { getWebContainer } from "../config/webcontainer";
// import ReactMarkdown from "react-markdown";

// function SyntaxHighlightedCode(props) {
//   const ref = useRef(null);

//   React.useEffect(() => {
//     if (ref.current && props.className?.includes("lang-") && window.hljs) {
//       window.hljs.highlightElement(ref.current);

//       // hljs won't reprocess the element unless this attribute is removed
//       ref.current.removeAttribute("data-highlighted");
//     }
//   }, [props.className, props.children]);

//   return <code {...props} ref={ref} />;
// }

// const Project = () => {
//   const location = useLocation();

//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(new Set()); // Initialized as Set
//   const [project, setProject] = useState(location.state.project);
//   const [message, setMessage] = useState("");
//   const { user } = useContext(UserContext);
//   const messageBox = React.createRef();
//   const [isTyping, setIsTyping] = useState(false);

//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]); // New state variable for messages
//   const [fileTree, setFileTree] = useState({});

//   const [currentFile, setCurrentFile] = useState(null);
//   const [openFiles, setOpenFiles] = useState([]);

//   const [webContainer, setWebContainer] = useState(null);
//   const [iframeUrl, setIframeUrl] = useState(null);

//   const [runProcess, setRunProcess] = useState(null);

//   const handleUserClick = (id) => {
//     setSelectedUserId((prevSelectedUserId) => {
//       const newSelectedUserId = new Set(prevSelectedUserId);
//       if (newSelectedUserId.has(id)) {
//         newSelectedUserId.delete(id);
//       } else {
//         newSelectedUserId.add(id);
//       }

//       return newSelectedUserId;
//     });
//   };

//   function addCollaborators() {
//     axios
//       .put("/projects/add-user", {
//         projectId: location.state.project._id,
//         users: Array.from(selectedUserId),
//       })
//       .then((res) => {
//         console.log(res.data);
//         setIsModalOpen(false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   const send = () => {
//     sendMessage("project-message", {
//       message,
//       sender: user,
//     });
//     setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
//     setMessage("");
//     setIsTyping(true);

//     // Simulate AI thinking/typing
//     setTimeout(() => {
//       setIsTyping(false);
//     }, 2000);
//   };

//   function WriteAiMessage(message) {
//     let messageObject;

//     try {
//       messageObject = JSON.parse(message);
//     } catch (error) {
//       console.error("Invalid JSON message:", message);
//       return <p>{message}</p>; // If parsing fails, show the raw message
//     }

//     if (messageObject.text) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           <ReactMarkdown>{messageObject.text}</ReactMarkdown>
//         </div>
//       );
//     }

//     // Extract all attributes instead of only 3
//     const keys = Object.keys(messageObject);
//     if (keys.length > 0) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           {keys.map((key) => (
//             <div key={key}>
//               <strong>{key}:</strong>{" "}
//               <ReactMarkdown>{String(messageObject[key])}</ReactMarkdown>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     return <p>Unknown response format</p>;
//   }

//   useEffect(() => {
//     initializeSocket(project._id);

//     if (!webContainer) {
//       getWebContainer().then((container) => {
//         setWebContainer(container);
//         console.log("container started");
//       });
//     }

//     receiveMessage("project-message", (data) => {
//       console.log(data);

//       if (data.sender._id == "ai") {
//         const message = JSON.parse(data.message);

//         // console.log(message);

//         webContainer?.mount(message.fileTree);

//         if (message.fileTree) {
//           setFileTree(message.fileTree || {});
//         }
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       } else {
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       }
//     });

//     axios
//       .get(`/projects/get-project/${location.state.project._id}`)
//       .then((res) => {
//         console.log(res.data.project);

//         setProject(res.data.project);
//         setFileTree(res.data.project.fileTree || {});
//       });

//     axios
//       .get("/users/all")
//       .then((res) => {
//         setUsers(res.data.users);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, []);

//   useEffect(() => {
//     if (messageBox.current) {
//       scrollToBottom();
//     }
//   }, [messages, isTyping]);

//   function saveFileTree(ft) {
//     axios
//       .put("/projects/update-file-tree", {
//         projectId: project._id,
//         fileTree: ft,
//       })
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function scrollToBottom() {
//     messageBox.current.scrollTop = messageBox.current.scrollHeight;
//   }

//   return (
//     <main className="h-screen w-screen flex bg-slate-50">
//       {/* Main content area with chat and code editor */}
//       <section className="left relative flex flex-col h-screen w-96 bg-slate-100 border-r border-slate-200">
//         <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-800 text-white absolute z-10 top-0 border-b border-slate-200">
//           <div className="flex items-center gap-2">
//             <span className="font-semibold">{project.name || "Project"}</span>
//           </div>
//           <div className="flex gap-2">
//             <button
//               className="flex items-center gap-1 text-slate-100 hover:text-blue-300"
//               onClick={() => setIsModalOpen(true)}
//             >
//               <i className="ri-add-fill"></i>
//               <span className="text-sm">Add</span>
//             </button>
//             <button
//               onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//               className="p-1 text-slate-100 hover:text-blue-300"
//             >
//               <i className="ri-group-fill"></i>
//             </button>
//           </div>
//         </header>

//         <div className="conversation-area pt-14 pb-16 flex-grow flex flex-col h-full relative">
//           <div
//             ref={messageBox}
//             className="message-box p-2 flex-grow flex flex-col gap-2 overflow-auto max-h-full scrollbar-hide"
//           >
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`${
//                   msg.sender._id === "ai" ? "max-w-80" : "max-w-64"
//                 } ${
//                   msg.sender._id == user._id.toString() && "ml-auto"
//                 }  message flex flex-col p-2 ${
//                   msg.sender._id == user._id.toString()
//                     ? "bg-blue-500 text-white"
//                     : "bg-slate-200"
//                 } w-fit rounded-lg shadow-sm`}
//               >
//                 <small
//                   className={`text-xs ${
//                     msg.sender._id == user._id.toString()
//                       ? "text-blue-100"
//                       : "text-slate-500"
//                   }`}
//                 >
//                   {msg.sender.email}
//                 </small>
//                 <div className="text-sm">
//                   {msg.sender._id === "ai" ? (
//                     WriteAiMessage(msg.message)
//                   ) : (
//                     <p>{msg.message}</p>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {isTyping && (
//               <div className="message flex flex-col p-2 bg-slate-200 w-fit rounded-lg shadow-sm animate-pulse">
//                 <small className="text-xs text-slate-500">AI Assistant</small>
//                 <div className="flex items-center gap-2">
//                   <div className="robot-animation flex items-center">
//                     <i className="ri-robot-fill text-blue-500 text-xl"></i>
//                     <div className="typing-animation flex">
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "0ms" }}
//                       ></span>
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "300ms" }}
//                       ></span>
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "600ms" }}
//                       ></span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="inputField w-full flex absolute bottom-0 border-t border-slate-200 bg-white">
//             <input
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   send();
//                 }
//               }}
//               className="p-3 px-4 border-none outline-none flex-grow text-slate-800"
//               type="text"
//               placeholder="Enter message"
//             />
//             <button
//               onClick={send}
//               className="px-5 bg-blue-500 hover:bg-blue-600 text-white"
//             >
//               <i className="ri-send-plane-fill"></i>
//             </button>
//           </div>
//         </div>

//         {/* Side panel for collaborators */}
//         <div
//           className={`sidePanel w-full h-full flex flex-col gap-2 bg-white absolute transition-all z-20 ${
//             isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
//           } top-0 shadow-lg`}
//         >
//           <header className="flex justify-between items-center px-4 p-3 bg-slate-800 text-white">
//             <h1 className="font-semibold text-lg">Collaborators</h1>

//             <button
//               onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//               className="p-2 hover:text-slate-300"
//             >
//               <i className="ri-close-fill"></i>
//             </button>
//           </header>
//           <div className="users flex flex-col gap-1 p-2">
//             {project.users &&
//               project.users.map((user, idx) => {
//                 return (
//                   <div
//                     key={idx}
//                     className="user cursor-pointer hover:bg-slate-100 p-2 flex gap-2 items-center rounded"
//                   >
//                     <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
//                       <i className="ri-user-fill absolute"></i>
//                     </div>
//                     <h1 className="font-semibold">{user.email}</h1>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </section>

//       {/* Right section with file explorer and editor */}
//       <section className="right flex-grow h-full flex">
//         <div className="explorer h-full w-64 bg-slate-100 border-r border-slate-200">
//           <div className="file-explorer-header p-3 font-medium bg-slate-200 border-b border-slate-300">
//             Files
//           </div>
//           <div className="file-tree w-full">
//             {Object.keys(fileTree).map((file, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setCurrentFile(file);
//                   setOpenFiles([...new Set([...openFiles, file])]);
//                 }}
//                 className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 hover:bg-slate-200 w-full text-left"
//               >
//                 <i className="ri-file-code-line text-slate-600"></i>
//                 <p className="font-medium">{file}</p>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="code-editor flex flex-col flex-grow h-full shrink">
//           <div className="top flex w-full bg-slate-200 border-b border-slate-300">
//             <div className="files flex overflow-x-auto">
//               {openFiles.map((file, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentFile(file)}
//                   className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 border-r border-slate-300 ${
//                     currentFile === file ? "bg-white text-blue-600" : ""
//                   }`}
//                 >
//                   <i className="ri-file-code-line"></i>
//                   <p className="font-medium">{file}</p>
//                   <span className="ml-2 text-slate-400 hover:text-slate-700">
//                     ×
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="actions flex gap-2 ml-auto">
//               <button
//                 onClick={async () => {
//                   await webContainer.mount(fileTree);

//                   const installProcess = await webContainer.spawn("npm", [
//                     "install",
//                   ]);

//                   installProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   if (runProcess) {
//                     runProcess.kill();
//                   }

//                   let tempRunProcess = await webContainer.spawn("npm", [
//                     "start",
//                   ]);

//                   tempRunProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   setRunProcess(tempRunProcess);

//                   webContainer.on("server-ready", (port, url) => {
//                     console.log(port, url);
//                     setIframeUrl(url);
//                   });
//                 }}
//                 className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white my-1 mr-2 rounded"
//               >
//                 <i className="ri-play-fill mr-1"></i>
//                 Run Project
//               </button>
//             </div>
//           </div>

//           <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
//             {fileTree[currentFile] && (
//               <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
//                 <pre className="hljs h-full">
//                   <code
//                     className="hljs h-full outline-none p-4"
//                     contentEditable
//                     suppressContentEditableWarning
//                     onBlur={(e) => {
//                       const updatedContent = e.target.innerText;
//                       const ft = {
//                         ...fileTree,
//                         [currentFile]: {
//                           file: {
//                             contents: updatedContent,
//                           },
//                         },
//                       };
//                       setFileTree(ft);
//                       saveFileTree(ft);
//                     }}
//                     dangerouslySetInnerHTML={{
//                       __html: hljs.highlight(
//                         "javascript",
//                         fileTree[currentFile].file.contents
//                       ).value,
//                     }}
//                     style={{
//                       whiteSpace: "pre-wrap",
//                       paddingBottom: "25rem",
//                       counterSet: "line-numbering",
//                       fontFamily: "monospace",
//                     }}
//                   />
//                 </pre>
//               </div>
//             )}
//           </div>
//         </div>

//         {iframeUrl && webContainer && (
//           <div className="flex min-w-96 flex-col h-full border-l border-slate-200">
//             <div className="address-bar p-2 bg-slate-200 border-b border-slate-300">
//               <input
//                 type="text"
//                 onChange={(e) => setIframeUrl(e.target.value)}
//                 value={iframeUrl}
//                 className="w-full p-2 px-4 bg-white text-slate-800 rounded border border-slate-300"
//               />
//             </div>
//             <div className="console-header flex justify-between items-center px-4 py-2 bg-slate-200 border-b border-slate-300 text-sm text-slate-700">
//               <span>Console</span>
//               <div className="flex gap-4">
//                 <span className="cursor-pointer hover:text-blue-600">
//                   Console
//                 </span>
//                 <span className="cursor-pointer hover:text-blue-600">
//                   What's new
//                 </span>
//               </div>
//             </div>
//             <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
//           </div>
//         )}
//       </section>

//       {/* Modal for adding collaborators */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg w-96 max-w-full relative shadow-xl">
//             <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
//               <h2 className="text-xl font-semibold text-slate-800">
//                 Select User
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 text-slate-500 hover:text-slate-800"
//               >
//                 <i className="ri-close-fill"></i>
//               </button>
//             </header>
//             <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
//               {users.map((user, idx) => (
//                 <div
//                   key={idx}
//                   className={`user cursor-pointer hover:bg-slate-100 ${
//                     Array.from(selectedUserId).indexOf(user._id) != -1
//                       ? "bg-blue-50 border border-blue-200"
//                       : ""
//                   } p-2 flex gap-2 items-center rounded`}
//                   onClick={() => handleUserClick(user._id)}
//                 >
//                   <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
//                     <i className="ri-user-fill absolute"></i>
//                   </div>
//                   <h1 className="font-semibold">{user.email}</h1>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={addCollaborators}
//               className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
//             >
//               Add Collaborators
//             </button>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes bounce {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }
//         .animate-bounce {
//           animation: bounce 1s infinite;
//         }
//       `}</style>
//     </main>
//   );
// };

// export default Project;

// import React, { useState, useEffect, useContext, useRef } from "react";
// import { UserContext } from "../context/user.context";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "../config/axios";
// import {
//   initializeSocket,
//   receiveMessage,
//   sendMessage,
// } from "../config/socket";
// import Markdown from "markdown-to-jsx";
// import hljs from "highlight.js";
// import { getWebContainer } from "../config/webcontainer";
// import ReactMarkdown from "react-markdown";

// function SyntaxHighlightedCode(props) {
//   const ref = useRef(null);

//   React.useEffect(() => {
//     if (ref.current && props.className?.includes("lang-") && window.hljs) {
//       window.hljs.highlightElement(ref.current);

//       // hljs won't reprocess the element unless this attribute is removed
//       ref.current.removeAttribute("data-highlighted");
//     }
//   }, [props.className, props.children]);

//   return <code {...props} ref={ref} />;
// }

// const Project = () => {
//   const location = useLocation();

//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(new Set()); // Initialized as Set
//   const [project, setProject] = useState(location.state.project);
//   const [message, setMessage] = useState("");
//   const { user } = useContext(UserContext);
//   const messageBox = React.createRef();
//   const [isTyping, setIsTyping] = useState(false);
//   const [isUserTyping, setIsUserTyping] = useState(false);
//   const typingTimerRef = useRef(null);

//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]); // New state variable for messages
//   const [fileTree, setFileTree] = useState({});

//   const [currentFile, setCurrentFile] = useState(null);
//   const [openFiles, setOpenFiles] = useState([]);

//   const [webContainer, setWebContainer] = useState(null);
//   const [iframeUrl, setIframeUrl] = useState(null);

//   const [runProcess, setRunProcess] = useState(null);

//   const handleUserClick = (id) => {
//     setSelectedUserId((prevSelectedUserId) => {
//       const newSelectedUserId = new Set(prevSelectedUserId);
//       if (newSelectedUserId.has(id)) {
//         newSelectedUserId.delete(id);
//       } else {
//         newSelectedUserId.add(id);
//       }

//       return newSelectedUserId;
//     });
//   };

//   function addCollaborators() {
//     axios
//       .put("/projects/add-user", {
//         projectId: location.state.project._id,
//         users: Array.from(selectedUserId),
//       })
//       .then((res) => {
//         console.log(res.data);
//         setIsModalOpen(false);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   const send = () => {
//     if (!message.trim()) return;

//     sendMessage("project-message", {
//       message,
//       sender: user,
//     });
//     setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
//     setMessage("");
//     setIsTyping(true);
//     setIsUserTyping(false);

//     // Simulate AI thinking/typing
//     setTimeout(() => {
//       setIsTyping(false);
//     }, 2000);
//   };

//   const handleInputChange = (e) => {
//     setMessage(e.target.value);

//     // Show the listening robot when user is typing
//     setIsUserTyping(true);

//     // Clear the previous timer
//     if (typingTimerRef.current) {
//       clearTimeout(typingTimerRef.current);
//     }

//     // Set a timer to hide the listening robot after user stops typing
//     typingTimerRef.current = setTimeout(() => {
//       setIsUserTyping(false);
//     }, 1500);
//   };

//   function WriteAiMessage(message) {
//     let messageObject;

//     try {
//       messageObject = JSON.parse(message);
//     } catch (error) {
//       console.error("Invalid JSON message:", message);
//       return <p>{message}</p>; // If parsing fails, show the raw message
//     }

//     if (messageObject.text) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           <ReactMarkdown>{messageObject.text}</ReactMarkdown>
//         </div>
//       );
//     }

//     // Extract all attributes instead of only 3
//     const keys = Object.keys(messageObject);
//     if (keys.length > 0) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           {keys.map((key) => (
//             <div key={key}>
//               <strong>{key}:</strong>{" "}
//               <ReactMarkdown>{String(messageObject[key])}</ReactMarkdown>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     return <p>Unknown response format</p>;
//   }

//   useEffect(() => {
//     initializeSocket(project._id);

//     if (!webContainer) {
//       getWebContainer().then((container) => {
//         setWebContainer(container);
//         console.log("container started");
//       });
//     }

//     receiveMessage("project-message", (data) => {
//       console.log(data);

//       if (data.sender._id == "ai") {
//         const message = JSON.parse(data.message);

//         // console.log(message);

//         webContainer?.mount(message.fileTree);

//         if (message.fileTree) {
//           setFileTree(message.fileTree || {});
//         }
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       } else {
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       }
//     });

//     axios
//       .get(`/projects/get-project/${location.state.project._id}`)
//       .then((res) => {
//         console.log(res.data.project);

//         setProject(res.data.project);
//         setFileTree(res.data.project.fileTree || {});
//       });

//     axios
//       .get("/users/all")
//       .then((res) => {
//         setUsers(res.data.users);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     // Clean up the typing timer
//     return () => {
//       if (typingTimerRef.current) {
//         clearTimeout(typingTimerRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (messageBox.current) {
//       scrollToBottom();
//     }
//   }, [messages, isTyping]);

//   function saveFileTree(ft) {
//     axios
//       .put("/projects/update-file-tree", {
//         projectId: project._id,
//         fileTree: ft,
//       })
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function scrollToBottom() {
//     messageBox.current.scrollTop = messageBox.current.scrollHeight;
//   }

//   return (
//     <main className="h-screen w-screen flex bg-slate-200">
//       {/* Main content area with chat and code editor */}
//       <section className="left relative flex flex-col h-screen w-96 bg-slate-200 border-r border-slate-300 shadow-md">
//         <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-800 text-white absolute z-10 top-0 border-b border-slate-300 shadow-sm">
//           <div className="flex items-center gap-2">
//             <span className="font-semibold">{project.name || "Project"}</span>
//           </div>
//           <div className="flex gap-2">
//             <button
//               className="flex items-center gap-1 text-slate-100 hover:text-blue-300"
//               onClick={() => setIsModalOpen(true)}
//             >
//               <i className="ri-add-fill"></i>
//               <span className="text-sm">Add</span>
//             </button>
//             <button
//               onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//               className="p-1 text-slate-100 hover:text-blue-300"
//             >
//               <i className="ri-group-fill"></i>
//             </button>
//           </div>
//         </header>

//         <div className="conversation-area pt-14 pb-16 flex-grow flex flex-col h-full relative">
//           <div
//             ref={messageBox}
//             className="message-box p-2 flex-grow flex flex-col gap-2 overflow-auto max-h-full scrollbar-hide"
//           >
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`${
//                   msg.sender._id === "ai" ? "max-w-80" : "max-w-64"
//                 } ${
//                   msg.sender._id == user._id.toString() && "ml-auto"
//                 }  message flex flex-col p-3 ${
//                   msg.sender._id == user._id.toString()
//                     ? "bg-blue-500 text-white"
//                     : "bg-slate-300"
//                 } w-fit rounded-lg shadow-sm`}
//               >
//                 <small
//                   className={`text-xs ${
//                     msg.sender._id == user._id.toString()
//                       ? "text-blue-100"
//                       : "text-slate-500"
//                   }`}
//                 >
//                   {msg.sender.email}
//                 </small>
//                 <div className="text-sm">
//                   {msg.sender._id === "ai" ? (
//                     WriteAiMessage(msg.message)
//                   ) : (
//                     <p>{msg.message}</p>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {isTyping && (
//               <div className="message flex flex-col p-3 bg-slate-300 w-fit rounded-lg shadow-sm animate-pulse">
//                 <small className="text-xs text-slate-500">AI Assistant</small>
//                 <div className="flex items-center gap-2">
//                   <div className="robot-animation flex items-center">
//                     <i className="ri-robot-fill text-blue-500 text-xl"></i>
//                     <div className="typing-animation flex">
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "0ms" }}
//                       ></span>
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "300ms" }}
//                       ></span>
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "600ms" }}
//                       ></span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="inputField w-full flex absolute bottom-0 border-t border-slate-300 bg-white shadow-md rounded-b-lg">
//             <div className="relative flex w-full">
//               <input
//                 value={message}
//                 onChange={handleInputChange}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     send();
//                   }
//                 }}
//                 className="p-4 px-4 border-none outline-none flex-grow text-slate-800 rounded-bl-lg"
//                 type="text"
//                 placeholder="Enter message"
//               />
//               <button
//                 onClick={send}
//                 className="px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-br-lg"
//               >
//                 <i className="ri-send-plane-fill"></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Side panel for collaborators */}
//         <div
//           className={`sidePanel w-full h-full flex flex-col gap-2 bg-white absolute transition-all z-20 ${
//             isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
//           } top-0 shadow-lg`}
//         >
//           <header className="flex justify-between items-center px-4 p-3 bg-slate-800 text-white">
//             <h1 className="font-semibold text-lg">Collaborators</h1>

//             <button
//               onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//               className="p-2 hover:text-slate-300"
//             >
//               <i className="ri-close-fill"></i>
//             </button>
//           </header>
//           <div className="users flex flex-col gap-1 p-2">
//             {project.users &&
//               project.users.map((user, idx) => {
//                 return (
//                   <div
//                     key={idx}
//                     className="user cursor-pointer hover:bg-slate-100 p-2 flex gap-2 items-center rounded"
//                   >
//                     <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
//                       <i className="ri-user-fill absolute"></i>
//                     </div>
//                     <h1 className="font-semibold">{user.email}</h1>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </section>

//       {/* Right section with file explorer and editor */}
//       <section className="right flex-grow h-full flex border-l border-slate-300">
//         <div className="explorer h-full w-64 bg-slate-100 border-r border-slate-300 shadow-sm">
//           <div className="file-explorer-header p-3 font-medium bg-slate-200 border-b border-slate-300">
//             Files
//           </div>
//           <div className="file-tree w-full">
//             {Object.keys(fileTree).map((file, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setCurrentFile(file);
//                   setOpenFiles([...new Set([...openFiles, file])]);
//                 }}
//                 className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 hover:bg-slate-200 w-full text-left"
//               >
//                 <i className="ri-file-code-line text-slate-600"></i>
//                 <p className="font-medium">{file}</p>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="code-editor flex flex-col flex-grow h-full shrink">
//           <div className="top flex w-full bg-slate-200 border-b border-slate-300 shadow-sm">
//             <div className="files flex overflow-x-auto">
//               {openFiles.map((file, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentFile(file)}
//                   className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 border-r border-slate-300 ${
//                     currentFile === file ? "bg-white text-blue-600" : ""
//                   }`}
//                 >
//                   <i className="ri-file-code-line"></i>
//                   <p className="font-medium">{file}</p>
//                   <span className="ml-2 text-slate-400 hover:text-slate-700">
//                     ×
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="actions flex gap-2 ml-auto">
//               <button
//                 onClick={async () => {
//                   await webContainer.mount(fileTree);

//                   const installProcess = await webContainer.spawn("npm", [
//                     "install",
//                   ]);

//                   installProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   if (runProcess) {
//                     runProcess.kill();
//                   }

//                   let tempRunProcess = await webContainer.spawn("npm", [
//                     "start",
//                   ]);

//                   tempRunProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   setRunProcess(tempRunProcess);

//                   webContainer.on("server-ready", (port, url) => {
//                     console.log(port, url);
//                     setIframeUrl(url);
//                   });
//                 }}
//                 className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white my-1 mr-2 rounded"
//               >
//                 <i className="ri-play-fill mr-1"></i>
//                 Run Project
//               </button>
//             </div>
//           </div>

//           <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
//             {fileTree[currentFile] && (
//               <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
//                 <pre className="hljs h-full">
//                   <code
//                     className="hljs h-full outline-none p-4"
//                     contentEditable
//                     suppressContentEditableWarning
//                     onBlur={(e) => {
//                       const updatedContent = e.target.innerText;
//                       const ft = {
//                         ...fileTree,
//                         [currentFile]: {
//                           file: {
//                             contents: updatedContent,
//                           },
//                         },
//                       };
//                       setFileTree(ft);
//                       saveFileTree(ft);
//                     }}
//                     dangerouslySetInnerHTML={{
//                       __html: hljs.highlight(
//                         "javascript",
//                         fileTree[currentFile].file.contents
//                       ).value,
//                     }}
//                     style={{
//                       whiteSpace: "pre-wrap",
//                       paddingBottom: "25rem",
//                       counterSet: "line-numbering",
//                       fontFamily: "monospace",
//                     }}
//                   />
//                 </pre>
//               </div>
//             )}
//           </div>
//         </div>

//         {iframeUrl && webContainer && (
//           <div className="flex min-w-96 flex-col h-full border-l border-slate-300 shadow-sm">
//             <div className="address-bar p-2 bg-slate-200 border-b border-slate-300">
//               <input
//                 type="text"
//                 onChange={(e) => setIframeUrl(e.target.value)}
//                 value={iframeUrl}
//                 className="w-full p-2 px-4 bg-white text-slate-800 rounded border border-slate-300"
//               />
//             </div>
//             <div className="console-header flex justify-between items-center px-4 py-2 bg-slate-200 border-b border-slate-300 text-sm text-slate-700">
//               <span>Console</span>
//               <div className="flex gap-4">
//                 <span className="cursor-pointer hover:text-blue-600">
//                   Console
//                 </span>
//                 <span className="cursor-pointer hover:text-blue-600">
//                   What's new
//                 </span>
//               </div>
//             </div>
//             <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
//           </div>
//         )}
//       </section>

//       {/* Modal for adding collaborators */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg w-96 max-w-full relative shadow-xl">
//             <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
//               <h2 className="text-xl font-semibold text-slate-800">
//                 Select User
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 text-slate-500 hover:text-slate-800"
//               >
//                 <i className="ri-close-fill"></i>
//               </button>
//             </header>
//             <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
//               {users.map((user, idx) => (
//                 <div
//                   key={idx}
//                   className={`user cursor-pointer hover:bg-slate-100 ${
//                     Array.from(selectedUserId).indexOf(user._id) != -1
//                       ? "bg-blue-50 border border-blue-200"
//                       : ""
//                   } p-2 flex gap-2 items-center rounded`}
//                   onClick={() => handleUserClick(user._id)}
//                 >
//                   <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
//                     <i className="ri-user-fill absolute"></i>
//                   </div>
//                   <h1 className="font-semibold">{user.email}</h1>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={addCollaborators}
//               className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
//             >
//               Add Collaborators
//             </button>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes bounce {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }
//         .animate-bounce {
//           animation: bounce 1s infinite;
//         }
//         @keyframes pulse {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.6;
//           }
//         }
//         .animate-pulse {
//           animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>
//     </main>
//   );
// };

// export default Project;

// import React, { useState, useEffect, useContext, useRef } from "react";
// import { UserContext } from "../context/user.context";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "../config/axios";
// import {
//   initializeSocket,
//   receiveMessage,
//   sendMessage,
// } from "../config/socket";
// import Markdown from "markdown-to-jsx";
// import hljs from "highlight.js";
// import { getWebContainer } from "../config/webcontainer";
// import ReactMarkdown from "react-markdown";

// function SyntaxHighlightedCode(props) {
//   const ref = useRef(null);

//   React.useEffect(() => {
//     if (ref.current && props.className?.includes("lang-") && window.hljs) {
//       window.hljs.highlightElement(ref.current);

//       // hljs won't reprocess the element unless this attribute is removed
//       ref.current.removeAttribute("data-highlighted");
//     }
//   }, [props.className, props.children]);

//   return <code {...props} ref={ref} />;
// }

// const Project = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedUserId, setSelectedUserId] = useState(new Set()); // Initialized as Set
//   const [project, setProject] = useState(location.state.project);
//   const [message, setMessage] = useState("");
//   const { user } = useContext(UserContext);
//   const messageBox = React.createRef();
//   const [isTyping, setIsTyping] = useState(false);
//   const [isUserTyping, setIsUserTyping] = useState(false);
//   const typingTimerRef = useRef(null);

//   const [users, setUsers] = useState([]);
//   const [messages, setMessages] = useState([]); // New state variable for messages
//   const [fileTree, setFileTree] = useState({});

//   const [currentFile, setCurrentFile] = useState(null);
//   const [openFiles, setOpenFiles] = useState([]);

//   const [webContainer, setWebContainer] = useState(null);
//   const [iframeUrl, setIframeUrl] = useState(null);

//   const [runProcess, setRunProcess] = useState(null);

//   const handleUserClick = (id) => {
//     setSelectedUserId((prevSelectedUserId) => {
//       const newSelectedUserId = new Set(prevSelectedUserId);
//       if (newSelectedUserId.has(id)) {
//         newSelectedUserId.delete(id);
//       } else {
//         newSelectedUserId.add(id);
//       }

//       return newSelectedUserId;
//     });
//   };

//   // function addCollaborators() {
//   //   axios
//   //     .put("/projects/add-user", {
//   //       projectId: location.state.project._id,
//   //       users: Array.from(selectedUserId),
//   //     })
//   //     .then((res) => {
//   //       console.log(res.data);

//   //       // Update the project state with new users
//   //       if (res.data.project && res.data.project.users) {
//   //         setProject(res.data.project);
//   //       } else {
//   //         // If the response doesn't include updated project data, fetch it
//   //         fetchProjectData();
//   //       }

//   //       setIsModalOpen(false);
//   //     })
//   //     .catch((err) => {
//   //       console.log(err);
//   //     });
//   // }

//   // function addCollaborators() {
//   //   axios
//   //     .put("/projects/add-user", {
//   //       projectId: location.state.project._id,
//   //       users: Array.from(selectedUserId),
//   //     })
//   //     .then((res) => {
//   //       console.log("Collaborators added successfully:", res.data);

//   //       // Close the modal
//   //       setIsModalOpen(false);
//   //       navigate(0);
//   //       // Refresh the page to get updated data
//   //       // window.location.reload();
//   //     })
//   //     .catch((err) => {
//   //       console.log("Error adding collaborators:", err);
//   //     });
//   // }

//   function addCollaborators() {
//     axios
//       .put("/projects/add-user", {
//         projectId: location.state.project._id,
//         users: Array.from(selectedUserId),
//       })
//       .then((res) => {
//         console.log("Collaborators added successfully:", res.data);

//         // Close the modal
//         setIsModalOpen(false);

//         // Option 1: If you're using React Router v6, use the current location
//         const currentLocation = window.location.pathname;
//         navigate(currentLocation, { replace: true, state: location.state });

//         // Option 2: Alternatively, just fetch fresh data without navigation
//         fetchProjectData();
//       })
//       .catch((err) => {
//         console.log("Error adding collaborators:", err);
//       });
//   }

//   const fetchProjectData = () => {
//     axios
//       .get(`/projects/get-project/${location.state.project._id}`)
//       .then((res) => {
//         console.log(res.data.project);
//         setProject(res.data.project);
//         setFileTree(res.data.project.fileTree || {});
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const send = () => {
//     if (!message.trim()) return;

//     sendMessage("project-message", {
//       message,
//       sender: user,
//     });
//     setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
//     setMessage("");

//     // Only show typing indicator if message starts with "@ai"
//     if (message.trim().toLowerCase().startsWith("@ai")) {
//       setIsTyping(true);
//       setIsUserTyping(false);

//       // Simulate AI thinking/typing
//       setTimeout(() => {
//         setIsTyping(false);
//       }, 2000);
//     }
//   };

//   const handleInputChange = (e) => {
//     setMessage(e.target.value);

//     // Show the listening robot when user is typing
//     setIsUserTyping(true);

//     // Clear the previous timer
//     if (typingTimerRef.current) {
//       clearTimeout(typingTimerRef.current);
//     }

//     // Set a timer to hide the listening robot after user stops typing
//     typingTimerRef.current = setTimeout(() => {
//       setIsUserTyping(false);
//     }, 1500);
//   };

//   function WriteAiMessage(message) {
//     let messageObject;

//     try {
//       messageObject = JSON.parse(message);
//     } catch (error) {
//       console.error("Invalid JSON message:", message);
//       return <p>{message}</p>; // If parsing fails, show the raw message
//     }

//     if (messageObject.text) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           <ReactMarkdown>{messageObject.text}</ReactMarkdown>
//         </div>
//       );
//     }

//     // Extract all attributes instead of only 3
//     const keys = Object.keys(messageObject);
//     if (keys.length > 0) {
//       return (
//         <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
//           {keys.map((key) => (
//             <div key={key}>
//               <strong>{key}:</strong>{" "}
//               <ReactMarkdown>{String(messageObject[key])}</ReactMarkdown>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     return <p>Unknown response format</p>;
//   }

//   useEffect(() => {
//     initializeSocket(project._id);

//     if (!webContainer) {
//       getWebContainer().then((container) => {
//         setWebContainer(container);
//         console.log("container started");
//       });
//     }

//     receiveMessage("project-message", (data) => {
//       console.log(data);

//       if (data.sender._id == "ai") {
//         const message = JSON.parse(data.message);

//         // console.log(message);

//         webContainer?.mount(message.fileTree);

//         if (message.fileTree) {
//           setFileTree(message.fileTree || {});
//         }
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       } else {
//         setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
//       }
//     });

//     fetchProjectData();

//     axios
//       .get("/users/all")
//       .then((res) => {
//         setUsers(res.data.users);
//       })
//       .catch((err) => {
//         console.log(err);
//       });

//     // Clean up the typing timer
//     return () => {
//       if (typingTimerRef.current) {
//         clearTimeout(typingTimerRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (messageBox.current) {
//       scrollToBottom();
//     }
//   }, [messages, isTyping]);

//   function saveFileTree(ft) {
//     axios
//       .put("/projects/update-file-tree", {
//         projectId: project._id,
//         fileTree: ft,
//       })
//       .then((res) => {
//         console.log(res.data);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }

//   function scrollToBottom() {
//     messageBox.current.scrollTop = messageBox.current.scrollHeight;
//   }

//   return (
//     <main className="h-screen w-screen flex bg-slate-200">
//       {/* Main content area with chat and code editor */}
//       <section className="left relative flex flex-col h-screen w-96 bg-slate-200 border-r border-slate-300 shadow-md">
//         <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-800 text-white absolute z-10 top-0 border-b border-slate-300 shadow-sm">
//           <div className="flex items-center gap-2">
//             <span className="font-semibold">{project.name || "Project"}</span>
//           </div>
//           <div className="flex gap-2">
//             <button
//               className="flex items-center gap-1 text-slate-100 hover:text-blue-300"
//               onClick={() => setIsModalOpen(true)}
//             >
//               <i className="ri-add-fill"></i>
//               <span className="text-sm">Add</span>
//             </button>
//             <button
//               onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//               className="p-1 text-slate-100 hover:text-blue-300"
//             >
//               <i className="ri-group-fill"></i>
//             </button>
//           </div>
//         </header>

//         <div className="conversation-area pt-14 pb-16 flex-grow flex flex-col h-full relative">
//           <div
//             ref={messageBox}
//             className="message-box p-2 flex-grow flex flex-col gap-2 overflow-auto max-h-full scrollbar-hide"
//           >
//             {/* {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`${
//                   msg.sender._id === "ai" ? "max-w-80" : "max-w-64"
//                 } ${
//                   msg.sender._id == user._id.toString() && "ml-auto"
//                 }  message flex flex-col p-3 ${
//                   msg.sender._id == user._id.toString()
//                     ? "bg-blue-500 text-white"
//                     : "bg-slate-300"
//                 } w-fit rounded-lg shadow-sm`}
//               >
//                 <small
//                   className={`text-xs ${
//                     msg.sender._id == user._id.toString()
//                       ? "text-blue-100"
//                       : "text-slate-500"
//                   }`}
//                 >
//                   {msg.sender.email}
//                 </small>
//                 <div className="text-sm">
//                   {msg.sender._id === "ai" ? (
//                     WriteAiMessage(msg.message)
//                   ) : (
//                     <p>{msg.message}</p>
//                   )}
//                 </div>
//               </div>
//             ))} */}

//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`flex flex-col w-fit max-w-lg p-3 rounded-xl shadow-md transition-all duration-300 ${
//                   msg.sender._id === "ai"
//                     ? "bg-gray-900 text-white border border-gray-700 hover:shadow-lg"
//                     : "bg-blue-900 text-white ml-auto border border-blue-500 hover:shadow-md"
//                 }`}
//               >
//                 <small className="text-xs font-medium opacity-90 flex items-center gap-1">
//                   {msg.sender._id === "ai" ? (
//                     <span className="text-blue-400 flex items-center gap-1">
//                       🤖 <span className="font-bold text-blue-300">SOEN</span>
//                     </span>
//                   ) : (
//                     <span className="text-blue-300 font-bold">
//                       {msg.sender.email.split("@")[0]}
//                     </span>
//                   )}
//                 </small>

//                 {msg.sender._id === "ai" ? (
//                   <p className="text-sm leading-relaxed mt-1">
//                     {WriteAiMessage(msg.message)}
//                   </p>
//                 ) : (
//                   <div className="text-sm leading-relaxed mt-1 p-3 rounded-lg shadow-sm bg-blue-400 text-white">
//                     {msg.message}
//                   </div>
//                 )}
//               </div>
//             ))}

//             {isTyping && (
//               <div className="message flex flex-col p-3 bg-slate-300 w-fit rounded-lg shadow-sm animate-pulse">
//                 <small className="text-xs text-slate-500">AI Assistant</small>
//                 <div className="flex items-center gap-2">
//                   <div className="robot-animation flex items-center">
//                     <i className="ri-robot-fill text-blue-500 text-xl"></i>
//                     <div className="typing-animation flex">
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "0ms" }}
//                       ></span>
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "300ms" }}
//                       ></span>
//                       <span
//                         className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
//                         style={{ animationDelay: "600ms" }}
//                       ></span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="inputField w-full flex absolute bottom-0 border-t border-slate-300 bg-white shadow-md rounded-b-lg">
//             <div className="relative flex w-full">
//               <input
//                 value={message}
//                 onChange={handleInputChange}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") {
//                     send();
//                   }
//                 }}
//                 className="p-4 px-4 border-none outline-none flex-grow text-slate-800 rounded-bl-lg"
//                 type="text"
//                 placeholder="Enter message"
//               />
//               <button
//                 onClick={send}
//                 className="px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-br-lg"
//               >
//                 <i className="ri-send-plane-fill"></i>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Side panel for collaborators */}
//         <div
//           className={`sidePanel w-full h-full flex flex-col gap-2 bg-white absolute transition-all z-20 ${
//             isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
//           } top-0 shadow-lg`}
//         >
//           <header className="flex justify-between items-center px-4 p-3 bg-slate-800 text-white">
//             <h1 className="font-semibold text-lg">Collaborators</h1>

//             <button
//               onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
//               className="p-2 hover:text-slate-300"
//             >
//               <i className="ri-close-fill"></i>
//             </button>
//           </header>
//           <div className="users flex flex-col gap-1 p-2">
//             {project.users &&
//               project.users.map((user, idx) => {
//                 return (
//                   <div
//                     key={idx}
//                     className="user cursor-pointer hover:bg-slate-100 p-2 flex gap-2 items-center rounded"
//                   >
//                     <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
//                       <i className="ri-user-fill absolute"></i>
//                     </div>
//                     <h1 className="font-semibold">{user.email}</h1>
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </section>

//       {/* Right section with file explorer and editor */}
//       <section className="right flex-grow h-full flex border-l border-slate-300">
//         <div className="explorer h-full w-64 bg-slate-100 border-r border-slate-300 shadow-sm">
//           <div className="file-explorer-header p-3 font-medium bg-slate-200 border-b border-slate-300">
//             Files
//           </div>
//           <div className="file-tree w-full">
//             {Object.keys(fileTree).map((file, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setCurrentFile(file);
//                   setOpenFiles([...new Set([...openFiles, file])]);
//                 }}
//                 className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 hover:bg-slate-200 w-full text-left"
//               >
//                 <i className="ri-file-code-line text-slate-600"></i>
//                 <p className="font-medium">{file}</p>
//               </button>
//             ))}
//           </div>
//         </div>

//         <div className="code-editor flex flex-col flex-grow h-full shrink">
//           <div className="top flex w-full bg-slate-200 border-b border-slate-300 shadow-sm">
//             <div className="files flex overflow-x-auto">
//               {openFiles.map((file, index) => (
//                 <button
//                   key={index}
//                   onClick={() => setCurrentFile(file)}
//                   className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 border-r border-slate-300 ${
//                     currentFile === file ? "bg-white text-blue-600" : ""
//                   }`}
//                 >
//                   <i className="ri-file-code-line"></i>
//                   <p className="font-medium">{file}</p>
//                   <span className="ml-2 text-slate-400 hover:text-slate-700">
//                     ×
//                   </span>
//                 </button>
//               ))}
//             </div>

//             <div className="actions flex gap-2 ml-auto">
//               <button
//                 onClick={async () => {
//                   await webContainer.mount(fileTree);

//                   const installProcess = await webContainer.spawn("npm", [
//                     "install",
//                   ]);

//                   installProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   if (runProcess) {
//                     runProcess.kill();
//                   }

//                   let tempRunProcess = await webContainer.spawn("npm", [
//                     "start",
//                   ]);

//                   tempRunProcess.output.pipeTo(
//                     new WritableStream({
//                       write(chunk) {
//                         console.log(chunk);
//                       },
//                     })
//                   );

//                   setRunProcess(tempRunProcess);

//                   webContainer.on("server-ready", (port, url) => {
//                     console.log(port, url);
//                     setIframeUrl(url);
//                   });
//                 }}
//                 className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white my-1 mr-2 rounded"
//               >
//                 <i className="ri-play-fill mr-1"></i>
//                 Run Project
//               </button>
//             </div>
//           </div>

//           <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
//             {fileTree[currentFile] && (
//               <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
//                 <pre className="hljs h-full">
//                   <code
//                     className="hljs h-full outline-none p-4"
//                     contentEditable
//                     suppressContentEditableWarning
//                     onBlur={(e) => {
//                       const updatedContent = e.target.innerText;
//                       const ft = {
//                         ...fileTree,
//                         [currentFile]: {
//                           file: {
//                             contents: updatedContent,
//                           },
//                         },
//                       };
//                       setFileTree(ft);
//                       saveFileTree(ft);
//                     }}
//                     dangerouslySetInnerHTML={{
//                       __html: hljs.highlight(
//                         "javascript",
//                         fileTree[currentFile].file.contents
//                       ).value,
//                     }}
//                     style={{
//                       whiteSpace: "pre-wrap",
//                       paddingBottom: "25rem",
//                       counterSet: "line-numbering",
//                       fontFamily: "monospace",
//                     }}
//                   />
//                 </pre>
//               </div>
//             )}
//           </div>
//         </div>

//         {iframeUrl && webContainer && (
//           <div className="flex min-w-96 flex-col h-full border-l border-slate-300 shadow-sm">
//             <div className="address-bar p-2 bg-slate-200 border-b border-slate-300">
//               <input
//                 type="text"
//                 onChange={(e) => setIframeUrl(e.target.value)}
//                 value={iframeUrl}
//                 className="w-full p-2 px-4 bg-white text-slate-800 rounded border border-slate-300"
//               />
//             </div>
//             <div className="console-header flex justify-between items-center px-4 py-2 bg-slate-200 border-b border-slate-300 text-sm text-slate-700">
//               <span>Console</span>
//               <div className="flex gap-4">
//                 <span className="cursor-pointer hover:text-blue-600">
//                   Console
//                 </span>
//                 <span className="cursor-pointer hover:text-blue-600">
//                   What's new
//                 </span>
//               </div>
//             </div>
//             <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
//           </div>
//         )}
//       </section>

//       {/* Modal for adding collaborators */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white p-4 rounded-lg w-96 max-w-full relative shadow-xl">
//             <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
//               <h2 className="text-xl font-semibold text-slate-800">
//                 Select User
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="p-2 text-slate-500 hover:text-slate-800"
//               >
//                 <i className="ri-close-fill"></i>
//               </button>
//             </header>
//             <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
//               {users.map((user, idx) => (
//                 <div
//                   key={idx}
//                   className={`user cursor-pointer hover:bg-slate-100 ${
//                     Array.from(selectedUserId).indexOf(user._id) != -1
//                       ? "bg-blue-50 border border-blue-200"
//                       : ""
//                   } p-2 flex gap-2 items-center rounded`}
//                   onClick={() => handleUserClick(user._id)}
//                 >
//                   <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
//                     <i className="ri-user-fill absolute"></i>
//                   </div>
//                   <h1 className="font-semibold">{user.email}</h1>
//                 </div>
//               ))}
//             </div>
//             <button
//               onClick={addCollaborators}
//               className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
//             >
//               Add Collaborators
//             </button>
//           </div>
//         </div>
//       )}

//       <style jsx>{`
//         @keyframes bounce {
//           0%,
//           100% {
//             transform: translateY(0);
//           }
//           50% {
//             transform: translateY(-5px);
//           }
//         }
//         .animate-bounce {
//           animation: bounce 1s infinite;
//         }
//         @keyframes pulse {
//           0%,
//           100% {
//             opacity: 1;
//           }
//           50% {
//             opacity: 0.6;
//           }
//         }
//         .animate-pulse {
//           animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
//         }
//       `}</style>
//     </main>
//   );
// };

// export default Project;

import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../context/user.context";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../config/axios";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import Markdown from "markdown-to-jsx";
import CallButton from "../components/callButton";

import hljs from "highlight.js";
import { getWebContainer } from "../config/webcontainer";
import ReactMarkdown from "react-markdown";

function SyntaxHighlightedCode(props) {
  const ref = useRef(null);

  React.useEffect(() => {
    if (ref.current && props.className?.includes("lang-") && window.hljs) {
      window.hljs.highlightElement(ref.current);

      // hljs won't reprocess the element unless this attribute is removed
      ref.current.removeAttribute("data-highlighted");
    }
  }, [props.className, props.children]);

  return <code {...props} ref={ref} />;
}

const Project = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(new Set()); // Initialized as Set
  const [project, setProject] = useState(location.state.project);
  const [message, setMessage] = useState("");
  const { user } = useContext(UserContext);
  const messageBox = React.createRef();
  const [isTyping, setIsTyping] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const typingTimerRef = useRef(null);
  const [copySuccess, setCopySuccess] = useState("");

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]); // New state variable for messages
  const [fileTree, setFileTree] = useState({});

  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);

  const [webContainer, setWebContainer] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);

  const [runProcess, setRunProcess] = useState(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }

      return newSelectedUserId;
    });
  };

  function addCollaborators() {
    axios
      .put("/projects/add-user", {
        projectId: location.state.project._id,
        users: Array.from(selectedUserId),
      })
      .then((res) => {
        console.log("Collaborators added successfully:", res.data);

        // Close the modal
        setIsModalOpen(false);

        // Option 1: If you're using React Router v6, use the current location
        const currentLocation = window.location.pathname;
        navigate(currentLocation, { replace: true, state: location.state });

        // Option 2: Alternatively, just fetch fresh data without navigation
        fetchProjectData();
      })
      .catch((err) => {
        console.log("Error adding collaborators:", err);
      });
  }

  const fetchProjectData = () => {
    axios
      .get(`/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        console.log(res.data.project);
        setProject(res.data.project);
        setFileTree(res.data.project.fileTree || {});
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const send = () => {
    if (!message.trim()) return;

    sendMessage("project-message", {
      message,
      sender: user,
    });
    setMessages((prevMessages) => [...prevMessages, { sender: user, message }]); // Update messages state
    setMessage("");

    // Only show typing indicator if message starts with "@ai"
    if (message.trim().toLowerCase().startsWith("@ai")) {
      setIsTyping(true);
      setIsUserTyping(false);

      // Simulate AI thinking/typing
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);

    // Show the listening robot when user is typing
    setIsUserTyping(true);

    // Clear the previous timer
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    // Set a timer to hide the listening robot after user stops typing
    typingTimerRef.current = setTimeout(() => {
      setIsUserTyping(false);
    }, 1500);
  };

  function WriteAiMessage(message) {
    let messageObject;

    try {
      messageObject = JSON.parse(message);
    } catch (error) {
      console.error("Invalid JSON message:", message);
      return <p>{message}</p>; // If parsing fails, show the raw message
    }

    if (messageObject.text) {
      return (
        <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
          <ReactMarkdown>{messageObject.text}</ReactMarkdown>
        </div>
      );
    }

    // Extract all attributes instead of only 3
    const keys = Object.keys(messageObject);
    if (keys.length > 0) {
      return (
        <div className="overflow-auto bg-slate-950 text-white rounded-sm p-2">
          {keys.map((key) => (
            <div key={key}>
              <strong>{key}:</strong>{" "}
              <ReactMarkdown>{String(messageObject[key])}</ReactMarkdown>
            </div>
          ))}
        </div>
      );
    }

    return <p>Unknown response format</p>;
  }

  const copyToClipboard = () => {
    if (currentFile && fileTree[currentFile]) {
      const content = fileTree[currentFile].file.contents;
      navigator.clipboard
        .writeText(content)
        .then(() => {
          setCopySuccess("Copied!");
          setTimeout(() => setCopySuccess(""), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          setCopySuccess("Failed to copy!");
        });
    }
  };

  const openOnlineCompiler = () => {
    if (currentFile && fileTree[currentFile]) {
      const content = fileTree[currentFile].file.contents;
      const fileName = currentFile;
      let compilerUrl = "https://stackblitz.com/edit/js-playground";

      // If the file has a specific extension, we could choose different compilers
      if (fileName.endsWith(".py")) {
        compilerUrl = "https://replit.com/languages/python3";
      } else if (fileName.endsWith(".java")) {
        compilerUrl = "https://replit.com/languages/java10";
      } else if (fileName.endsWith(".cpp") || fileName.endsWith(".c")) {
        compilerUrl = "https://replit.com/languages/cpp";
      }

      // Open the compiler in a new tab
      window.open(compilerUrl, "_blank");
    }
  };

  useEffect(() => {
    initializeSocket(project._id);

    if (!webContainer) {
      getWebContainer().then((container) => {
        setWebContainer(container);
        console.log("container started");
      });
    }

    receiveMessage("project-message", (data) => {
      console.log(data);

      if (data.sender._id == "ai") {
        const message = JSON.parse(data.message);

        // console.log(message);

        webContainer?.mount(message.fileTree);

        if (message.fileTree) {
          setFileTree(message.fileTree || {});
        }
        setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
      } else {
        setMessages((prevMessages) => [...prevMessages, data]); // Update messages state
      }
    });

    fetchProjectData();

    axios
      .get("/users/all")
      .then((res) => {
        setUsers(res.data.users);
      })
      .catch((err) => {
        console.log(err);
      });

    // Clean up the typing timer
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (messageBox.current) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  function saveFileTree(ft) {
    axios
      .put("/projects/update-file-tree", {
        projectId: project._id,
        fileTree: ft,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function scrollToBottom() {
    messageBox.current.scrollTop = messageBox.current.scrollHeight;
  }

  return (
    <main className="h-screen w-screen flex bg-slate-200">
      {/* Main content area with chat and code editor */}
      <section className="left relative flex flex-col h-screen w-96 bg-slate-200 border-r border-slate-300 shadow-md">
        <header className="flex justify-between items-center p-2 px-4 w-full bg-slate-800 text-white absolute z-10 top-0 border-b border-slate-300 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{project.name || "Project"}</span>
          </div>
          <div className="flex gap-2">
            <CallButton
              projectId={project._id}
              user={user}
              participants={project.users || []}
            />
            <button
              className="flex items-center gap-1 text-slate-100 hover:text-blue-300"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="ri-add-fill"></i>
              <span className="text-sm">Add</span>
            </button>
            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-1 text-slate-100 hover:text-blue-300"
            >
              <i className="ri-group-fill"></i>
            </button>
          </div>
        </header>

        <div className="conversation-area flex flex-col h-full w-full">
          {/* Fixed size container with flex layout */}
          <div className="pt-14 pb-16 flex flex-col h-full w-full">
            <div
              ref={messageBox}
              className="message-box p-2 flex-grow flex flex-col gap-2 overflow-y-auto"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex flex-col w-fit max-w-lg p-3 rounded-xl shadow-md transition-all duration-300 ${
                    msg.sender._id === user._id
                      ? "bg-blue-900 text-white ml-auto border border-blue-500 hover:shadow-md"
                      : "bg-gray-900 text-white border border-gray-700 hover:shadow-lg"
                  }`}
                >
                  <small className="text-xs font-medium opacity-90 flex items-center gap-1">
                    {msg.sender._id === "ai" ? (
                      <span className="text-blue-400 flex items-center gap-1">
                        🤖 <span className="font-bold text-blue-300">SOEN</span>
                      </span>
                    ) : (
                      <span className="text-blue-300 font-bold">
                        {msg.sender.email.split("@")[0]}
                      </span>
                    )}
                  </small>

                  {msg.sender._id === "ai" ? (
                    <p className="text-sm leading-relaxed mt-1">
                      {WriteAiMessage(msg.message)}
                    </p>
                  ) : (
                    <div className="text-sm leading-relaxed mt-1 p-3 rounded-lg shadow-sm bg-blue-400 text-white">
                      {msg.message}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="message flex flex-col p-3 bg-slate-300 w-fit rounded-lg shadow-sm animate-pulse">
                  <small className="text-xs text-slate-500">AI Assistant</small>
                  <div className="flex items-center gap-2">
                    <div className="robot-animation flex items-center">
                      <i className="ri-robot-fill text-blue-500 text-xl"></i>
                      <div className="typing-animation flex">
                        <span
                          className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></span>
                        <span
                          className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></span>
                        <span
                          className="dot bg-blue-500 mx-1 h-2 w-2 rounded-full animate-bounce"
                          style={{ animationDelay: "600ms" }}
                        ></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Fixed position input field always at bottom */}
          <div className="inputField w-full absolute bottom-0 border-t border-slate-300 bg-white shadow-md rounded-b-lg">
            <div className="flex w-full">
              <input
                value={message}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    send();
                  }
                }}
                className="p-4 px-4 border-none outline-none flex-grow text-slate-800 rounded-bl-lg"
                type="text"
                placeholder="Enter message"
              />
              <button
                onClick={send}
                className="px-5 bg-blue-500 hover:bg-blue-600 text-white rounded-br-lg"
              >
                <i className="ri-send-plane-fill"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Side panel for collaborators */}
        <div
          className={`sidePanel w-full h-full flex flex-col gap-2 bg-white absolute transition-all z-20 ${
            isSidePanelOpen ? "translate-x-0" : "-translate-x-full"
          } top-0 shadow-lg`}
        >
          <header className="flex justify-between items-center px-4 p-3 bg-slate-800 text-white">
            <h1 className="font-semibold text-lg">Collaborators</h1>

            <button
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="p-2 hover:text-slate-300"
            >
              <i className="ri-close-fill"></i>
            </button>
          </header>
          <div className="users flex flex-col gap-1 p-2">
            {project.users &&
              project.users.map((user, idx) => {
                return (
                  <div
                    key={idx}
                    className="user cursor-pointer hover:bg-slate-100 p-2 flex gap-2 items-center rounded"
                  >
                    <div className="aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
                      <i className="ri-user-fill absolute"></i>
                    </div>
                    <h1 className="font-semibold">{user.email}</h1>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* Right section with file explorer and editor */}
      <section className="right flex-grow h-full flex border-l border-slate-300">
        <div className="explorer h-full w-64 bg-slate-100 border-r border-slate-300 shadow-sm">
          <div className="file-explorer-header p-3 font-medium bg-slate-200 border-b border-slate-300">
            Files
          </div>
          <div className="file-tree w-full">
            {Object.keys(fileTree).map((file, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentFile(file);
                  setOpenFiles([...new Set([...openFiles, file])]);
                }}
                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 hover:bg-slate-200 w-full text-left"
              >
                <i className="ri-file-code-line text-slate-600"></i>
                <p className="font-medium">{file}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="code-editor flex flex-col flex-grow h-full shrink">
          <div className="top flex w-full bg-slate-200 border-b border-slate-300 shadow-sm">
            <div className="files flex overflow-x-auto">
              {openFiles.map((file, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFile(file)}
                  className={`open-file cursor-pointer p-2 px-4 flex items-center w-fit gap-2 border-r border-slate-300 ${
                    currentFile === file ? "bg-white text-blue-600" : ""
                  }`}
                >
                  <i className="ri-file-code-line"></i>
                  <p className="font-medium">{file}</p>
                  <span className="ml-2 text-slate-400 hover:text-slate-700">
                    ×
                  </span>
                </button>
              ))}
            </div>

            <div className="actions flex gap-2 ml-auto">
              <button
                onClick={copyToClipboard}
                className="p-2 px-4 bg-gray-600 hover:bg-gray-700 text-white my-1 rounded flex items-center"
                title="Copy code to clipboard"
              >
                <i className="ri-file-copy-line mr-1"></i>
                {copySuccess ? copySuccess : "Copy"}
              </button>

              <button
                onClick={openOnlineCompiler}
                className="p-2 px-4 bg-purple-600 hover:bg-purple-700 text-white my-1 rounded flex items-center"
                title="Open in online compiler"
              >
                <i className="ri-code-box-line mr-1"></i>
                Online Compiler
              </button>

              <button
                onClick={async () => {
                  await webContainer.mount(fileTree);

                  const installProcess = await webContainer.spawn("npm", [
                    "install",
                  ]);

                  installProcess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  if (runProcess) {
                    runProcess.kill();
                  }

                  let tempRunProcess = await webContainer.spawn("npm", [
                    "start",
                  ]);

                  tempRunProcess.output.pipeTo(
                    new WritableStream({
                      write(chunk) {
                        console.log(chunk);
                      },
                    })
                  );

                  setRunProcess(tempRunProcess);

                  webContainer.on("server-ready", (port, url) => {
                    console.log(port, url);
                    setIframeUrl(url);
                  });
                }}
                className="p-2 px-4 bg-green-600 hover:bg-green-700 text-white my-1 mr-2 rounded"
              >
                <i className="ri-play-fill mr-1"></i>
                Run Project
              </button>
            </div>
          </div>

          <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
            {fileTree[currentFile] && (
              <div className="code-editor-area h-full overflow-auto flex-grow bg-slate-50">
                <pre className="hljs h-full">
                  <code
                    className="hljs h-full outline-none p-4"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const updatedContent = e.target.innerText;
                      const ft = {
                        ...fileTree,
                        [currentFile]: {
                          file: {
                            contents: updatedContent,
                          },
                        },
                      };
                      setFileTree(ft);
                      saveFileTree(ft);
                    }}
                    dangerouslySetInnerHTML={{
                      __html: hljs.highlight(
                        "javascript",
                        fileTree[currentFile].file.contents
                      ).value,
                    }}
                    style={{
                      whiteSpace: "pre-wrap",
                      paddingBottom: "25rem",
                      counterSet: "line-numbering",
                      fontFamily: "monospace",
                    }}
                  />
                </pre>
              </div>
            )}
          </div>
        </div>

        {iframeUrl && webContainer && (
          <div className="flex min-w-96 flex-col h-full border-l border-slate-300 shadow-sm">
            <div className="address-bar p-2 bg-slate-200 border-b border-slate-300">
              <input
                type="text"
                onChange={(e) => setIframeUrl(e.target.value)}
                value={iframeUrl}
                className="w-full p-2 px-4 bg-white text-slate-800 rounded border border-slate-300"
              />
            </div>
            <div className="console-header flex justify-between items-center px-4 py-2 bg-slate-200 border-b border-slate-300 text-sm text-slate-700">
              <span>Console</span>
              <div className="flex gap-4">
                <span className="cursor-pointer hover:text-blue-600">
                  Console
                </span>
                <span className="cursor-pointer hover:text-blue-600">
                  What's new
                </span>
              </div>
            </div>
            <iframe src={iframeUrl} className="w-full h-full bg-white"></iframe>
          </div>
        )}
      </section>

      {/* Modal for adding collaborators */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96 max-w-full relative shadow-xl">
            <header className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
              <h2 className="text-xl font-semibold text-slate-800">
                Select User
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-500 hover:text-slate-800"
              >
                <i className="ri-close-fill"></i>
              </button>
            </header>
            <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
              {users.map((user, idx) => (
                <div
                  key={idx}
                  className={`user cursor-pointer hover:bg-slate-100 ${
                    Array.from(selectedUserId).indexOf(user._id) != -1
                      ? "bg-blue-50 border border-blue-200"
                      : ""
                  } p-2 flex gap-2 items-center rounded`}
                  onClick={() => handleUserClick(user._id)}
                >
                  <div className="aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-white bg-blue-500">
                    <i className="ri-user-fill absolute"></i>
                  </div>
                  <h1 className="font-semibold">{user.email}</h1>
                </div>
              ))}
            </div>
            <button
              onClick={addCollaborators}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
            >
              Add Collaborators
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce {
          animation: bounce 1s infinite;
        }
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .message-box::-webkit-scrollbar {
          display: none;
        }
        .message-box {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
};

export default Project;
