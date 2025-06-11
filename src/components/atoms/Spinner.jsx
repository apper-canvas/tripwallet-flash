import React from 'react';

const Spinner = ({ className = 'w-4 h-4', color = 'border-white', thickness = 'border-2' }) => {
    return (
        <div
            className={`${className} ${thickness} ${color} border-t-transparent rounded-full animate-spin`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;