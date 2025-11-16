import React from 'react';
import { Candidate } from '../types';
import { MailIcon, PhoneIcon, BriefcaseIcon, AcademicCapIcon, CodeIcon } from './Icons';

interface CandidateCardProps {
  candidate: Candidate;
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onViewDetails }) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-lg hover:scale-[1.01] flex flex-col">
      <div className="flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
          <div className="flex-shrink-0 w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 sm:mb-0">
            <span className="text-2xl font-bold text-slate-600 dark:text-slate-300">{candidate.name.charAt(0)}</span>
          </div>
          <div className="flex-grow">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">{candidate.name}</h3>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
              {candidate.email && (
                <div className="flex items-center">
                  <MailIcon className="h-4 w-4 mr-1.5" />
                  <span>{candidate.email}</span>
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

        <div className="mt-6">
          <h4 className="font-semibold text-slate-700 dark:text-slate-300">AI Summary</h4>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-h-20 overflow-hidden text-ellipsis">
            {candidate.summary}
          </p>
        </div>

        {candidate.skills && candidate.skills.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
              <CodeIcon className="h-4 w-4 mr-2" />
              Top Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.slice(0, 7).map((skill, index) => (
                <span key={index} className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-indigo-900 dark:text-indigo-300">
                  {skill}
                </span>
              ))}
              {candidate.skills.length > 7 && (
                <span className="text-xs font-medium text-slate-500 py-1">+ {candidate.skills.length - 7} more</span>
              )}
            </div>
          </div>
        )}
        
        {candidate.experience && candidate.experience.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
              <BriefcaseIcon className="h-4 w-4 mr-2" />
              Recent Experience
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p><span className="font-medium text-slate-700 dark:text-slate-300">{candidate.experience[0].role}</span> at {candidate.experience[0].company}</p>
            </div>
          </div>
        )}

        {candidate.education && candidate.education.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center">
              <AcademicCapIcon className="h-4 w-4 mr-2" />
              Education
            </h4>
            <div className="text-sm text-slate-600 dark:text-slate-400">
              <p>{candidate.education[0].degree} from {candidate.education[0].institution}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={() => onViewDetails(candidate)}
          className="w-full text-center rounded-md bg-indigo-50 dark:bg-indigo-900/50 px-3.5 py-2.5 text-sm font-semibold text-indigo-600 dark:text-indigo-300 shadow-sm hover:bg-indigo-100 dark:hover:bg-indigo-900"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
