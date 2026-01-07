const LogoMark = () => {
  return (
    <div className="brand-mark" aria-hidden="true">
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <rect x="4" y="4" width="56" height="56" rx="14" fill="url(#grad)" opacity="0.08" />
        <path
          d="M22 24L14 32L22 40"
          stroke="#E8ECF4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M42 24L50 32L42 40"
          stroke="#E8ECF4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M28 44L36 20"
          stroke="#5EEAD4"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="grad" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
            <stop stopColor="#5EEAD4" />
            <stop offset="1" stopColor="#38BDF8" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default LogoMark;
