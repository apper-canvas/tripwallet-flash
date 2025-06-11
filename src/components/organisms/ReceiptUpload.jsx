import React, { useState, useRef, useCallback } from 'react';
import { Upload, Camera, X, FileText, AlertCircle } from 'lucide-react';
import Button from '@/components/atoms/Button';
import Spinner from '@/components/atoms/Spinner';
import { motion, AnimatePresence } from 'framer-motion';

const ReceiptUpload = ({ onUploadSuccess, onError, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploading(true);
    setUploadedFile(file);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      
      // Simulate upload processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onUploadSuccess({
        file,
        previewUrl,
        filename: file.name,
        size: file.size,
        type: file.type
      });
    } catch (error) {
      onError(error.message || 'Upload failed');
      setUploadedFile(null);
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess, onError]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled || uploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      onError('Please upload an image file (JPG, PNG, etc.)');
      return;
    }
    
    handleFiles(imageFiles);
  }, [disabled, uploading, handleFiles, onError]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
    // Reset input
    e.target.value = '';
  }, [handleFiles]);

  const openFileDialog = () => {
    if (disabled || uploading) return;
    fileInputRef.current?.click();
  };

  const openCameraDialog = () => {
    if (disabled || uploading) return;
    cameraInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (uploadedFile) {
      URL.revokeObjectURL(URL.createObjectURL(uploadedFile));
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all
          ${dragActive ? 'border-primary bg-primary/5' : 'border-surface-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-surface-50 cursor-pointer'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFileDialog();
          }
        }}
        aria-label="Upload receipt image"
      >
        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-3"
            >
              <Spinner size="lg" />
              <div className="text-sm text-surface-600">
                Uploading receipt...
              </div>
            </motion.div>
          ) : uploadedFile ? (
            <motion.div
              key="uploaded"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center space-y-3"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-success/10 rounded-full">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <div className="text-sm text-surface-700">
                <div className="font-medium">{uploadedFile.name}</div>
                <div className="text-surface-500">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className="text-xs"
              >
                <X className="w-3 h-3 mr-1" />
                Remove
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-center w-16 h-16 bg-surface-100 rounded-full mx-auto">
                <Upload className="w-8 h-8 text-surface-500" />
              </div>
              <div className="space-y-2">
                <div className="text-lg font-medium text-surface-900">
                  Upload Receipt
                </div>
                <div className="text-sm text-surface-600">
                  Drag and drop an image here, or click to select
                </div>
              </div>
              <div className="text-xs text-surface-500">
                Supports JPG, PNG, WebP up to 10MB
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      {!uploadedFile && !uploading && (
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={openFileDialog}
            disabled={disabled}
            className="flex-1"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose File
          </Button>
          <Button
            variant="outline"
            onClick={openCameraDialog}
            disabled={disabled}
            className="flex-1"
          >
            <Camera className="w-4 h-4 mr-2" />
            Take Photo
          </Button>
        </div>
      )}

      {/* Help Text */}
      <div className="flex items-start space-x-2 text-xs text-surface-600 bg-surface-50 p-3 rounded-lg">
        <AlertCircle className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
        <div>
          <div className="font-medium mb-1">Tips for better OCR results:</div>
          <ul className="space-y-1 text-surface-500">
            <li>• Ensure the receipt is well-lit and clearly visible</li>
            <li>• Avoid shadows and reflections</li>
            <li>• Take the photo straight-on (not at an angle)</li>
            <li>• Make sure all text is readable</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReceiptUpload;