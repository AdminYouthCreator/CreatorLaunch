export type ProgramRole = 'admin' | 'coach' | 'student';
export type ProgramRequestStatus = 'pending' | 'approved' | 'denied';

export interface ProgramUser {
  id: string;
  name: string;
  email: string;
  role: ProgramRole;
  status: 'active' | 'inactive';
  creatorResourceEmail?: string;
  forcePasswordReset?: boolean;
  budgetLimit?: number;
  assignedCoach?: { id: string; name: string; email?: string } | null;
}

export interface ProgramStudent extends ProgramUser {
  role: 'student';
  budgetLimit: number;
  approvedSpend: number;
  remainingBudget: number;
  spendingWarning: boolean;
}

export interface ProgramPurchaseRequest {
  id: string;
  student: { id: string; name: string; email?: string };
  vendor: string;
  item: string;
  description: string;
  amount: number;
  purchaseType: 'one-time' | 'recurring';
  status: ProgramRequestStatus;
  reviewNote?: string;
  reviewedBy?: { id: string; name: string } | null;
  reviewedAt?: string | null;
  receipt?: { fileName: string; url?: string; uploadedAt?: string } | null;
  createdAt: string;
}

export interface ProgramCard {
  id: string;
  student: { id: string; name: string };
  nickname: string;
  lastFour: string;
  status: 'active' | 'frozen' | 'replaced';
  issuedAt: string;
}

export interface ProgramDashboard {
  accounts: ProgramUser[];
  students: ProgramStudent[];
  requests: ProgramPurchaseRequest[];
  cards: ProgramCard[];
  warningThreshold: number;
  stats: {
    activeStudents?: number;
    pendingRequests: number;
    approvedSpend?: number;
    activeCards?: number;
    approvedRequests?: number;
    receiptsNeeded?: number;
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
export const PROGRAM_TOKEN_KEY = 'cl_business_program_token';
export const PROGRAM_USER_KEY = 'cl_business_program_user';

const getToken = () =>
  typeof window === 'undefined' ? '' : localStorage.getItem(PROGRAM_TOKEN_KEY) || '';

const parseResponse = async (response: Response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'The program portal could not complete that request.');
  return data;
};

const request = async (path: string, init: RequestInit = {}) => {
  const headers = new Headers(init.headers || {});
  if (!(init.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return parseResponse(
    await fetch(`${API_BASE_URL}/api/business-program${path}`, {
      ...init,
      headers,
    }),
  );
};

export const businessProgramApi = {
  login: (email: string, password: string) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request('/me'),
  dashboard: (): Promise<ProgramDashboard> => request('/dashboard'),
  createAccount: (payload: Record<string, unknown>) =>
    request('/accounts', { method: 'POST', body: JSON.stringify(payload) }),
  createPurchaseRequest: (payload: Record<string, unknown>) =>
    request('/requests', { method: 'POST', body: JSON.stringify(payload) }),
  reviewPurchaseRequest: (
    requestId: string,
    payload: { status: 'approved' | 'denied'; reviewNote?: string; acknowledgeRecurring?: boolean },
  ) =>
    request(`/requests/${requestId}/review`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }),
  uploadReceipt: (requestId: string, file: File) => {
    const form = new FormData();
    form.append('receipt', file);
    return request(`/requests/${requestId}/receipt`, { method: 'POST', body: form });
  },
  issueCard: (payload: { studentId: string; nickname: string; lastFour: string }) =>
    request('/cards', { method: 'POST', body: JSON.stringify(payload) }),
  updateCardStatus: (cardId: string, status: ProgramCard['status']) =>
    request(`/cards/${cardId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  downloadReport: async () => {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/api/business-program/reports/spending.csv`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.message || 'Report download failed.');
    }
    return response.blob();
  },
};
