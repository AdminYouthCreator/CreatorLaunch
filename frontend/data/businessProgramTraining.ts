import {
  ProgramCard,
  ProgramDashboard,
  ProgramPurchaseRequest,
  ProgramRole,
  ProgramUser,
} from '@/utils/businessProgramApi';

export const trainingUsers: Record<ProgramRole, ProgramUser> = {
  admin: {
    id: 'demo-admin',
    name: 'Qwentin Blassingame',
    email: 'admin@training.creatorlaunch.org',
    role: 'admin',
    status: 'active',
  },
  coach: {
    id: 'demo-coach',
    name: 'Maya Brooks',
    email: 'coach@training.creatorlaunch.org',
    role: 'coach',
    status: 'active',
  },
  student: {
    id: 'demo-student-1',
    name: 'Jordan Ellis',
    email: 'jordan@training.creatorlaunch.org',
    role: 'student',
    status: 'active',
    creatorResourceEmail: 'jordan.ellis@students.youthcreatorlaunch.org',
  },
};

const students: ProgramDashboard['students'] = [
  {
    ...trainingUsers.student,
    role: 'student',
    budgetLimit: 300,
    approvedSpend: 208,
    remainingBudget: 92,
    spendingWarning: false,
    assignedCoach: { id: 'demo-coach', name: 'Maya Brooks', email: 'coach@training.creatorlaunch.org' },
  },
  {
    id: 'demo-student-2',
    name: 'Nia Carter',
    email: 'nia@training.creatorlaunch.org',
    role: 'student',
    status: 'active',
    creatorResourceEmail: 'nia.carter@students.youthcreatorlaunch.org',
    budgetLimit: 300,
    approvedSpend: 292,
    remainingBudget: 8,
    spendingWarning: true,
    assignedCoach: { id: 'demo-coach', name: 'Maya Brooks', email: 'coach@training.creatorlaunch.org' },
  },
  {
    id: 'demo-student-3',
    name: 'Malik Thompson',
    email: 'malik@training.creatorlaunch.org',
    role: 'student',
    status: 'active',
    creatorResourceEmail: '',
    budgetLimit: 300,
    approvedSpend: 85,
    remainingBudget: 215,
    spendingWarning: false,
    assignedCoach: null,
  },
];

const requests: ProgramPurchaseRequest[] = [
  {
    id: 'request-1',
    student: { id: 'demo-student-1', name: 'Jordan Ellis', email: 'jordan@training.creatorlaunch.org' },
    vendor: 'Printful',
    item: 'Five sample T-shirts',
    description: 'Samples for testing print quality before choosing the first product.',
    amount: 76,
    purchaseType: 'one-time',
    status: 'pending',
    createdAt: '2026-11-02T18:15:00.000Z',
  },
  {
    id: 'request-2',
    student: { id: 'demo-student-2', name: 'Nia Carter', email: 'nia@training.creatorlaunch.org' },
    vendor: 'Canva',
    item: 'Canva Pro subscription',
    description: 'Recurring design subscription for social media graphics.',
    amount: 15,
    purchaseType: 'recurring',
    status: 'pending',
    createdAt: '2026-11-01T16:40:00.000Z',
  },
  {
    id: 'request-3',
    student: { id: 'demo-student-1', name: 'Jordan Ellis', email: 'jordan@training.creatorlaunch.org' },
    vendor: 'Namecheap',
    item: 'Business domain',
    description: 'One-year domain registration for the student business website.',
    amount: 18,
    purchaseType: 'one-time',
    status: 'approved',
    reviewNote: 'Approved for one year. Do not enable auto-renewal.',
    reviewedBy: { id: 'demo-coach', name: 'Maya Brooks' },
    reviewedAt: '2026-10-30T19:00:00.000Z',
    receipt: null,
    createdAt: '2026-10-29T15:30:00.000Z',
  },
  {
    id: 'request-4',
    student: { id: 'demo-student-3', name: 'Malik Thompson', email: 'malik@training.creatorlaunch.org' },
    vendor: 'Office Depot',
    item: 'Packaging and labels',
    description: 'Packaging materials for the first customer test run.',
    amount: 85,
    purchaseType: 'one-time',
    status: 'approved',
    reviewNote: 'Approved for the first test batch.',
    reviewedBy: { id: 'demo-admin', name: 'Qwentin Blassingame' },
    reviewedAt: '2026-10-28T17:00:00.000Z',
    receipt: { fileName: 'office-depot-receipt.pdf', uploadedAt: '2026-10-29T18:00:00.000Z' },
    createdAt: '2026-10-27T17:30:00.000Z',
  },
];

const cards: ProgramCard[] = [
  {
    id: 'card-1',
    student: { id: 'demo-student-1', name: 'Jordan Ellis' },
    nickname: 'Jordan project card',
    lastFour: '1842',
    status: 'active',
    issuedAt: '2026-10-18T15:00:00.000Z',
  },
  {
    id: 'card-2',
    student: { id: 'demo-student-2', name: 'Nia Carter' },
    nickname: 'Nia project card',
    lastFour: '9027',
    status: 'active',
    issuedAt: '2026-10-18T15:10:00.000Z',
  },
];

export const createTrainingDashboard = (role: ProgramRole): ProgramDashboard => {
  const assignedStudents = students.filter(
    (student) => student.assignedCoach?.id === trainingUsers.coach.id,
  );
  const visibleStudents =
    role === 'student'
      ? []
      : (role === 'coach' ? assignedStudents : students).map((student) => ({ ...student }));
  const visibleStudentIds = new Set(
    role === 'student'
      ? [trainingUsers.student.id]
      : visibleStudents.map((student) => student.id),
  );
  const visibleRequests = requests
    .filter((request) => visibleStudentIds.has(request.student.id))
    .map((request) => ({ ...request }));
  const visibleCards = cards
    .filter((card) => visibleStudentIds.has(card.student.id))
    .map((card) => ({ ...card }));

  const accounts: ProgramUser[] =
    role === 'admin'
      ? [trainingUsers.admin, trainingUsers.coach, ...students]
      : role === 'coach'
        ? visibleStudents
        : [];

  return {
    accounts: accounts.map((account) => ({ ...account })),
    students: visibleStudents,
    requests: visibleRequests,
    cards: visibleCards,
    warningThreshold: 290,
    stats:
      role === 'student'
        ? {
            pendingRequests: visibleRequests.filter((request) => request.status === 'pending').length,
            approvedRequests: visibleRequests.filter((request) => request.status === 'approved').length,
            receiptsNeeded: visibleRequests.filter(
              (request) => request.status === 'approved' && !request.receipt,
            ).length,
          }
        : {
            activeStudents: visibleStudents.length,
            pendingRequests: visibleRequests.filter((request) => request.status === 'pending').length,
            approvedSpend: visibleStudents.reduce((sum, student) => sum + student.approvedSpend, 0),
            activeCards: visibleCards.filter((card) => card.status === 'active').length,
          },
  };
};
