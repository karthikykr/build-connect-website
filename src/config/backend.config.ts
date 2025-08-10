/**
 * Backend Integration Configuration - Fully hardcoded, no environment variables
 */

// Environment configuration - hardcoded for development
export const ENV = {
  NODE_ENV: 'development',
  IS_PRODUCTION: false,
  IS_DEVELOPMENT: true,
  IS_TEST: false,
}

// API Configuration - completely hardcoded
export const API_CONFIG = {
  // Base URLs - hardcoded for development
  BASE_URL: 'http://localhost:8080',
  BACKEND_URL: 'http://localhost:8080',
  WS_URL: 'http://localhost:8080',

  // API configuration
  API_KEY: '',
  TIMEOUT: 30000, // 30 seconds
  RETRY_DELAY: 1000, // 1 second
  MAX_RETRIES: 3,

  // Rate limiting
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW: 900000, // 15 minutes
  
  // File upload - hardcoded for development
  MAX_FILE_SIZE: 10485760, // 10MB
  ALLOWED_FILE_TYPES: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],

  // Pagination - hardcoded for development
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
}

// Authentication Configuration - Hardcoded for development
export const AUTH_CONFIG = {
  JWT_SECRET: 'build-connect-jwt-secret-for-development',
  TOKEN_EXPIRY: 3600, // 1 hour
  REFRESH_TOKEN_EXPIRY: 604800, // 7 days

  // Session configuration
  SESSION_TIMEOUT: 1800000, // 30 minutes
  REMEMBER_ME_DURATION: 2592000000, // 30 days

  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: false,
  PASSWORD_REQUIRE_LOWERCASE: false,
  PASSWORD_REQUIRE_NUMBERS: false,
  PASSWORD_REQUIRE_SYMBOLS: false,

  // OAuth providers - disabled for development
  GOOGLE_CLIENT_ID: '',
  FACEBOOK_APP_ID: '',
  APPLE_CLIENT_ID: '',
}

// Database Configuration - Not used in frontend, hardcoded for reference
export const DB_CONFIG = {
  HOST: 'localhost',
  PORT: 27017,
  NAME: 'build_connect',
  USER: '',
  PASSWORD: '',

  // Pool settings
  POOL_MIN: 2,
  POOL_MAX: 10,
  POOL_IDLE_TIMEOUT: 30000,

  // SSL settings
  SSL_ENABLED: false,
  SSL_REJECT_UNAUTHORIZED: false,
}

// Cache Configuration - Not used in frontend, hardcoded for reference
export const CACHE_CONFIG = {
  REDIS_URL: 'redis://localhost:6379',
  REDIS_PASSWORD: '',
  REDIS_DB: 0,

  // Cache TTL (in seconds)
  DEFAULT_TTL: 300, // 5 minutes
  USER_TTL: 900, // 15 minutes
  PROPERTY_TTL: 600, // 10 minutes
  BROKER_TTL: 1800, // 30 minutes

  // Cache prefixes
  PREFIX: 'bc:',
  USER_PREFIX: 'user:',
  PROPERTY_PREFIX: 'property:',
  BROKER_PREFIX: 'broker:',
  SESSION_PREFIX: 'session:',
}

// Storage Configuration - Not used in frontend, hardcoded for reference
export const STORAGE_CONFIG = {
  STORAGE_TYPE: 'local',
  UPLOAD_PATH: './uploads',

  // AWS S3 - disabled for development
  AWS_REGION: 'us-east-1',
  AWS_BUCKET: '',
  AWS_ACCESS_KEY_ID: '',
  AWS_SECRET_ACCESS_KEY: '',

  // Google Cloud Storage - disabled for development
  GCS_BUCKET: '',
  GCS_PROJECT_ID: '',
  GCS_KEY_FILE: '',

  // CDN - disabled for development
  CDN_URL: '',
  CDN_ENABLED: false,
}

// Email Configuration - Not used in frontend, hardcoded for reference
export const EMAIL_CONFIG = {
  SMTP_HOST: 'localhost',
  SMTP_PORT: 587,
  SMTP_SECURE: false,
  SMTP_USER: '',
  SMTP_PASS: '',

  // Email addresses
  FROM_EMAIL: 'noreply@buildconnect.com',
  FROM_NAME: 'BUILD-CONNECT',
  SUPPORT_EMAIL: 'support@buildconnect.com',

  // Email service providers - disabled for development
  SENDGRID_API_KEY: '',
  MAILGUN_API_KEY: '',
  MAILGUN_DOMAIN: '',

  // Templates
  TEMPLATE_PATH: './templates/email',
}

// SMS Configuration - Not used in frontend, hardcoded for reference
export const SMS_CONFIG = {
  TWILIO_ACCOUNT_SID: '',
  TWILIO_AUTH_TOKEN: '',
  TWILIO_PHONE_NUMBER: '',
  AWS_SNS_REGION: 'us-east-1',
  SMS_PROVIDER: 'twilio',
}

// Payment Configuration - Disabled for development
export const PAYMENT_CONFIG = {
  // Stripe - disabled for development
  STRIPE_PUBLIC_KEY: '',
  STRIPE_SECRET_KEY: '',
  STRIPE_WEBHOOK_SECRET: '',

  // Razorpay - disabled for development
  RAZORPAY_KEY_ID: '',
  RAZORPAY_KEY_SECRET: '',
  RAZORPAY_WEBHOOK_SECRET: '',

  // PayU - disabled for development
  PAYU_MERCHANT_KEY: '',
  PAYU_MERCHANT_SALT: '',

  // Currency
  DEFAULT_CURRENCY: 'INR',
  SUPPORTED_CURRENCIES: ['INR', 'USD', 'EUR'],
}

// Maps Configuration - Disabled for development
export const MAPS_CONFIG = {
  GOOGLE_MAPS_API_KEY: '',
  MAPBOX_ACCESS_TOKEN: '',
  DEFAULT_CENTER: {
    lat: 12.9716, // Bangalore coordinates
    lng: 77.5946,
  },
  DEFAULT_ZOOM: 10,
}

// Analytics Configuration - Disabled for development
export const ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: '',
  FACEBOOK_PIXEL_ID: '',
  HOTJAR_ID: '',
  MIXPANEL_TOKEN: '',
}

// Monitoring Configuration - Disabled for development
export const MONITORING_CONFIG = {
  SENTRY_DSN: '',
  SENTRY_ENVIRONMENT: ENV.NODE_ENV,
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  LOG_LEVEL: 'info',
  LOG_FORMAT: 'json',
}

// Feature Flags - Enabled for development
export const FEATURE_FLAGS = {
  ENABLE_CHAT: true,
  ENABLE_VIDEO_CALLS: false,
  ENABLE_AI_FEATURES: false,
  ENABLE_SITE_SCOUTING: true,
  ENABLE_COMMISSION_TRACKING: true,
  ENABLE_ADVANCED_SEARCH: true,
  ENABLE_PROPERTY_COMPARISON: true,
  ENABLE_BROKER_VERIFICATION: true,
  ENABLE_NOTIFICATIONS: true,
  ENABLE_ANALYTICS: false,
}

// Rate Limiting Configuration - Hardcoded for development
export const RATE_LIMIT_CONFIG = {
  GLOBAL_REQUESTS_PER_MINUTE: 1000,
  USER_REQUESTS_PER_MINUTE: 100,
  AUTH_REQUESTS_PER_MINUTE: 10,
  UPLOAD_REQUESTS_PER_MINUTE: 20,
  SEARCH_REQUESTS_PER_MINUTE: 60,
}

// Security Configuration - Hardcoded for development
export const SECURITY_CONFIG = {
  CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:3002'],
  CORS_CREDENTIALS: true,
  CSRF_SECRET: 'csrf-secret-for-development',
  ENCRYPTION_KEY: 'encryption-key-for-development',

  // Security headers
  SECURITY_HEADERS: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
}

// Export all configurations
export const CONFIG = {
  ENV,
  API: API_CONFIG,
  AUTH: AUTH_CONFIG,
  DB: DB_CONFIG,
  CACHE: CACHE_CONFIG,
  STORAGE: STORAGE_CONFIG,
  EMAIL: EMAIL_CONFIG,
  SMS: SMS_CONFIG,
  PAYMENT: PAYMENT_CONFIG,
  MAPS: MAPS_CONFIG,
  ANALYTICS: ANALYTICS_CONFIG,
  MONITORING: MONITORING_CONFIG,
  FEATURES: FEATURE_FLAGS,
  RATE_LIMIT: RATE_LIMIT_CONFIG,
  SECURITY: SECURITY_CONFIG,
}

export default CONFIG
