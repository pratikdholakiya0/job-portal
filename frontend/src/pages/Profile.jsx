import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../store/AuthContext";
import StatusMessage from "../component/StatusMessage";
import { useNavigate } from "react-router";
import { InputField } from "../component/InputField"; 
import { TextareaField } from "../component/TextareaField"; 
import { SelectField } from "../component/SelectField";
import { cities } from "../constant/constant";

const LOCATION_OPTIONS = cities;

// Define Country Code options
const COUNTRY_CODE_OPTIONS = [
    { value: '+91', label: '+91 (India)' },
    { value: '+1', label: '+1 (USA/Canada)' },
    { value: '+44', label: '+44 (UK)' },
    { value: '+61', label: '+61 (Australia)' },
    { value: '+49', label: '+49 (Germany)' },
];

// Helper to parse phone number into code and number
const parsePhoneNumber = (fullNumber) => {
    if (!fullNumber) return { code: COUNTRY_CODE_OPTIONS[0].value, number: '' };

    // Try to find a matching country code at the start of the string
    for (const option of COUNTRY_CODE_OPTIONS) {
        if (fullNumber.startsWith(option.value + '-')) {
            return {
                code: option.value,
                number: fullNumber.substring(option.value.length + 1)
            };
        }
    }
    // Default to the first country code and the full number (or empty string)
    return { 
        code: COUNTRY_CODE_OPTIONS[0].value, 
        number: fullNumber.replace(/^\+\d+-?/, '') 
    };
};

const INITIAL_USER_DATA = {
    firstName: '',
    lastName: '',
    jobTitle: '', // <-- ADDED
    location: LOCATION_OPTIONS[0].value, 
    phoneNumber: '', // This will hold the API format: +91-1234567890
    bio: '',
};

const Profile = () => {

    const { token, BASE_URL, refeshUserToken, setProfile} = useAuth(); 
    const navigate = useNavigate();

    const [editedData, setEditedData] = useState(INITIAL_USER_DATA); 
    const [savedData, setSavedData] = useState(INITIAL_USER_DATA); 
    
    // State to manage separate inputs for phone number display
    const { code: initialCode, number: initialNumber } = parsePhoneNumber(INITIAL_USER_DATA.phoneNumber);
    const [countryCode, setCountryCode] = useState(initialCode);
    const [localNumber, setLocalNumber] = useState(initialNumber);
    
    const [profileExists, setProfileExists] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });
    const [isEditing, setIsEditing] = useState(false); 

    const clearStatus = () => setStatus({ message: '', type: '' });

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${BASE_URL}/user/get-profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const profileData = await response.json();
                // Ensure profileData includes jobTitle when merging
                const mergedData = { ...INITIAL_USER_DATA, ...profileData };
                
                setEditedData(mergedData); 
                setSavedData(mergedData);
                setProfileExists(true);
                setProfile(profileData);
                setStatus({ message: "Profile loaded successfully.", type: 'success' });
                setIsEditing(false); 

                // Separate phone number logic on load
                const { code, number } = parsePhoneNumber(profileData.phoneNumber);
                setCountryCode(code);
                setLocalNumber(number);

            } else if (response.status === 404) {
                setProfileExists(false);
                setStatus({ message: "No profile found. Please create one.", type: 'info' });
                setIsEditing(true); 
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch profile: ${response.status}`);
            }
        } catch (error) {
            console.error("Fetch profile error:", error);
            setStatus({ message: error.message || "Could not connect to API to fetch profile.", type: 'error' });
        } finally {
            setLoading(false);
        }
    }, [token, BASE_URL, setProfile]);

    useEffect(() => {
        if(!profileExists){
            setIsEditing(true)
        }
        fetchProfile();
    }, [fetchProfile, profileExists]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        // Handle normal fields
        if (name === 'localNumber') {
            setLocalNumber(value);
        } else if (name === 'countryCode') {
            setCountryCode(value);
        } else {
            setEditedData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isEditing) return;

        clearStatus();
        setSubmitting(true);

        // Phone number formatting and validation
        const cleanedLocalNumber = localNumber.replace(/[^0-9]/g, '');
        if (!cleanedLocalNumber || cleanedLocalNumber.length < 5) {
            setStatus({ message: "Please enter a valid phone number.", type: 'error' });
            setSubmitting(false);
            return;
        }

        if (editedData.location === LOCATION_OPTIONS[0].value) {
            setStatus({ message: "Please select your location city.", type: 'error' });
            setSubmitting(false);
            return;
        }

        // 1. Format the phone number as required: {code}-{number}
        const formattedPhoneNumber = `${countryCode}-${cleanedLocalNumber}`;

        // 2. Create the data payload by updating the phone number field
        const dataToSend = {
            ...editedData,
            phoneNumber: formattedPhoneNumber,
        };

        const method = profileExists ? 'PUT' : 'POST';
        const endpoint = profileExists ? '/user/update-profile' : '/user/build-profile';

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: method,
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend), // Send the formatted data
            });

            const result = await response.json();

            if (response.ok) {
                // Update editedData and savedData with the correctly formatted number
                const finalData = { ...dataToSend };
                setEditedData(finalData);
                setSavedData(finalData); 
                setProfileExists(true); 
                setStatus({ message: result.message || "Profile operation successful!", type: 'success' });
                setIsEditing(false); 
                
                if(!profileExists){
                    refeshUserToken(); 
                }

            } else {
                throw new Error(result.message || `API Error: ${response.status}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setEditedData(savedData); 
            // Revert local state to the saved number format
            const { code, number } = parsePhoneNumber(savedData.phoneNumber);
            setCountryCode(code);
            setLocalNumber(number);
            setStatus({ message: error.message || "Failed to save profile. Check API server.", type: 'error' });
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleCancel = () => {
        setEditedData(savedData);
        // Reset local phone state to saved data
        const { code, number } = parsePhoneNumber(savedData.phoneNumber);
        setCountryCode(code);
        setLocalNumber(number);
        setIsEditing(false);
        clearStatus();
    };


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-xl text-indigo-600 flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <span>Loading profile data...</span>
                </div>
            </div>
        );
    }

    const buttonText = profileExists ? 'Update Profile' : 'Build Profile';
    const formTitle = profileExists ? 
        (isEditing ? 'Edit Your Professional Profile' : 'Your Professional Profile') : 
        'Complete Your Profile';


    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-3 sm:px-6 lg:px-8 mt-12">
                <div className="max-w-4xl mx-auto">
                    
                    <StatusMessage 
                        message={status.message} 
                        type={status.type} 
                        onClose={clearStatus} 
                    />

                    <div className="bg-white p-4 sm:p-8 md:p-10 rounded-xl shadow-2xl border-t-8 border-indigo-600">
                        
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 sm:mb-0">
                                {formTitle}
                            </h1>
                            {!loading && profileExists && !submitting && (
                                <button
                                    onClick={() => {
                                        if (isEditing) handleCancel(); 
                                        else setIsEditing(true);
                                    }}
                                    className={`w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 shadow-md ${
                                        isEditing 
                                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    }`}
                                >
                                    {isEditing ? 'Discard Changes & View' : 'Edit Profile'} 
                                </button>
                            )}
                        </div>

                        <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit}>
                            
                            <div className="space-y-6 border-b border-gray-200 pb-6">
                                <h2 className="text-lg sm:text-xl text-start font-semibold text-indigo-600">1. Personal Details</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <InputField 
                                        label="First Name" name="firstName" 
                                        value={editedData.firstName || ''} onChange={handleChange}
                                        placeholder="e.g., Jane" required type="text"
                                        readOnly={!isEditing}
                                    />
                                    <InputField 
                                        label="Last Name" name="lastName" 
                                        value={editedData.lastName || ''} onChange={handleChange}
                                        placeholder="e.g., Doe" required type="text"
                                        readOnly={!isEditing}
                                    />
                                    
                                    {/* --- ADDED JOB TITLE FIELD --- */}
                                    <div className="sm:col-span-2">
                                        <InputField 
                                            label="Job Title" name="jobTitle" 
                                            value={editedData.jobTitle || ''} onChange={handleChange}
                                            placeholder="e.g., Senior Java Developer, Software Engineer" required type="text"
                                            readOnly={!isEditing}
                                        />
                                    </div>
                                    {/* --- END ADDED JOB TITLE FIELD --- */}
                                </div>
                                
                                <SelectField 
                                    label="Location (City, India)" 
                                    name="location" 
                                    value={editedData.location || ''} 
                                    onChange={handleChange}
                                    options={LOCATION_OPTIONS} 
                                    required 
                                    readOnly={!isEditing}
                                />

                                {/* --- REFACTORED PHONE NUMBER INPUTS --- */}
                                <div className="grid grid-cols-3 gap-4 sm:gap-6">
                                    <div className="col-span-1">
                                        <SelectField 
                                            label="Code" 
                                            name="countryCode" 
                                            value={countryCode} 
                                            onChange={handleChange}
                                            options={COUNTRY_CODE_OPTIONS} 
                                            required 
                                            readOnly={!isEditing}
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <InputField 
                                            label="Phone Number" 
                                            name="localNumber" 
                                            value={localNumber} 
                                            onChange={handleChange}
                                            placeholder="98765 43210" 
                                            required 
                                            type="tel"
                                            readOnly={!isEditing}
                                        />
                                    </div>
                                </div>
                                {/* --- END REFACTORED PHONE NUMBER INPUTS --- */}
                            </div>
                            
                            <div className="space-y-6">
                                <h2 className="text-lg sm:text-xl text-start font-semibold text-indigo-600">2. Professional Summary</h2>
                                
                                <TextareaField
                                    label="Professional Summary / Bio" name="bio" 
                                    value={editedData.bio || ''} onChange={handleChange}
                                    placeholder="Write a brief summary of your skills and experience (3-5 sentences recommended)." required
                                    readOnly={!isEditing}
                                />
                            </div>
                            
                            {isEditing && (
                                <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                                    {profileExists && (
                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            disabled={submitting}
                                            className="w-full sm:w-auto px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-100 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <button 
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white text-lg font-semibold rounded-lg shadow-xl hover:bg-indigo-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Saving...' : buttonText}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;