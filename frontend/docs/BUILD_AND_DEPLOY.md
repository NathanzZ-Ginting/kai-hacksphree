# 🚀 Build and Deploy Guide

## 📋 **Overview**

Panduan komprehensif untuk building, testing, dan deployment aplikasi KAI Frontend menggunakan Vite, CI/CD workflows, dan deployment strategies yang optimal.

## 🏗️ **Build System Architecture**

### **Vite Build Configuration**
```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react({
        // React Fast Refresh configuration
        fastRefresh: true,
        // JSX runtime configuration
        jsxRuntime: 'automatic',
      }),
      
      // PWA Configuration
      VitePWA({
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/api\.kai\.id\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'kai-api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 hours
                },
              },
            },
          ],
        },
        manifest: {
          name: 'KAI Booking System',
          short_name: 'KAI',
          description: 'Indonesia Railway Booking System',
          theme_color: '#0066CC',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'portrait-primary',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'icons/icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icons/icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
      
      // Bundle analyzer (only in build mode)
      command === 'build' && visualizer({
        filename: 'dist/stats.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),

    // Path resolution
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@components': resolve(__dirname, 'src/components'),
        '@pages': resolve(__dirname, 'src/pages'),
        '@hooks': resolve(__dirname, 'src/hooks'),
        '@context': resolve(__dirname, 'src/context'),
        '@utils': resolve(__dirname, 'src/utils'),
        '@types': resolve(__dirname, 'src/types'),
        '@assets': resolve(__dirname, 'src/assets'),
      },
    },

    // Development server configuration
    server: {
      port: 3000,
      host: true,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },

    // Preview server configuration
    preview: {
      port: 4173,
      host: true,
      cors: true,
    },

    // Build configuration
    build: {
      target: 'esnext',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      minify: 'terser',
      
      // Terser options for production builds
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production',
        },
      },

      // Rollup options
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          // Chunk splitting strategy
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'routing': ['react-router-dom'],
            'ui-vendor': ['@headlessui/react', '@heroicons/react'],
            
            // Feature chunks
            'auth': [
              'src/context/AuthContext',
              'src/pages/auth',
            ],
            'booking': [
              'src/context/BookingContext',
              'src/pages/BookingPage',
            ],
          },
          
          // Asset naming
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop()
              : 'chunk';
            return `js/${facadeModuleId}-[hash].js`;
          },
          assetFileNames: 'assets/[name]-[hash].[ext]',
          entryFileNames: 'js/[name]-[hash].js',
        },
      },

      // Asset handling
      assetsInlineLimit: 4096, // 4KB
    },

    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // CSS configuration
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
      postcss: {
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
          require('cssnano')({
            preset: 'default',
          }),
        ],
      },
    },

    // Optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@headlessui/react',
        '@heroicons/react/24/outline',
        '@heroicons/react/24/solid',
      ],
      exclude: ['@vite/client', '@vite/env'],
    },

    // ESBuild configuration
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' },
    },
  };
});
```

### **Environment Configuration**
```typescript
// src/config/environment.ts
interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  API_BASE_URL: string;
  API_TIMEOUT: number;
  STORAGE_PREFIX: string;
  SENTRY_DSN?: string;
  GOOGLE_ANALYTICS_ID?: string;
  RECAPTCHA_SITE_KEY: string;
  PAYMENT_GATEWAY_URL: string;
  WS_URL: string;
  CDN_URL: string;
  FEATURE_FLAGS: {
    enablePWA: boolean;
    enableAnalytics: boolean;
    enableNotifications: boolean;
    enableOfflineMode: boolean;
  };
}

function getEnvironmentConfig(): EnvironmentConfig {
  const env = import.meta.env;
  
  return {
    NODE_ENV: env.MODE as 'development' | 'production' | 'test',
    API_BASE_URL: env.VITE_API_BASE_URL || 'http://localhost:5000',
    API_TIMEOUT: parseInt(env.VITE_API_TIMEOUT || '10000', 10),
    STORAGE_PREFIX: env.VITE_STORAGE_PREFIX || 'kai_',
    SENTRY_DSN: env.VITE_SENTRY_DSN,
    GOOGLE_ANALYTICS_ID: env.VITE_GA_ID,
    RECAPTCHA_SITE_KEY: env.VITE_RECAPTCHA_SITE_KEY || '',
    PAYMENT_GATEWAY_URL: env.VITE_PAYMENT_GATEWAY_URL || '',
    WS_URL: env.VITE_WS_URL || 'ws://localhost:5000',
    CDN_URL: env.VITE_CDN_URL || '',
    FEATURE_FLAGS: {
      enablePWA: env.VITE_ENABLE_PWA === 'true',
      enableAnalytics: env.VITE_ENABLE_ANALYTICS === 'true',
      enableNotifications: env.VITE_ENABLE_NOTIFICATIONS === 'true',
      enableOfflineMode: env.VITE_ENABLE_OFFLINE_MODE === 'true',
    },
  };
}

export const config = getEnvironmentConfig();

// Type-safe environment variables
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_STORAGE_PREFIX: string;
    readonly VITE_SENTRY_DSN: string;
    readonly VITE_GA_ID: string;
    readonly VITE_RECAPTCHA_SITE_KEY: string;
    readonly VITE_PAYMENT_GATEWAY_URL: string;
    readonly VITE_WS_URL: string;
    readonly VITE_CDN_URL: string;
    readonly VITE_ENABLE_PWA: string;
    readonly VITE_ENABLE_ANALYTICS: string;
    readonly VITE_ENABLE_NOTIFICATIONS: string;
    readonly VITE_ENABLE_OFFLINE_MODE: string;
  }
}
```

### **Environment Files Structure**
```bash
# .env (default/fallback values)
VITE_API_BASE_URL=http://localhost:5000
VITE_API_TIMEOUT=10000
VITE_STORAGE_PREFIX=kai_
VITE_ENABLE_PWA=false
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE_MODE=false

# .env.development
VITE_API_BASE_URL=http://localhost:5000
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=false

# .env.staging
VITE_API_BASE_URL=https://api-staging.kai.id
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# .env.production
VITE_API_BASE_URL=https://api.kai.id
VITE_ENABLE_PWA=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_OFFLINE_MODE=true
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_GA_ID=GA_MEASUREMENT_ID
VITE_RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

## 📦 **Package.json Scripts**

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:staging": "tsc && vite build --mode staging",
    "build:production": "tsc && vite build --mode production",
    "preview": "vite preview",
    "preview:production": "vite preview --mode production",
    
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    
    "analyze": "npm run build && npx vite-bundle-analyzer dist/stats.html",
    "clean": "rm -rf dist node_modules/.vite",
    "clean:all": "rm -rf dist node_modules node_modules/.vite package-lock.json",
    
    "docker:build": "docker build -t kai-frontend .",
    "docker:run": "docker run -p 3000:80 kai-frontend",
    
    "prepare": "husky install",
    "postinstall": "npm run type-check"
  }
}
```

## 🐳 **Docker Configuration**

### **Dockerfile**
```dockerfile
# Build stage
FROM node:18-alpine as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production --silent

# Copy source code
COPY . .

# Build application
RUN npm run build:production

# Production stage
FROM nginx:alpine as production

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

### **Docker Compose**
```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - "3000:80"
    environment:
      - NODE_ENV=production
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Development compose
  frontend-dev:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev
```

### **Nginx Configuration**
```nginx
# nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log notice;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logging
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Brotli compression (if module available)
    # brotli on;
    # brotli_comp_level 6;
    # brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https: wss:;" always;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
        }

        # Handle SPA routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # API proxy (if needed)
        location /api/ {
            proxy_pass http://backend:5000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # Health check endpoint
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }

        # Error pages
        error_page 404 /index.html;
        error_page 500 502 503 504 /50x.html;
        location = /50x.html {
            root /usr/share/nginx/html;
        }
    }
}
```

## 🔄 **CI/CD Workflows**

### **GitHub Actions**
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Code Quality
  quality:
    name: Code Quality
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type checking
        run: npm run type-check

      - name: Linting
        run: npm run lint

      - name: Format checking
        run: npm run format:check

      - name: Unit tests
        run: npm run test:run

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info

  # Build and Test
  build:
    name: Build Application
    runs-on: ubuntu-latest
    needs: quality
    strategy:
      matrix:
        environment: [staging, production]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build:${{ matrix.environment }}
        env:
          VITE_API_BASE_URL: ${{ secrets[format('VITE_API_BASE_URL_{0}', upper(matrix.environment))] }}
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}
          VITE_GA_ID: ${{ secrets.VITE_GA_ID }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build-${{ matrix.environment }}
          path: dist
          retention-days: 7

  # E2E Testing
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright
        run: npx playwright install --with-deps

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build-staging

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload E2E results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  # Security Scan
  security:
    name: Security Scan
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # Docker Build
  docker:
    name: Build Docker Image
    runs-on: ubuntu-latest
    needs: [quality, build]
    if: github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # Deploy to Staging
  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: [docker, e2e]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.kai.id
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging environment"
          # Add your deployment commands here

  # Deploy to Production
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: [docker, e2e]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://kai.id
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production environment"
          # Add your deployment commands here
```

### **Pre-commit Hooks**
```yaml
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# Run lint-staged
npx lint-staged

# Run type checking
npm run type-check
```

```json
// package.json (lint-staged configuration)
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{js,jsx,json,css,md}": [
      "prettier --write"
    ]
  }
}
```

## 🌐 **Deployment Strategies**

### **Vercel Deployment**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/assets/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@api_base_url",
    "VITE_SENTRY_DSN": "@sentry_dsn"
  }
}
```

### **Netlify Deployment**
```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build:production"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "https://api.kai.id/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### **AWS S3 + CloudFront**
```yaml
# aws-deploy.yml (GitHub Actions)
deploy-aws:
  name: Deploy to AWS
  runs-on: ubuntu-latest
  needs: build
  if: github.ref == 'refs/heads/main'
  steps:
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-southeast-1

    - name: Download build artifacts
      uses: actions/download-artifact@v4
      with:
        name: build-production

    - name: Deploy to S3
      run: |
        aws s3 sync dist/ s3://${{ secrets.S3_BUCKET_NAME }} --delete --cache-control max-age=31536000
        aws s3 cp dist/index.html s3://${{ secrets.S3_BUCKET_NAME }}/index.html --cache-control max-age=0

    - name: Invalidate CloudFront
      run: |
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

## 📊 **Performance Optimization**

### **Bundle Analysis**
```bash
# Generate bundle analysis
npm run analyze

# Check bundle size
npm run build && ls -la dist/assets/
```

### **Performance Monitoring**
```typescript
// src/utils/performance.ts
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
}

export function measurePerformance(): Promise<PerformanceMetrics> {
  return new Promise((resolve) => {
    const metrics: Partial<PerformanceMetrics> = {};

    // Web Vitals
    import('web-vitals').then(({ getFCP, getLCP, getFID, getCLS, getTTFB }) => {
      getFCP((metric) => {
        metrics.fcp = metric.value;
      });

      getLCP((metric) => {
        metrics.lcp = metric.value;
      });

      getFID((metric) => {
        metrics.fid = metric.value;
      });

      getCLS((metric) => {
        metrics.cls = metric.value;
      });

      getTTFB((metric) => {
        metrics.ttfb = metric.value;
      });

      // Wait for all metrics to be collected
      setTimeout(() => {
        resolve(metrics as PerformanceMetrics);
      }, 1000);
    });
  });
}

// Report to analytics
export async function reportPerformance() {
  if (config.FEATURE_FLAGS.enableAnalytics) {
    const metrics = await measurePerformance();
    
    // Send to your analytics service
    gtag('event', 'web_vitals', {
      event_category: 'performance',
      event_label: 'core_web_vitals',
      value: Math.round(metrics.lcp),
      custom_map: {
        metric_fcp: metrics.fcp,
        metric_lcp: metrics.lcp,
        metric_fid: metrics.fid,
        metric_cls: metrics.cls,
        metric_ttfb: metrics.ttfb,
      },
    });
  }
}
```

## 🔍 **Monitoring and Logging**

### **Error Tracking with Sentry**
```typescript
// src/utils/sentry.ts
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { config } from '../config/environment';

export function initSentry() {
  if (config.SENTRY_DSN && config.NODE_ENV === 'production') {
    Sentry.init({
      dsn: config.SENTRY_DSN,
      environment: config.NODE_ENV,
      integrations: [
        new BrowserTracing({
          tracingOrigins: [config.API_BASE_URL],
        }),
      ],
      tracesSampleRate: 0.1,
      beforeSend(event) {
        // Filter out non-critical errors
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.type === 'ChunkLoadError') {
            return null; // Don't report chunk load errors
          }
        }
        return event;
      },
    });
  }
}

export function captureException(error: Error, context?: Record<string, any>) {
  if (config.NODE_ENV === 'production') {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error captured:', error, context);
  }
}
```

### **Analytics Integration**
```typescript
// src/utils/analytics.ts
import { config } from '../config/environment';

declare global {
  interface Window {
    gtag: (command: string, targetId: string, config?: any) => void;
  }
}

export function initAnalytics() {
  if (config.GOOGLE_ANALYTICS_ID && config.FEATURE_FLAGS.enableAnalytics) {
    // Load Google Analytics
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.GOOGLE_ANALYTICS_ID}`;
    script.async = true;
    document.head.appendChild(script);

    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      (window as any).dataLayer = (window as any).dataLayer || [];
      // eslint-disable-next-line prefer-rest-params
      (window as any).dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', config.GOOGLE_ANALYTICS_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (config.FEATURE_FLAGS.enableAnalytics && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

export function trackPageView(path: string, title: string) {
  if (config.FEATURE_FLAGS.enableAnalytics && window.gtag) {
    window.gtag('config', config.GOOGLE_ANALYTICS_ID!, {
      page_path: path,
      page_title: title,
    });
  }
}
```

## 🚀 **Deployment Checklist**

### **Pre-deployment**
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code coverage meets requirements (>80%)
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Security scan passes
- [ ] Performance budget met
- [ ] Bundle size analysis completed
- [ ] Environment variables configured
- [ ] Error tracking set up
- [ ] Analytics configured

### **Post-deployment**
- [ ] Health check endpoints responding
- [ ] Core user flows tested
- [ ] Performance metrics within acceptable range
- [ ] Error rates normal
- [ ] Analytics tracking working
- [ ] CDN cache properly configured
- [ ] SSL certificate valid
- [ ] Security headers present

---

**🚀 Streamlined Build & Deploy - Fast, Reliable, Scalable** ✨
