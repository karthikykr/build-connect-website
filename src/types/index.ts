// User Types - Aligned with Backend User Management Service
export interface User {
  _id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  location?: string[];
  isAvailable?: boolean;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  partnershipRequest: 'NONE' | 'Broker' | 'Contractor';
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'user' | 'contractor' | 'broker' | 'admin';

export interface UserProfile extends User {
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: Address;
  documents?: Document[];
}

// Address Types
export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  latitude?: number;
  longitude?: number;
}

// Document Types
export interface Document {
  id: string;
  type: DocumentType;
  url: string;
  name: string;
  size: number;
  uploadedAt: string;
  isVerified: boolean;
}

export type DocumentType = 
  | 'aadhaar'
  | 'pan'
  | 'encumbrance_certificate'
  | 'property_tax_receipt'
  | 'profile_photo'
  | 'portfolio_image';

// Site Types - Aligned with Backend Site Management Service
export interface Site {
  _id: string;
  name: string;
  addressLine1: string;
  addressLine2?: string;
  location: string;
  pincode: string;
  state: string;
  district: string;
  plotArea: number; // in sq ft
  price: number; // in INR
  latitude: number;
  longitude: number;
  status: SiteStatus;
  userId: string;
  brokerId?: string;
  contractorId?: string;
  images?: string[];
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

export type SiteStatus = 'pending' | 'approved' | 'rejected';

// Legacy Property interface for backward compatibility
export interface Property extends Site {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  area: number;
  unit: AreaUnit;
  amenities: string[];
  features: PropertyFeature[];
  broker?: BrokerProfile;
  isVerified: boolean;
  views: number;
}

export type PropertyType =
  | 'residential_plot'
  | 'commercial_plot'
  | 'agricultural_land'
  | 'industrial_plot'
  | 'apartment'
  | 'villa'
  | 'farmhouse';

export type AreaUnit = 'sqft' | 'acres' | 'guntas' | 'cents';

export type PropertyStatus = 'available' | 'sold' | 'under_negotiation' | 'pending_verification';

export interface PropertyImage {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  isPrimary: boolean;
}

export interface PropertyFeature {
  name: string;
  value: string | number | boolean;
  category: 'basic' | 'amenity' | 'legal' | 'location';
}

// Project Types - Aligned with Backend Site Management Service
export interface Project {
  _id: string;
  userId: string;
  projectName: string;
  contractorId?: string;
  brokerId?: string;
  status: ProjectStatus;
  actualStartDate?: string;
  actualEndDate?: string;
  progressLogs: ProgressLog[];
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'Initiated' | 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';

export interface ProgressLog {
  _id: string;
  date: string;
  stage: string;
  description: string;
  addedById: string;
  addedByRole: 'Contractor' | 'Broker';
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequest {
  _id: string;
  projectId: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Broker Types - Aligned with Backend User Management Service
export interface BrokerProfile extends UserProfile {
  licenseNumber?: string;
  experience: number;
  serviceAreas: string[];
  specializations: PropertyType[];
  rating: number;
  reviewCount: number;
  totalSales: number;
  commission: number;
  portfolio: Property[];
  isApproved: boolean;
  approvedAt?: string;
  // Backend uses _id instead of id
  _id: string;
  isVerified: boolean;
}

export interface BrokerApplication {
  _id: string;
  userId: string;
  aadhaarNumber: string;
  nameOnAadhaar: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  aadhaarDocument: string;
  panNumber: string;
  nameOnPAN: string;
  panDocument: string;
  serviceAreas: string[];
  experience: number;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

// Contractor Types - Aligned with Backend User Management Service
export interface ContractorProfile extends UserProfile {
  licenseNumber?: string;
  experience: number;
  serviceAreas: string[];
  specializations: ContractorSpecialization[];
  rating: number;
  reviewCount: number;
  completedProjects: number;
  portfolio: ProjectPortfolio[];
  isApproved: boolean;
  approvedAt?: string;
  // Backend uses _id instead of id
  _id: string;
  isVerified: boolean;
}

export interface ContractorApplication {
  _id: string;
  userId: string;
  aadhaarNumber: string;
  nameOnAadhaar: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  aadhaarDocument: string;
  panNumber: string;
  nameOnPAN: string;
  panDocument: string;
  serviceAreas: string[];
  specializations: ContractorSpecialization[];
  experience: number;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  comments?: string;
}

export type ContractorSpecialization =
  | 'residential_construction'
  | 'commercial_construction'
  | 'interior_design'
  | 'landscaping'
  | 'renovation'
  | 'electrical'
  | 'plumbing'
  | 'painting';

export interface ProjectPortfolio {
  _id: string;
  title: string;
  description: string;
  images: string[];
  type: ContractorSpecialization;
  duration: string;
  cost: number;
  completedAt: string;
  contractorId: string;
}

// Application Types
export type ApplicationStatus = 'pending' | 'approved' | 'rejected' | 'under_review';

// Chat Types
export interface ChatRoom {
  id: string;
  type: ChatType;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  metadata?: ChatMetadata;
}

export type ChatType = 'direct' | 'property_inquiry' | 'broker_client' | 'contractor_client';

export interface ChatMetadata {
  propertyId?: string;
  contractId?: string;
  subject?: string;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  type: MessageType;
  attachments?: MessageAttachment[];
  isRead: boolean;
  sentAt: string;
  editedAt?: string;
}

export type MessageType = 'text' | 'image' | 'document' | 'location' | 'system';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'document' | 'location';
  url: string;
  name: string;
  size?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'file' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  validation?: Record<string, unknown>;
}

// Map Types
export interface MapLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface MapMarker extends MapLocation {
  id: string;
  title: string;
  type: 'property' | 'broker' | 'contractor';
  data: Site | BrokerProfile | ContractorProfile;
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

export type NotificationType =
  | 'property_inquiry'
  | 'application_status'
  | 'message'
  | 'system'
  | 'payment'
  | 'verification';

// Payment Types
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  type: PaymentType;
  description: string;
  userId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  completedAt?: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';
export type PaymentType = 'commission' | 'subscription' | 'listing_fee' | 'premium_feature';

// Admin Types - For Admin Management Service
export interface AdminDashboardStats {
  totalUsers: number;
  totalBrokers: number;
  totalContractors: number;
  totalSites: number;
  totalProjects: number;
  pendingVerifications: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

export interface AdminUser extends User {
  lastLogin?: string;
  status: 'active' | 'inactive' | 'suspended';
  verificationStatus: 'pending' | 'verified' | 'rejected';
}

// Authentication Response Types
export interface LoginResponse {
  message: string;
  accessToken: string;
  sessionId: string;
  user?: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimetype: string;
}
