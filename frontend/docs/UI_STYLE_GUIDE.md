# 🎨 KAI Design System & UI Style Guide

## 📋 **Overview**

Design system KAI Frontend yang komprehensif untuk memastikan konsistensi visual, aksesibilitas, dan pengalaman pengguna yang optimal di seluruh aplikasi.

## 🏗️ **Design Principles**

### **1. Accessibility First**
- WCAG 2.1 AA compliance untuk semua komponen
- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios

### **2. Mobile-First Responsive**
- Progressive enhancement dari mobile ke desktop
- Flexible grid system
- Touch-friendly interface elements
- Optimized untuk berbagai screen sizes

### **3. Brand Consistency**
- Consistent KAI brand representation
- Professional dan trustworthy appearance
- Indonesian cultural elements
- Transportation industry standards

### **4. User-Centered Design**
- Intuitive navigation patterns
- Clear information hierarchy
- Efficient task completion flows
- Reduced cognitive load

## 🎨 **Color System**

### **Primary Palette**
```css
/* KAI Brand Colors */
:root {
  /* Primary Blue - KAI Brand */
  --kai-primary-50: #EBF8FF;
  --kai-primary-100: #BEE3F8;
  --kai-primary-200: #90CDF4;
  --kai-primary-300: #63B3ED;
  --kai-primary-400: #4299E1;
  --kai-primary-500: #0066CC;    /* Main KAI Blue */
  --kai-primary-600: #2B77CB;
  --kai-primary-700: #2C5AA0;
  --kai-primary-800: #2A4365;
  --kai-primary-900: #1A202C;

  /* Secondary Orange */
  --kai-secondary-50: #FFFAF0;
  --kai-secondary-100: #FEEBC8;
  --kai-secondary-200: #FBD38D;
  --kai-secondary-300: #F6AD55;
  --kai-secondary-400: #ED8936;
  --kai-secondary-500: #FF6B35;   /* Accent Orange */
  --kai-secondary-600: #C05621;
  --kai-secondary-700: #9C4221;
  --kai-secondary-800: #7B341E;
  --kai-secondary-900: #652B19;
}
```

### **Semantic Colors**
```css
:root {
  /* Success */
  --kai-success-50: #F0FDF4;
  --kai-success-100: #DCFCE7;
  --kai-success-200: #BBF7D0;
  --kai-success-300: #86EFAC;
  --kai-success-400: #4ADE80;
  --kai-success-500: #22C55E;
  --kai-success-600: #16A34A;
  --kai-success-700: #15803D;
  --kai-success-800: #166534;
  --kai-success-900: #14532D;

  /* Warning */
  --kai-warning-50: #FFFBEB;
  --kai-warning-100: #FEF3C7;
  --kai-warning-200: #FDE68A;
  --kai-warning-300: #FCD34D;
  --kai-warning-400: #FBBF24;
  --kai-warning-500: #F59E0B;
  --kai-warning-600: #D97706;
  --kai-warning-700: #B45309;
  --kai-warning-800: #92400E;
  --kai-warning-900: #78350F;

  /* Error */
  --kai-error-50: #FEF2F2;
  --kai-error-100: #FEE2E2;
  --kai-error-200: #FECACA;
  --kai-error-300: #FCA5A5;
  --kai-error-400: #F87171;
  --kai-error-500: #EF4444;
  --kai-error-600: #DC2626;
  --kai-error-700: #B91C1C;
  --kai-error-800: #991B1B;
  --kai-error-900: #7F1D1D;

  /* Info */
  --kai-info-50: #EFF6FF;
  --kai-info-100: #DBEAFE;
  --kai-info-200: #BFDBFE;
  --kai-info-300: #93C5FD;
  --kai-info-400: #60A5FA;
  --kai-info-500: #3B82F6;
  --kai-info-600: #2563EB;
  --kai-info-700: #1D4ED8;
  --kai-info-800: #1E40AF;
  --kai-info-900: #1E3A8A;
}
```

### **Neutral Palette**
```css
:root {
  /* Gray Scale */
  --kai-gray-50: #F9FAFB;
  --kai-gray-100: #F3F4F6;
  --kai-gray-200: #E5E7EB;
  --kai-gray-300: #D1D5DB;
  --kai-gray-400: #9CA3AF;
  --kai-gray-500: #6B7280;
  --kai-gray-600: #4B5563;
  --kai-gray-700: #374151;
  --kai-gray-800: #1F2937;
  --kai-gray-900: #111827;

  /* Black & White */
  --kai-white: #FFFFFF;
  --kai-black: #000000;
}
```

### **Usage Guidelines**

#### **Primary Colors**
```css
/* ✅ Good Usage */
.button-primary {
  background-color: var(--kai-primary-500);
  color: var(--kai-white);
}

.button-primary:hover {
  background-color: var(--kai-primary-600);
}

/* Navigation active state */
.nav-active {
  color: var(--kai-primary-600);
  border-bottom: 2px solid var(--kai-primary-500);
}
```

#### **Semantic Colors**
```css
/* Success states */
.alert-success {
  background-color: var(--kai-success-50);
  border: 1px solid var(--kai-success-200);
  color: var(--kai-success-800);
}

/* Error states */
.form-error {
  border-color: var(--kai-error-500);
  color: var(--kai-error-600);
}

/* Warning states */
.notification-warning {
  background-color: var(--kai-warning-100);
  color: var(--kai-warning-800);
}
```

## 🔤 **Typography**

### **Font Family**
```css
:root {
  /* Primary Font Stack */
  --font-family-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  
  /* Secondary Font Stack (untuk headings) */
  --font-family-secondary: 'Inter', system-ui, sans-serif;
  
  /* Monospace (untuk code) */
  --font-family-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
}
```

### **Font Scale**
```css
:root {
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  --text-7xl: 4.5rem;      /* 72px */
  --text-8xl: 6rem;        /* 96px */
  --text-9xl: 8rem;        /* 128px */

  /* Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;

  /* Font Weights */
  --font-thin: 100;
  --font-extralight: 200;
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  --font-black: 900;
}
```

### **Typography Hierarchy**
```css
/* Heading Styles */
.heading-1 {
  font-size: var(--text-5xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--kai-gray-900);
  margin-bottom: 1.5rem;
}

.heading-2 {
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--kai-gray-900);
  margin-bottom: 1.25rem;
}

.heading-3 {
  font-size: var(--text-3xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--kai-gray-900);
  margin-bottom: 1rem;
}

.heading-4 {
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
  color: var(--kai-gray-800);
  margin-bottom: 0.75rem;
}

.heading-5 {
  font-size: var(--text-xl);
  font-weight: var(--font-medium);
  line-height: var(--leading-snug);
  color: var(--kai-gray-800);
  margin-bottom: 0.5rem;
}

.heading-6 {
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  color: var(--kai-gray-700);
  margin-bottom: 0.5rem;
}

/* Body Text */
.body-large {
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
  color: var(--kai-gray-700);
}

.body-base {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--kai-gray-700);
}

.body-small {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--kai-gray-600);
}

/* Utility Text */
.caption {
  font-size: var(--text-xs);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--kai-gray-500);
}

.overline {
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
  color: var(--kai-gray-600);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
```

### **Responsive Typography**
```css
/* Mobile-first responsive headings */
.responsive-heading-1 {
  font-size: var(--text-3xl);
  
  @media (min-width: 640px) {
    font-size: var(--text-4xl);
  }
  
  @media (min-width: 1024px) {
    font-size: var(--text-5xl);
  }
}

.responsive-heading-2 {
  font-size: var(--text-2xl);
  
  @media (min-width: 640px) {
    font-size: var(--text-3xl);
  }
  
  @media (min-width: 1024px) {
    font-size: var(--text-4xl);
  }
}
```

## 📐 **Spacing System**

### **Spacing Scale**
```css
:root {
  /* Base unit: 0.25rem (4px) */
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;    /* 2px */
  --space-1: 0.25rem;       /* 4px */
  --space-1-5: 0.375rem;    /* 6px */
  --space-2: 0.5rem;        /* 8px */
  --space-2-5: 0.625rem;    /* 10px */
  --space-3: 0.75rem;       /* 12px */
  --space-3-5: 0.875rem;    /* 14px */
  --space-4: 1rem;          /* 16px */
  --space-5: 1.25rem;       /* 20px */
  --space-6: 1.5rem;        /* 24px */
  --space-7: 1.75rem;       /* 28px */
  --space-8: 2rem;          /* 32px */
  --space-9: 2.25rem;       /* 36px */
  --space-10: 2.5rem;       /* 40px */
  --space-11: 2.75rem;      /* 44px */
  --space-12: 3rem;         /* 48px */
  --space-14: 3.5rem;       /* 56px */
  --space-16: 4rem;         /* 64px */
  --space-20: 5rem;         /* 80px */
  --space-24: 6rem;         /* 96px */
  --space-28: 7rem;         /* 112px */
  --space-32: 8rem;         /* 128px */
  --space-36: 9rem;         /* 144px */
  --space-40: 10rem;        /* 160px */
  --space-44: 11rem;        /* 176px */
  --space-48: 12rem;        /* 192px */
  --space-52: 13rem;        /* 208px */
  --space-56: 14rem;        /* 224px */
  --space-60: 15rem;        /* 240px */
  --space-64: 16rem;        /* 256px */
  --space-72: 18rem;        /* 288px */
  --space-80: 20rem;        /* 320px */
  --space-96: 24rem;        /* 384px */
}
```

### **Component Spacing Guidelines**

#### **Button Spacing**
```css
.button-sm {
  padding: var(--space-1-5) var(--space-3);  /* 6px 12px */
}

.button-md {
  padding: var(--space-2) var(--space-4);    /* 8px 16px */
}

.button-lg {
  padding: var(--space-3) var(--space-6);    /* 12px 24px */
}
```

#### **Card Spacing**
```css
.card-compact {
  padding: var(--space-3);                   /* 12px */
}

.card-comfortable {
  padding: var(--space-4);                   /* 16px */
}

.card-spacious {
  padding: var(--space-6);                   /* 24px */
}
```

#### **Layout Spacing**
```css
.section-spacing {
  padding-top: var(--space-16);              /* 64px */
  padding-bottom: var(--space-16);           /* 64px */
}

.container-spacing {
  padding-left: var(--space-4);              /* 16px */
  padding-right: var(--space-4);             /* 16px */
  
  @media (min-width: 640px) {
    padding-left: var(--space-6);            /* 24px */
    padding-right: var(--space-6);           /* 24px */
  }
  
  @media (min-width: 1024px) {
    padding-left: var(--space-8);            /* 32px */
    padding-right: var(--space-8);           /* 32px */
  }
}
```

## 🔲 **Border Radius**

```css
:root {
  --radius-none: 0;
  --radius-sm: 0.125rem;      /* 2px */
  --radius-base: 0.25rem;     /* 4px */
  --radius-md: 0.375rem;      /* 6px */
  --radius-lg: 0.5rem;        /* 8px */
  --radius-xl: 0.75rem;       /* 12px */
  --radius-2xl: 1rem;         /* 16px */
  --radius-3xl: 1.5rem;       /* 24px */
  --radius-full: 9999px;      /* Full circle */
}

/* Component Applications */
.button {
  border-radius: var(--radius-lg);
}

.card {
  border-radius: var(--radius-xl);
}

.input {
  border-radius: var(--radius-md);
}

.badge {
  border-radius: var(--radius-full);
}
```

## 🌫️ **Shadows**

```css
:root {
  /* Shadow Scale */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-base: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  --shadow-none: none;

  /* Colored Shadows */
  --shadow-primary: 0 4px 14px 0 rgba(0, 102, 204, 0.25);
  --shadow-secondary: 0 4px 14px 0 rgba(255, 107, 53, 0.25);
  --shadow-success: 0 4px 14px 0 rgba(34, 197, 94, 0.25);
  --shadow-warning: 0 4px 14px 0 rgba(245, 158, 11, 0.25);
  --shadow-error: 0 4px 14px 0 rgba(239, 68, 68, 0.25);
}

/* Usage Examples */
.card-elevated {
  box-shadow: var(--shadow-lg);
}

.button-primary:focus {
  box-shadow: var(--shadow-primary);
}

.dropdown-menu {
  box-shadow: var(--shadow-xl);
}
```

## 📱 **Responsive Breakpoints**

```css
:root {
  /* Breakpoint Values */
  --breakpoint-xs: 475px;
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
}

/* Media Query Mixins (if using CSS-in-JS) */
const breakpoints = {
  xs: '(min-width: 475px)',
  sm: '(min-width: 640px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
  '2xl': '(min-width: 1536px)',
};
```

### **Responsive Design Patterns**

#### **Container Widths**
```css
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--space-4);
  padding-right: var(--space-4);
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
    padding-left: var(--space-6);
    padding-right: var(--space-6);
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
    padding-left: var(--space-8);
    padding-right: var(--space-8);
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

@media (min-width: 1536px) {
  .container {
    max-width: 1536px;
  }
}
```

#### **Grid System**
```css
.grid {
  display: grid;
  gap: var(--space-4);
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 640px) {
  .sm\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
```

## 🧩 **Component Variants**

### **Button Variants**
```css
/* Primary Button */
.btn-primary {
  background-color: var(--kai-primary-500);
  color: var(--kai-white);
  border: 2px solid var(--kai-primary-500);
  
  &:hover {
    background-color: var(--kai-primary-600);
    border-color: var(--kai-primary-600);
  }
  
  &:focus {
    box-shadow: var(--shadow-primary);
  }
  
  &:disabled {
    background-color: var(--kai-gray-300);
    border-color: var(--kai-gray-300);
    color: var(--kai-gray-500);
  }
}

/* Secondary Button */
.btn-secondary {
  background-color: var(--kai-secondary-500);
  color: var(--kai-white);
  border: 2px solid var(--kai-secondary-500);
  
  &:hover {
    background-color: var(--kai-secondary-600);
    border-color: var(--kai-secondary-600);
  }
  
  &:focus {
    box-shadow: var(--shadow-secondary);
  }
}

/* Outline Button */
.btn-outline {
  background-color: transparent;
  color: var(--kai-primary-500);
  border: 2px solid var(--kai-primary-500);
  
  &:hover {
    background-color: var(--kai-primary-500);
    color: var(--kai-white);
  }
  
  &:focus {
    box-shadow: var(--shadow-primary);
  }
}

/* Ghost Button */
.btn-ghost {
  background-color: transparent;
  color: var(--kai-primary-500);
  border: 2px solid transparent;
  
  &:hover {
    background-color: var(--kai-primary-50);
  }
  
  &:focus {
    box-shadow: var(--shadow-primary);
  }
}
```

### **Input Variants**
```css
/* Default Input */
.input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--kai-gray-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  line-height: var(--leading-normal);
  
  &:focus {
    outline: none;
    border-color: var(--kai-primary-500);
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }
  
  &:disabled {
    background-color: var(--kai-gray-50);
    color: var(--kai-gray-500);
    cursor: not-allowed;
  }
}

/* Error State */
.input-error {
  border-color: var(--kai-error-500);
  
  &:focus {
    border-color: var(--kai-error-500);
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
}

/* Success State */
.input-success {
  border-color: var(--kai-success-500);
  
  &:focus {
    border-color: var(--kai-success-500);
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
}
```

### **Card Variants**
```css
/* Default Card */
.card {
  background-color: var(--kai-white);
  border: 1px solid var(--kai-gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-base);
}

/* Elevated Card */
.card-elevated {
  box-shadow: var(--shadow-lg);
  border: none;
  
  &:hover {
    box-shadow: var(--shadow-xl);
    transform: translateY(-2px);
  }
}

/* Outlined Card */
.card-outlined {
  border: 2px solid var(--kai-gray-300);
  box-shadow: none;
}

/* Interactive Card */
.card-interactive {
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
}
```

## 🎯 **Icon System**

### **Icon Guidelines**
```css
/* Icon Sizes */
.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }

/* Icon Colors */
.icon-primary { color: var(--kai-primary-500); }
.icon-secondary { color: var(--kai-secondary-500); }
.icon-muted { color: var(--kai-gray-400); }
.icon-success { color: var(--kai-success-500); }
.icon-warning { color: var(--kai-warning-500); }
.icon-error { color: var(--kai-error-500); }
```

### **Common Icons**
- **Navigation**: Home, Menu, Arrow, Chevron
- **Actions**: Plus, Edit, Delete, Search, Filter
- **Status**: Check, X, Warning, Info, Loading
- **Transportation**: Train, Station, Route, Ticket
- **User**: User, Profile, Settings, Logout

## 🌟 **Animation System**

### **Transition Durations**
```css
:root {
  --duration-75: 75ms;
  --duration-100: 100ms;
  --duration-150: 150ms;
  --duration-200: 200ms;
  --duration-300: 300ms;
  --duration-500: 500ms;
  --duration-700: 700ms;
  --duration-1000: 1000ms;
}
```

### **Easing Functions**
```css
:root {
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### **Common Animations**
```css
/* Fade Animations */
.fade-in {
  animation: fadeIn var(--duration-300) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide Animations */
.slide-up {
  animation: slideUp var(--duration-300) var(--ease-out);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scale Animations */
.scale-in {
  animation: scaleIn var(--duration-200) var(--ease-out);
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

## ♿ **Accessibility Guidelines**

### **Color Contrast Requirements**
- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **Interactive Elements**: Minimum 3:1 contrast ratio

### **Focus States**
```css
/* Focus Ring */
.focus-ring {
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.3);
  }
}

/* Focus Visible (untuk keyboard navigation) */
.focus-visible {
  &:focus-visible {
    outline: 2px solid var(--kai-primary-500);
    outline-offset: 2px;
  }
}
```

### **Screen Reader Support**
```css
/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--kai-primary-500);
  color: white;
  padding: 8px;
  text-decoration: none;
  z-index: 1000;
  
  &:focus {
    top: 6px;
  }
}
```

## 📋 **Design Tokens Usage**

### **CSS Custom Properties Implementation**
```css
/* Component using design tokens */
.kai-button {
  /* Spacing */
  padding: var(--space-3) var(--space-6);
  margin: var(--space-2);
  
  /* Typography */
  font-family: var(--font-family-primary);
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  
  /* Colors */
  background-color: var(--kai-primary-500);
  color: var(--kai-white);
  border: 1px solid var(--kai-primary-500);
  
  /* Layout */
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-base);
  
  /* Animation */
  transition: all var(--duration-200) var(--ease-out);
  
  &:hover {
    background-color: var(--kai-primary-600);
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
  
  &:focus {
    outline: none;
    box-shadow: var(--shadow-primary);
  }
  
  &:disabled {
    background-color: var(--kai-gray-300);
    color: var(--kai-gray-500);
    cursor: not-allowed;
    transform: none;
  }
}
```

### **JavaScript/TypeScript Integration**
```typescript
// Design tokens as TypeScript constants
export const designTokens = {
  colors: {
    primary: {
      50: '#EBF8FF',
      500: '#0066CC',
      600: '#2B77CB',
      900: '#1A202C',
    },
    gray: {
      50: '#F9FAFB',
      500: '#6B7280',
      900: '#111827',
    },
  },
  spacing: {
    1: '0.25rem',
    4: '1rem',
    8: '2rem',
    16: '4rem',
  },
  fontSize: {
    sm: '0.875rem',
    base: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },
  borderRadius: {
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
  },
} as const;

// Usage in styled components or CSS-in-JS
const StyledButton = styled.button`
  padding: ${designTokens.spacing[3]} ${designTokens.spacing[6]};
  background-color: ${designTokens.colors.primary[500]};
  border-radius: ${designTokens.borderRadius.lg};
  font-size: ${designTokens.fontSize.base};
`;
```

## 🎨 **Theme Variants**

### **Light Theme (Default)**
```css
:root {
  --theme-bg-primary: var(--kai-white);
  --theme-bg-secondary: var(--kai-gray-50);
  --theme-text-primary: var(--kai-gray-900);
  --theme-text-secondary: var(--kai-gray-600);
  --theme-border: var(--kai-gray-200);
}
```

### **Dark Theme (Future)**
```css
[data-theme="dark"] {
  --theme-bg-primary: var(--kai-gray-900);
  --theme-bg-secondary: var(--kai-gray-800);
  --theme-text-primary: var(--kai-gray-100);
  --theme-text-secondary: var(--kai-gray-300);
  --theme-border: var(--kai-gray-700);
}
```

## 📐 **Layout Utilities**

### **Flexbox Utilities**
```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.flex-wrap { flex-wrap: wrap; }
.flex-nowrap { flex-wrap: nowrap; }

.items-start { align-items: flex-start; }
.items-center { align-items: center; }
.items-end { align-items: flex-end; }
.items-stretch { align-items: stretch; }

.justify-start { justify-content: flex-start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: flex-end; }
.justify-between { justify-content: space-between; }
.justify-around { justify-content: space-around; }
.justify-evenly { justify-content: space-evenly; }

.flex-1 { flex: 1 1 0%; }
.flex-auto { flex: 1 1 auto; }
.flex-initial { flex: 0 1 auto; }
.flex-none { flex: none; }
```

### **Grid Utilities**
```css
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.grid-cols-12 { grid-template-columns: repeat(12, minmax(0, 1fr)); }

.col-span-1 { grid-column: span 1 / span 1; }
.col-span-2 { grid-column: span 2 / span 2; }
.col-span-3 { grid-column: span 3 / span 3; }
.col-span-4 { grid-column: span 4 / span 4; }
.col-span-full { grid-column: 1 / -1; }

.gap-1 { gap: var(--space-1); }
.gap-2 { gap: var(--space-2); }
.gap-4 { gap: var(--space-4); }
.gap-6 { gap: var(--space-6); }
.gap-8 { gap: var(--space-8); }
```

## 🔧 **Implementation Guidelines**

### **CSS Organization**
```
styles/
├── base/
│   ├── reset.css           # CSS reset/normalize
│   ├── typography.css      # Typography styles
│   └── utilities.css       # Utility classes
├── tokens/
│   ├── colors.css          # Color variables
│   ├── spacing.css         # Spacing variables
│   ├── typography.css      # Typography variables
│   └── animation.css       # Animation variables
├── components/
│   ├── buttons.css         # Button styles
│   ├── forms.css           # Form styles
│   ├── cards.css           # Card styles
│   └── navigation.css      # Navigation styles
└── main.css               # Main entry point
```

### **CSS-in-JS Integration**
```typescript
// Theme provider setup
import { createTheme, ThemeProvider } from 'styled-components';

const theme = createTheme({
  colors: designTokens.colors,
  spacing: designTokens.spacing,
  fontSize: designTokens.fontSize,
  // ... other tokens
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### **Tailwind CSS Configuration**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'kai-primary': {
          50: '#EBF8FF',
          500: '#0066CC',
          600: '#2B77CB',
          // ... other shades
        },
        'kai-secondary': {
          500: '#FF6B35',
          // ... other shades
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
};
```

---

**🎨 Comprehensive Design System - Consistent, Accessible, Beautiful** ✨
