// Each answer below feeds the dashboard builder later (modules, alert rules, notification routing).
const opt = (...a) => a.map((v) => ({ value: v, label: v }))

export const steps = [
  {
    id: 'account', title: 'Create your login', hint: 'This will be the primary administrator account.',
    fields: [
      { name: 'fullName', label: 'Your full name', type: 'text', required: true, autoComplete: 'name' },
      { name: 'email', label: 'Work email', type: 'email', required: true, autoComplete: 'email' },
      { name: 'password', label: 'Password', type: 'password', required: true, min: 8, help: 'At least 8 characters.', autoComplete: 'new-password' },
    ],
  },
  {
    id: 'org', title: 'About your institution', hint: 'We use this to choose the right monitoring modules.',
    fields: [
      { name: 'orgName', label: 'Institution name', type: 'text', required: true },
      { name: 'orgType', label: 'What kind of institution is it?', type: 'select', required: true,
        options: opt('Bank or microfinance', 'Hospital or clinic', 'University or school', 'Government agency', 'Insurance', 'Fintech or payments', 'NGO or cooperative', 'Retail or logistics', 'Other') },
      { name: 'orgSize', label: 'How many staff use your systems?', type: 'select', required: true,
        options: opt('1 to 50', '51 to 250', '251 to 1,000', 'More than 1,000') },
      { name: 'country', label: 'Country of operation', type: 'text', required: true },
    ],
  },
  {
    id: 'systems', title: 'What do you need to protect?', hint: 'Pick every system that applies. Each one gets its own dashboard section.',
    fields: [
      { name: 'systems', type: 'multi', required: true,
        options: opt('Core banking or ledger', 'Payments and transfers', 'Payroll and HR', 'Customer or patient records', 'Student records', 'Procurement and vendors', 'Email and staff accounts', 'Websites and portals', 'Cloud storage', 'Other') },
    ],
  },
  {
    id: 'threats', title: 'Which threats worry you most?', hint: 'We will turn the matching alert rules on first.',
    fields: [
      { name: 'threats', type: 'multi', required: true,
        options: opt('Account takeover', 'Payment or transfer fraud', 'Insider misuse', 'Data theft', 'Records tampering', 'Fake vendors or ghost workers', 'Phishing', 'Ransomware') },
      { name: 'pastIncident', label: 'Have you had a security incident in the last 12 months?', type: 'single', required: true,
        options: opt('Yes', 'No', 'Not sure') },
    ],
  },
  {
    id: 'alerts', title: 'How should we reach you?', hint: 'You can change this any time from the dashboard.',
    fields: [
      { name: 'channels', label: 'Alert channels', type: 'multi', required: true, options: opt('SMS', 'Email', 'WhatsApp', 'Slack or Teams', 'Phone call') },
      { name: 'minSeverity', label: 'Which alerts should reach you?', type: 'single', required: true,
        options: [{ value: 'all', label: 'Everything' }, { value: 'warning', label: 'Warnings and critical' }, { value: 'critical', label: 'Critical only' }] },
      { name: 'responders', label: 'Who will respond to alerts?', type: 'select', required: true,
        options: opt('A dedicated security team', 'IT department', 'Compliance or risk team', 'Management only', 'No one yet') },
    ],
  },
]
