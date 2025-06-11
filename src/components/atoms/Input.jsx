import React from 'react';

const Input = ({ label, id, className = '', type = 'text', ...props }) => {
    // Filter out custom props that are not valid HTML attributes
    const { onChange, value, placeholder, required, step, min, max, accept, capture, ...filteredProps } = props;
    return (
<input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            step={step}
            min={min}
            max={max}
            accept={accept}
            capture={capture}
            className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm ${className}`}
            {...filteredProps}
        />
    );
};

export default Input;