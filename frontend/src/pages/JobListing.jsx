import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router';
import { FilterSelect } from '../component/FilterSelect'
import { JobCard } from '../component/JobCard'
import { employees_option, location_option, sort_option } from '../constant/constant';

// --- Filter/Sort Constants ---
// STATUS_OPTIONS is removed as applicants only see 'APPROVED' and 'ACTIVE' jobs
const SORT_OPTIONS = sort_option
const EMPLOYMENT_OPTIONS = employees_option
const LOCATION_TYPE_OPTIONS = location_option

const JobListing = () => {
    // Only use BASE_URL, token is only needed if the endpoint requires auth
    // We assume a public endpoint or one that allows access with auth for personalization
    const { token, BASE_URL } = useAuth(); 
    const [jobs, setJobs] = useState([]); // Stores the master list of jobs fetched from the API
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filters relevant for applicants
    const [employmentFilter, setEmploymentFilter] = useState('ALL');
    const [locationFilter, setLocationFilter] = useState('ALL');
    const [sortType, setSortType] = useState('postedDate_DESC'); 
    const [skillMatchMode, setSkillMatchMode] = useState('ANY'); // Keep for multi-skill search
    const [searchTerm, setSearchTerm] = useState(''); 
    const [showFilters, setShowFilters] = useState(true); 

    const navigate = useNavigate();

    // Fetching logic for applicants: only approved and active jobs
    const fetchJobs = useCallback(async () => {
        
        setLoading(true);
        setError(null);

        // This endpoint should fetch jobs that are both 'approved' and 'active'
        // and have a non-expired deadline, suitable for public viewing.
        const endpoint = `/jobs/getAll`; 

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                // Include Authorization if the endpoint is protected or for personalization
                headers: {
                    'Authorization': `Bearer ${token}`, 
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 404) {
                    setJobs([]); 
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || `Failed to fetch jobs: ${response.status}`);
            }

            const data = await response.json();
            const jobsArray = Array.isArray(data) ? data : [];

            setJobs(jobsArray); // Set the master list
        
        } catch (err) {
            console.error("Fetch job listings error:", err);
            setError(err.message || "Failed to load job listings.");
        } finally {
            setLoading(false);
        }
    }, [token, BASE_URL]); 

    // Filter and Sort Logic - Simplified for Applicant View
    const filteredAndSortedJobs = React.useMemo(() => {
        const now = new Date();
        let list = [...jobs];
        const lowerCaseSearch = searchTerm.toLowerCase();

        // Parse search term into individual skills (trimming spaces and filtering empty terms)
        const searchTermsArray = lowerCaseSearch
            .split(',')
            .map(term => term.trim())
            .filter(term => term.length > 0);
        
        // 1. Title and Multi-Skill Search Filter
        if (lowerCaseSearch) {
            list = list.filter(job => {
                
                // Match Title: Always check against the raw input for simplicity
                const titleMatch = job.title && job.title.toLowerCase().includes(lowerCaseSearch);

                // Match Skills: Only proceed with advanced skill matching if parsed skills exist
                let skillMatch = false;
                if (searchTermsArray.length > 0) {
                    const jobSkills = job.requiredSkill ? job.requiredSkill.map(s => s.toLowerCase()) : [];

                    if (skillMatchMode === 'ANY') {
                        // OR Logic: Job must contain at least ONE searched skill
                        skillMatch = searchTermsArray.some(requiredSkillTerm => 
                            jobSkills.some(jobSkill => jobSkill.includes(requiredSkillTerm))
                        );
                    } else if (skillMatchMode === 'ALL') {
                        // AND Logic: Job must contain ALL searched skills
                        skillMatch = searchTermsArray.every(requiredSkillTerm => 
                            jobSkills.some(jobSkill => jobSkill.includes(requiredSkillTerm))
                        );
                    }
                }
                
                return titleMatch || skillMatch;
            });
        }
        
        // 2. Main Filters (Assuming the API already filtered for APPROVED, ACTIVE, NON_EXPIRED)
        list = list.filter(job => {
            
            // --- Employment Type Filter (Job Type) ---
            if (employmentFilter !== 'ALL' && job.employmentType !== employmentFilter) {
                return false;
            }
            
            // --- Location Type Filter (Work Environment) ---
            if (locationFilter !== 'ALL' && job.locationType !== locationFilter) {
                return false;
            }

            // If the job passed all the active filters, return true
            return true;
        });

        // 3. Sorting
        list.sort((a, b) => {
            // Safety check for null/undefined dates
            const dateA = a.postedDate ? new Date(a.postedDate) : new Date(0);
            const dateB = b.postedDate ? new Date(b.postedDate) : new Date(0);

            if (sortType === 'postedDate_DESC') {
                return dateB - dateA; // Newest first
            } else if (sortType === 'postedDate_ASC') {
                return dateA - dateB; // Oldest first
            }
            return 0;
        });

        return list;

    }, [jobs, employmentFilter, locationFilter, sortType, searchTerm, skillMatchMode]);

    // Initial fetch
    useEffect(() => {  
        fetchJobs();
    },[fetchJobs]); 
    
    // Removed handleCreateJobClick

    // Handlers
    const handleEmploymentChange = (e) => setEmploymentFilter(e.target.value);
    const handleLocationChange = (e) => setLocationFilter(e.target.value);
    const handleSortChange = (e) => setSortType(e.target.value);
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = () => {
        // Explicit search trigger (if needed, otherwise the useMemo updates automatically)
    };

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex justify-center items-center h-48">
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.96 8.96 0 0020 12c0-4.97-4.03-9-9-9a9.002 9.002 0 00-7.584 4.584M4 12c0 4.97 4.03 9 9 9a9.002 9.002 0 007.584-4.584"/></svg>
                    <p className="ml-3 text-lg text-gray-700">Loading job data...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative shadow-md" role="alert">
                    <strong className="font-bold">Connection Error:</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            );
        }

        if (filteredAndSortedJobs.length === 0) {
            return (
                <div className="text-center py-12 bg-white border border-gray-200 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-700">No Jobs Match Filters</h2>
                    <p className="text-gray-500 mt-2">Try adjusting your filters or search term.</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredAndSortedJobs.map(job => (
                    // JobCard is reused, assuming it displays applicant-relevant info
                    <JobCard key={job.id} job={job} /> 
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 mt-12 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-3xl font-extrabold text-gray-900 max-md:text-lg">
                        Find Your Next Career Opportunity
                    </h1>
                    {/* Removed 'Post New Job' button */}
                </div>
                
                {/* Filter Toggle Button for Mobile/Tablet */}
                <div className="lg:hidden mb-4">
                    <button
                        onClick={toggleFilters}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v3.414a1 1 0 01-.293.707l-3 3A1 1 0 013 20v-3.414a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7.586V4z"></path></svg>
                        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
                    </button>
                </div>

                {/* --- Main Content Grid: Filter Sidebar (1/4) and Listings (3/4) --- */}
                <div className={`grid gap-8 ${showFilters ? 'grid-cols-1 lg:grid-cols-4' : 'grid-cols-1'}`}>
                    
                    {/* Column 1: Filter Sidebar (Conditional Rendering) */}
                    <div className={`${showFilters ? 'lg:col-span-1' : 'hidden'} lg:block`}>
                        <div className="bg-white p-6 rounded-xl shadow-lg lg:sticky top-20 border border-gray-100 space-y-6">
                            <h3 className="text-xl font-bold text-gray-900 border-b pb-3">Filter & Sort</h3>
                            
                            {/* Sort Filter */}
                            <FilterSelect 
                                label="Sort By Date"
                                value={sortType} 
                                onChange={handleSortChange} 
                                options={SORT_OPTIONS} 
                            />

                            {/* Removed Status Filter - not relevant for applicants */}
                            
                            {/* Employment Type Filter */}
                            <FilterSelect 
                                label="Employment Type"
                                value={employmentFilter} 
                                onChange={handleEmploymentChange} 
                                options={EMPLOYMENT_OPTIONS} 
                            />

                            {/* Location Type Filter */}
                            <FilterSelect 
                                label="Work Environment"
                                value={locationFilter} 
                                onChange={handleLocationChange} 
                                options={LOCATION_TYPE_OPTIONS} 
                            />
                            
                            {/* Filter Toggle for desktop */}
                            <div className="hidden lg:block pt-3 border-t">
                                <button
                                    onClick={toggleFilters}
                                    className="w-full flex items-center justify-center space-x-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition duration-150"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    <span>Hide Panel</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Listings Content */}
                    <div className={showFilters ? 'lg:col-span-3' : 'lg:col-span-4'}>
                        
                        {/* Search Bar and Toggle for Hidden Filters */}
                        <div className="mb-6 flex space-x-3">
                            {/* Toggle button appears when filters are hidden on large screens */}
                            {!showFilters && (
                                <button
                                    onClick={toggleFilters}
                                    className="hidden lg:flex items-center space-x-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                    title="Show Filters"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707v3.414a1 1 0 01-.293.707l-3 3A1 1 0 013 20v-3.414a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7.586V4z"></path></svg>
                                    <span className="hidden xl:inline">Show Filters</span>
                                </button>
                            )}
                            <input
                                type="text"
                                placeholder="Search by Job Title or Skills (e.g., React, Java)..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearchSubmit(); }}
                                className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                            />
                            <button
                                onClick={handleSearchSubmit}
                                className="flex items-center px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                        </div>
                        
                        
                        <div className="text-sm text-gray-600 mb-4">
                            Showing **{filteredAndSortedJobs.length}** job results {searchTerm ? `for "${searchTerm}"` : ''}.
                        </div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobListing;