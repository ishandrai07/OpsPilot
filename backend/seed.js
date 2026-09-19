require('dotenv').config();
const mongoose = require('mongoose');
const Policy = require('./models/Policy');

const policies = [
  {
    department: 'HR',
    name: 'Work From Home (WFH) Policy',
    description: 'Guidelines for employees requesting remote work arrangements.',
    rules: [
      'Employees can request WFH for up to 2 days per week without manager approval.',
      'WFH requests exceeding 3 consecutive days require manager sign-off.',
      'Employee must have a stable internet connection and a dedicated workspace.',
      'Core hours (10 AM – 4 PM) must be maintained regardless of work location.',
      'Equipment and data security protocols must be followed when working remotely.',
    ],
    autoApproveLimit: null,
    keywords: ['wfh', 'work from home', 'remote', 'remote work', 'work remotely', 'home office'],
  },
  {
    department: 'HR',
    name: 'Leave & Absence Policy',
    description: 'Policy governing all types of leave including sick, casual, and annual leave.',
    rules: [
      'Employees are entitled to 15 days of annual leave per year.',
      'Sick leave of up to 3 days can be self-certified; beyond 3 days requires a medical certificate.',
      'Leave must be applied at least 48 hours in advance except for emergencies.',
      'Unused leave cannot be carried forward beyond the fiscal year.',
    ],
    autoApproveLimit: null,
    keywords: ['leave', 'sick leave', 'annual leave', 'casual leave', 'vacation', 'time off', 'absence'],
  },
  {
    department: 'IT',
    name: 'VPN & Remote Access Policy',
    description: 'Standards for secure remote access to company systems via VPN.',
    rules: [
      'All remote access must be done through the company-approved VPN client.',
      'VPN credentials must not be shared with anyone.',
      'Disconnect VPN when not actively needed to reduce security risks.',
      'Report any VPN connectivity issues to the IT helpdesk immediately.',
      'Use the troubleshooting steps: (1) Restart VPN client, (2) Check internet connection, (3) Clear VPN cache, (4) Reinstall VPN client, (5) Contact IT if unresolved.',
    ],
    autoApproveLimit: null,
    keywords: ['vpn', 'remote access', 'network', 'connectivity', 'tunnel', 'cisco', 'nordvpn'],
  },
  {
    department: 'IT',
    name: 'Software & Access Request Policy',
    description: 'Process for requesting access to software tools and systems.',
    rules: [
      'Software access requests must be submitted through the IT portal.',
      'Standard software (Office 365, Slack, Zoom) is auto-provisioned within 24 hours.',
      'Licensed software requires manager approval before provisioning.',
      'Access to sensitive systems requires HR and IT joint approval.',
      'Password resets can be self-serviced via the identity portal.',
    ],
    autoApproveLimit: null,
    keywords: ['software', 'access', 'license', 'login', 'credentials', 'password', 'account', 'email', 'tools'],
  },
  {
    department: 'Finance',
    name: 'Travel & Hotel Expense Policy',
    description: 'Reimbursement guidelines for travel-related expenses including hotels, flights, and meals.',
    rules: [
      'Hotel expenses up to ₹5,000/night are auto-approved for domestic travel.',
      'Hotel expenses between ₹5,000 and ₹10,000/night require manager approval.',
      'Hotel expenses above ₹10,000/night require Finance department approval.',
      'Total trip expenses up to ₹8,000 are auto-approved; above requires manual review.',
      'Original receipts must be submitted within 7 days of travel completion.',
      'Luxury hotels and personal upgrades are not reimbursable.',
    ],
    autoApproveLimit: 8000,
    keywords: ['hotel', 'travel', 'reimbursement', 'expenses', 'accommodation', 'trip', 'flight', 'client visit'],
  },
  {
    department: 'Finance',
    name: 'General Expense Reimbursement Policy',
    description: 'Guidelines for claiming reimbursement for work-related expenses.',
    rules: [
      'Expenses up to ₹2,000 are auto-approved with a valid receipt.',
      'Expenses between ₹2,000 and ₹10,000 require manager approval.',
      'Expenses above ₹10,000 require Finance team review.',
      'All expense claims must include itemized receipts.',
      'Claims must be submitted within 30 days of the expense date.',
    ],
    autoApproveLimit: 2000,
    keywords: ['reimbursement', 'expense', 'claim', 'receipt', 'purchase', 'invoice', 'payment'],
  },
  {
    department: 'General',
    name: 'General Inquiry Policy',
    description: 'Handling of requests that do not fall under a specific department.',
    rules: [
      'General inquiries are routed to the appropriate department head.',
      'A response is expected within 2 business days.',
      'If the request involves multiple departments, it is escalated to HR for coordination.',
    ],
    autoApproveLimit: null,
    keywords: [],
  },
];

const seedPolicies = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Policy.deleteMany({});
    console.log('🗑️  Cleared existing policies');

    await Policy.insertMany(policies);
    console.log(`✅ Seeded ${policies.length} policies successfully`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedPolicies();
