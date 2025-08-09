// Application Constants

// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
export const API_TIMEOUT = 30000; // 30 seconds

// Application Routes
export const ROUTES = {
  HOME: '/',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: '/dashboard',
  PROPERTIES: {
    LIST: '/properties',
    DETAILS: '/properties/[id]',
    ADD: '/properties/add',
    EDIT: '/properties/[id]/edit',
  },
  BROKERS: {
    LIST: '/brokers',
    DETAILS: '/brokers/[id]',
    APPLICATION: '/brokers/apply',
    DASHBOARD: '/brokers/dashboard',
  },
  CONTRACTORS: {
    LIST: '/contractors',
    DETAILS: '/contractors/[id]',
    APPLICATION: '/contractors/apply',
    DASHBOARD: '/contractors/dashboard',
  },
  MAP: '/map',
  CHAT: {
    LIST: '/chat',
    ROOM: '/chat/[id]',
  },
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    PROPERTIES: '/admin/properties',
    APPLICATIONS: '/admin/applications',
  },
  SUPPORT: '/support',
} as const;

// Property Types
export const PROPERTY_TYPES = [
  { value: 'residential_plot', label: 'Residential Plot' },
  { value: 'commercial_plot', label: 'Commercial Plot' },
  { value: 'agricultural_land', label: 'Agricultural Land' },
  { value: 'industrial_plot', label: 'Industrial Plot' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'farmhouse', label: 'Farmhouse' },
] as const;

// Area Units
export const AREA_UNITS = [
  { value: 'sqft', label: 'Square Feet' },
  { value: 'acres', label: 'Acres' },
  { value: 'guntas', label: 'Guntas' },
  { value: 'cents', label: 'Cents' },
] as const;

// User Roles
export const USER_ROLES = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'broker', label: 'Broker' },
  { value: 'contractor', label: 'Contractor' },
  { value: 'admin', label: 'Admin' },
] as const;

// Application Status
export const APPLICATION_STATUS = [
  { value: 'pending', label: 'Pending', color: 'warning' },
  { value: 'under_review', label: 'Under Review', color: 'primary' },
  { value: 'approved', label: 'Approved', color: 'success' },
  { value: 'rejected', label: 'Rejected', color: 'error' },
] as const;

// Property Status
export const PROPERTY_STATUS = [
  { value: 'available', label: 'Available', color: 'success' },
  { value: 'sold', label: 'Sold', color: 'error' },
  { value: 'under_negotiation', label: 'Under Negotiation', color: 'warning' },
  { value: 'pending_verification', label: 'Pending Verification', color: 'primary' },
] as const;

// Contractor Specializations
export const CONTRACTOR_SPECIALIZATIONS = [
  { value: 'residential_construction', label: 'Residential Construction' },
  { value: 'commercial_construction', label: 'Commercial Construction' },
  { value: 'interior_design', label: 'Interior Design' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'renovation', label: 'Renovation' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'plumbing', label: 'Plumbing' },
  { value: 'painting', label: 'Painting' },
] as const;

// Indian States
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
] as const;

// File Upload Limits
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'image/jpeg', 'image/png'],
  },
  MAX_FILES: 10,
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],
} as const;

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_CENTER: {
    lat: 12.9716, // Bangalore coordinates
    lng: 77.5946,
  },
  DEFAULT_ZOOM: 10,
  MARKER_CLUSTER_OPTIONS: {
    gridSize: 60,
    maxZoom: 15,
  },
} as const;

// Chat Configuration
export const CHAT_CONFIG = {
  MAX_MESSAGE_LENGTH: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  TYPING_TIMEOUT: 3000, // 3 seconds
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PHONE_REGEX: /^[6-9]\d{9}$/,
  AADHAAR_REGEX: /^\d{12}$/,
  PAN_REGEX: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PINCODE_REGEX: /^\d{6}$/,
} as const;

// Quick Access Items (matching mobile app)
export const QUICK_ACCESS_ITEMS = [
  {
    id: 1,
    name: 'Sites',
    route: ROUTES.PROPERTIES.LIST,
    description: 'Browse available properties',
  },
  {
    id: 2,
    name: 'Contractors',
    route: ROUTES.CONTRACTORS.LIST,
    description: 'Find trusted contractors',
  },
  {
    id: 3,
    name: 'Site Scouts',
    route: ROUTES.BROKERS.LIST,
    description: 'Connect with brokers',
  },
  {
    id: 4,
    name: 'Map Explorer',
    route: ROUTES.MAP,
    description: 'Explore properties on map',
  },
  {
    id: 5,
    name: 'Chats',
    route: ROUTES.CHAT.LIST,
    description: 'Your conversations',
  },
  {
    id: 6,
    name: 'Support',
    route: ROUTES.SUPPORT,
    description: 'Get help and support',
  },
] as const;
