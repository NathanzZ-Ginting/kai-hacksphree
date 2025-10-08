# 🏗️ Architecture Flow (System Architecture Diagram) - KAI Railway Ticketing Platform

## High-Level System Architecture

```mermaid
C4Context
    title System Context Diagram - KAI Railway Ticketing Platform
    
    Person(passenger, "Passenger", "End user booking train tickets")
    Person(admin, "Administrator", "System administrator managing the platform")
    
    System(kai_system, "KAI Ticketing Platform", "Digital railway ticketing system")
    
    System_Ext(midtrans, "Midtrans Payment Gateway", "External payment processing service")
    System_Ext(email_service, "Email Service", "Email delivery service")
    System_Ext(sms_service, "SMS Service", "SMS notification service")
    System_Ext(captcha_service, "Google reCAPTCHA", "Bot protection service")
    
    Rel(passenger, kai_system, "Books tickets, makes payments")
    Rel(admin, kai_system, "Manages system, views analytics")
    Rel(kai_system, midtrans, "Processes payments")
    Rel(kai_system, email_service, "Sends ticket confirmations")
    Rel(kai_system, sms_service, "Sends notifications")
    Rel(kai_system, captcha_service, "Verifies user authenticity")
```

## Container Architecture Diagram

```mermaid
C4Container
    title Container Diagram - KAI Railway Ticketing Platform
    
    Person(passenger, "Passenger")
    Person(admin, "Administrator")
    
    Container_Boundary(kai_platform, "KAI Ticketing Platform") {
        Container(web_app, "Web Application", "React 19, TypeScript", "Provides user interface for booking tickets")
        Container(mobile_app, "Mobile Application", "React Native (Future)", "Mobile interface for ticket booking")
        Container(api_gateway, "API Gateway", "Hono.js", "Handles all API requests and routing")
        Container(auth_service, "Authentication Service", "JWT, bcrypt", "Handles user authentication and authorization")
        Container(booking_service, "Booking Service", "Node.js, TypeScript", "Manages ticket booking process")
        Container(payment_service, "Payment Service", "Midtrans SDK", "Handles payment processing")
        Container(notification_service, "Notification Service", "Email/SMS", "Sends notifications to users")
        Container(database, "Database", "PostgreSQL with Neon", "Stores all application data")
        Container(cache, "Cache Layer", "Redis (Future)", "Caches frequently accessed data")
        Container(file_storage, "File Storage", "Cloud Storage", "Stores tickets and documents")
    }
    
    System_Ext(midtrans, "Midtrans Payment Gateway")
    System_Ext(email_provider, "Email Service Provider")
    System_Ext(sms_provider, "SMS Service Provider")
    System_Ext(recaptcha, "Google reCAPTCHA")
    
    Rel(passenger, web_app, "Uses", "HTTPS")
    Rel(passenger, mobile_app, "Uses", "HTTPS")
    Rel(admin, web_app, "Uses", "HTTPS")
    
    Rel(web_app, api_gateway, "Makes API calls", "HTTPS/REST")
    Rel(mobile_app, api_gateway, "Makes API calls", "HTTPS/REST")
    
    Rel(api_gateway, auth_service, "Authenticates users")
    Rel(api_gateway, booking_service, "Manages bookings")
    Rel(api_gateway, payment_service, "Processes payments")
    Rel(api_gateway, notification_service, "Sends notifications")
    
    Rel(auth_service, database, "Stores user data", "SQL")
    Rel(booking_service, database, "Stores booking data", "SQL")
    Rel(payment_service, database, "Stores payment data", "SQL")
    
    Rel(auth_service, cache, "Caches sessions", "Redis Protocol")
    Rel(booking_service, cache, "Caches booking data", "Redis Protocol")
    
    Rel(payment_service, midtrans, "Processes payments", "HTTPS/REST")
    Rel(notification_service, email_provider, "Sends emails", "SMTP")
    Rel(notification_service, sms_provider, "Sends SMS", "HTTP API")
    Rel(auth_service, recaptcha, "Verifies CAPTCHA", "HTTPS")
    
    Rel(notification_service, file_storage, "Stores tickets", "HTTPS")
```

## Component Architecture - Frontend

```mermaid
flowchart TD
    subgraph "Frontend Architecture (React 19)"
        subgraph "Application Layer"
            App[🏠 App Component]
            Router[🔀 React Router]
            Context[🌐 Context Providers]
        end
        
        subgraph "Context Layer"
            AuthContext[🔐 Auth Context]
            BookingContext[📝 Booking Context]
            ThemeContext[🎨 Theme Context]
            NotificationContext[🔔 Notification Context]
        end
        
        subgraph "Page Components"
            HomePage[🏠 Home Page]
            BookingPage[📝 Booking Page]
            PaymentPage[💳 Payment Page]
            ProfilePage[👤 Profile Page]
            AdminPage[👨‍💼 Admin Page]
        end
        
        subgraph "UI Components"
            Header[📋 Header]
            Navigation[🧭 Navigation]
            SearchForm[🔍 Search Form]
            TrainCard[🚂 Train Card]
            SeatMap[💺 Seat Map]
            PaymentForm[💳 Payment Form]
            Footer[🦶 Footer]
        end
        
        subgraph "Service Layer"
            ApiClient[📡 API Client]
            AuthService[🔐 Auth Service]
            BookingService[📝 Booking Service]
            PaymentService[💳 Payment Service]
        end
        
        subgraph "Utility Layer"
            Validators[✅ Validators]
            Formatters[📐 Formatters]
            Constants[🔧 Constants]
            Helpers[🛠️ Helpers]
        end
    end
    
    App --> Router
    Router --> Context
    Context --> AuthContext
    Context --> BookingContext
    Context --> ThemeContext
    Context --> NotificationContext
    
    Router --> HomePage
    Router --> BookingPage
    Router --> PaymentPage
    Router --> ProfilePage
    Router --> AdminPage
    
    HomePage --> Header
    HomePage --> SearchForm
    BookingPage --> TrainCard
    BookingPage --> SeatMap
    PaymentPage --> PaymentForm
    
    SearchForm --> ApiClient
    TrainCard --> BookingService
    PaymentForm --> PaymentService
    
    AuthContext --> AuthService
    BookingContext --> BookingService
    
    AuthService --> ApiClient
    BookingService --> ApiClient
    PaymentService --> ApiClient
    
    ApiClient --> Validators
    BookingService --> Formatters
    
    style App fill:#4CAF50,color:#fff
    style ApiClient fill:#2196F3,color:#fff
    style AuthService fill:#FF9800,color:#fff
    style BookingService fill:#9C27B0,color:#fff
```

## Component Architecture - Backend

```mermaid
flowchart TD
    subgraph "Backend Architecture (Hono.js)"
        subgraph "API Gateway Layer"
            Server[🖥️ Hono.js Server]
            CORS[🌐 CORS Middleware]
            Logger[📝 Logger Middleware]
            Metrics[📊 Prometheus Metrics]
        end
        
        subgraph "Security Layer (PENTA)"
            RateLimit[🚦 Rate Limiting]
            Captcha[🤖 CAPTCHA Verification]
            Session[🔐 Session Security]
            CSRF[🛡️ CSRF Protection]
            Validation[✅ Input Validation]
        end
        
        subgraph "Route Layer"
            AuthRoutes[🔐 Auth Routes]
            OrderRoutes[📋 Order Routes]
            MasterDataRoutes[🗃️ Master Data Routes]
            PaymentRoutes[💳 Payment Routes]
        end
        
        subgraph "Controller Layer"
            LoginController[🔑 Login Controller]
            RegisterController[📝 Register Controller]
            BookingController[📋 Booking Controller]
            PaymentController[💳 Payment Controller]
            UserController[👤 User Controller]
        end
        
        subgraph "Service Layer"
            AuthService[🔐 Auth Service]
            BookingService[📝 Booking Service]
            PaymentService[💳 Payment Service]
            NotificationService[📧 Notification Service]
        end
        
        subgraph "Repository Layer"
            UserRepository[👤 User Repository]
            OrderRepository[📋 Order Repository]
            PaymentRepository[💳 Payment Repository]
            TrainRepository[🚂 Train Repository]
        end
        
        subgraph "Data Layer"
            DrizzleORM[🔧 Drizzle ORM]
            Database[🗄️ PostgreSQL/Neon]
            Schemas[📊 Database Schemas]
        end
        
        subgraph "External Services"
            MidtransAPI[💳 Midtrans API]
            EmailAPI[📧 Email API]
            CaptchaAPI[🤖 reCAPTCHA API]
        end
    end
    
    Server --> CORS
    CORS --> Logger
    Logger --> Metrics
    Metrics --> RateLimit
    
    RateLimit --> Captcha
    Captcha --> Session
    Session --> CSRF
    CSRF --> Validation
    
    Validation --> AuthRoutes
    Validation --> OrderRoutes
    Validation --> MasterDataRoutes
    Validation --> PaymentRoutes
    
    AuthRoutes --> LoginController
    AuthRoutes --> RegisterController
    OrderRoutes --> BookingController
    PaymentRoutes --> PaymentController
    
    LoginController --> AuthService
    RegisterController --> AuthService
    BookingController --> BookingService
    PaymentController --> PaymentService
    
    AuthService --> UserRepository
    BookingService --> OrderRepository
    BookingService --> TrainRepository
    PaymentService --> PaymentRepository
    
    UserRepository --> DrizzleORM
    OrderRepository --> DrizzleORM
    PaymentRepository --> DrizzleORM
    TrainRepository --> DrizzleORM
    
    DrizzleORM --> Database
    DrizzleORM --> Schemas
    
    PaymentService --> MidtransAPI
    NotificationService --> EmailAPI
    AuthService --> CaptchaAPI
    
    style Server fill:#4CAF50,color:#fff
    style RateLimit fill:#F44336,color:#fff
    style DrizzleORM fill:#2196F3,color:#fff
    style Database fill:#FF9800,color:#fff
```

## Deployment Architecture

```mermaid
flowchart TD
    subgraph "Client Layer"
        Browser[🌐 Web Browser]
        MobileApp[📱 Mobile App]
    end
    
    subgraph "CDN & Load Balancer"
        CDN[🚀 CDN (Cloudflare)]
        LoadBalancer[⚖️ Load Balancer]
    end
    
    subgraph "Application Layer"
        subgraph "Frontend Deployment"
            StaticSite[🌐 Static Site Hosting]
            ReactApp[⚛️ React Application]
        end
        
        subgraph "Backend Deployment"
            APIServer1[🖥️ API Server 1]
            APIServer2[🖥️ API Server 2]
            APIServer3[🖥️ API Server 3]
        end
    end
    
    subgraph "Database Layer"
        PrimaryDB[🗄️ Primary Database]
        ReadReplica[📖 Read Replica]
        BackupDB[💾 Backup Database]
    end
    
    subgraph "Cache Layer"
        RedisCluster[🚀 Redis Cluster]
        MemoryCache[💾 Memory Cache]
    end
    
    subgraph "Storage Layer"
        FileStorage[📁 File Storage]
        LogStorage[📝 Log Storage]
    end
    
    subgraph "Monitoring & Security"
        Monitoring[📊 Monitoring (Prometheus)]
        Logging[📝 Centralized Logging]
        Security[🔒 Security Scanner]
        Firewall[🛡️ Web Application Firewall]
    end
    
    subgraph "External Services"
        PaymentGateway[💳 Midtrans]
        EmailService[📧 Email Provider]
        SMSService[📱 SMS Provider]
        CaptchaService[🤖 reCAPTCHA]
    end
    
    Browser --> CDN
    MobileApp --> CDN
    CDN --> LoadBalancer
    LoadBalancer --> Firewall
    
    Firewall --> StaticSite
    StaticSite --> ReactApp
    
    ReactApp --> LoadBalancer
    LoadBalancer --> APIServer1
    LoadBalancer --> APIServer2
    LoadBalancer --> APIServer3
    
    APIServer1 --> RedisCluster
    APIServer2 --> RedisCluster
    APIServer3 --> RedisCluster
    
    APIServer1 --> PrimaryDB
    APIServer2 --> ReadReplica
    APIServer3 --> ReadReplica
    
    PrimaryDB --> BackupDB
    
    APIServer1 --> FileStorage
    APIServer2 --> FileStorage
    APIServer3 --> FileStorage
    
    APIServer1 --> PaymentGateway
    APIServer2 --> EmailService
    APIServer3 --> SMSService
    
    APIServer1 --> CaptchaService
    APIServer2 --> CaptchaService
    APIServer3 --> CaptchaService
    
    Monitoring --> APIServer1
    Monitoring --> APIServer2
    Monitoring --> APIServer3
    Monitoring --> PrimaryDB
    Monitoring --> RedisCluster
    
    Logging --> LogStorage
    
    Security --> APIServer1
    Security --> APIServer2
    Security --> APIServer3
    
    style CDN fill:#4CAF50,color:#fff
    style LoadBalancer fill:#2196F3,color:#fff
    style PrimaryDB fill:#FF9800,color:#fff
    style RedisCluster fill:#9C27B0,color:#fff
    style Security fill:#F44336,color:#fff
```

## Microservices Architecture (Future Enhancement)

```mermaid
flowchart TD
    subgraph "API Gateway"
        Gateway[🌐 API Gateway]
        Auth[🔐 Authentication]
        RateLimit[🚦 Rate Limiting]
    end
    
    subgraph "Core Services"
        UserService[👤 User Service]
        BookingService[📝 Booking Service]
        PaymentService[💳 Payment Service]
        NotificationService[📧 Notification Service]
        SearchService[🔍 Search Service]
    end
    
    subgraph "Data Services"
        TrainService[🚂 Train Service]
        StationService[🚉 Station Service]
        ScheduleService[📅 Schedule Service]
        PricingService[💰 Pricing Service]
    end
    
    subgraph "Support Services"
        FileService[📁 File Service]
        ReportService[📊 Report Service]
        AuditService[📝 Audit Service]
        MonitoringService[📊 Monitoring Service]
    end
    
    subgraph "Message Queue"
        MessageBroker[📨 Message Broker]
        EventBus[🔄 Event Bus]
    end
    
    subgraph "Databases"
        UserDB[👤 User DB]
        BookingDB[📝 Booking DB]
        PaymentDB[💳 Payment DB]
        TrainDB[🚂 Train DB]
        LogDB[📝 Log DB]
    end
    
    Gateway --> Auth
    Auth --> RateLimit
    RateLimit --> UserService
    RateLimit --> BookingService
    RateLimit --> PaymentService
    RateLimit --> SearchService
    
    BookingService --> TrainService
    BookingService --> StationService
    BookingService --> ScheduleService
    BookingService --> PricingService
    
    PaymentService --> NotificationService
    BookingService --> NotificationService
    
    UserService --> MessageBroker
    BookingService --> MessageBroker
    PaymentService --> MessageBroker
    
    MessageBroker --> EventBus
    EventBus --> AuditService
    EventBus --> MonitoringService
    
    UserService --> UserDB
    BookingService --> BookingDB
    PaymentService --> PaymentDB
    TrainService --> TrainDB
    AuditService --> LogDB
    
    style Gateway fill:#4CAF50,color:#fff
    style MessageBroker fill:#FF9800,color:#fff
    style UserService fill:#2196F3,color:#fff
    style BookingService fill:#9C27B0,color:#fff
```

## Security Architecture

```mermaid
flowchart TD
    subgraph "Security Layers"
        subgraph "Network Security"
            WAF[🛡️ Web Application Firewall]
            DDoSProtection[🛡️ DDoS Protection]
            SSL[🔒 SSL/TLS Encryption]
        end
        
        subgraph "Application Security"
            PENTA[🛡️ PENTA Security Framework]
            InputValidation[✅ Input Validation]
            OutputEncoding[🔒 Output Encoding]
            AuthZ[🔐 Authorization]
        end
        
        subgraph "Data Security"
            Encryption[🔒 Data Encryption]
            Hashing[🔐 Password Hashing]
            TokenSecurity[🎫 Token Security]
            DatabaseSecurity[🗄️ Database Security]
        end
        
        subgraph "Monitoring Security"
            SIEM[👁️ Security Information & Event Management]
            ThreatDetection[🔍 Threat Detection]
            SecurityLogs[📝 Security Logging]
            IncidentResponse[🚨 Incident Response]
        end
    end
    
    subgraph "PENTA Security Details"
        Layer1[🚦 Layer 1: Rate Limiting]
        Layer2[🤖 Layer 2: CAPTCHA Verification]
        Layer3[🔐 Layer 3: Session Security]
        Layer4[🛡️ Layer 4: CSRF Protection]
        Layer5[✅ Layer 5: Input Validation]
    end
    
    WAF --> SSL
    SSL --> PENTA
    PENTA --> Layer1
    Layer1 --> Layer2
    Layer2 --> Layer3
    Layer3 --> Layer4
    Layer4 --> Layer5
    
    Layer5 --> InputValidation
    InputValidation --> AuthZ
    AuthZ --> Encryption
    
    Encryption --> SIEM
    SIEM --> ThreatDetection
    ThreatDetection --> SecurityLogs
    SecurityLogs --> IncidentResponse
    
    style WAF fill:#F44336,color:#fff
    style PENTA fill:#FF5722,color:#fff
    style Encryption fill:#2196F3,color:#fff
    style SIEM fill:#9C27B0,color:#fff
```
