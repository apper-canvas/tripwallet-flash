import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Text from '@/components/atoms/Text';
import Checkbox from '@/components/atoms/Checkbox';

const FormField = ({ label, id, type = 'text', options, children, required, ...props }) => {
    const renderControl = () => {
        if (type === 'select') {
            return (
                <Select
                    id={id}
                    options={options}
                    required={required}
                    {...props}
                />
            );
        } else if (type === 'textarea') {
            return (
                <textarea
                    id={id}
                    rows="3"
                    className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-sm"
                    required={required}
                    {...props}
                />
            );
        } else if (type === 'file') {
            return (
                <Input
                    id={id}
                    type="file"
                    required={required}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                    {...props}
                />
            );
        } else if (type === 'checkbox') {
            return (
                <Checkbox
                    id={id}
                    label={label}
                    checked={props.checked}
                    onChange={props.onChange}
                    {...props}
                />
            );
        } else {
            return (
                <Input
                    id={id}
                    type={type}
                    required={required}
                    {...props}
                />
            );
        }
    };

    return (
        <div>
            {type !== 'checkbox' && (
                <Text as="label" htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1">
                    {label} {required && <span className="text-error">*</span>}
                </Text>
            )}
            {renderControl()}
            {children} {/* For additional helper text or error messages */}
        </div>
    );
};

export default FormField;