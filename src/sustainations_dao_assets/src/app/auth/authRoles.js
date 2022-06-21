/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  staff: ['admin', 'staff'],
  user: ['admin', 'staff', 'user'],
  needAgreement: ['needAgreement'],
  onlyGuest: [],
};

export default authRoles;
