import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { UserContext } from '../context/user.context';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [appear, setAppear] = useState(false);

    const { setUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Animation trigger
        setAppear(true);
    }, []);

    function submitHandler(e) {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        axios.post('/users/login', {
            email,
            password
        }).then((res) => {
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user);
            navigate('/');
        }).catch((err) => {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
            console.log(err.response?.data);
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 to-gray-700 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-64 h-64 rounded-full bg-blue-500 opacity-10 -top-10 -left-16 animate-pulse"></div>
                <div className="absolute w-96 h-96 rounded-full bg-blue-600 opacity-10 bottom-0 right-0 animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute w-48 h-48 rounded-full bg-blue-400 opacity-10 bottom-32 left-16 animate-pulse" style={{animationDelay: '2s'}}></div>
            </div>
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 bg-opacity-10 bg-black" 
                 style={{
                     backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                 }}
            ></div>
            
            <div 
                className={`bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10 border border-gray-700 transform transition-all duration-700 ${
                    appear ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
            >
                {/* Logo and header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-blue-600 p-4 rounded-full shadow-lg mb-4 transform transition-transform hover:scale-105 duration-200">
                        <svg className="w-16 h-16 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 4L3 9L12 14L21 9L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M3 14L12 19L21 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-wider">SOEN</h1>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>
                
                {/* Error message */}
                {error && (
                    <div className="bg-red-900 bg-opacity-50 text-red-200 px-4 py-2 rounded mb-4 text-sm animate-bounce">
                        {error}
                    </div>
                )}
                
                <form onSubmit={submitHandler}>
                    <div className="mb-4 transform transition-all duration-500 delay-100" style={{ opacity: appear ? 1 : 0, transform: appear ? 'translateY(0)' : 'translateY(20px)' }}>
                        <label className="block text-gray-300 mb-2 font-medium" htmlFor="email">Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                            </div>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                type="email"
                                id="email"
                                className="w-full pl-10 p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200 hover:border-gray-500"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>
                    <div className="mb-6 transform transition-all duration-500 delay-200" style={{ opacity: appear ? 1 : 0, transform: appear ? 'translateY(0)' : 'translateY(20px)' }}>
                        <label className="block text-gray-300 mb-2 font-medium" htmlFor="password">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="password"
                                className="w-full pl-10 p-3 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 transition-all duration-200 hover:border-gray-500"
                                placeholder="Enter your password"
                                required
                            />
                        </div>
                        <div className="flex justify-end mt-2">
                            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                                Forgot password?
                            </Link>
                        </div>
                    </div>
                    <div className="transform transition-all duration-500 delay-300" style={{ opacity: appear ? 1 : 0, transform: appear ? 'translateY(0)' : 'translateY(20px)' }}>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full p-3 rounded font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 transform hover:scale-105 ${
                                loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-500'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </div>
                </form>
                
                <div className="mt-6 border-t border-gray-700 pt-6 text-center transform transition-all duration-500 delay-400" style={{ opacity: appear ? 1 : 0 }}>
                    <p className="text-gray-400">
                        Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;