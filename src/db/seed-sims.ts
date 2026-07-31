import "dotenv/config";
import { db } from "./index";
import { simScenarios } from "./schema";
import type { SimPhase } from "./schema";

interface SimSeed {
  slug: string;
  title: string;
  platform: string;
  scammerName: string;
  scammerAvatar: string;
  scammerNumber: string;
  category: string;
  difficulty: string;
  riskLevel: string;
  phases: SimPhase[];
  redFlags: string[];
  debriefTitle: string;
  debriefBody: string;
  debriefTip: string;
  xpReward: number;
}

const SCENARIOS: SimSeed[] = [
  // ========== 1. WhatsApp: "Bro I'm stuck abroad" ==========
  {
    slug: "bro-stuck-abroad",
    title: "Bro, I'm stuck at Dubai airport!",
    platform: "whatsapp",
    scammerName: "Rahul",
    scammerAvatar: "R",
    scammerNumber: "+91 98765 43210",
    category: "Impersonation",
    difficulty: "medium",
    riskLevel: "high",
    xpReward: 60,
    redFlags: [
      "Account was hacked — the real Rahul never sent this",
      "Emergency money request with URGENT emotional pressure",
      "'Don't tell my parents' — classic isolation tactic",
      "New UPI ID that doesn't match your friend's usual one",
      "No voice note or call — only text",
    ],
    debriefTitle: "⚠️ THIS WAS A SCAM — Rahul's account was hacked",
    debriefBody:
      "You just experienced one of the most common scams targeting students. The real Rahul's WhatsApp account was compromised by a phishing link. The scammer then messaged EVERYONE in his contact list with the same 'stuck abroad' story. About 1 in 8 friends actually send money before verifying. You were NEVER talking to Rahul — you were talking to a stranger who stole his account.",
    debriefTip:
      "Golden rule: if a friend asks for emergency money, CALL them on their usual number — not through the same chat. Ask something only they would know. No call, no cash.",
    phases: [
      {
        id: "intro",
        messages: [
          { from: "scammer", text: "Bro", delayMs: 500 },
          { from: "scammer", text: "You there? Need urgent help", delayMs: 1800 },
        ],
        userPrompt: "Your friend Rahul is messaging. What do you say?",
        userOptions: [
          { label: "Yeah bro what's up?", nextPhase: "story" },
          { label: "Who is this?", nextPhase: "story" },
        ],
      },
      {
        id: "story",
        messages: [
          { from: "scammer", text: "Listen, I'm in serious trouble right now", delayMs: 1200 },
          {
            from: "scammer",
            text: "I'm stuck at Dubai airport. My wallet got stolen man 😭",
            delayMs: 2500,
          },
          { from: "scammer", text: "All my cards are blocked. I can't even get a hotel for tonight", delayMs: 3000 },
        ],
        userPrompt: "This sounds serious...",
        userOptions: [
          { label: "Omg, how can I help?", nextPhase: "ask-money" },
          { label: "Can I call you right now?", nextPhase: "dodge-call" },
        ],
      },
      {
        id: "dodge-call",
        messages: [
          { from: "scammer", text: "Bro can't talk, my phone's at 2% and the charger got stolen too", delayMs: 1800 },
          { from: "scammer", text: "Just text. Please, I'm panicking here", delayMs: 2000 },
        ],
        userPrompt: "They won't take a call... suspicious?",
        userOptions: [
          { label: "Ok tell me what you need", nextPhase: "ask-money" },
          { label: "I'm calling your parents", nextPhase: "parents-threat" },
        ],
      },
      {
        id: "parents-threat",
        messages: [
          { from: "scammer", text: "NO! Please don't tell my parents, they'll freak out", delayMs: 1000 },
          { from: "scammer", text: "I'll sort this out and tell them myself. Please bro just help me tonight", delayMs: 2500 },
        ],
        userPrompt: "They desperately don't want parents involved...",
        userOptions: [
          { label: "Fine, what do you need?", nextPhase: "ask-money" },
          { label: "I'm calling them anyway 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "ask-money",
        messages: [
          { from: "scammer", text: "I need about ₹5,000 just for tonight's hotel and some food", delayMs: 2000 },
          { from: "scammer", text: "Send it on this UPI: rahul.travels456@paytm", delayMs: 2200 },
          { from: "scammer", text: "I swear I'll return it tomorrow when I get to the embassy. You know me bro 🙏", delayMs: 3500 },
        ],
        userPrompt: "₹5,000 to a UPI ID you've never seen before...",
        userOptions: [
          { label: "Ok sending now...", nextPhase: "fell-for-it" },
          { label: "This UPI ID is new. What happened to your usual one?", nextPhase: "excuse" },
          { label: "I'm calling you first. No call = no money 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "excuse",
        messages: [
          { from: "scammer", text: "Bro my old Paytm got blocked along with my cards. This is my friend's account who's with me", delayMs: 2800 },
          { from: "scammer", text: "Please just send it, the hotel guy is literally waiting 😫", delayMs: 2000 },
        ],
        userPrompt: "The story keeps changing...",
        userOptions: [
          { label: "Ok fine, sending ₹5,000", nextPhase: "fell-for-it" },
          { label: "I'm calling. Right now. 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "fell-for-it",
        messages: [
          { from: "scammer", text: "Thanks bro, you're a lifesaver ❤️", delayMs: 1000 },
          { from: "scammer", text: "I'll send you the hotel bill tomorrow. Goodnight!", delayMs: 2500 },
        ],
        userPrompt: "Money sent. You feel good about helping your friend.",
        userOptions: [
          { label: "Wait... something feels off...", nextPhase: "caught" },
        ],
      },
      {
        id: "caught",
        messages: [
          { from: "scammer", text: "...", delayMs: 3000 },
          { from: "scammer", text: "You're smart. Most people don't catch this.", delayMs: 2000 },
        ],
        userPrompt: "The scammer realizes you've figured it out...",
        userOptions: [],
      },
    ],
  },

  // ========== 2. WhatsApp: "Bank KYC threat call transfer" ==========
  {
    slug: "kyc-call-transfer",
    title: "Your bank account will be BLOCKED",
    platform: "whatsapp",
    scammerName: "SBI KYC Cell",
    scammerAvatar: "S",
    scammerNumber: "+91 90342 11876",
    category: "Banking & KYC",
    difficulty: "easy",
    riskLevel: "high",
    xpReward: 40,
    redFlags: [
      "Banks NEVER do KYC through WhatsApp or SMS links",
      "Fake deadline creates panic ('within 24 hours')",
      "Link domain is sbi-kyc-verify.in, NOT sbi.co.in",
      "Personal mobile number, not a bank's official channel",
      "Threatens account blocking — fear tactic",
    ],
    debriefTitle: "⚠️ THIS WAS A PHISHING SCAM",
    debriefBody:
      "You just experienced the most common bank phishing scam in India. The link would have taken you to a pixel-perfect copy of SBI's login page. The moment you entered your username and password, the scammer would have drained your account. The domain 'sbi-kyc-verify.in' looks official — but the real owner registered it yesterday. Banks NEVER send KYC links via WhatsApp or SMS.",
    debriefTip:
      "KYC is done in-branch or through your bank's official app. Never through a link someone sent you. If you get this message, open your bank app and check — if KYC was actually due, it'll show there.",
    phases: [
      {
        id: "initial",
        messages: [
          {
            from: "scammer",
            text: "🔴 URGENT: STATE BANK OF INDIA — KYC VERIFICATION REQUIRED",
            delayMs: 800,
          },
          {
            from: "scammer",
            text: "Dear Customer, your SBI savings account will be BLOCKED within 24 hours due to incomplete KYC as per RBI guidelines.",
            delayMs: 3000,
          },
          {
            from: "scammer",
            text: "To prevent account suspension, verify your KYC immediately using the secure link below 👇",
            delayMs: 2500,
          },
          {
            from: "scammer",
            text: "https://sbi-kyc-verify.in/portal/8372",
            delayMs: 1500,
          },
        ],
        userPrompt: "This looks official... but is it?",
        userOptions: [
          { label: "Click the link and check", nextPhase: "fell-for-it" },
          { label: "This looks suspicious — SBI doesn't message on WhatsApp", nextPhase: "challenge" },
        ],
      },
      {
        id: "challenge",
        messages: [
          { from: "scammer", text: "Sir, this is the official SBI KYC verification portal. Your account will be blocked if you don't complete this within the deadline.", delayMs: 2500 },
          { from: "scammer", text: "We are sending this as per RBI circular RBI/2025-26/47. Non-compliance will result in account freeze.", delayMs: 3500 },
        ],
        userPrompt: "They're quoting an RBI circular... authority pressure.",
        userOptions: [
          { label: "Ok, I'll click the link", nextPhase: "fell-for-it" },
          { label: "I'm opening my SBI app instead 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "fell-for-it",
        messages: [
          { from: "scammer", text: "Thank you. Please enter your username, password and OTP on the verification page.", delayMs: 1500 },
        ],
        userPrompt: "The fake SBI page asks for your login credentials and OTP...",
        userOptions: [{ label: "Wait... this isn't right...", nextPhase: "caught" }],
      },
      {
        id: "caught",
        messages: [],
        userPrompt: "🚩 You spotted it! This was a phishing attack.",
        userOptions: [],
      },
    ],
  },

  // ========== 3. Instagram DM: "Win a free iPhone" ==========
  {
    slug: "instagram-free-iphone",
    title: "🎉 You won an iPhone 16! (DM)",
    platform: "instagram",
    scammerName: "applegiveaway_official",
    scammerAvatar: "A",
    scammerNumber: "@applegiveaway_official",
    category: "Freebies & Rewards",
    difficulty: "easy",
    riskLevel: "high",
    xpReward: 40,
    redFlags: [
      "Fake verified-looking account (check the handle spelling!)",
      "You never entered any contest",
      "Asks for credit card for 'shipping fee' — classic pay-to-claim",
      "Phishing link to fake login page",
      "Urgency: 'Only 3 winners left to claim'",
    ],
    debriefTitle: "⚠️ THIS WAS A PHISHING + CARD THEFT SCAM",
    debriefBody:
      "No one gives away iPhones to people who didn't enter a contest. The link would have stolen your Instagram password (to hack your account and scam your followers next), and the '₹299 shipping fee' page would have captured your card number, expiry and CVV. Within minutes, your card would be maxed out on a crypto exchange.",
    debriefTip:
      "Instagram giveaways from brands you follow will be announced ON their verified page, not in a random DM. Real companies never charge shipping for prizes.",
    phases: [
      {
        id: "intro",
        messages: [
          {
            from: "scammer",
            text: "🎉 CONGRATULATIONS! Your Instagram account has been randomly selected as the WINNER of our iPhone 16 Pro Giveaway! 📱✨",
            delayMs: 1000,
          },
          {
            from: "scammer",
            text: "You've won a brand new iPhone 16 Pro (256GB, Titanium). Only 3 winners left to claim their prize — claim yours NOW before it expires! ⏰",
            delayMs: 4000,
          },
        ],
        userPrompt: "You just won... something you never entered?",
        userOptions: [
          { label: "OMG really?! How do I claim?", nextPhase: "claim" },
          { label: "I never entered any giveaway...", nextPhase: "challenge" },
        ],
      },
      {
        id: "challenge",
        messages: [
          { from: "scammer", text: "You were auto-entered through your Instagram activity! 🎯 All active users are eligible. This is 100% legit — check our page @applegiveaway_official ✅", delayMs: 3000 },
        ],
        userPrompt: "They sound convincing... but 'auto-entered' is a red flag.",
        userOptions: [
          { label: "Hmm ok, tell me how to claim", nextPhase: "claim" },
          { label: "Block and report this account 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "claim",
        messages: [
          { from: "scammer", text: "Simple! Just follow these steps:", delayMs: 1000 },
          { from: "scammer", text: "1️⃣ Click this secure link to verify: ig-winners-hub.info/claim/4829", delayMs: 2000 },
          { from: "scammer", text: "2️⃣ Login with your Instagram to confirm identity", delayMs: 1500 },
          { from: "scammer", text: "3️⃣ Pay a small shipping & handling fee of just ₹299 for doorstep delivery 🚚", delayMs: 2500 },
          { from: "scammer", text: "Your iPhone will be dispatched within 24 hours! 🎁", delayMs: 2000 },
        ],
        userPrompt: "A phishing link + 'shipping fee' for a free prize...",
        userOptions: [
          { label: "Let me pay the shipping fee", nextPhase: "fell-for-it" },
          { label: "Why do I need to pay for a FREE prize? 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "fell-for-it",
        messages: [
          { from: "scammer", text: "Great! Once you complete the payment, you'll receive a tracking number within 2 hours 📦", delayMs: 1500 },
        ],
        userPrompt: "You've just given away your Instagram password AND card details...",
        userOptions: [{ label: "Oh no... this was a scam...", nextPhase: "caught" }],
      },
      {
        id: "caught",
        messages: [],
        userPrompt: "🚩 You spotted the scam! Real giveaways don't ask for passwords or shipping fees.",
        userOptions: [],
      },
    ],
  },

  // ========== 4. Phone Call: "CBI digital arrest" ==========
  {
    slug: "cbi-digital-arrest",
    title: "📞 This is CBI. An arrest warrant is in your name.",
    platform: "call",
    scammerName: "Inspector Sharma",
    scammerAvatar: "👮",
    scammerNumber: "+91 11 2301 4492",
    category: "Impersonation",
    difficulty: "hard",
    riskLevel: "high",
    xpReward: 80,
    redFlags: [
      "CBI does NOT conduct cases over phone/video calls",
      "Arrest warrants are served in person, never announced by phone",
      "'Government verification account' does not exist",
      "Demands you install AnyDesk/TeamViewer — remote access",
      "'Do not tell anyone' — enforced isolation",
      "Spoofed caller ID (looks like Delhi landline but isn't)",
    ],
    debriefTitle: "⚠️ THIS WAS THE 'DIGITAL ARREST' SCAM",
    debriefBody:
      "You just faced the fastest-growing scam in India — the 'digital arrest' fraud. The caller was NOT a CBI officer. The number was spoofed. The 'arrest warrant' was fabricated. The 'Safe Custody' app would have given them full remote control of your phone, letting them see your screen, read OTPs, and transfer money while you watched helplessly. Victims have lost crores. One college student lost ₹19 lakh — her entire education fund. The CBI has publicly stated: 'We never call citizens to demand money or threaten arrest.'",
    debriefTip:
      "Hang up immediately. Real law enforcement serves written notices in person. Call 1930 (cyber helpline) if you've already shared any information. Tell someone you trust — silence is what these scammers sell.",
    phases: [
      {
        id: "ringing",
        messages: [
          { from: "scammer", text: "PHONE RINGING: +91 11 2301 4492 (shows 'CBI Delhi' on Truecaller)", delayMs: 500 },
        ],
        userPrompt: "Your phone is ringing. Caller ID says 'CBI Delhi'...",
        userOptions: [
          { label: "Answer the call", nextPhase: "answered" },
          { label: "Ignore and block 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "answered",
        messages: [
          { from: "scammer", text: "AUDIO: 'Namaste. This is Inspector Vikram Sharma calling from the Central Bureau of Investigation, Delhi headquarters. Am I speaking to [your name]?'", delayMs: 1500 },
        ],
        userPrompt: "A deep, authoritative voice. Sounds legitimate...",
        userOptions: [
          { label: "Yes, speaking. What is this about?", nextPhase: "accusation" },
          { label: "I'm hanging up. CBI doesn't call people. 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "accusation",
        messages: [
          { from: "scammer", text: "AUDIO: 'Your Aadhaar number has been linked to a money laundering case. A parcel containing drugs was intercepted in Mumbai, registered in your name. An arrest warrant is being processed through the Delhi High Court.'", delayMs: 2000 },
          { from: "scammer", text: "AUDIO: 'If you do not cooperate, a police team will arrive at your residence within 3 hours to execute the warrant. Your bank accounts will be frozen. Your passport will be cancelled.'", delayMs: 5000 },
        ],
        userPrompt: "Drugs? Money laundering? This is terrifying...",
        userOptions: [
          { label: "This must be a mistake! How do I prove my innocence?", nextPhase: "solution" },
          { label: "Send me the warrant in writing. I'm calling my lawyer. 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "solution",
        messages: [
          { from: "scammer", text: "AUDIO: 'Listen carefully. We believe you may be innocent, but we need to verify your funds. You must install the Safe Custody app and transfer all your money to a government verification account. Once verified, your money is returned and the warrant is cancelled. This investigation is confidential — DO NOT tell anyone, not even your parents. If the suspects get alerted, you will be charged with obstruction of justice.'", delayMs: 3000 },
        ],
        userPrompt: "They want you to install an app and transfer ALL your money... AND keep it secret.",
        userOptions: [
          { label: "Ok, send me the app link. I don't want trouble.", nextPhase: "fell-for-it" },
          { label: "I'm calling 1930. You're not CBI. 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "fell-for-it",
        messages: [
          { from: "scammer", text: "AUDIO: 'Good. I am sending an SMS with the download link. Stay on the line. Do not disconnect or the warrant will be issued immediately.'", delayMs: 2000 },
        ],
        userPrompt: "You're about to install remote-access malware and empty your account...",
        userOptions: [{ label: "WAIT. This is the digital arrest scam. I saw this on FraudLens!", nextPhase: "caught" }],
      },
      {
        id: "caught",
        messages: [],
        userPrompt: "🚩 YOU CAUGHT IT! This was the infamous 'digital arrest' scam.",
        userOptions: [],
      },
    ],
  },

  // ========== 5. Instagram DM: "Sugar momma / easy money" ==========
  {
    slug: "instagram-sugar-scam",
    title: "💸 Earn ₹25,000/week as my companion",
    platform: "instagram",
    scammerName: "priya_sharma_khan",
    scammerAvatar: "P",
    scammerNumber: "@priya_sharma_khan",
    category: "Romance / Sugar Scam",
    difficulty: "medium",
    riskLevel: "high",
    xpReward: 50,
    redFlags: [
      "Unsolicited DM from an unknown 'attractive' profile",
      "Too-good-to-be-true money offer",
      "Asks to move conversation to WhatsApp — off-platform",
      "Will eventually ask for 'registration fee' or gift cards",
      "Profile has stolen photos, low followers, recent creation",
    ],
    debriefTitle: "⚠️ THIS WAS A ROMANCE / SUGAR SCAM",
    debriefBody:
      "The profile was fake — photos stolen from a real model's Instagram. After building trust, they would ask for 'registration fees', 'gift cards for my daughter', or blackmail you using any compromising content you shared. These scams prey on loneliness and the promise of easy money. There is no 'Priya Sharma Khan' — just a scammer in a call center with a folder of stolen pictures.",
    debriefTip:
      "Strangers DMing money offers are ALWAYS scams. Block, report the account, and never share personal details or photos with unknown profiles.",
    phases: [
      {
        id: "intro",
        messages: [
          { from: "scammer", text: "Hey handsome 😊 I was scrolling and your profile caught my eye", delayMs: 1000 },
          { from: "scammer", text: "I'm Priya. I work in fashion in Mumbai. I'm looking for a genuine guy to be my companion ❤️", delayMs: 3000 },
        ],
        userPrompt: "A random attractive profile just DM'd you...",
        userOptions: [
          { label: "Hey, thanks! Tell me more about yourself", nextPhase: "offer" },
          { label: "Sorry, I don't talk to strangers 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "offer",
        messages: [
          { from: "scammer", text: "I'm actually looking for someone I can spoil and take care of 😇 I'll pay you ₹25,000 per week just to chat with me and be my friend. No strings attached!", delayMs: 3000 },
          { from: "scammer", text: "I've been lonely since my divorce and I just want genuine company. You seem sweet 💕", delayMs: 3500 },
        ],
        userPrompt: "₹25,000/week just to chat? Sounds too good...",
        userOptions: [
          { label: "That's a LOT of money... how does this work?", nextPhase: "hook" },
          { label: "Block and report. This is a known scam. 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "hook",
        messages: [
          { from: "scammer", text: "Let's move to WhatsApp — it's more private. Save my number: +91 90040 55213 📲", delayMs: 2000 },
          { from: "scammer", text: "I just need you to do one small thing first — send me a ₹1,000 Amazon gift card as a 'trust gesture.' I'll triple it and add it to your first payment 💸", delayMs: 4000 },
        ],
        userPrompt: "They want a 'trust gesture' gift card before any payment...",
        userOptions: [
          { label: "Send the gift card. I trust her.", nextPhase: "fell-for-it" },
          { label: "This is a scam. I'm reporting this account. 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "fell-for-it",
        messages: [
          { from: "scammer", text: "Perfect! Once I receive it, I'll send your first week payment immediately 💋", delayMs: 1500 },
        ],
        userPrompt: "You sent ₹1,000. They'll ask for more... this never ends.",
        userOptions: [{ label: "I've been scammed...", nextPhase: "caught" }],
      },
      {
        id: "caught",
        messages: [],
        userPrompt: "🚩 You identified the sugar/romance scam!",
        userOptions: [],
      },
    ],
  },

  // ========== 6. SMS notification: "Electricity bill scam" ==========
  {
    slug: "electricity-bill-sms",
    title: "⚡ Your electricity will be cut TODAY",
    platform: "sms",
    scammerName: "JM-PWRBIL",
    scammerAvatar: "⚡",
    scammerNumber: "JM-PWRBIL",
    category: "Delivery & Bills",
    difficulty: "medium",
    riskLevel: "high",
    xpReward: 45,
    redFlags: [
      "'Disconnected TODAY' creates extreme urgency",
      "Link goes to power-bill-pay.info, not your state electricity board",
      "No consumer number mentioned — generic blast message",
      "Your actual bill status can be checked on the official app",
      "Same-day threats are never how real utilities operate",
    ],
    debriefTitle: "⚠️ THIS WAS A UTILITY BILL PHISHING SCAM",
    debriefBody:
      "This message is sent to MILLIONS of numbers at random. The link leads to a fake payment page that steals your card details. Real electricity boards never threaten same-day disconnection over an SMS, especially without your consumer number. Every summer, thousands of people pay fake bills out of fear — and then their real bill still shows as unpaid.",
    debriefTip:
      "ALWAYS check your bill on your electricity board's official app or website. If it shows 'paid,' the SMS is a scam — delete and report to 1930.",
    phases: [
      {
        id: "arrive",
        messages: [
          { from: "scammer", text: "⚡ URGENT: Your electricity connection will be DISCONNECTED today at 6 PM due to unpaid bill of Rs. 1,847. Pay immediately to avoid reconnection charges: power-bill-pay.info/recharge", delayMs: 500 },
        ],
        userPrompt: "An SMS just arrived from 'JM-PWRBIL'...",
        userOptions: [
          { label: "Oh no! Let me pay quickly!", nextPhase: "fell-for-it" },
          { label: "Wait... I paid my bill last week. Let me check my board's app 🚩", nextPhase: "caught" },
        ],
      },
      {
        id: "fell-for-it",
        messages: [
          { from: "scammer", text: "PAYMENT GATEWAY: Please enter your card number, expiry, CVV, and OTP to complete payment of ₹1,847.", delayMs: 1000 },
        ],
        userPrompt: "The fake payment page looks just like the real one...",
        userOptions: [{ label: "I just gave them my card details... 😰", nextPhase: "caught" }],
      },
      {
        id: "caught",
        messages: [],
        userPrompt: "🚩 You avoided a utility bill phishing scam!",
        userOptions: [],
      },
    ],
  },
];

async function main() {
  console.log(`Seeding ${SCENARIOS.length} immersive scenarios...`);
  for (const s of SCENARIOS) {
    await db
      .insert(simScenarios)
      .values(s as any)
      .onConflictDoNothing({ target: simScenarios.slug });
  }
  const count = await db.select().from(simScenarios);
  console.log(`Done. sim_scenarios table now has ${count.length} rows.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
