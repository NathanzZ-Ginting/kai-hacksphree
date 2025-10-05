# 🚂 KAI-HACKSPHREE Frontend

Digital Railway Ticketing Platform - Frontend Application

A modern, responsive React 19 application built with TypeScript and Vite, providing an intuitive user interface for railway ticket booking and management.

## 🚀 Tech Stack

- **React 19** - Latest React version with concurrent features
- **TypeScript 5.9+** - Type-safe development
- **Vite 7.1.7** - Lightning-fast development and build tool
- **Tailwind CSS 4** - Utility-first CSS framework
- **React Router DOM 7** - Client-side routing
- **Lucide React** - Beautiful SVG icons
- **@tailwindcss/forms** - Form styling utilities

## ✨ Features

- 🎫 **Ticket Booking** - Search, select, and book train tickets
- 🔐 **Authentication** - Secure user registration and login
- 📱 **Responsive Design** - Mobile-first approach with excellent UX
- ⚡ **Real-time Updates** - Live seat availability and pricing
- 💳 **Payment Integration** - Secure payment processing with Midtrans
- 🎨 **Modern UI** - Clean, intuitive interface with smooth animations
- 🔍 **Advanced Search** - Filter by route, time, class, and price
- 📊 **Booking Management** - View and manage ticket history

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NathanzZ-Ginting/kai-hacksphree.git
   cd kai-hacksphree/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   ```bash
   # Create environment file
   cp .env.example .env.local
   
   # Configure environment variables
   VITE_API_BASE_URL=http://localhost:3000/api/v1
   VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
   VITE_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:5173`

## 🏗️ Build & Deployment

### Development Build
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint checks
npm run type-check   # TypeScript type checking
```

### Production Deployment
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel/Netlify (example)
npm run build && npm run deploy
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── sections/        # Page sections (Hero, Features, etc.)
│   └── ui/              # Base UI components (Button, Input, Modal)
├── context/             # React Context providers
│   └── AuthContext.tsx  # Authentication state management
├── hooks/               # Custom React hooks
│   ├── useDebounce.ts   # Debounce hook for search
│   └── useLazyLoad.ts   # Lazy loading optimization
├── pages/               # Application pages/routes
│   ├── auth/            # Authentication pages
│   └── services/        # Service-related pages
├── types/               # TypeScript type definitions
│   └── kai.ts           # Application-specific types
├── utils/               # Utility functions
│   └── analytics.ts     # Analytics and tracking
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## 🎨 UI Components

### Core Components
- **Layout Components**: Header, Footer, Navigation, Sidebar
- **Form Components**: Input, Button, Select, DatePicker
- **Display Components**: Card, Modal, Toast, Loading
- **Navigation**: Breadcrumb, Pagination, Tabs

### Page Components
- **Authentication**: Login, Register, Password Reset
- **Booking**: Search, Results, Seat Selection, Payment
- **User Dashboard**: Profile, Booking History, Settings
- **Information**: Routes, Services, Help, News

## 🔧 Configuration

### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
## 🧪 Testing

### Testing Strategy
```bash
# Unit testing with Vitest
npm run test

# Component testing with React Testing Library
npm run test:components

# E2E testing with Cypress
npm run test:e2e

# Test coverage report
npm run test:coverage
```

### Example Test
```typescript
// src/components/ui/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## 🎯 Performance Optimization

### Bundle Optimization
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image compression and lazy loading
- **Caching**: Service worker for offline support

### Core Web Vitals Targets
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Performance Monitoring
```typescript
// src/utils/analytics.ts
export const trackPerformance = () => {
  // Web Vitals tracking
  getCLS(console.log);
  getFID(console.log);
  getFCP(console.log);
  getLCP(console.log);
  getTTFB(console.log);
};
```

## 🔒 Security Best Practices

### Content Security Policy
```typescript
// Security headers configuration
const securityHeaders = {
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://www.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' ${process.env.VITE_API_BASE_URL};
  `,
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};
```

### Input Validation
```typescript
// Form validation with Zod
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});
```

## 🚀 Deployment

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod
```

### Netlify Deployment
```bash
# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### Code Style Guidelines
- Use TypeScript for all new components
- Follow React hooks best practices
- Implement responsive design patterns
- Write comprehensive tests
- Document complex functionality

## 📚 Resources

- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@kai-hacksphree.com or create an issue in the GitHub repository.

---

**Frontend Team**: Expert React developers building the next generation of railway ticketing interfaces  
**Last Updated**: October 2025  
**Version**: 1.0.0

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```
