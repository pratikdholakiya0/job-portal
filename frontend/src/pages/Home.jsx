import {useState, React, useEffect} from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../store/AuthContext';
import Header from '../component/Header';

const Calendar = () => {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
    )
};
const Zap = () => {
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        </svg>
    );
}
const MessageSquare = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-500">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
    );
}

const Home = () => {
    const navigate = useNavigate();
    const {isAuthenticated, role} = useAuth()
    
    const NewsletterSignup = () => {
        const [email, setEmail] = useState('');
        const [status, setStatus] = useState(null);

        const handleSubmit = (e) => {
            e.preventDefault();
            setStatus('subscribing');

            // Mock API call simulation
            setTimeout(() => {
                if (email.includes('@') && email.includes('.')) {
                    setStatus('success');
                    setEmail('');
                } else {
                    setStatus('error');
                }
                // Clear status after 5 seconds
                setTimeout(() => setStatus(null), 5000); 
            }, 1500);
        };

        return (
            <div className="bg-gray-100 py-16 w-full mx-auto">
                <div className="max-w-6xl mx-auto px-6 text-gray-800 text-center">
                    <h3 className="text-3xl font-extrabold mb-3">Stay Updated with JobStream</h3>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto max-w-md:text-lg">
                        Subscribe to our newsletter for instant job alerts, hiring tips, and industry insights.
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row">
                        <input
                            type="email"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-grow p-4 text-gray-800 border border-white focus:outline-none focus:ring-4 focus:ring-indigo-300 transition duration-300 shadow-md"
                        />
                        <button
                            type="submit"
                            disabled={status === 'subscribing'}
                            className="px-8 py-4 bg-yellow-400 text-indigo-900 font-bold shadow-lg hover:bg-yellow-300 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {status === 'subscribing' ? 'Subscribing...' : 'Subscribe Now'}
                        </button>
                    </form>

                    {status === 'success' && (
                        <p className="mt-4 text-green-700 font-semibold">
                            Success! You are now subscribed and will receive the latest updates.
                        </p>
                    )}
                    {status === 'error' && (
                        <p className="mt-4 text-red-300 font-semibold">
                            Please enter a valid email address to subscribe.
                        </p>
                    )}
                </div>
            </div>
        );
    };    

    const FeaturesSection = () => (
        <div id="features" className="bg-gray-50 py-16 w-full -mx-auto">
            <div className="max-w-6xl mx-auto px-6">
                <h3 className="text-4xl font-bold text-gray-800 text-center mb-12">The Next Generation of Hiring</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    
                    {/* Feature 1: Real-Time Communication (Candidate/Employer Benefit) */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-indigo-500 transform hover:scale-105 transition duration-300">
                        <MessageSquare />
                        <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Direct Real-Time Chat</h4>
                        <p className="text-gray-600">Instantly connect with candidates or employers. Eliminate email delays and drive the **shortlisting, interview, and offer process** faster.</p>
                    </div>

                    {/* Feature 2: Rapid Application/Hiring Speed */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-yellow-500 transform hover:scale-105 transition duration-300">
                        <Zap />
                        <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Instant Updates & Status</h4>
                        <p className="text-gray-600">Get immediate, accurate updates on your application status (Applied, Shortlisted, Hired). **Zero confusion** about where you stand.</p>
                    </div>

                    {/* Feature 3: Simplified Workflow/Management */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-green-500 transform hover:scale-105 transition duration-300">
                        <Calendar />
                        <h4 className="text-xl font-semibold text-gray-900 mt-4 mb-2">Structured Hiring Workflow</h4>
                        <p className="text-gray-600">For employers, manage all candidate communication, status changes, and history from a **single, secure dashboard**.</p>
                    </div>
                </div>
            </div>
        </div>
    );

    const Footer = () => (
        <footer id="about-us" className="bg-gray-800 text-white py-8 w-full">
            <div className="max-w-6xl mx-auto px-6 text-center">
                <p className="text-lg font-semibold mb-2">Job Portal Solutions</p>
                <p className="text-sm text-gray-400">© 2025 All rights reserved. | Contact: support@jobportal.com</p>
                <div className="mt-4 space-x-4 text-sm">
                    <a href="#" className="hover:text-indigo-400 transition duration-150">Privacy Policy</a>
                    <a href="#" className="hover:text-indigo-400 transition duration-150">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
    
    const HeroSection = () => (
        <div className="flex justify-center w-full bg-white pt-32 pb-16 -mx-auto">
            <div className="text-center max-w-4xl px-6">
                <hgroup>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight leading-tight">
                        Secure Your Next Opportunity.
                    </h2>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-indigo-600 mb-6 tracking-tight leading-tight">
                        Instantly.
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        The streamlined platform built for real-time collaboration between candidates and employers.
                    </p>
                </hgroup>
                
                <div className="flex justify-center space-x-4 sm:space-x-6 flex-wrap gap-4">
                    {isAuthenticated ? (
                        role==='EMPLOYER' ? (
                            <button 
                                onClick={() => navigate(`/employer/dashboard`)}
                                className="px-8 sm:px-10 py-2 bg-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
                            >
                                Go to Dashboard
                            </button>
                        ) : (
                            <button 
                                onClick={() => navigate(`/applicant/dashboard`)}
                                className="px-8 sm:px-10 py-2 bg-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
                            >
                                Go to Dashboard
                            </button>
                        )
                    ) : (
                        <>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="px-8 sm:px-10 py-3 bg-indigo-600 text-white text-lg sm:text-xl font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Start Now — Log In
                        </button>
                         <button 
                            onClick={() => navigate('/register')} 
                            className="px-8 sm:px-10 py-3 border-2 border-indigo-600 text-indigo-600 text-lg sm:text-xl font-semibold rounded-xl hover:bg-indigo-50 transition duration-300 transform hover:scale-105 w-full sm:w-auto"
                        >
                            Create Free Account
                        </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="w-full">
            <Header />
            <HeroSection />
            <FeaturesSection />
            <NewsletterSignup/>
            <Footer />
        </div>
    );
};

export default Home;