import React from 'react';

const Select = ({ label, id, className = '', options = [], ...props }) => {
    // Filter out custom props that are not valid HTML attributes
    const { onChange, value, required, ...filteredProps } = props;

    return (
        <select
            id={id}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${className}`}
            {...filteredProps}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

export default Select;