import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, Edit2, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Spinner from '@/components/atoms/Spinner';
import { motion } from 'framer-motion';

const OCRPreview = ({ 
  receiptData, 
  ocrResult, 
  onDataChange, 
  onConfirm, 
  isProcessing = false, 
  error = null,
  categories = [],
  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
}) => {
  const [editedData, setEditedData] = useState({
    merchant: '',
    amount: '',
    date: '',
    category: 'meals',
    currency: 'USD',
    notes: ''
  });
  const [showRawText, setShowRawText] = useState(false);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (ocrResult?.data) {
      const data = ocrResult.data;
      setEditedData({
        merchant: data.merchant || '',
        amount: data.amount || '',
        date: data.date || new Date().toISOString().split('T')[0],
        category: data.category || 'meals',
        currency: 'USD',
        notes: `Auto-extracted from receipt: ${receiptData?.filename || 'receipt'}`
      });
      setConfidence(Math.round((data.confidence || 0.75) * 100));
      onDataChange(data);
    }
  }, [ocrResult, receiptData, onDataChange]);

  const handleFieldChange = (field, value) => {
    const newData = { ...editedData, [field]: value };
    setEditedData(newData);
    onDataChange(newData);
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceBgColor = (confidence) => {
    if (confidence >= 80) return 'bg-success/10';
    if (confidence >= 60) return 'bg-warning/10';
    return 'bg-error/10';
  };

  if (isProcessing) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <Spinner size="lg" />
          <div className="mt-4 text-sm text-surface-600">
            Processing receipt with OCR...
          </div>
          <div className="mt-2 text-xs text-surface-500">
            This may take a few moments
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="flex items-center justify-center w-16 h-16 bg-error/10 rounded-full mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-error" />
          </div>
          <div className="text-sm text-error font-medium mb-2">
            OCR Processing Failed
          </div>
          <div className="text-xs text-surface-600 mb-4">
            {error}
          </div>
          <div className="text-xs text-surface-500">
            You can still enter the expense details manually
          </div>
        </div>
      </div>
    );
  }

  if (!ocrResult?.data) {
    return (
      <div className="text-center py-8 text-surface-500">
        <div className="text-sm">No OCR data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Receipt Preview */}
      {receiptData?.previewUrl && (
        <div className="bg-surface-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-medium text-surface-700">
              Receipt Preview
            </div>
            <div className={`text-xs px-2 py-1 rounded-full ${getConfidenceBgColor(confidence)}`}>
              <span className={`font-medium ${getConfidenceColor(confidence)}`}>
                {confidence}% confidence
              </span>
            </div>
          </div>
          <img
            src={receiptData.previewUrl}
            alt="Receipt preview"
            className="w-full max-w-sm mx-auto rounded-lg shadow-sm"
            style={{ maxHeight: '300px', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Extracted Data Form */}
      <div className="bg-white border border-surface-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-surface-700">
            Extracted Information
          </div>
          <div className="flex items-center space-x-2 text-xs text-surface-500">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Review and edit as needed</span>
          </div>
        </div>

        <div className="space-y-4">
          <FormField
            label="Merchant/Description"
            id="ocr-merchant"
            type="text"
            value={editedData.merchant}
            onChange={(e) => handleFieldChange('merchant', e.target.value)}
            placeholder="Enter merchant name"
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Amount"
              id="ocr-amount"
              type="number"
              step="0.01"
              value={editedData.amount}
              onChange={(e) => handleFieldChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />
            <FormField
              label="Currency"
              id="ocr-currency"
              type="select"
              value={editedData.currency}
              onChange={(e) => handleFieldChange('currency', e.target.value)}
              options={currencies.map(c => ({ value: c, label: c }))}
            />
          </div>

          <FormField
            label="Category"
            id="ocr-category"
            type="select"
            value={editedData.category}
            onChange={(e) => handleFieldChange('category', e.target.value)}
            options={categories.map(cat => ({ value: cat.id, label: cat.label }))}
          />

          <FormField
            label="Date"
            id="ocr-date"
            type="date"
            value={editedData.date}
            onChange={(e) => handleFieldChange('date', e.target.value)}
          />

          <FormField
            label="Notes"
            id="ocr-notes"
            type="textarea"
            value={editedData.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            placeholder="Additional notes..."
          />
        </div>
      </div>

      {/* Raw OCR Text (collapsible) */}
      {ocrResult.data.rawText && (
        <div className="bg-surface-50 rounded-lg p-4">
          <Button
            variant="ghost"
            onClick={() => setShowRawText(!showRawText)}
            className="mb-3 text-xs p-1 h-auto"
          >
            {showRawText ? <EyeOff className="w-3 h-3 mr-1" /> : <Eye className="w-3 h-3 mr-1" />}
            {showRawText ? 'Hide' : 'Show'} Raw Text
          </Button>
          
          {showRawText && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border border-surface-200 rounded p-3"
            >
              <pre className="text-xs text-surface-600 whitespace-pre-wrap font-mono">
                {ocrResult.data.rawText}
              </pre>
            </motion.div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="flex-1"
        >
          Back to Upload
        </Button>
        <Button
          onClick={() => onConfirm(editedData)}
          className="flex-1"
          disabled={!editedData.amount || !editedData.merchant}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Use These Details
        </Button>
      </div>
    </div>
  );
};

export default OCRPreview;