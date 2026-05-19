import { InputField } from "./InputField";

export const DateInputField = ({ label, name, value, onChange, readOnly = false }) => (
    <InputField
        label={label}
        name={name}
        value={value ? new Date(value).toISOString().substring(0, 10) : ''}
        onChange={onChange}
        type="date"
        readOnly={readOnly}
    />
);