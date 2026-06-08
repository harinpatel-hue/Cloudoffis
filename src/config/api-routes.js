const apiRoutes = {
  auth: {
    login: '/api/v1/auth/login',
    twoFactor: '/api/v1/auth/two-factor'
  },
  users: {
    profile: '/api/v1/users/profile',
    list: '/api/v1/users'
  },
  workpapers: {
    list: '/api/v1/workpapers',
    create: '/api/v1/workpapers/create'
  }
};

module.exports = { apiRoutes };
