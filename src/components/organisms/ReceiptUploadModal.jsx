import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Modal from '@/components/atoms/Modal';
import ModalHeader from '@/components/molecules/ModalHeader';
import ReceiptUpload from '@/components/organisms/ReceiptUpload';
import OCRPreview from '@/components/organisms/OCRPreview';
import receiptService from '@/services/api/receiptService';
import ocrService from '@/services/api/ocrService';

const ReceiptUploadModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  categories = [], 
  currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] 
}) => {
  const [step, setStep] = useState('upload'); // 'upload', 'processing', 'preview'
  const [receiptData, setReceiptData] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [extractedData, setExtractedData] = useState(null);

  const handleClose = () => {
    // Clean up any uploaded files
    if (receiptData?.previewUrl) {
      URL.revokeObjectURL(receiptData.previewUrl);
    }
    
    // Reset state
    setStep('upload');
    setReceiptData(null);
    setOcrResult(null);
    setIsProcessing(false);
    setError(null);
    setExtractedData(null);
    
    onClose();
  };

  const handleUploadSuccess = async (uploadedFile) => {
    setReceiptData(uploadedFile);
    setStep('processing');
    setIsProcessing(true);
    setError(null);

    try {
      // Process with OCR service
      const result = await receiptService.processOCR(Date.now().toString());
      setOcrResult(result);
      setStep('preview');
      toast.success('Receipt processed successfully!');
    } catch (err) {
      setError(err.message || 'Failed to process receipt');
      setStep('preview'); // Still show preview even if OCR fails
      toast.error('OCR processing failed, but you can still enter details manually');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadError = (errorMessage) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleDataChange = (data) => {
    setExtractedData(data);
  };

  const handleConfirm = (finalData) => {
    onConfirm(finalData);
    handleClose();
  };

  const getModalTitle = () => {
    switch (step) {
      case 'upload':
        return 'Upload Receipt';
      case 'processing':
        return 'Processing Receipt';
      case 'preview':
        return 'Review Extracted Data';
      default:
        return 'Upload Receipt';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalHeader title={getModalTitle()} onClose={handleClose} />
      
      <div className="max-h-[80vh] overflow-y-auto">
        {step === 'upload' && (
          <ReceiptUpload
            onUploadSuccess={handleUploadSuccess}
            onError={handleUploadError}
          />
        )}
        
        {(step === 'processing' || step === 'preview') && (
          <OCRPreview
            receiptData={receiptData}
            ocrResult={ocrResult}
            onDataChange={handleDataChange}
            onConfirm={handleConfirm}
            isProcessing={isProcessing}
            error={error}
            categories={categories}
            currencies={currencies}
          />
        )}
      </div>
    </Modal>
  );
};

export default ReceiptUploadModal;