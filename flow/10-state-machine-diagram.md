# 🔄 State Machine / State Transition Diagram - KAI Railway Ticketing Platform

## User Authentication State Machine

```mermaid
stateDiagram-v2
    [*] --> Anonymous
    
    Anonymous --> LoggingIn: login_attempt
    Anonymous --> Registering: register_attempt
    Anonymous --> Guest: continue_as_guest
    
    LoggingIn --> RateLimited: rate_limit_exceeded
    LoggingIn --> CaptchaRequired: captcha_challenge
    LoggingIn --> AuthenticatingCredentials: captcha_passed
    LoggingIn --> Anonymous: login_cancelled
    
    RateLimited --> LoggingIn: wait_period_expired
    
    CaptchaRequired --> LoggingIn: captcha_failed
    CaptchaRequired --> AuthenticatingCredentials: captcha_verified
    
    AuthenticatingCredentials --> LoggingIn: invalid_credentials
    AuthenticatingCredentials --> Authenticated: credentials_valid
    
    Registering --> RateLimited: rate_limit_exceeded
    Registering --> CaptchaRequired: captcha_challenge_register
    Registering --> ValidatingRegistration: captcha_passed_register
    Registering --> Anonymous: registration_cancelled
    
    ValidatingRegistration --> Registering: validation_failed
    ValidatingRegistration --> CreatingUser: validation_passed
    
    CreatingUser --> Registering: creation_failed
    CreatingUser --> Authenticated: user_created
    
    Authenticated --> SessionActive: session_established
    
    SessionActive --> SessionExpiring: session_warning
    SessionActive --> LoggedOut: logout_request
    SessionActive --> SessionExpired: session_timeout
    
    SessionExpiring --> SessionActive: session_renewed
    SessionExpiring --> SessionExpired: no_activity
    
    SessionExpired --> Anonymous: session_cleared
    LoggedOut --> Anonymous: logout_complete
    
    Guest --> LoggingIn: login_required
    Guest --> Registering: registration_required
    
    state LoggingIn {
        [*] --> EnteringCredentials
        EnteringCredentials --> ValidatingInput: input_complete
        ValidatingInput --> EnteringCredentials: validation_failed
        ValidatingInput --> SubmittingCredentials: validation_passed
        SubmittingCredentials --> [*]
    }
    
    state Authenticated {
        [*] --> LoadingProfile
        LoadingProfile --> ProfileLoaded: profile_success
        LoadingProfile --> ProfileError: profile_failed
        ProfileError --> LoadingProfile: retry_profile
        ProfileLoaded --> [*]
    }
```

## Booking Process State Machine

```mermaid
stateDiagram-v2
    [*] --> SearchingTrains
    
    SearchingTrains --> SearchResults: trains_found
    SearchingTrains --> NoResults: no_trains_available
    SearchingTrains --> SearchError: search_failed
    
    NoResults --> SearchingTrains: modify_search
    SearchError --> SearchingTrains: retry_search
    
    SearchResults --> TrainSelected: select_train
    SearchResults --> SearchingTrains: new_search
    
    TrainSelected --> SeatSelection: proceed_to_seats
    TrainSelected --> SearchResults: back_to_results
    
    SeatSelection --> SeatsSelected: seats_chosen
    SeatSelection --> SeatUnavailable: seats_taken
    SeatSelection --> TrainSelected: back_to_train
    
    SeatUnavailable --> SeatSelection: choose_different_seats
    
    SeatsSelected --> PassengerInfo: proceed_to_passenger
    SeatsSelected --> SeatSelection: change_seats
    
    PassengerInfo --> PassengerComplete: info_validated
    PassengerInfo --> PassengerError: validation_failed
    PassengerInfo --> SeatsSelected: back_to_seats
    
    PassengerError --> PassengerInfo: correct_errors
    
    PassengerComplete --> BookingSummary: proceed_to_summary
    PassengerComplete --> PassengerInfo: edit_info
    
    BookingSummary --> PaymentInitiated: proceed_to_payment
    BookingSummary --> PassengerComplete: back_to_passenger
    
    PaymentInitiated --> PaymentPending: payment_started
    PaymentInitiated --> PaymentCancelled: payment_cancelled
    
    PaymentPending --> PaymentSuccess: payment_completed
    PaymentPending --> PaymentFailed: payment_failed
    PaymentPending --> PaymentExpired: payment_timeout
    
    PaymentSuccess --> BookingConfirmed: booking_complete
    
    PaymentFailed --> PaymentRetry: retry_payment
    PaymentFailed --> BookingCancelled: abandon_booking
    
    PaymentExpired --> PaymentRetry: retry_payment
    PaymentExpired --> BookingCancelled: abandon_booking
    
    PaymentRetry --> PaymentInitiated: new_payment_attempt
    PaymentRetry --> BookingCancelled: abandon_retry
    
    PaymentCancelled --> BookingSummary: return_to_summary
    PaymentCancelled --> BookingCancelled: confirm_cancellation
    
    BookingConfirmed --> TicketGenerated: generate_ticket
    
    TicketGenerated --> [*]: booking_complete
    BookingCancelled --> [*]: booking_cancelled
    
    state SeatSelection {
        [*] --> LoadingSeatMap
        LoadingSeatMap --> SeatMapLoaded: map_loaded
        LoadingSeatMap --> SeatMapError: map_failed
        SeatMapLoaded --> SelectingSeats: user_selecting
        SelectingSeats --> SeatsChosen: selection_complete
        SeatsChosen --> [*]
        SeatMapError --> LoadingSeatMap: retry_load
    }
    
    state PaymentPending {
        [*] --> ProcessingPayment
        ProcessingPayment --> AwaitingConfirmation: payment_submitted
        AwaitingConfirmation --> VerifyingPayment: confirmation_received
        VerifyingPayment --> [*]
    }
```

## Payment Transaction State Machine

```mermaid
stateDiagram-v2
    [*] --> PaymentInitiated
    
    PaymentInitiated --> PaymentMethodSelection: start_payment
    PaymentInitiated --> PaymentCancelled: cancel_payment
    
    PaymentMethodSelection --> CreditCardPayment: select_credit_card
    PaymentMethodSelection --> BankTransfer: select_bank_transfer
    PaymentMethodSelection --> EWalletPayment: select_ewallet
    PaymentMethodSelection --> VirtualAccount: select_virtual_account
    PaymentMethodSelection --> PaymentCancelled: cancel_selection
    
    CreditCardPayment --> PaymentProcessing: submit_card_details
    CreditCardPayment --> PaymentMethodSelection: change_method
    
    BankTransfer --> PaymentPending: generate_transfer_code
    BankTransfer --> PaymentMethodSelection: change_method
    
    EWalletPayment --> PaymentProcessing: ewallet_authorization
    EWalletPayment --> PaymentMethodSelection: change_method
    
    VirtualAccount --> PaymentPending: generate_va_number
    VirtualAccount --> PaymentMethodSelection: change_method
    
    PaymentProcessing --> PaymentSuccess: payment_approved
    PaymentProcessing --> PaymentFailed: payment_declined
    PaymentProcessing --> PaymentPending: requires_verification
    
    PaymentPending --> PaymentSuccess: payment_confirmed
    PaymentPending --> PaymentExpired: payment_timeout
    PaymentPending --> PaymentCancelled: user_cancelled
    
    PaymentSuccess --> PaymentSettled: settlement_complete
    
    PaymentFailed --> PaymentRetry: retry_allowed
    PaymentFailed --> PaymentAbandoned: no_retry
    
    PaymentExpired --> PaymentRetry: within_retry_window
    PaymentExpired --> PaymentAbandoned: retry_window_expired
    
    PaymentRetry --> PaymentMethodSelection: choose_new_method
    PaymentRetry --> PaymentAbandoned: abandon_retry
    
    PaymentCancelled --> [*]: cancellation_complete
    PaymentAbandoned --> [*]: payment_abandoned
    PaymentSettled --> [*]: transaction_complete
    
    state PaymentProcessing {
        [*] --> ValidatingPayment
        ValidatingPayment --> AuthorizingPayment: validation_passed
        ValidatingPayment --> PaymentValidationFailed: validation_failed
        AuthorizingPayment --> PaymentAuthorized: authorization_success
        AuthorizingPayment --> PaymentAuthorizationFailed: authorization_failed
        PaymentAuthorized --> [*]
        PaymentValidationFailed --> [*]
        PaymentAuthorizationFailed --> [*]
    }
    
    state PaymentPending {
        [*] --> AwaitingPayment
        AwaitingPayment --> CheckingPaymentStatus: status_check
        CheckingPaymentStatus --> AwaitingPayment: still_pending
        CheckingPaymentStatus --> PaymentReceived: payment_detected
        PaymentReceived --> [*]
    }
```

## Order Management State Machine

```mermaid
stateDiagram-v2
    [*] --> OrderCreated
    
    OrderCreated --> OrderPending: await_payment
    OrderCreated --> OrderCancelled: immediate_cancellation
    
    OrderPending --> OrderConfirmed: payment_received
    OrderPending --> OrderExpired: payment_timeout
    OrderPending --> OrderCancelled: user_cancellation
    
    OrderConfirmed --> OrderProcessing: begin_processing
    
    OrderProcessing --> OrderComplete: processing_finished
    OrderProcessing --> OrderError: processing_failed
    
    OrderError --> OrderProcessing: retry_processing
    OrderError --> OrderCancelled: processing_abort
    
    OrderComplete --> OrderDelivered: ticket_sent
    OrderComplete --> OrderFulfillment: awaiting_delivery
    
    OrderFulfillment --> OrderDelivered: delivery_complete
    OrderFulfillment --> OrderDeliveryFailed: delivery_failed
    
    OrderDeliveryFailed --> OrderFulfillment: retry_delivery
    OrderDeliveryFailed --> OrderComplete: manual_resolution
    
    OrderDelivered --> OrderUsed: ticket_validated
    OrderDelivered --> OrderRefundRequested: refund_request
    
    OrderUsed --> OrderArchived: journey_complete
    
    OrderRefundRequested --> OrderRefundProcessing: refund_approved
    OrderRefundRequested --> OrderDelivered: refund_denied
    
    OrderRefundProcessing --> OrderRefunded: refund_complete
    OrderRefundProcessing --> OrderRefundFailed: refund_failed
    
    OrderRefundFailed --> OrderRefundProcessing: retry_refund
    OrderRefundFailed --> OrderDelivered: refund_cancelled
    
    OrderExpired --> OrderArchived: cleanup_expired
    OrderCancelled --> OrderArchived: cleanup_cancelled
    OrderRefunded --> OrderArchived: cleanup_refunded
    
    OrderArchived --> [*]: order_lifecycle_complete
    
    state OrderProcessing {
        [*] --> ValidatingOrder
        ValidatingOrder --> GeneratingTicket: validation_passed
        ValidatingOrder --> ValidationFailed: validation_failed
        GeneratingTicket --> TicketGenerated: generation_success
        GeneratingTicket --> GenerationFailed: generation_failed
        TicketGenerated --> [*]
        ValidationFailed --> [*]
        GenerationFailed --> [*]
    }
    
    state OrderRefundProcessing {
        [*] --> CalculatingRefund
        CalculatingRefund --> ProcessingRefund: calculation_complete
        CalculatingRefund --> RefundCalculationFailed: calculation_failed
        ProcessingRefund --> RefundProcessed: refund_success
        ProcessingRefund --> RefundProcessingFailed: refund_failed
        RefundProcessed --> [*]
        RefundCalculationFailed --> [*]
        RefundProcessingFailed --> [*]
    }
```

## Session Management State Machine

```mermaid
stateDiagram-v2
    [*] --> SessionInactive
    
    SessionInactive --> SessionCreating: login_request
    
    SessionCreating --> SessionActive: session_established
    SessionCreating --> SessionCreationFailed: creation_failed
    
    SessionCreationFailed --> SessionInactive: retry_session
    
    SessionActive --> SessionRefreshing: token_refresh_needed
    SessionActive --> SessionExpiring: approaching_expiry
    SessionActive --> SessionTerminating: logout_request
    SessionActive --> SessionInvalid: security_violation
    
    SessionRefreshing --> SessionActive: refresh_successful
    SessionRefreshing --> SessionExpired: refresh_failed
    
    SessionExpiring --> SessionActive: activity_detected
    SessionExpiring --> SessionExpired: no_activity
    SessionExpiring --> SessionExtended: explicit_extension
    
    SessionExtended --> SessionActive: extension_granted
    
    SessionTerminating --> SessionInactive: logout_complete
    
    SessionInvalid --> SessionInactive: session_cleared
    SessionExpired --> SessionInactive: cleanup_complete
    
    state SessionActive {
        [*] --> MonitoringActivity
        MonitoringActivity --> ActivityDetected: user_action
        MonitoringActivity --> NoActivity: idle_period
        ActivityDetected --> MonitoringActivity: continue_monitoring
        NoActivity --> IdleWarning: idle_threshold_reached
        IdleWarning --> MonitoringActivity: activity_resumed
        IdleWarning --> IdleTimeout: idle_timeout_reached
        IdleTimeout --> [*]
    }
    
    state SessionRefreshing {
        [*] --> ValidatingRefreshToken
        ValidatingRefreshToken --> GeneratingNewToken: token_valid
        ValidatingRefreshToken --> RefreshTokenInvalid: token_invalid
        GeneratingNewToken --> TokenGenerated: generation_success
        GeneratingNewToken --> TokenGenerationFailed: generation_failed
        TokenGenerated --> [*]
        RefreshTokenInvalid --> [*]
        TokenGenerationFailed --> [*]
    }
```

## Seat Reservation State Machine

```mermaid
stateDiagram-v2
    [*] --> SeatAvailable
    
    SeatAvailable --> SeatReserving: reservation_request
    
    SeatReserving --> SeatReserved: reservation_successful
    SeatReserving --> SeatUnavailable: reservation_conflict
    SeatReserving --> SeatAvailable: reservation_failed
    
    SeatReserved --> SeatBooked: payment_confirmed
    SeatReserved --> SeatAvailable: reservation_expired
    SeatReserved --> SeatAvailable: reservation_cancelled
    
    SeatBooked --> SeatOccupied: passenger_checked_in
    SeatBooked --> SeatRefunded: booking_refunded
    
    SeatOccupied --> SeatCompleted: journey_finished
    
    SeatRefunded --> SeatAvailable: refund_processed
    SeatCompleted --> SeatAvailable: seat_reset
    SeatUnavailable --> SeatAvailable: maintenance_complete
    
    SeatAvailable --> SeatMaintenance: maintenance_required
    SeatMaintenance --> SeatAvailable: maintenance_complete
    SeatMaintenance --> SeatUnavailable: maintenance_extended
    
    state SeatReserving {
        [*] --> CheckingAvailability
        CheckingAvailability --> LockingSeat: seat_available
        CheckingAvailability --> ReservationConflict: seat_taken
        LockingSeat --> SeatLocked: lock_successful
        LockingSeat --> LockFailed: lock_failed
        SeatLocked --> [*]
        ReservationConflict --> [*]
        LockFailed --> [*]
    }
    
    state SeatBooked {
        [*] --> AwaitingJourney
        AwaitingJourney --> JourneyStarted: departure_time
        JourneyStarted --> JourneyActive: passenger_boarded
        JourneyActive --> JourneyComplete: arrival_time
        JourneyComplete --> [*]
    }
```

## Application Global State Machine

```mermaid
stateDiagram-v2
    [*] --> AppInitializing
    
    AppInitializing --> AppLoading: initialization_complete
    AppInitializing --> AppError: initialization_failed
    
    AppLoading --> AppReady: loading_complete
    AppLoading --> AppError: loading_failed
    
    AppError --> AppLoading: retry_loading
    AppError --> AppMaintenance: critical_error
    
    AppReady --> AppRunning: user_interaction
    
    AppRunning --> AppIdle: no_activity
    AppRunning --> AppBusy: heavy_operation
    AppRunning --> AppError: runtime_error
    AppRunning --> AppMaintenance: maintenance_mode
    
    AppIdle --> AppRunning: activity_detected
    AppIdle --> AppSleeping: extended_idle
    
    AppSleeping --> AppRunning: user_return
    
    AppBusy --> AppRunning: operation_complete
    AppBusy --> AppError: operation_failed
    
    AppMaintenance --> AppLoading: maintenance_complete
    
    state AppRunning {
        [*] --> NormalOperation
        NormalOperation --> HighLoad: load_increase
        NormalOperation --> MaintenanceWindow: scheduled_maintenance
        HighLoad --> NormalOperation: load_decrease
        HighLoad --> OverloadProtection: critical_load
        OverloadProtection --> NormalOperation: load_normalized
        MaintenanceWindow --> NormalOperation: maintenance_complete
    }
    
    state AppError {
        [*] --> DiagnosingError
        DiagnosingError --> RecoverableError: error_recoverable
        DiagnosingError --> CriticalError: error_critical
        RecoverableError --> [*]
        CriticalError --> [*]
    }
```
