const cities = [
    { value: '', label: 'Select City', disabled: true },
    
    // Tier 1 Cities (Major Hubs)
    { value: 'Amreli', label: 'Amreli (United state of india)' },
    { value: 'Bengaluru', label: 'Bengaluru (Bangalore)' },
    { value: 'Mumbai', label: 'Mumbai' },
    { value: 'Delhi NCR', label: 'Delhi NCR (Gurgaon, Noida, etc.)' },
    { value: 'Chennai', label: 'Chennai' },
    { value: 'Hyderabad', label: 'Hyderabad' },
    { value: 'Kolkata', label: 'Kolkata' },
    { value: 'Pune', label: 'Pune' },
    { value: 'Ahmedabad', label: 'Ahmedabad' },
    
    // Tier 2 Cities (Growing Hubs)
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
    
    // Catch-all options
    { value: 'REMOTE_INDIA', label: 'Remote (Anywhere in India)' },
    { value: 'OTHER_INDIA', label: 'Other Indian City (Not Listed)' },
];

const employees_option = [
    { value: 'ALL', label: 'All Employment Types' },
    { value: 'FULL_TIME', label: 'Full-Time' },
    { value: 'PART_TIME', label: 'Part-Time' },
    { value: 'INTERNSHIP', label: 'Internship' }
];

const sort_option = [
    { value: 'postedDate_DESC', label: 'Newest First' },
    { value: 'postedDate_ASC', label: 'Oldest First' },
];

const DEGREE_OPTIONS = [
    // Undergraduate Degrees
    { value: 'ASSOCIATE', label: 'Associate Degree (A.A., A.S., A.A.S.)' },
    { value: 'BACHELOR_ARTS', label: 'Bachelor of Arts (B.A.)' },
    { value: 'BACHELOR_SCIENCE', label: 'Bachelor of Science (B.S.)' },
    { value: 'BACHELOR_ENGINEERING', label: 'Bachelor of Engineering (B.Eng., B.E.)' },
    { value: 'BACHELOR_BUSINESS', label: 'Bachelor of Business Admin (B.B.A.)' },
    { value: 'BACHELOR_OTHER', label: 'Other Bachelor’s Degree' },
    
    // Graduate/Post-Graduate Degrees
    { value: 'MASTER_ARTS', label: 'Master of Arts (M.A.)' },
    { value: 'MASTER_SCIENCE', label: 'Master of Science (M.S.)' },
    { value: 'MBA', label: 'Master of Business Admin (M.B.A.)' },
    { value: 'MASTER_ENGINEERING', label: 'Master of Engineering (M.Eng.)' },
    { value: 'MASTER_OTHER', label: 'Other Master’s Degree' },
    
    // Doctoral/Professional Degrees
    { value: 'PHD', label: 'Doctor of Philosophy (Ph.D.)' },
    { value: 'MD_MED', label: 'Doctor of Medicine (M.D., D.O.)' },
    { value: 'JD_LAW', label: 'Juris Doctor (J.D.) / Law Degree' },
    { value: 'DOCTORATE_OTHER', label: 'Other Doctorate Degree' },
    
    // Non-Degree Credentials
    { value: 'CERTIFICATE', label: 'Professional Certificate / Technical Diploma' },
    { value: 'DIPLOMA', label: 'High School Diploma / GED Equivalent' },
    { value: 'COURSEWORK', label: 'Relevant Coursework Only' },
    { value: 'OTHER', label: 'Other / Non-Degree' },
];

const FIELD_OPTIONS = [
    // Technology & IT
    { value: 'CS_IT', label: 'Computer Science / Software Engineering' },
    { value: 'DATA_SCIENCE', label: 'Data Science / Analytics / AI' },
    { value: 'NETWORKING', label: 'Information Systems / Network Security' },
    
    // Engineering (Specific Disciplines)
    { value: 'ELECTRICAL_ENG', label: 'Electrical / Electronics Engineering' },
    { value: 'MECHANICAL_ENG', label: 'Mechanical Engineering' },
    { value: 'CIVIL_ENG', label: 'Civil / Structural Engineering' },
    { value: 'CHEMICAL_ENG', label: 'Chemical Engineering' },
    { value: 'GENERAL_ENG', label: 'General / Industrial Engineering' },
    
    // Business & Finance
    { value: 'BUSINESS_ADMIN', label: 'Business Administration / Management' },
    { value: 'FINANCE_ACCOUNTING', label: 'Finance / Accounting' },
    { value: 'MARKETING_SALES', label: 'Marketing / Advertising / PR' },
    { value: 'ECONOMICS', label: 'Economics' },
    { value: 'HUMAN_RESOURCES', label: 'Human Resources' },
    
    // Health & Medicine
    { value: 'MEDICINE', label: 'Medicine / Pre-Med / Nursing' },
    { value: 'PUBLIC_HEALTH', label: 'Public Health' },
    { value: 'BIOLOGY_LIFE_SCI', label: 'Biology / Life Sciences' },
    { value: 'PHARMACY', label: 'Pharmacy' },
    
    // Science & Mathematics
    { value: 'PHYSICS_MATH', label: 'Physics / Mathematics / Statistics' },
    { value: 'CHEMISTRY', label: 'Chemistry' },
    { value: 'ENVIRONMENTAL_SCI', label: 'Environmental Science / Geology' },
    
    // Humanities, Arts & Social Sciences
    { value: 'LIBERAL_ARTS', label: 'Liberal Arts / General Studies' },
    { value: 'COMMUNICATIONS', label: 'Communications / Journalism' },
    { value: 'PSYCHOLOGY_SOCIAL', label: 'Psychology / Sociology / Social Work' },
    { value: 'FINE_ARTS', label: 'Fine Arts / Design / Music' },
    { value: 'EDUCATION', label: 'Education / Teaching' },
    { value: 'HISTORY_POLI', label: 'History / Political Science / Law' },
    
    // Miscellaneous
    { value: 'MILITARY', label: 'Military Science / Studies' },
    { value: 'OTHER', label: 'Other' },
];

const location_option = [
    { value: 'ALL', label: 'All Location Types' },
    { value: 'ON_SITE', label: 'On-Site' },
    { value: 'REMOTE', label: 'Remote' },
    { value: 'HYBRID', label: 'Hybrid' },
];

const size_option = [
    { value: '', label: 'Select Company Size', disabled: true },
    { value: '1-50', label: '1 - 50 employees (Small)' },
    { value: '51-200', label: '51 - 200 employees (Medium)' },
    { value: '201-1000', label: '201 - 1000 employees (Large)' },
    { value: '1000+', label: '1000+ employees (Enterprise)' },
];

const status_option = [
    { value: 'ALL', label: 'All Jobs (Active/Inactive)' },
    { value: 'ACTIVE', label: 'Only Active Jobs' },
    { value: 'NON_EXPIRED', label: 'Jobs Not Expired' },
    { value: 'APPROVED', label: 'Job Approved' },
    { value: 'NEEDS_APPROVAL', label: 'Needs Approval (Inactive)' },
];

export { cities, size_option, location_option, employees_option, sort_option, status_option, FIELD_OPTIONS, DEGREE_OPTIONS};