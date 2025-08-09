'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Eye,
  Download,
  Trash2,
  Scan
} from 'lucide-react';
import { DocumentVerificationResult } from '@/types';

interface DocumentVerificationProps {
  onVerificationComplete?: (result: DocumentVerificationResult) => void;
  acceptedTypes?: string[];
  maxFileSize?: number; // in MB
  className?: string;
}

export function DocumentVerification({
  onVerificationComplete,
  acceptedTypes = ['.pdf', '.jpg', '.jpeg', '.png'],
  maxFileSize = 10,
  className
}: DocumentVerificationProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [verificationResults, setVerificationResults] = useState<DocumentVerificationResult[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const validFiles = Array.from(selectedFiles).filter(file => {
      // Check file type
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!acceptedTypes.includes(fileExtension)) {
        alert(`File type ${fileExtension} is not supported`);
        return false;
      }

      // Check file size
      if (file.size > maxFileSize * 1024 * 1024) {
        alert(`File size must be less than ${maxFileSize}MB`);
        return false;
      }

      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setVerificationResults(prev => prev.filter((_, i) => i !== index));
  };

  const verifyDocuments = async () => {
    if (files.length === 0) return;

    setIsVerifying(true);
    
    // Simulate AI document verification
    const results: DocumentVerificationResult[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock verification result
      const mockResult: DocumentVerificationResult = {
        id: Date.now().toString() + i,
        fileName: file.name,
        fileSize: file.size,
        documentType: getDocumentType(file.name),
        verificationStatus: Math.random() > 0.3 ? 'verified' : Math.random() > 0.5 ? 'rejected' : 'pending',
        confidence: Math.random() * 0.3 + 0.7, // 70-100%
        extractedData: {
          documentNumber: generateMockDocumentNumber(),
          issueDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          holderName: 'John Doe',
          issuingAuthority: 'Government Authority',
        },
        issues: Math.random() > 0.7 ? [
          'Document quality is low',
          'Some text is unclear'
        ] : [],
        verifiedAt: new Date().toISOString(),
      };
      
      results.push(mockResult);
      setVerificationResults(prev => [...prev, mockResult]);
      
      if (onVerificationComplete) {
        onVerificationComplete(mockResult);
      }
    }
    
    setIsVerifying(false);
  };

  const getDocumentType = (fileName: string): string => {
    const name = fileName.toLowerCase();
    if (name.includes('aadhar') || name.includes('aadhaar')) return 'aadhar_card';
    if (name.includes('pan')) return 'pan_card';
    if (name.includes('passport')) return 'passport';
    if (name.includes('license') || name.includes('licence')) return 'driving_license';
    if (name.includes('property') || name.includes('title')) return 'property_document';
    if (name.includes('encumbrance')) return 'encumbrance_certificate';
    return 'other';
  };

  const generateMockDocumentNumber = (): string => {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      default:
        return <FileText className="w-5 h-5 text-text-secondary" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-success bg-success/10';
      case 'rejected':
        return 'text-error bg-error/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      default:
        return 'text-text-secondary bg-gray-light';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Scan className="w-5 h-5 mr-2" />
          AI Document Verification
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-light hover:border-primary/50'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 text-text-secondary mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Upload Documents for Verification
          </h3>
          <p className="text-text-secondary mb-4">
            Drag and drop files here or click to browse
          </p>
          <p className="text-sm text-text-secondary mb-4">
            Supported formats: {acceptedTypes.join(', ')} (Max {maxFileSize}MB)
          </p>
          
          <Button
            variant="primary"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedTypes.join(',')}
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold">Selected Files ({files.length})</h4>
              <Button
                variant="primary"
                onClick={verifyDocuments}
                disabled={isVerifying}
                leftIcon={isVerifying ? <Loading size="sm" /> : <Scan className="w-4 h-4" />}
              >
                {isVerifying ? 'Verifying...' : 'Verify Documents'}
              </Button>
            </div>
            
            <div className="space-y-3">
              {files.map((file, index) => {
                const result = verificationResults[index];
                
                return (
                  <div key={index} className="border border-gray-light rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{file.name}</p>
                          <p className="text-sm text-text-secondary">
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {result && (
                          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(result.verificationStatus)}`}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(result.verificationStatus)}
                              <span className="capitalize">{result.verificationStatus}</span>
                            </div>
                          </div>
                        )}
                        
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Verification Results */}
                    {result && (
                      <div className="mt-4 pt-4 border-t border-gray-light">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-medium mb-2">Extracted Information</h5>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Document Type:</span>
                                <span className="capitalize">{result.documentType.replace('_', ' ')}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Document Number:</span>
                                <span>{result.extractedData.documentNumber}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Holder Name:</span>
                                <span>{result.extractedData.holderName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-text-secondary">Confidence:</span>
                                <span>{(result.confidence * 100).toFixed(1)}%</span>
                              </div>
                            </div>
                          </div>
                          
                          {result.issues.length > 0 && (
                            <div>
                              <h5 className="font-medium mb-2 text-warning">Issues Found</h5>
                              <ul className="space-y-1 text-sm">
                                {result.issues.map((issue, issueIndex) => (
                                  <li key={issueIndex} className="flex items-center text-warning">
                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
