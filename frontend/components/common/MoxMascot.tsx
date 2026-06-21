import React from 'react';

interface MoxMascotProps {
  className?: string;
  showWordmark?: boolean;
}

const MoxMascot: React.FC<MoxMascotProps> = ({ className = '', showWordmark = false }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 520 520" role="img" aria-label="Mox mascot" className="w-full h-auto">
        <defs>
          <linearGradient id="moxBox" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="55%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
          <linearGradient id="moxPencil" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6D28D9" />
            <stop offset="70%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>
          <linearGradient id="moxShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B1022" />
            <stop offset="100%" stopColor="#02103E" />
          </linearGradient>
        </defs>

        <ellipse cx="255" cy="424" rx="160" ry="28" fill="#D8CCFA" />

        <path d="M126 272L255 304L108 360C102 362 98 357 101 352L126 272Z" fill="#8B5CF6" />
        <path d="M384 272L255 304L402 360C408 362 412 357 409 352L384 272Z" fill="#9B6AFB" />

        <path d="M120 284H390V400C390 412 380 422 368 422H142C130 422 120 412 120 400V284Z" fill="url(#moxBox)" />
        <path d="M255 304L390 284V292L263 422H255V304Z" fill="#7C3AED" opacity="0.45" />
        <path d="M255 304L120 284V292L247 422H255V304Z" fill="#4C1D95" opacity="0.22" />

        <path d="M120 284L208 252L255 304L148 336C140 338 133 336 128 330L120 284Z" fill="#9B6AFB" />
        <path d="M390 284L302 252L255 304L362 336C370 338 377 336 382 330L390 284Z" fill="#A78BFA" />

        <path d="M170 182C170 113 222 76 275 76C325 76 358 114 358 164V302H170V182Z" fill="url(#moxShadow)" />
        <ellipse cx="222" cy="184" rx="18" ry="28" fill="#FFFFFF" />
        <ellipse cx="277" cy="184" rx="18" ry="28" fill="#FFFFFF" />

        <circle cx="174" cy="292" r="24" fill="url(#moxShadow)" />

        <path d="M326 182C327 152 333 137 358 116C376 101 394 110 398 131L415 230L380 244L350 177C347 171 338 174 338 181V232H326V182Z" fill="url(#moxShadow)" />

        <g transform="translate(376 116) rotate(-24)">
          <rect x="0" y="0" width="52" height="150" rx="20" fill="url(#moxPencil)" />
          <rect x="0" y="0" width="52" height="30" rx="10" fill="#5EEAD4" />
          <polygon points="10,-10 42,-10 26,0" fill="#0B1022" />
          <rect x="0" y="122" width="52" height="20" rx="10" fill="#C4B5FD" opacity="0.7" />
        </g>

        <g fill="#8B5CF6">
          <path d="M178 110L190 140L220 152L190 164L178 194L166 164L136 152L166 140Z" />
          <path d="M330 124L337 142L355 149L337 156L330 174L323 156L305 149L323 142Z" />
          <rect x="106" y="182" width="14" height="74" rx="7" transform="rotate(-42 106 182)" />
          <rect x="122" y="216" width="14" height="54" rx="7" transform="rotate(-22 122 216)" />
          <rect x="78" y="222" width="14" height="54" rx="7" transform="rotate(-64 78 222)" />
          <rect x="414" y="252" width="12" height="48" rx="6" transform="rotate(36 414 252)" />
          <rect x="442" y="264" width="12" height="34" rx="6" transform="rotate(69 442 264)" />
        </g>

        <g fill="#2DD4BF">
          <path d="M112 266L120 286L140 294L120 302L112 322L104 302L84 294L104 286Z" />
          <path d="M388 394L396 414L416 422L396 430L388 450L380 430L360 422L380 414Z" />
        </g>

        <g fill="#FBBF24">
          <rect x="110" y="334" width="10" height="32" rx="5" transform="rotate(-55 110 334)" />
          <rect x="392" y="326" width="10" height="32" rx="5" transform="rotate(35 392 326)" />
        </g>
      </svg>

      {showWordmark && (
        <div className="text-center -mt-2">
          <h3 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            Mox
          </h3>
          <p className="text-lg text-slate-600">
            by <span className="font-semibold text-primary">CreatorLaunch</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MoxMascot;