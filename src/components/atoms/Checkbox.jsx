import React from 'react';

const Checkbox = ({ id, checked, onChange, label, className = '', ...props }) => {
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className={`w-4 h-4 text-primary border-surface-300 rounded focus:ring-primary ${className}`}
                {...props}
            />
            {label && (
                <label htmlFor={id} className="ml-2 text-sm text-surface-700">
                    {label}
                </label>
            )}
        </div>
    );
};

export default Checkbox;