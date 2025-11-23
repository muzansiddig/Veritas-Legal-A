import { GoogleGenAI, Type } from "@google/genai";
import { LegalReport, ResearchResult, ChatMessage, UnclearTerm } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Schema for structured JSON output for legal reports
const legalReportSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A concise executive summary of the document." },
    documentType: { type: Type.STRING, description: "The type of legal document (e.g., NDA, Employment Contract)." },
    overallScore: { type: Type.INTEGER, description: "A score from 0-100 rating the safety and quality of the document." },
    risks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          description: { type: Type.STRING },
          recommendation: { type: Type.STRING }
        },
        required: ["severity", "description", "recommendation"]
      }
    },
    keyClauses: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          summary: { type: Type.STRING },
          significance: { type: Type.STRING }
        },
        required: ["title", "summary", "significance"]
      }
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "General actionable advice for the lawyer."
    }
  },
  required: ["summary", "documentType", "risks", "keyClauses", "overallScore", "recommendations"]
};

// Schema for identifying unclear terms
const unclearTermsSchema = {
  type: Type.OBJECT,
  properties: {
    terms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "The specific word or phrase that is ambiguous." },
          context: { type: Type.STRING, description: "The sentence or clause where it appears." },
          ambiguity: { type: Type.STRING, description: "Why this term is unclear or legally risky." },
          suggestion: { type: Type.STRING, description: "A more precise legal alternative." }
        },
        required: ["term", "context", "ambiguity", "suggestion"]
      }
    }
  }
};

// Schema for Chat Response with Suggestions
const chatResponseSchema = {
  type: Type.OBJECT,
  properties: {
    answer: { type: Type.STRING, description: "The direct answer to the user's question." },
    suggestions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "3 short, relevant follow-up questions the user might want to ask next based on the context." 
    }
  },
  required: ["answer", "suggestions"]
};

export const analyzeLegalDocument = async (text: string): Promise<LegalReport> => {
  if (!text) throw new Error("No text provided for analysis.");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following legal document text as a senior legal partner at a top law firm. 
      Provide a detailed report identifying risks, key clauses, and an overall assessment. 
      
      Document Text:
      ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: legalReportSchema,
        systemInstruction: "You are Veritas, an expert legal AI assistant. Your tone is professional, authoritative, and precise. You focus on protecting the client's interest."
      }
    });

    const jsonText = response.text || "{}";
    return JSON.parse(jsonText) as LegalReport;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the document. Please try again.");
  }
};

export const identifyUnclearTerms = async (text: string): Promise<UnclearTerm[]> => {
  if (!text) return [];
  try {
     const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Review the following legal text and identify vague, ambiguous, or undefined terms that could lead to disputes.
      
      Document Text:
      ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: unclearTermsSchema,
        systemInstruction: "You are a diligent legal auditor. Your goal is to find ambiguity."
      }
    });
    
    const json = JSON.parse(response.text || "{}");
    return json.terms || [];
  } catch (error) {
    console.error("Unclear Terms Analysis Error:", error);
    return [];
  }
};

export const performLegalResearch = async (query: string): Promise<ResearchResult> => {
  if (!query) throw new Error("No query provided.");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Research the following legal query. Cite official laws, court rulings, or reliable legal principles where applicable.
      
      Query: ${query}`,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "You are a legal researcher. Provide accurate, cited information based on real-time data. Prioritize official government sources and reputable legal databases."
      }
    });

    const text = response.text || "No results found.";
    
    // Extract sources from grounding metadata if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({ title: web.title, uri: web.uri })) || [];

    // Filter duplicates
    const uniqueSources = sources.filter((v: any, i: number, a: any[]) => a.findIndex((t: any) => t.uri === v.uri) === i);

    return {
      answer: text,
      sources: uniqueSources
    };

  } catch (error) {
    console.error("Gemini Research Error:", error);
    throw new Error("Failed to perform legal research.");
  }
};

export const chatWithCaseContext = async (
  message: string, 
  caseContext: string, 
  history: ChatMessage[]
): Promise<{ answer: string; suggestions: string[] }> => {
  try {
    const contextPrompt = `
      You are an AI Legal Associate assisting with a specific case.
      
      CASE CONTEXT:
      ${caseContext}
      
      YOUR ROLE:
      Answer the user's question based strictly on the case documents provided above and general legal principles.
      Be concise, professional, and cite specific clauses if applicable.
      
      IMPORTANT:
      Provide the answer in JSON format containing an 'answer' string and a 'suggestions' array of strings.
      The 'suggestions' should be 3 intelligent follow-up questions the user might want to ask next.

      USER QUESTION:
      ${message}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contextPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: chatResponseSchema
      }
    });

    const json = JSON.parse(response.text || "{}");
    return {
        answer: json.answer || "I could not generate a response.",
        suggestions: json.suggestions || []
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return {
        answer: "I encountered an error analyzing that request.",
        suggestions: []
    };
  }
};
