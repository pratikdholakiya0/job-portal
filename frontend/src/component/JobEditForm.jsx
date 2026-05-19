import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate, useParams } from 'react-router';
import Header from '../component/Header';

// --- Icons (Lucide React replacements) ---
const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
);
const PlusIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
);
const BriefcaseIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect x="5" y="16" width="14" height="4" rx="1"/><path d="M17 6H7"/></svg>
);


// --- Form Constants (Shared with JobPostingForm) ---

const LOCATION_CITY_OPTIONS = [
    { value: '', label: 'Select City', disabled: true },
    { value: 'Amreli', label: 'Amreli (United state of india)' },
    { value: 'Bengaluru', label: 'Bengaluru (Bangalore)' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi NCR', label: 'Delhi NCR (Gurgaon, Noida, etc.)' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Ahmedabad', label: 'Ahmedabad' },
    { value: 'Surat', label: 'Surat' },
    { value: 'Jaipur', label: 'Jaipur' },
    { value: 'Lucknow', label: 'Lucknow' },
    { value: 'Kanpur', label: 'Kanpur' },
    { value: 'Nagpur', label: 'Nagpur' },
    { value: 'Indore', label: 'Indore' },
    { value: 'Thane', label: 'Thane' },
    { value: 'Bhopal', label: 'Bhopal' },
    { value: 'Visakhapatnam', label: 'Visakhapatnam (Vizag)' },
    { value: 'Patna', label: 'Patna' },
    { value: 'Vadodara', label: 'Vadodara' },
    { value: 'Ludhiana', label: 'Ludhiana' },
    { value: 'Agra', label: 'Agra' },
    { value: 'Nashik', label: 'Nashik' },
    { value: 'Faridabad', label: 'Faridabad' },
    { value: 'Meerut', label: 'Meerut' },
    { value: 'Rajkot', label: 'Rajkot' },
    { value: 'Varanasi', label: 'Varanasi' },
    { value: 'Aurangabad', label: 'Aurangabad' },
    { value: 'Ranchi', label: 'Ranchi' },
    { value: 'Jabalpur', label: 'Jabalpur' },
    { value: 'Coimbatore', label: 'Coimbatore' },
    { value: 'Vijayawada', label: 'Vijayawada' },
    { value: 'Jodhpur', label: 'Jodhpur' },
    { value: 'Madurai', label: 'Madurai' },
    { value: 'Raipur', label: 'Raipur' },
    { value: 'Kota', label: 'Kota' },
    { value: 'Guwahati', label: 'Guwahati' },
    { value: 'Bhubaneswar', label: 'Bhubaneswar' },
    { value: 'Kochi', label: 'Kochi / Cochin' },
    { value: 'Mysuru', label: 'Mysuru (Mysore)' },
    { value: 'REMOTE_INDIA', label: 'Remote (Anywhere in India)' },
    { value: 'OTHER_INDIA', label: 'Other Indian City (Not Listed)' },
];

const LOCATION_OPTIONS = [
    { label: 'On-Site', value: 'ON_SITE' },
    { label: 'Remote', value: 'REMOTE' },
    { label: 'Hybrid', value: 'HYBRID' },
];

const EMPLOYMENT_OPTIONS = [
    { label: 'Full-Time', value: 'FULL_TIME' },
    { label: 'Part-Time', value: 'PART_TIME' },
    { label: 'Internship', value: 'INTERNSHIP' },
    { label: 'Contract', value: 'CONTRACT' },
];

const INITIAL_JOB_STATE = {
    title: '',
    description: '',
    locationType: '',
    city: '',
    employmentType: '',
    salaryRange: '',
    requiredSkills: [], // Use requiredSkills as internal state name
    deadline: '',
};

// --- Reusable Form Components ---

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required = false, readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            name={name}
            id={name}
            value={value || ''}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            required={required}
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 ${readOnly ? 'bg-gray-100 text-gray-600' : 'bg-white'}`}
        />
    </div>
);

const SelectField = ({ label, name, value, onChange, options = [], required = false, readOnly = false }) => {
    const selectedLabel = options.find(opt => opt.value === value)?.label || 'N/A';

    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {readOnly ? (
                <p className="w-full px-4 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 shadow-sm text-sm">
                    {selectedLabel}
                </p>
            ) : (
                <select
                    name={name}
                    id={name}
                    value={value || ''}
                    onChange={onChange}
                    required={required}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 appearance-none"
                >
                    <option value="" disabled>Select {label.toLowerCase()}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

const TextareaField = ({ label, name, value, onChange, placeholder, required = false, readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <textarea
            name={name}
            id={name}
            value={value || ''}
            onChange={onChange}
            readOnly={readOnly}
            placeholder={placeholder}
            required={required}
            rows="4"
            className={`w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 resize-none ${readOnly ? 'bg-gray-100 text-gray-600' : 'bg-white'}`}
        ></textarea>
    </div>
);

const SkillInput = ({ requiredSkills, setRequiredSkills, readOnly }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddSkill = () => {
        const skill = inputValue.trim();
        if (skill && !requiredSkills.includes(skill)) {
            setRequiredSkills([...requiredSkills, skill]);
            setInputValue('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        if (readOnly) return;
        setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyDown = (e) => {
        if (readOnly) return;
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills <span className="text-red-500">*</span> {!readOnly && (<span className="text-gray-500 text-xs">(Press Enter to add)</span>)}
            </label>
            {!readOnly && (
                <div className="flex items-center space-x-2 mb-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={readOnly}
                        placeholder="e.g., React, Java, MongoDB"
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                    />
                    <button
                        type="button"
                        onClick={handleAddSkill}
                        disabled={readOnly}
                        className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition duration-150 disabled:opacity-50"
                        aria-label="Add Skill"
                    >
                        <PlusIcon className="w-5 h-5" />
                    </button>
                </div>
            )}
            
            {/* Skill Tags Display */}
            <div className={`mt-3 flex flex-wrap gap-2 p-2 border ${readOnly ? 'border-gray-200 bg-gray-50' : 'border-gray-300 bg-white'} rounded-lg min-h-[3rem]`}>
                {requiredSkills.length === 0 ? (
                    <p className="text-sm text-gray-500 italic pt-1">No skills added yet.</p>
                ) : (
                    requiredSkills.map((skill) => (
                        <span
                            key={skill}
                            className={`inline-flex items-center text-xs font-medium px-3 py-1 rounded-full transition duration-150 ${
                                readOnly 
                                    ? 'bg-indigo-100 text-indigo-800' 
                                    : 'bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700'
                            }`}
                            onClick={() => handleRemoveSkill(skill)}
                        >
                            {skill}
                            {!readOnly && <XIcon className="ml-1 w-3 h-3" />}
                        </span>
                    ))
                )}
            </div>
        </div>
    );
};


// --- Main Component ---

const JobEditForm = () => {
    const navigate = useNavigate();
    // Get jobId from the route parameters
    const { jobId } = useParams(); 
    
    const { token, BASE_URL, isAuthenticated } = useAuth();
    // Use jobData for the last saved state
    const [jobData, setJobData] = useState(INITIAL_JOB_STATE);
    // Use editedData for the modifiable form state
    const [editedData, setEditedData] = useState(INITIAL_JOB_STATE); 

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // Default to View Mode
    const [status, setStatus] = useState(null); // null, 'success', 'error', 'submitting'

    // --- Data Fetching ---
    const fetchJobData = useCallback(async () => {
        if (!jobId) {
            setLoading(false);
            setStatus('Error: Invalid Job ID or not authenticated.');
            return;
        }

        setStatus('Loading job details...');
        try {
            // GET /api/v1/jobs/{jobId}
            const resp = await fetch(`${BASE_URL}/jobs/getById/${jobId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!resp.ok) {
                const errorData = await resp.json();
                throw new Error(errorData.message || `Failed to fetch job ${jobId}.`);
            }

            const data = await resp.json();
            
            // Format the fetched data to match the internal state structure
            const formattedData = {
                ...INITIAL_JOB_STATE,
                ...data,
                // Ensure requiredSkills is an array
                requiredSkills: Array.isArray(data.requiredSkill) ? data.requiredSkill : [],
                // Ensure date is in 'YYYY-MM-DD' format for input type="date"
                deadline: data.deadline ? new Date(data.deadline).toISOString().substring(0, 10) : ''
            };
            
            setJobData(formattedData);
            setEditedData(formattedData);
            setLoading(false);
            setStatus(null); 
            console.log(data);
            

        } catch (error) {
            console.error("Job fetch failed:", error);
            setStatus(`Error: ${error.message}`);
            setLoading(false);
        }
    }, [jobId, token, BASE_URL]);

    useEffect(() => {
        fetchJobData();
    }, [fetchJobData]);

    // --- Handlers ---

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSkillsChange = (newSkills) => {
        setEditedData((prev) => ({ ...prev, requiredSkills: newSkills }));
    };
    
    const handleCancel = () => {
        // Revert changes back to the last saved data
        setEditedData(jobData);
        setIsEditing(false);
        setStatus(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!jobId || !token) {
             setStatus('Error: Missing job ID or token.');
             return;
        }
        
        setStatus('submitting');
        setSubmitting(true);
        
        // Validation check for skills
        if (editedData.requiredSkills.length === 0) {
            setStatus('Please add at least one required skill.');
            setSubmitting(false);
            setTimeout(() => setStatus(null), 5000);
            return;
        }
        
        // Prepare the payload: map internal state name (requiredSkills) to backend name (requiredSkill)
        const payload = {
            ...editedData,
            requiredSkill: editedData.requiredSkills,
            requiredSkills: undefined, // Remove the internal state key
            // The backend uses a PUT endpoint that includes jobId in the path.
        };
        
        try {
            // PUT /api/v1/jobs/update/{jobId}
            const resp = await fetch(`${BASE_URL}/jobs/update/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body : JSON.stringify(payload)
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.message || `Update failed: ${resp.status}`);
            }             
            
            // Update the stable state (jobData) after successful save
            setJobData(editedData); 
            setIsEditing(false); // Switch to view mode
            setStatus('success');
            
        } catch (error) {
            console.error("Job update failed :", error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setSubmitting(false);
            setTimeout(() => setStatus(null), 5000); 
        }
    };

    // --- Loading State Renderer ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <svg className="animate-spin h-8 w-8 text-indigo-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                <span className="text-xl text-indigo-600 font-semibold">Loading Job ID: {jobId}...</span>
            </div>
        );
    }
    
    // Determine status message style
    const statusClass = status === 'success' ? 'bg-green-100 text-green-700' : 
                        status && status.includes('Error') ? 'bg-red-100 text-red-700' : 
                        status === 'submitting' ? 'bg-blue-100 text-blue-700' : 
                        'hidden';
    
    const statusText = status === 'submitting' ? 'Submitting updates...' : 
                       status === 'success' ? 'Job updated successfully!' : 
                       status;

    return (
        <>
            <Header/>
            <div className="min-h-screen bg-gray-50 py-10 px-4 mt-16 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    
                    {/* Header and Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center space-x-3">
                            <BriefcaseIcon className="w-8 h-8 text-indigo-600" />
                            <h2 className="text-3xl font-extrabold text-gray-900">
                                {isEditing ? 'Edit Job Posting' : 'Job Details (View Only)'}
                            </h2>
                        </div>
                        
                        {/* Edit/View Toggle Button */}
                        <button
                            onClick={() => {
                                if (isEditing) handleCancel();
                                else setIsEditing(true);
                            }}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 ${
                                isEditing 
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            {isEditing ? 'Cancel & View' : 'Edit Job'}
                        </button>
                    </div>

                    {/* Status Message */}
                    {status && (
                        <div className={`p-4 mb-6 rounded-lg font-medium text-center ${statusClass}`}>
                            {statusText}
                        </div>
                    )}

                    {/* Main Form Card */}
                    <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl space-y-8 border-t-4 border-indigo-600">
                        
                        {/* Job Details Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Job Details</h3>
                            <InputField
                                label="Job Title"
                                name="title"
                                value={editedData.title}
                                onChange={handleChange}
                                placeholder="e.g., Senior Frontend Engineer"
                                required
                                readOnly={!isEditing}
                            />
                            <TextareaField
                                label="Job Description"
                                name="description"
                                value={editedData.description}
                                onChange={handleChange}
                                placeholder="Detailed description of responsibilities and required qualifications."
                                required
                                readOnly={!isEditing}
                            />
                            <SkillInput 
                                requiredSkills={editedData.requiredSkills} 
                                setRequiredSkills={handleSkillsChange} 
                                readOnly={!isEditing}
                            />
                        </div>

                        {/* Logistics Section */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Location & Compensation</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SelectField
                                    label="Employment Type"
                                    name="employmentType"
                                    value={editedData.employmentType}
                                    onChange={handleChange}
                                    options={EMPLOYMENT_OPTIONS}
                                    required
                                    readOnly={!isEditing}
                                />
                                <SelectField
                                    label="Location Type"
                                    name="locationType"
                                    value={editedData.locationType}
                                    onChange={handleChange}
                                    options={LOCATION_OPTIONS}
                                    required
                                    readOnly={!isEditing}
                                />
                            </div>
                            
                            {/* Single City Dropdown */}
                            {editedData.locationType !== 'REMOTE' && (
                                <div className="grid grid-cols-1 gap-6">
                                    <SelectField
                                        label="Select City"
                                        name="city"
                                        value={editedData.city}
                                        onChange={handleChange}
                                        options={LOCATION_CITY_OPTIONS}
                                        required
                                        readOnly={!isEditing}
                                    />
                                </div>
                            )}
                            {/* End Single City Dropdown */}
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Salary Range (Optional)"
                                    name="salaryRange"
                                    value={editedData.salaryRange}
                                    onChange={handleChange}
                                    placeholder="e.g., 5 LPA - 8 LPA"
                                    readOnly={!isEditing}
                                />
                                <InputField
                                    label="Application Deadline"
                                    name="deadline"
                                    value={editedData.deadline}
                                    onChange={handleChange}
                                    type="date"
                                    required
                                    readOnly={!isEditing}
                                />
                            </div>

                        </div>

                        {/* Submit Button */}
                        {isEditing && (
                            <div className="pt-4 flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={submitting}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                                >
                                    {submitting ? 'Updating...' : 'Update Job Posting'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </>
    );
};

export default JobEditForm;