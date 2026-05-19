import { CalendarDays, MapPin } from "lucide-react";
import { useNavigate } from "react-router";

export const JobCard = ({ job }) => {
    const navigate = useNavigate();
    
    // Determine status based on deadline
    const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
    const statusText = isExpired ? 'EXPIRED' : 'ACTIVE';
    const statusColorClass = isExpired ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';

    // Format location string
    const locationText = job.city && job.locationType 
        ? `${job.city} (${job.locationType.replace(/_/g, ' ')})`
        : (job.locationType ? job.locationType.replace(/_/g, ' ') : 'Remote');
    
    const cardClass = isExpired ? 'opacity-60 bg-gray-50' : 'bg-white';

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };
    
    return (
        <div 
            className={`p-6 rounded-xl shadow-md transition-all duration-300 border border-gray-100 flex flex-col space-y-4 hover:border-indigo-400 hover:shadow-lg cursor-pointer ${cardClass}`}
            onClick={() => navigate(`view/${job.id}`)}
        >
            {/* Header: Job Title and Status Badge */}
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900 leading-tight">{job.title || 'Untitled Job'}</h3>
                <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-md ${statusColorClass}`}>
                    {statusText}
                </span>
            </div>

            {/* Company Name */}
            <p className="text-sm text-gray-600 font-medium -mt-2">{job.id || 'N/A'}</p> {/* Added company name */}

            {/* Key Details - Location and Employment Type */}
            <div className="flex flex-col space-y-2 text-sm text-gray-700">
                {/* Location */}
                <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>{locationText}</span>
                </div>
                
                {/* Employment Type */}
                <div className="flex items-center space-x-2">
                    <CalendarDays className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span>{job.employmentType ? job.employmentType.replace(/_/g, ' ').toUpperCase() : 'N/A'}</span>
                </div>
            </div>

            {/* Required Skills (Simplified, as per image) */}
            {job.requiredSkill && job.requiredSkill.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {job.requiredSkill.slice(0, 3).map((skill, index) => ( // Limiting to 3 as in the image
                        <span key={index} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-md">
                            {skill}
                        </span>
                    ))}
                </div>
            )}

            {/* Footer: Posted Date and Deadline */}
            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-dashed border-gray-200">
                <span>Posted: {formatDate(job.postedDate)}</span>
                <span>Deadline: {formatDate(job.deadline)}</span>
            </div>
        </div>
    );
};