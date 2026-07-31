import type { ScanFlag, ScanResult } from "./types";

interface Rule {
  id: string;
  label: string;
  severity: ScanFlag["severity"];
  tip: string;
  pattern: RegExp;
}

const RULES: Rule[] = [
  {
    id: "panic",
    label: "Panic & urgency pressure",
    severity: "critical",
    tip: "Scammers manufacture deadlines so you act before you think. Real organisations give you time.",
    pattern:
      /\b(within\s+\d+\s*(hours?|hrs?|days?|minutes?|mins?)|urgent(ly)?|immediately|last\s+chance|final\s+(warning|notice)|act\s+now|today\s+itself|before\s+midnight|expir(es?|y|ing)|will\s+be\s+(blocked|suspended|closed|deactivated|deleted|disconnected|arrested)|about\s+to\s+expire)\b/gi,
  },
  {
    id: "credentials",
    label: "Asks for secret credentials",
    severity: "critical",
    tip: "OTP, PIN, CVV and passwords are YOURS alone. No bank, college or company ever asks for them in a message.",
    pattern:
      /\b(share\s+(your\s+)?(otp|pin|password|cvv)|your\s+(otp|pin|cvv|password)|enter\s+(your\s+)?(otp|pin|password)|send\s+(me\s+)?(the\s+)?(otp|pin|password)|otp\s*share|cvv|atm\s+pin|upi\s+pin|login\s+(with\s+your\s+)?(facebook|google|instagram|password))\b/gi,
  },
  {
    id: "money-bait",
    label: "Money bait — prize / refund / reward",
    severity: "high",
    tip: "Unexpected money is the oldest hook in fraud. If you did not enter it, you did not win it.",
    pattern:
      /\b(won|winner|prize|lottery|lucky\s+draw|cashback|refund\s+(pending|due|of)|reward\s+of|claim\s+(your|now|₹|rs)|jackpot|giveaway|selected\s+for\s+₹)\b/gi,
  },
  {
    id: "pay-first",
    label: "Pay money to receive money",
    severity: "critical",
    tip: "Legit prizes, jobs, scholarships and refunds never need a 'fee' first. Pay-to-claim is always fraud.",
    pattern:
      /\b(registration\s+fee|processing\s+fee|verification\s+(fee|charges)|document\s+(fee|charges)|training\s+fee|security\s+deposit|pay\s+₹?\s*\d+\s*(to|and|then)|advance\s+fee|token\s+money|activation\s+charge)\b/gi,
  },
  {
    id: "shortlink",
    label: "Link shortener / suspicious domain",
    severity: "high",
    tip: "Short links hide the real destination. Odd endings like .top, .xyz, .icu are scam favourites.",
    pattern:
      /\b(bit\.ly|tinyurl\.com|goo\.gl|cutt\.ly|rb\.gy|shorturl\.at)\S*|\b[\w-]+\.(top|xyz|tk|icu|club|live|buzz|lol|monster|icu)\b(\/\S*)?/gi,
  },
  {
    id: "http",
    label: "Insecure (http) link",
    severity: "medium",
    tip: "Banks and real services always use https. A plain http link that asks for details is a trap.",
    pattern: /\bhttp:\/\/\S+/gi,
  },
  {
    id: "authority",
    label: "Fake authority — police / CBI / tax / customs",
    severity: "high",
    tip: "CBI, police, RBI and tax officers never call, threaten arrest, or ask you to move money into a 'safe account'.",
    pattern:
      /\b(cbi|cbi\s+officer|police\s+(station|case|complaint)|income\s+tax\s+(department|notice)|customs\s+(duty|officer|clearance)|court\s+(summons|notice)|legal\s+action|arrest\s+warrant|fir\s+(filed|will\s+be)|narco|money\s+laundering)\b/gi,
  },
  {
    id: "kyc",
    label: "KYC / update-details pressure",
    severity: "high",
    tip: "KYC is never done through a link inside an SMS. Open your bank's official app or visit a branch.",
    pattern:
      /\b(kyc\s+(update|expired|pending|verify)|update\s+(your\s+)?(kyc|pan|aadhaar|details)|re-?verify\s+(your\s+)?(account|kyc)|account\s+will\s+be\s+blocked|unblock\s+(your\s+)?account)\b/gi,
  },
  {
    id: "too-good",
    label: "Too good to be true",
    severity: "high",
    tip: "Free diamonds, guaranteed 20% weekly returns, ₹5,000/day for liking videos — if it sounds unreal, it is.",
    pattern:
      /\b(free\s+(diamonds|followers|recharge|iphone|gift|coins)|guaranteed\s+(returns?|profit|\d+%)|earn\s+₹?\s*\d[\d,]*\s*(\/|per|a)\s*(day|hour)|\d+x\s+returns?|double\s+your\s+money|unlimited\s+followers|100%\s+winning)\b/gi,
  },
  {
    id: "install",
    label: "Install app / screen-share request",
    severity: "critical",
    tip: "Anyone asking you to install an app (QuickSupport, AnyDesk, 'safe mode' apps) wants to empty your phone.",
    pattern:
      /\b(install\s+(this|the|an)\s+app|download\s+(this|the)\s+app|anydesk|teamviewer|quicksupport|screen\s+shar(e|ing)|give\s+me\s+access|remote\s+access)\b/gi,
  },
  {
    id: "qr",
    label: "QR code to RECEIVE money",
    severity: "critical",
    tip: "You never scan a QR or enter a PIN to receive money. QR + PIN = money LEAVING your account.",
    pattern:
      /\b(scan\s+(this|the|my)\s+qr|qr\s+(code|se)\s+.{0,20}receive|receive\s+.{0,20}qr|scan\s+karo|scan\s+karke)\b/gi,
  },
  {
    id: "bitcoin",
    label: "Crypto / Bitcoin demand",
    severity: "high",
    tip: "Demands for Bitcoin or gift cards mean scammers — payments are untraceable and irreversible.",
    pattern: /\b(bitcoin|btc|usdt|crypto\s+wallet|gift\s+card|amazon\s+card)\b/gi,
  },
  {
    id: "personal-mobile",
    label: "Personal mobile number as 'official' contact",
    severity: "medium",
    tip: "Banks and government bodies never use personal +91 numbers or WhatsApp for official work.",
    pattern: /(\+91[\s-]?\d{5}[\s-]?\d{5}|\bcall\s+(me|us|now)\s+on\b|\bwhatsapp\s+(me|us|on|kar)\b)/gi,
  },
  {
    id: "caps",
    label: "Shouting in ALL CAPS",
    severity: "low",
    tip: "Official communication is calm and formatted. ALL-CAPS screaming is a pressure tactic.",
    pattern: /\b[A-Z]{5,}\b/g,
  },
  {
    id: "leetspeak",
    label: "Broken spelling of sensitive words",
    severity: "medium",
    tip: "'0TP', 'passw0rd', 'acc0unt' — scammers mangle words to dodge spam filters.",
    pattern: /\b(0tp|o7p|otp\s+karo|passw0rd|acc0unt|kyc\s+karlo|apdate|ver1fy)\b/gi,
  },
  {
    id: "isolation",
    label: "Secrecy & isolation pressure",
    severity: "high",
    tip: "'Don't tell anyone', 'keep it confidential' — isolation stops you from getting a second opinion.",
    pattern:
      /\b(do\s+not\s+tell|don'?t\s+tell|don'?t\s+share\s+this|keep\s+(it\s+)?(secret|confidential)|don'?t\s+inform|tell\s+no\s+one|do\s+this\s+alone)\b/gi,
  },
  {
    id: "blackmail",
    label: "Blackmail / exposure threat",
    severity: "critical",
    tip: "Sextortion threats are almost always a bluff using leaked databases. Never pay — block, report, tell an adult.",
    pattern:
      /\b(recorded\s+you|your\s+camera|send\s+(this\s+)?(video|photos)\s+to\s+your|ruin\s+your\s+(reputation|life)|expose\s+you|leak\s+(your|the))\b/gi,
  },
];

const BRANDS: { pattern: RegExp; token: string; name: string }[] = [
  { pattern: /\bSBI\b|State Bank/i, token: "sbi", name: "SBI" },
  { pattern: /\bHDFC\b/i, token: "hdfc", name: "HDFC" },
  { pattern: /\bICICI\b/i, token: "icici", name: "ICICI" },
  { pattern: /\bRBI\b|Reserve Bank/i, token: "rbi", name: "RBI" },
  { pattern: /\bNetflix\b/i, token: "netflix", name: "Netflix" },
  { pattern: /\bAmazon\b/i, token: "amazon", name: "Amazon" },
  { pattern: /\bFlipkart\b/i, token: "flipkart", name: "Flipkart" },
  { pattern: /\bInstagram\b/i, token: "instagram", name: "Instagram" },
  { pattern: /\bWhatsApp\b/i, token: "whatsapp", name: "WhatsApp" },
  { pattern: /\bIRCTC\b/i, token: "irctc", name: "IRCTC" },
  { pattern: /\bAadhaar\b|UIDAI/i, token: "uidai", name: "UIDAI/Aadhaar" },
  { pattern: /\bPaytm\b/i, token: "paytm", name: "Paytm" },
  { pattern: /\bPhonePe\b/i, token: "phonepe", name: "PhonePe" },
  { pattern: /\bGoogle\b/i, token: "google", name: "Google" },
  { pattern: /\bAirtel\b/i, token: "airtel", name: "Airtel" },
];

const URL_RE =
  /\b(?:https?:\/\/|www\.)[^\s)\]>"']+/gi;

const SEVERITY_WEIGHT: Record<ScanFlag["severity"], number> = {
  critical: 28,
  high: 18,
  medium: 10,
  low: 5,
};

export function analyzeText(text: string): ScanResult {
  const flags: ScanFlag[] = [];

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    let m: RegExpExecArray | null;
    let hits = 0;
    while ((m = rule.pattern.exec(text)) !== null && hits < 3) {
      flags.push({
        ruleId: rule.id,
        label: rule.label,
        severity: rule.severity,
        matched: m[0].slice(0, 60),
        tip: rule.tip,
        start: m.index,
        end: m.index + m[0].length,
      });
      hits++;
      if (m.index === rule.pattern.lastIndex) rule.pattern.lastIndex++;
    }
  }

  // Brand vs link-domain mismatch
  const urls = text.match(URL_RE) ?? [];
  for (const brand of BRANDS) {
    if (!brand.pattern.test(text)) continue;
    const wrongDomain = urls.find((u) => {
      const host = u.toLowerCase().split("//")[1] ?? u.toLowerCase();
      return !host.includes(brand.token);
    });
    if (wrongDomain) {
      const idx = text.toLowerCase().indexOf(wrongDomain.toLowerCase());
      flags.push({
        ruleId: "brand-mismatch",
        label: `${brand.name} named, but the link is NOT ${brand.name}'s official domain`,
        severity: "critical",
        matched: wrongDomain.slice(0, 60),
        tip: `Official ${brand.name} messages link only to their real website/app. A different domain means impersonation.`,
        start: idx >= 0 ? idx : 0,
        end: idx >= 0 ? idx + wrongDomain.length : 1,
      });
    }
  }

  const score = Math.min(
    100,
    flags.reduce((acc, f) => acc + SEVERITY_WEIGHT[f.severity], 0),
  );

  let verdict: ScanResult["verdict"];
  let verdictLabel: string;
  let summary: string;
  if (score >= 40) {
    verdict = "danger";
    verdictLabel = "HIGH RISK — LIKELY A SCAM";
    summary =
      "This message shows multiple classic fraud signals. Do not click, reply, pay, or share any code. Delete and report it.";
  } else if (score >= 18) {
    verdict = "suspicious";
    verdictLabel = "SUSPICIOUS — HANDLE WITH CARE";
    summary =
      "Some signals look off. Do not act on this message directly — verify through the official app or by calling the real number yourself.";
  } else {
    verdict = "clean";
    verdictLabel = "LOW RISK — PROBABLY LEGIT";
    summary =
      "No strong scam signals detected. Still follow the golden rule: never share OTP/PIN/password with anyone, from any message.";
  }

  // de-dupe overlapping spans: keep highest severity, then earliest
  const rank: Record<ScanFlag["severity"], number> = { critical: 0, high: 1, medium: 2, low: 3 };
  flags.sort((a, b) => a.start - b.start || rank[a.severity] - rank[b.severity]);
  const deduped: ScanFlag[] = [];
  let lastEnd = -1;
  for (const f of flags) {
    if (f.start >= lastEnd) {
      deduped.push(f);
      lastEnd = f.end;
    }
  }

  return { text, score, verdict, verdictLabel, summary, flags: deduped };
}
