export interface Risk {
  severity: 'High' | 'Medium' | 'Low';
  description: string;
  recommendation: string;
}

export interface Clause {
  title: string;
  summary: string;
  significance: string;
}

export interface UnclearTerm {
  term: string;
  context: string;
  ambiguity: string;
  suggestion: string;
}

export interface LegalReport {
  summary: string;
  documentType: string;
  risks: Risk[];
  keyClauses: Clause[];
  overallScore: number; // 0-100
  recommendations: string[];
}

export interface ResearchResult {
  answer: string;
  sources: {
    title: string;
    uri: string;
  }[];
}

export interface Person {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
}

export interface CaseNote {
  id: string;
  content: string;
  date: string;
  author: string;
}

export interface CaseDocument {
  id: string;
  title: string;
  type: string;
  content: string;
  dateAdded: string;
}

export interface FinancialRecord {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Income' | 'Expense';
  category: 'Billable Hours' | 'Flat Fee' | 'Court Fee' | 'Administrative' | 'Other';
}

export interface Case {
  id: string;
  title: string;
  client: string;
  status: 'Active' | 'Pending' | 'Archived';
  description: string;
  accessCode: string; // Simulated security
  documents: CaseDocument[];
  people: Person[];
  notes: CaseNote[];
  financials: FinancialRecord[];
  lastUpdated: string;
  progress: number;
}

export enum AppView {
  LANDING = 'LANDING',
  DASHBOARD = 'DASHBOARD',
  CASE_DETAIL = 'CASE_DETAIL',
  TOOL = 'TOOL' // Quick analysis tool
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  suggestions?: string[]; // New: AI suggested follow-up questions
}
