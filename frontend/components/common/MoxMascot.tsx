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
          <linearGradient id="moxBoxFront" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="52%" stopColor="#6D28D9" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
          <linearGradient id="moxBoxTop" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A78BFA" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
          <linearGradient id="moxBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10162F" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>
          <linearGradient id="moxSparkTeal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5EEAD4" />
            <stop offset="100%" stopColor="#14B8A6" />
          </linearGradient>
        </defs>

        <ellipse cx="260" cy="430" rx="178" ry="28" fill="#DDD6FE" />

        <path d="M128 290H392V395C392 412 379 425 362 425H158C141 425 128 412 128 395V290Z" fill="url(#moxBoxFront)" />
        <path d="M260 306L392 290V395C392 412 379 425 362 425H260V306Z" fill="#8B5CF6" opacity="0.62" />
        <path d="M260 306L128 290V395C128 412 141 425 158 425H260V306Z" fill="#4C1D95" opacity="0.26" />

        <path d="M128 290L214 258L260 306L151 338C140 341 130 334 128 323V290Z" fill="url(#moxBoxTop)" />
        <path d="M392 290L306 258L260 306L369 338C380 341 390 334 392 323V290Z" fill="#A78BFA" />
        <path d="M214 258H306L260 306L214 258Z" fill="#6D28D9" opacity="0.45" />

        <path d="M174 178C174 104 223 72 280 72C333 72 367 109 367 164V292H174V178Z" fill="url(#moxBody)" />
        <path d="M168 244C141 247 125 269 130 293C134 314 152 326 173 321C192 317 205 299 202 279C199 258 188 245 168 244Z" fill="url(#moxBody)" />
        <path d="M353 154C367 132 385 122 405 128C423 134 433 153 427 171C421 189 401 197 384 188C374 182 365 171 353 154Z" fill="url(#moxBody)" />

        <ellipse cx="231" cy="192" rx="18" ry="29" fill="#FFFFFF" />
        <ellipse cx="286" cy="192" rx="18" ry="29" fill="#FFFFFF" />

        <g fill="#8B5CF6">
          <path d="M147 112L160 145L194 158L160 171L147 205L134 171L100 158L134 145Z" />
          <path d="M333 136L342 158L364 167L342 176L333 198L324 176L302 167L324 158Z" />
          <rect x="93" y="210" width="14" height="66" rx="7" transform="rotate(-48 93 210)" />
          <rect x="111" y="244" width="14" height="50" rx="7" transform="rotate(-71 111 244)" />
          <rect x="415" y="266" width="13" height="46" rx="7" transform="rotate(47 415 266)" />
          <rect x="441" y="285" width="13" height="42" rx="7" transform="rotate(72 441 285)" />
        </g>

        <g fill="url(#moxSparkTeal)">
          <path d="M102 340L113 370L143 381L113 392L102 422L91 392L61 381L91 370Z" />
          <path d="M410 392L420 419L447 429L420 439L410 466L400 439L373 429L400 419Z" />
        </g>

        <g fill="#FBBF24">
          <rect x="93" y="386" width="10" height="32" rx="5" transform="rotate(-47 93 386)" />
          <rect x="392" y="344" width="10" height="35" rx="5" transform="rotate(28 392 344)" />
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