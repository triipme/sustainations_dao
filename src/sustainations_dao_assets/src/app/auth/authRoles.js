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
  onlyGuest: [],
};

export default authRoles;
