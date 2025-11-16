import React from 'react';
import { Candidate } from '../types';
import { MailIcon, PhoneIcon, BriefcaseIcon, AcademicCapIcon, CodeIcon, CloseIcon } from './Icons';

interface CandidateDetailModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({ candidate, onClose }) => {
  // Handle clicks on the overlay to close the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-slate-600 dark:text-slate-300">{candidate.name.charAt(0)}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{candidate.name}</h2>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                {candidate.email && (
                  <div className="flex items-center">
                    <MailIcon className="h-4 w-4 mr-1.5" />
                    <a href={`mailto:${candidate.email}`} className="hover:underline">{candidate.email}</a>
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1.5" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            <CloseIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">AI Summary</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {candidate.summary}
            </p>
          </div>

          {candidate.skills && candidate.skills.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 flex items-center">
                <CodeIcon className="h-5 w-5 mr-2 text-indigo-500" /> Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <span key={index} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {candidate.experience && candidate.experience.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                <BriefcaseIcon className="h-5 w-5 mr-2 text-indigo-500" /> Work Experience
              </h3>
              <div className="space-y-4">
                {candidate.experience.map((exp, index) => (
                  <div key={index} className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{exp.role}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{exp.company}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{exp.duration}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {candidate.education && candidate.education.length > 0 && (
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2 text-indigo-500" /> Education
              </h3>
              <div className="space-y-3">
                {candidate.education.map((edu, index) => (
                  <div key={index} className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                    <p className="font-semibold text-slate-700 dark:text-slate-300">{edu.institution}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{edu.degree}</p>
                    {edu.graduationYear && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Graduated: {edu.graduationYear}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
