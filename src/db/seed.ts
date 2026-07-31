import "dotenv/config";
import { db } from "./index";
import { scams } from "./schema";

interface SeedCase {
  caseCode: string;
  title: string;
  channel: string;
  category: string;
  riskLevel: string;
  isScam: boolean;
  difficulty: string;
  sender: string;
  content: string;
  meta: Record<string, string>;
  redFlags: string[];
  explanation: string;
  tip: string;
}

const CASES: SeedCase[] = [
  {
    caseCode: "FL-001",
    title: "The 24-hour KYC threat",
    channel: "sms",
    category: "Banking & KYC",
    riskLevel: "high",
    isScam: true,
    difficulty: "easy",
    sender: "VK-SBIKYC",
    content:
      "Dear customer, your SBI account will be BLOCKED within 24 hours due to pending KYC. Update immediately to avoid suspension: sbi-kyc-verify.in/8372 - SBI Team",
    meta: { from: "VK-SBIKYC" },
    redFlags: [
      "Fake 24-hour deadline creates panic",
      "Link is sbi-kyc-verify.in, NOT the real sbi.co.in",
      "Banks never do KYC through SMS links",
      "Sender ID is spoofable — anyone can fake it",
    ],
    explanation:
      "Real banks never threaten blocking over an SMS link. The domain 'sbi-kyc-verify.in' only LOOKS official — the real owner is whoever registered that name yesterday.",
    tip: "Open your official banking app or visit a branch for any KYC work. Never through an SMS link.",
  },
  {
    caseCode: "FL-002",
    title: "Free diamonds, real trap",
    channel: "whatsapp",
    category: "Freebies & Rewards",
    riskLevel: "high",
    isScam: true,
    difficulty: "easy",
    sender: "+91 90342 11876",
    content:
      "Hey gamer! Get 10,000 FREE diamonds for Free Fire right now. Just login with your Facebook account here: ff-rewards.top/claim. Offer ends TONIGHT at 12. Hurry!!",
    meta: { from: "+91 90342 11876", name: "FF Rewards Official" },
    redFlags: [
      "'Free diamonds' is bait no game company gives via WhatsApp",
      "Asks you to LOGIN with Facebook — that's credential theft",
      "ff-rewards.top is a throwaway .top domain",
      "'Ends tonight' pressure to stop you thinking",
    ],
    explanation:
      "The page copies the game's login screen. The moment you type your Facebook password, they steal the account and use it to scam your friends next.",
    tip: "In-game rewards only come from inside the official app. Any 'login here to claim' link is a keylogger in a costume.",
  },
  {
    caseCode: "FL-003",
    title: "Netflix refund that steals cards",
    channel: "email",
    category: "Phishing Links",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "billing@netflix-support-help.com",
    content:
      "We could not process your last payment and a refund of Rs. 499 is pending for your account. To receive it, verify your card number, expiry and CVV within 48 hours. Click: netflix-support-help.com/verify",
    meta: {
      from: "billing@netflix-support-help.com",
      subject: "Action required: Your refund of Rs. 499 is pending",
    },
    redFlags: [
      "Sender domain 'netflix-support-help.com' is not netflix.com",
      "A refund that needs your CVV is a card theft",
      "No real company asks for full card details by email",
      "48-hour deadline pressure",
    ],
    explanation:
      "The refund is imaginary; the card details are real. 'Netflix' emails only ever come from @netflix.com and never ask for card numbers.",
    tip: "Check the domain AFTER the last @. Then check the domain just before the final dot — that's the real owner.",
  },
  {
    caseCode: "FL-004",
    title: "A perfectly normal bank OTP",
    channel: "sms",
    category: "Banking & KYC",
    riskLevel: "low",
    isScam: false,
    difficulty: "medium",
    sender: "HDFCBK",
    content:
      "482913 is the OTP to login to HDFC Bank MobileBanking. Valid for 5 min. DO NOT share this OTP with anyone. HDFC Bank never calls asking for it. - HDFCBK",
    meta: { from: "HDFCBK" },
    redFlags: [],
    explanation:
      "This is a genuine OTP message — note it warns you NOT to share it and makes no request. The danger is the CALL that follows pretending to be the bank.",
    tip: "Real OTPs arrive when YOU act. If you didn't request a login, someone has your password — lock the account immediately.",
  },
  {
    caseCode: "FL-005",
    title: "Scholarship with a price tag",
    channel: "whatsapp",
    category: "Scholarships",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "+91 98220 44713",
    content:
      "Congratulations! You have been selected for the National Student Scholarship 2026 worth Rs. 50,000. To release the amount, pay a one-time registration fee of Rs. 499 on UPI: 9822044713@ybl. Amount will be credited with the scholarship.",
    meta: { from: "+91 98220 44713", name: "Scholarship Cell" },
    redFlags: [
      "No government scholarship charges a 'registration fee' — ever",
      "Payment goes to a personal UPI ID, not an institution",
      "'You have been selected' without any application",
      "Money must flow TO students, not FROM them",
    ],
    explanation:
      "Every scholarship that asks for money first is a fraud. Official schemes are applied for on .gov.in portals and never collect fees on personal UPI IDs.",
    tip: "Verify any scholarship on the official National Scholarship Portal (scholarships.gov.in) before paying anything.",
  },
  {
    caseCode: "FL-006",
    title: "Dream internship, real charges",
    channel: "email",
    category: "Jobs & Internships",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "hr@wipro-careers-hiring.in",
    content:
      "Dear Candidate, Congratulations! Your profile has been shortlisted for a Work-From-Home internship at Wipro with a stipend of Rs. 25,000/month. To proceed, pay Rs. 1,999 as document verification charges. Joining letter will be issued within 2 hours of payment.",
    meta: {
      from: "hr@wipro-careers-hiring.in",
      subject: "Internship Offer Letter — Wipro Technologies",
    },
    redFlags: [
      "Real companies PAY interns — they never charge 'verification fees'",
      "Domain wipro-careers-hiring.in is not wiprocareers.com",
      "Offer with no interview process",
      "Payment-before-joining-letter is the fraud signature",
    ],
    explanation:
      "Job fraud is booming: fake offer letters that demand 'document' or 'training' fees. Legitimate recruiters never ask candidates for money at any stage.",
    tip: "Search '[company] internship fraud' before paying anything. Official careers pages are linked from the company's main website.",
  },
  {
    caseCode: "FL-007",
    title: "Instagram account deletion panic",
    channel: "website",
    category: "Phishing Links",
    riskLevel: "high",
    isScam: true,
    difficulty: "easy",
    sender: "instagram-help.center",
    content:
      "Your account violates our Community Guidelines and will be permanently deleted within 48 hours. To keep your account, verify your identity now. [Login form asks for username + password]",
    meta: { url: "https://instagram-help.center/verify", button: "Verify my account" },
    redFlags: [
      "instagram-help.center is not instagram.com",
      "Account deletion threats with a login form = password harvesting",
      "Real violation notices appear inside the official app",
      "48-hour countdown pressure",
    ],
    explanation:
      "The page is a pixel-perfect copy of Instagram's login. Your password goes straight to the scammer, who locks you out and sells or ransoms the account.",
    tip: "Only ever log in by typing instagram.com yourself. Anything reached through a DM or SMS link is off-limits.",
  },
  {
    caseCode: "FL-008",
    title: "Parcel stuck at customs",
    channel: "sms",
    category: "Delivery & Bills",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "AD-INPOST",
    content:
      "India Post: Your parcel #IN4471209 is held at Customs. Pay customs duty of Rs. 2,350 within 6 hours to avoid return to sender. Track & pay: indiapost-delivery.xyz/pay",
    meta: { from: "AD-INPOST" },
    redFlags: [
      "You weren't expecting any parcel — classic hook",
      "indiapost-delivery.xyz is a fake .xyz domain",
      "India Post does not collect customs duty via SMS links",
      "6-hour countdown threat",
    ],
    explanation:
      "The 'stuck parcel' scam harvests card details on a fake payment page. Customs duties are never collected through random SMS links.",
    tip: "If you did not order something from abroad, delete it. Track only on the official India Post website you type yourself.",
  },
  {
    caseCode: "FL-009",
    title: "Earn by liking videos",
    channel: "whatsapp",
    category: "Jobs & Internships",
    riskLevel: "high",
    isScam: true,
    difficulty: "easy",
    sender: "+91 70118 92345",
    content:
      "Work from home opportunity! Earn Rs. 5,000 per day just by liking YouTube videos and following channels. No experience needed. Pay one-time training fee Rs. 999 to activate your account. Limited seats for students!",
    meta: { from: "+91 70118 92345", name: "HR Tanvi" },
    redFlags: [
      "Rs. 5,000/day for liking videos is economically impossible",
      "'Training fee' before any work — pay-to-earn fraud",
      "Unknown personal number recruiting for 'YouTube'",
      "'Limited seats' scarcity pressure",
    ],
    explanation:
      "This 'task scam' pays tiny amounts at first to build trust, then demands bigger 'upgrade fees' until victims realise. The training fee is the product — you are.",
    tip: "If a job needs YOUR money to start, it's not a job. Report the number in WhatsApp and move on.",
  },
  {
    caseCode: "FL-010",
    title: "A genuine security alert",
    channel: "email",
    category: "Account Safety",
    riskLevel: "low",
    isScam: false,
    difficulty: "hard",
    sender: "no-reply@github.com",
    content:
      "A new sign-in to your GitHub account was detected from Chrome on Windows (Mumbai, India). If this was you, no action is needed. If not, secure your account from your settings page. We will never ask for your password by email.",
    meta: {
      from: "no-reply@github.com",
      subject: "New sign-in to your account",
    },
    redFlags: [],
    explanation:
      "Genuine: correct @github.com sender, no link demanding login, no panic, and it tells you to go to settings yourself. This is how real services warn you.",
    tip: "Even for real alerts, don't click — open the app or website yourself and check notifications there.",
  },
  {
    caseCode: "FL-011",
    title: "RBI lucky draw jackpot",
    channel: "sms",
    category: "Freebies & Rewards",
    riskLevel: "high",
    isScam: true,
    difficulty: "easy",
    sender: "+91 98110 23456",
    content:
      "Congratulations!! Your mobile number has won Rs. 25,00,000 in the RBI Lucky Draw 2026. To claim your prize, call our claim officer immediately on +91 98110 23456 within 2 hours. Failure to claim means prize forfeited.",
    meta: { from: "+91 98110 23456" },
    redFlags: [
      "The RBI does not run lucky draws — period",
      "You never entered any draw",
      "Claiming via a personal mobile number",
      "2-hour forfeiture threat",
    ],
    explanation:
      "Lottery scams ask for 'tax' or 'processing' fees before releasing imaginary crores. The RBI itself publicly warns that it never conducts lotteries.",
    tip: "Memorise: you cannot win a contest you never entered. Every such message is fraud by definition.",
  },
  {
    caseCode: "FL-012",
    title: "Your friend needs urgent help",
    channel: "whatsapp",
    category: "Impersonation",
    riskLevel: "high",
    isScam: true,
    difficulty: "hard",
    sender: "Rahul (saved contact)",
    content:
      "Bro I'm in serious trouble. I'm stuck at Dubai airport, my wallet got stolen and my cards are blocked. I need Rs. 5,000 urgently for the hotel tonight. Send on this UPI: rahul.travels456@paytm. I'll return it tomorrow, promise. Please don't tell my parents.",
    meta: { from: "Rahul (saved contact)", name: "Rahul" },
    redFlags: [
      "Emergency money request = hacked-account classic",
      "UPI ID 'rahul.travels456' may not match your real friend's ID",
      "'Don't tell my parents' — isolation tactic",
      "No voice note or call, only text",
    ],
    explanation:
      "When accounts get hacked, scammers mine the contact list and beg each friend for money. The tone, the secrecy and the new payment ID are the fingerprints.",
    tip: "Call the friend on their usual number or ask something only they would know. No call, no money.",
  },
  {
    caseCode: "FL-013",
    title: "Logging into real net banking",
    channel: "website",
    category: "Banking & KYC",
    riskLevel: "low",
    isScam: false,
    difficulty: "medium",
    sender: "onlinesbi.sbi",
    content:
      "Welcome to OnlineSBI — State Bank of India's official internet banking portal. Enter your username and password to continue. For your security, SBI will never ask for your password or OTP over phone, email or SMS.",
    meta: { url: "https://www.onlinesbi.sbi", button: "Continue to Login" },
    redFlags: [],
    explanation:
      "Genuine portal: the domain ends in onlinesbi.sbi (the bank owns the .sbi top-level domain), uses https, and the page itself warns against sharing credentials.",
    tip: "Still type the address yourself or use a bookmark — never reach a bank login through any link someone sent you.",
  },
  {
    caseCode: "FL-014",
    title: "Electricity cut-off today",
    channel: "sms",
    category: "Delivery & Bills",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "JM-PWRBIL",
    content:
      "IMPORTANT: Your electricity connection will be DISCONNECTED today at 6 PM due to unpaid bill of Rs. 1,847. Pay immediately to avoid disconnection charges: power-bill-pay.info/recharge",
    meta: { from: "JM-PWRBIL" },
    redFlags: [
      "Same-day disconnection threat",
      "power-bill-pay.info is not your electricity board's site",
      "You can check real dues on the official board app",
      "Generic 'INFO' wording with no consumer number",
    ],
    explanation:
      "Utility bill scams spike every summer. Real disconnection notices come by post or the official board app with your consumer number — not random links.",
    tip: "Check your bill in the electricity board's official app. If it says paid, the SMS is fiction.",
  },
  {
    caseCode: "FL-015",
    title: "College portal password request",
    channel: "email",
    category: "Account Safety",
    riskLevel: "high",
    isScam: true,
    difficulty: "hard",
    sender: "admin@college-exam-portal.edu-help.in",
    content:
      "Dear Student, your exam hall ticket for the upcoming semester is ready. However, your portal password has expired. Reply with your registered email and current password within 24 hours or you will NOT be allowed to appear for the exams.",
    meta: {
      from: "admin@college-exam-portal.edu-help.in",
      subject: "URGENT: Hall ticket blocked — password expired",
    },
    redFlags: [
      "No institution ever asks you to REPLY with a password",
      "'edu-help.in' mimics an education domain but isn't one",
      "Exam-block threat weaponises student fear",
      "Password expiry solved by email reply makes no sense",
    ],
    explanation:
      "This targets exam anxiety — the one fear every student has. Real portals let you reset passwords in-app; they never collect them by email reply.",
    tip: "Any email asking you to SEND credentials is phishing, even if it looks like your college. Verify with the office in person.",
  },
  {
    caseCode: "FL-016",
    title: "Guaranteed 20% weekly returns",
    channel: "whatsapp",
    category: "Investment Fraud",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "+91 85888 12900",
    content:
      "Want financial freedom as a student? Join our exclusive trading group. Our experts give GUARANTEED 20% weekly returns on the stock market. Minimum investment just Rs. 2,000. Screenshots of member profits daily. Only 10 seats left!",
    meta: { from: "+91 85888 12900", name: "Wealth Academy" },
    redFlags: [
      "'Guaranteed returns' on stocks is impossible — markets don't guarantee",
      "20% weekly would beat every hedge fund on Earth",
      "'Screenshots of profits' are trivially faked",
      "'Only 10 seats left' artificial scarcity",
    ],
    explanation:
      "Investment groups pay early members from new members' money (a pyramid) until they vanish. Guaranteed high returns are the single most reliable fraud signal in finance.",
    tip: "Only SEBI-registered advisors can legally offer investment advice. Check the registration number before trusting anyone with money.",
  },
  {
    caseCode: "FL-017",
    title: "Train ticket confirmation",
    channel: "sms",
    category: "Account Safety",
    riskLevel: "low",
    isScam: false,
    difficulty: "easy",
    sender: "IRCTC",
    content:
      "IRCTC: Ticket no. 8291334455 is CONFIRMED. PNR: KXZ241, Train 12951 Mumbai Rajdhani, 14 Mar, 3A, Coach B4. Passenger: A. Sharma. No action required. Check status on the IRCTC app.",
    meta: { from: "IRCTC" },
    redFlags: [],
    explanation:
      "Genuine transactional message: specific ticket details, no link, no payment request, no urgency. It confirms something YOU booked.",
    tip: "The pattern to trust: confirms your own action, asks for nothing, links to nothing.",
  },
  {
    caseCode: "FL-018",
    title: "The CBI officer on call",
    channel: "call",
    category: "Impersonation",
    riskLevel: "high",
    isScam: true,
    difficulty: "hard",
    sender: "Spoofed: CBI Delhi",
    content:
      "This is Inspector Sharma calling from CBI Headquarters, Delhi. Your Aadhaar number is linked to a money-laundering case and an arrest warrant is being issued. To prove innocence, install the 'Safe Custody' app I am sending, and transfer your money to a government verification account. Do not tell anyone — the investigation is confidential.",
    meta: { from: "Spoofed caller ID: CBI Delhi", callerName: "Inspector Sharma" },
    redFlags: [
      "CBI never makes enforcement calls — and never asks for money",
      "'Arrest warrant' fear tactic",
      "Asks you to install a remote-access app",
      "'Government verification account' does not exist",
      "'Do not tell anyone' — enforced secrecy",
    ],
    explanation:
      "The 'digital arrest' scam: fake officials keep victims on video call for hours, terrify them, and drain accounts through screen-sharing apps. It is theatre, not law.",
    tip: "Hang up. Real agencies send written notices — they don't negotiate on calls. Report spoofed numbers to 1930.",
  },
  {
    caseCode: "FL-019",
    title: "Scan QR to receive cashback",
    channel: "upi",
    category: "Payments & UPI",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "+91 90040 55213",
    content:
      "Congratulations! You have won a Rs. 999 cashback from Paytm Lucky Rewards. To receive the amount, scan the QR code I am sending and enter your UPI PIN to authenticate the credit. Amount will reflect in 2 minutes.",
    meta: { from: "+91 90040 55213", name: "Paytm Rewards", amount: "Rs. 999" },
    redFlags: [
      "You NEVER scan a QR to receive money — QRs send money",
      "You NEVER enter a PIN to receive money",
      "Real cashbacks credit automatically",
      "Unknown number impersonating Paytm",
    ],
    explanation:
      "The QR is a payment request TO the scammer. Entering your PIN approves money leaving your account. 'Receive = no PIN' is the rule that stops this entire scam family.",
    tip: "Say it till it's reflex: receiving money requires zero PINs and zero QRs. Anyone claiming otherwise is robbing you.",
  },
  {
    caseCode: "FL-020",
    title: "Google storage from @gmail.com",
    channel: "email",
    category: "Phishing Links",
    riskLevel: "medium",
    isScam: true,
    difficulty: "hard",
    sender: "google-storage-alert@gmail.com",
    content:
      "Your Google storage is 99% full. Photos and emails will stop syncing in 48 hours. Upgrade your storage plan now at a 90% lifetime discount. Verify your account password to apply the discount: google-storage-promo.site/upgrade",
    meta: {
      from: "google-storage-alert@gmail.com",
      subject: "Storage almost full — 90% discount inside",
    },
    redFlags: [
      "Google services email from @google.com — never a free @gmail.com address",
      "'90% lifetime discount' bait",
      "google-storage-promo.site is not a Google domain",
      "Asks to 'verify password' on a web page",
    ],
    explanation:
      "Corporate services never write from free personal inboxes. That one detail — the sender domain — exposes the whole costume.",
    tip: "Check storage yourself: open the official app > settings. Two taps beat one risky click.",
  },
  {
    caseCode: "FL-021",
    title: "Income tax refund harvest",
    channel: "sms",
    category: "Banking & KYC",
    riskLevel: "high",
    isScam: true,
    difficulty: "medium",
    sender: "TX-REFUND",
    content:
      "Income Tax Dept: Your refund of Rs. 12,450 for AY 2025-26 is pending due to unverified bank details. Submit your PAN, bank account number and IFSC at taxrefund-portal.in before 5 PM today to receive credit.",
    meta: { from: "TX-REFUND" },
    redFlags: [
      "taxrefund-portal.in is not incometax.gov.in",
      "Students rarely have pending IT refunds — bait",
      "PAN + full bank details = identity theft kit",
      "Same-day 5 PM deadline",
    ],
    explanation:
      "The harvested PAN and bank details are used to open fake accounts and loans in your name. The Income Tax portal is only ever incometax.gov.in.",
    tip: "Tax refunds are tracked only on the official e-filing portal or app — log in yourself, never through a link.",
  },
  {
    caseCode: "FL-022",
    title: "Spin the wheel, win iPhone",
    channel: "website",
    category: "Freebies & Rewards",
    riskLevel: "medium",
    isScam: true,
    difficulty: "easy",
    sender: "quiz-mega-win.net",
    content:
      "Answer 3 simple questions and win an iPhone 16! 93% completed. [Timer: 04:12 remaining] 'Priya from Pune just won Rs. 5,000' 'Rohit from Delhi just won an iPhone'. Enter your phone number to claim before stock runs out.",
    meta: { url: "https://quiz-mega-win.net/spin", button: "Claim my prize" },
    redFlags: [
      "Fake countdown timer and fake winner pop-ups",
      "'Answer 3 questions to win a phone' is bait",
      "Phone number harvest leads to spam calls and OTP scams",
      "Random website, no company identity anywhere",
    ],
    explanation:
      "These pages sell your phone number to scam call centres. The 'winners' are scripted pop-ups — Priya from Pune does not exist.",
    tip: "Close the tab. Your phone number is a key: every scam call you get later started with one number given away.",
  },
  {
    caseCode: "FL-023",
    title: "Routine recharge receipt",
    channel: "sms",
    category: "Account Safety",
    riskLevel: "low",
    isScam: false,
    difficulty: "easy",
    sender: "AIRTEL",
    content:
      "Airtel: Your prepaid recharge of Rs. 299 was successful. Plan: 1.5GB/day, unlimited calls, valid till 12 Apr. Balance: Rs. 4.20. Manage plan on Airtel Thanks app.",
    meta: { from: "AIRTEL" },
    redFlags: [],
    explanation:
      "Genuine receipt: confirms your own action, gives specific plan details, asks nothing, links nothing.",
    tip: "Pattern check — confirms, specific, requests nothing. That's the shape of a safe message.",
  },
  {
    caseCode: "FL-024",
    title: "The blackmail bluff",
    channel: "whatsapp",
    category: "Blackmail",
    riskLevel: "high",
    isScam: true,
    difficulty: "hard",
    sender: "+234 803 555 0192",
    content:
      "I have access to your camera and recorded you visiting adult websites last week. Pay Rs. 10,000 in Bitcoin within 24 hours or I will send the video to all your contacts and post it online. Do not try to block me — I have everything backed up. This is not a joke.",
    meta: { from: "+234 803 555 0192", name: "Unknown" },
    redFlags: [
      "Classic sextortion script — mass-sent to thousands, no actual video exists",
      "Bitcoin demand = untraceable and irreversible",
      "24-hour panic deadline",
      "'Do not block me' tries to remove your exit",
    ],
    explanation:
      "These are bulk bluffs using leaked email/password lists. Paying marks you as a target for more demands. The winning move: never pay, block, report.",
    tip: "Screenshot, report to cybercrime.gov.in and 1930, then block. Tell a trusted adult — silence is what they're selling.",
  },
];

async function main() {
  console.log(`Seeding ${CASES.length} cases...`);
  for (const c of CASES) {
    await db
      .insert(scams)
      .values(c)
      .onConflictDoNothing({ target: scams.caseCode });
  }
  const count = await db.select().from(scams);
  console.log(`Done. scams table now has ${count.length} rows.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
