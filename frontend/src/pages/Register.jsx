import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/AuthContext";

export const Register = ({ setMode }) => {

    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('APPLICANT'); 

    const {register, isAuthenticated, token} = useAuth();

    const handleAuth = async (e) => {
        e.preventDefault();
        
        try{
            const resp = await register({email, password, role});

            alert(resp.message);
            navigate("/login")
        }catch(err){
            alert("registration failed : " +err.message);
        }
    };

    useEffect(()=>{
        if(isAuthenticated){
            console.log(isAuthenticated, token);
            
            navigate("/profile")
        }
    })

    return (
        <div className="w-screen h-screen flex justify-center items-center">                
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border-t-4 border-indigo-600">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">{`Register as ${role.toLowerCase()}`}</h2>
                
                <form className="space-y-6" onSubmit={handleAuth}>
                    <div>
                        <label htmlFor="role" className="block text-gray-700 font-medium mb-2">Select Your Role</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl appearance-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                            required
                        >
                            <option value="APPLICANT">APPLICANT (Looking for a job)</option>
                            <option value="EMPLOYER">Employer (Posting jobs)</option>
                        </select>
                    </div>

                    {/* 2. EMAIL ADDRESS */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
                        <input 
                            id="email"
                            type="email" 
                            placeholder="you@jobstream.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                            required
                        />
                    </div>

                    {/* 3. PASSWORD */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Create Password</label>
                        <input 
                            id="password"
                            type="password" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 transition duration-200 shadow-sm"
                            required
                        />
                    </div>
                    
                    <button 
                        type="submit"
                        onClick={handleAuth}
                        className="w-full mt-6 p-4 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01]"
                    >
                        {"Sign Up"}
                    </button>
                </form>

                <div className="mt-8 text-center text-base space-y-2">
                    <button 
                        onClick={() => navigate("/login")}
                        className="block w-full text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
                    >
                        {"Already have an account? Sign In"}
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