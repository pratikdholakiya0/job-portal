import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../store/AuthContext";
import StatusMessage from "../component/StatusMessage";
import { Link, useNavigate } from "react-router-dom"; 
import { ArrowRight, Briefcase, Building2, Users } from "lucide-react"; // Imported icons

// --- Helper Functions (Reused for consistent formatting) ---
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
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// --- Employer Dashboard Component ---
const EmployerDashboard = () => {
    const { token, profile: userProfile, company, BASE_URL } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    
    // Derived state: Profile exists if `company` object is present in auth context
    const isCompanyReady = !!company;

    const clearStatus = () => setStatus({ message: '', type: '' });

    // 1. Fetch Applications relevant to this Employer's jobs
    const fetchApplications = useCallback(async () => {
        // CRITICAL CHECK: If company ID is missing, bypass API call
        if (!company) {
            console.log("Bypassing application fetch: Company profile not yet created.");
            setApplications([]);
            return;
        }

        try {
            // Assuming this endpoint fetches applications tied to the logged-in Employer's company
            const response = await fetch(`${BASE_URL}/applications/by-employer`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const applicationsData = await response.json();
                // Filter for 'SUBMITTED' applications for the "New Applicants" count/list
                const submittedApps = (applicationsData || []).filter(app => app.status === 'SUBMITTED');
                setApplications(submittedApps); 
            } 
        } catch (error) {
            console.warn("Failed to fetch employer applications.");
            setApplications([]);
        }
    }, [token, BASE_URL, company]); 

    // 2. Initial Data Load
    useEffect(() => {
        setLoading(true);
        if (isCompanyReady) {
            fetchApplications()
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // User is logged in but company profile is missing
            setLoading(false);
            setStatus({ 
                message: "Please complete your Company Profile to start posting jobs and viewing applicants.", 
                type: 'warning' 
            });
        }
    }, [fetchApplications, isCompanyReady]); 


    // --- Logic for Rendering ---
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <span>Loading employer dashboard...</span>
                </div>
            </div>
        );
    }

    const employerName = userProfile?.firstName || 'Employer';
    const totalNewApplicants = applications.length;


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
                            Welcome, {employerName} (Employer)!
                        </h1>
                        <Link 
                            to="/user-profile" 
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 shadow-md ${
                                isCompanyReady 
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                            }`}
                        >
                            {isCompanyReady ? 'View/Edit profile' : 'Create Profile'}
                        </Link>
                    </div>

                    {isCompanyReady && (
                        <p className="mt-4 text-gray-600">
                            Your dashboard shows **{totalNewApplicants} new application{totalNewApplicants !== 1 ? 's' : ''}** requiring review.
                        </p>
                    )}

                    {/* --- View Job Listings Button --- */}
                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <Link
                            to="/employer/jobs"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                        >
                            <Briefcase className="-ml-1 mr-3 h-5 w-5" />
                            View/Manage Job Listings
                        </Link>
                    </div>
                </div>

                {/* --- EMPLOYER CARDS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- 1. Quick Stats/New Applicants (2/3 width) --- */}
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl shadow-lg border">
                        <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center">
                            <Users className="w-6 h-6 mr-2" />
                            New Applicants ({totalNewApplicants})
                        </h2>
                        
                        {!isCompanyReady ? (
                             <p className="text-gray-500 p-8 text-center border rounded-lg bg-gray-50">
                                Please **Create Company Profile** first to receive and view applications.
                            </p>
                        ) : totalNewApplicants === 0 ? (
                            <p className="text-gray-500 italic">No new applications submitted for your active jobs.</p>
                        ) : (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate & Job</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
                                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {applications.slice(0, 5).map((app) => ( // Show only top 5 recent apps
                                                <tr key={app.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        <span className="font-semibold">{app.candidateName || 'Candidate N/A'}</span>
                                                        <p className="text-xs text-gray-500">{app.jobTitle || 'Job N/A'}</p>
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
                                                        <Link to={`/employer/applications/${app.id}`} className="text-indigo-600 hover:text-indigo-900">Review</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* View All Applications Button */}
                                {totalNewApplicants > 0 && (
                                    <div className="mt-6 flex justify-end">
                                        <button
                                            onClick={() => navigate('/employer/applications')}
                                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                        >
                                            View All Applicants <ArrowRight className="w-4 h-4 ml-2" />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* --- 2. COMPANY PROFILE LINK (1/3 width) --- */}
                    <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-lg border h-fit">
                        <h2 className="text-xl font-bold text-indigo-600 mb-6 flex items-center">
                            <Building2 className="w-6 h-6 mr-2" />
                            Company Management
                        </h2>
                        
                        <div className="space-y-4">
                            {isCompanyReady ? (
                                <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-800">
                                    <p className="font-semibold">✅ Profile Complete</p>
                                    <p className="text-sm">Your company profile is published and ready to attract talent.</p>
                                    <div className="mt-3">
                                        <Link 
                                            to="/employer/company-profile"
                                            className="text-xs font-medium text-white bg-indigo-500 px-3 py-2 rounded hover:bg-indigo-600 transition duration-150 inline-block"
                                        >
                                            View/Edit Company Details
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                                    <p className="font-semibold">⚠️ Profile Required</p>
                                    <p className="text-sm">You must complete your company profile before posting any jobs.</p>
                                    
                                    <Link 
                                        to="/employer/company-profile"
                                        className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-500 hover:bg-yellow-600 transition duration-150 ease-in-out"
                                    >
                                        Create Company Profile
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployerDashboard;