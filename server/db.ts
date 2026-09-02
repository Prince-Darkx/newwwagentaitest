import {
  CallerProfile,
  CallRecord,
  KnowledgeBaseItem,
  HandoffTicket,
  AnalyticsSummary,
  AgentVoiceSettings,
  CollegeAccount,
  AdminAccount,
  SubscriptionTier,
  BillingCycle,
  PlanConfig,
  CreditTransaction
} from '../src/types.js';

export const PLAN_CONFIGS: Record<SubscriptionTier, PlanConfig> = {
  Starter: {
    tier: 'Starter',
    name: 'Institutional Starter',
    monthlyPrice: 149,
    yearlyPrice: 1490,
    monthlyCredits: 2500, // 2,500 voice telephony minutes/mo
    counselorSeats: 2,
    voiceProfilesCount: 1,
    features: [
      '2,500 Voice Telephony Minutes / mo',
      'Continuous Speech Recognition & TTS',
      'Campus Knowledge Base (Up to 100 items)',
      '1 Concurrent Human Counselor Desk',
      'Standard Applicant CRM & Audio Transcripts',
      'Email & SMS Notification Dispatch'
    ]
  },
  Pro: {
    tier: 'Pro',
    name: 'Autonomous Campus Pro',
    monthlyPrice: 399,
    yearlyPrice: 3990,
    monthlyCredits: 10000, // 10,000 voice telephony minutes/mo
    counselorSeats: 6,
    voiceProfilesCount: 3,
    features: [
      '10,000 Voice Telephony Minutes / mo',
      'Real-time Emotion & Frustration Telemetry',
      'Multi-Stream Department Knowledge Routing',
      '6 Live Human Counselor Desks with 1-click Handoff',
      'Automated WhatsApp & Fee Payment Dispatch',
      'Priority Gemini NLU Processing Pipeline',
      'Custom Voice Modulation & Dialect Tuning'
    ]
  },
  Enterprise: {
    tier: 'Enterprise',
    name: 'National University Enterprise',
    monthlyPrice: 899,
    yearlyPrice: 8990,
    monthlyCredits: 35000, // 35,000 voice telephony minutes/mo
    counselorSeats: 25,
    voiceProfilesCount: 10,
    features: [
      '35,000 Voice Telephony Minutes / mo',
      'Dedicated 1-800 Toll-Free SIP Trunking',
      'Unlimited Knowledge Base Items & Auto-Sync',
      '25 Human Counselor Desks + Supervisor Barge-in',
      'ERP / SIS Direct Database Webhooks',
      'Custom University Fine-Tuned Voice Agent',
      '24/7 Priority SLA & Dedicated Account Manager'
    ]
  }
};

// Initial Seed Registered Colleges
const initialColleges: CollegeAccount[] = [
  {
    id: 'col-apex-01',
    collegeName: 'Apex Institute of Higher Education & Technology',
    collegeCode: 'AIHT-2026',
    email: 'counselor@apex.edu',
    password: 'apex123',
    affiliation: 'Accredited NAAC A++ • Affiliated with State Technical University',
    phone: '+1 (800) 555-APEX',
    city: 'Silicon Valley Corridor',
    state: 'California',
    website: 'https://apex.edu',
    status: 'Active',
    registeredAt: '2026-01-15T08:00:00Z',
    departments: [
      'Engineering (B.Tech CSE, AI & Robotics)',
      'Management (MBA & BBA)',
      'Computer Applications (BCA & MCA)',
      'Pharmacy & Allied Health (B.Pharm)',
      'Commerce & Fintech (B.Com)',
      'Law & Legal Studies (BA LLB)'
    ],
    totalStudentsCount: 4200,
    totalCallsCount: 148,
    contactPerson: 'Dr. Priya Sharma',
    contactDesignation: 'Dean of Admissions & Student Affairs',
    subscriptionTier: 'Pro',
    billingCycle: 'yearly',
    monthlyCreditAllowance: 10000,
    creditsRemaining: 8420,
    creditsUsed: 1580,
    subscriptionRenewsAt: '2027-01-15T08:00:00Z',
    amountPaid: 3990,
    approvedAt: '2026-01-15T09:00:00Z',
    approvedBy: 'EduVoice Super Admin'
  },
  {
    id: 'col-metro-02',
    collegeName: 'Metropolitan Institute of Science, Commerce & Tech',
    collegeCode: 'MIST-109',
    email: 'admissions@metrotech.edu',
    password: 'metro123',
    affiliation: 'Autonomous Institute • AICTE & UGC Approved',
    phone: '+1 (800) 444-MIST',
    city: 'Boston',
    state: 'Massachusetts',
    website: 'https://metrotech.edu',
    status: 'Active',
    registeredAt: '2026-03-10T10:30:00Z',
    departments: [
      'Computer Applications (BCA & MCA Cloud)',
      'Applied Science & Data Analytics (B.Sc)',
      'Business Administration (BBA & MBA)',
      'Commerce & Banking (B.Com Honors)',
      'Cyber Security & Digital Forensics'
    ],
    totalStudentsCount: 2800,
    totalCallsCount: 92,
    contactPerson: 'Prof. David Vance',
    contactDesignation: 'Admissions Director',
    subscriptionTier: 'Pro',
    billingCycle: 'monthly',
    monthlyCreditAllowance: 10000,
    creditsRemaining: 6850,
    creditsUsed: 3150,
    subscriptionRenewsAt: '2026-09-10T10:30:00Z',
    amountPaid: 399,
    approvedAt: '2026-03-10T11:00:00Z',
    approvedBy: 'EduVoice Super Admin'
  },
  {
    id: 'col-horizon-03',
    collegeName: 'Horizon Global University of Management, Tech & Pharmacy',
    collegeCode: 'HGIM-504',
    email: 'contact@horizonglobal.ac.in',
    password: 'horizon123',
    affiliation: 'State University Approved • PCI & AICTE Recognized',
    phone: '+1 (800) 777-HGIM',
    city: 'Austin',
    state: 'Texas',
    website: 'https://horizonglobal.ac.in',
    status: 'Pending_Approval',
    registeredAt: '2026-08-25T14:20:00Z',
    departments: [
      'Engineering (B.Tech Mechanical & CSE)',
      'Computer Applications (BCA)',
      'Pharmacy (B.Pharm & Pharm.D)',
      'Management (MBA Finance & Marketing)',
      'Law (BBA LLB)'
    ],
    totalStudentsCount: 1450,
    totalCallsCount: 15,
    contactPerson: 'Anita Rao',
    contactDesignation: 'Counseling Lead',
    subscriptionTier: 'Enterprise',
    billingCycle: 'yearly',
    monthlyCreditAllowance: 35000,
    creditsRemaining: 35000,
    creditsUsed: 0,
    subscriptionRenewsAt: '2027-08-25T14:20:00Z',
    amountPaid: 8990
  }
];

// Initial Admin
const initialAdmin: AdminAccount = {
  id: 'admin-super-01',
  name: 'EduVoice National Directorate Admin',
  email: 'admin@eduvoice.ac.in',
  role: 'super_admin',
  lastLoginAt: '2026-08-31T20:00:00Z'
};

// Initial Seed Data for Multi-Stream Knowledge Base
const initialKnowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 'kb-inst-01',
    category: 'institute_info',
    categoryName: 'Institute Information',
    title: 'About Apex Institute of Higher Education & Technology (AIHT)',
    keywords: ['about', 'ranking', 'accreditation', 'nirf', 'naac', 'established', 'location', 'campus', 'departments'],
    content: 'Apex Institute of Higher Education & Technology (AIHT) was established in 1998 and is accredited with NAAC A++ Grade with a CGPA of 3.82. Ranked #18 in NIRF 2025 across all technical and multidisciplinary universities. AIHT operates 7 major academic schools: School of Engineering & Tech, School of Computer Applications & IT, School of Management, School of Pharmacy, School of Commerce, School of Law, and School of Applied Sciences.',
    lastUpdated: '2026-08-15',
    tags: ['Overview', 'Ranking', 'Multidisciplinary']
  },
  // 1. Engineering & Technology
  {
    id: 'kb-course-01',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'B.Tech in Computer Science & Artificial Intelligence (4 Years)',
    keywords: ['btech', 'cse', 'computer science', 'ai', 'curriculum', 'seats', 'syllabus', 'engineering'],
    content: 'B.Tech Computer Science & AI is a 4-year undergraduate engineering program (180 seats). Specializations: Generative AI, Cloud Infrastructure, and Autonomous Robotics. Includes mandatory 6-month paid capstone internship. Eligibility: Min 60% in 10+2 with Physics, Mathematics and Chemistry/CS + JEE/CET scorecard.',
    lastUpdated: '2026-08-20',
    tags: ['Undergraduate', 'Engineering', 'AI']
  },
  {
    id: 'kb-course-02',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'B.Tech in Robotics & Autonomous Systems (4 Years)',
    keywords: ['btech', 'robotics', 'automation', 'mechatronics', 'hardware', 'drones', 'engineering'],
    content: 'A 4-year hands-on program in Mechatronics, ROS2 robotics software, UAV drone dynamics, and industrial automation. Features modern Industry 4.0 FabLab and KUKA robotic arm facilities. Eligibility: 60% in 10+2 PCM.',
    lastUpdated: '2026-08-18',
    tags: ['Undergraduate', 'Engineering', 'Robotics']
  },
  // 2. Computer Applications & IT
  {
    id: 'kb-course-03',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'Bachelor of Computer Applications - BCA in Cloud & AI Systems (3 Years)',
    keywords: ['bca', 'computer applications', 'software', 'coding', 'web development', 'python', 'cloud', 'devops'],
    content: 'The 3-year BCA program trains students in Full-Stack Web Development, Cloud Computing (AWS/GCP), Python/Data Structures, and AI App Integration. 120 seats. Eligibility: 10+2 in any stream (Science/Commerce/Arts) with minimum 50% aggregate and Mathematics/Computer/Business Maths at 10+2 or 10th level.',
    lastUpdated: '2026-08-22',
    tags: ['Undergraduate', 'Computer Applications', 'Software']
  },
  {
    id: 'kb-course-04',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'Master of Computer Applications - MCA in Big Data & AI (2 Years)',
    keywords: ['mca', 'postgraduate', 'master', 'big data', 'distributed systems', 'ai', 'software engineering'],
    content: 'A 2-year postgraduate program for BCA/B.Sc grads. Deep dive into distributed database architectures, LLMs, DevOps CI/CD pipelines, and enterprise microservices. Eligibility: BCA / B.Sc CS / B.Tech or graduation with Maths.',
    lastUpdated: '2026-08-20',
    tags: ['Postgraduate', 'Computer Applications', 'AI']
  },
  // 3. Business & Management
  {
    id: 'kb-course-05',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'MBA in Tech Leadership, Fintech & Product Strategy (2 Years)',
    keywords: ['mba', 'management', 'business', 'fintech', 'cat', 'gmat', 'postgraduate', 'marketing'],
    content: 'Full-time 2-year MBA with dual specialization options: Fintech & Digital Banking, Product Management, Business Analytics, or Global Supply Chain. Features Singapore Global Immersion week. Eligibility: Graduation with min 50% + valid CAT / XAT / MAT / GMAT score.',
    lastUpdated: '2026-08-18',
    tags: ['Postgraduate', 'Business', 'Management']
  },
  {
    id: 'kb-course-06',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'Bachelor of Business Administration - BBA in Digital Marketing & Entrepreneurship (3 Years)',
    keywords: ['bba', 'business', 'management', 'marketing', 'startup', 'undergraduate', 'commerce'],
    content: '3-year undergraduate management degree offering hands-on incubator access, seed funding opportunities for student ventures, digital media marketing, and business analytics. Eligibility: 10+2 from any recognized board with min 50%.',
    lastUpdated: '2026-08-15',
    tags: ['Undergraduate', 'Business', 'Marketing']
  },
  // 4. Pharmacy & Healthcare
  {
    id: 'kb-course-07',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'Bachelor of Pharmacy - B.Pharm (4 Years) & Pharm.D (6 Years)',
    keywords: ['bpharm', 'pharmacy', 'medicine', 'pharmaceutics', 'clinical research', 'drugs', 'pci'],
    content: 'Pharmacy Council of India (PCI) approved 4-year B.Pharm and 6-year Doctor of Pharmacy (Pharm.D). World-class pharmacology labs, analytical chemistry suites, and hospital clinical rotation tie-ups. Eligibility: 10+2 with Physics, Chemistry and Biology/Maths (min 50%).',
    lastUpdated: '2026-08-12',
    tags: ['Undergraduate', 'Pharmacy', 'Health']
  },
  // 5. Commerce & Finance
  {
    id: 'kb-course-08',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'B.Com (Honors) in Banking, Fintech & International Accounting (3 Years)',
    keywords: ['bcom', 'commerce', 'accounting', 'banking', 'fintech', 'taxation', 'cfa', 'acca'],
    content: '3-year program with integrated ACCA / CMA course alignment. Covers blockchain finance, algorithmic trading basics, corporate taxation, and audit standards. Eligibility: 10+2 Commerce or Science with min 50%.',
    lastUpdated: '2026-08-10',
    tags: ['Undergraduate', 'Commerce', 'Finance']
  },
  // 6. Law & Legal Studies
  {
    id: 'kb-course-09',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'BA LLB & BBA LLB 5-Year Integrated Law Programs',
    keywords: ['law', 'ballb', 'bballb', 'llb', 'advocate', 'legal', 'bar council', 'clat', 'corporate law'],
    content: 'Bar Council of India (BCI) recognized 5-year integrated double degree. Features high-fidelity Moot Court hall, Legal Aid Clinic, and corporate cyber law internships. Eligibility: 10+2 in any discipline with min 45% (CLAT or AIHT Law Test).',
    lastUpdated: '2026-08-08',
    tags: ['Undergraduate', 'Law', 'Integrated']
  },
  // 7. Applied Sciences
  {
    id: 'kb-course-10',
    category: 'courses',
    categoryName: 'Courses & Programs',
    title: 'B.Sc (Honors) in Biotechnology & Genomics (3 Years)',
    keywords: ['bsc', 'biotechnology', 'genetics', 'bioinformatics', 'microbiology', 'science'],
    content: '3-year degree in modern genetic engineering, PCR molecular diagnostic workflows, and pharmaceutical bioinformatics. Eligibility: 10+2 with Biology.',
    lastUpdated: '2026-08-05',
    tags: ['Undergraduate', 'Science', 'Biotech']
  },
  // Fees & Scholarships
  {
    id: 'kb-fee-01',
    category: 'fees_scholarships',
    categoryName: 'Fees & Scholarships',
    title: 'Annual Tuition Fee Schedule by Academic Discipline (2026-2027)',
    keywords: ['fees', 'tuition', 'cost', 'annual fee', 'semester fee', 'installments', 'payment plan', 'all courses'],
    content: 'Annual Tuition Fees: • B.Tech CSE/AI: ₹2,75,000/yr | • BCA Cloud/AI: ₹1,40,000/yr | • MCA Big Data: ₹1,80,000/yr | • MBA Tech Leadership: ₹4,20,000/yr | • BBA Marketing: ₹1,60,000/yr | • B.Pharm: ₹1,95,000/yr | • B.Com (Hons): ₹1,20,000/yr | • BA/BBA LLB: ₹2,10,000/yr | • B.Sc Biotech: ₹1,30,000/yr. Flexible 3-installment semester payments or 0% interest monthly EMI available.',
    lastUpdated: '2026-08-25',
    tags: ['Tuition', 'Fee Schedule', 'All Programs']
  },
  {
    id: 'kb-fee-02',
    category: 'fees_scholarships',
    categoryName: 'Fees & Scholarships',
    title: 'Merit, Sports & Need-Based Scholarships (Up to 100% Tuition Waiver)',
    keywords: ['scholarship', 'waiver', 'merit', 'financial aid', 'sports quota', 'women in tech', 'concession'],
    content: 'AIHT awards over ₹5.5 Crores in scholarships across all streams: 1) Chairman Merit Scholarship: 75% tuition waiver for >95% in 10+2; 50% for 90-94.9%. 2) Women in STEM & Tech: 25% waiver for all 4 years. 3) Single Girl Child Grant: ₹25,000/year. 4) Sports Quota: 30-100% waiver for state/national medalists.',
    lastUpdated: '2026-08-22',
    tags: ['Scholarships', 'Financial Aid', 'Merit']
  },
  {
    id: 'kb-adm-01',
    category: 'admission_eligibility',
    categoryName: 'Admission & Eligibility',
    title: 'Universal Admission Process, Entrance Deadlines & Counseling 2026',
    keywords: ['admission', 'apply', 'deadline', 'dates', 'entrance exam', 'cut off', 'counseling', 'documents', 'registration'],
    content: 'Round 2 Admissions are currently OPEN for all undergraduate and postgraduate programs. Deadline: October 15, 2026. 4-Step Process: 1) Submit Online Form (Application fee ₹1,200). 2) Upload qualifying 10+2 / Graduation marksheets & Scorecards. 3) Merit list declaration within 72 hours. 4) Attend Online / On-Campus Counseling and confirm seat with token fee.',
    lastUpdated: '2026-08-28',
    tags: ['Admissions', 'Deadlines', 'Process']
  },
  {
    id: 'kb-fac-01',
    category: 'timings_facilities',
    categoryName: 'Timings, Location & Facilities',
    title: 'Campus Hostels, Dining, Sports Complex & Transport Network',
    keywords: ['hostel', 'accommodation', 'rooms', 'food', 'mess', 'dining', 'wifi', 'gym', 'sports', 'hospital', 'bus'],
    content: 'Hostels: 6 AC/Non-AC student towers with biometric security. Twin Sharing AC: ₹1,10,000/yr; Single AC: ₹1,45,000/yr (includes 4 daily meals, high-speed Wi-Fi, laundry). Sports: Olympic-size swimming pool, indoor badminton, football ground, gym. Transportation: 24 AC bus routes covering the metropolitan area.',
    lastUpdated: '2026-08-14',
    tags: ['Hostel', 'Campus Facilities', 'Transport']
  },
  {
    id: 'kb-faq-01',
    category: 'faqs_policies',
    categoryName: 'FAQs & Policies',
    title: 'University Placement Statistics, Top Recruiters & Highest CTC',
    keywords: ['placement', 'jobs', 'recruitment', 'package', 'salary', 'highest package', 'average package', 'companies', 'ctc'],
    content: '2025-2026 Placement Report: Overall placement rate: 96.4%. Highest International CTC: ₹54.2 LPA (Engineering/AI); Highest Management CTC: ₹32 LPA; Highest BCA/MCA CTC: ₹24.5 LPA. Over 280 marquee recruiters including Google, Amazon, Microsoft, Deloitte, Goldman Sachs, Sun Pharma, and ICICI Bank.',
    lastUpdated: '2026-08-26',
    tags: ['Placements', 'Careers', 'Recruiters']
  }
];

// Initial Seed Caller / Student CRM Directory across all streams
const initialStudents: CallerProfile[] = [
  {
    id: 'stu-101',
    name: 'Aarav Mehta',
    phone: '+1 (555) 234-8901',
    email: 'aarav.mehta99@gmail.com',
    role: 'Student',
    interestProgram: 'B.Tech Computer Science & AI',
    location: 'Seattle, WA',
    applicationStatus: 'Counseling Scheduled',
    highSchoolScore: '94.2% PCM',
    notes: 'Inquired about GPU computing lab, merit scholarship eligibility, and hostel twin sharing.',
    createdAt: '2026-08-15T10:00:00Z',
    totalCallsCount: 3,
    lastContactedAt: '2026-08-30T14:15:00Z'
  },
  {
    id: 'stu-102',
    name: 'Ananya Sharma',
    phone: '+1 (555) 345-6789',
    email: 'ananya.s@outlook.com',
    role: 'Student',
    interestProgram: 'Bachelor of Computer Applications (BCA)',
    location: 'Austin, TX',
    applicationStatus: 'Fee Pending',
    highSchoolScore: '89.5% Aggregate',
    notes: 'Called regarding BCA semester fee installment plans and hostel dining facilities.',
    createdAt: '2026-08-18T11:30:00Z',
    totalCallsCount: 2,
    lastContactedAt: '2026-08-31T09:20:00Z'
  },
  {
    id: 'stu-103',
    name: 'Rohan Deshmukh',
    phone: '+1 (555) 456-7890',
    email: 'rohan.deshmukh@yahoo.com',
    role: 'Student',
    interestProgram: 'MBA in Tech Leadership & Fintech',
    location: 'Chicago, IL',
    applicationStatus: 'Application Submitted',
    highSchoolScore: 'CAT 91.4%ile • B.Tech 8.4 CGPA',
    notes: 'Requested brochure and Singapore immersion module details.',
    createdAt: '2026-08-20T16:45:00Z',
    totalCallsCount: 1,
    lastContactedAt: '2026-08-28T16:45:00Z'
  },
  {
    id: 'stu-104',
    name: 'Sneha Patel',
    phone: '+1 (555) 789-0123',
    email: 'sneha.patel@gmail.com',
    role: 'Student',
    interestProgram: 'Bachelor of Pharmacy (B.Pharm)',
    location: 'San Jose, CA',
    applicationStatus: 'New Inquiry',
    highSchoolScore: '88% PCB',
    notes: 'Inquired regarding PCI approval, hospital internship tie-ups, and lab facilities.',
    createdAt: '2026-08-24T12:10:00Z',
    totalCallsCount: 1,
    lastContactedAt: '2026-08-29T11:00:00Z'
  },
  {
    id: 'stu-105',
    name: 'Vikram Malhotra',
    phone: '+1 (555) 890-1234',
    email: 'vikram.m@gmail.com',
    role: 'Parent',
    interestProgram: 'BA LLB 5-Year Integrated Law',
    location: 'Dallas, TX',
    applicationStatus: 'Documents Pending',
    highSchoolScore: 'CLAT 86%ile',
    notes: 'Parent called to verify campus security, hostel curfew, and moot court competitions.',
    createdAt: '2026-08-26T15:00:00Z',
    totalCallsCount: 2,
    lastContactedAt: '2026-08-31T17:30:00Z'
  }
];

// Initial Seed Call History Records
const initialCalls: CallRecord[] = [
  {
    id: 'call-rec-901',
    callDirection: 'inbound',
    callerId: 'stu-101',
    callerName: 'Aarav Mehta',
    callerPhone: '+1 (555) 234-8901',
    callerRole: 'Student',
    interestProgram: 'B.Tech Computer Science & AI',
    startTime: '2026-08-30T14:18:12Z',
    endTime: '2026-08-30T14:22:04Z',
    durationSeconds: 232,
    status: 'completed',
    language: 'English (US)',
    primaryIntent: 'Fees & Scholarships',
    intentList: ['Fees', 'Scholarships', 'Admission Dates'],
    sentimentAverage: 'Happy',
    sentimentScore: 0.85,
    transcript: [
      {
        id: 't-1',
        sender: 'agent',
        text: 'Thank you for calling Apex Institute Admissions! I am Maya, your AI Education Advisor. How may I help you with your academic goals today?',
        timestamp: '14:18:14',
        sentiment: 'Neutral',
        detectedIntent: 'Greeting'
      },
      {
        id: 't-2',
        sender: 'user',
        text: 'Hi Maya, I scored 94.2% in my 12th PCM. Can you tell me if I qualify for the Chairman Merit Scholarship for B.Tech CSE?',
        timestamp: '14:18:32',
        sentiment: 'Inquisitive',
        detectedIntent: 'Scholarship Eligibility'
      },
      {
        id: 't-3',
        sender: 'agent',
        text: 'Congratulations on your fantastic score of 94.2%! Yes, with over 90% in 10+2 PCM, you are eligible for the 50% Apex Chairman Merit Tuition Waiver on your B.Tech CSE tuition of ₹2,75,000/year.',
        timestamp: '14:18:48',
        sentiment: 'Happy',
        detectedIntent: 'Scholarship Confirmation',
        sourcesRetrieved: ['Merit & Need-Based Scholarships Program', 'Annual Tuition Fee Structure']
      },
      {
        id: 't-4',
        sender: 'user',
        text: 'That is awesome! Could you send the scholarship verification checklist to my WhatsApp?',
        timestamp: '14:19:15',
        sentiment: 'Happy',
        detectedIntent: 'Integration Request'
      },
      {
        id: 't-5',
        sender: 'agent',
        text: 'I have dispatched the official scholarship criteria and application link directly to your registered number on WhatsApp. You will receive it momentarily!',
        timestamp: '14:19:28',
        sentiment: 'Happy',
        detectedIntent: 'Dispatched Action'
      }
    ],
    summary: 'Student Aarav verified scholarship eligibility for B.Tech CSE with 94.2% PCM score. AI confirmed 50% tuition waiver eligibility and dispatched WhatsApp checklist.',
    keyActionItems: ['Dispatched scholarship portal link via WhatsApp', 'Booked counseling slot for September 3rd'],
    disposition: 'Counseling Scheduled',
    actionDispatched: {
      type: 'whatsapp',
      recipient: '+1 (555) 234-8901',
      sentAt: '2026-08-30T14:19:30Z',
      details: 'Scholarship application portal credentials and fee waiver breakdown sent.'
    }
  },
  {
    id: 'call-rec-902',
    callDirection: 'inbound',
    callerId: 'stu-103',
    callerName: 'Robert Davis',
    callerPhone: '+1 (555) 789-0123',
    callerRole: 'Parent',
    interestProgram: 'B.Des User Experience Design',
    startTime: '2026-08-28T11:06:00Z',
    endTime: '2026-08-28T11:10:45Z',
    durationSeconds: 285,
    status: 'handed_off',
    language: 'English (US)',
    primaryIntent: 'Hostel Facilities & Security',
    intentList: ['Hostel Accommodation', 'Campus Security', 'Human Handoff'],
    sentimentAverage: 'Neutral',
    sentimentScore: 0.2,
    transcript: [
      {
        id: 't-10',
        sender: 'agent',
        text: 'Welcome to Apex Institute! How can I assist you with admissions or campus life today?',
        timestamp: '11:06:02',
        sentiment: 'Neutral'
      },
      {
        id: 't-11',
        sender: 'user',
        text: 'Hello, my daughter Emily applied for B.Des. We live out of state, so I need to speak directly with the Dean of Student Residence regarding medical special diet accommodations.',
        timestamp: '11:06:25',
        sentiment: 'Confused'
      },
      {
        id: 't-12',
        sender: 'agent',
        text: 'I completely understand Mr. Davis. Our girls residential towers offer dedicated medical support and customized dietary plans. Since this requires specific dietary clearance, let me immediately transfer you to our Senior Student Affairs Counselor with your complete details.',
        timestamp: '11:06:40',
        sentiment: 'Neutral',
        detectedIntent: 'Human_Handoff'
      }
    ],
    handoffDetails: {
      triggered: true,
      reason: 'Parent requested customized medical diet & residence supervisor consultation',
      priority: 'high',
      transferredToAgent: 'Senior Counselor Sarah Jenkins',
      transferredAt: '2026-08-28T11:06:45Z',
      resolvedBy: 'Sarah Jenkins'
    },
    summary: 'Parent inquired about specialized hostel medical diet for B.Des candidate. AI smoothly transferred call to Senior Counselor Sarah Jenkins.',
    keyActionItems: ['Transferred to Human Counselor Desk', 'Medical diet policy PDF emailed'],
    disposition: 'Campus Visit Scheduled'
  }
];

// Initial Seed Handoff Tickets
const initialHandoffs: HandoffTicket[] = [
  {
    id: 'ticket-501',
    callId: 'call-rec-902',
    callerName: 'Robert Davis',
    callerPhone: '+1 (555) 789-0123',
    callerRole: 'Parent',
    interestProgram: 'B.Des User Experience Design',
    reason: 'Parent requested customized medical diet & residence supervisor consultation',
    priority: 'high',
    status: 'resolved',
    assignedCounselor: 'Sarah Jenkins (Student Affairs)',
    requestedAt: '2026-08-28T11:06:45Z',
    summary: 'Parent wants clarification on specialized gluten-free dining and 24/7 campus clinic protocols.',
    transcriptSnapshot: initialCalls[1].transcript,
    liveNotes: 'Spoke with Mr. Davis. Sent medical dietary form and invited for weekend campus walkthrough.'
  }
];

// Initial Voice & Agent Settings
const initialSettings: AgentVoiceSettings = {
  voiceName: 'Google US English / Maya (Natural)',
  speed: 1.0,
  pitch: 1.0,
  selectedLanguage: 'en-US',
  greetingMessage: 'Hello! Thank you for calling Apex Institute Admissions & Counseling. I am Maya, your AI Voice Advisor. How can I help you today with admissions, courses, fees, or campus life?',
  autoAnswerDelaySec: 1.2,
  handoffFrustrationThreshold: 0.45,
  enableAudioVisualizer: true,
  institutionName: 'Apex Institute of Higher Education & Technology'
};

// In-Memory Database Store with getters and mutations
class DatabaseStore {
  private colleges: CollegeAccount[] = [...initialColleges];
  private admin: AdminAccount = { ...initialAdmin };
  private knowledgeBase: KnowledgeBaseItem[] = [...initialKnowledgeBase];
  private students: CallerProfile[] = [...initialStudents];
  private calls: CallRecord[] = [...initialCalls];
  private handoffs: HandoffTicket[] = [...initialHandoffs];
  private settings: AgentVoiceSettings = { ...initialSettings };

  // ----------------------------------------------------
  // Authentication & Multi-College Operations
  // ----------------------------------------------------

  getPlanConfigs(): Record<SubscriptionTier, PlanConfig> {
    return PLAN_CONFIGS;
  }

  getColleges(): CollegeAccount[] {
    // Return colleges without exposing plain password in response if sensitive
    return this.colleges.map(c => ({
      ...c,
      password: c.password ? '••••••••' : undefined
    }));
  }

  getCollegeById(id: string): CollegeAccount | undefined {
    return this.colleges.find(c => c.id === id);
  }

  registerCollege(data: {
    collegeName: string;
    collegeCode: string;
    email: string;
    password?: string;
    affiliation: string;
    phone: string;
    city: string;
    state: string;
    website?: string;
    contactPerson: string;
    contactDesignation?: string;
    departments?: string[];
    subscriptionTier?: SubscriptionTier;
    billingCycle?: BillingCycle;
  }): { success: boolean; college?: CollegeAccount; error?: string } {
    // Check if email or collegeCode already registered
    const existingEmail = this.colleges.find(c => c.email.toLowerCase() === data.email.toLowerCase());
    if (existingEmail) {
      return { success: false, error: 'A college with this official email is already registered.' };
    }

    const existingCode = this.colleges.find(c => c.collegeCode.toLowerCase() === data.collegeCode.toLowerCase());
    if (existingCode) {
      return { success: false, error: 'A college with this code is already registered.' };
    }

    const tier: SubscriptionTier = data.subscriptionTier || 'Pro';
    const cycle: BillingCycle = data.billingCycle || 'monthly';
    const plan = PLAN_CONFIGS[tier];
    const amountPaid = cycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    const renewal = new Date();
    if (cycle === 'yearly') {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }

    const newCollege: CollegeAccount = {
      id: `col-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      collegeName: data.collegeName,
      collegeCode: data.collegeCode.toUpperCase(),
      email: data.email.toLowerCase(),
      password: data.password || 'college123',
      affiliation: data.affiliation || 'Approved by State University',
      phone: data.phone,
      city: data.city,
      state: data.state,
      website: data.website || `https://${data.collegeCode.toLowerCase()}.edu`,
      status: 'Pending_Approval', // Requires Super Admin approval to activate
      registeredAt: new Date().toISOString(),
      departments: data.departments && data.departments.length > 0
        ? data.departments
        : [
            'Engineering & Tech (B.Tech)',
            'Computer Applications (BCA & MCA)',
            'Management (BBA & MBA)',
            'Commerce & Banking (B.Com)',
            'Pharmacy (B.Pharm)'
          ],
      totalStudentsCount: 0,
      totalCallsCount: 0,
      contactPerson: data.contactPerson,
      contactDesignation: data.contactDesignation || 'Admissions Counselor',
      subscriptionTier: tier,
      billingCycle: cycle,
      monthlyCreditAllowance: plan.monthlyCredits,
      creditsRemaining: plan.monthlyCredits,
      creditsUsed: 0,
      subscriptionRenewsAt: renewal.toISOString(),
      amountPaid
    };

    this.colleges.unshift(newCollege);
    return { success: true, college: newCollege };
  }

  authenticateCollege(emailOrCode: string, password?: string): { success: boolean; college?: CollegeAccount; error?: string } {
    const cleanQuery = emailOrCode.trim().toLowerCase();
    const college = this.colleges.find(
      c => c.email.toLowerCase() === cleanQuery || c.collegeCode.toLowerCase() === cleanQuery
    );

    if (!college) {
      return { success: false, error: 'No college found with this email or college code.' };
    }

    if (college.status === 'Suspended') {
      return { success: false, error: 'This college account is currently suspended. Please contact Super Admin.' };
    }

    if (college.status === 'Pending_Approval') {
      return {
        success: false,
        error: 'Your institutional registration is currently pending Super Admin approval. You will receive activation clearance shortly.'
      };
    }

    // In demo environment, check password or accept demo bypass if password matches
    if (college.password && password && college.password !== password) {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    return { success: true, college };
  }

  authenticateAdmin(email: string, password?: string): { success: boolean; admin?: AdminAccount; error?: string } {
    if (email.toLowerCase() === 'admin@eduvoice.ac.in' || email.toLowerCase() === 'admin') {
      if (password && password !== 'admin123' && password !== 'admin') {
        return { success: false, error: 'Invalid admin credentials.' };
      }
      this.admin.lastLoginAt = new Date().toISOString();
      return { success: true, admin: this.admin };
    }
    return { success: false, error: 'Invalid administrator email.' };
  }

  updateCollegeStatus(id: string, status: 'Active' | 'Pending_Approval' | 'Suspended' | 'Expired'): CollegeAccount | null {
    const college = this.colleges.find(c => c.id === id);
    if (!college) return null;
    college.status = status;
    return college;
  }

  approveCollegeSubscription(
    id: string,
    tier?: SubscriptionTier,
    billingCycle?: BillingCycle,
    customCredits?: number
  ): CollegeAccount | null {
    const college = this.colleges.find(c => c.id === id);
    if (!college) return null;

    if (tier) college.subscriptionTier = tier;
    if (billingCycle) college.billingCycle = billingCycle;

    const plan = PLAN_CONFIGS[college.subscriptionTier || 'Pro'];
    const creditsToAllocate = customCredits !== undefined ? customCredits : plan.monthlyCredits;

    college.monthlyCreditAllowance = creditsToAllocate;
    college.creditsRemaining = creditsToAllocate;
    college.status = 'Active';
    college.approvedAt = new Date().toISOString();
    college.approvedBy = 'EduVoice Super Admin';

    const renewal = new Date();
    if (college.billingCycle === 'yearly') {
      renewal.setFullYear(renewal.getFullYear() + 1);
    } else {
      renewal.setMonth(renewal.getMonth() + 1);
    }
    college.subscriptionRenewsAt = renewal.toISOString();

    return college;
  }

  refillCollegeCredits(id: string, amount: number, note?: string): CollegeAccount | null {
    const college = this.colleges.find(c => c.id === id);
    if (!college) return null;

    college.creditsRemaining = (college.creditsRemaining || 0) + amount;
    return college;
  }

  deductCollegeCredits(id: string, minutes: number = 1): { success: boolean; creditsRemaining: number; error?: string } {
    const college = this.colleges.find(c => c.id === id);
    if (!college) {
      return { success: true, creditsRemaining: 9999 };
    }

    if (college.creditsRemaining <= 0) {
      return {
        success: false,
        creditsRemaining: 0,
        error: 'Monthly voice credits exhausted. Please contact administrator to refill credits.'
      };
    }

    college.creditsRemaining = Math.max(0, college.creditsRemaining - minutes);
    college.creditsUsed = (college.creditsUsed || 0) + minutes;
    college.totalCallsCount = (college.totalCallsCount || 0) + 1;

    return { success: true, creditsRemaining: college.creditsRemaining };
  }

  updateCollegePlan(id: string, tier: SubscriptionTier, billingCycle: BillingCycle): CollegeAccount | null {
    const college = this.colleges.find(c => c.id === id);
    if (!college) return null;

    const plan = PLAN_CONFIGS[tier];
    college.subscriptionTier = tier;
    college.billingCycle = billingCycle;
    college.monthlyCreditAllowance = plan.monthlyCredits;
    college.creditsRemaining = Math.max(college.creditsRemaining, plan.monthlyCredits);
    college.amountPaid = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;

    return college;
  }

  // Knowledge Base methods
  getKnowledgeBase(query?: string, category?: string): KnowledgeBaseItem[] {
    let list = this.knowledgeBase;
    if (category && category !== 'all') {
      list = list.filter(k => k.category === category);
    }
    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        k =>
          k.title.toLowerCase().includes(q) ||
          k.content.toLowerCase().includes(q) ||
          k.keywords.some(kw => kw.toLowerCase().includes(q)) ||
          k.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    return list;
  }

  addKnowledgeItem(item: Omit<KnowledgeBaseItem, 'id' | 'lastUpdated'>): KnowledgeBaseItem {
    const newItem: KnowledgeBaseItem = {
      ...item,
      id: `kb-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    this.knowledgeBase.unshift(newItem);
    return newItem;
  }

  updateKnowledgeItem(id: string, updates: Partial<KnowledgeBaseItem>): KnowledgeBaseItem | null {
    const idx = this.knowledgeBase.findIndex(k => k.id === id);
    if (idx === -1) return null;
    this.knowledgeBase[idx] = {
      ...this.knowledgeBase[idx],
      ...updates,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    return this.knowledgeBase[idx];
  }

  deleteKnowledgeItem(id: string): boolean {
    const initialLen = this.knowledgeBase.length;
    this.knowledgeBase = this.knowledgeBase.filter(k => k.id !== id);
    return this.knowledgeBase.length < initialLen;
  }

  // Students CRM methods
  getStudents(search?: string, status?: string): CallerProfile[] {
    let list = this.students;
    if (status && status !== 'all') {
      list = list.filter(s => s.applicationStatus === status);
    }
    if (search && search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        st =>
          st.name.toLowerCase().includes(s) ||
          st.phone.toLowerCase().includes(s) ||
          st.email.toLowerCase().includes(s) ||
          st.interestProgram.toLowerCase().includes(s)
      );
    }
    return list;
  }

  getStudentById(id: string): CallerProfile | undefined {
    return this.students.find(s => s.id === id);
  }

  getStudentByPhone(phone: string): CallerProfile | undefined {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return this.students.find(s => s.phone.replace(/[^0-9]/g, '').includes(cleanPhone) || cleanPhone.includes(s.phone.replace(/[^0-9]/g, '')));
  }

  addStudent(student: Omit<CallerProfile, 'id' | 'createdAt' | 'totalCallsCount'>): CallerProfile {
    const newStudent: CallerProfile = {
      ...student,
      id: `stu-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      totalCallsCount: 0
    };
    this.students.unshift(newStudent);
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<CallerProfile>): CallerProfile | null {
    const idx = this.students.findIndex(s => s.id === id);
    if (idx === -1) return null;
    this.students[idx] = { ...this.students[idx], ...updates };
    return this.students[idx];
  }

  incrementStudentCalls(id: string) {
    const student = this.students.find(s => s.id === id);
    if (student) {
      student.totalCallsCount = (student.totalCallsCount || 0) + 1;
      student.lastContactedAt = new Date().toISOString();
    }
  }

  // Call Records methods
  getCalls(filters?: { status?: string; search?: string }): CallRecord[] {
    let list = this.calls;
    if (filters?.status && filters.status !== 'all') {
      list = list.filter(c => c.status === filters.status);
    }
    if (filters?.search && filters.search.trim()) {
      const s = filters.search.toLowerCase();
      list = list.filter(
        c =>
          c.callerName.toLowerCase().includes(s) ||
          c.callerPhone.toLowerCase().includes(s) ||
          c.primaryIntent.toLowerCase().includes(s) ||
          c.summary.toLowerCase().includes(s)
      );
    }
    return list;
  }

  getCallById(id: string): CallRecord | undefined {
    return this.calls.find(c => c.id === id);
  }

  saveCallRecord(record: CallRecord): CallRecord {
    const idx = this.calls.findIndex(c => c.id === record.id);
    if (idx >= 0) {
      this.calls[idx] = record;
    } else {
      this.calls.unshift(record);
    }
    if (record.callerId) {
      this.incrementStudentCalls(record.callerId);
    }
    return record;
  }

  // Handoff Tickets methods
  getHandoffs(status?: string): HandoffTicket[] {
    if (status && status !== 'all') {
      return this.handoffs.filter(h => h.status === status);
    }
    return this.handoffs;
  }

  createHandoffTicket(ticket: Omit<HandoffTicket, 'id' | 'requestedAt'>): HandoffTicket {
    const newTicket: HandoffTicket = {
      ...ticket,
      id: `ticket-${Date.now().toString(36)}`,
      requestedAt: new Date().toISOString()
    };
    this.handoffs.unshift(newTicket);
    return newTicket;
  }

  updateHandoffTicket(id: string, updates: Partial<HandoffTicket>): HandoffTicket | null {
    const idx = this.handoffs.findIndex(h => h.id === id);
    if (idx === -1) return null;
    this.handoffs[idx] = { ...this.handoffs[idx], ...updates };
    return this.handoffs[idx];
  }

  // Settings
  getSettings(): AgentVoiceSettings {
    return this.settings;
  }

  updateSettings(updates: Partial<AgentVoiceSettings>): AgentVoiceSettings {
    this.settings = { ...this.settings, ...updates };
    return this.settings;
  }

  // Analytics Computation
  getAnalytics(): AnalyticsSummary {
    const totalCalls = this.calls.length;
    const inboundCalls = this.calls.filter(c => c.callDirection === 'inbound').length;
    const outboundCalls = this.calls.filter(c => c.callDirection === 'outbound').length;
    const completedCalls = this.calls.filter(c => c.status === 'completed').length;
    const handedOffCalls = this.calls.filter(c => c.status === 'handed_off' || c.handoffDetails?.triggered).length;

    const totalSeconds = this.calls.reduce((sum, c) => sum + (c.durationSeconds || 0), 0);
    const avgDurationSeconds = totalCalls > 0 ? Math.round(totalSeconds / totalCalls) : 0;
    const resolutionRatePercent = totalCalls > 0 ? Math.round(((totalCalls - handedOffCalls) / totalCalls) * 100) : 94;
    const handoffRatePercent = totalCalls > 0 ? Math.round((handedOffCalls / totalCalls) * 100) : 6;

    const sentimentValues = this.calls.map(c => c.sentimentScore || 0);
    const avgSentimentScore = sentimentValues.length > 0 
      ? Number((sentimentValues.reduce((a, b) => a + b, 0) / sentimentValues.length).toFixed(2))
      : 0.72;

    // Intent counts
    const intentMap: Record<string, number> = {};
    for (const call of this.calls) {
      const p = call.primaryIntent || 'General Admission Query';
      intentMap[p] = (intentMap[p] || 0) + 1;
      if (call.intentList) {
        for (const it of call.intentList) {
          if (it !== p) {
            intentMap[it] = (intentMap[it] || 0) + 1;
          }
        }
      }
    }

    const intentBreakdown = Object.entries(intentMap)
      .map(([intent, count]) => ({
        intent,
        count,
        percentage: Math.round((count / (totalCalls || 1)) * 100)
      }))
      .sort((a, b) => b.count - a.count);

    // Sentiment breakdown
    const sentMap: Record<string, number> = {
      Happy: 0,
      Inquisitive: 0,
      Neutral: 0,
      Confused: 0,
      Frustrated: 0,
      Angry: 0
    };
    for (const call of this.calls) {
      const s = call.sentimentAverage || 'Happy';
      sentMap[s] = (sentMap[s] || 0) + 1;
    }
    const sentimentBreakdown = Object.entries(sentMap).map(([sentiment, count]) => ({
      sentiment: sentiment as any,
      count,
      percentage: totalCalls > 0 ? Math.round((count / totalCalls) * 100) : 0
    }));

    // Hourly call volume
    const hourlyCallVolume = [
      { hour: '08:00', calls: 14 },
      { hour: '10:00', calls: 42 },
      { hour: '12:00', calls: 68 },
      { hour: '14:00', calls: 85 },
      { hour: '16:00', calls: 54 },
      { hour: '18:00', calls: 31 },
      { hour: '20:00', calls: 19 }
    ];

    const recentHandoffsCount = this.handoffs.filter(h => h.status === 'pending').length;

    return {
      totalCalls: totalCalls || 148,
      inboundCalls: inboundCalls || 112,
      outboundCalls: outboundCalls || 36,
      avgDurationSeconds: avgDurationSeconds || 215,
      resolutionRatePercent: resolutionRatePercent || 94,
      handoffRatePercent: handoffRatePercent || 6,
      avgSentimentScore: avgSentimentScore || 0.76,
      avgAnswerSpeedSec: 1.4,
      intentBreakdown: intentBreakdown.length > 0 ? intentBreakdown : [
        { intent: 'Fees Structure & Installments', count: 52, percentage: 35 },
        { intent: 'Admission & Eligibility', count: 44, percentage: 30 },
        { intent: 'Scholarships & Merit Aid', count: 32, percentage: 22 },
        { intent: 'Hostels & Facilities', count: 20, percentage: 13 }
      ],
      sentimentBreakdown,
      hourlyCallVolume,
      recentHandoffsCount
    };
  }
}

export const db = new DatabaseStore();
