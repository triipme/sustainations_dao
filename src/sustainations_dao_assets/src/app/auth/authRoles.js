/**
 * Authorization Roles
 */
const authRoles = {
  admin: ['admin'],
  staff: ['admin', 'staff'],
  user: ['admin', 'staff', 'user'],
  refillBrandOwner: ['brandOwner'],
  refillBrandStaff: ['brandOwner', 'brandStaff'],
  needAgreement: ['needAgreement'],
  alllRoles: ['admin', 'staff', 'user', 'brandOwner', 'brandStaff'],
  onlyGuest: [],
};

export default authRoles;
