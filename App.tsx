import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ResumeUploader } from './components/ResumeUploader';
import { CandidateList } from './components/CandidateList';
import { Candidate, User } from './types';
import { Toaster, toast } from 'react-hot-toast';
import { CandidateDetailModal } from './components/CandidateDetailModal';
import { AuthModal } from './components/AuthModal';
import { getCurrentUser, getCandidatesForUser, saveCandidatesForUser, logout } from './services/authService';
import { BrainCircuitIcon } from './components/Icons';

const App: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      handleLoginSuccess(user);
    }
  }, []);

  const handleUploadSuccess = (newCandidate: Candidate) => {
    const candidateWithId = { ...newCandidate, id: Date.now() + Math.random().toString() };
    setCandidates(prev => {
      const updatedCandidates = [candidateWithId, ...prev];
      if (currentUser) {
        saveCandidatesForUser(currentUser.email, updatedCandidates);
      }
      return updatedCandidates;
    });
    setSelectedCandidate(candidateWithId);
    toast.success('Resume parsed successfully!');
  };

  const handleUploadError = (error: string) => {
    toast.error(`Error parsing resume: ${error}`);
  };

  const handleViewDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  const handleCloseModal = () => {
    setSelectedCandidate(null);
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setCandidates(getCandidatesForUser(user.email));
    setIsAuthModalOpen(false);
    toast.success(`Welcome back, ${user.email}!`);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCandidates([]);
    toast.success("You've been logged out.");
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans">
      <Toaster position="top-center" reverseOrder={false} />
      <Header 
        currentUser={currentUser}
        onLoginClick={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {currentUser ? (
            <>
              <ResumeUploader 
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
              <div className="mt-12">
                <CandidateList candidates={candidates} onViewDetails={handleViewDetails} />
              </div>
            </>
          ) : (
            <div className="text-center bg-white dark:bg-slate-800 p-12 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <BrainCircuitIcon className="mx-auto h-12 w-12 text-indigo-500" />
                <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome to HireCipher</h2>
                <p className="mt-2 text-md text-slate-600 dark:text-slate-400">
                  Your AI-powered resume parsing assistant.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Login or Create an Account to Get Started
                  </button>
                </div>
              </div>
          )}
        </div>
      </main>
      <footer className="text-center py-4 text-xs text-slate-500">
        <p>&copy; {new Date().getFullYear()} HireCipher. A Portfolio Project.</p>
      </footer>

      {selectedCandidate && (
        <CandidateDetailModal 
          candidate={selectedCandidate}
          onClose={handleCloseModal}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
};

export default App;
