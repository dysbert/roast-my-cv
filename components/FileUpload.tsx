'use client';

import { useState } from 'react';

interface FileUploadProps {
  file: File | null;
  onFile: (file: File | null) => void;
}

export default function FileUpload({ file, onFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f: File) => {
    if (f.type === 'application/pdf') {
      onFile(f);
    } else {
      alert('Please upload a PDF file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
  };

  return (
    <div>
      <label
        htmlFor="cv-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed
          cursor-pointer transition-all duration-200
          ${isDragging
            ? 'border-[#E24B4A] bg-[#E24B4A]/15'
            : file
            ? 'border-[#E24B4A]/60 bg-[#E24B4A]/10'
            : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/8'
          }
        `}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <div className="text-3xl">📄</div>
            <div className="text-white font-medium text-sm truncate max-w-[240px]">{file.name}</div>
            <div className="text-white/40 text-xs">{(file.size / 1024).toFixed(0)} KB · PDF</div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onFile(null); }}
              className="text-xs text-[#E24B4A] hover:underline mt-1"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className="text-3xl">{isDragging ? '🎯' : '📎'}</div>
            <div className="text-white/70 text-sm font-medium">
              {isDragging ? 'Drop it here' : 'Drag & drop your CV here'}
            </div>
            <div className="text-white/30 text-xs">or click to browse · PDF only · Max 10MB</div>
          </div>
        )}
        <input
          id="cv-upload"
          type="file"
          accept=".pdf"
          className="sr-only"
          onChange={handleInputChange}
        />
      </label>
    </div>
  );
}
