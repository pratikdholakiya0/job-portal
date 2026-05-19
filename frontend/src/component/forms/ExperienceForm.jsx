import { InputField } from "../InputField";

export const ExperienceForm = ({ experience, index, onChange, onRemove }) => {
    const handleChange = (e) => {
        onChange(index, e.target.name, e.target.value);
    };

    return (
        <div className="bg-white p-5 rounded-xl shadow-md mb-4 border-l-4 border-indigo-400">
            <h4 className="text-sm font-semibold mb-3 text-purple-600">Experience #{index + 1}</h4>
            <InputField label="Company Name" name="companyName" value={experience.companyName} onChange={handleChange} />
            <InputField label="Job Title" name="jobTitle" value={experience.jobTitle} onChange={handleChange} />
            <div className="grid grid-cols-2 gap-4">
                <InputField label="Start Date" name="startDate" value={experience.startDate} onChange={handleChange} type="date" />
                <InputField label="End Date" name="endDate" value={experience.endDate} onChange={handleChange} type="date" />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    value={experience.description || ''}
                    onChange={handleChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out shadow-sm"
                    placeholder="Brief description of your responsibilities and achievements."
                ></textarea>
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={() => onRemove(index)}
                    className="flex items-center text-red-600 hover:text-red-800 transition duration-150"
                >
                    Remove
                </button>
            </div>
        </div>
    );
};