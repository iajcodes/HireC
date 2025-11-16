import React, { useState, useMemo } from 'react';
import { Candidate } from '../types';
import { CandidateCard } from './CandidateCard';
import { SearchIcon } from './Icons';

interface CandidateListProps {
  candidates: Candidate[];
  onViewDetails: (candidate: Candidate) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({ candidates, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) return candidates;
    const lowercasedTerm = searchTerm.toLowerCase();
    return candidates.filter(candidate => 
      candidate.name.toLowerCase().includes(lowercasedTerm) ||
      candidate.summary.toLowerCase().includes(lowercasedTerm) ||
      candidate.skills.some(skill => skill.toLowerCase().includes(lowercasedTerm)) ||
      candidate.experience.some(exp => 
        exp.role.toLowerCase().includes(lowercasedTerm) ||
        exp.company.toLowerCase().includes(lowercasedTerm) ||
        exp.description.toLowerCase().includes(lowercasedTerm)
      )
    );
  }, [candidates, searchTerm]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Candidate Pool</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {candidates.length > 0
            ? `Showing ${filteredCandidates.length} of ${candidates.length} candidates.`
            : 'Upload a resume to start building your candidate pool.'}
        </p>
      </div>

      {candidates.length > 0 && (
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, skill, role..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border-0 bg-white dark:bg-slate-800 py-2.5 pl-10 pr-3 text-slate-900 dark:text-slate-100 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      )}

      {candidates.length === 0 && (
         <div className="text-center py-16 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
           <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
           <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-white">No candidates yet</h3>
           <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Get started by uploading a resume.</p>
         </div>
      )}

      {filteredCandidates.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          {filteredCandidates.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} onViewDetails={onViewDetails} />
          ))}
        </div>
      ) : (
        candidates.length > 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">No candidates found</h3>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Try adjusting your search term.</p>
          </div>
        )
      )}
    </div>
  );
};