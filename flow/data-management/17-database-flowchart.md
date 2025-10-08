# 🗄️ Database Flowchart (ERD/Entity Flow) - KAI Railway Ticketing Platform

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    USERS {
        string id PK "Primary Key"
        string email "Unique email address"
        string password_hash "Hashed password"
        string full_name "User full name"
        string phone_number "Contact number"
        date date_of_birth "Date of birth"
        enum gender "Gender (male/female/other)"
        boolean is_verified "Email verification status"
        boolean is_active "Account status"
        timestamp created_at "Account creation time"
        timestamp updated_at "Last update time"
        timestamp last_login "Last login time"
    }

    USER_PROFILES {
        string id PK "Primary Key"
        string user_id FK "Reference to Users"
        string profile_picture "Profile image URL"
        string address "Home address"
        string city "City"
        string province "Province/State"
        string postal_code "Postal/ZIP code"
        string emergency_contact_name "Emergency contact"
        string emergency_contact_phone "Emergency phone"
        json preferences "User preferences JSON"
        timestamp created_at "Profile creation time"
        timestamp updated_at "Profile update time"
    }

    TRAINS {
        string id PK "Primary Key"
        string train_number "Unique train identifier"
        string train_name "Train name"
        enum train_type "Type (express/local/high_speed)"
        int total_capacity "Total passenger capacity"
        json facilities "Available facilities JSON"
        boolean is_active "Train operational status"
        timestamp created_at "Train registration time"
        timestamp updated_at "Train info update time"
    }

    TRAIN_CLASSES {
        string id PK "Primary Key"
        string train_id FK "Reference to Trains"
        enum class_type "Class (economy/business/executive/sleeper)"
        int capacity "Class capacity"
        decimal base_price "Base price for class"
        json amenities "Class amenities JSON"
        boolean is_available "Class availability"
        timestamp created_at "Class creation time"
        timestamp updated_at "Class update time"
    }

    STATIONS {
        string id PK "Primary Key"
        string station_code "Unique station code"
        string station_name "Station name"
        string city "Station city"
        string province "Station province"
        decimal latitude "GPS latitude"
        decimal longitude "GPS longitude"
        json facilities "Station facilities JSON"
        boolean is_active "Station operational status"
        timestamp created_at "Station registration time"
        timestamp updated_at "Station info update time"
    }

    ROUTES {
        string id PK "Primary Key"
        string route_name "Route name"
        string origin_station_id FK "Reference to Stations (origin)"
        string destination_station_id FK "Reference to Stations (destination)"
        decimal distance "Route distance in KM"
        int estimated_duration "Duration in minutes"
        boolean is_active "Route status"
        timestamp created_at "Route creation time"
        timestamp updated_at "Route update time"
    }

    ROUTE_STATIONS {
        string id PK "Primary Key"
        string route_id FK "Reference to Routes"
        string station_id FK "Reference to Stations"
        int station_order "Station sequence number"
        int arrival_offset "Arrival time offset (minutes)"
        int departure_offset "Departure time offset (minutes)"
        boolean is_stop "Whether train stops here"
        timestamp created_at "Route station creation time"
    }

    SCHEDULES {
        string id PK "Primary Key"
        string train_id FK "Reference to Trains"
        string route_id FK "Reference to Routes"
        date departure_date "Departure date"
        time departure_time "Departure time"
        time arrival_time "Arrival time"
        enum status "Status (scheduled/delayed/cancelled/completed)"
        string delay_reason "Reason for delay"
        int delay_minutes "Delay duration in minutes"
        timestamp created_at "Schedule creation time"
        timestamp updated_at "Schedule update time"
    }

    SEATS {
        string id PK "Primary Key"
        string train_id FK "Reference to Trains"
        string class_id FK "Reference to Train Classes"
        string seat_number "Seat identifier"
        enum seat_type "Type (window/aisle/middle)"
        int car_number "Car/coach number"
        json seat_features "Seat features JSON"
        boolean is_accessible "Accessibility features"
        timestamp created_at "Seat creation time"
        timestamp updated_at "Seat update time"
    }

    BOOKINGS {
        string id PK "Primary Key"
        string booking_number "Unique booking reference"
        string user_id FK "Reference to Users"
        string schedule_id FK "Reference to Schedules"
        enum status "Status (pending/confirmed/cancelled/completed)"
        decimal total_amount "Total booking amount"
        decimal discount_amount "Applied discount"
        decimal final_amount "Final payable amount"
        int passenger_count "Number of passengers"
        json booking_details "Booking details JSON"
        timestamp booking_date "Booking creation time"
        timestamp created_at "Record creation time"
        timestamp updated_at "Record update time"
    }

    PASSENGERS {
        string id PK "Primary Key"
        string booking_id FK "Reference to Bookings"
        string passenger_name "Passenger full name"
        date passenger_dob "Passenger date of birth"
        enum passenger_type "Type (adult/child/infant/senior)"
        string identity_number "ID/Passport number"
        enum gender "Gender"
        string seat_id FK "Reference to Seats"
        decimal ticket_price "Individual ticket price"
        json special_requirements "Special needs JSON"
        timestamp created_at "Passenger record creation time"
    }

    PAYMENTS {
        string id PK "Primary Key"
        string booking_id FK "Reference to Bookings"
        string payment_reference "Payment gateway reference"
        enum payment_method "Method (credit_card/debit_card/wallet/bank_transfer/qris)"
        enum payment_status "Status (pending/processing/completed/failed/refunded)"
        decimal amount "Payment amount"
        decimal processing_fee "Payment processing fee"
        string gateway_response "Payment gateway response"
        timestamp payment_date "Payment processing time"
        timestamp created_at "Payment record creation time"
        timestamp updated_at "Payment record update time"
    }

    REFUNDS {
        string id PK "Primary Key"
        string payment_id FK "Reference to Payments"
        string refund_reference "Refund reference number"
        enum refund_reason "Reason (cancellation/schedule_change/system_error)"
        decimal refund_amount "Refund amount"
        decimal processing_fee "Refund processing fee"
        enum refund_status "Status (initiated/processing/completed/failed)"
        string refund_method "Refund method"
        timestamp refund_date "Refund processing time"
        timestamp created_at "Refund record creation time"
        timestamp updated_at "Refund record update time"
    }

    TICKETS {
        string id PK "Primary Key"
        string booking_id FK "Reference to Bookings"
        string passenger_id FK "Reference to Passengers"
        string ticket_number "Unique ticket number"
        string qr_code "Ticket QR code"
        enum ticket_status "Status (active/used/cancelled/expired)"
        timestamp check_in_time "Passenger check-in time"
        string checked_in_by "Check-in staff/system"
        timestamp created_at "Ticket creation time"
        timestamp updated_at "Ticket update time"
    }

    PROMOTIONS {
        string id PK "Primary Key"
        string promotion_code "Unique promotion code"
        string promotion_name "Promotion name"
        enum discount_type "Type (percentage/fixed_amount)"
        decimal discount_value "Discount value"
        decimal minimum_amount "Minimum purchase amount"
        decimal maximum_discount "Maximum discount amount"
        date valid_from "Promotion start date"
        date valid_to "Promotion end date"
        int usage_limit "Maximum usage count"
        int used_count "Current usage count"
        boolean is_active "Promotion status"
        timestamp created_at "Promotion creation time"
        timestamp updated_at "Promotion update time"
    }

    BOOKING_PROMOTIONS {
        string id PK "Primary Key"
        string booking_id FK "Reference to Bookings"
        string promotion_id FK "Reference to Promotions"
        decimal discount_applied "Applied discount amount"
        timestamp applied_at "Promotion application time"
    }

    USER_SESSIONS {
        string id PK "Primary Key"
        string user_id FK "Reference to Users"
        string session_token "Session token"
        string ip_address "Client IP address"
        string user_agent "Client user agent"
        timestamp login_time "Session start time"
        timestamp last_activity "Last activity time"
        timestamp expires_at "Session expiration time"
        boolean is_active "Session status"
    }

    AUDIT_LOGS {
        string id PK "Primary Key"
        string user_id FK "Reference to Users (nullable)"
        string entity_type "Entity type"
        string entity_id "Entity ID"
        enum action "Action (create/update/delete/view)"
        json old_values "Previous values JSON"
        json new_values "New values JSON"
        string ip_address "Client IP address"
        string user_agent "Client user agent"
        timestamp created_at "Log creation time"
    }

    NOTIFICATIONS {
        string id PK "Primary Key"
        string user_id FK "Reference to Users"
        enum notification_type "Type (booking/payment/schedule/promotion)"
        string title "Notification title"
        string message "Notification message"
        json metadata "Additional data JSON"
        boolean is_read "Read status"
        timestamp sent_at "Notification send time"
        timestamp read_at "Notification read time"
        timestamp created_at "Notification creation time"
    }

    %% Relationships
    USERS ||--|| USER_PROFILES : has
    USERS ||--o{ BOOKINGS : creates
    USERS ||--o{ USER_SESSIONS : has
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ AUDIT_LOGS : performs

    TRAINS ||--o{ TRAIN_CLASSES : has
    TRAINS ||--o{ SCHEDULES : operates
    TRAINS ||--o{ SEATS : contains

    STATIONS ||--o{ ROUTES : origin
    STATIONS ||--o{ ROUTES : destination
    STATIONS ||--o{ ROUTE_STATIONS : includes

    ROUTES ||--o{ ROUTE_STATIONS : contains
    ROUTES ||--o{ SCHEDULES : follows

    TRAIN_CLASSES ||--o{ SEATS : categorizes

    SCHEDULES ||--o{ BOOKINGS : scheduled_for

    BOOKINGS ||--o{ PASSENGERS : includes
    BOOKINGS ||--o{ PAYMENTS : has
    BOOKINGS ||--o{ TICKETS : generates
    BOOKINGS ||--o{ BOOKING_PROMOTIONS : applies

    PASSENGERS ||--|| TICKETS : has
    PASSENGERS ||--|| SEATS : occupies

    PAYMENTS ||--o{ REFUNDS : may_have

    PROMOTIONS ||--o{ BOOKING_PROMOTIONS : used_in
```

## Database Data Flow Diagram

```mermaid
flowchart TD
    UserRegistration[👤 User Registration] --> UserTable[(👤 USERS Table)]
    UserRegistration --> ProfileTable[(👤 USER_PROFILES Table)]
    
    TrainSearch[🔍 Train Search] --> ScheduleQuery[(📅 SCHEDULES Query)]
    ScheduleQuery --> TrainTable[(🚂 TRAINS Table)]
    ScheduleQuery --> RouteTable[(🛤️ ROUTES Table)]
    ScheduleQuery --> StationTable[(🚉 STATIONS Table)]
    ScheduleQuery --> TrainClassTable[(🎫 TRAIN_CLASSES Table)]
    
    BookingCreation[📝 Booking Creation] --> BookingTable[(📝 BOOKINGS Table)]
    BookingCreation --> PassengerTable[(👥 PASSENGERS Table)]
    BookingCreation --> SeatAllocation[(💺 SEATS Update)]
    
    PaymentProcessing[💳 Payment Processing] --> PaymentTable[(💳 PAYMENTS Table)]
    PaymentProcessing --> BookingUpdate[(📝 BOOKINGS Update)]
    
    TicketGeneration[🎫 Ticket Generation] --> TicketTable[(🎫 TICKETS Table)]
    TicketGeneration --> QRCodeGeneration[📱 QR Code Generation]
    
    PromotionApplication[🎫 Promotion Application] --> PromotionTable[(🎫 PROMOTIONS Table)]
    PromotionApplication --> BookingPromotionTable[(🎫 BOOKING_PROMOTIONS Table)]
    
    RefundProcessing[💰 Refund Processing] --> RefundTable[(💰 REFUNDS Table)]
    RefundProcessing --> PaymentUpdate[(💳 PAYMENTS Update)]
    RefundProcessing --> BookingCancellation[(📝 BOOKINGS Update)]
    
    SessionManagement[🔐 Session Management] --> SessionTable[(🔐 USER_SESSIONS Table)]
    
    AuditLogging[📝 Audit Logging] --> AuditTable[(📝 AUDIT_LOGS Table)]
    
    NotificationSending[📧 Notification Sending] --> NotificationTable[(📧 NOTIFICATIONS Table)]
    
    UserTable --> UserAuthentication[🔐 User Authentication]
    ProfileTable --> UserProfile[👤 User Profile Display]
    
    ScheduleQuery --> SearchResults[📋 Search Results]
    
    BookingTable --> BookingConfirmation[✅ Booking Confirmation]
    PassengerTable --> PassengerManagement[👥 Passenger Management]
    
    PaymentTable --> PaymentStatus[💳 Payment Status]
    
    TicketTable --> TicketDisplay[🎫 Ticket Display]
    
    RefundTable --> RefundStatus[💰 Refund Status]
    
    SessionTable --> SessionValidation[✅ Session Validation]
    
    AuditTable --> SecurityMonitoring[🛡️ Security Monitoring]
    AuditTable --> ComplianceReporting[📊 Compliance Reporting]
    
    NotificationTable --> UserNotifications[📧 User Notifications]
    
    style UserTable fill:#4CAF50,color:#fff
    style BookingTable fill:#2196F3,color:#fff
    style PaymentTable fill:#FF9800,color:#fff
    style TicketTable fill:#9C27B0,color:#fff
    style ScheduleQuery fill:#8BC34A,color:#fff
```

## Database Transaction Flow

```mermaid
flowchart TD
    TransactionStart[🔄 Transaction Start] --> LockAcquisition[🔒 Lock Acquisition]
    
    LockAcquisition --> LockType{🔒 Lock Type?}
    
    LockType --> ReadLock[📖 Read Lock]
    LockType --> WriteLock[✍️ Write Lock]
    LockType --> ExclusiveLock[🔒 Exclusive Lock]
    
    ReadLock --> ReadOperation[📖 Read Operation]
    WriteLock --> WriteOperation[✍️ Write Operation]
    ExclusiveLock --> ExclusiveOperation[🔒 Exclusive Operation]
    
    ReadOperation --> DataRetrieval[📊 Data Retrieval]
    WriteOperation --> DataModification[✍️ Data Modification]
    ExclusiveOperation --> CriticalOperation[🔒 Critical Operation]
    
    DataRetrieval --> ValidationCheck[✅ Validation Check]
    DataModification --> ValidationCheck
    CriticalOperation --> ValidationCheck
    
    ValidationCheck --> ValidationResult{✅ Valid?}
    
    ValidationResult -->|No| ValidationError[❌ Validation Error]
    ValidationResult -->|Yes| BusinessLogic[🧠 Business Logic Processing]
    
    ValidationError --> Rollback[🔄 Transaction Rollback]
    
    BusinessLogic --> LogicResult{🧠 Logic Result?}
    
    LogicResult -->|Error| BusinessError[❌ Business Logic Error]
    LogicResult -->|Success| DatabaseWrite[💾 Database Write]
    
    BusinessError --> Rollback
    
    DatabaseWrite --> WriteResult{💾 Write Result?}
    
    WriteResult -->|Error| WriteError[❌ Write Error]
    WriteResult -->|Success| IntegrityCheck[🔍 Integrity Check]
    
    WriteError --> Rollback
    
    IntegrityCheck --> IntegrityResult{🔍 Integrity Valid?}
    
    IntegrityResult -->|No| IntegrityError[❌ Integrity Error]
    IntegrityResult -->|Yes| PreCommitValidation[✅ Pre-commit Validation]
    
    IntegrityError --> Rollback
    
    PreCommitValidation --> CommitReady{✅ Ready to Commit?}
    
    CommitReady -->|No| PreCommitError[❌ Pre-commit Error]
    CommitReady -->|Yes| TransactionCommit[✅ Transaction Commit]
    
    PreCommitError --> Rollback
    
    TransactionCommit --> CommitResult{✅ Commit Result?}
    
    CommitResult -->|Error| CommitError[❌ Commit Error]
    CommitResult -->|Success| LockRelease[🔓 Lock Release]
    
    CommitError --> Rollback
    
    Rollback --> RollbackExecution[🔄 Rollback Execution]
    RollbackExecution --> ErrorLogging[📝 Error Logging]
    ErrorLogging --> LockRelease
    
    LockRelease --> TransactionEnd[🔄 Transaction End]
    
    TransactionEnd --> PostTransactionCleanup[🧹 Post-transaction Cleanup]
    PostTransactionCleanup --> TransactionComplete[✅ Transaction Complete]
    
    style TransactionStart fill:#4CAF50,color:#fff
    style ValidationCheck fill:#2196F3,color:#fff
    style DatabaseWrite fill:#FF9800,color:#fff
    style TransactionCommit fill:#9C27B0,color:#fff
    style TransactionComplete fill:#8BC34A,color:#fff
```

## Database Backup and Recovery Flow

```mermaid
flowchart TD
    BackupInitiation[💾 Backup Initiation] --> BackupType{💾 Backup Type?}
    
    BackupType --> FullBackup[📦 Full Backup]
    BackupType --> IncrementalBackup[📈 Incremental Backup]
    BackupType --> DifferentialBackup[📊 Differential Backup]
    BackupType --> LogBackup[📝 Log Backup]
    
    FullBackup --> DatabaseSnapshot[📸 Database Snapshot]
    IncrementalBackup --> ChangeIdentification[🔍 Change Identification]
    DifferentialBackup --> DifferenceIdentification[🔍 Difference Identification]
    LogBackup --> TransactionLogCapture[📝 Transaction Log Capture]
    
    DatabaseSnapshot --> SnapshotValidation[✅ Snapshot Validation]
    ChangeIdentification --> IncrementalValidation[✅ Incremental Validation]
    DifferenceIdentification --> DifferentialValidation[✅ Differential Validation]
    TransactionLogCapture --> LogValidation[✅ Log Validation]
    
    SnapshotValidation --> CompressionProcess[🗜️ Compression Process]
    IncrementalValidation --> CompressionProcess
    DifferentialValidation --> CompressionProcess
    LogValidation --> CompressionProcess
    
    CompressionProcess --> EncryptionProcess[🔐 Encryption Process]
    EncryptionProcess --> StorageDestination[📦 Storage Destination]
    
    StorageDestination --> StorageType{📦 Storage Type?}
    
    StorageType --> LocalStorage[💾 Local Storage]
    StorageType --> CloudStorage[☁️ Cloud Storage]
    StorageType --> OffSiteStorage[🏢 Off-site Storage]
    StorageType --> HybridStorage[🔄 Hybrid Storage]
    
    LocalStorage --> LocalVerification[✅ Local Verification]
    CloudStorage --> CloudVerification[✅ Cloud Verification]
    OffSiteStorage --> OffSiteVerification[✅ Off-site Verification]
    HybridStorage --> HybridVerification[✅ Hybrid Verification]
    
    LocalVerification --> BackupComplete[✅ Backup Complete]
    CloudVerification --> BackupComplete
    OffSiteVerification --> BackupComplete
    HybridVerification --> BackupComplete
    
    BackupComplete --> BackupCatalog[📋 Backup Catalog Update]
    BackupCatalog --> RetentionPolicy[📅 Retention Policy Check]
    RetentionPolicy --> OldBackupCleanup[🧹 Old Backup Cleanup]
    
    RecoveryRequest[🔄 Recovery Request] --> RecoveryType{🔄 Recovery Type?}
    
    RecoveryType --> PointInTimeRecovery[⏰ Point-in-Time Recovery]
    RecoveryType --> FullRecovery[📦 Full Recovery]
    RecoveryType --> PartialRecovery[📋 Partial Recovery]
    RecoveryType --> DisasterRecovery[🚨 Disaster Recovery]
    
    PointInTimeRecovery --> TimePointIdentification[⏰ Time Point Identification]
    FullRecovery --> FullBackupRetrieval[📦 Full Backup Retrieval]
    PartialRecovery --> PartialBackupRetrieval[📋 Partial Backup Retrieval]
    DisasterRecovery --> DisasterProcedure[🚨 Disaster Procedure]
    
    TimePointIdentification --> LogSequenceReconstruction[📝 Log Sequence Reconstruction]
    FullBackupRetrieval --> FullRestoreProcess[📦 Full Restore Process]
    PartialBackupRetrieval --> PartialRestoreProcess[📋 Partial Restore Process]
    DisasterProcedure --> EmergencyRestoreProcess[🚨 Emergency Restore Process]
    
    LogSequenceReconstruction --> RecoveryValidation[✅ Recovery Validation]
    FullRestoreProcess --> RecoveryValidation
    PartialRestoreProcess --> RecoveryValidation
    EmergencyRestoreProcess --> RecoveryValidation
    
    RecoveryValidation --> ValidationResult{✅ Validation Result?}
    
    ValidationResult -->|Success| RecoveryComplete[✅ Recovery Complete]
    ValidationResult -->|Failure| RecoveryRetry[🔄 Recovery Retry]
    
    RecoveryRetry --> RecoveryType
    RecoveryComplete --> SystemValidation[✅ System Validation]
    SystemValidation --> ServiceRestoration[🔄 Service Restoration]
    
    style BackupInitiation fill:#4CAF50,color:#fff
    style CompressionProcess fill:#2196F3,color:#fff
    style RecoveryRequest fill:#FF9800,color:#fff
    style RecoveryValidation fill:#9C27B0,color:#fff
    style ServiceRestoration fill:#8BC34A,color:#fff
```

## Database Performance Optimization Flow

```mermaid
flowchart TD
    PerformanceMonitoring[📊 Performance Monitoring] --> MetricCollection[📊 Metric Collection]
    
    MetricCollection --> MetricTypes{📊 Metric Types}
    
    MetricTypes --> QueryPerformance[🔍 Query Performance]
    MetricTypes --> IndexUsage[📇 Index Usage]
    MetricTypes --> LockContention[🔒 Lock Contention]
    MetricTypes --> IOStatistics[💾 I/O Statistics]
    MetricTypes --> MemoryUsage[🧠 Memory Usage]
    MetricTypes --> ConnectionPool[🔗 Connection Pool]
    
    QueryPerformance --> SlowQueryIdentification[🐌 Slow Query Identification]
    IndexUsage --> IndexAnalysis[📇 Index Analysis]
    LockContention --> DeadlockAnalysis[🔒 Deadlock Analysis]
    IOStatistics --> DiskUsageAnalysis[💾 Disk Usage Analysis]
    MemoryUsage --> MemoryOptimization[🧠 Memory Optimization]
    ConnectionPool --> ConnectionAnalysis[🔗 Connection Analysis]
    
    SlowQueryIdentification --> QueryOptimization[🔍 Query Optimization]
    IndexAnalysis --> IndexOptimization[📇 Index Optimization]
    DeadlockAnalysis --> LockOptimization[🔒 Lock Optimization]
    DiskUsageAnalysis --> StorageOptimization[💾 Storage Optimization]
    MemoryOptimization --> CacheOptimization[🧠 Cache Optimization]
    ConnectionAnalysis --> PoolOptimization[🔗 Pool Optimization]
    
    QueryOptimization --> OptimizationTechniques{🔍 Optimization Techniques}
    
    OptimizationTechniques --> QueryRewriting[✍️ Query Rewriting]
    OptimizationTechniques --> IndexCreation[📇 Index Creation]
    OptimizationTechniques --> Partitioning[📊 Table Partitioning]
    OptimizationTechniques --> MaterializedViews[👁️ Materialized Views]
    OptimizationTechniques --> QueryPlanning[📋 Query Planning]
    
    QueryRewriting --> RewriteValidation[✅ Rewrite Validation]
    IndexCreation --> IndexValidation[✅ Index Validation]
    Partitioning --> PartitionValidation[✅ Partition Validation]
    MaterializedViews --> ViewValidation[✅ View Validation]
    QueryPlanning --> PlanValidation[✅ Plan Validation]
    
    RewriteValidation --> PerformanceTesting[🧪 Performance Testing]
    IndexValidation --> PerformanceTesting
    PartitionValidation --> PerformanceTesting
    ViewValidation --> PerformanceTesting
    PlanValidation --> PerformanceTesting
    
    PerformanceTesting --> TestResults{🧪 Test Results}
    
    TestResults -->|Improved| OptimizationSuccess[✅ Optimization Success]
    TestResults -->|Degraded| OptimizationRollback[🔄 Optimization Rollback]
    TestResults -->|Neutral| OptimizationEvaluation[📊 Optimization Evaluation]
    
    OptimizationSuccess --> DeploymentPreparation[🚀 Deployment Preparation]
    OptimizationRollback --> AlternativeOptimization[🔄 Alternative Optimization]
    OptimizationEvaluation --> CostBenefitAnalysis[💰 Cost-Benefit Analysis]
    
    AlternativeOptimization --> OptimizationTechniques
    CostBenefitAnalysis --> DeploymentDecision[📊 Deployment Decision]
    
    DeploymentDecision --> DeploymentApproved{📊 Deployment Approved?}
    DeploymentApproved -->|Yes| DeploymentPreparation
    DeploymentApproved -->|No| OptimizationArchive[📦 Optimization Archive]
    
    DeploymentPreparation --> StagingDeployment[🏗️ Staging Deployment]
    StagingDeployment --> StagingValidation[✅ Staging Validation]
    StagingValidation --> ProductionDeployment[🚀 Production Deployment]
    
    ProductionDeployment --> ProductionValidation[✅ Production Validation]
    ProductionValidation --> MonitoringSetup[📊 Monitoring Setup]
    MonitoringSetup --> ContinuousMonitoring[🔄 Continuous Monitoring]
    
    ContinuousMonitoring --> PerformanceMonitoring
    
    style PerformanceMonitoring fill:#4CAF50,color:#fff
    style QueryOptimization fill:#2196F3,color:#fff
    style PerformanceTesting fill:#FF9800,color:#fff
    style ProductionDeployment fill:#9C27B0,color:#fff
    style ContinuousMonitoring fill:#8BC34A,color:#fff
```
