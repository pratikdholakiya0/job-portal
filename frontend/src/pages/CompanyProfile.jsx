import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../store/AuthContext';
import { InputField } from '../component/InputField'
import { SelectField } from '../component/SelectField';
import { TextareaField } from '../component/TextareaField';
import { useNavigate } from 'react-router';
import { cities, size_option } from '../constant/constant';

const SIZE_OPTIONS = size_option;
const LOCATION_OPTIONS = cities;

const INITIAL_COMPANY_DATA = {
    name: '',
    website: '',
    industry: '',
    size: SIZE_OPTIONS[0].value,
    headquarters: LOCATION_OPTIONS[0].value, 
    description: '',
    address: '',
};

const CompanyProfile = () => {
    const navigate = useNavigate();
    const { isAuthenticated, token, company, profile, BASE_URL, refeshUserToken } = useAuth();

    const [companyData, setCompanyData] = useState(INITIAL_COMPANY_DATA); 
    const [companyDataEdit, setCompanyDataEdit] = useState(INITIAL_COMPANY_DATA); 
    
    // ⭐️ NEW LOCAL STATE: Used for instant visibility after creation ⭐️
    const [hasBeenCreated, setHasBeenCreated] = useState(false);
    
    // Derived state: Use company, OR fall back to local flag if just created
    const profileExists = !!company || hasBeenCreated;
    
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState(null); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanyDataEdit((prev) => ({ ...prev, [name]: value }));
    };

    const fetchCompany = useCallback(async () => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        setStatus("Loading profile...");
        try {
            const resp = await fetch(`${BASE_URL}/company/get`, {
                method : "GET",
                headers : {
                    'Authorization' : `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if(!resp.ok){
                if (resp.status === 404) {
                    setStatus("No profile found. Please create one.");
                    // Set editing mode immediately upon 404
                    setIsEditing(true); 
                    return; 
                }
                throw new Error(`Failed to fetch: ${resp.statusText}`);
            }

            const data = await resp.json();
            
            const mappedData = {
                ...data,
                headquarters: data.headquartersLocation || data.headquarters || INITIAL_COMPANY_DATA.headquarters,
                address: data.address || INITIAL_COMPANY_DATA.address
            };

            const fetchedData = { ...INITIAL_COMPANY_DATA, ...mappedData };

            setCompanyData(fetchedData);
            setCompanyDataEdit(fetchedData);
            setIsEditing(false);
            setHasBeenCreated(true); // Ensure local state reflects existence
            setStatus("LOADED");
            
        } catch (error) {
            console.error("Error fetching company profile:", error);
            setStatus(`Error loading profile: ${error.message}. Entering creation mode.`);
            setCompanyData(INITIAL_COMPANY_DATA);
            setCompanyDataEdit(INITIAL_COMPANY_DATA);
            setIsEditing(true);
        } finally {
            setIsLoading(false); 
            setTimeout(() => setStatus(prev => prev && (prev.includes("Loading profile") || prev.includes("Profile loaded") || prev.includes("No profile found")) ? null : prev), 3000);
        }
    }, [BASE_URL, token]); 

    useEffect(() => {
        
        if(!profile){
            setStatus("Please complete your user profile first to create a company.");
            const timeoutId = setTimeout(() => navigate("/profile"), 2000);
            return () => clearTimeout(timeoutId);
        }
        
        // ⭐️ FIXED LOGIC: Always attempt to fetch if the component hasn't confirmed existence. ⭐️
        // We only fetch if we have a token and are not already in a confirmed state (either profileExists is true 
        // OR isLoading is false, meaning the first fetch already completed).
        if (token && isLoading) {
            fetchCompany();
        } 
        
        // This handles the state where fetchCompany resulted in a 404/no profile,
        // and fetchCompany set isLoading(false) and setIsEditing(true).
        if (!isLoading && !profileExists && !isEditing) {
            setIsEditing(true); // Ensure editing is true for creation mode
            setStatus("Create Company Profile");
        }
            
    }, [navigate, profile, fetchCompany, token, isLoading, profileExists, isEditing]); // Added dependencies

    const submitCompanyData = async (endpoint) => {
        setIsSubmitting(true);
        setStatus('Saving profile changes...');

        try {
            const method = profileExists ? "PUT" : "POST";
            
            const payload = {
                ...companyDataEdit,
                // Ensure headquarters is mapped to headquartersLocation for the API
                headquartersLocation: companyDataEdit.headquarters, 
            }
            
            const resp = await fetch(`${BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await resp.json();

            if (!resp.ok) {
                const errorMessage = data.message || `Server error: ${resp.status}`;
                throw new Error(errorMessage);
            }

            setCompanyData(companyDataEdit); 
            
            // ⭐️ FIX: Set local flag and switch to view mode ⭐️
            if(endpoint === "/company/create") {
                setHasBeenCreated(true); // Instant visual existence
                refeshUserToken(); // Start the slow context update
            }
            
            setIsEditing(false); // Switch to view mode
            setStatus('Profile saved successfully!');
            
            if(endpoint === "/company/create"){
                setStatus("CREATED")
            }else{
                setStatus("UPDATED")
            }

        } catch (error) {
            setCompanyDataEdit(companyData)
            console.error('Submission Error:', error);
            setStatus(`Error saving profile: ${error.message}`);
        } finally {
            setIsSubmitting(false);
            setTimeout(() => {
                setStatus(null)
            }, 4000);
        }
    }

    const handleSave = (e) => {
        e.preventDefault();
        
        if (
            companyDataEdit.size === SIZE_OPTIONS[0].value || 
            companyDataEdit.headquarters === LOCATION_OPTIONS[0].value ||
            !companyDataEdit.address.trim() 
        ) {
            setStatus('Please fill in all required fields (Size, City, and Address).');
            setTimeout(() => setStatus(null), 3000);
            return;
        }

        const endpoint = profileExists ? '/company/update' : '/company/create';
        
        submitCompanyData(endpoint); 
    };


    const handleCancel = () => {
        setCompanyDataEdit(companyData);
        setIsEditing(false);
        setStatus(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <span>Loading profile data...</span>
                </div>
            </div>
        );
    }

    const formTitle = profileExists ? 
        (isEditing ? 'Edit Company Profile' : 'Company Profile Details') : 
        'Create Company Profile';

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 mt-16 sm:px-6 lg:px-8 flex justify-center">
            <div className="w-full max-w-4xl">
                
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900">{formTitle}</h1>
                    
                    {/* Button relies on the derived 'profileExists' state, which now includes the local flag */}
                    {!isLoading && profileExists && !isSubmitting && (
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
                            {isEditing ? 'Discard Changes & View' : 'Edit Profile'} 
                        </button>
                    )}
                </div>

                {status && (
                    <div className={`p-4 mb-6 rounded-lg font-medium text-center ${
                        status.includes('success') || status === 'LOADED' || status === 'CREATED' || status === 'UPDATED' ? 'bg-green-100 text-green-700' : 
                        status.includes('error') ? 'bg-red-100 text-red-700' : 
                        status.includes('Saving') || status.includes('Loading') ? 'bg-blue-100 text-blue-700' : 
                        'bg-yellow-100 text-yellow-700'
                    }`}>
                        {status==='LOADED' && 'Company profile loaded successfully'}
                        {status==='CREATED' && 'Company profile created successfully'}
                        {status==='UPDATED' && 'Company profile updated successfully'}
                        {status !== 'LOADED' && status !== 'CREATED' && status !== 'UPDATED' && status}
                    </div>
                )}
                
                <form onSubmit={handleSave} className="bg-white p-8 sm:p-10 rounded-xl shadow-2xl space-y-8 border-t-4 border-indigo-600">
                    
                    <div className="space-y-6 border-b border-gray-200 pb-8">
                        <h2 className="text-xl text-start font-semibold text-indigo-600">1. Company Identity</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Company Name" name="name" value={companyDataEdit.name || ''} onChange={handleChange}
                                placeholder="e.g., TechStream Innovations" required readOnly={!isEditing}
                            />
                            <InputField 
                                label="Company Website (URL)" name="website" value={companyDataEdit.website || ''} onChange={handleChange}
                                placeholder="e.g., https://techstream.com" required readOnly={!isEditing}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField 
                                label="Industry" name="industry" value={companyDataEdit.industry || ''} onChange={handleChange}
                                placeholder="e.g., Software Development" required readOnly={!isEditing}
                            />
                            <SelectField
                                label="Company Size" name="size" value={companyDataEdit.size} onChange={handleChange}
                                options={SIZE_OPTIONS} required readOnly={!isEditing}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl text-start font-semibold text-indigo-600">2. Location & Description</h2>
                        
                        <SelectField 
                            label="Headquarters City" 
                            name="headquarters" 
                            value={companyDataEdit.headquarters || ''} 
                            onChange={handleChange}
                            options={LOCATION_OPTIONS} 
                            required 
                            readOnly={!isEditing}
                        />

                        <InputField 
                            label="Office Street Address" 
                            name="address" 
                            value={companyDataEdit.address || ''} onChange={handleChange}
                            placeholder="e.g., 123, Main Road, Block A" required readOnly={!isEditing}
                        />

                        <TextareaField
                            label="Company Description" name="description" value={companyDataEdit.description || ''} onChange={handleChange}
                            placeholder="Tell candidates about your company mission, culture, and products." required readOnly={!isEditing}
                        />
                    </div>
                    
                    {/* Show buttons only when actively editing (which includes creation) */}
                    {isEditing && (
                        <div className="pt-4 flex justify-end space-x-4">
                            {/* Cancel/Discard Button is only useful if a profile exists to return to */}
                            {profileExists && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Saving...' : (profileExists ? 'Update Profile' : 'Create Profile')}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CompanyProfile;