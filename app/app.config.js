import 'dotenv/config';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    OPENWEATHER_API_KEY: process.env.OPENWEATHER_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY
  },
});