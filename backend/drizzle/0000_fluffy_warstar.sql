CREATE TABLE "users" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"age" integer,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"phone_number" varchar(20),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"description" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city" varchar(255),
	"description" text,
	"longitude" varchar(100),
	"latitude" varchar(100),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "stations" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"station_code" varchar(50),
	"location_id" uuid,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trains" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category_id" uuid,
	"train_code" varchar(50),
	"name" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "schedules" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"train_id" uuid,
	"origin_station_id" uuid,
	"destination_station_id" uuid,
	"departure_time" timestamp NOT NULL,
	"arrival_time" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"schedule_id" uuid,
	"price" integer,
	"tax" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_tickets" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"invoice_number" varchar(100) NOT NULL,
	"status" varchar(50),
	"order_date" timestamp NOT NULL,
	"total_price" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "order_details" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"ticket_id" uuid,
	"passenger_name" varchar(255),
	"passenger_type" varchar(50),
	"seat_number" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"invoice_payment" varchar(100),
	"amount" integer,
	"status" varchar(50),
	"method" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "timeline" (
	"uuid" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"order_id" uuid,
	"status" varchar(50),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "stations" ADD CONSTRAINT "stations_location_id_locations_uuid_fk" FOREIGN KEY ("location_id") REFERENCES "public"."locations"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trains" ADD CONSTRAINT "trains_category_id_categories_uuid_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_train_id_trains_uuid_fk" FOREIGN KEY ("train_id") REFERENCES "public"."trains"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_origin_station_id_locations_uuid_fk" FOREIGN KEY ("origin_station_id") REFERENCES "public"."locations"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_destination_station_id_locations_uuid_fk" FOREIGN KEY ("destination_station_id") REFERENCES "public"."locations"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_schedule_id_schedules_uuid_fk" FOREIGN KEY ("schedule_id") REFERENCES "public"."schedules"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_tickets" ADD CONSTRAINT "order_tickets_user_id_users_uuid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_order_id_order_tickets_uuid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order_tickets"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_ticket_id_tickets_uuid_fk" FOREIGN KEY ("ticket_id") REFERENCES "public"."tickets"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_order_tickets_uuid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order_tickets"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timeline" ADD CONSTRAINT "timeline_order_id_order_tickets_uuid_fk" FOREIGN KEY ("order_id") REFERENCES "public"."order_tickets"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "name_user_idx" ON "users" USING btree ("name");--> statement-breakpoint
CREATE INDEX "email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "pass_idx" ON "users" USING btree ("password");--> statement-breakpoint
CREATE INDEX "name_cat_idx" ON "categories" USING btree ("name");--> statement-breakpoint
CREATE INDEX "city_idx" ON "locations" USING btree ("city");--> statement-breakpoint
CREATE INDEX "long_idx" ON "locations" USING btree ("longitude");--> statement-breakpoint
CREATE INDEX "lat_idx" ON "locations" USING btree ("latitude");