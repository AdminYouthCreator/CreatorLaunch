import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MoxMascot from './MoxMascot';

const messages = [
  'Psst... got an idea worth launching?',
  'Tiny idea check: what could you build today?',
  'Mox says your next idea does not need to be perfect.',
  'A wild Mox appeared! Click me for some launch energy.',
];

const excludedRoutes = ['/admin', '/auth', '/checkout', '/logout', '/maintenance'];
const MAX_APPEARANCES = 2;

const MoxSurprise = () => {
  const router = useRouter();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState(messages[0]);
  const [side, setSide] = useState<'left' | 'right'>('right');
  const [scheduleVersion, setScheduleVersion] = useState(0);

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const isExcludedRoute = excludedRoutes.some(
    (route) => router.pathname === route || router.pathname.startsWith(`${route}/`),
  );

  const dismiss = () => {
    clearTimer();
    setVisible(false);
    setScheduleVersion((version) => version + 1);
  };

  useEffect(() => {
    if (isExcludedRoute) {
      clearTimer();
      setVisible(false);
      return;
    }

    const appearances = Number(sessionStorage.getItem('mox-surprise-count') || '0');
    if (appearances >= MAX_APPEARANCES) return;

    const delay = appearances === 0
      ? 25_000 + Math.random() * 35_000
      : 120_000 + Math.random() * 120_000;

    timer.current = setTimeout(() => {
      const nextAppearances = appearances + 1;
      sessionStorage.setItem('mox-surprise-count', String(nextAppearances));
      setMessage(messages[Math.floor(Math.random() * messages.length)]);
      setSide(Math.random() > 0.5 ? 'right' : 'left');
      setVisible(true);

      timer.current = setTimeout(dismiss, 12_000);
    }, delay);

    return clearTimer;
  }, [isExcludedRoute, scheduleVersion]);

  if (!visible || isExcludedRoute) return null;

  return (
    <aside
      className={`fixed bottom-4 z-[70] w-[min(19rem,calc(100vw-2rem))] rounded-3xl border border-violet-200 bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:bottom-6 ${
        side === 'right' ? 'right-4 sm:right-6' : 'left-4 sm:left-6'
      }`}
      role="status"
      aria-label="A surprise visit from Mox"
    >
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-lg font-bold text-slate-600 transition hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        aria-label="Dismiss Mox"
      >
        ×
      </button>

      <div className="grid grid-cols-[7rem_1fr] items-center gap-3">
        <MoxMascot className="w-28" />
        <div className="pr-2">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600">
            Mox popped in
          </p>
          <p className="mt-1 text-sm font-semibold leading-snug text-slate-800">{message}</p>
          <Link
            href="/meet-mox"
            onClick={dismiss}
            className="mt-3 inline-flex rounded-full bg-violet-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2"
          >
            Meet Mox
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default MoxSurprise;
