export const TATA_COMPANIES = ["Tata Motors", "TCS", "Tata Steel", "Tata Power", "Tata Consumer Products", "Titan", "Indian Hotels"];

export const GEOGRAPHIES = ["Maharashtra", "Assam", "Odisha", "Kerala", "Gujarat", "West Bengal"];

export const MOCK_NGO_APPLICATIONS = [
{ 
  id: 1, 
  name: "Green Earth Foundation", 
  focusArea: "Environment", 
  state: "Maharashtra", 
  registeredDate: "2026-03-28", 
  aiScore: 8.5, 
  status: "Pending",
  regNumber: "NGO/2024/00123",
  website: "www.greenearth.org",
  coordinator: "Suresh Prabhu",
  docs: ["Registration Certificate", "FCRA Certificate", "80G Certificate"],
  aiSummary: "Green Earth Foundation has a strong track record in urban afforestation. Their financial audits are consistent, and they have previously collaborated with government bodies.",
  riskFlags: [],
  confidence: "High",
  completeness: "10/10",
  assignedCompanies: ["TCS", "Tata Steel", "Tata Motors"]
},
{ 
  id: 2, 
  name: "Vidya Jyoti Trust", 
  focusArea: "Education", 
  state: "Karnataka", 
  registeredDate: "2026-03-30", 
  aiScore: 4.2, 
  status: "Flagged",
  regNumber: "VJT/EDU/998",
  website: "www.vidyajyoti.in",
  coordinator: "Meena Kumari",
  docs: ["Registration Certificate"],
  aiSummary: "Vidya Jyoti Trust is a relatively new entity. AI-03 detected missing mandatory documents (FCRA, 80G). Registration number format is non-standard for the region.",
  riskFlags: ["Registration number format unrecognised", "No FCRA certificate uploaded", "No 80G certificate uploaded"],
  confidence: "Medium",
  completeness: "4/10",
  assignedCompanies: []
},
{ 
  id: 3, 
  name: "Health For All", 
  focusArea: "Healthcare", 
  state: "Delhi", 
  registeredDate: "2026-04-01", 
  aiScore: 9.2, 
  status: "Approved",
  regNumber: "HFA/DEL/2021",
  website: "www.healthforall.org",
  coordinator: "Dr. Rajesh Khanna",
  docs: ["Registration Certificate", "FCRA Certificate", "80G Certificate", "Annual Report 2023"],
  aiSummary: "Highly reputable healthcare NGO with extensive reach in rural Delhi. All compliance documents are verified and up to date.",
  riskFlags: [],
  confidence: "High",
  completeness: "10/10",
  assignedCompanies: ["TCS", "Tata Steel", "Tata Motors", "Titan", "Tata Power"]
},
{ 
  id: 4, 
  name: "Rural Upliftment Society", 
  focusArea: "Rural Development", 
  state: "Bihar", 
  registeredDate: "2026-04-02", 
  aiScore: 7.8, 
  status: "Pending",
  regNumber: "RUS/BHR/445",
  website: "www.ruraluplift.org",
  coordinator: "Amitabh Singh",
  docs: ["Registration Certificate", "80G Certificate"],
  aiSummary: "Focuses on sustainable farming practices. AI-03 flagged a minor discrepancy in the address provided vs registration records.",
  riskFlags: ["Address discrepancy detected"],
  confidence: "Medium",
  completeness: "8/10",
  assignedCompanies: ["Tata Steel"]
},
{ 
  id: 5, 
  name: "Animal Rescue India", 
  focusArea: "Animal Welfare", 
  state: "Tamil Nadu", 
  registeredDate: "2026-04-03", 
  aiScore: 6.5, 
  status: "Pending",
  regNumber: "ARI/TN/772",
  website: "www.animalrescue.in",
  coordinator: "Lakshmi Iyer",
  docs: ["Registration Certificate", "FCRA Certificate"],
  aiSummary: "Active in stray animal rescue and rehabilitation. Documentation is mostly complete, but financial summary for 2023 is missing.",
  riskFlags: ["Missing 2023 Financial Summary"],
  confidence: "Medium",
  completeness: "7/10",
  assignedCompanies: []
}
];


