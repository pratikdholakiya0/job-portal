export const InputField = ({ label, name, type, value, onChange, placeholder, required = false, readOnly = false }) => (
    <div>
        <label htmlFor={name} className="block text-start py-2 text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            name={name}
            type={type || "text"}
            id={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            readOnly={readOnly}
            className={`w-full px-4 py-2 border rounded-lg shadow-sm transition duration-150 ${
                readOnly
                    ? 'bg-gray-50 border-gray-200 text-gray-700 cursor-default'
                    : 'bg-white border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
            }`}
        />
    </div>
);