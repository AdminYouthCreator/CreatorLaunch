import React, { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiBarChart2,
  FiBookOpen,
  FiCheck,
  FiClipboard,
  FiCreditCard,
  FiDownload,
  FiFileText,
  FiHome,
  FiLogOut,
  FiMenu,
  FiPlus,
  FiRefreshCw,
  FiSend,
  FiShield,
  FiUploadCloud,
  FiUserPlus,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { useBusinessProgram } from '@/context/BusinessProgramContext';
import { createTrainingDashboard, trainingUsers } from '@/data/businessProgramTraining';
import {
  businessProgramApi,
  ProgramCard,
  ProgramDashboard,
  ProgramPurchaseRequest,
  ProgramRequestStatus,
  ProgramRole,
  ProgramStudent,
  ProgramUser,
} from '@/utils/businessProgramApi';

type PortalSection =
  | 'overview'
  | 'requests'
  | 'students'
  | 'accounts'
  | 'cards'
  | 'reports'
  | 'new-request'
  | 'receipts'
  | 'resources';

const roleLabels: Record<ProgramRole, string> = {
  admin: 'Admin',
  coach: 'Coach',
  student: 'Student',
};

const formatMoney = (value = 0) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

const formatDate = (value?: string | null) =>
  value
    ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(
        new Date(value),
      )
    : '—';

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const navigationForRole = (role: ProgramRole): Array<{
  id: PortalSection;
  label: string;
  icon: ReactNode;
}> => {
  if (role === 'admin') {
    return [
      { id: 'overview', label: 'Overview', icon: <FiHome /> },
      { id: 'requests', label: 'Purchase requests', icon: <FiClipboard /> },
      { id: 'students', label: 'Students & budgets', icon: <FiUsers /> },
      { id: 'accounts', label: 'Accounts', icon: <FiUserPlus /> },
      { id: 'cards', label: 'Cards', icon: <FiCreditCard /> },
      { id: 'reports', label: 'Reports', icon: <FiBarChart2 /> },
    ];
  }

  if (role === 'coach') {
    return [
      { id: 'overview', label: 'Overview', icon: <FiHome /> },
      { id: 'requests', label: 'Review requests', icon: <FiClipboard /> },
      { id: 'students', label: 'Assigned students', icon: <FiUsers /> },
    ];
  }

  return [
    { id: 'overview', label: 'Home', icon: <FiHome /> },
    { id: 'new-request', label: 'New request', icon: <FiPlus /> },
    { id: 'requests', label: 'My requests', icon: <FiClipboard /> },
    { id: 'receipts', label: 'Receipts', icon: <FiUploadCloud /> },
    { id: 'resources', label: 'Business resources', icon: <FiBookOpen /> },
  ];
};

const StatusBadge = ({ status }: { status: ProgramRequestStatus | ProgramCard['status'] }) => (
  <span className={`bp-status bp-status-${status}`}>{status}</span>
);

const EmptyState = ({ title, text }: { title: string; text: string }) => (
  <div className="bp-empty-state">
    <FiFileText aria-hidden="true" />
    <strong>{title}</strong>
    <p>{text}</p>
  </div>
);

const MetricCard = ({
  label,
  value,
  note,
  tone = 'blue',
}: {
  label: string;
  value: string | number;
  note: string;
  tone?: 'blue' | 'mint' | 'yellow' | 'coral';
}) => (
  <article className={`bp-metric bp-metric-${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
    <p>{note}</p>
  </article>
);

const SpendingMeter = ({ student, threshold }: { student: ProgramStudent; threshold: number }) => {
  const percentage = Math.min(100, (student.approvedSpend / Math.max(1, student.budgetLimit)) * 100);
  return (
    <article className={`bp-student-meter ${student.spendingWarning ? 'is-warning' : ''}`}>
      <div className="bp-student-meter-top">
        <div>
          <strong>{student.name}</strong>
          <span>{student.assignedCoach?.name || 'Coach not assigned'}</span>
        </div>
        <div className="bp-student-money">
          <strong>{formatMoney(student.approvedSpend)}</strong>
          <span>of {formatMoney(student.budgetLimit)} approved</span>
        </div>
      </div>
      <div className="bp-progress-track" aria-label={`${student.name} approved spending`}>
        <span style={{ width: `${percentage}%` }} />
      </div>
      <div className="bp-meter-foot">
        <span>{formatMoney(student.remainingBudget)} available</span>
        {student.approvedSpend >= threshold && (
          <span className="bp-inline-warning"><FiAlertTriangle /> Near spending limit</span>
        )}
      </div>
    </article>
  );
};

export default function BusinessProgramPortal() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useBusinessProgram();
  const [trainingRole, setTrainingRole] = useState<ProgramRole>('admin');
  const [section, setSection] = useState<PortalSection>('overview');
  const [dashboard, setDashboard] = useState<ProgramDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'warning' | 'error'; text: string } | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [recurringChecks, setRecurringChecks] = useState<Record<string, boolean>>({});

  const isTraining = router.query.training === '1';
  const activeUser = isTraining ? trainingUsers[trainingRole] : user;
  const activeRole = activeUser?.role || trainingRole;
  const navItems = useMemo(() => navigationForRole(activeRole), [activeRole]);

  useEffect(() => {
    if (!router.isReady) return;

    if (isTraining) {
      const requestedRole = router.query.role;
      const nextRole: ProgramRole =
        requestedRole === 'coach' || requestedRole === 'student' ? requestedRole : 'admin';
      setTrainingRole(nextRole);
      setDashboard(createTrainingDashboard(nextRole));
      setLoading(false);
      return;
    }

    if (!authLoading && !user) {
      router.replace('/business-program/login');
      return;
    }

    if (user) {
      setLoading(true);
      businessProgramApi
        .dashboard()
        .then(setDashboard)
        .catch((error) => setNotice({ tone: 'error', text: error.message }))
        .finally(() => setLoading(false));
    }
  }, [router.isReady, router.query.training, router.query.role, authLoading, user]);

  useEffect(() => {
    setSection('overview');
  }, [activeRole]);

  const refreshDashboard = async () => {
    if (isTraining) return;
    const nextDashboard = await businessProgramApi.dashboard();
    setDashboard(nextDashboard);
  };

  const showNotice = (tone: 'success' | 'warning' | 'error', text: string) => {
    setNotice({ tone, text });
    window.setTimeout(() => setNotice(null), 5500);
  };

  const switchTrainingRole = async (role: ProgramRole) => {
    setTrainingRole(role);
    setDashboard(createTrainingDashboard(role));
    setSection('overview');
    setMenuOpen(false);
    await router.replace(
      { pathname: '/business-program/portal', query: { training: '1', role } },
      undefined,
      { shallow: true },
    );
  };

  const createAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const role = data.get('role') as ProgramRole;
    const payload = {
      name: data.get('name'),
      email: data.get('email'),
      password: data.get('password'),
      role,
      budgetLimit: Number(data.get('budgetLimit') || 300),
      assignedCoach: data.get('assignedCoach') || null,
      creatorResourceEmail: data.get('creatorResourceEmail'),
    };

    try {
      if (isTraining) {
        const id = `training-account-${Date.now()}`;
        const account: ProgramUser = {
          id,
          name: String(payload.name),
          email: String(payload.email),
          role,
          status: 'active',
          creatorResourceEmail: String(payload.creatorResourceEmail || ''),
          budgetLimit: role === 'student' ? payload.budgetLimit : 0,
          assignedCoach:
            role === 'student' && payload.assignedCoach
              ? dashboard?.accounts.find((candidate) => candidate.id === payload.assignedCoach)
                ? {
                    id: String(payload.assignedCoach),
                    name:
                      dashboard.accounts.find((candidate) => candidate.id === payload.assignedCoach)?.name || '',
                  }
                : null
              : null,
        };

        setDashboard((current) => {
          if (!current) return current;
          const next: ProgramDashboard = { ...current, accounts: [...current.accounts, account] };
          if (role === 'student') {
            const student: ProgramStudent = {
              ...(account as ProgramStudent),
              role: 'student',
              budgetLimit: payload.budgetLimit,
              approvedSpend: 0,
              remainingBudget: payload.budgetLimit,
              spendingWarning: false,
            };
            next.students = [...current.students, student];
            next.stats = {
              ...current.stats,
              activeStudents: (current.stats.activeStudents || 0) + 1,
            };
          }
          return next;
        });
      } else {
        await businessProgramApi.createAccount(payload);
        await refreshDashboard();
      }

      form.reset();
      showNotice('success', 'Program account added.');
    } catch (error: any) {
      showNotice('error', error.message);
    }
  };

  const submitPurchaseRequest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      vendor: data.get('vendor'),
      item: data.get('item'),
      amount: Number(data.get('amount')),
      purchaseType: data.get('purchaseType'),
      description: data.get('description'),
    };

    try {
      if (isTraining) {
        const request: ProgramPurchaseRequest = {
          id: `training-request-${Date.now()}`,
          student: {
            id: trainingUsers.student.id,
            name: trainingUsers.student.name,
            email: trainingUsers.student.email,
          },
          vendor: String(payload.vendor),
          item: String(payload.item),
          amount: payload.amount,
          purchaseType: payload.purchaseType === 'recurring' ? 'recurring' : 'one-time',
          description: String(payload.description),
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        setDashboard((current) =>
          current
            ? {
                ...current,
                requests: [request, ...current.requests],
                stats: {
                  ...current.stats,
                  pendingRequests: current.stats.pendingRequests + 1,
                },
              }
            : current,
        );
      } else {
        const result = await businessProgramApi.createPurchaseRequest(payload);
        await refreshDashboard();
        if (result.warnings?.length) showNotice('warning', result.warnings.join(' '));
      }

      form.reset();
      setSection('requests');
      showNotice(
        payload.purchaseType === 'recurring' ? 'warning' : 'success',
        payload.purchaseType === 'recurring'
          ? 'Request submitted. Recurring subscriptions are discouraged and need extra staff review.'
          : 'Purchase request submitted for review.',
      );
    } catch (error: any) {
      showNotice('error', error.message);
    }
  };

  const reviewRequest = async (request: ProgramPurchaseRequest, status: 'approved' | 'denied') => {
    const reviewNote = reviewNotes[request.id] || '';
    const acknowledgeRecurring = Boolean(recurringChecks[request.id]);

    try {
      if (request.purchaseType === 'recurring' && status === 'approved' && !acknowledgeRecurring) {
        throw new Error('Confirm the recurring purchase before approving it.');
      }

      if (isTraining) {
        let warning = '';
        if (status === 'approved') {
          const student = dashboard?.students.find((candidate) => candidate.id === request.student.id);
          if (!student) throw new Error('The student account could not be found.');

          const approvedSpend = student.approvedSpend + request.amount;
          if (approvedSpend > student.budgetLimit) {
            throw new Error(`Approval would exceed ${student.name}’s program budget.`);
          }
          if (approvedSpend >= (dashboard?.warningThreshold || 290)) {
            warning = `${student.name} has reached the ${formatMoney(dashboard?.warningThreshold || 290)} spending warning level.`;
          }
        }

        setDashboard((current) => {
          if (!current) return current;
          let nextStudents = current.students;

          if (status === 'approved') {
            nextStudents = current.students.map((student) => {
              if (student.id !== request.student.id) return student;
              const approvedSpend = student.approvedSpend + request.amount;
              return {
                ...student,
                approvedSpend,
                remainingBudget: student.budgetLimit - approvedSpend,
                spendingWarning: approvedSpend >= current.warningThreshold,
              };
            });
          }

          return {
            ...current,
            students: nextStudents,
            requests: current.requests.map((candidate) =>
              candidate.id === request.id
                ? {
                    ...candidate,
                    status,
                    reviewNote,
                    reviewedBy: { id: activeUser?.id || '', name: activeUser?.name || 'Staff' },
                    reviewedAt: new Date().toISOString(),
                  }
                : candidate,
            ),
            stats: {
              ...current.stats,
              pendingRequests: Math.max(0, current.stats.pendingRequests - 1),
              approvedSpend:
                status === 'approved'
                  ? (current.stats.approvedSpend || 0) + request.amount
                  : current.stats.approvedSpend,
            },
          };
        });
        showNotice(warning ? 'warning' : 'success', warning || `Request ${status}.`);
      } else {
        const result = await businessProgramApi.reviewPurchaseRequest(request.id, {
          status,
          reviewNote,
          acknowledgeRecurring,
        });
        await refreshDashboard();
        showNotice(result.warnings?.length ? 'warning' : 'success', result.warnings?.join(' ') || `Request ${status}.`);
      }
    } catch (error: any) {
      showNotice('error', error.message);
    }
  };

  const uploadReceipt = async (request: ProgramPurchaseRequest, file?: File) => {
    if (!file) return;
    try {
      if (isTraining) {
        setDashboard((current) =>
          current
            ? {
                ...current,
                requests: current.requests.map((candidate) =>
                  candidate.id === request.id
                    ? {
                        ...candidate,
                        receipt: { fileName: file.name, uploadedAt: new Date().toISOString() },
                      }
                    : candidate,
                ),
                stats: {
                  ...current.stats,
                  receiptsNeeded: Math.max(0, (current.stats.receiptsNeeded || 0) - 1),
                },
              }
            : current,
        );
      } else {
        await businessProgramApi.uploadReceipt(request.id, file);
        await refreshDashboard();
      }
      showNotice('success', `${file.name} was added to the request.`);
    } catch (error: any) {
      showNotice('error', error.message);
    }
  };

  const issueCard = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      studentId: String(data.get('studentId')),
      nickname: String(data.get('nickname')),
      lastFour: String(data.get('lastFour')),
    };

    try {
      if (isTraining) {
        const student = dashboard?.students.find((candidate) => candidate.id === payload.studentId);
        if (!student) throw new Error('Select a student.');
        const card: ProgramCard = {
          id: `training-card-${Date.now()}`,
          student: { id: student.id, name: student.name },
          nickname: payload.nickname,
          lastFour: payload.lastFour,
          status: 'active',
          issuedAt: new Date().toISOString(),
        };
        setDashboard((current) =>
          current
            ? {
                ...current,
                cards: [
                  card,
                  ...current.cards.map((existing) =>
                    existing.student.id === student.id && existing.status === 'active'
                      ? { ...existing, status: 'replaced' as const }
                      : existing,
                  ),
                ],
                stats: { ...current.stats, activeCards: current.stats.activeCards || 1 },
              }
            : current,
        );
      } else {
        await businessProgramApi.issueCard(payload);
        await refreshDashboard();
      }
      form.reset();
      showNotice('success', 'Card record issued and added to current cards.');
    } catch (error: any) {
      showNotice('error', error.message);
    }
  };

  const updateCardStatus = async (card: ProgramCard, status: ProgramCard['status']) => {
    try {
      if (isTraining) {
        setDashboard((current) =>
          current
            ? {
                ...current,
                cards: current.cards.map((candidate) =>
                  candidate.id === card.id ? { ...candidate, status } : candidate,
                ),
              }
            : current,
        );
      } else {
        await businessProgramApi.updateCardStatus(card.id, status);
        await refreshDashboard();
      }
      showNotice('success', `Card marked ${status}.`);
    } catch (error: any) {
      showNotice('error', error.message);
    }
  };

  const downloadReport = async () => {
    try {
      if (isTraining) {
        const rows = [
          ['Student', 'Coach', 'Budget', 'Approved spending', 'Remaining', 'Warning'],
          ...(dashboard?.students || []).map((student) => [
            student.name,
            student.assignedCoach?.name || 'Unassigned',
            student.budgetLimit.toFixed(2),
            student.approvedSpend.toFixed(2),
            student.remainingBudget.toFixed(2),
            student.spendingWarning ? 'Near spending limit' : '',
          ]),
        ];
        const csv = rows
          .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
          .join('\n');
        downloadBlob(new Blob([csv], { type: 'text/csv' }), 'creatorlaunch-training-report.csv');
      } else {
        const blob = await businessProgramApi.downloadReport();
        downloadBlob(blob, `creatorlaunch-program-report-${new Date().toISOString().slice(0, 10)}.csv`);
      }
      showNotice('success', 'Program spending report generated.');
    } catch (error: any) {
      showNotice('error', error.message);
    }
  };

  if (!router.isReady || loading || authLoading || !activeUser || !dashboard) {
    return (
      <main className="bp-loading-screen">
        <img src="/assets/header-logo.png" alt="CreatorLaunch" />
        <FiRefreshCw className="bp-spin" aria-hidden="true" />
        <p>Loading the Student Business Program portal…</p>
      </main>
    );
  }

  const renderOverview = () => {
    if (activeRole === 'student') {
      const nextRequest = dashboard.requests[0];
      return (
        <div className="bp-page-stack">
          <header className="bp-page-header">
            <div><p>Student home</p><h1>Welcome back, {activeUser.name.split(' ')[0]}.</h1></div>
            <button className="bp-primary-button" onClick={() => setSection('new-request')}>
              <FiPlus /> New purchase request
            </button>
          </header>

          <div className="bp-metric-grid bp-metric-grid-three">
            <MetricCard label="Pending requests" value={dashboard.stats.pendingRequests} note="Waiting for staff review" tone="yellow" />
            <MetricCard label="Approved requests" value={dashboard.stats.approvedRequests || 0} note="Ready for the next step" tone="mint" />
            <MetricCard label="Receipts needed" value={dashboard.stats.receiptsNeeded || 0} note="Upload after a purchase" tone="coral" />
          </div>

          <div className="bp-two-column">
            <section className="bp-panel">
              <div className="bp-panel-heading">
                <div><span>Latest activity</span><h2>Your most recent request</h2></div>
                <button className="bp-text-button" onClick={() => setSection('requests')}>View all</button>
              </div>
              {nextRequest ? (
                <div className="bp-latest-request">
                  <div><strong>{nextRequest.item}</strong><span>{nextRequest.vendor}</span></div>
                  <StatusBadge status={nextRequest.status} />
                  <p>{nextRequest.description}</p>
                  <small>Submitted {formatDate(nextRequest.createdAt)}</small>
                </div>
              ) : (
                <EmptyState title="No requests yet" text="Start with a purchase request when your project needs something." />
              )}
            </section>

            <section className="bp-panel bp-panel-dark">
              <span className="bp-panel-kicker">How spending works</span>
              <h2>Ask first. Purchase after approval.</h2>
              <ol className="bp-step-list">
                <li><span>1</span>Submit what you need and explain how it supports your project.</li>
                <li><span>2</span>Wait for an Admin or Coach to review the request.</li>
                <li><span>3</span>Upload the receipt after an approved purchase is completed.</li>
              </ol>
              <p className="bp-dark-note">Your program budget is managed by staff and is not displayed in the student portal.</p>
            </section>
          </div>
        </div>
      );
    }

    const watchStudents = [...dashboard.students].sort((a, b) => b.approvedSpend - a.approvedSpend).slice(0, 4);
    const pending = dashboard.requests.filter((request) => request.status === 'pending').slice(0, 3);
    return (
      <div className="bp-page-stack">
        <header className="bp-page-header">
          <div>
            <p>{roleLabels[activeRole]} overview</p>
            <h1>{activeRole === 'admin' ? 'Program operations at a glance.' : 'Your students and reviews.'}</h1>
          </div>
          <button className="bp-secondary-button" onClick={() => refreshDashboard()} disabled={isTraining}>
            <FiRefreshCw /> Refresh
          </button>
        </header>

        <div className="bp-metric-grid">
          <MetricCard label={activeRole === 'coach' ? 'Assigned students' : 'Active students'} value={dashboard.stats.activeStudents || 0} note="Current program accounts" tone="blue" />
          <MetricCard label="Pending requests" value={dashboard.stats.pendingRequests} note="Need a staff decision" tone="yellow" />
          <MetricCard label="Approved spending" value={formatMoney(dashboard.stats.approvedSpend || 0)} note="Across visible students" tone="mint" />
          <MetricCard label="Active cards" value={dashboard.stats.activeCards || 0} note="Current card records" tone="coral" />
        </div>

        <div className="bp-two-column bp-two-column-wide">
          <section className="bp-panel">
            <div className="bp-panel-heading">
              <div><span>Spending watch</span><h2>Approved spending by student</h2></div>
              <button className="bp-text-button" onClick={() => setSection('students')}>View students</button>
            </div>
            <div className="bp-meter-list">
              {watchStudents.map((student) => (
                <SpendingMeter key={student.id} student={student} threshold={dashboard.warningThreshold} />
              ))}
            </div>
          </section>

          <section className="bp-panel">
            <div className="bp-panel-heading">
              <div><span>Needs review</span><h2>Purchase request queue</h2></div>
              <button className="bp-text-button" onClick={() => setSection('requests')}>Open queue</button>
            </div>
            <div className="bp-compact-request-list">
              {pending.length ? pending.map((request) => (
                <button key={request.id} onClick={() => setSection('requests')}>
                  <span className="bp-request-avatar">{request.student.name.charAt(0)}</span>
                  <span><strong>{request.item}</strong><small>{request.student.name} · {request.vendor}</small></span>
                  <b>{formatMoney(request.amount)}</b>
                </button>
              )) : <EmptyState title="Queue is clear" text="There are no pending requests right now." />}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderRequests = () => {
    const staffView = activeRole !== 'student';
    return (
      <div className="bp-page-stack">
        <header className="bp-page-header">
          <div>
            <p>{staffView ? 'Review queue' : 'Request history'}</p>
            <h1>{staffView ? 'Purchase requests' : 'Track your requests'}</h1>
            <span>{staffView ? 'Approve one-time project purchases and carefully review recurring costs.' : 'See what is pending, approved, or denied. Your remaining budget is managed by staff.'}</span>
          </div>
          {activeRole === 'student' && (
            <button className="bp-primary-button" onClick={() => setSection('new-request')}><FiPlus /> New request</button>
          )}
        </header>

        <div className="bp-request-list">
          {dashboard.requests.length ? dashboard.requests.map((request) => (
            <article className="bp-request-card" key={request.id}>
              <div className="bp-request-card-top">
                <div>
                  {staffView && <span className="bp-request-student">{request.student.name}</span>}
                  <h2>{request.item}</h2>
                  <p>{request.vendor} · Submitted {formatDate(request.createdAt)}</p>
                </div>
                <div className="bp-request-amount">
                  <strong>{formatMoney(request.amount)}</strong>
                  <StatusBadge status={request.status} />
                </div>
              </div>

              <p className="bp-request-description">{request.description}</p>

              <div className="bp-request-tags">
                <span>{request.purchaseType === 'recurring' ? 'Recurring subscription' : 'One-time purchase'}</span>
                {request.receipt && <span className="is-complete"><FiCheck /> Receipt attached</span>}
              </div>

              {request.purchaseType === 'recurring' && (
                <div className="bp-recurring-warning">
                  <FiAlertTriangle /> Recurring subscriptions are discouraged. Confirm the ongoing need and cancellation plan before approval.
                </div>
              )}

              {request.reviewNote && (
                <div className="bp-review-note"><strong>Staff note</strong><p>{request.reviewNote}</p></div>
              )}

              {staffView && request.status === 'pending' && (
                <div className="bp-review-controls">
                  <label>
                    Review note
                    <textarea
                      value={reviewNotes[request.id] || ''}
                      onChange={(event) => setReviewNotes((current) => ({ ...current, [request.id]: event.target.value }))}
                      placeholder="Explain the decision or next step…"
                      rows={2}
                    />
                  </label>
                  {request.purchaseType === 'recurring' && (
                    <label className="bp-check-row">
                      <input
                        type="checkbox"
                        checked={Boolean(recurringChecks[request.id])}
                        onChange={(event) => setRecurringChecks((current) => ({ ...current, [request.id]: event.target.checked }))}
                      />
                      I confirmed that this recurring cost is necessary and has a cancellation plan.
                    </label>
                  )}
                  <div className="bp-review-actions">
                    <button className="bp-deny-button" onClick={() => reviewRequest(request, 'denied')}><FiX /> Deny</button>
                    <button className="bp-approve-button" onClick={() => reviewRequest(request, 'approved')}><FiCheck /> Approve</button>
                  </div>
                </div>
              )}
            </article>
          )) : <EmptyState title="No purchase requests" text="Requests will appear here after a student submits one." />}
        </div>
      </div>
    );
  };

  const renderStudents = () => (
    <div className="bp-page-stack">
      <header className="bp-page-header">
        <div>
          <p>{activeRole === 'coach' ? 'Assigned students' : 'Student spending'}</p>
          <h1>{activeRole === 'coach' ? 'Students you support' : 'Budgets and approved spending'}</h1>
          <span>The warning appears when approved spending reaches {formatMoney(dashboard.warningThreshold)}.</span>
        </div>
      </header>
      <div className="bp-student-grid">
        {dashboard.students.map((student) => (
          <article className={`bp-student-card ${student.spendingWarning ? 'is-warning' : ''}`} key={student.id}>
            <div className="bp-student-card-head">
              <span className="bp-large-avatar">{student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>
              <div><h2>{student.name}</h2><p>{student.email}</p></div>
              {student.spendingWarning && <FiAlertTriangle className="bp-warning-icon" />}
            </div>
            <dl className="bp-student-finances">
              <div><dt>Approved</dt><dd>{formatMoney(student.approvedSpend)}</dd></div>
              <div><dt>Program budget</dt><dd>{formatMoney(student.budgetLimit)}</dd></div>
              <div><dt>Available</dt><dd>{formatMoney(student.remainingBudget)}</dd></div>
            </dl>
            <div className="bp-progress-track"><span style={{ width: `${Math.min(100, (student.approvedSpend / Math.max(student.budgetLimit, 1)) * 100)}%` }} /></div>
            <div className="bp-student-meta">
              <span>Coach: {student.assignedCoach?.name || 'Not assigned'}</span>
              {student.creatorResourceEmail && <span>Resource email: {student.creatorResourceEmail}</span>}
            </div>
          </article>
        ))}
      </div>
    </div>
  );

  const renderAccounts = () => {
    const coaches = dashboard.accounts.filter((account) => account.role === 'coach');
    return (
      <div className="bp-page-stack">
        <header className="bp-page-header">
          <div><p>Access management</p><h1>Program accounts</h1><span>Add administrators, coaches, and students without changing original CreatorLaunch accounts.</span></div>
        </header>

        <div className="bp-two-column bp-two-column-form">
          <section className="bp-panel">
            <div className="bp-panel-heading"><div><span>New account</span><h2>Add someone to the program</h2></div></div>
            <form className="bp-form-grid" onSubmit={createAccount}>
              <label className="bp-field-wide">Full name<input name="name" placeholder="Student or staff name" required /></label>
              <label>Email<input name="email" type="email" placeholder="name@example.org" required /></label>
              <label>Temporary password<input name="password" type="password" minLength={8} placeholder="At least 8 characters" required /></label>
              <label>
                Role
                <select name="role" defaultValue="student">
                  <option value="student">Student</option>
                  <option value="coach">Coach</option>
                  <option value="admin">Admin</option>
                </select>
              </label>
              <label>Student budget<input name="budgetLimit" type="number" min="0" step="0.01" defaultValue="300" /></label>
              <label>
                Assigned coach
                <select name="assignedCoach" defaultValue="">
                  <option value="">Not assigned</option>
                  {coaches.map((coach) => <option key={coach.id} value={coach.id}>{coach.name}</option>)}
                </select>
              </label>
              <label>CreatorLaunch resource email<input name="creatorResourceEmail" type="email" placeholder="Optional managed email" /></label>
              <div className="bp-field-wide bp-form-guidance">
                <FiShield /> CreatorLaunch-owned emails may be used for student business tools. Make ownership and transfer expectations clear to the student.
              </div>
              <button className="bp-primary-button bp-field-wide" type="submit"><FiUserPlus /> Add program account</button>
            </form>
          </section>

          <section className="bp-panel">
            <div className="bp-panel-heading"><div><span>Current access</span><h2>{dashboard.accounts.length} program accounts</h2></div></div>
            <div className="bp-account-list">
              {dashboard.accounts.map((account) => (
                <div key={account.id}>
                  <span className="bp-account-avatar">{account.name.charAt(0)}</span>
                  <span><strong>{account.name}</strong><small>{account.email}</small></span>
                  <b className={`bp-role-pill bp-role-${account.role}`}>{roleLabels[account.role]}</b>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  };

  const renderCards = () => (
    <div className="bp-page-stack">
      <header className="bp-page-header"><div><p>Card management</p><h1>Current program cards</h1><span>Only the card’s last four digits are stored in CreatorLaunch.</span></div></header>
      <div className="bp-two-column bp-two-column-form">
        <section className="bp-panel">
          <div className="bp-panel-heading"><div><span>Issue card record</span><h2>Assign a new card</h2></div></div>
          <form className="bp-form-stack" onSubmit={issueCard}>
            <label>
              Student
              <select name="studentId" defaultValue="" required>
                <option value="" disabled>Select student</option>
                {dashboard.students.map((student) => <option key={student.id} value={student.id}>{student.name}</option>)}
              </select>
            </label>
            <label>Card nickname<input name="nickname" placeholder="Example: Jordan project card" required /></label>
            <label>Last four digits<input name="lastFour" inputMode="numeric" pattern="[0-9]{4}" maxLength={4} placeholder="1234" required /></label>
            <div className="bp-form-guidance"><FiShield /> Issuing a record replaces the student’s current active card record. This portal never stores a full card number.</div>
            <button className="bp-primary-button" type="submit"><FiCreditCard /> Issue card record</button>
          </form>
        </section>
        <section className="bp-panel">
          <div className="bp-panel-heading"><div><span>Card list</span><h2>{dashboard.cards.filter((card) => card.status === 'active').length} active</h2></div></div>
          <div className="bp-card-list">
            {dashboard.cards.map((card) => (
              <article key={card.id} className={`bp-program-card bp-program-card-${card.status}`}>
                <div><FiCreditCard /><StatusBadge status={card.status} /></div>
                <strong>•••• {card.lastFour}</strong>
                <p>{card.nickname}</p>
                <span>{card.student.name} · Issued {formatDate(card.issuedAt)}</span>
                <select value={card.status} onChange={(event) => updateCardStatus(card, event.target.value as ProgramCard['status'])}>
                  <option value="active">Active</option>
                  <option value="frozen">Frozen</option>
                  <option value="replaced">Replaced</option>
                </select>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="bp-page-stack">
      <header className="bp-page-header"><div><p>Program reporting</p><h1>Export a clear spending report</h1><span>Generate a CSV with student budgets, approved totals, remaining amounts, and warning status.</span></div></header>
      <section className="bp-report-card">
        <div className="bp-report-icon"><FiBarChart2 /></div>
        <div>
          <span>CSV report</span>
          <h2>Student spending summary</h2>
          <p>One row per student, ready to review in Excel or Google Sheets.</p>
          <ul><li>Student and assigned coach</li><li>Program budget and approved spending</li><li>Remaining staff-managed amount</li><li>$290 warning status</li></ul>
        </div>
        <button className="bp-primary-button" onClick={downloadReport}><FiDownload /> Generate report</button>
      </section>
    </div>
  );

  const renderNewRequest = () => (
    <div className="bp-page-stack">
      <header className="bp-page-header"><div><p>Project purchase</p><h1>Request what your business needs</h1><span>Explain the purpose clearly so staff can make a thoughtful decision.</span></div></header>
      <div className="bp-two-column bp-two-column-form">
        <section className="bp-panel">
          <form className="bp-form-grid" onSubmit={submitPurchaseRequest}>
            <label>Vendor or store<input name="vendor" placeholder="Where would it be purchased?" required /></label>
            <label>Item or service<input name="item" placeholder="What do you need?" required /></label>
            <label>Estimated total<input name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required /></label>
            <label>
              Purchase type
              <select name="purchaseType" defaultValue="one-time">
                <option value="one-time">One-time purchase</option>
                <option value="recurring">Recurring subscription</option>
              </select>
            </label>
            <label className="bp-field-wide">How does this support your project?<textarea name="description" rows={5} placeholder="Explain what the item helps you build, test, or learn…" required /></label>
            <div className="bp-field-wide bp-recurring-warning"><FiAlertTriangle /> Recurring subscriptions are discouraged. Choose a one-time option when possible, and never enable auto-renewal without staff approval.</div>
            <button className="bp-primary-button bp-field-wide" type="submit"><FiSend /> Submit request</button>
          </form>
        </section>
        <aside className="bp-panel bp-request-tips">
          <span className="bp-panel-kicker">Before you submit</span>
          <h2>A useful request answers three questions.</h2>
          <ol><li><span>1</span>What are you buying?</li><li><span>2</span>How will it help your project?</li><li><span>3</span>Can you use a one-time option instead?</li></ol>
          <p>You will see the decision and staff note in “My requests.” Your remaining budget is not shown in the student portal.</p>
        </aside>
      </div>
    </div>
  );

  const renderReceipts = () => {
    const approved = dashboard.requests.filter((request) => request.status === 'approved');
    return (
      <div className="bp-page-stack">
        <header className="bp-page-header"><div><p>Purchase records</p><h1>Upload receipts</h1><span>Add a clear PDF or image after an approved purchase is completed.</span></div></header>
        <section className="bp-panel">
          <div className="bp-receipt-list">
            {approved.length ? approved.map((request) => (
              <article key={request.id}>
                <div className={`bp-receipt-icon ${request.receipt ? 'is-complete' : ''}`}>{request.receipt ? <FiCheck /> : <FiUploadCloud />}</div>
                <div><h2>{request.item}</h2><p>{request.vendor} · {formatMoney(request.amount)}</p><span>{request.receipt ? request.receipt.fileName : 'Receipt needed'}</span></div>
                {request.receipt ? (
                  request.receipt.url ? <a href={request.receipt.url} target="_blank" rel="noreferrer">View receipt</a> : <span className="bp-complete-label">Uploaded</span>
                ) : (
                  <label className="bp-upload-button">Choose file<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={(event) => uploadReceipt(request, event.target.files?.[0])} /></label>
                )}
              </article>
            )) : <EmptyState title="No approved purchases yet" text="Receipt uploads appear after a request is approved." />}
          </div>
        </section>
      </div>
    );
  };

  const renderResources = () => (
    <div className="bp-page-stack">
      <header className="bp-page-header"><div><p>Business resources</p><h1>Your program-managed tools</h1><span>CreatorLaunch may provide an email or other accounts needed for your project.</span></div></header>
      <div className="bp-two-column">
        <section className="bp-panel">
          <div className="bp-resource-card">
            <span className="bp-resource-icon">@</span>
            <div><span>CreatorLaunch-owned email</span><h2>{activeUser.creatorResourceEmail || 'Not assigned yet'}</h2><p>{activeUser.creatorResourceEmail ? 'Use this only for approved business tools and project accounts.' : 'Staff will add an email here if your project needs one.'}</p></div>
          </div>
        </section>
        <section className="bp-panel bp-resource-rules">
          <span className="bp-panel-kicker">Resource rules</span>
          <h2>Keep access organized.</h2>
          <ul>
            <li><FiCheck /> Use program-managed accounts only for your approved project.</li>
            <li><FiCheck /> Save logins in the place your coach gives you.</li>
            <li><FiX /> Do not add personal payment methods or turn on auto-renewal.</li>
            <li><FiCheck /> Ask before changing account ownership or recovery information.</li>
          </ul>
        </section>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (section) {
      case 'requests': return renderRequests();
      case 'students': return renderStudents();
      case 'accounts': return renderAccounts();
      case 'cards': return renderCards();
      case 'reports': return renderReports();
      case 'new-request': return renderNewRequest();
      case 'receipts': return renderReceipts();
      case 'resources': return renderResources();
      default: return renderOverview();
    }
  };

  return (
    <main className={`bp-portal bp-role-view-${activeRole}`}>
      <Head>
        <title>Student Business Program portal | CreatorLaunch</title>
        <meta name="description" content="CreatorLaunch Student Business Program portal for students, coaches, and administrators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=DM+Sans:opsz,wght@9..40,400..800&display=swap" rel="stylesheet" />
      </Head>
      {isTraining && (
        <div className="bp-training-banner">
          <FiBookOpen aria-hidden="true" />
          <strong>This is a training environment.</strong>
          <span>Actions use sample data and do not affect live program records.</span>
          <Link href="/business-program/login">Exit training</Link>
        </div>
      )}

      <header className="bp-topbar">
        <button className="bp-mobile-menu-button" onClick={() => setMenuOpen((current) => !current)} aria-label="Open portal navigation"><FiMenu /></button>
        <Link href="/" className="bp-portal-brand">
          <img src="/assets/header-logo.png" alt="CreatorLaunch" />
          <span><strong>Student Business</strong><small>Program portal</small></span>
        </Link>
        {isTraining && (
          <div className="bp-role-switcher" aria-label="Training role">
            {(['admin', 'coach', 'student'] as ProgramRole[]).map((role) => (
              <button key={role} className={trainingRole === role ? 'active' : ''} onClick={() => switchTrainingRole(role)}>{roleLabels[role]}</button>
            ))}
          </div>
        )}
        <div className="bp-user-summary">
          <span className="bp-user-avatar">{activeUser.name.charAt(0)}</span>
          <span><strong>{activeUser.name}</strong><small>{roleLabels[activeRole]}</small></span>
          {!isTraining && <button onClick={() => { logout(); router.push('/business-program/login'); }} aria-label="Log out"><FiLogOut /></button>}
        </div>
      </header>

      <div className="bp-portal-layout">
        <aside className={`bp-sidebar ${menuOpen ? 'is-open' : ''}`}>
          <div className="bp-sidebar-heading"><span>Workspace</span><button onClick={() => setMenuOpen(false)} aria-label="Close navigation"><FiX /></button></div>
          <nav>
            {navItems.map((item) => (
              <button key={item.id} className={section === item.id ? 'active' : ''} onClick={() => { setSection(item.id); setMenuOpen(false); }}>
                {item.icon}<span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="bp-sidebar-help">
            <FiShield />
            <strong>Need help?</strong>
            <p>Contact CreatorLaunch with an account or purchase question.</p>
            <a href="mailto:qwentin@youthcreatorlaunch.org">Email support</a>
          </div>
          <Link href="/student-business-program" className="bp-back-site"><FiArrowLeft /> Program website</Link>
        </aside>

        <section className="bp-workspace">{renderSection()}</section>
      </div>

      {notice && (
        <div className={`bp-toast bp-toast-${notice.tone}`} role="status">
          {notice.tone === 'success' ? <FiCheck /> : <FiAlertTriangle />}
          <span>{notice.text}</span>
          <button onClick={() => setNotice(null)} aria-label="Dismiss"><FiX /></button>
        </div>
      )}
    </main>
  );
}
