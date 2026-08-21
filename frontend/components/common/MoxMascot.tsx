import React, { useEffect, useRef, useState } from 'react';
import { createAvatar, type AvatarController } from '@bible-strong/avatar-react';
import avatarJson from '@/avatars/mox.avatar.json';

const MoxAvatar = createAvatar(avatarJson);

interface MoxMascotProps {
  className?: string;
  showWordmark?: boolean;
}

type MoxMood = 'idle' | 'curious' | 'playful' | 'celebrate' | 'sleeping';

const MoxMascot: React.FC<MoxMascotProps> = ({ className = '', showWordmark = false }) => {
  const avatar = useRef<AvatarController>(null);
  const [mood, setMood] = useState<MoxMood>('idle');
  const [reducedMotion, setReducedMotion] = useState(false);

  const play = (animation: MoxMood) => {
    setMood(animation);
    avatar.current?.play(animation);
  };

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setReducedMotion(media.matches);
    const updateVisibility = () => {
      if (document.hidden) {
        play('sleeping');
      } else {
        avatar.current?.play('waking');
        setMood('idle');
      }
    };

    updateMotionPreference();
    media.addEventListener('change', updateMotionPreference);
    document.addEventListener('visibilitychange', updateVisibility);

    return () => {
      media.removeEventListener('change', updateMotionPreference);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (reducedMotion || mood === 'celebrate') return;

    const bounds = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - bounds.left) / bounds.width;
    const vertical = (event.clientY - bounds.top) / bounds.height;

    if (vertical < 0.32) {
      avatar.current?.setExpression('upward-side-glance');
    } else if (vertical > 0.7) {
      avatar.current?.setExpression('gentle-downward-gaze');
    } else if (horizontal < 0.35) {
      avatar.current?.setExpression('curious-left');
    } else if (horizontal > 0.65) {
      avatar.current?.setExpression('playful-right');
    } else {
      avatar.current?.setExpression('small-attentive');
    }
  };

  const handleCelebration = () => {
    if (reducedMotion) {
      avatar.current?.setExpression('joyful-wide');
      setMood('playful');
      return;
    }

    play('celebrate');
  };

  return (
    <div className={className}>
      <button
        type="button"
        className="group relative block w-full cursor-pointer rounded-[2rem] focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-300"
        onPointerEnter={() => !reducedMotion && play('curious')}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => play('idle')}
        onFocus={() => !reducedMotion && avatar.current?.play('listening')}
        onBlur={() => play('idle')}
        onClick={handleCelebration}
        aria-label="Mox, the interactive CreatorLaunch mascot. Click to celebrate."
      >
        <span className="pointer-events-none absolute inset-x-10 bottom-4 h-8 rounded-full bg-violet-200/55 blur-xl transition-transform duration-300 group-hover:scale-110" />
        <MoxAvatar
          ref={avatar}
          defaultAnimation={reducedMotion ? undefined : 'idle'}
          defaultExpression={reducedMotion ? 'neutral' : undefined}
          size="100%"
          className="relative transition-transform duration-300 ease-out group-hover:-translate-y-1 group-active:scale-95"
          ariaLabel="Mox reacting to your pointer"
          onAnimationEnd={(animation) => {
            if (animation === 'celebrate' || animation === 'waking') play('idle');
          }}
          onError={(error) => console.error('Mox avatar error', error)}
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-violet-700 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          Click me!
        </span>
      </button>

      {showWordmark && (
        <div className="mt-3 text-center">
          <h3 className="text-4xl font-black tracking-tight text-slate-900 md:text-5xl">Mox</h3>
          <p className="text-lg text-slate-600">
            by <span className="font-semibold text-primary">CreatorLaunch</span>
          </p>
          <p className="mt-2 text-sm font-medium capitalize text-violet-600" aria-live="polite">
            Feeling {mood}
          </p>
        </div>
      )}
    </div>
  );
};

export default MoxMascot;
