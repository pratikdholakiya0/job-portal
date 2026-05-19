import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router';
import { InputField } from '../component/InputField';
import { TextareaField } from '../component/TextareaField';
import SkillInput from '../component/SkillInput';
import { SelectField } from '../component/SelectField';
import { cities, employees_option, location_option } from '../constant/constant'
import { BriefcaseIcon } from '../component/icons/BriefcaseIcon';

const JobPostingForm = () => {
    const navigate = useNavigate();
    
    const {token, BASE_URL, profile, company} = useAuth();
    const [job, setJob] = useState({
        title: '',
        description: '',
        locationType: '',
        city: '',
        employmentType: '',
        salaryRange: '',
        requiredSkills: [],
        deadline: '',
    });

    const [status, setStatus] = useState(null); 

    const LOCATION_CITY_OPTIONS = cities;

    const LOCATION_OPTIONS = location_option

    const EMPLOYMENT_OPTIONS = employees_option

    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setJob((prev) => {
            const newState = { ...prev, [name]: value };

            if (name === 'locationType') {
                newState.city = '';
            }
            return newState;
        });
    };

    const handleSkillsChange = (newSkills) => {
        setJob((prev) => ({ ...prev, requiredSkills: newSkills }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        
        if (job.locationType !== 'REMOTE' && (!job.city || job.city === '')) {
            setStatus('Please select a City/Location for On-Site or Hybrid jobs.');
            setTimeout(() => setStatus(null), 5000);
            return;
        }

        const payload = {
            ...job,
            city: job.city,
            requiredSkill: job.requiredSkills,
            requiredSkills: undefined, 
        };
        
        console.log('Job Data to Submit:', payload);
        
        try {
            const resp = await fetch(`${BASE_URL}/jobs/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body : JSON.stringify(payload)
            });

            const data = await resp.json();

            if (!resp.ok) {
                throw new Error(data.message || "Job post failed due to server error.");
            }             
            setStatus('SUCCESS');
            console.log("Job created successfully!");
            
            navigate("/employer/jobs");
            
            return "Success";
        } catch (error) {
            console.error("Job creation failed :", error);
            setStatus('error');
            
        } finally {
            setTimeout(() => setStatus(null), 5000); 
        }
    };

    useEffect(()=>{
        if(!profile){
            setStatus("CANDIDATE_PROFILE_NOT_CREATED")
            navigate('/profile')
        }
        if(!company){
            return navigate('/employer/company')
        }
    },[])

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 mt-16 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                
                <div className="text-center mb-10">
                    <BriefcaseIcon className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                    <h2 className="text-3xl font-extrabold text-gray-900">
                        Create New Job Posting
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Fill in the details below to publish a new job opening for candidates.
                    </p>
                </div>

                {status && (
                    <div className={`p-4 mb-6 rounded-lg font-medium ${
                        status === 'success' ? 'bg-green-100 text-green-700' : 
                        status === 'error' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                    }`}>
                        {status === 'submitting' && 'Submitting job post...'}
                        {status === 'SUCCESS' && 'Success! The job has been posted.'}
                        {status === 'COMPANY_NOT_CREATED' && 'create company first' }
                        {status === 'CANDIDATE_PROFILE_NOT_CREATED' && 'Crete Candidate Profile first'}
                        {status === 'error' && 'Error submitting post. Please try again.'}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl space-y-8 border-t-4 border-indigo-600">
                    
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Job Details</h3>
                        <InputField
                            label="Job Title"
                            name="title"
                            value={job.title}
                            onChange={handleChange}
                            placeholder="e.g., Senior Frontend Engineer"
                            required
                        />
                        <TextareaField
                            label="Job Description"
                            name="description"
                            value={job.description}
                            onChange={handleChange}
                            placeholder="Detailed description of responsibilities and required qualifications."
                            required
                        />
                        <SkillInput 
                            requiredSkills={job.requiredSkills} 
                            setRequiredSkills={handleSkillsChange} 
                        />
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">Location & Compensation</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SelectField
                                label="Employment Type"
                                name="employmentType"
                                value={job.employmentType}
                                onChange={handleChange}
                                options={EMPLOYMENT_OPTIONS}
                                required
                            />
                            <SelectField
                                label="Location Type"
                                name="locationType"
                                value={job.locationType}
                                onChange={handleChange}
                                options={LOCATION_OPTIONS}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            <SelectField
                                label="location"
                                name="city"
                                value={job.city}
                                onChange={handleChange}
                                options={LOCATION_CITY_OPTIONS}
                                required
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Salary Range (Optional)"
                                name="salaryRange"
                                value={job.salaryRange}
                                onChange={handleChange}
                                placeholder="e.g., 5 LPA - 8 LPA"
                            />
                            <InputField
                                label="Application Deadline"
                                name="deadline"
                                value={job.deadline}
                                onChange={handleChange}
                                type="date"
                                required
                            />
                        </div>

                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="w-full p-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                        >
                            {status === 'submitting' ? 'Posting...' : 'Publish Job Posting'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JobPostingForm;