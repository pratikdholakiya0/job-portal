import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import StatusMessage from "../component/StatusMessage";

const JobDetails = () => {
    // Hooks for routing and context
    const { jobId } = useParams();
    const navigate = useNavigate();
    const { token, BASE_URL, resume } = useAuth();

    // State for data, loading, and status
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isApplying, setIsApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    
    // --- NEW STATE FOR COVER LETTER ---
    const [coverLetterText, setCoverLetterText] = useState('');
    // ---------------------------------

    // Check if the user has enough profile data to apply
    const isResumeReady = !!resume && Object.keys(resume).length > 5; 

    const clearStatus = () => setStatus({ message: '', type: '' });

    // --- 1. Fetch Job Details ---
    useEffect(() => {
        if (!token || !jobId) {
            setLoading(false);
            return;
        }

        const fetchJobDetails = async () => {
            setLoading(true);
            clearStatus();
            try {
                // Endpoint maps to /api/v1/jobs/getById/{jobId}
                const response = await fetch(`${BASE_URL}/jobs/getById/${jobId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const jobData = await response.json();
                    setJob(jobData);
                } else {
                    const errorData = await response.json().catch(() => ({ message: "Failed to parse error response." }));
                    throw new Error(errorData.message || "Job not found or failed to load.");
                }
            } catch (error) {
                console.error("Fetch job details error:", error);
                setStatus({ message: `Error loading job: ${error.message}`, type: 'error' });
                setJob(null);
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [token, jobId, BASE_URL]);


    // --- 2. Handle Job Application Submission ---
    const handleApply = async () => {
        if (!token || !job) {
            setStatus({ message: "Cannot apply. Missing authentication or job data.", type: 'error' });
            return;
        }

        if (!isResumeReady) {
            setStatus({ 
                message: "Please complete your profile/resume data before applying.", 
                type: 'warning' 
            });
            return;
        }
        
        // Validation check for the cover letter
        if (!coverLetterText.trim()) {
            setStatus({ 
                message: "Please include a cover letter to complete your application.", 
                type: 'warning' 
            });
            return;
        }
        
        setIsApplying(true);
        clearStatus();

        try {
            const requestBody = {
                jobId: job.id, 
                // --- ADDED COVER LETTER TEXT TO PAYLOAD ---
                coverLetterText: coverLetterText, 
                // ------------------------------------------
            };

            const response = await fetch(`${BASE_URL}/applications/submit`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                setStatus({ 
                    message: "Application submitted successfully! Check your dashboard for status updates.", 
                    type: 'success' 
                });
                setHasApplied(true);
            } else {
                const errorData = await response.json().catch(() => ({ message: "Failed to parse error response." }));
                throw new Error(errorData.message || "Failed to submit application. You may have already applied.");
            }
        } catch (error) {
            console.error("Application submission error:", error);
            setStatus({ message: `Application failed: ${error.message}`, type: 'error' });
        } finally {
            setIsApplying(false);
        }
    };


    // --- Loading and Error States ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                 <div className="text-xl text-indigo-600 flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <span>Loading job details...</span>
                </div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen pt-20 bg-gray-50 max-w-4xl mx-auto p-4">
                <StatusMessage message={status.message} type={status.type} onClose={clearStatus} />
                <h1 className="text-3xl font-bold text-red-600 mt-8">Job Posting Not Found</h1>
                <p className="mt-4 text-gray-600">The job ID **{jobId}** may be invalid or the posting has been removed.</p>
                <button
                    onClick={() => navigate('/jobs')}
                    className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                    Back to All Jobs
                </button>
            </div>
        );
    }
    
    // Helper to format date
    const formatDate = (isoDate) => {
        if (!isoDate) return 'N/A';
        return new Date(isoDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    // --- Render Job Details ---
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-3 sm:px-6 lg:px-8 mt-12">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl border-t-8 border-indigo-600">
                
                <StatusMessage message={status.message} type={status.type} onClose={clearStatus} />

                <div className="flex justify-between items-start flex-wrap mb-6 border-b pb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900">
                        {job.title || 'Job Title N/A'}
                    </h1>
                </div>

                {/* --- Job Metadata --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-8 text-gray-700 mb-8 p-4 bg-gray-50 rounded-lg">
                    <div>
                        <p className="font-semibold text-indigo-700 text-sm">Company:</p>
                        <p className="font-medium">{job.companyName || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-700 text-sm">Location:</p>
                        <p className="font-medium">{job.city || 'Remote/TBD'} <span className="text-xs text-gray-500">({job.locationType || 'N/A'})</span></p>
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-700 text-sm">Type:</p>
                        <p className="font-medium">{job.employmentType || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-700 text-sm">Salary Range:</p>
                        <p className="font-medium">{job.salaryRange || 'Competitive'}</p>
                    </div>
                    <div>
                        <p className="font-semibold text-indigo-700 text-sm">Posted On:</p>
                        <p className="font-medium">{formatDate(job.postedDate)}</p>
                    </div>
                    {job.deadline && (
                        <div>
                            <p className="font-semibold text-indigo-700 text-sm">Deadline:</p>
                            <p className="font-medium text-red-600">{formatDate(job.deadline)}</p>
                        </div>
                    )}
                </div>

                {/* --- Job Description --- */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Job Description</h2>
                <div className="text-gray-700 leading-relaxed job-description mb-8" 
                    dangerouslySetInnerHTML={{ __html: job.description || '<p>No description provided.</p>' }} 
                />

                {/* --- Required Skills --- */}
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Required Skills</h2>
                {job.requiredSkill && job.requiredSkill.length > 0 ? (
                    <ul className="flex flex-wrap gap-3 mb-8">
                        {job.requiredSkill.map((skill, index) => (
                            <li key={index} className="px-4 py-1 bg-indigo-100 text-indigo-800 rounded-lg text-sm font-medium shadow-sm">
                                {skill}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 mb-8">No specific required skills were listed for this role.</p>
                )}
                
                {/* --- COVER LETTER INPUT SECTION --- */}
                <div className="mt-8 pt-4 border-t border-gray-200">
                    <label htmlFor="coverLetter" className="block text-xl font-bold text-gray-800 mb-2">
                        Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500 mb-3">Tell us why you're a great fit for this specific role (2500 characters max).</p>
                    <textarea
                        id="coverLetter"
                        rows="6"
                        value={coverLetterText}
                        onChange={(e) => setCoverLetterText(e.target.value)}
                        maxLength={2500}
                        placeholder="Start typing your cover letter here..."
                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        disabled={hasApplied}
                    />
                    <div className="text-right text-sm text-gray-500">
                        {coverLetterText.length} / 2500 characters
                    </div>
                </div>
                {/* ---------------------------------- */}


                {/* --- Apply Button Section --- */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={handleApply}
                        disabled={isApplying || hasApplied || !isResumeReady || !coverLetterText.trim()}
                        className={`px-8 py-3 text-lg font-semibold rounded-lg transition duration-200 shadow-lg w-full sm:w-auto
                            ${isApplying || hasApplied || !isResumeReady || !coverLetterText.trim()
                                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }
                        `}
                    >
                        {isApplying ? 'Submitting...' : hasApplied ? 'Applied!' : isResumeReady ? 'Submit Application' : 'Complete Profile to Submit'}
                    </button>
                </div>
                {/* ---------------------------- */}
                
                <div className="mt-10 pt-4 border-t border-gray-200">
                    <button
                        onClick={() => navigate(-1)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition"
                    >
                        &larr; Back to Job Listings
                    </button>
                </div>

            </div>
        </div>
    );
};

export default JobDetails;