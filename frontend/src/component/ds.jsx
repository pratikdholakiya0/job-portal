export const CheckboxField = ({ label, name, checked, onChange, readOnly = false }) => (
    <div className="flex items-center space-x-2">
        <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={onChange}
            disabled={readOnly}
            className={`h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 ${readOnly ? 'opacity-50' : ''}`}
        />
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
            {label}
        </label>
    </div>
);