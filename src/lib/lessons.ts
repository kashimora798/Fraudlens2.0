export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  tag: string;
  summary: string;
  points: string[];
  tip: string;
}

export const LESSONS: Lesson[] = [
  {
    id: "anatomy",
    title: "Anatomy of a Scam",
    minutes: 4,
    tag: "Basics",
    summary:
      "Every scam — from a ₹50 recharge bait to a crore-rupee investment trap — is built from the same four bricks.",
    points: [
      "URGENCY: 'within 24 hours', 'today itself', 'last chance' — deadlines stop you from thinking.",
      "AUTHORITY: pretending to be a bank, police, CBI, college or tax office so you obey without checking.",
      "GREED or FEAR: free diamonds and prizes target greed; blocked accounts and arrests target fear. Both shut down logic.",
      "A SECRET ACTION: they always want you to do something privately — click a link, share a code, install an app, pay quietly.",
      "The defense is boring and unbeatable: slow down, verify on the official channel, and ask someone you trust.",
    ],
    tip: "Before acting on any urgent message, take a 5-minute break. Scams lose power when you pause.",
  },
  {
    id: "otp",
    title: "OTP, PIN & Passwords",
    minutes: 3,
    tag: "Credentials",
    summary:
      "Your OTP is a one-time key to your money. Banks send it TO you. Nobody legitimate ever asks you to read it back.",
    points: [
      "OTP = One Time Password. Sharing it = handing over your bank login, instantly.",
      "You NEVER need an OTP or PIN to RECEIVE money. Only to send it. Remember: 'Receive = no PIN'.",
      "Banks put 'DO NOT SHARE' inside the real OTP message — scammers call right after pretending to be the bank.",
      "Use a unique password for email (it unlocks everything else) and turn on 2-factor authentication.",
      "If someone already has your OTP — call your bank's official helpline immediately, not the number the caller gave.",
    ],
    tip: "Say this out loud and memorise it: 'My OTP is for ME only. No exception, no matter who calls.'",
  },
  {
    id: "links",
    title: "Phishing Links & Fake Websites",
    minutes: 4,
    tag: "Phishing",
    summary:
      "Fake websites copy real ones pixel-by-pixel. The URL bar is the only place they can't fake perfectly — learn to read it.",
    points: [
      "Read domains right-to-left: 'sbi-kyc-verify.in' is NOT sbi.co.in. The real owner is the part just before the last dot.",
      "Scam favourites: .top, .xyz, .icu, .club, .live, and link shorteners like bit.ly that hide the destination.",
      "The padlock (https) only means the connection is encrypted — scam sites have padlocks too. Check the NAME, not the lock.",
      "Login pages reached from an SMS link are traps. Always type the official address yourself or use the official app.",
      "Hover over links on a computer to preview the real URL before clicking. On phones, long-press to preview.",
    ],
    tip: "Golden rule: banks, colleges and government portals never need you to log in through an SMS link.",
  },
  {
    id: "upi",
    title: "UPI & Payment Safety",
    minutes: 4,
    tag: "Money",
    summary:
      "UPI made payments effortless — and made students the #1 target for payment fraud. Master these six rules.",
    points: [
      "UPI PIN is only for SENDING money. Anyone making you enter a PIN to receive a refund/prize is stealing from you.",
      "'Collect requests' look like gifts but pull money OUT. Reject requests from unknown IDs — always.",
      "QR codes send money, they never receive it. 'Scan this QR to get your cashback' is the classic UPI scam.",
      "Check the name shown on the payment screen. 'Rahul Verma' is not 'Amazon Customer Support'.",
      "Government scholarships, job offers and prizes that ask for a 'registration fee' are 100% fraud. Zero exceptions.",
      "Set a low daily UPI limit in your app, and keep the bulk of your money in an account not linked to UPI.",
    ],
    tip: "Before approving ANY payment request, read the name and amount twice. Two seconds can save your semester fees.",
  },
  {
    id: "impersonation",
    title: "Impersonation & Hacked Friends",
    minutes: 3,
    tag: "Social Engineering",
    summary:
      "'Bro, I'm stuck abroad, send ₹5,000' — your friend's account was hacked. The person typing is a stranger.",
    points: [
      "Emergency-money messages from friends/family are guilty until proven innocent. Accounts get hacked daily.",
      "Verify with a phone CALL or video call to the number you already have — not by replying to the same chat.",
      "Watch for tone changes: a friend who suddenly types formally, or never uses voice notes anymore.",
      "Officials (police, CBI, bank managers) never conduct cases on WhatsApp or personal mobile numbers.",
      "If YOU were hacked: log out all sessions, change passwords, and post 'my account was hacked — ignore messages'.",
    ],
    tip: "Make a family code word. If a 'relative' asks for money urgently, they must say the code word on a call.",
  },
  {
    id: "downloads",
    title: "Apps, APKs & Permissions",
    minutes: 3,
    tag: "Device Safety",
    summary:
      "One side-loaded app can read your OTPs, record your screen and empty your bank. Your phone is a vault — guard the door.",
    points: [
      "Install apps only from Play Store / App Store. 'Download this APK' = hand over your phone.",
      "AnyDesk, QuickSupport and 'screen share' give full remote control of your phone. Banks NEVER ask for this.",
      "Read permissions: a torch app that wants SMS access is stealing your OTPs in the background.",
      "Keep OS and apps updated — updates patch the holes scammers break in through.",
      "Enable a screen lock and 'Find My Device'. A lost unlocked phone is a leaked life.",
    ],
    tip: "If a stranger wants you to install anything during a call — hang up. Real support never needs remote access to YOU.",
  },
  {
    id: "aftermath",
    title: "You Got Scammed. Now What?",
    minutes: 4,
    tag: "Recovery",
    summary:
      "Speed beats shame. The first 30 minutes decide whether your money comes back. Here is the exact drill.",
    points: [
      "1 — Call your bank's official helpline NOW and ask them to block/freeze the transaction and your card/UPI.",
      "2 — Report on cybercrime.gov.in or call the national cyber helpline 1930. File the complaint while it's fresh.",
      "3 — Save everything: screenshots, numbers, UPI IDs, transaction IDs, call logs. Do NOT delete the chat.",
      "4 — Change passwords for email, banking and social media, and log out all devices.",
      "5 — Tell a trusted adult. Scammers count on your embarrassment keeping you silent. It is not your fault — it is their business.",
      "Golden hour: banks can often reverse fraudulent UPI transfers if reported within minutes, not days.",
    ],
    tip: "Save 1930 in your phone contacts today as 'CYBER HELPLINE'. You may never need it — or need it in a panic.",
  },
  {
    id: "footprint",
    title: "Your Digital Footprint",
    minutes: 3,
    tag: "Privacy",
    summary:
      "Scammers research you. Every public post is a data point they use to make fake messages feel real.",
    points: [
      "Full name + school + city + birthday posted publicly = perfect material for a convincing impersonation.",
      "Quiz games ('Which actor are you?') harvest email, friend lists and phone numbers. Skip them.",
      "Set social media to private; accept only people you know in real life.",
      "Photos of ID cards, hall tickets, boarding passes contain numbers scammers love. Blur before posting.",
      "Search your own name once a term. Know what strangers can already see about you.",
    ],
    tip: "The 'grandparent test': if you wouldn't hand it to a stranger on the street, don't post it online.",
  },
];

export const TOTAL_LESSONS = LESSONS.length;
