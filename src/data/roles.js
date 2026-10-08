export const ROLES = {
  owner: { label: 'Owner', desc: 'Full control. Created the account and cannot be removed.' },
  admin: { label: 'Admin', desc: 'Everything, including the team and API keys.' },
  analyst: { label: 'Analyst', desc: 'Sees alerts and handles them: investigate, resolve, mark false alarms.' },
  viewer: { label: 'Viewer', desc: 'Can see alerts but cannot change anything.' },
  developer: { label: 'Developer', desc: 'Creates API keys and connects systems. Does not see alerts.' },
}
// Mirrors the server: the owner manages admins, admins manage everyone below them.
export const assignable = (myRole) =>
  myRole === 'owner' ? ['admin', 'analyst', 'viewer', 'developer'] : myRole === 'admin' ? ['analyst', 'viewer', 'developer'] : []
