import { User, Candidate } from '../types';

const USER_KEY = 'hirecipher_user';
const DB_PREFIX = 'hirecipher_db_';

// --- User Management ---

export const login = (email: string, password?: string): User => {
  // In a real app, you'd validate the password against a backend.
  // Here, we'll just accept any login attempt.
  const user: User = { email };
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  // Initialize candidate list if it doesn't exist
  const userDbKey = `${DB_PREFIX}${email}`;
  if (!localStorage.getItem(userDbKey)) {
    localStorage.setItem(userDbKey, JSON.stringify([]));
  }

  return user;
};

export const signup = (email: string, password?: string): User => {
  // In a real app, you'd check if the user exists.
  // Here, signup and login have the same effect.
  return login(email, password);
};

export const logout = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) {
    return null;
  }
  try {
    return JSON.parse(userJson) as User;
  } catch (e) {
    return null;
  }
};

// --- Candidate Data Management ---

export const getCandidatesForUser = (email: string): Candidate[] => {
  const userDbKey = `${DB_PREFIX}${email}`;
  const candidatesJson = localStorage.getItem(userDbKey);
  if (!candidatesJson) {
    return [];
  }
  try {
    return JSON.parse(candidatesJson) as Candidate[];
  } catch (e) {
    return [];
  }
};

export const saveCandidatesForUser = (email: string, candidates: Candidate[]): void => {
  const userDbKey = `${DB_PREFIX}${email}`;
  localStorage.setItem(userDbKey, JSON.stringify(candidates));
};
