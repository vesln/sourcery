module.exports = process.env.SOURCERY_COV
  ? require('./lib-cov/sourcery')
  : require('./lib/sourcery');
