import { useState } from "react";
import { PlusIcon } from "./icons/PlusIcon";
import { XIcon } from "./icons/XIcon";


const SkillInput = ({ requiredSkills, setRequiredSkills }) => {
    const [inputValue, setInputValue] = useState('');

    const handleAddSkill = () => {
        const skill = inputValue.trim();
        if (skill && !requiredSkills.includes(skill)) {
            setRequiredSkills([...requiredSkills, skill]);
            setInputValue('');
        }
    };

    const handleRemoveSkill = (skillToRemove) => {
        setRequiredSkills(requiredSkills.filter(skill => skill !== skillToRemove));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Required Skills <span className="text-red-500">*</span> (Press Enter to add)
            </label>
            <div className="flex items-center space-x-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g., React, Java, MongoDB"
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition duration-150"
                />
                <button
                    type="button"
                    onClick={handleAddSkill}
                    className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition duration-150"
                    aria-label="Add Skill"
                >
                    <PlusIcon className="w-5 h-5" />
                </button>
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2 min-h-[3rem] p-2 border border-gray-200 rounded-lg bg-gray-50">
                {requiredSkills.length === 0 ? (
                    <p className="text-sm text-gray-500 italic pt-1">No skills added yet.</p>
                ) : (
                    requiredSkills.map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex items-center bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-700 transition duration-150"
                            onClick={() => handleRemoveSkill(skill)}
                        >
                            {skill}
                            <XIcon className="ml-1 w-3 h-3" />
                        </span>
                    ))
                )}
            </div>
        </div>
    );
};

export default SkillInput;