import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const SettingsSection = ({ title, icon, children, animationDelay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="bg-white rounded-xl p-6 shadow-sm"
        >
            <Text as="h3" className="text-lg font-semibold text-surface-900 mb-4 flex items-center">
                <ApperIcon name={icon} className="w-5 h-5 mr-2" />
                {title}
            </Text>
            {children}
        </motion.div>
    );
};

export default SettingsSection;