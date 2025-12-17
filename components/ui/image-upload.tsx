'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
// import { storage } from '@/lib/firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
  className?: string;
  previewClassName?: string;
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "/images/example.jpg",
  className = "",
  previewClassName = "w-full h-40 object-cover"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Upload failed');
      }

      const data = await response.json();

      onChange(data.url);
      setUrlInput(data.url);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
    }
  };

  const handleClear = () => {
    onChange('');
    setUrlInput('');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant={uploadMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('url')}
          className="flex items-center gap-2"
        >
          <LinkIcon className="w-4 h-4" />
          URL
        </Button>
        <Button
          type="button"
          variant={uploadMode === 'file' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setUploadMode('file')}
          className="flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Upload File
        </Button>
      </div>

      {/* URL Input Mode */}
      {uploadMode === 'url' && (
        <div className="space-y-2">
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={placeholder}
            className="w-full"
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            size="sm"
            className="w-full"
          >
            Use URL
          </Button>
        </div>
      )}

      {/* File Upload Mode */}
      {uploadMode === 'file' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Choose Image File
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
          </p>
        </div>
      )}

      {/* Current Image Preview */}
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Current Image:</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Clear
            </Button>
          </div>
          <div className="border border-gray-200 p-2">
            <img
              src={value}
              alt="Preview"
              className={previewClassName}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <p className="text-xs text-gray-500 mt-1 break-all">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
