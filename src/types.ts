export interface Experience {
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;

  degree: string;
  graduationYear: string;
}

export interface Candidate {
  id?: string;
  name: string;
  email: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
}

export interface User {
  email: string;
}
