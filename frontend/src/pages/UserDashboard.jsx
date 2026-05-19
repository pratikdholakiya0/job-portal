import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../store/AuthContext";
import StatusMessage from "../component/StatusMessage";
import { Link, useNavigate } from "react-router-dom"; 
import { ArrowRight } from "lucide-react";


// --- Helper Functions ---
const getStatusColor = (status) => {
    switch (status) {
        case 'INTERVIEW_SCHEDULED': return 'bg-yellow-100 text-yellow-800';
        case 'UNDER_REVIEW': return 'bg-blue-100 text-blue-800';
        case 'APPLICATION_REJECTED': return 'bg-red-100 text-red-800';
        case 'HIRED': return 'bg-green-100 text-green-800';
        case 'SUBMITTED': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const formatStatusName = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const formatDate = (isoDate) => {
    if (!isoDate) return 'N/A';
    // Format date from ISO string (e.g., "2025-10-28T10:00:00") to "Oct 28, 2025"
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};


// --- Dashboard Component ---
const Dashboard = () => {
    // Renamed profile to userProfile for clarity, matching how it was referenced previously
    const { token, BASE_URL, resume, name } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isResumeReady, setIsResumeReady] = useState(false);

    const clearStatus = () => setStatus({ message: '', type: '' });

    // 1. Fetch Candidate Applications
    const fetchApplications = useCallback(async () => {
        // CRITICAL CHECK: If resume ID is missing, bypass API call entirely
        if (!resume) {
            console.log("Bypassing application fetch: Resume profile not yet created.");
            setApplications([]);
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/applications/my-applications?page=0&size=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const applicationsData = await response.json();
                setApplications(applicationsData.content || applicationsData || []); 
            } 
        } catch (error) {
                console.warn("No applications found or failed to fetch applications.");
                setApplications([]);
        }
    }, [token, BASE_URL, resume]); 


    // 3. Combined useEffect hook
    useEffect(() => {
        const profileIsSetup = !!resume; 
        setIsResumeReady(profileIsSetup);

        if (profileIsSetup) {
            Promise.all([
                fetchApplications(),
            ]).finally(() => {
                setLoading(false);
            });
        } else if (!profileIsSetup) {
             // User is logged in but profile/resume ID is missing (as per backend logic)
            setLoading(false);
            setApplications([]); // Ensure application list is empty
            setStatus({ 
                message: "Please complete your Resume Profile to view and submit job applications.", 
                type: 'warning' 
            });
        } else {
            setLoading(false);
            setStatus({ message: "Authentication token missing. Please log in.", type: 'error' });
        }
    }, [fetchApplications, resume]); 


    // --- Logic for Rendering ---
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <span>Loading dashboard data...</span>
                </div>
            </div>
          );
    }

    const applicantName = name || 'Applicant';
    const latestApplication = applications.length > 0 ? applications[0] : null;

    // --- Conditional Button Text ---
    const profileButtonText = isResumeReady ? 'View/Edit Profile' : 'Create Resume Profile';


    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-3 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-6xl mx-auto">
                
                <StatusMessage 
                    message={status.message} 
                    type={status.type} 
                    onClose={clearStatus} 
                />

                {/* --- HEADER: Welcome & Profile Status --- */}
                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600 mb-8">
                    <div className="flex justify-between items-start flex-wrap">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
                            Welcome Back, {applicantName}!
                        </h1>
                        <Link 
                            to="/user-profile" 
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 shadow-md ${
                                isResumeReady 
                                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                            }`}
                        >
                            {profileButtonText}
                        </Link>
                    </div>

                    {latestApplication && isResumeReady && (
                        <p className="mt-4 text-gray-600">
                            You currently have **{applications.length} active application(s)**. Your latest application ({latestApplication.jobTitle || 'N/A'}) status is: 
                            <span className={`font-semibold ${getStatusColor(latestApplication.status)} px-2 py-1 rounded-full text-xs ml-2`}>
                                {formatStatusName(latestApplication.status)}
                            </span>
                        </p>
                    )}

                    {/* --- View Open Jobs Button --- */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link
                            to="/jobs"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            <svg className="-ml-1 mr-3 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.25L10.75 3 3 10.75 13.25 21 21 13.25zM15 5h-2M10 18v-2M14 18v-2"></path></svg>
                            View Open Jobs & Apply Now
                        </Link>
                    </div>
                </div>

                {/* --- Applications and Resume Sections --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- 1. All Applications (2/3 width) --- */}
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                            My Job Applications
                        </h2>
                        {!isResumeReady ? (
                             <p className="text-gray-500 p-8 text-center border rounded-lg bg-gray-50">
                                Please **{profileButtonText}** first to view your application history.
                            </p>
                        ) : applications.length === 0 ? (
                            <p className="text-gray-500 italic">You haven't submitted any applications yet. <Link to="/jobs" className="text-indigo-600 hover:underline">View open positions.</Link></p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {applications.map((app) => (
                                                <tr key={app.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {app.jobTitle || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(app.applicationDate)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(app.status)}`}>
                                                            {formatStatusName(app.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <Link to={`my-applications/${app.id}`} className="text-indigo-600 hover:text-indigo-900">View</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* View All Applications Button */}
                                <div className="mt-6 flex justify-end">
                                    <button
                                        onClick={() => navigate('my-applications')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                    >
                                        View All Applications <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* --- 2. RESUME MANAGEMENT (Profile-Based) --- */}
                    <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-lg border h-fit">
                        <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            My App-Generated Resume
                        </h2>
                        
                        <div className="space-y-4">
                            {isResumeReady ? (
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-800">
                                    <p className="font-semibold">✅ Resume Ready!</p>
                                    <p className="text-sm">Your profile data is complete and is used as your digital resume for all applications.</p>
                                    <div className="mt-3">
                                        {/* Since it's app-generated, the "view/edit" link is the profile page */}
                                        <Link 
                                            to="/resume"
                                            className="text-xs font-medium text-white bg-indigo-500 px-3 py-2 rounded hover:bg-indigo-600 transition duration-150 inline-block"
                                        >
                                            View/Edit Resume Data
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                    <p className="font-semibold">⚠️ Resume Data Missing</p>
                                    <p className="text-sm">Please create your professional profile. This data serves as your primary resume.</p>
                                    
                                    {/* --- CREATE RESUME BUTTON --- */}
                                    <Link 
                                        to="/resume"
                                        className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 transition duration-150 ease-in-out"
                                    >
                                        Create Resume
                                    </Link>
                                    {/* --------------------------- */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;