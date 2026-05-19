import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../store/AuthContext';

const Login = () => {
    
    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        
        try {
            await login({
                email: email,
                password: password
            });

            navigate("/profile");

        } catch (error) {
            console.error("Login Error:", error.message);
            
            alert(`Login failed: ${error.message}`); 
        }
    };

    useEffect(()=>{        
        if(isAuthenticated){
            navigate("/")
        }
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-8">
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-4 border-indigo-600">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{"Sign In to JobStream"}</h2>
                
                <form className="space-y-6">
                    <div>
                        <label className="block text-gray-700 text-start font-medium mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                            placeholder="you@jobstream.com"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-start font-medium mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e)=> setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        onClick={handleAuth}
                        className="w-full mt-6 p-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01]"
                    >
                        {"Log In"}
                    </button>
                </form>

                <div className="mt-8 text-center text-base space-y-2">
                    <button 
                        onClick={() => navigate("/register")}
                        className="block w-full text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
                    >
                        {"Need an account? Register Now"}
                    </button>
                    <button 
                        onClick={() => navigate("/")}
                        className="block w-full text-gray-500 hover:text-gray-700 font-medium transition duration-150 mt-4"
                    >
                        &larr; Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
