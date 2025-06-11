import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const CurrencyExchangeRateCard = ({ rate, animationDelay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: animationDelay }}
            className="text-center p-3 bg-surface-50 rounded-lg"
        >
            <div className="flex items-center justify-center space-x-1 mb-2">
                <Text as="span" className="text-xs font-medium text-surface-600">{rate.from}</Text>
                <ApperIcon name="ArrowRight" className="w-3 h-3 text-surface-400" />
                <Text as="span" className="text-xs font-medium text-surface-600">{rate.to}</Text>
            </div>
            <Text as="p" className="font-bold text-surface-900">{rate.rate.toFixed(4)}</Text>
        </motion.div>
    );
};

export default CurrencyExchangeRateCard;