import type { ReactNode } from "react";

type IconProps = { className?: string };

function make(children: ReactNode, displayName: string) {
  function Icon({ className }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
      >
        {children}
      </svg>
    );
  }
  Icon.displayName = displayName;
  return Icon;
}

export const IconShield = make(
  <>
    <path d="M12 2.5 4.5 5.5v6c0 4.6 3.2 8 7.5 10 4.3-2 7.5-5.4 7.5-10v-6L12 2.5Z" />
    <path d="M7.5 12h2.5l1.5-3 2 5 1.5-2h1.5" />
  </>,
  "IconShield",
);

export const IconSms = make(
  <>
    <path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z" />
    <path d="M8.5 10.5h7M8.5 13.5h4.5" />
  </>,
  "IconSms",
);

export const IconWhatsApp = make(
  <>
    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
    <path d="M8.8 9.2c0 3.3 2.7 6 6 6l1.4-1.4-2-1.4-1.1.7a4.6 4.6 0 0 1-2.2-2.2l.7-1.1-1.4-2-1.4 1.4Z" />
  </>,
  "IconWhatsApp",
);

export const IconMail = make(
  <>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </>,
  "IconMail",
);

export const IconGlobe = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.5 4 5.6 4 9s-1.4 6.5-4 9c-2.6-2.5-4-5.6-4-9s1.4-6.5 4-9Z" />
  </>,
  "IconGlobe",
);

export const IconCall = make(
  <path d="M5.5 3h3l1.7 4.3-2 1.6a12.6 12.6 0 0 0 6 6l1.5-2L20 14.5v3A2.5 2.5 0 0 1 17.4 20 14.6 14.6 0 0 1 3 5.6 2.5 2.5 0 0 1 5.5 3Z" />,
  "IconCall",
);

export const IconRupee = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 7.5h6M9 10.5h6M9.5 7.5c2.6 0 4 1.2 4 3 0 2-1.6 3-4 3l4.5 3.5" />
  </>,
  "IconRupee",
);

export const IconFlag = make(
  <>
    <path d="M5 21V4" />
    <path d="M5 4c4-2.2 7 2 11 0v9c-4 2.2-7-2-11 0" />
  </>,
  "IconFlag",
);

export const IconCheck = make(<path d="m4.5 12.5 5 5 10-11" />, "IconCheck");

export const IconX = make(<path d="M6 6l12 12M18 6 6 18" />, "IconX");

export const IconSearch = make(
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m20 20-4.8-4.8" />
  </>,
  "IconSearch",
);

export const IconZap = make(
  <path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13L13 2Z" />,
  "IconZap",
);

export const IconBook = make(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14Z" />
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </>,
  "IconBook",
);

export const IconTarget = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </>,
  "IconTarget",
);

export const IconTrophy = make(
  <>
    <path d="M8 21h8M12 17v4M7 4h10v6a5 5 0 0 1-10 0V4Z" />
    <path d="M7 6H4.5a0 0 0 0 0 0 0c0 3 1.2 4.6 2.9 5M17 6h2.5c0 3-1.2 4.6-2.9 5" />
  </>,
  "IconTrophy",
);

export const IconLock = make(
  <>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7.5a4 4 0 0 1 8 0V11M12 15v2.5" />
  </>,
  "IconLock",
);

export const IconCrown = make(
  <path d="M2 12h20l-8-12-8 12Z" />,
  "IconCrown",
);

export const IconMedal = make(
  <>
    <path d="M12 2C8 2 4 6 4 12s4 10 8 10 4-10 8-10Z" />
    <circle cx="12" cy="12" r="3" fill="currentColor" />
    <path d="M12 6v2m0 8v2" />
  </>,
  "IconMedal",
);

export const IconStar = make(
  <path d="m6.5 2 2.5 7.5L14 5.5l-2.5 7.5L17.5 10 14 15.5 10 12l-4 3.5L6.5 10Z" />,
  "IconStar",
);

export const IconAlert = make(
  <>
    <path d="M12 3.5 2.5 20h19L12 3.5Z" />
    <path d="M12 10v4.5M12 17.4v.1" />
  </>,
  "IconAlert",
);

export const IconArrow = make(
  <path d="M4 12h16m-6-6 6 6-6 6" />,
  "IconArrow",
);

export const IconScan = make(
  <>
    <path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3" />
    <path d="M3 12h18" />
  </>,
  "IconScan",
);

export const IconDatabase = make(
  <>
    <ellipse cx="12" cy="5.5" rx="8" ry="3" />
    <path d="M4 5.5V12c0 1.7 3.6 3 8 3s8-1.3 8-3V5.5" />
    <path d="M4 12v6.5c0 1.7 3.6 3 8 3s8-1.3 8-3V12" />
  </>,
  "IconDatabase",
);

export const IconEye = make(
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
  "IconEye",
);

export const IconPlay = make(
  <path d="M6 4v16l12-8Z" />,
  "IconPlay",
);

export const IconClock = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </>,
  "IconClock",
);

export const IconLink = make(
  <>
    <path d="M10 14a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.1" />
    <path d="M14 10a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.1" />
  </>,
  "IconLink",
);

export const IconRadar = make(
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 12 18.5 6" />
    <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
  </>,
  "IconRadar",
);

export function ChannelIcon({
  channel,
  className,
}: {
  channel: string;
  className?: string;
}) {
  switch (channel) {
    case "sms":
      return <IconSms className={className} />;
    case "whatsapp":
      return <IconWhatsApp className={className} />;
    case "email":
      return <IconMail className={className} />;
    case "website":
      return <IconGlobe className={className} />;
    case "call":
      return <IconCall className={className} />;
    case "upi":
      return <IconRupee className={className} />;
    default:
      return <IconShield className={className} />;
  }
}
