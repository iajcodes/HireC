
import React, { useState, useCallback, useRef } from 'react';
import { Candidate } from '../types';
import { parseResume } from '../services/geminiService';
import { UploadIcon, SpinnerIcon, FileIcon, ErrorIcon } from './Icons';

interface ResumeUploaderProps {
  onUploadSuccess: (candidate: Candidate) => void;
  onUploadError: (error: string) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onUploadSuccess, onUploadError }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    
    // Simple validation for file type (can be expanded)
    if (!['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
      const err = "Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.";
      setError(err);
      onUploadError(err);
      setFileName(null);
      return;
    }
    
    setIsParsing(true);
    setError(null);
    setFileName(file.name);

    try {
      const candidateData = await parseResume(file);
      onUploadSuccess(candidateData);
      setFileName(null); // Reset after successful upload
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to parse resume. ${errorMessage}`);
      onUploadError(errorMessage);
    } finally {
      setIsParsing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [onUploadSuccess, onUploadError]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <h2 className="text-xl font-semibold mb-1 text-slate-800 dark:text-slate-100">Upload a Resume</h2>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Drag & drop or click to upload a resume file (PDF, DOCX, TXT).</p>
      
      <div 
        className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-200
        ${isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500'}
        ${isParsing ? 'bg-slate-50 dark:bg-slate-700/50' : ''}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          onChange={(e) => handleFileChange(e.target.files)}
          accept=".pdf,.doc,.docx,.txt"
          disabled={isParsing}
        />

        {isParsing ? (
          <div className="flex flex-col items-center justify-center">
            <SpinnerIcon className="h-10 w-10 text-indigo-500 mb-4" />
            <p className="font-semibold text-indigo-600 dark:text-indigo-400">AI is analyzing...</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
            <UploadIcon className="h-10 w-10 mb-4" />
            <p className="font-semibold">
              <span className="text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs mt-1">PDF, DOC, DOCX, or TXT</p>
          </div>
        )}
      </div>

      {fileName && !isParsing && (
        <div className="mt-4 flex items-center justify-center text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-md p-2">
          <FileIcon className="h-5 w-5 mr-2 text-slate-400" />
          <span>{fileName}</span>
        </div>
      )}

      {error && (
        <div className="mt-4 flex items-center text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
          <ErrorIcon className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
