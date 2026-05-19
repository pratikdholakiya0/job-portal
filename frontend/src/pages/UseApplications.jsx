import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../store/AuthContext";
import StatusMessage from "../component/StatusMessage";
import { Link, useNavigate } from "react-router-dom";
import { Briefcase, ListFilter, Search, ArrowLeft } from "lucide-react";


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
    return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};


// --- User Applications Component ---
const UserApplications = () => {
    const { token, BASE_URL } = useAuth();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });

    const clearStatus = () => setStatus({ message: '', type: '' });

    const fetchApplications = useCallback(async () => {
        if (!token) {
            setLoading(false);
            setStatus({ message: "Authentication required to view applications.", type: 'error' });
            return;
        }

        try {
            // Fetching all applications (assuming backend handles pagination/large sets gracefully)
            const response = await fetch(`${BASE_URL}/applications/my-applications`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const applicationsData = await response.json();
                // Assuming backend returns an array directly
                setApplications(applicationsData || []);
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to parse application list." }));
                throw new Error(errorData.message || "Failed to fetch application list.");
            }
        } catch (error) {
            console.error("Fetch applications error:", error);
            setStatus({ message: error.message || "Could not load application data.", type: 'error' });
            setApplications([]);
        } finally {
            setLoading(false);
        }
    }, [token, BASE_URL]);

    useEffect(() => {
        fetchApplications();
    }, [fetchApplications]);


    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <span>Loading all applications...</span>
                </div>
            </div>
        );
    }

    // --- Render Component ---
    return (
        <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-3 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-6xl mx-auto">
                
                <StatusMessage 
                    message={status.message} 
                    type={status.type} 
                    onClose={clearStatus} 
                />

                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600">
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b pb-4">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center mb-4 sm:mb-0">
                            <Briefcase className="w-8 h-8 mr-3 text-indigo-600" /> All Submitted Applications
                        </h1>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition duration-150 ease-in-out"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </button>
                    </div>

                    {/* Search and Filter Section (Placeholder) */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Search by job title or company..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                        <button
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
                        >
                            <ListFilter className="w-4 h-4 mr-2" /> Filter Status
                        </button>
                    </div>

                    {/* Application Table */}
                    {applications.length === 0 ? (
                        <p className="text-gray-500 p-8 text-center border rounded-lg bg-gray-50">
                            You have not submitted any job applications yet. Start exploring <Link to="/jobs" className="text-indigo-600 hover:underline font-medium">open positions</Link> now!
                        </p>
                    ) : (
                        <div className="overflow-x-auto shadow border-b border-gray-200 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title / Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied On</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {applications.map((app) => (
                                        <tr key={app.id} className="hover:bg-indigo-50/50 transition duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{app.jobTitle || 'N/A'}</div>
                                                <div className="text-xs text-gray-500">{app.companyName || 'N/A Company'}</div>
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
                                                <Link to={`${app.id}`} className="text-indigo-600 hover:text-indigo-800 transition duration-150 font-semibold">
                                                    View Timeline
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserApplications;