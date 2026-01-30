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
  accept?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "/images/example.jpg",
  className = "",
  previewClassName = "w-full h-40 object-cover",
  accept = "image/*",
  label = "Image"
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!isImage && !isVideo && !isAudio) {
      alert('Please select an image, video, or audio file');
      return;
    }

    // Validate file size (5MB for images, 100MB for video/audio)
    const maxSize = isImage ? 5 * 1024 * 1024 : 100 * 1024 * 1024;
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
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
            accept={accept}
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
                Choose {label} File
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 text-center">
            {accept.includes('image') ? 'Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP' : 
             accept.includes('video') ? 'Max file size: 100MB. Supported formats: MP4, WebM, OGG' :
             accept.includes('audio') ? 'Max file size: 100MB. Supported formats: MP3, OGG, WAV' :
             'Max file size: 100MB'}
          </p>
        </div>
      )}

      {/* Current Preview */}
      {value && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Current {label}:</span>
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
            {accept.includes('video') ? (
              <video src={value} controls className={previewClassName} />
            ) : accept.includes('audio') ? (
              <audio src={value} controls className="w-full" />
            ) : (
              <img
                src={value}
                alt="Preview"
                className={previewClassName}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <p className="text-xs text-gray-500 mt-1 break-all">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
}
