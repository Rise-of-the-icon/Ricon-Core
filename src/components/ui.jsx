"use client";

import { useEffect, useState } from "react";

import { T, alpha, buttonReset, font } from "../config/theme.js";
import {
  ATMOSPHERIC_OVERLAY,
  IMAGE_FILTER,
  IMAGE_OVERLAY,
  asset,
} from "../data/siteData.js";

export function Icon({ name, size = 18, color = "currentColor" }) {
  const icons = {
    home: (
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
    ),
    users: (
      <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    ),
    shop: <path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />,
    api: <path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    chart: (
      <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    shield: (
      <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    ),
    verified: (
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    ),
    arrow: <path d="M17 8l4 4m0 0l-4 4m4-4H3" />,
    arrowUp: <path d="M12 19V5m0 0l-6 6m6-6l6 6" />,
    search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    menu: <path d="M4 6h16M4 12h16M4 18h16" />,
    x: <path d="M6 18L18 6M6 6l12 12" />,
    star: (
      <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    ),
    clock: <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    globe: (
      <path d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    zap: <path d="M13 10V3L4 14h7v7l9-11h-7z" />,
    lock: (
      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    ),
    play: (
      <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    ),
    check: <path d="M5 13l4 4L19 7" />,
    external: (
      <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    ),
    bell: (
      <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    ),
    grid: (
      <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    ),
    settings: (
      <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    ),
    chevDown: <path d="M19 9l-7 7-7-7" />,
    chevronRight: <path d="M9 5l7 7-7 7" />,
    copy: (
      <path d="M8 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-8a2 2 0 01-2-2V8zM6 16H5a2 2 0 01-2-2V5a2 2 0 012-2h9a2 2 0 012 2v1" />
    ),
    info: (
      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    share: <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14" />,
    filter: <path d="M4 6h16M7 12h10M10 18h4" />,
    eye: (
      <>
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M17.94 17.94A10.94 10.94 0 0112 19C5 19 1 12 1 12a21.66 21.66 0 015.06-5.94M9.9 4.24A10.94 10.94 0 0112 4c7 0 11 8 11 8a21.8 21.8 0 01-3.17 4.59M1 1l22 22" />
      </>
    ),
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name]}
    </svg>
  );
}

export function Badge({ children, color = T.cyan, bg, style = {} }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        minHeight: 24,
        padding: "2px 8px",
        borderRadius: T.radiusFull,
        fontSize: 11,
        fontWeight: 600,
        fontFamily: font.body,
        color,
        background: bg || "rgba(255,255,255,0.06)",
        border: `1px solid ${color === T.paper ? T.borderLight : alpha(color, 30)}`,
        letterSpacing: "0.02em",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Stat({ label, value, color = T.cyan, sub }) {
  return (
    <div style={{ flex: 1, minWidth: 120 }}>
      <div
        style={{
          fontSize: 11,
          color: T.muted,
          fontFamily: font.body,
          fontWeight: 600,
          marginBottom: 6,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
          fontFamily: font.display,
          color,
          lineHeight: 1.05,
          letterSpacing: "-0.04em",
        }}
      >
        {value}
      </div>
      {sub ? (
        <div
          style={{
            fontSize: 13,
            color: T.mutedLight,
            marginTop: 4,
            fontFamily: font.body,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}

export function SectionTitle({ children, sub, action }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        columnGap: T.space16,
        rowGap: T.space8,
        marginBottom: T.space24,
      }}
    >
      <div style={{ minWidth: 0, flex: "1 1 280px" }}>
        <h2
          style={{
            fontSize: 36,
            fontWeight: 700,
            fontFamily: font.display,
            color: T.paper,
            margin: 0,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        >
          {children}
        </h2>
        {sub ? (
          <p
            style={{
              fontSize: 15,
              color: T.mutedLight,
              fontFamily: font.body,
              margin: "8px 0 0",
              lineHeight: 1.6,
              maxWidth: 760,
            }}
          >
            {sub}
          </p>
        ) : null}
      </div>
      {action ? <div style={{ flexShrink: 0 }}>{action}</div> : null}
    </div>
  );
}

export function Btn(props) {
  const {
    children,
    variant = "primary",
    href,
    onClick,
    small = false,
    style = {},
    className,
    ...rest
  } = props;

  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: T.space8,
    borderRadius: 10,
    fontFamily: font.body,
    fontWeight: 600,
    cursor: "pointer",
    transition:
      "transform var(--rc-motion-fast) var(--rc-motion-easing), background var(--rc-motion-fast) var(--rc-motion-easing), border-color var(--rc-motion-fast) var(--rc-motion-easing), box-shadow var(--rc-motion-fast) var(--rc-motion-easing), color var(--rc-motion-fast) var(--rc-motion-easing)",
    fontSize: small ? 13 : 14,
    lineHeight: 1,
    minHeight: small ? 32 : 44,
    padding: small ? "0 12px" : "0 18px",
    boxShadow: "none",
    whiteSpace: "nowrap",
    textDecoration: "none",
    outline: "none",
  };

  const variants = {
    primary: {
      background: T.brandPrimary,
      color: T.paper,
      border: "1px solid transparent",
      boxShadow:
        "0 4px 12px rgba(107,92,255,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
    },
    secondary: {
      background: T.card,
      color: T.paper,
      border: `1px solid ${T.border}`,
    },
    ghost: {
      background: "transparent",
      color: T.paper,
      border: "1px solid transparent",
      padding: small ? "0 12px" : "0 16px",
    },
    muted: {
      background: T.card,
      color: T.paperDim,
      border: `1px solid ${T.borderLight}`,
    },
    orange: {
      background: T.gold,
      color: T.paper,
      border: "1px solid transparent",
      boxShadow: T.shadowSm,
    },
    outline: {
      background: "transparent",
      color: T.paper,
      border: `1px solid ${T.border}`,
    },
    link: {
      background: "transparent",
      color: "#b7aeff",
      border: "1px solid transparent",
      padding: small ? "0 4px" : "0 6px",
    },
  };

  const sharedStyle = {
    ...base,
    ...variants[variant],
    ...style,
  };
  const mergedClassName = `ui-btn ui-btn--${variant}${props.disabled ? " is-disabled" : ""}${className ? ` ${className}` : ""}`;

  if (href) {
    return (
      <a href={href} className={mergedClassName} style={sharedStyle} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={mergedClassName} style={sharedStyle} {...rest}>
      {children}
    </button>
  );
}

export function ProgressRing({
  percent,
  size = 80,
  stroke = 6,
  color = T.cyan,
  label,
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const off = circ - (percent / 100) * circ;

  return (
    <div
      role="img"
      aria-label={label || `${percent}% complete`}
      title={`${percent}% of biography modules complete`}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }} aria-hidden="true" focusable="false">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.inkMid} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{
            transition:
              "stroke-dashoffset var(--rc-motion-emphasis) var(--rc-motion-easing)",
          }}
        />
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fill={T.paper}
          fontSize={size < 56 ? 13 : 16}
          fontWeight={700}
          fontFamily={font.body}
          style={{ transform: "rotate(90deg)", transformOrigin: "center" }}
        >
          {percent}%
        </text>
      </svg>
    </div>
  );
}

export function MiniBar({ value, max, color = T.cyan, label }) {
  return (
    <div
      role="img"
      aria-label={label || `${value} out of ${max}`}
      title={label || `${value}% of biography modules complete`}
      style={{
        height: 8,
        background: T.inkMid,
        borderRadius: T.radiusFull,
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${(value / max) * 100}%`,
          background: color,
          borderRadius: T.radiusFull,
          transition: "width var(--rc-motion-emphasis) var(--rc-motion-easing)",
        }}
      />
    </div>
  );
}

export function VerifiedBadge({ small }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        color: T.cyan,
        fontSize: small ? 11 : 12,
        fontWeight: 700,
        fontFamily: font.body,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      <Icon name="verified" size={small ? 14 : 16} color={T.cyan} /> Verified
    </span>
  );
}

export function InteractiveCard({
  children,
  onClick,
  href,
  ariaLabel,
  style = {},
  className,
  ...props
}) {
  const sharedStyle = {
    display: "block",
    width: "100%",
    textAlign: "left",
    color: "inherit",
    textDecoration: "none",
    borderRadius: T.radius,
    transition:
      "transform var(--rc-motion-standard) var(--rc-motion-easing), border-color var(--rc-motion-standard) var(--rc-motion-easing), box-shadow var(--rc-motion-standard) var(--rc-motion-easing)",
    ...style,
  };

  if (href) {
    return (
      <a href={href} aria-label={ariaLabel} className={`ui-interactive-card${className ? ` ${className}` : ""}`} style={sharedStyle} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`ui-interactive-card${className ? ` ${className}` : ""}`}
      style={{
        ...buttonReset,
        ...sharedStyle,
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export function MediaFrame({
  src,
  alt,
  height,
  aspectRatio,
  radius = T.radiusSm,
  overlay = IMAGE_OVERLAY,
  position = "center",
  style = {},
  imgStyle = {},
  loading = "lazy",
  sizes = "100vw",
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [src]);

  return (
    <div
      className={loaded ? undefined : "skeleton"}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: radius,
        background: `linear-gradient(145deg, ${T.card}, ${T.ink})`,
        boxShadow: T.shadowSm,
        height,
        aspectRatio,
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        sizes={sizes}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          display: "block",
          filter: IMAGE_FILTER,
          opacity: loaded ? 1 : 0.01,
          transition: "opacity var(--rc-motion-enter) var(--rc-motion-easing)",
          ...imgStyle,
        }}
      />
      {overlay ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: overlay,
            pointerEvents: "none",
          }}
        />
      ) : null}
    </div>
  );
}

export function TalentAvatar({
  talent,
  size = 56,
  radius = 14,
  alt,
  border = `1px solid ${T.border}`,
  style = {},
}) {
  const imgSize = Math.max(size * 3, 240);
  const source = talent.imageUrl || asset(talent.imageKey, imgSize, imgSize);

  return (
    <MediaFrame
      src={source}
      alt={alt || talent.imageAlt || `${talent.name} portrait`}
      position={talent.imagePosition}
      overlay={ATMOSPHERIC_OVERLAY}
      style={{
        width: size,
        height: size,
        aspectRatio: "1 / 1",
        borderRadius: radius,
        border,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

export function CopyButton({ value, label = "Copy snippet", style = {} }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-live="polite"
      aria-label={copied ? "Copied to clipboard" : label}
      style={{
        ...buttonReset,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        minHeight: 36,
        padding: "0 12px",
        borderRadius: T.radiusFull,
        border: `1px solid ${T.border}`,
        background: copied ? T.greenDim : T.card,
        color: copied ? T.green : T.paper,
        cursor: "pointer",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: font.body,
        ...style,
      }}
      className="ui-copy-btn"
    >
      <Icon name={copied ? "check" : "copy"} size={14} color={copied ? T.green : T.paper} />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

export function EmptyState({
  title,
  description,
  action,
  compact = false,
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        padding: compact ? "24px 18px" : "36px 24px",
        borderRadius: T.radius,
        border: `1px solid ${T.border}`,
        background: T.card,
        color: T.mutedLight,
        lineHeight: 1.7,
      }}
    >
      <div
        style={{
          fontSize: compact ? 18 : 20,
          fontWeight: 800,
          color: T.paper,
          marginBottom: 8,
          fontFamily: font.display,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, marginBottom: action ? 14 : 0 }}>{description}</div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}
