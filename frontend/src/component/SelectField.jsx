// This is your SelectField.jsx component

export const SelectField = ({ label, name, value, onChange, options, required = false, readOnly = false }) => {
    const selectedLabel = options.find(opt => opt.value === value)?.label || 'N/A';

    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {readOnly ? (
                // Read-Only Display Mode
                <p className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 shadow-sm">
                    {selectedLabel}
                </p>
            ) : (
                // Editable Select Mode
                <select
                    name={name}
                    id={name}
                    value={value} // This is the controlled prop that must update.
                    onChange={onChange}
                    required={required}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white focus:border-indigo-500 focus:ring-indigo-500 transition duration-150 appearance-none"
                >
                    {/* CRITICAL CHANGE: Only disable the placeholder if required, or ensure it's selectable when no value is set */}
                    <option value="" disabled={required && value === ""}>Select {label.toLowerCase()}</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};