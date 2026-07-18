export const env = {
  get NODE_ENV() { return process.env.NODE_ENV || 'development'; },
  get PORT() { return parseInt(process.env.PORT || '5000'); },
  get MONGODB_URI() { return process.env.MONGODB_URI || ''; },
  get JWT_ACCESS_SECRET() { return process.env.JWT_ACCESS_SECRET || ''; },
  get JWT_REFRESH_SECRET() { return process.env.JWT_REFRESH_SECRET || ''; },
  get CLIENT_URL() { return process.env.CLIENT_URL || 'http://localhost:3000'; },
  get CORS_ORIGINS() { return process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001'; },
  get LLM_PROVIDER() { return process.env.LLM_PROVIDER || 'anthropic'; },
  get ANTHROPIC_API_KEY() { return process.env.ANTHROPIC_API_KEY || ''; },
  get FOLLOWUP_DELAY_HOURS() { return parseInt(process.env.FOLLOWUP_DELAY_HOURS || '24'); },
};

export const corsOrigins = () => env.CORS_ORIGINS.split(',');