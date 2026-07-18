export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '5000'),
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',
  CORS_ORIGINS: process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001',
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'anthropic',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  FOLLOWUP_DELAY_HOURS: parseInt(process.env.FOLLOWUP_DELAY_HOURS || '24'),
};

export const corsOrigins = () => env.CORS_ORIGINS.split(',');