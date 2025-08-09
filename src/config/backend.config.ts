/**
 * Backend Integration Configuration
 */

// Environment configuration
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_TEST: process.env.NODE_ENV === 'test',
}

// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  BACKEND_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
  WS_URL: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8080',
  
  // API Keys
  API_KEY: process.env.BACKEND_API_KEY || '',
  
  // Timeouts (in milliseconds)
  TIMEOUT: parseInt(process.env.API_TIMEOUT || '30000'),
  RETRY_DELAY: parseInt(process.env.API_RETRY_DELAY || '1000'),
  MAX_RETRIES: parseInt(process.env.API_MAX_RETRIES || '3'),
  
  // Rate limiting
  RATE_LIMIT_REQUESTS: parseInt(process.env.API_RATE_LIMIT_REQUESTS || '100'),
  RATE_LIMIT_WINDOW: parseInt(process.env.API_RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  
  // File upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(','),
  
  // Pagination
  DEFAULT_PAGE_SIZE: parseInt(process.env.DEFAULT_PAGE_SIZE || '20'),
  MAX_PAGE_SIZE: parseInt(process.env.MAX_PAGE_SIZE || '100'),
}

// Authentication Configuration
export const AUTH_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret',
  TOKEN_EXPIRY: parseInt(process.env.TOKEN_EXPIRY || '3600'), // 1 hour
  REFRESH_TOKEN_EXPIRY: parseInt(process.env.REFRESH_TOKEN_EXPIRY || '604800'), // 7 days
  
  // Session configuration
  SESSION_TIMEOUT: parseInt(process.env.SESSION_TIMEOUT || '1800000'), // 30 minutes
  REMEMBER_ME_DURATION: parseInt(process.env.REMEMBER_ME_DURATION || '2592000000'), // 30 days
  
  // Password requirements
  PASSWORD_MIN_LENGTH: parseInt(process.env.PASSWORD_MIN_LENGTH || '8'),
  PASSWORD_REQUIRE_UPPERCASE: process.env.PASSWORD_REQUIRE_UPPERCASE === 'true',
  PASSWORD_REQUIRE_LOWERCASE: process.env.PASSWORD_REQUIRE_LOWERCASE === 'true',
  PASSWORD_REQUIRE_NUMBERS: process.env.PASSWORD_REQUIRE_NUMBERS === 'true',
  PASSWORD_REQUIRE_SYMBOLS: process.env.PASSWORD_REQUIRE_SYMBOLS === 'true',
  
  // OAuth providers
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID || '',
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID || '',
}

// Database Configuration
export const DB_CONFIG = {
  // Connection settings
  HOST: process.env.DB_HOST || 'localhost',
  PORT: parseInt(process.env.DB_PORT || '5432'),
  NAME: process.env.DB_NAME || 'build_connect',
  USER: process.env.DB_USER || 'postgres',
  PASSWORD: process.env.DB_PASSWORD || '',
  
  // Pool settings
  POOL_MIN: parseInt(process.env.DB_POOL_MIN || '2'),
  POOL_MAX: parseInt(process.env.DB_POOL_MAX || '10'),
  POOL_IDLE_TIMEOUT: parseInt(process.env.DB_POOL_IDLE_TIMEOUT || '30000'),
  
  // SSL settings
  SSL_ENABLED: process.env.DB_SSL_ENABLED === 'true',
  SSL_REJECT_UNAUTHORIZED: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false',
}

// Cache Configuration
export const CACHE_CONFIG = {
  // Redis configuration
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_DB: parseInt(process.env.REDIS_DB || '0'),
  
  // Cache TTL (in seconds)
  DEFAULT_TTL: parseInt(process.env.CACHE_DEFAULT_TTL || '300'), // 5 minutes
  USER_TTL: parseInt(process.env.CACHE_USER_TTL || '900'), // 15 minutes
  PROPERTY_TTL: parseInt(process.env.CACHE_PROPERTY_TTL || '600'), // 10 minutes
  BROKER_TTL: parseInt(process.env.CACHE_BROKER_TTL || '1800'), // 30 minutes
  
  // Cache prefixes
  PREFIX: process.env.CACHE_PREFIX || 'bc:',
  USER_PREFIX: 'user:',
  PROPERTY_PREFIX: 'property:',
  BROKER_PREFIX: 'broker:',
  SESSION_PREFIX: 'session:',
}

// Storage Configuration
export const STORAGE_CONFIG = {
  // File storage
  STORAGE_TYPE: process.env.STORAGE_TYPE || 'local', // 'local', 's3', 'gcs'
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  // AWS S3
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_BUCKET: process.env.AWS_BUCKET || '',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  
  // Google Cloud Storage
  GCS_BUCKET: process.env.GCS_BUCKET || '',
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || '',
  GCS_KEY_FILE: process.env.GCS_KEY_FILE || '',
  
  // CDN
  CDN_URL: process.env.CDN_URL || '',
  CDN_ENABLED: process.env.CDN_ENABLED === 'true',
}

// Email Configuration
export const EMAIL_CONFIG = {
  // SMTP settings
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587'),
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  
  // Email addresses
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@buildconnect.com',
  FROM_NAME: process.env.FROM_NAME || 'BUILD-CONNECT',
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'support@buildconnect.com',
  
  // Email service providers
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  MAILGUN_API_KEY: process.env.MAILGUN_API_KEY || '',
  MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN || '',
  
  // Templates
  TEMPLATE_PATH: process.env.EMAIL_TEMPLATE_PATH || './templates/email',
}

// SMS Configuration
export const SMS_CONFIG = {
  // Twilio
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
  
  // AWS SNS
  AWS_SNS_REGION: process.env.AWS_SNS_REGION || 'us-east-1',
  
  // Other providers
  SMS_PROVIDER: process.env.SMS_PROVIDER || 'twilio', // 'twilio', 'aws-sns', 'custom'
}

// Payment Configuration
export const PAYMENT_CONFIG = {
  // Stripe
  STRIPE_PUBLIC_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || '',
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
  
  // Razorpay
  RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || '',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
  
  // PayU
  PAYU_MERCHANT_KEY: process.env.PAYU_MERCHANT_KEY || '',
  PAYU_MERCHANT_SALT: process.env.PAYU_MERCHANT_SALT || '',
  
  // Currency
  DEFAULT_CURRENCY: process.env.DEFAULT_CURRENCY || 'INR',
  SUPPORTED_CURRENCIES: (process.env.SUPPORTED_CURRENCIES || 'INR,USD,EUR').split(','),
}

// Maps Configuration
export const MAPS_CONFIG = {
  GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || '',
  DEFAULT_CENTER: {
    lat: parseFloat(process.env.DEFAULT_MAP_LAT || '12.9716'),
    lng: parseFloat(process.env.DEFAULT_MAP_LNG || '77.5946'),
  },
  DEFAULT_ZOOM: parseInt(process.env.DEFAULT_MAP_ZOOM || '10'),
}

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GA_ID || '',
  FACEBOOK_PIXEL_ID: process.env.NEXT_PUBLIC_FB_PIXEL_ID || '',
  HOTJAR_ID: process.env.NEXT_PUBLIC_HOTJAR_ID || '',
  MIXPANEL_TOKEN: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '',
}

// Monitoring Configuration
export const MONITORING_CONFIG = {
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
  SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT || ENV.NODE_ENV,
  
  // Health check
  HEALTH_CHECK_INTERVAL: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000'), // 30 seconds
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  LOG_FORMAT: process.env.LOG_FORMAT || 'json',
}

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_CHAT: process.env.ENABLE_CHAT === 'true',
  ENABLE_VIDEO_CALLS: process.env.ENABLE_VIDEO_CALLS === 'true',
  ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES === 'true',
  ENABLE_SITE_SCOUTING: process.env.ENABLE_SITE_SCOUTING === 'true',
  ENABLE_COMMISSION_TRACKING: process.env.ENABLE_COMMISSION_TRACKING === 'true',
  ENABLE_ADVANCED_SEARCH: process.env.ENABLE_ADVANCED_SEARCH === 'true',
  ENABLE_PROPERTY_COMPARISON: process.env.ENABLE_PROPERTY_COMPARISON === 'true',
  ENABLE_BROKER_VERIFICATION: process.env.ENABLE_BROKER_VERIFICATION === 'true',
  ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS === 'true',
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === 'true',
}

// Rate Limiting Configuration
export const RATE_LIMIT_CONFIG = {
  // Global rate limits
  GLOBAL_REQUESTS_PER_MINUTE: parseInt(process.env.GLOBAL_RATE_LIMIT || '1000'),
  
  // Per-user rate limits
  USER_REQUESTS_PER_MINUTE: parseInt(process.env.USER_RATE_LIMIT || '100'),
  
  // API endpoint specific limits
  AUTH_REQUESTS_PER_MINUTE: parseInt(process.env.AUTH_RATE_LIMIT || '10'),
  UPLOAD_REQUESTS_PER_MINUTE: parseInt(process.env.UPLOAD_RATE_LIMIT || '20'),
  SEARCH_REQUESTS_PER_MINUTE: parseInt(process.env.SEARCH_RATE_LIMIT || '60'),
}

// Security Configuration
export const SECURITY_CONFIG = {
  // CORS
  CORS_ORIGINS: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
  CORS_CREDENTIALS: process.env.CORS_CREDENTIALS === 'true',
  
  // CSRF
  CSRF_SECRET: process.env.CSRF_SECRET || 'csrf-secret',
  
  // Encryption
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'encryption-key',
  
  // Headers
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
