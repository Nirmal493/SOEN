import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../context/user.context'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webcontainer'


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set()) // Initialized as Set
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user } = useContext(UserContext)
    const messageBox = React.createRef()

    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([]) // New state variable for messages
    const [fileTree, setFileTree] = useState({})

    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])

    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)

    const [runProcess, setRunProcess] = useState(null)

    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
    }


    function addCollaborators() {
        axios.put("/projects/add-user", {
            projectId: location.state.project._id,
            users: Array.from(selectedUserId)
        }).then(res => {
            console.log(res.data)
            setIsModalOpen(false)

        }).catch(err => {
            console.log(err)
        })
    }

    const send = () => {
        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }]) // Update messages state
        setMessage("")
    }

    function WriteAiMessage(message) {
        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-slate-800 text-white rounded-md p-3 shadow-md'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

    useEffect(() => {
        initializeSocket(project._id)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }

        receiveMessage('project-message', data => {
            console.log(data)
            
            if (data.sender._id == 'ai') {
                const message = JSON.parse(data.message)    
                console.log(message)

                webContainer?.mount(message.fileTree)

                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [...prevMessages, data]) // Update messages state
            } else {
                setMessages(prevMessages => [...prevMessages, data]) // Update messages state
            }
        })

        axios.get(`/projects/get-project/${location.state.project._id}`).then(res => {
            console.log(res.data.project)
            setProject(res.data.project)
            setFileTree(res.data.project.fileTree || {})
        })

        axios.get('/users/all').then(res => {
            setUsers(res.data.users)
        }).catch(err => {
            console.log(err)
        })
    }, [])

    function saveFileTree(ft) {
        axios.put('/projects/update-file-tree', {
            projectId: project._id,
            fileTree: ft
        }).then(res => {
            console.log(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    return (
        <main className='h-screen w-screen flex overflow-hidden bg-gray-50'>
            {/* Chat Panel */}
            <section className="left relative flex flex-col h-screen min-w-96 bg-white shadow-md">
                <header className='flex justify-between items-center p-3 px-4 w-full bg-indigo-600 text-white absolute z-10 top-0'>
                    <button className='flex gap-2 items-center hover:bg-indigo-700 py-1 px-3 rounded-md transition-colors duration-200' onClick={() => setIsModalOpen(true)}>
                        <i className="ri-add-fill text-lg"></i>
                        <p className="font-medium">Add collaborator</p>
                    </button>
                    <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 hover:bg-indigo-700 rounded-full transition-colors duration-200'>
                        <i className="ri-group-fill text-lg"></i>
                    </button>
                </header>
                <div className="conversation-area pt-16 pb-14 flex-grow flex flex-col h-full relative">
                    <div
                        ref={messageBox}
                        className="message-box p-3 flex-grow flex flex-col gap-3 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div key={index} className={`${msg.sender._id === 'ai' ? 'max-w-3/4' : 'max-w-2/3'} ${msg.sender._id == user._id.toString() ? 'ml-auto bg-indigo-100' : 'bg-white border border-gray-200'} message flex flex-col p-3 w-fit rounded-lg shadow-sm transition-all duration-200 hover:shadow-md`}>
                                <small className='text-xs text-gray-500 mb-1'>{msg.sender.email}</small>
                                <div className={`text-sm ${msg.sender._id === user._id.toString() ? 'text-indigo-900' : 'text-gray-800'}`}>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p className="leading-relaxed">{msg.message}</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="inputField w-full flex absolute bottom-0 p-3 bg-white border-t border-gray-200">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && send()}
                            className='p-3 px-4 border border-gray-300 rounded-l-lg outline-none flex-grow focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200' 
                            type="text" 
                            placeholder='Enter message' />
                        <button
                            onClick={send}
                            className='px-5 bg-indigo-600 text-white rounded-r-lg hover:bg-indigo-700 transition-colors duration-200'>
                            <i className="ri-send-plane-fill"></i>
                        </button>
                    </div>
                </div>
                
                {/* Collaborators Side Panel */}
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-white absolute transition-all duration-300 shadow-lg z-20 ${isSidePanelOpen ? 'translate-x-0' : '-translate-x-full'} top-0`}>
                    <header className='flex justify-between items-center px-4 p-3 bg-indigo-600 text-white'>
                        <h1 className='font-semibold text-lg'>Collaborators</h1>
                        <button onClick={() => setIsSidePanelOpen(!isSidePanelOpen)} className='p-2 hover:bg-indigo-700 rounded-full transition-colors duration-200'>
                            <i className="ri-close-fill text-lg"></i>
                        </button>
                    </header>
                    <div className="users flex flex-col gap-1 p-2 overflow-auto">
                        {project.users && project.users.map((user, idx) => (
                            <div key={idx} className="user cursor-pointer hover:bg-gray-100 rounded-lg p-3 flex gap-3 items-center transition-colors duration-200">
                                <div className='aspect-square rounded-full w-10 h-10 flex items-center justify-center text-white bg-indigo-500 shadow-sm'>
                                    <i className="ri-user-fill"></i>
                                </div>
                                <h1 className='font-medium text-gray-800'>{user.email}</h1>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Code Editor Section */}
            <section className="right bg-white flex-grow h-full flex shadow-inner">
                {/* File Explorer */}
                <div className="explorer h-full max-w-64 min-w-52 bg-gray-800 text-white">
                    <div className="file-header p-3 bg-gray-900 border-b border-gray-700">
                        <h2 className="font-semibold text-lg">Files</h2>
                    </div>
                    <div className="file-tree w-full">
                        {Object.keys(fileTree).map((file, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    setCurrentFile(file)
                                    setOpenFiles([...new Set([...openFiles, file])])
                                }}
                                className="tree-element cursor-pointer p-2 px-4 flex items-center gap-2 hover:bg-gray-700 w-full transition-colors duration-200">
                                <i className="ri-file-code-line text-indigo-300"></i>
                                <p className='text-sm'>{file}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Code Editor */}
                <div className="code-editor flex flex-col flex-grow h-full">
                    <div className="top flex justify-between w-full bg-gray-100 border-b border-gray-200">
                        <div className="files flex overflow-x-auto">
                            {openFiles.map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentFile(file)}
                                    className={`open-file cursor-pointer p-2 px-4 flex items-center gap-2 border-r border-gray-200 ${currentFile === file ? 'bg-white text-indigo-600 border-b-2 border-b-indigo-600' : 'hover:bg-gray-50'}`}>
                                    <i className="ri-file-code-line"></i>
                                    <p className='text-sm font-medium'>{file}</p>
                                    {currentFile === file && (
                                        <i className="ri-close-line ml-2 text-xs hover:text-red-500" 
                                           onClick={(e) => {
                                               e.stopPropagation();
                                               setOpenFiles(openFiles.filter(f => f !== file));
                                               if (currentFile === file) {
                                                   setCurrentFile(openFiles.length > 1 ? openFiles.filter(f => f !== file)[0] : null);
                                               }
                                           }}></i>
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="actions flex gap-2 p-2">
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree)
                                    const installProcess = await webContainer.spawn("npm", ["install"])

                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    if (runProcess) {
                                        runProcess.kill()
                                    }

                                    let tempRunProcess = await webContainer.spawn("npm", ["start"]);

                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    setRunProcess(tempRunProcess)

                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                    })
                                }}
                                className='p-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center gap-2'
                            >
                                <i className="ri-play-fill"></i>
                                Run
                            </button>
                        </div>
                    </div>
                    
                    <div className="bottom flex flex-grow max-w-full overflow-hidden">
                        {fileTree[currentFile] && (
                            <div className="code-editor-area h-full overflow-auto flex-grow bg-gray-50 relative">
                                <div className="line-numbers absolute left-0 top-0 bottom-0 p-3 pr-2 text-right bg-gray-800 text-gray-400 select-none" style={{width: '3rem'}}>
                                    {fileTree[currentFile].file.contents.split('\n').map((_, idx) => (
                                        <div key={idx} className="text-xs">{idx + 1}</div>
                                    ))}
                                </div>
                                <pre className="hljs h-full pl-14" style={{tabSize: 2}}>
                                    <code
                                        className="hljs h-full outline-none p-3"
                                        contentEditable
                                        suppressContentEditableWarning
                                        onBlur={(e) => {
                                            const updatedContent = e.target.innerText;
                                            const ft = {
                                                ...fileTree,
                                                [currentFile]: {
                                                    file: {
                                                        contents: updatedContent
                                                    }
                                                }
                                            }
                                            setFileTree(ft)
                                            saveFileTree(ft)
                                        }}
                                        dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            paddingBottom: '25rem',
                                            counterSet: 'line-numbering',
                                            fontFamily: 'monospace',
                                        }}
                                    />
                                </pre>
                            </div>
                        )}
                        
                        {!currentFile && (
                            <div className="empty-state flex-grow flex items-center justify-center flex-col p-8 text-gray-500">
                                <i className="ri-file-code-line text-6xl mb-4"></i>
                                <h3 className="text-xl font-medium mb-2">No file selected</h3>
                                <p>Select a file from the explorer to start editing</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Preview iframe */}
                {iframeUrl && webContainer && (
                    <div className="flex min-w-96 flex-col h-full border-l border-gray-200">
                        <div className="address-bar bg-gray-100 border-b border-gray-200 p-2">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 flex space-x-1 mx-2">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <input 
                                    type="text"
                                    onChange={(e) => setIframeUrl(e.target.value)}
                                    value={iframeUrl} 
                                    className="w-full p-2 px-4 bg-white border border-gray-300 rounded-md text-sm" 
                                />
                                <button className="ml-2 p-2 text-gray-600 hover:text-gray-800">
                                    <i className="ri-refresh-line"></i>
                                </button>
                            </div>
                        </div>
                        <iframe src={iframeUrl} className="w-full h-full border-none"></iframe>
                    </div>
                )}
            </section>

            {/* Collaborator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-full relative shadow-xl">
                        <header className='flex justify-between items-center mb-4 pb-2 border-b border-gray-200'>
                            <h2 className='text-xl font-semibold text-gray-800'>Add Collaborators</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200'>
                                <i className="ri-close-fill text-gray-500 text-xl"></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-16 max-h-96 overflow-auto">
                            {users.map((user, idx) => (
                                <div 
                                    key={idx} 
                                    className={`user cursor-pointer rounded-lg border ${Array.from(selectedUserId).indexOf(user._id) !== -1 ? 'bg-indigo-50 border-indigo-200' : 'hover:bg-gray-50 border-gray-200'} p-3 flex gap-3 items-center transition-all duration-200`} 
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    <div className={`aspect-square relative rounded-full w-10 h-10 flex items-center justify-center text-white ${Array.from(selectedUserId).indexOf(user._id) !== -1 ? 'bg-indigo-500' : 'bg-gray-500'}`}>
                                        <i className="ri-user-fill"></i>
                                        {Array.from(selectedUserId).indexOf(user._id) !== -1 && (
                                            <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4 border-2 border-white flex items-center justify-center">
                                                <i className="ri-check-line text-xs"></i>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className='font-medium text-gray-800'>{user.email}</h1>
                                        <p className="text-xs text-gray-500">User ID: {user._id.substring(0, 8)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 rounded-b-lg flex justify-between items-center">
                            <span className="text-sm text-gray-500">
                                {Array.from(selectedUserId).length} user{Array.from(selectedUserId).length !== 1 ? 's' : ''} selected
                            </span>
                            <button
                                onClick={addCollaborators}
                                disabled={Array.from(selectedUserId).length === 0}
                                className={`px-4 py-2 ${Array.from(selectedUserId).length > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-300 cursor-not-allowed'} text-white rounded-md transition-colors duration-200`}>
                                Add Collaborators
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Project