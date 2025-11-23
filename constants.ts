import { Case } from "./types";

export const SAMPLE_CONTRACT = `MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into by and between TechCorp Inc. and DataFlow Ltd. (collectively, the "Parties") as of October 25, 2023.

1. Confidential Information.
"Confidential Information" means all non-public information disclosed by a Party to the other Party, whether orally or in writing, that is designated as confidential or that reasonably should be understood to be confidential given the nature of the information and the circumstances of disclosure.

2. Obligations.
Each Party agrees to hold the other Party's Confidential Information in strict confidence and not to disclose such information to any third party without the prior written consent of the disclosing Party. The receiving Party shall use the Confidential Information solely for the purpose of evaluating a potential business relationship.

3. Term and Termination.
This Agreement shall remain in effect for a period of five (5) years from the Effective Date. The obligations of confidentiality shall survive the termination of this Agreement for a period of two (2) years.

4. Governing Law.
This Agreement shall be governed by and construed in accordance with the laws of the State of New York.

5. Limitation of Liability.
IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT.
`;

export const MOCK_CASES: Case[] = [
  {
    id: 'CS-2024-001',
    title: 'Merger: OmniCorp & FutureSystems',
    client: 'OmniCorp Global Holdings',
    status: 'Active',
    description: 'Review of acquisition terms, IP transfer agreements, and regulatory compliance for EU markets.',
    accessCode: '1234',
    progress: 65,
    lastUpdated: '2 hours ago',
    documents: [
      { id: 'd1', title: 'Primary Merger Agreement_v3.pdf', type: 'Contract', content: SAMPLE_CONTRACT, dateAdded: '2024-02-10' },
      { id: 'd2', title: 'IP Portfolio Audit.docx', type: 'Audit', content: 'Audit text content placeholder...', dateAdded: '2024-02-12' }
    ],
    people: [
      { id: 'p1', name: 'Eleanor Sterling', role: 'Lead Counsel', organization: 'Veritas Legal', email: 'e.sterling@veritas.law' },
      { id: 'p2', name: 'Marcus Chen', role: 'Client Representative', organization: 'OmniCorp', email: 'm.chen@omnicorp.com' }
    ],
    notes: [
      { id: 'n1', content: 'Clause 4.2 needs revision regarding GDPR compliance.', date: '2024-02-14', author: 'Eleanor Sterling' }
    ],
    financials: [
        { id: 'f1', date: '2024-02-10', description: 'Initial Retainer', amount: 5000, type: 'Income', category: 'Flat Fee' },
        { id: 'f2', date: '2024-02-12', description: 'Document Review (3h)', amount: 1500, type: 'Income', category: 'Billable Hours' },
        { id: 'f3', date: '2024-02-13', description: 'Filing Fees', amount: 250, type: 'Expense', category: 'Court Fee' }
    ]
  },
  {
    id: 'CS-2024-042',
    title: 'Estate of A. Vanderbilt',
    client: 'Vanderbilt Trust',
    status: 'Pending',
    description: 'Probate verification and asset distribution analysis.',
    accessCode: '1234',
    progress: 15,
    lastUpdated: '1 day ago',
    documents: [],
    people: [],
    notes: [],
    financials: []
  },
  {
    id: 'CS-2023-899',
    title: 'Litigation: TechFlow v. DataStream',
    client: 'TechFlow Inc.',
    status: 'Archived',
    description: 'Intellectual property dispute resolution.',
    accessCode: '1234',
    progress: 100,
    lastUpdated: 'Oct 2023',
    documents: [],
    people: [],
    notes: [],
    financials: [
        { id: 'f99', date: '2023-10-01', description: 'Settlement Analysis', amount: 12000, type: 'Income', category: 'Billable Hours' }
    ]
  }
];
