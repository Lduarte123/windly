import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
  },
});