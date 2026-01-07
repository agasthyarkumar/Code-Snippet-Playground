type LogoMarkProps = {
  className?: string;
};

const LogoMark = ({ className }: LogoMarkProps) => {
  return (
    <div
      className={
        className ??
        'flex h-12 w-12 items-center justify-center rounded-xl border border-gray-300 bg-white shadow-soft'
      }
      aria-hidden="true"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="presentation"
      >
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#111827" opacity="0.06" />
        <path
          d="M22 24L14 32L22 40"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M42 24L50 32L42 40"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />
        <path
          d="M28 44L36 20"
          stroke="#111827"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LogoMark;
