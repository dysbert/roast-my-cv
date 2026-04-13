'use client';

import { useState } from 'react';
import { Upload, CheckCircle2, X } from 'lucide-react';

interface FileUploadProps {
  file: File | null;
  onFile: (file: File | null) => void;
}

export default function FileUpload({ file, onFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (f: File) => {
    if (f.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    if (f.size > 500 * 1024) {
      alert('Your CV is too large to process. Please try a compressed version under 500KB — a CV doesn\'t need to be that heavy either. 🔪');
      return;
    }
    onFile(f);
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
          relative flex flex-col items-center justify-center w-full h-40 rounded-xl cursor-pointer
          transition-all duration-200
          ${isDragging
            ? 'border-2 border-solid border-[#E24B4A] bg-[#E24B4A]/15'
            : file
            ? 'border-2 border-solid border-[#E24B4A]/60 bg-[#E24B4A]/5'
            : 'border-2 border-dashed border-white/20 bg-white/5 hover:border-[#E24B4A]/60 hover:bg-[#E24B4A]/5'
          }
        `}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <CheckCircle2 size={28} className="text-emerald-400" />
            <div className="text-white font-medium text-sm truncate max-w-[240px]">{file.name}</div>
            <div className="text-white/40 text-xs">{(file.size / 1024).toFixed(0)} KB · PDF</div>
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); onFile(null); }}
              className="flex items-center gap-1 text-xs text-[#E24B4A] hover:underline mt-1"
            >
              <X size={12} />
              Remove
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <Upload
              size={28}
              className={`text-white/50 transition-colors duration-200 ${isDragging ? 'text-[#E24B4A]' : 'upload-icon-pulse'}`}
            />
            <div className="text-white/70 text-sm font-medium">
              {isDragging ? 'Drop it here' : 'Drag & drop your CV here'}
            </div>
            <div className="text-white/30 text-xs">or click to browse · PDF only · Max 500KB</div>
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
