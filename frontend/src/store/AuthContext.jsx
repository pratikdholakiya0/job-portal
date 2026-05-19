import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({
    // Provide a comprehensive default object to avoid errors in consuming components
    // before the provider loads.
    user: null,
    profile: null,
    resume: null,
    company: null,
    name: '',
    role: null,
    token: null,
    isAuthenticated: false,
    loading: true,
    BASE_URL: 'https://jobportalbackend-z91i.onrender.com/api/v1',
    setAuthToken: () => {},
    logout: () => {},
    login: async () => ({}),
    register: async () => ({}),
    refeshUserToken: async () => ({}),
});

const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [resume, setResume] = useState(null);
    const [profile, setProfile] = useState(null);
    const [company, setCompany] = useState(null);
    const [role, setRole] = useState(null);

    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const BASE_URL = 'https://jobportalbackend-z91i.onrender.com/api/v1';

    // 1. Made setAuthToken synchronous and handled removal
    const setAuthToken = (tokenValue) => {
        setToken(tokenValue);
        if (tokenValue) {
            localStorage.setItem('accessToken', tokenValue);
        } else {
            localStorage.removeItem('accessToken');
        }
    }

    const logout = () => {
        setUser(null);
        setToken(null);
        setResume(null);
        setProfile(null);
        setCompany(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
    };

    const fetchCurrentUser = async (authToken) => { 
        if(!authToken) {
            setLoading(false); // Stop loading if no token is provided
            return "Failed: No Token";
        }
        
        // Removed alert and console.log for cleaner production code
        try {
            const resp = await fetch(`${BASE_URL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (resp.ok) {
                const userData = await resp.json();
                                            
                setUser(userData.userId)
                setProfile(userData.profileId)
                setCompany(userData.companyId)
                setResume(userData.resumeId)
                setName(userData.name);
                setRole(userData.role)
                
                setIsAuthenticated(true);
                return "Success";
            } else {
                logout(); 
                return "Failed: API Error";
            }
        } catch (error) {
            console.error("Fetch current user failed:", error);
            logout();
            return "Failed: Network Error";
        } finally {
            // 3. setLoading(false) only runs once the API call finishes.
            setLoading(false); 
        }
    };

    const register = async (user) =>{
        const resp = await fetch(`${BASE_URL}/auth/register`, {
            // ... (register logic remains the same)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password, role: user.role })
        });

        if (!resp.ok) {
            const errorData = await resp.json();
            throw new Error(errorData.message || 'Registration failed due to network error.'); 
        }
        return await resp.json();
    };


    const login = async (user) =>{
        const resp = await fetch(`${BASE_URL}/auth/login`, {
            // ... (login logic remains the same)
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: user.email, password: user.password })
        });

        if (!resp.ok) {
            const errorData = await resp.json();
            alert(errorData.message)
            throw new Error(errorData.message || 'Login failed due to network error.'); 
        }

        const data = await resp.json();
        setAuthToken(data.token); // setAuthToken is now sync
        
        // IMPORTANT: Fetch user data after login to immediately populate state
        await fetchCurrentUser(data.token); 
        
        return data;
    }
    
    const refeshUserToken = async () => {
        const resp = await fetch(`${BASE_URL}/auth/refresh-token`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!resp.ok) {
            throw new Error('Token refresh failed');
        }
        const data = await resp.json();
        setAuthToken(data.token);
        setIsAuthenticated(true);

        return data;
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('accessToken');

        if (storedToken) {
            setToken(storedToken); 
            fetchCurrentUser(storedToken); 
        } else {
            setIsAuthenticated(false);
            setLoading(false); 
        }
    }, []); 

    const value = {
        BASE_URL, 
        user,
        profile,
        resume,
        company,
        name,
        role,
        token,
        isAuthenticated,
        loading, // Exposed loading state is KEY for consumers
        setAuthToken,
        refeshUserToken,
        login,
        register,
        logout,
        setUser,
        setProfile,
        setResume,
        setCompany,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
