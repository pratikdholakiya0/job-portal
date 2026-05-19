import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import StatusMessage from '../component/StatusMessage';
import { ArrowLeft, Clock, Briefcase, UserCheck, Shield, Zap, XCircle, FileText, MapPin, DollarSign, Calendar, TrendingUp, Users } from 'lucide-react';

// --- Helper Functions (Re-defined for self-containment) ---
const getStatusIcon = (status) => {
    switch (status) {
        case 'INTERVIEW_SCHEDULED': return <UserCheck className="w-5 h-5 text-yellow-600" />;
        case 'UNDER_REVIEW': return <Shield className="w-5 h-5 text-blue-600" />;
        case 'APPLICATION_REJECTED': return <XCircle className="w-5 h-5 text-red-600" />;
        case 'HIRED': return <Zap className="w-5 h-5 text-green-600" />;
        case 'APPLIED': 
        case 'SUBMITTED': 
        default: return <Briefcase className="w-5 h-5 text-indigo-600" />;
    }
};

const formatStatusName = (status) => {
    if (!status) return 'Unknown';
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
};

const formatTimestamp = (isoDate) => {
    if (!isoDate) return 'N/A';
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const formatDateOnly = (isoDate) => {
    if (!isoDate) return 'N/A';
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};


// --- Application Detail Component ---
const ApplicationDetail = () => {
    const { applicationId } = useParams();
    const navigate = useNavigate();
    const { token, BASE_URL } = useAuth();

    const [history, setHistory] = useState([]);
    const [applicationDetails, setApplicationDetails] = useState(null);
    // NEW STATE for Job Details
    const [jobDetails, setJobDetails] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });

    const clearStatus = () => setStatus({ message: '', type: '' });

    // 1. Fetch Application Details (returns Application entity)
    const fetchApplicationDetails = useCallback(async () => {
        if (!token) return;
        try {
            // Endpoint: /api/v1/applications/getById/{id}
            const response = await fetch(`${BASE_URL}/applications/getById/${applicationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setApplicationDetails(data);
                // Return the data, specifically the jobId, for the next fetch
                return data; 
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to parse application details." }));
                throw new Error(errorData.message || "Failed to fetch application details.");
            }
        } catch (error) {
            console.error("Fetch application details error:", error);
            throw error;
        }
    }, [token, applicationId, BASE_URL]);

    // 2. NEW: Fetch Job Details
    const fetchJobDetails = useCallback(async (jobId) => {
        if (!token || !jobId) return;
        try {
            // Assuming Job Posting endpoint is /api/v1/jobs/getById/{jobId}
            const response = await fetch(`${BASE_URL}/jobs/getById/${jobId}`, { 
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setJobDetails(data);
            } else {
                // Not throwing an error here, just logging, as the app detail is still useful
                console.warn(`Job details for ID ${jobId} not found or accessible.`);
                setJobDetails(null);
            }
        } catch (error) {
            console.error("Fetch job details error:", error);
            setJobDetails(null);
        }
    }, [token, BASE_URL]);


    // 3. Fetch Application History
    const fetchApplicationHistory = useCallback(async () => {
        if (!token) return;
        try {
            // Endpoint: /api/v1/applications/history/{applicationId}
            const response = await fetch(`${BASE_URL}/applications/history/${applicationId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const historyData = await response.json();
                setHistory(historyData || []);
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to parse history response." }));
                throw new Error(errorData.message || "Failed to fetch application history.");
            }
        } catch (error) {
            console.error("Fetch history error:", error);
            throw error;
        }
    }, [token, applicationId, BASE_URL]);
    
    // Combined Fetch
    useEffect(() => {
        const loadData = async () => {
            if (!token) {
                setLoading(false);
                setStatus({ message: "Authentication required.", type: 'error' });
                return;
            }
            setLoading(true);
            clearStatus();
            try {
                // 1. Fetch Application Details first
                const applicationData = await fetchApplicationDetails();

                if (applicationData && applicationData.jobId) {
                    // 2. Fetch Job Details using the jobId from applicationData
                    await fetchJobDetails(applicationData.jobId); 
                }

                // 3. Fetch Application History
                await fetchApplicationHistory();
                
            } catch (error) {
                setStatus({ message: error.message || "Could not load complete application data.", type: 'error' });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [token, fetchApplicationDetails, fetchApplicationHistory, fetchJobDetails]);


    // --- Render States ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <span>Loading application details and timeline...</span>
                </div>
            </div>
        );
    }
    
    if (!applicationDetails && history.length === 0) {
          return (
            <div className="min-h-screen pt-20 bg-gray-50 max-w-4xl mx-auto p-4">
                <StatusMessage message={status.message} type={status.type} onClose={clearStatus} />
                <h1 className="text-3xl font-bold text-red-600 mt-8">Application Not Found</h1>
                <p className="mt-4 text-gray-600">The application ID **{applicationId}** may be invalid or you do not have permission to view it.</p>
                <button
                    onClick={() => navigate('/my-applications')}
                    className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Applications
                </button>
            </div>
        );
    }

    // Determine current status and job title for display
    const currentStatus = applicationDetails?.status || (history.length > 0 ? history[history.length - 1].status : 'N/A');
    const jobTitle = jobDetails?.title || applicationDetails?.jobTitle || 'N/A Job Title';
    const companyName = jobDetails?.companyName || applicationDetails?.companyName || 'N/A Company';

    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-3 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-4xl mx-auto">
                
                <StatusMessage message={status.message} type={status.type} onClose={clearStatus} />

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600">
                    
                    {/* --- HEADER & BACK BUTTON --- */}
                    <div className="flex justify-between items-start flex-wrap mb-6 border-b pb-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1">
                                Application Detail
                            </h1>
                            <p className="text-xl font-semibold text-indigo-700 mb-2">
                                {jobTitle} at {companyName}
                            </p>
                            <p className="mt-2 text-md font-medium">
                                Current Status: 
                                <span className="ml-2 px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800">
                                    {formatStatusName(currentStatus)}
                                </span>
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/my-applications')}
                            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition duration-150 ease-in-out"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to List
                        </button>
                    </div>

                    {/* --- JOB POSTING DETAILS --- */}
                    {jobDetails && (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center border-b pb-2">
                                <Briefcase className="w-5 h-5 mr-2 text-indigo-600" /> Job Posting Details
                            </h2>
                            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700 mb-8 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="font-semibold text-indigo-700 text-sm flex items-center"><MapPin className="w-4 h-4 mr-2" /> Location/City:</p>
                                    <p className="font-medium">{jobDetails.locationType} - {jobDetails.city}</p>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="font-semibold text-indigo-700 text-sm flex items-center"><DollarSign className="w-4 h-4 mr-2" /> Salary Range:</p>
                                    <p className="font-medium">{jobDetails.salaryRange || 'Competitive'}</p>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="font-semibold text-indigo-700 text-sm flex items-center"><TrendingUp className="w-4 h-4 mr-2" /> Employment Type:</p>
                                    <p className="font-medium">{jobDetails.employmentType}</p>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <p className="font-semibold text-indigo-700 text-sm flex items-center"><Users className="w-4 h-4 mr-2" /> Required Skills:</p>
                                    <p className="font-medium">{jobDetails.requiredSkill || 'N/A'}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="font-semibold text-indigo-700 text-sm mb-1">Job Description:</p>
                                    <div className="bg-white p-3 rounded-md border shadow-sm max-h-48 overflow-y-auto">
                                        <p className="text-sm whitespace-pre-wrap">{jobDetails.description}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}


                    {/* --- APPLICATION METADATA --- */}
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                         <Calendar className="w-5 h-5 mr-2 text-indigo-600" /> Application Submission Details
                    </h2>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg border">
                         <div className="col-span-2 sm:col-span-1">
                            <p className="font-semibold text-indigo-700 text-sm flex items-center"><Calendar className="w-4 h-4 mr-2" /> Applied Date:</p>
                            <p className="font-medium">{formatDateOnly(applicationDetails?.applicationDate)}</p>
                        </div>
                         <div className="col-span-2 sm:col-span-1">
                            <p className="font-semibold text-indigo-700 text-sm flex items-center"><Briefcase className="w-4 h-4 mr-2" /> Job ID:</p>
                            <p className="font-medium">{applicationDetails?.jobId || 'N/A'}</p>
                        </div>
                    </div>


                    {/* --- COVER LETTER --- */}
                    <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center border-b pb-2">
                        <FileText className="w-5 h-5 mr-2 text-indigo-600" /> Submitted Cover Letter
                    </h2>
                    <div className="bg-gray-50 p-4 rounded-lg mb-8 shadow-inner border">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                            {applicationDetails?.coverLetterText || "No cover letter was submitted with this application."}
                        </p>
                    </div>


                    {/* --- HISTORY TIMELINE --- */}
                    <h2 className="text-xl font-bold text-gray-800 mb-6 pt-4 flex items-center border-b pb-2">
                        <Clock className="w-5 h-5 mr-2 text-indigo-600" /> Application History Timeline
                    </h2>
                    
                    {history.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 border-dashed border-2 rounded-lg">
                            <p>No detailed activity log found for this application yet.</p>
                        </div>
                    ) : (
                        <div className="relative pt-2 pb-12">
                            <div className="absolute top-0 left-5 h-full w-0.5 bg-gray-200" aria-hidden="true"></div>

                            {history.map((activity, index) => (
                                <div key={index} className="ml-10 mb-8 relative">
                                    
                                    {/* Timeline Marker */}
                                    <div className="absolute -left-10 top-0.5 w-10 h-10 flex items-center justify-center rounded-full bg-white z-10 border-4 border-gray-50">
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 shadow">
                                            {getStatusIcon(activity.status)}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-indigo-400/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-md font-semibold text-gray-900">
                                                Status Changed to: {formatStatusName(activity.status)}
                                            </h3>
                                            <span className="text-xs text-gray-500 flex items-center">
                                                <Clock className="w-3 h-3 mr-1" /> {formatTimestamp(activity.timestamp)}
                                            </span>
                                        </div>
                                        
                                        <p className="text-sm text-gray-700 mb-2 whitespace-pre-wrap">{activity.note}</p>
                                        
                                        <p className="text-xs text-gray-500 pt-2 border-t border-dashed mt-2">
                                            Actioned By: <span className="font-medium">{activity.statusChangedBy || 'System'}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetail;