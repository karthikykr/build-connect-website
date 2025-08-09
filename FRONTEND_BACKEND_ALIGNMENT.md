# Frontend-Backend API Alignment

This document outlines how the Build Connect frontend has been aligned with the backend microservices architecture.

## Backend Architecture Overview

The backend consists of 8 microservices orchestrated through an API Gateway:

- **API Gateway**: Port 8080 (Main entry point)
- **User Management Service**: Port 3007
- **Admin Management Service**: Port 3001
- **Site Management Service**: Port 3006
- **Payment Management Service**: Port 3004
- **Rating Management Service**: Port 3005
- **Notification Management Service**: Port 3003
- **Customer Support Service**: Port 3002

## Frontend Configuration Updates

### Environment Variables (.env.local)
```bash
# Updated API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# NextAuth Configuration
NEXTAUTH_SECRET=build-connect-secret-key-for-development-only-change-in-production
NEXTAUTH_URL=http://localhost:3000

# Socket.IO Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

### API Client Configuration
- **Base URL**: Updated to use API Gateway at `http://localhost:8080`
- **Authentication**: JWT-based with NextAuth integration
- **Error Handling**: Centralized error handling with toast notifications

## Service Alignment

### 1. Authentication Service (`auth.service.ts`)

**Backend Endpoints (User Management Service):**
- `POST /user-service/api/v1/login` - User login
- `POST /user-service/api/v1/signup` - User registration
- `POST /user-service/api/v1/refresh` - Refresh token
- `GET /user-service/api/v1/user/profile` - Get user profile
- `PUT /user-service/api/v1/user/profile` - Update user profile

**Frontend Implementation:**
- ✅ Updated login endpoint
- ✅ Updated registration endpoint
- ✅ Updated refresh token endpoint
- ✅ Updated profile management endpoints
- ✅ NextAuth integration with backend API

### 2. Brokers Service (`brokers.service.ts`)

**Backend Endpoints (User Management Service):**
- `GET /user-service/api/v1/brokers/all` - Get all brokers
- `GET /user-service/api/v1/brokers/profile/:brokerId` - Get broker profile
- `POST /user-service/api/v1/brokers` - Create broker application
- `PATCH /user-service/api/v1/brokers/:brokerId` - Update broker application
- `GET /user-service/api/v1/brokers` - Get broker application by user ID

**Frontend Implementation:**
- ✅ Updated broker listing endpoint
- ✅ Updated broker profile endpoint
- ✅ Updated broker application endpoints
- ✅ File upload support for documents

### 3. Contractors Service (`contractors.service.ts`) - NEW

**Backend Endpoints (User Management Service):**
- `GET /user-service/api/v1/contractors/all` - Get all contractors
- `GET /user-service/api/v1/contractors/profile/:contractorId` - Get contractor profile
- `POST /user-service/api/v1/contractors` - Create contractor application
- `PATCH /user-service/api/v1/contractors/:contractorId` - Update contractor application
- `GET /user-service/api/v1/contractors` - Get contractor application by user ID
- `POST /user-service/api/v1/contractors/portfolio` - Add portfolio item
- `PATCH /user-service/api/v1/contractors/portfolio/:portfolioItemId` - Update portfolio item
- `DELETE /user-service/api/v1/contractors/portfolio/:portfolioItemId` - Delete portfolio item
- `GET /user-service/api/v1/contractors/:contractorId/portfolio` - Get portfolio items

**Frontend Implementation:**
- ✅ Complete contractor service implementation
- ✅ Portfolio management functionality
- ✅ File upload support for documents and images
- ✅ Application status tracking

### 4. Sites Service (`sites.service.ts`) - NEW

**Backend Endpoints (Site Management Service):**
- `GET /site-service/api/v1/sites` - Get sites with filtering
- `GET /site-service/api/v1/sites/:id` - Get site by ID
- `GET /site-service/api/v1/user/sites` - Get sites by current user
- `POST /site-service/api/v1/sites` - Add new site
- `PATCH /site-service/api/v1/sites/:id` - Update site
- `DELETE /site-service/api/v1/sites/:siteId/assets/:assetId` - Delete site asset

**Project Management:**
- `POST /site-service/api/v1/projects` - Submit project with requirements
- `PATCH /site-service/api/v1/projects/:projectId` - Update project
- `GET /site-service/api/v1/projects/:projectId` - Get project by ID
- `GET /site-service/api/v1/projects` - Get all projects

**Service Requests:**
- `POST /site-service/api/v1/projects/:projectId/service-requests` - Create service request
- `GET /site-service/api/v1/service-requests` - Get received service requests
- `GET /site-service/api/v1/service-requests/sent` - Get sent service requests
- `PATCH /site-service/api/v1/service-request/:projectID` - Accept/update service request

**Progress Management:**
- `POST /site-service/api/v1/projects/:projectId/progress` - Add progress log
- `GET /site-service/api/v1/projects/:projectId/progress` - Get progress logs
- `PATCH /site-service/api/v1/projects/:projectId/progress/:logId` - Update progress log
- `DELETE /site-service/api/v1/projects/:projectId/progress/:logId` - Delete progress log

**Frontend Implementation:**
- ✅ Complete site management functionality
- ✅ Project requirements management
- ✅ Service request system
- ✅ Progress tracking system
- ✅ File upload support for images and documents

### 5. Professional Listings

**Backend Endpoints (User Management Service):**
- `GET /user-service/api/v1/professionals/brokers` - Get brokers for project service requests
- `GET /user-service/api/v1/professionals/contractors` - Get contractors for project service requests

**Frontend Implementation:**
- ✅ Professional listing endpoints integrated

## API Routes Alignment

### Frontend API Routes (Next.js)
- `POST /api/auth/login` - Proxies to `/user-service/api/v1/login`
- `POST /api/auth/register` - Proxies to `/user-service/api/v1/signup`

### NextAuth Configuration
- ✅ Updated to use backend authentication endpoints
- ✅ JWT strategy with backend token validation
- ✅ Role-based redirects (admin, broker, contractor)
- ✅ Session management with backend integration

## File Upload Support

All services that require file uploads have been configured with:
- ✅ FormData handling for multipart uploads
- ✅ Support for images, documents, and certificates
- ✅ Proper content type headers
- ✅ Error handling for upload failures

## Error Handling

- ✅ Centralized error handling in API client
- ✅ Toast notifications for success/error messages
- ✅ Proper HTTP status code handling
- ✅ Validation error display

## Authentication Flow

1. **Login**: User submits credentials → NextAuth → Backend API → JWT token
2. **Session**: JWT stored in NextAuth session → Attached to API requests
3. **Refresh**: Automatic token refresh using backend refresh endpoint
4. **Logout**: Clear NextAuth session → Backend logout (if needed)

## Testing Recommendations

1. **Authentication Testing**:
   - Test login with valid/invalid credentials
   - Test registration with different user roles
   - Test token refresh functionality
   - Test role-based redirects

2. **Service Testing**:
   - Test broker application flow
   - Test contractor application and portfolio management
   - Test site creation and management
   - Test project and service request workflows

3. **File Upload Testing**:
   - Test document uploads for applications
   - Test image uploads for portfolios and sites
   - Test file size and type validation

## Next Steps

1. **Frontend Components**: Update existing components to use new service methods
2. **Type Definitions**: Ensure TypeScript types match backend response structures
3. **Error Boundaries**: Implement error boundaries for better error handling
4. **Loading States**: Add proper loading states for all API calls
5. **Caching**: Implement React Query for better data caching and synchronization

## Mobile App Alignment

The React Native mobile app already uses the correct API endpoints:
- ✅ Uses `/user-service/api/v1/` endpoints
- ✅ Proper authentication flow
- ✅ File upload support

The web frontend is now aligned with the mobile app's API usage.
