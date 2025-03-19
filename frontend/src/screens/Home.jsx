import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'

const Home = () => {
    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState('')
    const [project, setProject] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    
    const navigate = useNavigate()
    
    function createProject(e) {
        e.preventDefault()
        console.log({ projectName })
        
        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                console.log(res)
                setIsModalOpen(false)
                navigate('/')
                window.location.reload();
            })
            .catch((error) => {
                console.log(error)
            })
    }
    
    useEffect(() => {
        axios.get('/projects/all').then((res) => {
            setProject(res.data.projects)
        }).catch(err => {
            console.log(err)
        })
    }, [])
    
    // Filter projects based on search term
    const filteredProjects = project.filter(proj => 
        proj.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return (
        <div className="min-h-screen bg-white relative">
            {/* Background Element */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#4F46E5" d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-1.5C87,13.3,81.4,26.6,73.6,38.6C65.8,50.6,55.9,61.3,43.7,67.8C31.4,74.2,15.7,76.5,0.1,76.3C-15.5,76.2,-31,73.8,-45,67.5C-59,61.3,-71.4,51.2,-79.3,38.6C-87.2,25.9,-90.5,13,-89.9,0.6C-89.3,-11.8,-84.8,-23.5,-77.9,-34.8C-71.1,-46,-61.8,-56.7,-50.1,-65.2C-38.4,-73.7,-24.4,-80,-9.6,-75.9C5.3,-71.9,30.5,-83.5,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="absolute bottom-0 left-0 w-1/2 h-full opacity-10">
                    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path fill="#2563EB" d="M39.9,-68.6C51.1,-62.9,59.5,-50.6,66.7,-37.8C73.9,-25,79.9,-12.5,79.6,-0.2C79.3,12.2,72.7,24.3,65.2,35.7C57.7,47,49.3,57.5,38.3,64.4C27.2,71.3,13.6,74.6,0.2,74.3C-13.2,74,-26.3,70.2,-38.3,63.5C-50.3,56.8,-61.1,47.3,-68.2,35.6C-75.3,23.9,-78.7,11.9,-78.3,0.2C-78,-11.5,-73.9,-23,-67.8,-34C-61.7,-45,-53.5,-55.4,-42.9,-61C-32.2,-66.6,-19.1,-67.3,-4.9,-69.5C9.3,-71.6,28.7,-74.3,39.9,-68.6Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="absolute top-1/4 left-1/4 opacity-20">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 38H100V82C100 91.9411 91.9411 100 82 100H38C28.0589 100 20 91.9411 20 82V38Z" stroke="#6366F1" strokeWidth="3"/>
                        <path d="M38 20H82C91.9411 20 100 28.0589 100 38H20V38C20 28.0589 28.0589 20 38 20Z" stroke="#6366F1" strokeWidth="3"/>
                        <circle cx="40" cy="30" r="5" fill="#6366F1"/>
                        <circle cx="60" cy="30" r="5" fill="#6366F1"/>
                        <circle cx="80" cy="30" r="5" fill="#6366F1"/>
                    </svg>
                </div>
                <div className="absolute bottom-1/4 right-1/4 opacity-20">
                    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="20" y="20" width="110" height="110" rx="10" stroke="#3B82F6" strokeWidth="3"/>
                        <line x1="20" y1="50" x2="130" y2="50" stroke="#3B82F6" strokeWidth="3"/>
                        <circle cx="35" cy="35" r="5" fill="#3B82F6"/>
                        <circle cx="55" cy="35" r="5" fill="#3B82F6"/>
                        <circle cx="75" cy="35" r="5" fill="#3B82F6"/>
                    </svg>
                </div>
            </div>

            {/* Header with Logo */}
            <header className="relative z-10 bg-white shadow-md">
                <div className="max-w-6xl mx-auto px-8 py-4">
                    <div className="flex items-center">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                SOEN
                            </h1>
                        </div>
                        
                        <div className="ml-auto flex items-center gap-4">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Search projects..." 
                                    className="px-4 py-2 rounded-lg bg-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="ri-search-line absolute right-3 top-2.5 text-slate-400"></i>
                            </div>
                            
                            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center cursor-pointer">
                                <i className="ri-notification-3-line text-slate-600"></i>
                            </div>
                            
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer">
                                <span className="text-blue-600 font-medium text-sm">
                                    {user?.name?.charAt(0) || 'U'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            {/* Main Content */}
            <main className="relative z-10 p-8">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">My Projects</h2>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <i className="ri-add-line"></i>
                            New Project
                        </button>
                    </div>
                    
                    {searchTerm && filteredProjects.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                                <i className="ri-search-line text-2xl text-slate-400"></i>
                            </div>
                            <h3 className="text-xl font-medium text-slate-700 mb-2">No projects found</h3>
                            <p className="text-slate-500">We couldn't find any projects matching "{searchTerm}"</p>
                        </div>
                    ) : (
                        <div className="projects grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredProjects.map((project) => (
                                <div 
                                    key={project._id}
                                    onClick={() => {
                                        navigate(`/project`, {
                                            state: { project }
                                        })
                                    }}
                                    className="h-48 flex flex-col p-6 bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-xl font-semibold text-slate-800">{project.name}</h2>
                                        <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center">
                                            <i className="ri-more-2-fill text-blue-500 text-sm"></i>
                                        </div>
                                    </div>
                                    
                                    <p className="text-slate-500 text-sm">Last updated 2 days ago</p>
                                    
                                    <div className="mt-auto">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <i className="ri-user-line"></i>
                                            <p className="text-sm">{project.users.length} Collaborator{project.users.length !== 1 ? 's' : ''}</p>
                                        </div>
                                        <div className="mt-4 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full" style={{ width: '60%' }}></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-slate-900 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Create New Project</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200"
                            >
                                <i className="ri-close-line"></i>
                            </button>
                        </div>
                        <form onSubmit={createProject}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    type="text" 
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                                    placeholder="Enter project name"
                                    required 
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button 
                                    type="button" 
                                    className="px-5 py-2 bg-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-300 transition-colors" 
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Home