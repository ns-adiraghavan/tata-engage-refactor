export const VIKRAM_NAIR = {
  firstName: "Vikram",
  lastName: "Nair",
  email: "vikram.nair@tata.com",
  role: "platform_admin",
  designation: "TSG Platform Admin",
  city: "Mumbai",
  country: "India",
  stats: {
    totalUsers: 12540,
    activeNgos: 450,
    openProjects: 85,
    pendingActions: 12
  }
};

export const COMPANY_DOMAINS = [
  { id: 1, company: "Tata Consultancy Services", domain: "tcs.com", status: "Verified" },
  { id: 2, company: "Tata Steel", domain: "tatasteel.com", status: "Verified" },
  { id: 3, company: "Tata Motors", domain: "tatamotors.com", status: "Verified" },
  { id: 4, company: "Titan", domain: "titan.co.in", status: "Verified" },
  { id: 5, company: "Tata Power", domain: "tatapower.com", status: "Verified" },
];

export const VOLUNTEER_RECORDS = [
  { id: 1, name: "Priya Sharma", email: "priya.sharma@tata.com", company: "TCS", type: "Employee", status: "Active" },
  { id: 2, name: "Amit Verma", email: "amit.verma@tata.com", company: "Tata Steel", type: "Employee", status: "Active" },
  { id: 3, name: "Arun Kumar", email: "arun.k@gmail.com", company: "TCS (Ex-Employee)", type: "Retiree", status: "Pending" },
];

export const PERMISSION_MATRIX = {
  volunteer: { tvw: "Read", proengage: "Write", reports: "Read", cms: "None", certificates: "Read" },
  spoc: { tvw: "Write", proengage: "Read", reports: "Write", cms: "None", certificates: "Write" },
  ngo: { tvw: "None", proengage: "Write", reports: "Read", cms: "None", certificates: "None" },
  sub_admin: { tvw: "Write", proengage: "Write", reports: "Write", cms: "Write", certificates: "Write" },
};

export const ROHAN_DESAI = {
  firstName: "Rohan",
  lastName: "Desai",
  email: "rohan.desai@tcs.com",
  role: "corporate_spoc",
  company: "Tata Consultancy Services",
  designation: "Corporate SPOC",
  city: "Mumbai",
  country: "India",
  tier: "Corporate SPOC",
  stats: {
    totalVolunteers: 4520,
    activeProEngage: 124,
    tvwEvents: 45,
    pendingApprovals: 18
  },
  orientationProgress: 2,
  totalOrientationModules: 5
};

export const SPOC_DIRECTORY = [
  { id: 1, name: "Rohan Desai", role: "Corporate SPOC", company: "TCS", geography: "Global", status: "Active", lastActive: "2 mins ago", email: "rohan.desai@tcs.com" },
  { id: 2, name: "Anjali Gupta", role: "Regional SPOC", company: "TCS", geography: "North India", status: "Active", lastActive: "1 hour ago", email: "anjali.g@tcs.com" },
  { id: 3, name: "Vikram Malhotra", role: "Regional SPOC", company: "TCS", geography: "West India", status: "Inactive", lastActive: "3 days ago", email: "v.malhotra@tcs.com" },
  { id: 4, name: "Suresh Menon", role: "Corporate SPOC", company: "Tata Steel", geography: "Global", status: "Active", lastActive: "10 mins ago", email: "suresh.m@tatasteel.com" },
  { id: 5, name: "Meera Reddy", role: "Regional SPOC", company: "Tata Motors", geography: "South India", status: "Active", lastActive: "5 hours ago", email: "meera.r@tatamotors.com" },
  { id: 6, name: "Karan Johar", role: "Regional SPOC", company: "TCS", geography: "East India", status: "Active", lastActive: "1 day ago", email: "karan.j@tcs.com" },
  { id: 7, name: "Aditi Rao", role: "Corporate SPOC", company: "Tata Motors", geography: "Global", status: "Active", lastActive: "30 mins ago", email: "aditi.r@tatamotors.com" },
  { id: 8, name: "Rajesh Khanna", role: "Regional SPOC", company: "Tata Steel", geography: "UK & Europe", status: "Active", lastActive: "2 hours ago", email: "rajesh.k@tatasteel.com" },
];

export const PENDING_APPROVALS_DATA = [
  { id: 1, name: "Arun Kumar", type: "Retiree", registeredDate: "2026-04-01", status: "Pending", email: "arun.k@gmail.com", company: "TCS (Ex-Employee)", documents: "Retirement_Letter.pdf" },
  { id: 2, name: "Sunita Williams", type: "No-email Employee", registeredDate: "2026-04-02", status: "Pending", email: "sunita.w@yahoo.com", company: "TCS", documents: "Employee_ID_Card.jpg" },
  { id: 3, name: "David Miller", type: "Retiree", registeredDate: "2026-04-03", status: "Pending", email: "david.m@outlook.com", company: "TCS (Ex-Employee)", documents: "Pension_Doc.pdf" },
  { id: 4, name: "Sarah Connor", type: "No-email Employee", registeredDate: "2026-03-25", status: "Approved", email: "sarah.c@gmail.com", company: "TCS", documents: "ID_Proof.pdf" },
  { id: 5, name: "John Doe", type: "Retiree", registeredDate: "2026-03-20", status: "Approved", email: "john.doe@gmail.com", company: "TCS (Ex-Employee)", documents: "Retiree_Card.pdf" },
  { id: 7, name: "Kyle Reese", type: "No-email Employee", registeredDate: "2026-03-15", status: "Rejected", email: "kyle.r@gmail.com", company: "TCS", documents: "Invalid_ID.jpg", rejectionReason: "Document unclear" },
];

export const TCS_TVW_EVENTS = [
  {
    id: 1,
    title: "Beach Clean-up Drive",
    type: "Beach Clean-up",
    date: "2026-04-15",
    time: "08:00 AM",
    venue: "Juhu Beach, Mumbai",
    mode: "In-Person",
    capacity: "45/60",
    status: "Upcoming",
    region: "West India",
    volunteeringHours: 4,
    openToAll: true,
    volunteers: [
      { id: 101, name: "Amit Shah", email: "amit.s@tcs.com", hours: 0, confirmed: false },
      { id: 102, name: "Sneha Patil", email: "sneha.p@tcs.com", hours: 0, confirmed: false },
      { id: 103, name: "Rahul Sharma", email: "rahul.s@tata.com", hours: 0, confirmed: false },
    ]
  },
  {
    id: 2,
    title: "Digital Literacy Workshop",
    type: "Teaching",
    date: "2026-04-10",
    time: "10:00 AM",
    venue: "Virtual (Microsoft Teams)",
    mode: "Virtual",
    capacity: "25/30",
    status: "Live",
    region: "Global",
    volunteeringHours: 2,
    openToAll: false,
    volunteers: [
      { id: 104, name: "Priya Das", email: "priya.d@tata.com", hours: 0, confirmed: false },
      { id: 105, name: "Vikram Singh", email: "vikram.s@tata.com", hours: 0, confirmed: false },
    ]
  },
  {
    id: 3,
    title: "Tree Plantation Marathon",
    type: "Tree Plantation",
    date: "2026-03-20",
    time: "07:00 AM",
    venue: "TCS Siruseri Campus, Chennai",
    mode: "In-Person",
    capacity: "100/100",
    status: "Completed",
    region: "South India",
    volunteeringHours: 6,
    openToAll: true,
    vibeStatus: null,
    volunteers: [
      { id: 106, name: "Ananya Iyer", email: "ananya.i@tata.com", hours: 6, confirmed: true },
      { id: 107, name: "Karan Malhotra", email: "karan.m@tata.com", hours: 6, confirmed: true },
    ]
  }
];

export const PROENGAGE_PIPELINE = [
  { id: 1, name: "Amit Shah", project: "Digital Literacy", ngo: "Pratham", status: "Active", match: 95, lastUpdated: "2 days ago", email: "amit.s@tcs.com", skills: ["Teaching", "IT"], experience: "5 years" },
  { id: 2, name: "Sneha Patil", project: "Financial Literacy", ngo: "Swayam Krishi", status: "Matched", match: 88, lastUpdated: "1 day ago", email: "sneha.p@tcs.com", skills: ["Finance"], experience: "3 years" },
  { id: 3, name: "Rahul Sharma", project: "Water Conservation", ngo: "Arpan", status: "Applied", match: 92, lastUpdated: "5 hours ago", email: "rahul.s@tata.com", skills: ["Engineering"], experience: "7 years" },
  { id: 4, name: "Priya Das", project: "Rural Education", ngo: "Teach For India", status: "Completed", match: 82, lastUpdated: "1 week ago", email: "priya.d@tata.com", skills: ["Marketing"], experience: "4 years" },
  { id: 5, name: "Vikram Singh", project: "Skill Development", ngo: "Skill India", status: "Dropped", match: 78, lastUpdated: "3 days ago", email: "vikram.s@tata.com", skills: ["HR"], experience: "10 years" },
  { id: 6, name: "Ananya Iyer", project: "Women Empowerment", ngo: "SEWA", status: "Active", match: 90, lastUpdated: "12 hours ago", email: "ananya.i@tata.com", skills: ["Legal"], experience: "2 years" },
  { id: 7, name: "Karan Malhotra", project: "Healthcare Support", ngo: "HelpAge India", status: "Paused", match: 85, lastUpdated: "4 days ago", email: "karan.m@tata.com", skills: ["Operations"], experience: "6 years" },
];

export const AT_RISK_VOLUNTEERS: { id: number; name: string; project: string; reason: string; daysInactive: number; severity: string; nudged?: boolean }[] = [
  { id: 1, name: "Rajesh Kumar", project: "Digital Literacy", reason: "No activity in 14 days", daysInactive: 14, severity: "high", nudged: false },
  { id: 2, name: "Meena Gupta", project: "Financial Literacy", reason: "Missed mandatory orientation", daysInactive: 3, severity: "medium", nudged: false },
];

export const OPEN_PROENGAGE_PROJECTS = [
  { id: 101, title: "Tech Mentor for Rural Schools", ngo: "Digital India Foundation", skills: ["Python", "Teaching"], link: "https://proengage.tata.com/apply/101" },
  { id: 102, title: "Financial Auditor for NGO", ngo: "Green Earth", skills: ["Accounting", "Audit"], link: "https://proengage.tata.com/apply/102" },
  { id: 103, title: "Social Media Strategist", ngo: "Animal Rescue", skills: ["Marketing", "Content"], link: "https://proengage.tata.com/apply/103" },
];

export const COMPANY_LEADERBOARD = [
  { rank: 1, name: "Tata Steel", matched: 1420, trend: [40, 50, 60, 80, 100, 120] },
  { rank: 2, name: "TCS", matched: 1240, trend: [30, 45, 55, 70, 90, 110] },
  { rank: 3, name: "Tata Motors", matched: 980, trend: [20, 30, 40, 55, 75, 85] },
  { rank: 4, name: "Titan", matched: 750, trend: [15, 25, 35, 45, 55, 65] },
  { rank: 5, name: "Tata Power", matched: 620, trend: [10, 20, 30, 40, 50, 60] },
  { rank: 6, name: "IHCL (Taj)", matched: 540, trend: [8, 15, 25, 35, 45, 55] },
  { rank: 7, name: "Tata Chemicals", matched: 410, trend: [5, 12, 18, 25, 35, 45] },
  { rank: 8, name: "Tata Communications", matched: 380, trend: [4, 10, 15, 22, 30, 40] },
  { rank: 9, name: "Trent", matched: 310, trend: [3, 8, 12, 18, 25, 32] },
  { rank: 10, name: "Tata Consumer Products", matched: 290, trend: [2, 6, 10, 15, 20, 28] },
];

export const VOLUNTEER_CERTIFICATES = [
  { id: 1, name: "Amit Shah", project: "Digital Literacy", ngo: "Pratham", date: "2026-03-25", status: "Generated" },
  { id: 2, name: "Sneha Patil", project: "Financial Literacy", ngo: "Swayam Krishi", date: "2026-03-28", status: "Generated" },
  { id: 3, name: "Rahul Sharma", project: "Water Conservation", ngo: "Arpan", date: "2026-04-01", status: "Pending" },
  { id: 4, name: "Priya Das", project: "Rural Education", ngo: "Teach For India", date: "2026-03-20", status: "Generated" },
  { id: 5, name: "Ananya Iyer", project: "Women Empowerment", ngo: "SEWA", date: "2026-04-02", status: "Pending Feedback" },
];

export const FEEDBACK_MONITOR_DATA = [
  { id: 1, name: "Karan Malhotra", project: "Healthcare Support", dueDate: "2026-04-01", daysOverdue: 3, reminders: ["T-3 reminder sent"] },
  { id: 2, name: "Vikram Singh", project: "Skill Development", dueDate: "2026-03-30", daysOverdue: 5, reminders: ["T-3 reminder sent", "T-1 reminder sent"] },
  { id: 3, name: "Sunita Williams", project: "Digital Literacy", dueDate: "2026-04-03", daysOverdue: 1, reminders: [] },
];

export const MOCK_APPLICANTS = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul.sharma@tata.com",
    skills: ["Finance", "Excel", "Data Analysis"],
    experience: "5 years in Corporate Finance at Tata Motors",
    languages: ["English", "Hindi", "Marathi"],
    city: "Mumbai",
    availability: "Weekends",
    matchPercentage: 95,
    isReturning: true,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-03-28"
  },
  {
    id: 2,
    name: "Sneha Patil",
    email: "sneha.patil@tcs.com",
    skills: ["Teaching", "Communication", "Marathi"],
    experience: "3 years as Software Engineer, volunteer teacher at local school",
    languages: ["English", "Marathi"],
    city: "Pune",
    availability: "Weekdays (Evenings)",
    matchPercentage: 88,
    isReturning: false,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-03-29"
  },
  {
    id: 3,
    name: "Amit Verma",
    email: "amit.verma@tata.com",
    skills: ["Project Management", "Strategy"],
    experience: "8 years in Operations at Tata Steel",
    languages: ["English", "Hindi"],
    city: "Jamshedpur",
    availability: "Remote",
    matchPercentage: 92,
    isReturning: true,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-03-30"
  },
  {
    id: 4,
    name: "Priya Das",
    email: "priya.das@tata.com",
    skills: ["Digital Marketing", "Content Writing"],
    experience: "4 years in Marketing at Titan",
    languages: ["English", "Bengali"],
    city: "Bangalore",
    availability: "Remote",
    matchPercentage: 82,
    isReturning: false,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-03-31"
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram.s@tata.com",
    skills: ["Finance", "Accounting"],
    experience: "10 years in Audit at Tata Power",
    languages: ["English", "Hindi", "Punjabi"],
    city: "Delhi",
    availability: "Weekends",
    matchPercentage: 98,
    isReturning: true,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-04-01"
  },
  {
    id: 6,
    name: "Ananya Iyer",
    email: "ananya.i@tata.com",
    skills: ["Social Media", "Design"],
    experience: "2 years in Design at Tata Elxsi",
    languages: ["English", "Tamil"],
    city: "Chennai",
    availability: "Remote",
    matchPercentage: 75,
    isReturning: false,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-04-01"
  },
  {
    id: 7,
    name: "Karan Malhotra",
    email: "karan.m@tata.com",
    skills: ["Finance", "Strategy"],
    experience: "6 years in M&A at Tata Sons",
    languages: ["English", "Hindi"],
    city: "Mumbai",
    availability: "Weekends",
    matchPercentage: 94,
    isReturning: false,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-04-02"
  },
  {
    id: 8,
    name: "Meera Joshi",
    email: "meera.j@tata.com",
    skills: ["Education", "Psychology"],
    experience: "5 years in HR at IHCL",
    languages: ["English", "Hindi", "Gujarati"],
    city: "Mumbai",
    availability: "Weekdays",
    matchPercentage: 85,
    isReturning: true,
    status: "Pending",
    projectId: 101,
    appliedDate: "2026-04-02"
  }
];

export const ANJALI_MEHTA = {
  firstName: "Anjali",
  lastName: "Mehta",
  email: "anjali.mehta@pratham.org",
  role: "ngo",
  organization: "Pratham Foundation",
  tier: "Lead Partner",
  designation: "Program Director",
  city: "Mumbai",
  country: "India",
  projects: [
    { id: 101, title: "Financial Literacy for Rural Women", status: "Active", applications: 12, volunteers: 4, stage: "Execution", endDate: "2026-04-07" },
    { id: 102, title: "Digital Skills for Youth", status: "Under Review", applications: 0, volunteers: 0, stage: "Planning" },
    { id: 103, title: "Early Childhood Education", status: "Draft", applications: 0, volunteers: 0, stage: "Drafting" },
    { id: 104, title: "Community Health Awareness", status: "Closed", applications: 45, volunteers: 15, stage: "Completed" },
    { id: 105, title: "Urban Sanitation Drive", status: "Active", applications: 8, volunteers: 3, stage: "Execution", endDate: "2026-04-06" }
  ],
  coordinators: [
    { id: 1, name: "Rahul Singh", email: "rahul.s@pratham.org", role: "SPOC" },
    { id: 2, name: "Sneha Kapur", email: "sneha.k@pratham.org", role: "Coordinator" }
  ],
  pendingApplications: 8
};

export const PRIYA_SHARMA = {
  firstName: "Priya",
  lastName: "Sharma",
  email: "priya.sharma@tata.com",
  role: "tata_employee",
  company: "Tata Consultancy Services",
  designation: "Senior Project Manager",
  city: "Mumbai",
  country: "India",
  interests: ["Education", "Environment", "Health"],
  skills: ["Finance", "Project Management", "Strategic Planning"],
  badges: [
    { id: 1, name: "Early Bird", icon: "🐦", date: "Jan 2026" },
    { id: 2, name: "Community Hero", icon: "🦸‍♀️", date: "Feb 2026" }
  ],
  activeApplication: {
    id: 1,
    title: "Financial Literacy for Rural Women",
    ngo: "Pratham NGO",
    status: "Matched",
    date: "April 01, 2026"
  },
  history: [
    { id: 1, project: "Beach Cleanup Drive", hours: 4, date: "Feb 15, 2026" },
    { id: 2, project: "Digital Literacy Workshop", hours: 8, date: "Jan 10, 2026" }
  ]
};

export const TVW_EVENTS = [
  { 
    id: 1, 
    title: "Beach Cleanup Drive", 
    date: "June 14, 2025", 
    location: "Mumbai, Versova Beach", 
    mode: "In-Person", 
    capacity: "Open", 
    theme: "Environment",
    company: "Tata Steel",
    description: "Join us for a massive cleanup drive at Versova Beach. Let's make our coastline plastic-free."
  },
  { 
    id: 2, 
    title: "Digital Literacy Workshop", 
    date: "June 18, 2025", 
    location: "Virtual", 
    mode: "Virtual", 
    capacity: "Open", 
    theme: "Education",
    company: "TCS",
    description: "Help senior citizens navigate the digital world. Teach them how to use essential apps and stay safe online."
  },
  { 
    id: 3, 
    title: "Tree Plantation Drive", 
    date: "June 21, 2025", 
    location: "Pune, Hinjewadi", 
    mode: "In-Person", 
    capacity: "Full", 
    theme: "Environment",
    company: "Tata Motors",
    description: "Contributing to the green cover of Pune. We aim to plant 500 saplings in a single day."
  },
  { 
    id: 4, 
    title: "School Mentoring Session", 
    date: "June 22, 2025", 
    location: "Chennai, Adyar", 
    mode: "Hybrid", 
    capacity: "Open", 
    theme: "Education",
    company: "Tata Power",
    description: "Mentor high school students on career choices and soft skills development."
  }
];

export const PROENGAGE_PROJECTS = [
  {
    id: 1,
    title: "Financial Literacy for Rural Women",
    ngo: "Pratham NGO",
    area: "Finance",
    mode: "Remote",
    commitment: "10 hrs/week",
    description: "Design a basic financial literacy module for women in rural Maharashtra. Focus on savings and micro-loans.",
    skills: ["Finance", "Content Creation"],
    matched: true
  },
  {
    id: 2,
    title: "Urban Forest Initiative",
    ngo: "Greens India",
    area: "Environment",
    mode: "On-site Mumbai",
    commitment: "8 hrs/week",
    description: "Help us plan and execute a Miyawaki forest in the heart of Mumbai. Technical expertise in botany preferred.",
    skills: ["Environment", "Project Management"],
    matched: true
  },
  {
    id: 3,
    title: "After-School Coding Club",
    ngo: "Teach For India",
    area: "Education",
    mode: "Hybrid",
    commitment: "12 hrs/week",
    description: "Teach basic Python and web development to underprivileged students in grades 8-10.",
    skills: ["Coding", "Teaching"],
    matched: true,
    full: true
  },
  {
    id: 4,
    title: "Disaster Relief Coordination",
    ngo: "Red Cross India",
    area: "Disaster Response",
    mode: "Remote",
    commitment: "6 hrs/week",
    description: "Assist in coordinating logistics and volunteer deployment for flood-affected regions.",
    skills: ["Logistics", "Coordination"],
    matched: false
  },
  {
    id: 5,
    title: "Women Entrepreneur Mentoring",
    ngo: "Stree Shakti",
    area: "Finance",
    mode: "Remote",
    commitment: "8 hrs/week",
    description: "Mentor budding women entrepreneurs on business planning and market strategy.",
    skills: ["Mentoring", "Business Strategy"],
    matched: false
  },
  {
    id: 6,
    title: "Heritage Conservation Walk",
    ngo: "INTACH",
    area: "Culture",
    mode: "On-site Delhi",
    commitment: "4 hrs/week",
    description: "Lead heritage walks and create awareness about historical monuments in Old Delhi.",
    skills: ["History", "Communication"],
    matched: false
  },
  {
    id: 7,
    title: "Cloud Migration Advisory for NGOs",
    ngo: "Digital Empowerment Foundation",
    area: "IT",
    mode: "Remote",
    commitment: "8 hrs/week",
    description: "Help small NGOs migrate their data and workflows from legacy systems to cloud-based platforms like Google Workspace and AWS.",
    skills: ["Cloud Computing", "IT Infrastructure"],
    matched: true
  },
  {
    id: 8,
    title: "Cybersecurity Awareness Programme",
    ngo: "CyberPeace Foundation",
    area: "IT",
    mode: "Hybrid",
    commitment: "6 hrs/week",
    description: "Conduct cybersecurity awareness workshops for rural banking correspondents and SHG leaders to prevent digital fraud.",
    skills: ["Cybersecurity", "Training"],
    matched: false
  },
  {
    id: 9,
    title: "STEM Lab Setup for Government Schools",
    ngo: "Agastya International Foundation",
    area: "Education",
    mode: "On-site Bangalore",
    commitment: "10 hrs/week",
    description: "Design and set up low-cost STEM experiment labs in 5 government schools across rural Karnataka.",
    skills: ["Science Education", "Lab Design"],
    matched: false
  },
  {
    id: 10,
    title: "English Communication Bootcamp",
    ngo: "Pratham Education Foundation",
    area: "Education",
    mode: "Remote",
    commitment: "6 hrs/week",
    description: "Run a 12-week spoken English and presentation skills bootcamp for first-generation college students.",
    skills: ["Communication", "Teaching"],
    matched: true
  },
  {
    id: 11,
    title: "Legal Aid Clinic for Migrant Workers",
    ngo: "Aajeevika Bureau",
    area: "Legal",
    mode: "On-site Mumbai",
    commitment: "4 hrs/week",
    description: "Provide pro-bono legal advice on wage disputes, housing rights, and identity documentation for migrant labourers.",
    skills: ["Labour Law", "Legal Drafting"],
    matched: false
  },
  {
    id: 12,
    title: "HR Policy Framework for Social Enterprises",
    ngo: "Villgro Innovations",
    area: "HR",
    mode: "Remote",
    commitment: "6 hrs/week",
    description: "Help early-stage social enterprises draft employee handbooks, appraisal frameworks, and POSH policies.",
    skills: ["HR Policy", "Compliance"],
    matched: false
  },
  {
    id: 13,
    title: "Last-Mile Vaccine Delivery Optimisation",
    ngo: "Gavi Alliance India",
    area: "Operations",
    mode: "Hybrid",
    commitment: "8 hrs/week",
    description: "Optimise cold-chain logistics and delivery routes for vaccine distribution in tribal districts of Jharkhand.",
    skills: ["Supply Chain", "Data Analysis"],
    matched: true
  },
  {
    id: 14,
    title: "Telemedicine Platform for Rural PHCs",
    ngo: "AMRIT Foundation",
    area: "Healthcare",
    mode: "Remote",
    commitment: "10 hrs/week",
    description: "Support the rollout of a telemedicine platform connecting rural primary health centres with specialist doctors in cities.",
    skills: ["Healthcare IT", "Project Management"],
    matched: false
  }
];

export const DR_TEMPLATES = [
  { id: 1, name: "Flood Relief Call", subject: "Urgent: Volunteer Call for Flood Relief in [Region]", body: "Dear Tata Volunteer, a severe flood has affected [Region]. We are calling for volunteers to assist in Phase 1 Relief operations. Your support is crucial." },
  { id: 2, name: "Earthquake Response", subject: "Immediate Action: Earthquake Response in [Region]", body: "Dear Tata Volunteer, following the earthquake in [Region], we are activating the One Tata Response Framework. We need volunteers for logistics and medical aid." },
  { id: 3, name: "Medical Emergency", subject: "Volunteer Call: Medical Support Needed", body: "Dear Tata Volunteer, we are seeking volunteers with medical expertise to support ongoing relief efforts in [Region]." },
];

export const MOCK_EDITIONS = {
  proengage: [
    { id: 1, name: "ProEngage 2024", status: "Closed", goLive: "2024-01-15", appWindow: { start: "2024-01-15", end: "2024-02-15" }, buffer: 7, endDate: "2024-06-30", cap: 2, volunteers: 4200, projects: 180 },
    { id: 2, name: "ProEngage 2025", status: "Open", goLive: "2025-01-15", appWindow: { start: "2025-01-15", end: "2025-02-15" }, buffer: 7, endDate: "2025-06-30", cap: 2, volunteers: 5100, projects: 210 },
    { id: 2, name: "ProEngage 2026", status: "Upcoming", goLive: "2026-01-15", appWindow: { start: "2026-01-15", end: "2026-02-15" }, buffer: 7, endDate: "2026-06-30", cap: 2, volunteers: 0, projects: 0 },
  ],
  tvw: [
    { id: 1, name: "TVW 2024", theme: "Impact Together", status: "Closed", dates: { start: "2024-06-01", end: "2024-06-30" }, volunteers: 12000, projects: 450, gcsoMessage: "Thank you for an incredible year of service." },
    { id: 2, name: "TVW 2025", theme: "Be The Change 2025", status: "Open", dates: { start: "2025-06-01", end: "2025-06-30" }, volunteers: 8500, projects: 320, gcsoMessage: "Volunteering is at the heart of our culture. TVW is a time for us to celebrate our commitment to the community." },
  ]
};

export const MOCK_PROJECT_SUBMISSIONS = [
  { 
    id: 1, 
    title: "Digital Literacy for Senior Citizens", 
    ngo: "Green Earth Foundation", 
    skillArea: "Education", 
    mode: "In-Person", 
    volunteersNeeded: 5, 
    submittedDate: "2026-03-25", 
    aiScore: 8.8, 
    status: "Under Review",
    description: "Teaching basic smartphone and internet usage to elderly residents in urban communities.",
    outcomes: "50+ seniors trained in digital safety and communication.",
    impactTargets: "Reduced social isolation among elderly participants.",
    aiBreakdown: { clarity: 9, feasibility: 8, impact: 9, alignment: 9 },
    restrictedCompanies: []
  },
  { 
    id: 2, 
    title: "Sustainable Farming Workshop", 
    ngo: "Rural Upliftment Society", 
    skillArea: "Environment", 
    mode: "Hybrid", 
    volunteersNeeded: 10, 
    submittedDate: "2026-03-26", 
    aiScore: 7.2, 
    status: "Approved",
    description: "Training farmers in organic composting and water conservation techniques.",
    outcomes: "Implementation of organic practices in 20 local farms.",
    impactTargets: "20% reduction in chemical fertilizer usage.",
    aiBreakdown: { clarity: 7, feasibility: 7, impact: 8, alignment: 7 },
    restrictedCompanies: ["Tata Steel", "Tata Power"]
  },
  { 
    id: 3, 
    title: "Mobile Health Clinic Support", 
    ngo: "Health For All", 
    skillArea: "Healthcare", 
    mode: "In-Person", 
    volunteersNeeded: 3, 
    submittedDate: "2026-03-27", 
    aiScore: 9.5, 
    status: "Under Review",
    description: "Assisting medical staff in organizing rural health camps and patient record management.",
    outcomes: "Efficient management of 500+ patient visits per month.",
    impactTargets: "Improved healthcare access for 5 remote villages.",
    aiBreakdown: { clarity: 10, feasibility: 9, impact: 10, alignment: 9 },
    restrictedCompanies: []
  },
  { 
    id: 4, 
    title: "English Proficiency Program", 
    ngo: "Vidya Jyoti Trust", 
    skillArea: "Education", 
    mode: "Virtual", 
    volunteersNeeded: 8, 
    submittedDate: "2026-03-28", 
    aiScore: 5.4, 
    status: "Returned",
    description: "Online English speaking classes for high school students.",
    outcomes: "Improved confidence and speaking skills for 100 students.",
    impactTargets: "Higher pass rates in English language exams.",
    aiBreakdown: { clarity: 5, feasibility: 6, impact: 5, alignment: 6 },
    restrictedCompanies: [],
    returnComments: "Please provide a more detailed curriculum and assessment plan."
  },
  { 
    id: 5, 
    title: "Animal Shelter Management", 
    ngo: "Animal Rescue India", 
    skillArea: "Animal Welfare", 
    mode: "In-Person", 
    volunteersNeeded: 4, 
    submittedDate: "2026-03-29", 
    aiScore: 6.8, 
    status: "Under Review",
    description: "Daily care, feeding, and medical assistance at the city's largest stray animal shelter.",
    outcomes: "Improved health and hygiene for 200+ rescued animals.",
    impactTargets: "Increased adoption rates through better animal socialization.",
    aiBreakdown: { clarity: 7, feasibility: 6, impact: 7, alignment: 7 },
    restrictedCompanies: []
  }
];

export const MOCK_EMAIL_TRIGGERS = [
  { id: 1, type: "Welcome (Volunteer)", condition: "When volunteer status changes to Registered", subject: "Welcome to Tata Engage!", body: "Hi {{volunteer_name}}, welcome to the platform...", timing: "Immediately", enabled: true, lastEdited: "2026-03-20T10:00:00Z" },
  { id: 2, type: "SPOC Assignment", condition: "When a SPOC is assigned to a company/region", subject: "New SPOC Assignment", body: "Hello {{spoc_name}}, you have been assigned as a SPOC...", timing: "Immediately", enabled: true, lastEdited: "2026-03-21T11:30:00Z" },
  { id: 3, type: "NGO Approved", condition: "When NGO application is approved", subject: "Your NGO Application is Approved", body: "Dear {{ngo_name}}, we are pleased to inform you...", timing: "Immediately", enabled: true, lastEdited: "2026-03-22T09:15:00Z" },
  { id: 4, type: "Project Matched", condition: "When volunteer status changes to Matched", subject: "Congratulations! You've been matched", body: "Hi {{volunteer_name}}, you are matched for {{project_title}}...", timing: "Immediately", enabled: true, lastEdited: "2026-03-23T14:20:00Z" },
  { id: 5, type: "Feedback Reminder (T-3)", condition: "3 days before project end date", subject: "Reminder: Submit your project feedback", body: "Hi {{volunteer_name}}, your project is ending soon...", timing: "3 days before deadline", enabled: true, lastEdited: "2026-03-24T16:45:00Z" },
];

export const MOCK_BULK_EMAILS = [
  { id: 1, subject: "ProEngage 2025 Edition Launch", body: "We are excited to announce...", audience: "All Users", status: "Sent", sentDate: "2025-01-15", openRate: "68%" },
  { id: 2, subject: "New NGO Guidelines for 2025", body: "Please review the updated...", audience: "All NGOs", status: "Sent", sentDate: "2025-02-01", openRate: "45%" },
  { id: 3, subject: "Quarterly SPOC Meetup", body: "Join us for the upcoming...", audience: "All SPOCs", status: "Awaiting approval", sentDate: "-", openRate: "-" },
];

export const MOCK_CERTIFICATE_PROJECTS = [
  { id: 1, title: "Digital Literacy for Seniors", ngo: "Green Earth Foundation", volunteersCount: 12, feedbackPercent: 100, status: "Not Triggered", volunteers: [
    { id: 101, name: "Priya Sharma", status: "Completed" },
    { id: 102, name: "Rahul Singh", status: "Completed" },
    { id: 103, name: "Ananya Iyer", status: "Completed" },
  ]},
  { id: 2, title: "Sustainable Farming Workshop", ngo: "Rural Upliftment Society", volunteersCount: 8, feedbackPercent: 85, status: "Generated", volunteers: [] },
  { id: 3, title: "Mobile Health Clinic Support", ngo: "Health For All", volunteersCount: 5, feedbackPercent: 90, status: "Emailed", volunteers: [] },
];

export const MOCK_CMS_ITEMS = [
  { id: 1, type: "Banner", title: "ProEngage 2025 Launch", status: "Published", body: "Join the new edition of ProEngage...", tags: ["ProEngage"], author: "Vikram", version: 3, history: ["v1 — Drafted by Meera", "v2 — Edited after review", "v3 — Published by Vikram"] },
  { id: 2, type: "News Post", title: "Tata Steel Volunteers in Jamshedpur", status: "In Review", body: "Over 500 employees participated...", tags: ["TVW", "General"], author: "Meera", version: 2, history: ["v1 — Drafted by Meera", "v2 — Submitted for review"] },
  { id: 3, type: "Event Page", title: "TVW 2025: Be The Change", status: "Draft", body: "Get ready for the biggest volunteering event...", tags: ["TVW"], author: "Vikram", version: 1, history: ["v1 — Drafted by Vikram"] },
];

export const MOCK_MEDIA_ASSETS = [
  { id: 1, name: "tvw_banner_2025.jpg", type: "image", programme: "TVW", privacy: "Public", date: "2026-03-15", url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400" },
  { id: 2, name: "proengage_guidelines.pdf", type: "pdf", programme: "ProEngage", privacy: "Logged-in", date: "2026-03-20", url: "#" },
  { id: 3, name: "impact_story_video.mp4", type: "video", programme: "General", privacy: "Public", date: "2026-03-25", url: "#" },
];

export const MOCK_TESTIMONIALS = [
  { id: 1, volunteer: "Priya Sharma", project: "Digital Literacy", text: "It was a life-changing experience teaching the elderly.", status: "Pending" },
  { id: 2, volunteer: "Amit Verma", project: "Sustainable Farming", text: "Seeing the impact on the ground was incredible.", status: "Approved" },
];

export const MOCK_FLAGGED_COMMENTS = [
  { id: 1, user: "John Doe", project: "Health Clinic", comment: "This project is a scam!", reason: "Hate Speech", status: "Flagged" },
];
