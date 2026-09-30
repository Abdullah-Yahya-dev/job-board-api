module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '15m',
    refreshExpiresIn: '7d'
  },
  env: process.env.NODE_ENV || 'development'
};