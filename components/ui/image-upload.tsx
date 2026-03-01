'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Link as LinkIcon, X, Loader2 } from 'lucide-react';
// import { storage } from '@/lib/firebase';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Chunk size: use 4MB on Vercel (body limit 4.5MB). Self-hosted? Set NEXT_PUBLIC_UPLOAD_CHUNK_SIZE_MB=50 in .env for much faster uploads.
const CHUNK_SIZE_MB = typeof process.env.NEXT_PUBLIC_UPLOAD_CHUNK_SIZE_MB !== 'undefined'
  ? Math.max(1, Math.min(100, Number(process.env.NEXT_PUBLIC_UPLOAD_CHUNK_SIZE_MB) || 4))
  : 4;
const CHUNK_THRESHOLD = 4 * 1024 * 1024; // switch to chunked above 4MB
const CHUNK_SIZE = CHUNK_SIZE_MB * 1024 * 1024;
const CHUNK_CONCURRENCY = typeof process.env.NEXT_PUBLIC_UPLOAD_CHUNK_CONCURRENCY !== 'undefined'
  ? Math.max(2, Math.min(20, Number(process.env.NEXT_PUBLIC_UPLOAD_CHUNK_CONCURRENCY) || 8))
  : 10;

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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadMode, setUploadMode] = useState<'url' | 'file'>('url');
  const [urlInput, setUrlInput] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep urlInput in sync when parent passes a new value (e.g. so video/audio don't overwrite each other)
  useEffect(() => {
    setUrlInput(value);
  }, [value]);

  const uploadChunked = async (file: File): Promise<string> => {
    const uploadId = crypto.randomUUID();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    let completed = 0;
    let resultUrl: string | null = null;

    const uploadOneChunk = async (chunkIndex: number): Promise<void> => {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const blob = file.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', blob);
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', String(chunkIndex));
      formData.append('totalChunks', String(totalChunks));
      formData.append('filename', file.name);
      formData.append('contentType', file.type);

      const response = await fetch('/api/admin/upload-chunk', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || err.error || 'Chunk upload failed');
      }

      const data = await response.json();
      completed += 1;
      setUploadProgress(Math.round((completed / totalChunks) * 100));
      if (data.done && data.url) resultUrl = data.url;
    };

    // Run chunk uploads in parallel with concurrency limit
    const indices = Array.from({ length: totalChunks }, (_, i) => i);
    let next = 0;
    const run = async (): Promise<void> => {
      while (next < indices.length) {
        const i = indices[next++];
        await uploadOneChunk(i);
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(CHUNK_CONCURRENCY, totalChunks) }, () => run())
    );

    if (resultUrl) return resultUrl;
    throw new Error('Upload did not return URL');
  };

  const uploadSingle = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      let message = 'Upload failed';
      if (contentType?.includes('application/json')) {
        const error = await response.json();
        message = error.detail || error.error || message;
      } else if (response.status === 413) {
        message = 'File too large for single upload. Use a smaller file or try again (chunked upload may apply).';
      }
      throw new Error(message);
    }
    const data = await response.json();
    return data.url;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');

    if (!isImage && !isVideo && !isAudio) {
      alert('Please select an image, video, or audio file');
      return;
    }

    const maxSize = isImage ? 5 * 1024 * 1024 : 1000 * 1024 * 1024; // 5MB images, 1GB video/audio
    if (file.size > maxSize) {
      alert(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(null);
    try {
      const url = file.size > CHUNK_THRESHOLD
        ? await uploadChunked(file)
        : await uploadSingle(file);

      onChange(url);
      setUrlInput(url);
    } catch (error) {
      console.error('Error uploading file:', error);
      const message = error instanceof Error ? error.message : 'Error uploading file. Please try again.';
      alert(message);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
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
                {uploadProgress != null ? `Uploading… ${uploadProgress}%` : 'Uploading…'}
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
             accept.includes('video') ? 'Max file size: 1GB. Supported formats: MP4, WebM, OGG' :
             accept.includes('audio') ? 'Max file size: 1GB. Supported formats: MP3, OGG, WAV' :
             'Max file size: 1GB'}
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
