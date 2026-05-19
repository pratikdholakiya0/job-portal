import React, { useState, useEffect, useCallback, useMemo, useRef, forwardRef } from 'react';
import { Plus, Trash2, Save, User, BookOpen, Briefcase, Zap, AlertCircle, X, Eye, Edit, Link, Linkedin, Github, Twitter, Phone, Mail, MapPin, ChevronRight, FileDown } from 'lucide-react'; 
import { useAuth } from '../store/AuthContext';
import { EducationForm } from '../component/forms/EducationForm';
import SkillInput from '../component/SkillInput';
import { ExperienceForm } from '../component/forms/ExperienceForm';
import { InputField } from '../component/InputField';
import Header from '../component/Header'; // Imported Header

// --- VIEW MODE DISPLAY COMPONENT (CLEANED UP) ---
const ViewModeDisplay = forwardRef(({ resumeData, profile }, ref) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const socialLinks = [
        { key: 'linkedin', icon: Linkedin, label: 'LinkedIn' },
        { key: 'github', icon: Github, label: 'GitHub' },
        { key: 'twitter', icon: Twitter, label: 'Twitter' },
        { key: 'portfolio', icon: Link, label: 'Portfolio' },
    ];
    
    const name = `${resumeData.firstName || ''} ${resumeData.lastName || ''}`.trim();
    const displayEmail = resumeData.email;
    const displayPhone = resumeData.phoneNumber;
    const displayLocation = resumeData.location;
    
    // Function to cleanly render social links with separators
    const renderSocialLinks = () => {
        const links = [];
        socialLinks.forEach(({ key, icon: Icon, label }) => {
            if (resumeData[key]) {
                
                // --- MODIFIED CODE START ---
                // Clean the URL for display (removes 'http://', 'https://', 'www.')
                const cleanUrl = (resumeData[key] || '').replace(/^(https?:\/\/)?(www\.)?/, '');
                
                links.push(
                    <a 
                        key={key} 
                        href={resumeData[key]} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-indigo-600 hover:text-indigo-800 flex items-center print:text-gray-700 print:hover:text-gray-700 print:no-underline"
                    >
                        {/* Always display the readable URL in print */}
                        <Icon className="w-4 h-4 mr-1 print:hidden" />
                        <span className="print:hidden">{label}</span>
                        <span className="hidden print:inline print:underline print:decoration-dotted print:text-xs">
                            {cleanUrl}
                        </span>
                    </a>
                );
                // --- MODIFIED CODE END ---
            }
        });

        // Interleave with separators
        return links.reduce((acc, current, index) => {
            // Use the print:hidden utility to hide the separator on print
            if (index > 0 && acc.length > 0) {
                 acc.push(<span key={`sep-${index}`} className="mx-2 text-gray-400 flex-shrink-0 print:hidden">|</span>);
                 // Add a small space that appears in print if the separator is hidden
                acc.push(<span key={`sep-print-${index}`} className="mx-1 text-gray-700 flex-shrink-0 hidden print:inline"> &bull; </span>); 
            }
            acc.push(current);
            return acc;
        }, []);
    };
    
    return (
        // Add print-specific styles to ensure a clean page for PDF
        <div 
            ref={ref} 
            className="bg-white max-w-5xl p-6 rounded-xl shadow-xl border-t-4 border-green-500 space-y-8 
                       print:max-w-none print:p-0 print:shadow-none print:border-none print:space-y-4 print:text-black"
        >
            <header className="text-center border-b pb-4 mb-4 print:border-b-2 print:pb-2 print:mb-2">
                <h1 className="text-3xl font-extrabold text-gray-900 leading-tight print:text-2xl print:text-black">{name || 'Your Name'}</h1>
                <p className="text-lg font-semibold text-indigo-600 mt-1 print:text-base print:text-gray-700">{resumeData.jobTitle || 'Your Professional Title'}</p>
                
                {/* Contact Info Row */}
                <div className="text-sm text-gray-600 mt-4 space-x-3 flex justify-center items-center flex-wrap print:text-xs print:mt-1 print:space-x-1">
                    {displayEmail && <span className="flex items-center flex-shrink-0"><Mail className="w-4 h-4 inline mr-1 print:hidden" /><span className='print:underline print:decoration-dotted'>{displayEmail}</span></span>}
                    {displayEmail && (displayPhone || displayLocation) && <span className="mx-2 text-gray-400 flex-shrink-0 print:inline print:mx-1 print:text-gray-700">|</span>}
                    {displayPhone && <span className="flex items-center flex-shrink-0"><Phone className="w-4 h-4 inline mr-1 print:hidden" />{displayPhone}</span>}
                    {displayPhone && displayLocation && <span className="mx-2 text-gray-400 flex-shrink-0 print:inline print:mx-1 print:text-gray-700">|</span>}
                    {displayLocation && <span className="flex items-center flex-shrink-0"><MapPin className="w-4 h-4 inline mr-1 print:hidden" />{displayLocation}</span>}
                </div>
                    
                {/* Social Links Row */}
                <div className="text-sm text-gray-600 mt-3 flex justify-center items-center flex-wrap print:text-xs print:mt-1 print:space-x-1">
                    {renderSocialLinks()}
                </div>
            </header>

            {/* 1. Summary */}
            {resumeData.bio && (
                <section className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center border-b-2 border-indigo-200 pb-1 print:text-lg print:border-b print:border-gray-500 print:text-black">
                        <User className="w-5 h-5 mr-2 text-green-500 print:hidden" /> Professional Summary
                    </h2>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap print:text-xs print:leading-snug">{resumeData.bio}</p>
                </section>
            )}

            {/* 2. Work Experience */}
            {resumeData.experienceList.length > 0 && (
                <section className="space-y-4 print:space-y-2">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center border-b-2 border-indigo-200 pb-1 print:text-lg print:border-b print:border-gray-500 print:text-black">
                        <Briefcase className="w-5 h-5 mr-2 text-green-500 print:hidden" /> Work Experience
                    </h2>
                    <div className="space-y-4 print:space-y-2">
                        {resumeData.experienceList.map((exp, index) => (
                            <div key={index} className="pl-4 border-l-2 border-indigo-600 print:border-l print:border-gray-400 print:pl-2">
                                <div className="flex flex-col-reverse sm:flex-row justify-between items-start">
                                    <h3 className="text-base font-semibold text-gray-900 leading-snug flex-1 print:text-sm print:font-bold print:text-black">{exp.jobTitle} at {exp.companyName}</h3>
                                    <p className="text-xs font-medium text-gray-500 whitespace-nowrap mb-0.5 sm:mb-0 flex-shrink-0 ml-4 print:text-xs print:font-normal print:text-gray-700 print:ml-0">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                                </div>
                                {exp.description && (
                                    <ul className="list-disc list-outside space-y-0.5 ml-4 mt-1 print:list-none print:ml-0 print:space-y-0">
                                        {exp.description.split('\n').map((line, lineIndex) => 
                                            line.trim() ? (
                                                <li key={lineIndex} className="text-sm text-gray-700 leading-snug print:text-xs print:leading-tight print:before:content-['\2022\0020'] print:before:text-gray-700 print:pl-2">{line.trim()}</li>
                                            ) : null
                                        )}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 3. Education */}
            {resumeData.educationList.length > 0 && (
                <section className="space-y-4 print:space-y-2">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center border-b-2 border-indigo-200 pb-1 print:text-lg print:border-b print:border-gray-500 print:text-black">
                        <BookOpen className="w-5 h-5 mr-2 text-green-500 print:hidden" /> Education
                    </h2>
                    <div className="space-y-4 print:space-y-2">
                        {resumeData.educationList.map((edu, index) => (
                            <div key={index} className="pl-4 border-l-2 border-indigo-600 print:border-l print:border-gray-400 print:pl-2">
                                <div className="flex flex-col-reverse sm:flex-row justify-between items-start">
                                    <h3 className="text-base font-semibold text-gray-900 leading-snug flex-1 print:text-sm print:font-bold print:text-black">{edu.degree} in {edu.fieldOfStudy}</h3>
                                    <p className="text-xs font-medium text-gray-500 whitespace-nowrap mb-0.5 sm:mb-0 flex-shrink-0 ml-4 print:text-xs print:font-normal print:text-gray-700 print:ml-0">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                                </div>
                                <p className="text-sm text-indigo-600 print:text-sm print:font-medium print:text-gray-700">{edu.institutionName}</p>
                                {edu.gradeOrGPA && <p className="text-xs text-gray-600 mt-0.5 print:text-xs print:mt-0">GPA/Grade: {edu.gradeOrGPA}</p>}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 4. Skills */}
            {resumeData.skillList && resumeData.skillList.length > 0 && (
                <section className="space-y-2">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center border-b-2 border-indigo-200 pb-1 print:text-lg print:border-b print:border-gray-500 print:text-black">
                        <Zap className="w-5 h-5 mr-2 text-green-500 print:hidden" /> Key Skills
                    </h2>
                    <div className="flex flex-wrap gap-2 pt-2 print:gap-1">
                        {resumeData.skillList.map((skill, index) => {
                            const skillName = (typeof skill === 'object' && skill !== null) ? skill.name : skill;
                            
                            return skillName ? (
                                <span key={index} className="px-3 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full shadow-sm print:bg-white print:border print:border-gray-400 print:text-xs print:shadow-none print:rounded-sm print:px-2 print:py-0.5">
                                    {skillName}
                                </span>
                            ) : null;
                        })}
                    </div>
                </section>
            )}

            <div className="text-center text-xs text-gray-400 pt-3 border-t print:hidden">
                Profile Searchable: {resumeData.isSearchable ? 'Yes' : 'No'}
            </div>
        </div>
    );
});


// --- RESUME BUILDER MAIN COMPONENT ---
const ResumeBuilder = () => {
    const resumeRef = useRef(); 

    const initialResumeState = useMemo(() => ({
        id: null,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        location: '',
        jobTitle: '',
        bio: '',
        educationList: [],
        experienceList: [],
        skillList: [],
        github: '',
        twitter: '',
        linkedin: '',
        portfolio: '',
        isSearchable: true,
    }), []);

    const { token, BASE_URL, profile, resume, refeshUserToken } = useAuth(); 

    const [resumeData, setResumeData] = useState(initialResumeState);
    const [loading, setLoading] = useState(true); 
    const [saveStatus, setSaveStatus] = useState('');
    const [notification, setNotification] = useState({ message: '', type: '' }); 
    const [mode, setMode] = useState('edit');
    const [fullProfileData, setFullProfileData] = useState(undefined); 

    const INITIAL_USER_DATA = useMemo(() => ({
        firstName: '', lastName: '', email: '', phoneNumber: '', location: '', bio: '', jobTitle: ''
    }), []);


    // --- 1. EXPLICIT PROFILE FETCH FUNCTION (Unchanged) ---
    const fetchFullProfile = useCallback(async () => {
        if (!token) return null;

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
                setFullProfileData(profileData); 
                return profileData;

            } else if (response.status === 404) {
                setFullProfileData(null); 
                return null;
            } else {
                const errorData = await response.json();
                console.error("Profile fetch API error:", errorData.message);
                setFullProfileData(null);
                return null;
            }
        } catch (error) {
            console.error("Network error fetching profile:", error);
            setFullProfileData(null);
            return null;
        }
    }, [token, BASE_URL, INITIAL_USER_DATA]);
    
    // Function to load resume from the backend (GET /get) (Unchanged)
    const fetchResumeData = useCallback(async (profileData) => {
        const profilePreFill = {
            firstName: profileData?.firstName || '',
            lastName: profileData?.lastName || '',
            email: profileData?.email || '',
            phoneNumber: profileData?.phoneNumber || '',
            location: profileData?.location || '',
            bio: profileData?.bio || '', 
            jobTitle: profileData?.jobTitle || '', 
        };

        try {
            const response = await fetch(`${BASE_URL}/resume/get`, {
                method: 'GET',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                
                setResumeData({
                    ...initialResumeState,
                    ...data, 
                    ...profilePreFill, 
                });
            } else if (response.status === 404) {
                setResumeData({
                    ...initialResumeState,
                    ...profilePreFill, 
                });
            } else {
                const errorBody = await response.json();
                console.error("Error loading resume:", errorBody);
                setSaveStatus(`Error loading resume: ${errorBody.message || 'Server error'}`);
            }
        } catch (error) {
            console.error("Network error loading resume:", error);
            setSaveStatus("Network error: Could not connect to the backend for resume.");
        }
    }, [initialResumeState, token, BASE_URL]);

    // 2. EFFECT HOOK: Controls the master loading state (Unchanged)
    useEffect(() => {
        const masterLoader = async () => {
            if (fullProfileData === undefined && token) {
                await fetchFullProfile();
                return;
            }
            
            if (fullProfileData !== undefined) {
                
                if (fullProfileData === null || !token) {
                    setNotification({
                        message: "Authentication required or user profile not created.",
                        type: 'error'
                    });
                    setLoading(false);
                    return;
                }

                setMode(resume ? 'view' : 'edit'); 
                
                setLoading(true); 
                if(resume){
                    await fetchResumeData(fullProfileData); 
                } else {
                    const profilePreFill = {
                        firstName: fullProfileData?.firstName || '',
                        lastName: fullProfileData?.lastName || '',
                        email: fullProfileData?.email || '',
                        phoneNumber: fullProfileData?.phoneNumber || '',
                        location: fullProfileData?.location || '',
                        bio: fullProfileData?.bio || '', 
                        jobTitle: fullProfileData?.jobTitle || '',
                    };
                    setResumeData({
                        ...initialResumeState,
                        ...profilePreFill, 
                    });
                }
                setLoading(false);
            }
        };
        
        masterLoader();
        
    }, [token, fullProfileData, fetchResumeData, fetchFullProfile, resume, initialResumeState]);


    const handleSave = async () => {
        if (!token) {
            setSaveStatus("Cannot save: User is not authenticated.");
            return;
        }

        setSaveStatus("Saving...");
        
        const method = resumeData.id ? 'PUT' : 'POST';
        const endpoint = resumeData.id ? `${BASE_URL}/resume/update` : `${BASE_URL}/resume/create`;
        
        const validatedSkillList = resumeData.skillList.filter(s => s.name?.trim() !== '');

        const dataToSend = {
            id: resumeData.id,
            educationList: resumeData.educationList,
            experienceList: resumeData.experienceList,
            skillList: validatedSkillList,
            github: resumeData.github,
            twitter: resumeData.twitter,
            linkedin: resumeData.linkedin,
            portfolio: resumeData.portfolio,
            isSearchable: resumeData.isSearchable,
        };

        try {
            const response = await fetch(endpoint, {
                method: method,
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization' : `Bearer ${token}`
                },
                body: JSON.stringify(dataToSend),
            });

            if (response.ok) {
                const responseMessage = await response.json();
                setSaveStatus(responseMessage.message || "Profile saved successfully!");

                if (method === 'POST' && !resume) {
                    await refeshUserToken(); 
                }
                
                await fetchFullProfile(); 
                
                setMode('view'); 
                setTimeout(() => setSaveStatus(''), 3000);

            } else {
                const errorBody = await response.json();
                console.error(`Error saving profile (${method}):`, errorBody);
                setSaveStatus(`Save Failed: ${errorBody.message || 'Server error'}`);
            }

        } catch (error) {
            console.error("Network error saving resume:", error);
            setSaveStatus("Network error: Could not connect to the backend.");
        }
    };

    // Removed isDownloading state as it's not needed for window.print()
    // const [isDownloading, setIsDownloading] = useState(false);

    // --- handleDownloadPDF function (Triggering print) ---
    const handleDownloadPDF = async () => {
        // setIsDownloading(true); // No longer needed
        if (mode === 'edit') {
            setNotification({
                message: "Please switch to View Mode before downloading or printing the resume.",
                type: 'info' 
            });
            setTimeout(() => setNotification({ message: '', type: '' }), 4000);
            return;
        }
        
        // Use browser's print dialog, which allows saving as PDF
        window.print();
        // setIsDownloading(false); // No longer needed
    };

    // --- General Change Handler for single fields (Unchanged) ---
    const handleFieldChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (['firstName', 'lastName', 'email', 'phoneNumber', 'location', 'bio', 'jobTitle'].includes(name)) { // Check for all read-only fields
            return;
        }
        setResumeData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // --- List handlers (Unchanged) ---
    const handleListChange = (listName, index, field, value) => {
        setResumeData(prev => {
            const list = [...prev[listName]];
            
            if (list[index]) {
                list[index] = {
                    ...list[index],
                    [field]: value
                };
            } else {
                console.error(`Index ${index} not found in ${listName}`);
                return prev;
            }

            return {
                ...prev,
                [listName]: list,
            };
        });
    };

    const handleAddItem = (listName, defaultItem) => {
        setResumeData(prev => ({
            ...prev,
            [listName]: [...prev[listName], defaultItem],
        }));
    };

    const handleRemoveItem = (listName, index) => {
        setResumeData(prev => ({
            ...prev,
            [listName]: prev[listName].filter((_, i) => i !== index),
        }));
    };


    const defaultEducation = { institutionName: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gradeOrGPA: '' };
    const defaultExperience = { companyName: '', jobTitle: '', startDate: '', endDate: '', description: '' };


    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-base font-semibold text-indigo-600 animate-pulse">Loading Profile...</div>
            </div>
        );
    }
    
    if (notification.type === 'error') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
                <div className="max-w-md w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2"/>
                        <p className="font-bold text-base">Authorization Required</p>
                    </div>
                    <p className="mt-2 text-xs">{notification.message}</p>
                    <p className="mt-2 text-xs text-red-600">Please complete your user profile setup in your application's settings.</p>
                </div>
            </div>
        );
    }
    
    const ModeToggleButton = () => (
        <button
            onClick={() => {
                setMode(mode === 'edit' ? 'view' : 'edit');
                setNotification({ message: '', type: '' }); // Clear info notification on mode switch
            }}
            className={`flex items-center px-5 py-2 text-sm font-semibold rounded-full shadow-lg transition duration-300 transform hover:scale-105 ${ 
                mode === 'edit' 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
        >
            {mode === 'edit' ? <Eye className="w-4 h-4 mr-1" /> : <Edit className="w-4 h-4 mr-1" />}
            {mode === 'edit' ? 'View Mode' : 'Edit Mode'}
        </button>
    );
    
    const isReadOnly = mode === 'view';

    return (
        <>
            {/* 1. External Header - Ensure this is hidden on print using a wrapper div */}
            <div className="print:hidden">
                <Header/>
            </div>
            
            {/* 2. Main Builder/Resume Content */}
            <div className="min-h-screen bg-gray-50 p-3 md:p-6 mt-20 font-sans print:mt-0 print:bg-white print:p-0">
            
                {/* Internal Controls Header - Already hidden with print:hidden */}
                <header className="max-w-4xl mx-auto mb-4 bg-white p-4 rounded-xl shadow-lg flex justify-between items-center flex-wrap sticky top-0 z-10 print:hidden">
                    <h1 className="text-xl font-extrabold text-gray-900 flex items-center mb-3 md:mb-0">
                        <User className="w-6 h-6 text-indigo-600 mr-2" /> Professional Profile
                    </h1>
                    <div className="flex space-x-3">
                        {/* Download Button */}
                        {mode === 'view' && (
                            <button
                                onClick={handleDownloadPDF}
                                className="flex items-center px-5 py-2 bg-green-600 text-white text-sm font-semibold rounded-full shadow-lg hover:bg-green-700 transition duration-300 transform hover:scale-[1.02]"
                            >
                                <FileDown className="w-4 h-4 mr-1" />
                                Download PDF
                            </button>
                        )}
                        
                        <ModeToggleButton />
                        
                        {mode === 'edit' && (
                            <button
                                onClick={handleSave}
                                className="flex items-center px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
                            >
                                <Save className="w-4 h-4 mr-1" />
                                {saveStatus === 'Saving...' ? 'Saving...' : 'Save Profile'}
                            </button>
                        )}
                    </div>
                    
                    {notification.type === 'info' && (
                        <div className="w-full mt-3 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-2 rounded-lg text-sm flex items-center">
                            <AlertCircle className="w-4 h-4 mr-2"/>{notification.message}
                        </div>
                    )}
                </header>
                
                {/* Main Content */}
                <main className="max-w-4xl mx-auto space-y-6 print:max-w-none print:space-y-0 print:mx-0">
                    
                    {isReadOnly ? (
                        // RENDER VIEW MODE
                        <ViewModeDisplay ref={resumeRef} resumeData={resumeData} profile={fullProfileData} />

                    ) : (
                        // --- EDIT MODE RENDER (Unchanged) ---
                        <div className="bg-white p-6 rounded-xl shadow-2xl border-t-4 border-indigo-500 space-y-6">
                            
                            {/* 1. Personal Info, Job Title, Bio & Links Section (Content Omitted for brevity) */}
                            <section className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center text-indigo-600">
                                    1. Personal & Professional Summary
                                </h2>
                                
                                <p className="text-xs text-red-500 mb-3 font-medium">
                                    Note: Personal details (Name, Email, Phone, Location, Bio, Job Title) are **read-only** and must be updated in your main Profile settings.
                                </p>

                                {/* --- PERSONAL INFO FIELDS (READ-ONLY) --- */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <InputField
                                        label="First Name"
                                        name="firstName"
                                        value={resumeData.firstName}
                                        onChange={handleFieldChange}
                                        required={true}
                                        readOnly={true}
                                    />
                                    <InputField
                                        label="Last Name"
                                        name="lastName"
                                        value={resumeData.lastName}
                                        onChange={handleFieldChange}
                                        required={true}
                                        readOnly={true}
                                    />
                                    <InputField
                                        label="Job Title"
                                        name="jobTitle"
                                        value={resumeData.jobTitle}
                                        onChange={handleFieldChange}
                                        required={false}
                                        readOnly={true}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                    <InputField
                                        label="Email"
                                        name="email"
                                        value={resumeData.email}
                                        onChange={handleFieldChange}
                                        type="email"
                                        icon={Mail}
                                        required={true}
                                        readOnly={true}
                                    />
                                    <InputField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        value={resumeData.phoneNumber}
                                        onChange={handleFieldChange}
                                        type="tel"
                                        icon={Phone}
                                        readOnly={true}
                                    />
                                    <div className="md:col-span-2">
                                        <InputField
                                            label="Location (City, Country)"
                                            name="location"
                                            value={resumeData.location}
                                            onChange={handleFieldChange}
                                            icon={MapPin}
                                            readOnly={true}
                                        />
                                    </div>
                                </div>
                                
                                {/* Bio (READ-ONLY) */}
                                <div className="mb-3 mt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary/Bio</label>
                                    <textarea
                                        name="bio"
                                        value={resumeData.bio}
                                        onChange={handleFieldChange}
                                        rows="4"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out shadow-sm text-sm"
                                        readOnly={true}
                                    ></textarea>
                                </div>

                                {/* Social Link Inputs (Editable) */}
                                <h3 className="text-base font-semibold text-gray-700 mb-2 mt-4">Social Links (Editable)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <InputField label="LinkedIn URL" name="linkedin" value={resumeData.linkedin} onChange={handleFieldChange} icon={Linkedin} />
                                    <InputField label="GitHub URL" name="github" value={resumeData.github} onChange={handleFieldChange} icon={Github} />
                                    <InputField label="Twitter URL" name="twitter" value={resumeData.twitter} onChange={handleFieldChange} icon={Twitter} />
                                    <InputField label="Portfolio URL" name="portfolio" value={resumeData.portfolio} onChange={handleFieldChange} icon={Link} />
                                </div>
                                
                                {/* Searchable Checkbox */}
                                <div className="flex items-center mt-4">
                                    <input
                                        id="isSearchable"
                                        name="isSearchable"
                                        type="checkbox"
                                        checked={resumeData.isSearchable}
                                        onChange={handleFieldChange}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="isSearchable" className="ml-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
                                        Make profile searchable by recruiters
                                    </label>
                                </div>
                            </section>

                            {/* 2. Education Section (Content Omitted for brevity) */}
                            <section className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center text-indigo-600">
                                    2. Education <BookOpen className="w-5 h-5 ml-2 text-indigo-500" />
                                </h2>
                                <div className="space-y-3">
                                    {resumeData.educationList.map((edu, index) => (
                                        <EducationForm
                                            key={index}
                                            education={edu}
                                            index={index}
                                            onChange={(i, field, value) => handleListChange('educationList', i, field, value)}
                                            onRemove={() => handleRemoveItem('educationList', index)}
                                            readOnly={isReadOnly}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleAddItem('educationList', defaultEducation)}
                                    className="mt-4 flex items-center px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-medium rounded-full hover:bg-indigo-200 transition duration-150 shadow-md"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Education
                                </button>
                            </section>

                            {/* 3. Experience Section (Content Omitted for brevity) */}
                            <section className="border-b border-gray-200 pb-4">
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center text-indigo-600">
                                    3. Work Experience <Briefcase className="w-5 h-5 ml-2 text-indigo-500" />
                                </h2>
                                <div className="space-y-3">
                                    {resumeData.experienceList.map((exp, index) => (
                                        <ExperienceForm
                                            key={index}
                                            experience={exp}
                                            index={index}
                                            onChange={(i, field, value) => handleListChange('experienceList', i, field, value)}
                                            onRemove={() => handleRemoveItem('experienceList', index)}
                                            readOnly={isReadOnly}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleAddItem('experienceList', defaultExperience)}
                                    className="mt-4 flex items-center px-3 py-1 bg-indigo-100 text-indigo-600 text-sm font-medium rounded-full hover:bg-indigo-200 transition duration-150 shadow-md"
                                >
                                    <Plus className="w-4 h-4 mr-1" /> Add Experience
                                </button>
                            </section>

                            {/* 4. Skills Section (Content Omitted for brevity) */}
                            <section>
                                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center text-indigo-600">
                                    4. Key Skills <Zap className="w-5 h-5 ml-2 text-indigo-500" />
                                </h2>
                                
                                <SkillInput 
                                    requiredSkills={resumeData.skillList}
                                    setRequiredSkills={(newSkillList) => setResumeData(prev => ({ ...prev, skillList: newSkillList }))}
                                    readOnly={isReadOnly} 
                                />
                                
                            </section>
                        </div>
                    )}
                </main>

                {/* Footer - Already hidden with print:hidden */}
                <footer className="max-w-4xl mx-auto mt-8 p-3 text-center print:hidden">
                    {mode === 'edit' && (
                        <button
                            onClick={handleSave}
                            className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white text-lg font-bold rounded-full shadow-2xl hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02]"
                        >
                            Final Save
                        </button>
                    )}
                    
                    {saveStatus && saveStatus !== 'Saving...' && (
                        <p className={`mt-2 text-xs font-medium ${saveStatus.startsWith('Save Failed') ? 'text-red-500' : 'text-green-600'}`}>
                            {saveStatus}
                        </p>
                    )}
                </footer>
            </div>
        </>
    );
};

export default ResumeBuilder;