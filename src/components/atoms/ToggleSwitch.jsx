import React from 'react';

const ToggleSwitch = ({ id, checked, onChange, disabled = false, className = '' }) => {
    return (
        <label htmlFor={id} className={`relative inline-flex items-center cursor-pointer ${className} ${disabled ? 'opacity-50' : ''}`}>
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
                disabled={disabled}
            />
            <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    );
};

export default ToggleSwitch;