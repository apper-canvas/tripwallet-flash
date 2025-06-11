import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import Text from '@/components/atoms/Text';

const ReportExportActions = ({ generateCSV, generatePDF, shareReport }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl p-6 shadow-sm"
        >
            <Text as="h3" className="text-lg font-semibold text-surface-900 mb-4">Export Report</Text>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={generateCSV} variant="primary">
                    <ApperIcon name="Download" className="w-5 h-5" />
                    <span>Export as CSV</span>
                </Button>
                
                <Button onClick={generatePDF} variant="secondary">
                    <ApperIcon name="FileText" className="w-5 h-5" />
                    <span>Export as PDF</span>
                </Button>
                
                <Button onClick={shareReport} variant="outline">
                    <ApperIcon name="Share2" className="w-5 h-5" />
                    <span>Share Report</span>
                </Button>
            </div>
        </motion.div>
    );
};

export default ReportExportActions;