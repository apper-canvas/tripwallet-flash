import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import Text from '@/components/atoms/Text';

const StatCard = ({ title, value, description, icon, iconColor, progressBar = null, animationDelay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: animationDelay }}
            className="bg-white rounded-xl p-6 shadow-sm"
        >
            <div className="flex items-center justify-between mb-2">
                <Text as="h3" className="text-sm font-medium text-surface-600">{title}</Text>
                {icon && <ApperIcon name={icon} className={`w-5 h-5 ${iconColor}`} />}
            </div>
            <Text as="p" className="text-3xl font-bold text-surface-900">{value}</Text>
            {description && <Text as="p" className="text-sm text-surface-500 mt-1">{description}</Text>}
            {progressBar && (
                <div className="flex items-center mt-1">
                    <ProgressBar percentage={progressBar.percentage} colorClass={progressBar.colorClass} className="flex-1 mr-2" />
                    <Text as="span" className={`text-sm font-medium ${progressBar.textColor}`}>
                        {Math.round(progressBar.percentage)}%
                    </Text>
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;