import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ onClick, children, className = '', variant = 'primary', type = 'button', disabled = false, whileHover, whileTap }) => {
    let baseClasses = 'flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed';
    
    switch (variant) {
        case 'primary':
            baseClasses += ' bg-primary text-white';
            break;
        case 'secondary':
            baseClasses += ' bg-secondary text-white';
            break;
        case 'outline':
            baseClasses += ' bg-white border border-surface-300 text-surface-700 hover:bg-surface-50';
            break;
        case 'ghost':
            baseClasses += ' bg-transparent text-surface-700 hover:bg-surface-100 shadow-none hover:shadow-none';
            break;
        case 'danger':
            baseClasses += ' bg-error text-white';
            break;
        case 'danger-outline':
            baseClasses += ' bg-white border border-error text-error hover:bg-error/10';
            break;
        default:
            baseClasses += ' bg-primary text-white';
    }

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${className}`}
            whileHover={whileHover || { scale: 1.02 }}
            whileTap={whileTap || { scale: 0.98 }}
        >
            {children}
        </motion.button>
    );
};

export default Button;