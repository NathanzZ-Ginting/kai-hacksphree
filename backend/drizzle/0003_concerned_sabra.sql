CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"session_id" varchar(255),
	"action_type" varchar(100) NOT NULL,
	"action_details" jsonb,
	"page_url" varchar(500),
	"request_method" varchar(10),
	"response_status" integer,
	"ip_address" "inet",
	"user_agent" text,
	"execution_time_ms" integer,
	"timestamp" timestamp with time zone DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "real_time_notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"notification_type" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false,
	"is_sent" boolean DEFAULT false,
	"priority" varchar(20) DEFAULT 'normal',
	"channels" jsonb,
	"sent_at" timestamp with time zone,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"expires_at" timestamp with time zone,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "real_time_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" uuid,
	"user_id" uuid,
	"event_type" varchar(100) NOT NULL,
	"previous_status" varchar(50),
	"new_status" varchar(50),
	"payment_method" varchar(50),
	"amount" numeric(15, 2),
	"currency" varchar(10) DEFAULT 'IDR',
	"event_details" jsonb,
	"timestamp" timestamp with time zone DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "real_time_sessions" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(255) NOT NULL,
	"user_id" uuid,
	"ip_address" "inet",
	"user_agent" text,
	"device_info" jsonb,
	"location_info" jsonb,
	"login_time" timestamp with time zone DEFAULT now(),
	"last_activity" timestamp with time zone DEFAULT now(),
	"is_active" boolean DEFAULT true,
	"logout_time" timestamp with time zone,
	"session_data" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "real_time_sessions_session_id_unique" UNIQUE("session_id")
);
--> statement-breakpoint
CREATE TABLE "security_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"severity" varchar(20) DEFAULT 'medium',
	"user_id" uuid,
	"session_id" varchar(255),
	"ip_address" "inet",
	"user_agent" text,
	"event_details" jsonb,
	"location_info" jsonb,
	"is_resolved" boolean DEFAULT false,
	"resolved_by" uuid,
	"resolved_at" timestamp with time zone,
	"resolution_notes" text,
	"timestamp" timestamp with time zone DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "system_metrics" (
	"id" serial PRIMARY KEY NOT NULL,
	"metric_type" varchar(100) NOT NULL,
	"metric_value" numeric(10, 4),
	"metric_unit" varchar(20),
	"metric_details" jsonb,
	"server_instance" varchar(100),
	"timestamp" timestamp with time zone DEFAULT now(),
	"metadata" jsonb
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_session_id_real_time_sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."real_time_sessions"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "real_time_notifications" ADD CONSTRAINT "real_time_notifications_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "real_time_orders" ADD CONSTRAINT "real_time_orders_order_id_order_tickets_uuid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order_tickets"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "real_time_orders" ADD CONSTRAINT "real_time_orders_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "real_time_sessions" ADD CONSTRAINT "real_time_sessions_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "security_events" ADD CONSTRAINT "security_events_resolved_by_users_uuid_fk" FOREIGN KEY ("resolved_by") REFERENCES "public"."users"("uuid") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_activity_logs_user_id" ON "activity_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_timestamp" ON "activity_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_action_type" ON "activity_logs" USING btree ("action_type");--> statement-breakpoint
CREATE INDEX "idx_activity_logs_session_id" ON "activity_logs" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_real_time_notifications_user_id" ON "real_time_notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_real_time_notifications_read" ON "real_time_notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_real_time_notifications_sent" ON "real_time_notifications" USING btree ("is_sent");--> statement-breakpoint
CREATE INDEX "idx_real_time_notifications_type" ON "real_time_notifications" USING btree ("notification_type");--> statement-breakpoint
CREATE INDEX "idx_real_time_notifications_priority" ON "real_time_notifications" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "idx_real_time_orders_order_id" ON "real_time_orders" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_real_time_orders_user_id" ON "real_time_orders" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_real_time_orders_event_type" ON "real_time_orders" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_real_time_orders_timestamp" ON "real_time_orders" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_real_time_sessions_user_id" ON "real_time_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_real_time_sessions_active" ON "real_time_sessions" USING btree ("is_active","last_activity");--> statement-breakpoint
CREATE INDEX "idx_real_time_sessions_session_id" ON "real_time_sessions" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "idx_security_events_type" ON "security_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "idx_security_events_severity" ON "security_events" USING btree ("severity");--> statement-breakpoint
CREATE INDEX "idx_security_events_timestamp" ON "security_events" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_security_events_resolved" ON "security_events" USING btree ("is_resolved");--> statement-breakpoint
CREATE INDEX "idx_security_events_ip" ON "security_events" USING btree ("ip_address");--> statement-breakpoint
CREATE INDEX "idx_system_metrics_type" ON "system_metrics" USING btree ("metric_type");--> statement-breakpoint
CREATE INDEX "idx_system_metrics_timestamp" ON "system_metrics" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "idx_system_metrics_server" ON "system_metrics" USING btree ("server_instance");