


import type { Thread, User, ChatConversation, DriveFile, Attachment } from './types';

// --- Users ---
export const you: User = { name: 'Alex Taylor', email: 'alex.taylor@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Alex Taylor', department: 'Engineering Lead', phone: '555-0101' };

export const priyaSharma: User = { name: 'Priya Sharma', email: 'priya.sharma@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Priya Sharma', department: 'Senior Software Engineer', phone: '555-0102' };
export const benCarter: User = { name: 'Ben Carter', email: 'ben.carter@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Ben Carter', department: 'Frontend Engineer', phone: '555-0103' };
export const evelynReed: User = { name: 'Evelyn Reed', email: 'e.reed@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Evelyn Reed', department: 'CEO', phone: '555-0100' };
export const davidChen: User = { name: 'David Chen', email: 'david.chen@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=David Chen', department: 'Head of Product', phone: '555-0104' };
export const anyaPetrova: User = { name: 'Dr. Anya Petrova', email: 'anya.petrova@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Dr. Anya Petrova', department: 'Head of R&D', phone: '555-0105' };
export const liamMiller: User = { name: 'Liam Miller', email: 'liam.miller@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Liam Miller', department: 'DevOps Engineer', phone: '555-0106' };
export const oliviaDavis: User = { name: 'Olivia Davis', email: 'olivia.davis@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Olivia Davis', department: 'Lead Designer', phone: '555-0107' };
export const chloeKim: User = { name: 'Chloe Kim', email: 'chloe.kim@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Chloe Kim', department: 'Marketing Manager', phone: '555-0108' };
export const jasonRodriguez: User = { name: 'Jason Rodriguez', email: 'jason.r@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Jason Rodriguez', department: 'Data Scientist', phone: '555-0109' };
export const sophiaNguyen: User = { name: 'Sophia Nguyen', email: 'sophia.n@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Sophia Nguyen', department: 'UX Researcher', phone: '555-0110' };
export const masonGarcia: User = { name: 'Mason Garcia', email: 'mason.g@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Mason Garcia', department: 'Security Analyst', phone: '555-0111' };
export const noahWilliams: User = { name: 'Noah Williams', email: 'noah.w@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Noah Williams', department: 'Backend Engineer', phone: '555-0112' };
export const sam: User = { name: 'Sam', email: 'sam.sender@example.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Sam', department: 'Friend' };


// --- Organizations / Bots ---
export const jira: User = { name: 'Jira', email: 'jira-noreply@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Jira', department: 'Productivity' };
export const expensify: User = { name: 'Expensify', email: 'receipts@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=E', department: 'Finance' };
export const techCrunch: User = { name: 'TechCrunch Digest', email: 'digest@techcrunch.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=TC', department: 'News' };
export const aws: User = { name: 'Amazon Web Services', email: 'aws-billing@amazon.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=AWS', department: 'Cloud Services' };
export const tripActions: User = { name: 'TripActions', email: 'travel@tripactions.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=TA', department: 'Travel' };
export const itSupportBot: User = { name: 'IT Support', email: 'it-support@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=IT', department: 'Support' };
export const humanResources: User = { name: 'Human Resources', email: 'hr@microhard.com', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=HR', department: 'HR' };


// --- Liverpool FC Users ---
export const youLiverpool: User = { name: 'Anfield Admin', email: 'admin@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=LFC', department: 'Operations', phone: '555-0300' };
export const arneSlot: User = { name: 'Arne Slot', email: 'a.slot@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=ArneSlot', department: 'Manager', phone: '555-0301' };
export const alissonBecker: User = { name: 'Alisson Becker', email: 'a.becker@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=Alisson', department: 'Goalkeeper', phone: '555-0302' };
export const virgilVanDijk: User = { name: 'Virgil van Dijk', email: 'v.vandijk@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=Virgil', department: 'Defence', phone: '555-0303' };
export const trentAlexanderArnold: User = { name: 'Trent Alexander-Arnold', email: 't.alexanderarnold@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=Trent', department: 'Defence', phone: '555-0304' };
export const moSalah: User = { name: 'Mohamed Salah', email: 'm.salah@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=Salah', department: 'Forward', phone: '555-0305' };
export const darwinNunez: User = { name: 'Darwin Núñez', email: 'd.nunez@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=Darwin', department: 'Forward', phone: '555-0306' };
export const dominikSzoboszlai: User = { name: 'Dominik Szoboszlai', email: 'd.szoboszlai@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=Szoboszlai', department: 'Midfield', phone: '555-0307' };
export const alexisMacAllister: User = { name: 'Alexis Mac Allister', email: 'a.macallister@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/micah/svg?seed=Alexis', department: 'Midfield', phone: '555-0308' };

// --- Liverpool FC Orgs ---
export const lfcTv: User = { name: 'LFC TV', email: 'broadcast@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=LFCTV' };
export const axaSponsorship: User = { name: 'AXA Sponsorship', email: 'sponsorship@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=AXA' };
export const nikeKitDept: User = { name: 'Nike Kit Department', email: 'kits@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Nike' };
export const ticketing: User = { name: 'LFC Ticketing', email: 'tickets@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Tickets' };
export const standardChartered: User = { name: 'Standard Chartered', email: 'finance@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=SC' };
export const lfcFoundation: User = { name: 'LFC Foundation', email: 'feedback@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=LFCF' };
export const carlsbergTravel: User = { name: 'Carlsberg Travel', email: 'travel@liverpool.uk.fc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=CT' };

// --- Professional Users ---
export const youInnovate: User = { name: 'Alex Johnson', email: 'alex.j@innovate.inc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Alex Johnson', department: 'Engineering', phone: '555-0400' };
export const samWilson: User = { name: 'Sam Wilson', email: 'sam.w@innovate.inc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Sam Wilson', department: 'Engineering', phone: '555-0401' };
export const janeDoe: User = { name: 'Jane Doe', email: 'jane.d@innovate.inc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=Jane Doe', department: 'Project Management', phone: '555-0402' };
export const hrInnovate: User = { name: 'Innovate HR', email: 'hr@innovate.inc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=HR', department: 'Human Resources' };
export const itSupport: User = { name: 'IT Support', email: 'support@innovate.inc', avatarUrl: 'https://api.dicebear.com/8.x/initials/svg?seed=IT', department: 'IT' };


export const allUsers: User[] = [
  you,
  priyaSharma,
  benCarter,
  evelynReed,
  davidChen,
  anyaPetrova,
  liamMiller,
  oliviaDavis,
  chloeKim,
  jasonRodriguez,
  sophiaNguyen,
  masonGarcia,
  noahWilliams,
  sam,
  jira,
  expensify,
  techCrunch,
  aws,
  tripActions,
  itSupportBot,
  humanResources,
  youLiverpool,
  arneSlot,
  alissonBecker,
  virgilVanDijk,
  trentAlexanderArnold,
  moSalah,
  darwinNunez,
  dominikSzoboszlai,
  alexisMacAllister,
  lfcTv,
  axaSponsorship,
  nikeKitDept,
  ticketing,
  standardChartered,
  lfcFoundation,
  carlsbergTravel,
  youInnovate, 
  samWilson, 
  janeDoe, 
  hrInnovate, 
  itSupport
];

const getDate = (daysAgo: number, time?: {hour: number, minute: number}) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    if (time) {
        date.setHours(time.hour, time.minute, 0, 0);
    }
    return date.toISOString();
}

const LONG_TECH_CEO_BODY = `
<p>Team,</p>
<p>I hope this message finds you well as we close out a pivotal second quarter. I’m writing to you today with a deep sense of optimism and urgency. The market is shifting at an unprecedented pace, and while we've made significant strides with Project Phoenix, we cannot afford to be complacent. The age of generative AI is not on the horizon; it is here, and it demands that we adapt, innovate, and lead. We have a unique window of opportunity to redefine our industry, but it will require our absolute focus and a unified push over the next six months.</p>
<p>First, a look back at Q2. Our engineering team delivered the beta for Phoenix on schedule, a monumental achievement that deserves recognition. The initial feedback from our early-access partners has been overwhelmingly positive, particularly regarding the new data-processing core. Priya and her team have built something truly remarkable. On the sales front, Chloe's team has already secured three enterprise pilot programs, exceeding our initial target. This momentum is fantastic, but it's just the beginning. The attached Q2 Performance Deck provides a more granular breakdown, and I expect all department heads to review it before our strategy session tomorrow.</p>
<p>Now, looking forward. Our primary objective for H2 is to transition Project Phoenix from a promising beta into a market-leading platform. This is not just an engineering challenge; it's a company-wide mission. Our strategy will be built on three core pillars:</p>
<p><strong>1. AI-Powered Intelligence Layer:</strong> We must aggressively integrate generative AI into the core of our product. This is no longer a 'nice-to-have' feature. Dr. Petrova’s R&D team has developed a prototype (Project Chimera) that demonstrates the potential for predictive analytics and automated workflows that could save our users hours each week. Our goal for Q3 is to embed this technology into the main Phoenix dashboard. David, I need product and design to work hand-in-hand with R&D and engineering to ensure the user experience is not just powerful, but intuitive and seamless. We will not ship a bolted-on AI feature; it must feel like a natural extension of our platform's intelligence.</p>
<p><strong>2. Scalability and Performance:</strong> As we onboard our first enterprise clients, our infrastructure will be tested like never before. Liam, your DevOps team's work is critical here. We need to be prepared for a 10x increase in user load by the end of Q4. This means finalizing the migration to the new microservices architecture and ensuring our deployment pipelines are robust and automated. We will be conducting a full-scale load test in the first week of August. I expect a detailed readiness report from you by July 22nd. There is no room for error here; our reputation depends on our reliability.</p>
<p><strong>3. Go-to-Market Acceleration:</strong> A superior product is useless if the market doesn't know about it. Chloe, I am increasing the Q3 marketing budget by 20% to fund a targeted campaign focused on three key verticals: finance, healthcare, and logistics. We will showcase the AI-powered features as our primary differentiator. We will be presenting at TechCrunch Disrupt in September, and I expect our booth and presentation to be world-class. This is our moment to make a statement.</p>
<p>I understand this is an ambitious plan. It will require long hours and a level of cross-functional collaboration we haven't attempted before. There will be challenges and setbacks. But when I look at the talent in this company, I have no doubt that we can achieve these goals. This is why you joined Microhard. You joined to build something that matters, something that pushes the boundaries of what's possible. This is our chance to do just that.</p>
<p>To facilitate this, we will be holding an all-hands strategy session tomorrow at 10:00 AM. I will walk through the H2 roadmap in detail and answer any questions you may have. Be prepared to be challenged, to think differently, and to commit to the path ahead. The future is not something we wait for; it is something we build. Let’s get to it.</p>
<p>Best,<br>Evelyn Reed<br>CEO, Microhard Inc.</p>
`;


const TECH_COMPANY_THREADS: Omit<Thread, 'account'>[] = [
  {
    id: 'dummy-filter-test',
    subject: "Q4 Financial Report & Discussion",
    participants: [davidChen, you],
    messages: [
        {
            id: 'msg-dummy-1',
            sender: davidChen,
            body: `<p>Hi @Alex, please review the attached financial report for Q4. We need to discuss the budget allocation.</p>`,
            timestamp: getDate(5, {hour: 10, minute: 0}),
            attachments: [
                { id: 'att-dummy-1', filename: 'Q4_Financials.pdf', url: '#', type: 'file' }
            ]
        }
    ],
    timestamp: getDate(5, {hour: 10, minute: 0}),
    isRead: false,
    isPinned: false,
    category: 'finance',
  },
  {
    id: 'meeting-demo-1',
    subject: "Invitation: Project Phoenix Kickoff",
    participants: [davidChen, you],
    messages: [
        {
            id: 'msg-meeting-1',
            sender: davidChen,
            body: `<p>Hi Team,</p><p>We are ready to kick off the next phase of Project Phoenix.</p><p><strong>When:</strong> Tomorrow, 10:00 AM - 11:00 AM<br><strong>Where:</strong> Conference Room A<br><strong>Agenda:</strong><br>- Review Q3 results<br>- Roadmap for Q4<br>- Resource allocation</p><p>Please add this to your calendars.</p><p>Best,<br>David</p>`,
            timestamp: getDate(0, {hour: 9, minute: 0}),
        }
    ],
    timestamp: getDate(0, {hour: 9, minute: 0}),
    isRead: false,
    isPinned: false,
    category: 'primary',
  },
  {
    id: 'thread-trip-photos',
    subject: "Photos from my trip!",
    participants: [sam, you],
    messages: [
      {
        id: 'msg-trip-1',
        sender: sam,
        body: `<p>Hey Alex,</p>
<p>I hope you're doing well! I just got back from my trip, and I wanted to share some photos with you. I had an amazing time, and I thought you'd enjoy seeing some of the highlights.</p>
<p>I've attached a few of my favorite pictures from the trip—everything from beautiful landscapes to some fun moments with the people I met. Take a look and let me know what you think!</p>
<p>It was such an unforgettable experience, and I can't wait to tell you all about it. We should catch up soon—maybe over coffee or a phone call?</p>
<p>Best,</p>
<p>Sam</p>`,
        timestamp: getDate(0, {hour: 10, minute: 35}),
        attachments: [
          { id: 'att1', filename: 'cherry-blossoms-day.jpg', url: 'https://i.imgur.com/ttr9AS5.jpeg', type: 'image' },
          { id: 'att2', filename: 'cherry-blossoms-night.jpg', url: 'https://i.imgur.com/8z2d8D0.jpeg', type: 'image' }
        ]
      },
    ],
    timestamp: getDate(0, {hour: 10, minute: 35}),
    isRead: false,
    isPinned: false,
    category: 'primary',
  },
  // --- Today ---
  {
    id: 'thread-1',
    subject: "Urgent: Q3 Strategy Review - Board Meeting Prep",
    participants: [evelynReed, anyaPetrova, davidChen, masonGarcia, noahWilliams, you],
    messages: [
      {
        id: 'msg1-1',
        sender: evelynReed,
        body: LONG_TECH_CEO_BODY,
        timestamp: getDate(0, {hour: 18, minute: 5}),
      },
      {
        id: 'msg1-2',
        sender: davidChen,
        body: `<p>Thanks, Evelyn. The product roadmap slides are ready. I'll have them uploaded to the shared drive shortly.</p>`,
        timestamp: getDate(0, {hour: 18, minute: 25}),
      },
      {
        id: 'msg1-3',
        sender: anyaPetrova,
        body: `<p>My team has some promising new data on the Chimera prototype's performance metrics. It could impact our Q4 projections. Is it too late to include a brief summary?</p>`,
        timestamp: getDate(0, {hour: 18, minute: 40}),
      },
      {
        id: 'msg1-4',
        sender: evelynReed,
        body: `<p>Not at all, Anya. Please send it over. The more data, the better. Rest of you, let's keep comms on this thread.</p>`,
        timestamp: getDate(0, {hour: 18, minute: 42}),
      },
    ],
    timestamp: getDate(0, {hour: 18, minute: 42}),
    isRead: false,
    isPinned: true,
    category: 'primary',
    tags: ['urgent', 'q3-strategy'],
  },
  {
    id: 'thread-2',
    subject: "Team Lunch this Friday?",
    participants: [benCarter, priyaSharma, you],
    messages: [
      { id: 'm1', sender: benCarter, body: '<p>Hey guys, anyone up for grabbing lunch on Friday? I was thinking that new Thai place downtown.</p>', timestamp: getDate(0, {hour: 16, minute: 30}) },
      { id: 'm2', sender: you, body: '<p>I\'m in! What time works?</p>', timestamp: getDate(0, {hour: 16, minute: 45}) },
      { id: 'm3', sender: priyaSharma, body: '<p>I have a 1 PM meeting, but I can do noon. I need to finish my code review for the auth module first though.</p>', timestamp: getDate(0, {hour: 17, minute: 10}) },
    ],
    timestamp: getDate(0, {hour: 17, minute: 10}),
    isRead: false,
    isPinned: false,
    category: 'primary',
    tags: ['team-event', 'social'],
  },
  {
    id: 'thread-3',
    subject: "[PROJ-1138] Your Atlassian Jira Weekly Digest",
    participants: [jira, you],
    messages: [{ id: 'm1', sender: jira, body: '<p>Hi Alex, Here are the issues that were updated in projects you\'re watching this week: <strong>PROJ-1139</strong> (In Progress), <strong>PROJ-1121</strong> (Done). Click here to view the full digest.</p>', timestamp: getDate(0, {hour: 15, minute: 1}) }],
    timestamp: getDate(0, {hour: 15, minute: 1}),
    isRead: true,
    isPinned: false,
    category: 'updates',
  },
  {
    id: 'thread-4',
    subject: "Mandatory Security Training Reminder",
    participants: [humanResources, you, benCarter],
    messages: [{ id: 'm1', sender: humanResources, body: '<p>This is a reminder that all employees must complete the annual security awareness training by EOD this Friday. The course can be accessed via the employee portal.</p>', timestamp: getDate(0, {hour: 14, minute: 22}) }],
    timestamp: getDate(0, {hour: 14, minute: 22}),
    isRead: true,
    isPinned: false,
    category: 'primary',
    tags: ['action-required'],
  },
  {
    id: 'thread-5',
    subject: "Marketing Sync Canceled",
    participants: [chloeKim, you],
    messages: [{ id: 'm1', sender: chloeKim, body: '<p>Hi Alex, canceling our sync today due to a last-minute client call. I\'ll send a new invite for tomorrow. Sorry for the short notice!</p>', timestamp: getDate(0, {hour: 13, minute: 0}) }],
    timestamp: getDate(0, {hour: 13, minute: 0}),
    isRead: true,
    isPinned: false,
    category: 'primary',
  },
  {
    id: 'thread-6',
    subject: "Your Expensify Report Summary - July",
    participants: [expensify, you],
    messages: [{ id: 'm1', sender: expensify, body: '<p>Your expense report "July 2024" has been approved. A total of $245.50 will be reimbursed on your next paycheck.</p>', timestamp: getDate(0, {hour: 9, minute: 5}) }],
    timestamp: getDate(0, {hour: 9, minute: 5}),
    isRead: true,
    isPinned: false,
    category: 'finance',
  },

  // Starred
  {
    id: 'starred-1',
    subject: "FWD: Confidential: Project Chimera Spec",
    participants: [masonGarcia, you],
    messages: [{ id: 'm1', sender: masonGarcia, body: '<p>Alex, as the lead on Phoenix, you should see this. These are the preliminary security specs for the AI integration. We need to sync up on potential vulnerabilities. Let me know when you have time.</p>', timestamp: getDate(1, {hour: 21, minute: 32}) }],
    timestamp: getDate(1, {hour: 21, minute: 32}),
    isRead: true,
    isPinned: false,
    isStarred: true,
    category: 'primary',
    tags: ['confidential', 'security'],
  },
   {
    id: 'starred-2',
    subject: "Q4 OKR Planning Session",
    participants: [davidChen, you, priyaSharma, jasonRodriguez],
    messages: [{ id: 'm1', sender: davidChen, body: '<p>Team, I\'ve scheduled our Q4 OKR brainstorming session for next Tuesday. Please come prepared with your top 3 priorities for your respective areas. The goal is to align on our key objectives before the end of the month.</p>', timestamp: getDate(2, {hour: 18, minute: 2}) }],
    timestamp: getDate(2, {hour: 18, minute: 2}),
    isRead: true,
    isPinned: false,
    isStarred: true,
    category: 'primary',
  },

  // Todos
  {
    id: 'todo-1',
    subject: "Can you share the API docs?",
    participants: [noahWilliams, you],
    messages: [{ id: 'm1', sender: noahWilliams, body: '<p>Hey Alex, could you send me the latest documentation for the authentication service? The version on Confluence seems to be outdated. Thanks!</p>', timestamp: getDate(1) }],
    timestamp: getDate(1),
    isRead: true,
    isPinned: false,
    category: 'todos',
  },
  {
    id: 'todo-2',
    subject: "Action Required: Complete Annual Performance Review",
    participants: [humanResources, you],
     messages: [{ id: 'm1', sender: humanResources, body: '<p>All employees are required to complete their self-assessment for the annual performance review cycle by October 31st. Please log in to the HR portal to complete the form.</p>', timestamp: getDate(4) }],
    timestamp: getDate(4),
    isRead: true,
    isPinned: false,
    category: 'todos',
  },

  // Snoozed
  {
    id: 'snoozed-1',
    subject: "Fwd: Interesting article on new JS frameworks",
    participants: [sophiaNguyen, you],
    messages: [{ id: 'm1', sender: sophiaNguyen, body: '<p>Hi Alex, saw this article and thought you might find it interesting for the Project Phoenix frontend rewrite. The section on reactive state management is particularly insightful.</p>', timestamp: getDate(3) }],
    timestamp: getDate(3),
    isRead: true,
    isPinned: false,
    category: 'primary',
    snoozedUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // Snoozed for 2 days
  },

  // --- Last Week ---
  {
    id: 'thread-7',
    subject: "Code Review Feedback for PR #1138",
    participants: [anyaPetrova, you],
    messages: [{ id: 'm1', sender: anyaPetrova, body: '<p>Alex, your team\'s implementation of the caching layer is solid. However, I have left a few comments regarding potential race conditions under high load. Please review and address them before we merge to main. Overall, good work.</p>', timestamp: getDate(2, {hour: 11, minute: 45}) }],
    timestamp: getDate(2, {hour: 11, minute: 45}),
    isRead: true,
    isPinned: false,
    category: 'feedback',
  },
  {
    id: 'thread-8',
    subject: "Following up on the server migration",
    participants: [liamMiller, you],
    messages: [
        { id: 'm1', sender: you, body: '<p>Hi Liam, just checking in. How is the staging server migration coming along?</p>', timestamp: getDate(3, {hour: 19, minute: 0}) },
        { id: 'm2', sender: liamMiller, body: '<p>Hey Alex, so far so good. We hit a small snag with the environment variables, but it\'s sorted now. On track to finish by EOD. I\'ll ping you when it\'s ready for testing.</p>', timestamp: getDate(3, {hour: 20, minute: 15}) }
    ],
    timestamp: getDate(3, {hour: 20, minute: 15}),
    isRead: true,
    isPinned: false,
    category: 'primary',
  },
  {
    id: 'thread-9',
    subject: "Your Flight Itinerary for TechCrunch Disrupt",
    participants: [tripActions, you],
    messages: [{ id: 'm1', sender: tripActions, body: '<p>Your flight to San Francisco for TechCrunch Disrupt is confirmed. Please review your itinerary and check in 24 hours before departure. Have a great trip!</p>', timestamp: getDate(4) }],
    timestamp: getDate(4),
    isRead: true,
    isPinned: false,
    category: 'travel',
  },
    {
    id: 'thread-10',
    subject: "Optional: Advanced TypeScript Workshop",
    participants: [noahWilliams, you, priyaSharma],
    messages: [{ id: 'm1', sender: noahWilliams, body: '<p>Hi team, for those interested, I am hosting a workshop on advanced TypeScript patterns, including conditional types and template literal types. It will be next Friday in the main conference room.</p>', timestamp: getDate(5) }],
    timestamp: getDate(5),
    isRead: true,
    isPinned: false,
    category: 'primary',
  },
  {
    id: 'thread-11',
    subject: "Urgent: Client Escalation - Acme Corp",
    participants: [oliviaDavis, you],
    messages: [{ id: 'm1', sender: oliviaDavis, body: '<p>Alex, Acme Corp has escalated a ticket regarding the new dashboard UI. They are not happy with the changes. We need to have a call with them ASAP to mitigate this. I\'ve looped in the account manager.</p>', timestamp: getDate(6) }],
    timestamp: getDate(6),
    isRead: true,
    isPinned: false,
    category: 'primary',
  },

  // --- Older ---
  {
    id: 'thread-12',
    subject: "Welcome to Microhard Inc.!",
    participants: [davidChen, you],
    messages: [{ id: 'm1', sender: davidChen, body: '<p>Dear Alex, On behalf of the entire team, I am delighted to welcome you to Microhard. We are all excited to have you on board. Your manager will reach out shortly to discuss your onboarding plan.</p>', timestamp: getDate(30) }],
    timestamp: getDate(30),
    isRead: true,
    isPinned: false,
    category: 'primary',
  },
  {
    id: 'thread-13',
    subject: "Your New MacBook Pro Setup Guide",
    participants: [itSupportBot, you],
    messages: [{ id: 'm1', sender: itSupportBot, body: '<p>Welcome! Your new company laptop is ready. Please follow the attached guide to complete the initial setup and security configuration. If you have any issues, reply to this email to create a support ticket.</p>', timestamp: getDate(45) }],
    timestamp: getDate(45),
    isRead: true,
    isPinned: false,
    category: 'primary',
  },
  ...Array.from({ length: 37 }, (_, i) => ({
    id: `older-thread-${i + 1}`,
    subject: `TechCrunch Daily Digest - Issue #${150 - i}`,
    participants: [techCrunch, you],
    messages: [{ id: `m${i}`, sender: techCrunch, body: `<p>Your daily TechCrunch newsletter is here. Today's headlines include: "Quantum Computing Startup Raises $50M Series B" and "The Future of Serverless Architecture".</p>`, timestamp: getDate(10 + i * 2) }],
    timestamp: getDate(10 + i * 2),
    isRead: true,
    isPinned: false,
    category: 'updates' as const,
  })),
  // --- Sent ---
  { id: 'sent-1', subject: 'Re: Team Lunch this Friday?', participants: [benCarter, priyaSharma, you], messages: [{ id: 's1', sender: you, body: '<p>I\'m in! What time works?</p>', timestamp: getDate(0, { hour: 16, minute: 45 }) }], timestamp: getDate(0, { hour: 16, minute: 45 }), isRead: true, isPinned: false, category: 'primary' },
  { id: 'sent-2', subject: 'Re: Following up on the server migration', participants: [liamMiller, you], messages: [{ id: 's2', sender: you, body: '<p>Hi Liam, just checking in. How is the staging server migration coming along?</p>', timestamp: getDate(3, { hour: 19, minute: 0 }) }], timestamp: getDate(3, { hour: 19, minute: 0 }), isRead: true, isPinned: false, category: 'primary' },
  { id: 'sent-3', subject: 'Heads up - Production server latency spikes', participants: [masonGarcia, you], messages: [{ id: 's3', sender: you, body: '<p>Mason, seeing some latency spikes on the main production cluster. Could be a DDoS attempt. Can you take a look? -Alex</p>', timestamp: getDate(5) }], timestamp: getDate(5), isRead: true, isPinned: false, category: 'primary' },
  // --- Drafts ---
  { id: 'draft-1', subject: '(Draft) New API endpoint proposal', participants: [you], messages: [{ id: 'd1', sender: you, body: '<p>Endpoints to propose:\n- GET /users/{id}/profile\n- POST /teams/{id}/members\n-</p>', timestamp: getDate(1) }], timestamp: getDate(1), isRead: true, isPinned: false, category: 'primary' },
  { id: 'draft-2', subject: '(Draft) Thank you note to the design team', participants: [you], messages: [{ id: 'd2', sender: you, body: '<p>Hi Olivia, Just wanted to say thank you to your team for the amazing work on the new wireframes!</p>', timestamp: getDate(10) }], timestamp: getDate(10), isRead: true, isPinned: false, category: 'primary' },
  { id: 'draft-3', subject: '(Draft) Ideas for the next offsite', participants: [you], messages: [{ id: 'd3', sender: you, body: '<p>Let\'s do something more active next time. Maybe a hackathon or a coding retreat.</p>', timestamp: getDate(12) }], timestamp: getDate(12), isRead: true, isPinned: false, category: 'primary' },
  // --- Archived ---
  { id: 'archive-1', subject: 'Your Confluence Space is Almost Full', participants: [humanResources, you], messages: [{ id: 'a1', sender: humanResources, body: '<p>Dear Alex, Your personal space on Confluence is at 90% capacity. Please archive or delete old pages to free up space.</p>', timestamp: getDate(40) }], timestamp: getDate(40), isRead: true, isPinned: false, category: 'updates', isArchived: true },
  { id: 'archive-2', subject: 'Your required software for the new term', participants: [humanResources, you], messages: [{ id: 'a2', sender: humanResources, body: '<p>Please find your required software list for the upcoming quarter attached. All licenses are available via the company software portal.</p>', timestamp: getDate(90) }], timestamp: getDate(90), isRead: true, isPinned: false, category: 'updates', isArchived: true },
  // --- Bundles ---
  { id: 'bundle-finance-1', subject: 'Invoice from AWS for July', participants: [aws, you], messages: [{ id: 'bf1', sender: aws, body: '<p>Your AWS invoice for the month of July is now available. Please remit payment at your earliest convenience.</p>', timestamp: getDate(8) }], timestamp: getDate(8), isRead: true, isPinned: false, category: 'finance' },
  { id: 'bundle-feedback-1', subject: 'How was your recent support ticket? - IT Support', participants: [itSupportBot, you], messages: [{ id: 'bfb1', sender: itSupportBot, body: '<p>We\'d love to get your feedback on your recent support ticket #8123. Let us know how we did!</p>', timestamp: getDate(11) }], timestamp: getDate(11), isRead: true, isPinned: false, category: 'feedback' },
  { id: 'bundle-travel-1', subject: 'Your Uber Receipt', participants: [tripActions, you], messages: [{ id: 'bt1', sender: tripActions, body: '<p>Thank you for using Uber on your recent business trip. Your receipt for $22.50 is attached.</p>', timestamp: getDate(22) }], timestamp: getDate(22), isRead: true, isPinned: false, category: 'travel' },
];

const LONG_LIVERPOOL_BODY = `
<p>Good morning team,</p>
<p>I hope you all had a restful Sunday, but now our focus shifts entirely to what is undoubtedly one of the most critical weeks of our season. The performance against Chelsea was solid, a testament to the hard work you've been putting in, but solid is not enough. We are Liverpool. We aim for perfection, and this week, we must demand nothing less from ourselves as we prepare to face Manchester City. This is a match that will not be won on talent alone; it will be won by intelligence, by discipline, and by an unbreakable collective will. I am attaching the full, detailed training schedule for the week, but I want to use this message to outline the philosophy and the specific focal points that will guide every session we have.</p>
<p>First, let's briefly touch upon the Chelsea match. The data analysis from the performance team is attached for your review, and I expect every one of you to read it before our session tomorrow morning. The key takeaways are positive: our pressing intensity in the first 60 minutes was the highest it's been all season, leading to 14 possession recoveries in the final third. Dominik, your energy in leading that press was exceptional and set the tone for the entire team. However, we saw a noticeable drop-off in the final 20 minutes. Our defensive shape became stretched, and the distance between the midfield and defensive lines grew, allowing them two clear-cut chances that Alisson, thankfully, was equal to. This is a non-negotiable we must fix. Champions play for 95 minutes, not 60. Our fitness levels are excellent, so this is a matter of concentration and tactical discipline under fatigue. This will be a theme throughout the week.</p>
<p>Looking ahead to Manchester City, we are facing a team that is surgical in its exploitation of space. Their ability to pull teams out of position is second to none. Therefore, our primary focus this week will be on 'Compactness and Transition'. Every single drill, from the warm-up rondos to the full-sided games, will be designed to reinforce these principles.</p>
<p><strong>Monday: Recovery & Tactical Introduction.</strong> The session will be light for those who played 90 minutes. For the rest of the squad, it will be a sharp, high-intensity session focused on passing patterns under pressure. In the afternoon, we will have a team-wide video session. We will analyze three specific patterns of play from City: their use of inverted full-backs to create central overloads, De Bruyne's movement into the half-spaces, and Haaland's channel runs. Virgil, I need you and Ibou to lead the discussion on how we manage those runs, maintaining our high line while eliminating the space in behind. We must be on the same page from minute one.</p>
<p><strong>Tuesday: Defensive Shape and Pressing Triggers.</strong> This will be our most intensive tactical day. We will work in units—defence, midfield, attack—on maintaining our compact 4-3-3 shape out of possession. The distances between each of you must be perfect. We will drill the specific triggers for our press. We do not press randomly. We press when the ball goes to their full-back, when there's a poor touch, or a backwards pass. Alexis, your role as the '6' will be pivotal. Your positioning dictates the entire team's shape. We will work on the scenario where you drop between the center-backs to create a back three, allowing our full-backs, Trent and Robbo, to engage higher up the pitch. Trent, this will require immense tactical discipline from you. Your creative genius is a weapon, but against City, your defensive responsibility is paramount. We cannot afford any lapses.</p>
<p><strong>Wednesday: Attacking Transitions & Finishing.</strong> Having established our defensive solidity, Wednesday will be about what we do the moment we win the ball. This is where we can hurt them. Our transition from defence to attack must be lightning-fast and precise. We will work on one-touch and two-touch passing drills to move the ball forward quickly. Mo, Darwin, Luis—your movement will be key. I don't want to see static runs. I want to see intelligent, coordinated movements to stretch their backline. Darwin, we have been working on the timing of your runs. That split-second of hesitation is the difference between being onside and offside. This week, in every finishing drill, I want you to focus on that initial movement, arcing your run to stay onside. We will finish the session with a high-pressure 11v11 game on a narrowed pitch to simulate the intensity and lack of space we will face on Saturday.</p>
<p><strong>Thursday: Set-Pieces (Offensive & Defensive).</strong> Games of this magnitude are often decided by a single moment. We will dedicate the entire session to set-pieces. We have identified a potential weakness in City's zonal marking on corners. We have three new routines we will be implementing, designed to create space for Virgil at the back post. We will walk through them, then drill them until they are second nature. Defensively, their routines are complex. Every player must know their specific role, their man, and their zone. There is no room for error. We will not concede a cheap goal from a set-play. It is a sign of a weak mentality, and we are not weak.</p>
<p><strong>Friday: Final Preparations & Activation.</strong> A short, sharp session. We will focus on activation, small-sided games, and a final walkthrough of our tactical plan. This is more of a mental day than a physical one. We will end with a finishing competition—I want you going into the game on Saturday feeling sharp, confident, and hungry for goals. The team for Saturday will be announced after this session.</p>
<p>I want to be clear: I believe in every single one of you. I believe in our philosophy, our fitness, and our quality. But belief is not enough. It must be matched by meticulous preparation and flawless execution. This week, every minute matters. The time in the gym, the attention in the video room, the quality of your nutrition and sleep—it all contributes to the result on Saturday. Let's be professional, let's be focused, and let's show them why Anfield is a fortress. Let's show them who we are.</p>
<p>See you all at the training ground tomorrow morning at 9 AM sharp.</p>
<p>Best,<br>Arne</p>
`;

// --- Liverpool FC Email Generator ---
const liverpoolUsers = [arneSlot, alissonBecker, virgilVanDijk, trentAlexanderArnold, moSalah, darwinNunez, dominikSzoboszlai, alexisMacAllister, lfcTv, axaSponsorship, nikeKitDept, ticketing, standardChartered, lfcFoundation, carlsbergTravel];
const subjects = [
    "Training Schedule Update: Week of the 15th", "Match Day Strategy vs Man City", "Sponsorship Opportunity: AXA Annual Gala", "New 2025/26 Nike Kit Photoshoot",
    "Post-Match Analysis: Chelsea", "Media Duties for LFC TV", "Travel Itinerary for Champions League Away Leg", "Ticket Allocation for Family and Friends",
    "Nutrition Plan Update", "Community Outreach Event Details", "Financial Fair Play Report Q3", "Player Appearance Feedback Survey", "Flight Details for Pre-season Tour"
];
const bodies = [
    "<p>Hi team, please find the updated training schedule for this week attached. Note the earlier start on Wednesday for tactical review.</p>",
    "<p>Attached is the tactical breakdown for our upcoming match against Man City. Please review the set-piece variations. We'll walk through them tomorrow.</p>",
    "<p>Dear players, you are cordially invited to the AXA Annual Gala. Please RSVP by Friday. Dress code is black tie.</p>",
    "<p>Reminder: The photoshoot for next season's Nike kit is scheduled for Thursday at 2 PM at the AXA Training Centre. Please be prompt.</p>",
    "<p>A summary of key performance indicators from the Chelsea match is now available on the portal. Overall, a strong performance, but let's focus on defensive transitions.</p>",
    "<p>Mo, Trent - LFC TV has requested you for a short pre-match interview. It will take 15 minutes after training on Friday.</p>",
    "<p>Please find your flight and hotel details for the upcoming Champions League match. A full itinerary is attached.</p>",
    "<p>Your ticket allocation for the next home game is now available to claim. Please use the players' portal to assign them.</p>",
    "<p>The club nutritionists have updated the pre-match meal plans. Please check the new menu and make your selections by tomorrow evening.</p>",
    "<p>We have a community outreach event at a local school on Tuesday. A bus will depart from the training ground at 1 PM.</p>",
    "<p>The Q3 FFP report from Standard Chartered is now available for review by the board.</p>",
    "<p>Please provide your feedback on the recent LFC Foundation player appearance event.</p>",
    "<p>Your Carlsberg-sponsored travel itinerary for the USA pre-season tour is confirmed.</p>"
];

const getCategoryForLFC = (subject: string): Thread['category'] => {
    if (subject.toLowerCase().includes('financial') || subject.toLowerCase().includes('ffp')) return 'finance';
    if (subject.toLowerCase().includes('feedback') || subject.toLowerCase().includes('survey')) return 'feedback';
    if (subject.toLowerCase().includes('travel') || subject.toLowerCase().includes('flight')) return 'travel';
    if (subject.toLowerCase().includes('kit') || subject.toLowerCase().includes('schedule')) return 'updates';
    return 'primary';
};

const LIVERPOOL_THREADS: Thread[] = Array.from({ length: 40 }, (_, i) => {
    const sender = liverpoolUsers[i % liverpoolUsers.length];
    const subject = subjects[i % subjects.length];
    const participants = [sender, youLiverpool];
    if (i % 3 === 0) participants.push(liverpoolUsers[(i + 1) % liverpoolUsers.length]);
    const body = i === 0 ? LONG_LIVERPOOL_BODY : bodies[i % bodies.length];

    return {
        id: `liverpool-thread-${i + 1}`,
        subject: subject,
        participants: participants,
        messages: [{
            id: `lfc-msg-${i}`,
            sender: sender,
            body: body,
            timestamp: getDate(i),
        }],
        timestamp: getDate(i),
        isRead: i > 8, // make first 9 unread
        isPinned: false,
        isStarred: i % 10 === 0,
        category: getCategoryForLFC(subject),
        account: 'liverpool' as const,
    };
});

// Add Sent, Drafts, Archived for Liverpool
LIVERPOOL_THREADS.push(
  { id: 'lfc-sent-1', subject: 'Re: Media Duties', participants: [lfcTv, youLiverpool], messages: [{ id: 'ls1', sender: youLiverpool, body: '<p>Confirmed. Trent and Mo will be there.</p>', timestamp: getDate(1) }], timestamp: getDate(1), isRead: true, isPinned: false, category: 'primary', account: 'liverpool' },
  { id: 'lfc-sent-2', subject: 'Re: Ticket Allocation', participants: [ticketing, youLiverpool], messages: [{ id: 'ls2', sender: youLiverpool, body: '<p>Please allocate 2 extra tickets for Virgil for the next match.</p>', timestamp: getDate(2) }], timestamp: getDate(2), isRead: true, isPinned: false, category: 'primary', account: 'liverpool' },
  { id: 'lfc-draft-1', subject: '(Draft) Transfer Target List', participants: [youLiverpool], messages: [{ id: 'ld1', sender: youLiverpool, body: '<p>Initial list of summer transfer targets:\n- Centre-Back:\n- Defensive Midfielder:</p>', timestamp: getDate(3) }], timestamp: getDate(3), isRead: true, isPinned: false, category: 'primary', account: 'liverpool' },
  { id: 'lfc-archive-1', subject: 'Welcome to the Team, Arne!', participants: [youLiverpool], messages: [{ id: 'la1', sender: youLiverpool, body: '<p>Welcome to Liverpool FC, Arne! We are all excited to have you.</p>', timestamp: getDate(60) }], timestamp: getDate(60), isRead: true, isPinned: false, category: 'primary', account: 'liverpool', isArchived: true }
);

export const PROFESSIONAL_THREADS: Thread[] = [
  {
    id: 'prof-thread-1',
    subject: "Q3 Project Phoenix - Final Review",
    participants: [janeDoe, samWilson, youInnovate],
    messages: [
      {
        id: 'prof-msg-1-1',
        sender: janeDoe,
        body: `<p>Hi Team,</p><p>This is a reminder for the final review meeting for Project Phoenix's Q3 deliverables. The meeting is scheduled for this Friday at 2:00 PM in Conference Room 4B.</p><p>Please come prepared to discuss your team's progress and any remaining blockers. The agenda is attached.</p><p>Best,<br>Jane Doe<br>Project Manager</p>`,
        timestamp: getDate(0, {hour: 11, minute: 15}),
      },
      {
        id: 'prof-msg-1-2',
        sender: youInnovate,
        body: `<p>Thanks, Jane. I've reviewed the agenda. The engineering team is on track and will have the final demo ready.</p>`,
        timestamp: getDate(0, {hour: 11, minute: 45}),
      },
    ],
    timestamp: getDate(0, {hour: 11, minute: 45}),
    isRead: false,
    isPinned: true,
    category: 'primary',
    account: 'innovate',
  },
  {
    id: 'prof-thread-sam',
    subject: "Quick question about the new API endpoints",
    participants: [samWilson, youInnovate],
    messages: [
        {
            id: 'prof-msg-sam-1',
            sender: samWilson,
            body: `<p>Hey Alex,</p><p>Hope you're having a good week. I was looking over the documentation for the new user authentication API and had a quick question about the token refresh logic. Do you have a minute to sync up today or tomorrow?</p><p>Let me know what works for you.</p><p>Cheers,<br>Sam</p>`,
            timestamp: getDate(0, {hour: 10, minute: 35}),
        },
    ],
    timestamp: getDate(0, {hour: 10, minute: 35}),
    isRead: false,
    isPinned: false,
    category: 'primary',
    account: 'innovate',
  },
  {
    id: 'prof-thread-hr',
    subject: "Updated Company Holiday Policy",
    participants: [hrInnovate, youInnovate],
    messages: [
      {
        id: 'prof-msg-hr-1',
        sender: hrInnovate,
        body: `<p>Dear Employees,</p><p>Please be advised that there has been an update to the company's holiday policy for the upcoming fiscal year. The new policy includes an additional floating holiday and changes to the year-end shutdown period.</p><p>You can find the full details in the attached PDF. Please review it at your earliest convenience.</p><p>Thank you,<br>Innovate Inc. HR Department</p>`,
        timestamp: getDate(1, {hour: 14, minute: 0}),
      },
    ],
    timestamp: getDate(1, {hour: 14, minute: 0}),
    isRead: true,
    isPinned: false,
    category: 'updates',
    account: 'innovate',
  },
  {
    id: 'prof-thread-it',
    subject: "Scheduled Maintenance - Saturday 8 PM PST",
    participants: [itSupport, youInnovate],
    messages: [
      {
        id: 'prof-msg-it-1',
        sender: itSupport,
        body: `<p>Hello,</p><p>This is a notification of scheduled maintenance for our internal servers. The maintenance window will be this Saturday from 8:00 PM to 11:00 PM PST.</p><p>During this time, access to the shared drive and internal wiki may be intermittent. We apologize for any inconvenience.</p><p>Regards,<br>IT Support</p>`,
        timestamp: getDate(2, {hour: 9, minute: 30}),
      },
    ],
    timestamp: getDate(2, {hour: 9, minute: 30}),
    isRead: true,
    isPinned: false,
    category: 'updates',
    account: 'innovate',
  },
];


export const MOCK_THREADS: Thread[] = [
    ...TECH_COMPANY_THREADS.map(t => ({ ...t, account: 'microhard' as const })),
    ...LIVERPOOL_THREADS
];


export const MOCK_CHAT_CONVERSATIONS: ChatConversation[] = [
    {
        id: 'chat-1',
        participant: priyaSharma,
        messages: [
            { id: 'cm-1', sender: 'other', text: 'Hey, are you free to look at PR #1142?', timestamp: getDate(0, { hour: 14, minute: 30 })},
            { id: 'cm-2', sender: 'me', text: 'Yep, just finishing a build. I\'ll take a look in 5.', timestamp: getDate(0, { hour: 14, minute: 31 })},
            { id: 'cm-3', sender: 'other', text: 'Thanks! The new auth logic is tricky.', timestamp: getDate(0, { hour: 14, minute: 32 })},
        ],
        unreadCount: 0,
    },
    {
        id: 'chat-2',
        participant: benCarter,
        messages: [
            { id: 'cm-4', sender: 'other', text: 'Coffee?', timestamp: getDate(0, { hour: 16, minute: 5 })},
            { id: 'cm-5', sender: 'other', text: 'Meet at the usual spot?', timestamp: getDate(0, { hour: 16, minute: 5 })},
            { id: 'cm-6', sender: 'me', text: 'You read my mind. Be right there.', timestamp: getDate(0, { hour: 16, minute: 6 })},
        ],
        unreadCount: 2,
    },
    {
        id: 'chat-3',
        participant: chloeKim,
        messages: [
            { id: 'cm-7', sender: 'other', text: 'Did you see the latest engagement metrics? The new campaign is killing it!', timestamp: getDate(1)},
            { id: 'cm-8', sender: 'me', text: 'I saw! Awesome work by your team.', timestamp: getDate(1)},
        ],
        unreadCount: 0,
    }
];

export const MOCK_DRIVE_FILES: DriveFile[] = [
  // Quick Access (simulated by picking a few important files)
  { id: 'df-1', name: 'Q3 Performance Metrics.xlsx', type: 'spreadsheet', owner: evelynReed, lastModified: getDate(1, { hour: 14, minute: 0 }), size: 2300000, isStarred: true, path: '/Reports' },
  { id: 'df-2', name: 'Project Phoenix Roadmap.xlsx', type: 'spreadsheet', owner: davidChen, lastModified: getDate(0, { hour: 11, minute: 30 }), size: 850000, isStarred: true, path: '/Phoenix Docs' },
  { id: 'df-3', name: 'Onboarding Presentation.pptx', type: 'presentation', owner: humanResources, lastModified: getDate(2, { hour: 16, minute: 45 }), size: 5600000, isStarred: false, path: '/HR Materials' },
  { id: 'df-4', name: 'UX Wireframes', type: 'folder', owner: oliviaDavis, lastModified: getDate(5), isStarred: true, path: '/' },

  // Folders
  { id: 'df-5', name: 'Code Reviews', type: 'folder', owner: you, lastModified: getDate(3), isStarred: false, path: '/' },
  { id: 'df-6', name: 'Marketing Assets', type: 'folder', owner: you, lastModified: getDate(10), isStarred: false, path: '/' },
  { id: 'df-7', name: 'Phoenix Docs', type: 'folder', owner: davidChen, lastModified: getDate(0, { hour: 11, minute: 29 }), isStarred: true, path: '/' },
  
  // Files in root
  { id: 'df-8', name: 'Offer Letter.pdf', type: 'pdf', owner: humanResources, lastModified: getDate(365 * 2), size: 120000, isStarred: true, path: '/' },
  { id: 'df-9', name: 'Team Offsite Brainstorm.jpg', type: 'image', owner: you, lastModified: getDate(20), size: 4500000, isStarred: false, path: '/' },
  { id: 'df-10', name: 'Vacation Plans.docx', type: 'document', owner: priyaSharma, lastModified: getDate(4), size: 15000, isStarred: false, path: '/' },
  { id: 'df-11', name: 'Server Migration Plan.docx', type: 'document', owner: liamMiller, lastModified: getDate(150), size: 45000, isStarred: false, path: '/' },
  { id: 'df-12', name: 'Team Budget Q4.xlsx', type: 'spreadsheet', owner: benCarter, lastModified: getDate(8), size: 72000, isStarred: false, path: '/' },
  { id: 'df-13', name: 'Intro to Microservices.mov', type: 'video', owner: anyaPetrova, lastModified: getDate(30), size: 128000000, isStarred: false, path: '/Onboarding Materials' },
];
