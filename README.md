# BUILD-CONNECT Website

A modern, responsive web application that mirrors the functionality and design of the BUILD-CONNECT mobile app - a comprehensive platform connecting property buyers and sellers, site scouts (brokers), contractors, and facilitating real estate transactions with integrated chat, map exploration, and AI-powered features.

## 🚀 Features

### Core Features

- **Property Management**: Browse, list, and manage properties with advanced filtering
- **Broker Network**: Connect with verified site scouts and brokers
- **Contractor Directory**: Find trusted contractors for construction projects
- **Interactive Maps**: Explore properties with Google Maps integration
- **Real-time Chat**: Socket.IO powered messaging system
- **AI-Powered Features**: Document verification and property valuation
- **Payment Integration**: Secure payment processing with Stripe
- **Admin Panel**: Comprehensive admin dashboard for platform management

### Design System

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Dark/Light Mode**: Theme switching with system preference detection
- **Mobile-First**: Responsive design optimized for all devices
- **Accessibility**: WCAG 2.1 AA compliant components

## 🛠 Technology Stack

### Frontend

- **Framework**: Next.js 14+ with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query + Zustand
- **Authentication**: NextAuth.js with JWT tokens
- **Real-time**: Socket.IO for chat functionality
- **Maps**: Google Maps API integration
- **UI Components**: Headless UI + Radix UI with custom styling
- **Forms**: React Hook Form with Yup validation
- **File Upload**: React Dropzone with image optimization

### Backend Integration

- **API**: RESTful API with Next.js API routes
- **Database**: Compatible with existing mobile app backend
- **File Storage**: Cloud storage integration
- **Payments**: Stripe integration

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── properties/        # Property management
│   ├── brokers/           # Broker system
│   ├── contractors/       # Contractor network
│   ├── map/               # Map explorer
│   ├── chat/              # Chat system
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   ├── features/          # Feature-specific components
│   └── shared/            # Shared components
├── context/               # React contexts
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and configurations
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
└── styles/                # Global styles and Tailwind config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd build-connect-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000

   # Google Maps API
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
   STRIPE_SECRET_KEY=your-stripe-secret-key

   # Socket.IO
   NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Design System

### Color Palette

```css
/* Light Theme */
--color-primary: #2a8e9e --color-secondary: #001d3d --color-background: #f5f7fa
  --color-card: #ffffff --color-accent: #e6f3f7 /* Dark Theme */
  --color-background: #121212 --color-card: #1e1e1e --color-accent: #1b2a33;
```

### Typography

- **Primary Font**: Inter (Google Fonts)
- **Secondary Font**: PlaywriteDKLoopet-Thin (for branding)

### Components

- Buttons with multiple variants (primary, secondary, outline, ghost)
- Cards with hover effects and shadows
- Form inputs with validation states
- Modal dialogs with animations
- Loading states and skeletons

## 📱 Mobile App Integration

This website is designed to complement the existing BUILD-CONNECT mobile app:

- **Shared API**: Uses the same backend services
- **Consistent Design**: Matches mobile app's visual language
- **Feature Parity**: Implements all major mobile app features
- **Cross-Platform Sync**: Real-time synchronization between web and mobile

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Code Style

- **ESLint**: Configured with Next.js recommended rules
- **Prettier**: Automatic code formatting with Tailwind CSS plugin
- **TypeScript**: Strict type checking enabled

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Other Platforms

- **Netlify**: Compatible with static export
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment option

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🔮 Roadmap

### Phase 1 (Current)

- [x] Project setup and architecture
- [x] Design system implementation
- [ ] Authentication system
- [ ] Core layout and navigation

### Phase 2

- [ ] Property management system
- [ ] Broker/Site Scout system
- [ ] Contractor network
- [ ] Interactive map explorer

### Phase 3

- [ ] Real-time chat system
- [ ] AI-powered features
- [ ] Payment integration
- [ ] Admin panel

### Phase 4

- [ ] Testing and optimization
- [ ] Performance improvements
- [ ] SEO optimization
- [ ] PWA features

---

Built with ❤️ by the BUILD-CONNECT team
