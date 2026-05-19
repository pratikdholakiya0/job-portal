import { ChevronDown } from "lucide-react";

export const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="space-y-1.5">
        <label className="text-sm font-semibold text-gray-700 block">{label}</label>
        <select
            value={value}
            onChange={onChange}
            className="w-full pl-4 pr-10 py-2 text-base border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition duration-150"
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown className="w-5 h-5 text-gray-400 mt-6" />
        </div>
    </div>
);