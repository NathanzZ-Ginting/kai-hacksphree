# 🧩 KAI Component Guide

## 📋 **Overview**

Comprehensive guide untuk semua React components dalam aplikasi KAI Frontend. Dokumentasi ini mencakup struktur, props, usage examples, dan best practices untuk setiap component.

## 🏗️ **Component Architecture**

```
🔰 COMPONENT HIERARCHY

├── 📱 Layout Components
│   ├── Header/Navbar
│   ├── Footer
│   ├── Sidebar
│   └── Container/Wrapper
├── 🧩 UI Components
│   ├── Buttons
│   ├── Forms & Inputs
│   ├── Cards
│   ├── Modals
│   ├── Notifications
│   └── Loading States
├── 📄 Section Components
│   ├── Hero Section
│   ├── Features Section
│   ├── Testimonials
│   └── Contact Section
└── 📋 Page Components
    ├── HomePage
    ├── BookingPage
    ├── AuthPages
    └── ProfilePage
```

## 🧩 **UI Components**

### **Button Components**

#### **Primary Button**
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  onClick,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantClasses = {
    primary: 'bg-kai-primary hover:bg-kai-primary-dark text-white focus:ring-kai-primary',
    secondary: 'bg-kai-secondary hover:bg-orange-600 text-white focus:ring-kai-secondary',
    outline: 'border-2 border-kai-primary text-kai-primary hover:bg-kai-primary hover:text-white focus:ring-kai-primary',
    ghost: 'text-kai-primary hover:bg-kai-primary/10 focus:ring-kai-primary'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
      ) : (
        icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )
      )}
      {children}
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};
```

**Usage Examples:**
```tsx
// Primary button
<Button variant="primary" size="lg">
  Pesan Tiket
</Button>

// Button with icon
<Button 
  variant="outline" 
  icon={<SearchIcon />}
  iconPosition="left"
>
  Cari Kereta
</Button>

// Loading state
<Button loading={isSubmitting}>
  {isSubmitting ? 'Memproses...' : 'Submit'}
</Button>

// Full width button
<Button variant="primary" fullWidth>
  Login
</Button>
```

### **Input Components**

#### **Text Input**
```typescript
interface InputProps {
  label?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel';
  value?: string;
  defaultValue?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  type = 'text',
  value,
  defaultValue,
  error,
  helperText,
  required = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  size = 'md',
  fullWidth = true,
  onChange,
  onBlur,
  onFocus,
  ...props
}) => {
  const inputId = useId();
  
  const baseClasses = 'block rounded-lg border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-kai-primary focus:border-transparent';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-3 text-lg'
  };
  
  const stateClasses = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-gray-300 focus:ring-kai-primary';

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={`
            ${baseClasses}
            ${sizeClasses[size]}
            ${stateClasses}
            ${fullWidth ? 'w-full' : ''}
            ${icon && iconPosition === 'left' ? 'pl-10' : ''}
            ${icon && iconPosition === 'right' ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
          `}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{icon}</span>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};
```

**Usage Examples:**
```tsx
// Basic input
<Input 
  label="Email"
  type="email"
  placeholder="masukkan@email.com"
  required
/>

// Input with icon
<Input 
  label="Pencarian"
  placeholder="Cari stasiun..."
  icon={<SearchIcon />}
  iconPosition="left"
/>

// Input with error
<Input 
  label="Password"
  type="password"
  error="Password minimal 8 karakter"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// Controlled input
<Input 
  label="Nama Lengkap"
  value={name}
  onChange={(e) => setName(e.target.value)}
  helperText="Nama sesuai KTP"
/>
```

### **Card Components**

#### **Generic Card**
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  clickable?: boolean;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = 'md',
  hover = false,
  clickable = false,
  className = '',
  onClick,
  children,
  ...props
}) => {
  const baseClasses = 'bg-white transition-all duration-200';
  
  const variantClasses = {
    default: 'border border-gray-200',
    elevated: 'border-0',
    outlined: 'border-2 border-gray-300',
    flat: 'border-0 shadow-none'
  };
  
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };
  
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  };
  
  const shadowClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };
  
  const interactiveClasses = {
    hover: hover ? 'hover:shadow-lg hover:-translate-y-1' : '',
    clickable: clickable ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-kai-primary' : ''
  };

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${roundedClasses[rounded]}
        ${variant !== 'flat' ? shadowClasses[shadow] : ''}
        ${interactiveClasses.hover}
        ${interactiveClasses.clickable}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};
```

#### **Train Card**
```typescript
interface TrainCardProps {
  train: {
    id: string;
    name: string;
    number: string;
    class: string;
    departureTime: string;
    arrivalTime: string;
    departureStation: string;
    arrivalStation: string;
    duration: string;
    price: number;
    availableSeats: number;
  };
  onSelect?: (trainId: string) => void;
  selected?: boolean;
}

const TrainCard: React.FC<TrainCardProps> = ({
  train,
  onSelect,
  selected = false
}) => {
  return (
    <Card 
      variant={selected ? 'outlined' : 'default'}
      clickable
      hover
      onClick={() => onSelect?.(train.id)}
      className={selected ? 'border-kai-primary ring-2 ring-kai-primary' : ''}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg text-gray-900">
              {train.name}
            </h3>
            <span className="text-sm text-gray-500">
              {train.number}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {train.departureTime}
              </p>
              <p className="text-sm text-gray-600">
                {train.departureStation}
              </p>
            </div>
            
            <div className="flex-1 mx-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {train.duration}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {train.arrivalTime}
              </p>
              <p className="text-sm text-gray-600">
                {train.arrivalStation}
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {train.class}
              </span>
              <span className="text-sm text-gray-600">
                {train.availableSeats} kursi tersisa
              </span>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500">Mulai dari</p>
              <p className="text-xl font-bold text-kai-primary">
                Rp {train.price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
```

**Usage Examples:**
```tsx
// Basic card
<Card>
  <h3>Card Title</h3>
  <p>Card content goes here...</p>
</Card>

// Elevated card with hover
<Card variant="elevated" hover>
  <img src="image.jpg" alt="Card image" />
  <div className="p-4">
    <h3>Image Card</h3>
  </div>
</Card>

// Clickable card
<Card clickable onClick={() => navigate('/detail')}>
  <h3>Clickable Card</h3>
  <p>Click me to navigate!</p>
</Card>

// Train selection
<TrainCard 
  train={trainData}
  selected={selectedTrainId === trainData.id}
  onSelect={handleTrainSelect}
/>
```

### **Modal Components**

#### **Base Modal**
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children
}) => {
  useEffect(() => {
    if (!closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeOnOverlayClick ? onClose : undefined}
        />
        
        {/* Modal */}
        <div className={`
          inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full
          ${sizeClasses[size]}
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {title && (
                <h3 className="text-lg font-medium text-gray-900">
                  {title}
                </h3>
              )}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XIcon className="h-6 w-6" />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### **Loading Components**

#### **Spinner**
```typescript
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };
  
  const colorClasses = {
    primary: 'border-kai-primary',
    secondary: 'border-kai-secondary',
    white: 'border-white',
    gray: 'border-gray-600'
  };

  return (
    <div className={`
      animate-spin rounded-full border-2 border-t-transparent
      ${sizeClasses[size]}
      ${colorClasses[color]}
      ${className}
    `} />
  );
};
```

#### **Loading State**
```typescript
interface LoadingStateProps {
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  onRetry,
  children,
  loadingComponent,
  errorComponent
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        {loadingComponent || (
          <div className="text-center">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-600">Memuat...</p>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        {errorComponent || (
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <ExclamationIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Terjadi Kesalahan
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                Coba Lagi
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
};
```

## 📱 **Layout Components**

### **Header/Navbar**
```typescript
interface HeaderProps {
  fixed?: boolean;
  transparent?: boolean;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({
  fixed = true,
  transparent = false,
  className = ''
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`
      ${fixed ? 'fixed top-0 left-0 right-0 z-40' : ''}
      ${transparent && !isScrolled ? 'bg-transparent' : 'bg-white shadow-md'}
      transition-all duration-300
      ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/kai.jpg" alt="KAI" className="h-8 w-auto" />
            <span className="text-xl font-bold text-kai-primary">
              KAI
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-kai-primary">
              Beranda
            </Link>
            <Link to="/routes" className="text-gray-700 hover:text-kai-primary">
              Rute
            </Link>
            <Link to="/services" className="text-gray-700 hover:text-kai-primary">
              Layanan
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-kai-primary">
              Tentang
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/booking">
                  <Button variant="primary" size="sm">
                    Pesan Tiket
                  </Button>
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-kai-primary">
                    <UserIcon className="h-5 w-5" />
                    <span>{user.name}</span>
                    <ChevronDownIcon className="h-4 w-4" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Riwayat Pesanan
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button variant="primary" size="sm">
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
```

### **Footer**
```typescript
const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img src="/kai.jpg" alt="KAI" className="h-8 w-auto" />
              <span className="text-xl font-bold">PT KAI</span>
            </div>
            <p className="text-gray-300 mb-4">
              Kereta Api Indonesia - Menghubungkan nusantara dengan layanan transportasi kereta api yang aman, nyaman, dan terpercaya.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FacebookIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <InstagramIcon className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li><Link to="/booking" className="text-gray-300 hover:text-white">Pesan Tiket</Link></li>
              <li><Link to="/routes" className="text-gray-300 hover:text-white">Jadwal Kereta</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white">Layanan</Link></li>
              <li><Link to="/help" className="text-gray-300 hover:text-white">Bantuan</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2" />
                121 (24 jam)
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 mr-2" />
                cs@kai.id
              </li>
              <li className="flex items-center">
                <LocationMarkerIcon className="h-5 w-5 mr-2" />
                Jakarta, Indonesia
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>&copy; 2025 PT Kereta Api Indonesia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
```

## 📄 **Section Components**

### **Hero Section**
```typescript
interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
  overlay?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  primaryAction,
  secondaryAction,
  overlay = true
}) => {
  return (
    <section className="relative h-screen flex items-center justify-center text-white">
      {/* Background */}
      {backgroundImage && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          {overlay && (
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          )}
        </>
      )}
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        
        {subtitle && (
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            {subtitle}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && (
            <Button
              variant="primary"
              size="lg"
              onClick={primaryAction.onClick}
            >
              {primaryAction.text}
            </Button>
          )}
          
          {secondaryAction && (
            <Button
              variant="outline"
              size="lg"
              onClick={secondaryAction.onClick}
              className="border-white text-white hover:bg-white hover:text-gray-900"
            >
              {secondaryAction.text}
            </Button>
          )}
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDownIcon className="h-8 w-8 text-white" />
      </div>
    </section>
  );
};
```

## 🎯 **Best Practices**

### **Component Design Principles**
1. **Single Responsibility**: Setiap component harus memiliki satu tanggung jawab yang jelas
2. **Reusability**: Component harus dapat digunakan kembali di berbagai context
3. **Composability**: Component dapat dikombinasikan untuk membentuk UI yang kompleks
4. **Accessibility**: Semua component harus accessible dan WCAG compliant

### **Props Design Guidelines**
```typescript
// ✅ Good: Clear, typed props with defaults
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// ❌ Bad: Unclear, untyped props
interface ButtonProps {
  type?: string;
  big?: boolean;
  action?: any;
  content?: any;
}
```

### **Styling Guidelines**
```typescript
// ✅ Good: Consistent utility classes with design system
const buttonClasses = `
  inline-flex items-center justify-center
  px-4 py-2 text-base font-medium
  rounded-lg transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  ${variant === 'primary' ? 'bg-kai-primary text-white' : 'bg-white text-kai-primary'}
`;

// ❌ Bad: Hardcoded styles without system
const buttonClasses = "background: #0066CC; padding: 8px 16px; color: white;";
```

### **State Management**
```typescript
// ✅ Good: Clear state with proper typing
const [formData, setFormData] = useState<FormData>({
  email: '',
  password: '',
  rememberMe: false
});

// ✅ Good: Computed values using useMemo
const filteredTrains = useMemo(() => {
  return trains.filter(train => 
    train.departureStation.includes(searchQuery) ||
    train.arrivalStation.includes(searchQuery)
  );
}, [trains, searchQuery]);
```

## 🧪 **Testing Components**

### **Unit Testing Example**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
```

### **Storybook Stories**
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading Button',
  },
};
```

## 📚 **Component Documentation**

Setiap component harus memiliki:

1. **JSDoc Comments**
```typescript
/**
 * Button component untuk actions dan navigation
 * 
 * @param variant - Style variant dari button
 * @param size - Ukuran button
 * @param disabled - Apakah button disabled
 * @param loading - Apakah button dalam loading state
 * @param onClick - Function yang dipanggil saat button diklik
 * @param children - Content dari button
 */
```

2. **Usage Examples**: Contoh penggunaan yang jelas
3. **Props Documentation**: Penjelasan setiap prop
4. **Accessibility Notes**: Informasi accessibility
5. **Browser Support**: Informasi kompatibilitas browser

---

**🧩 Comprehensive Component System - Building Consistent & Accessible UI** ✨
