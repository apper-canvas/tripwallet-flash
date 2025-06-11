import React from 'react';

const ProgressBar = ({ percentage, colorClass = 'bg-primary', className = 'h-2' }) => {
    const width = Math.min(percentage, 100);
    return (
        <div className={`w-full bg-surface-200 rounded-full ${className}`}>
            <div
                className={`${className} rounded-full transition-all duration-500 ${colorClass}`}
                style={{ width: `${width}%` }}
            />
        </div>
    );
};

export default ProgressBar;