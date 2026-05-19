import React from 'react';
import { Trash2 } from 'lucide-react';
import { InputField } from "../InputField";
import { SelectField } from "../SelectField"; 
import { DEGREE_OPTIONS, FIELD_OPTIONS } from '../../constant/constant';

// --- EducationForm Component ---
export const EducationForm = ({ education, index, onChange, onRemove, readOnly = false }) => {
    
    // Universal handler to pass name and value up to the parent list handler
    const handleChange = (e) => {
        if (readOnly) return;
        onChange(index, e.target.name, e.target.value);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md mb-4 border-l-4 border-indigo-400 relative">
            <h4 className="text-md font-semibold mb-3 text-indigo-600">Education #{index + 1}</h4>
            
            <InputField 
                label="Institution Name" 
                name="institutionName" 
                value={education.institutionName} 
                onChange={handleChange}
                readOnly={readOnly}
                required={true}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* DEGREE */}
                <SelectField
                    label="Degree"
                    name="degree"
                    value={education.degree || ''}
                    options={DEGREE_OPTIONS}
                    onChange={handleChange}
                    readOnly={readOnly}
                    required={true}
                />
                
                {/* FIELD OF STUDY */}
                <SelectField
                    label="Field of Study"
                    name="fieldOfStudy"
                    value={education.fieldOfStudy || ''}
                    options={FIELD_OPTIONS}
                    onChange={handleChange}
                    readOnly={readOnly}
                    required={true}
                />
            </div>
            
            {/* DATES */}
            <div className="grid grid-cols-2 gap-4">
                <InputField 
                    label="Start Date" 
                    name="startDate" 
                    value={education.startDate} 
                    onChange={handleChange} 
                    type="date"
                    readOnly={readOnly}
                />
                <InputField 
                    label="End Date" 
                    name="endDate" 
                    value={education.endDate} 
                    onChange={handleChange} 
                    type="date"
                    readOnly={readOnly}
                />
            </div>
            
            {/* GPA/GRADE */}
            <div className="mb-4"> 
                <InputField 
                    label="Grade or GPA" 
                    name="gradeOrGPA" 
                    value={education.gradeOrGPA} 
                    onChange={handleChange}
                    readOnly={readOnly} 
                />
            </div>
            
            {!readOnly && (
                <button
                    onClick={() => onRemove(index)}
                    className="absolute top-4 right-4 text-red-600 hover:text-red-800 transition duration-150 p-1 rounded-full bg-white shadow-sm"
                    aria-label={`Remove education entry ${index + 1}`}
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};