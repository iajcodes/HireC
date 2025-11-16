
import { GoogleGenAI, Type } from "@google/genai";
import { Candidate } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result.split(',')[1]);
            } else {
                resolve('');
            }
        };
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Full name of the candidate." },
        email: { type: Type.STRING, description: "Primary email address of the candidate." },
        phone: { type: Type.STRING, description: "Primary phone number of the candidate." },
        summary: { type: Type.STRING, description: "A brief professional summary or objective, 2-4 sentences long." },
        skills: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key technical and soft skills."
        },
        experience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING, description: "Job title or role." },
                    company: { type: Type.STRING, description: "Company name." },
                    duration: { type: Type.STRING, description: "Employment dates (e.g., 'Jan 2020 - Present')." },
                    description: { type: Type.STRING, description: "A brief description of responsibilities and achievements in this role." }
                },
                required: ["role", "company", "duration", "description"]
            },
            description: "A list of professional work experiences."
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    institution: { type: Type.STRING, description: "Name of the university or institution." },
                    degree: { type: Type.STRING, description: "Degree obtained (e.g., 'Bachelor of Science in Computer Science')." },
                    graduationYear: { type: Type.STRING, description: "Year of graduation or expected graduation." }
                },
                required: ["institution", "degree"]
            },
            description: "A list of educational qualifications."
        }
    },
    required: ["name", "email", "summary", "skills", "experience", "education"]
};

export const parseResume = async (file: File): Promise<Candidate> => {
    try {
        const imagePart = await fileToGenerativePart(file);
        const textPart = {
            text: `Analyze the provided resume file and extract the candidate's information precisely according to the provided JSON schema. Do not add any extra commentary or introductory text. Only return the JSON object.`,
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: 'application/json',
                responseSchema: resumeSchema
            }
        });

        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);
        
        // Basic validation to ensure the parsed data looks like a candidate profile
        if (!parsedData.name || !parsedData.email) {
            throw new Error("Parsed data is missing required fields (name, email).");
        }

        return parsedData as Candidate;

    } catch (error) {
        console.error("Error parsing resume with Gemini:", error);
        if (error instanceof Error) {
            throw new Error(`AI model failed to process the resume. Details: ${error.message}`);
        }
        throw new Error("An unknown error occurred while parsing the resume.");
    }
};
