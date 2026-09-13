import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number;
  animated?: boolean;
}

/**
 * Logo — a sleek, glowing infinity symbol (∞) that represents the
 * "unlimited" brand.  Built with a smooth SVG path so it renders
 * crisply at any size.
 */
export default function Logo({ className = "", size = 32, animated = false }: LogoProps) {
  const id = "logo";

  const svgProps = {
    width: size,
    height: size / 2,
    viewBox: "0 0 80 40",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    className,
    "aria-label": "Unlimited logo",
  };

  // Two interlocking loops — a proper infinity path
  const pathD =
    "M40 20 C40 20 34 6 22 6 C10 6 4 13 4 20 C4 27 10 34 22 34 C34 34 40 20 40 20 " +
    "C40 20 46 6 58 6 C70 6 76 13 76 20 C76 27 70 34 58 34 C46 34 40 20 40 20 Z";

  const inner = (
    <svg {...svgProps}>
      <defs>
        {/* Vivid purple → indigo → electric cyan gradient */}
        <linearGradient id={`${id}-grad`} x1="0" y1="0" x2="80" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>

        {/* Soft outer glow */}
        <filter id={`${id}-glow`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#818cf8" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Depth shadow layer — slightly offset, very dim */}
      <path
        d={pathD}
        stroke="#6366f130"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(0, 1)"
      />

      {/* Main infinity stroke with gradient + glow */}
      <path
        d={pathD}
        stroke={`url(#${id}-grad)`}
        strokeWidth="6.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id}-glow)`}
      />

      {/* Bright highlight streak */}
      <path
        d={pathD}
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="8 80"
        strokeDashoffset="-4"
        opacity="0.35"
      />
    </svg>
  );

  if (!animated) return inner;

  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0, rotate: -15 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ duration: 0.5, ease: "backOut" }}
      style={{ display: "inline-flex", alignItems: "center" }}
    >
      {inner}
    </motion.div>
  );
}
