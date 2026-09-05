CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tutor_id` text NOT NULL,
	`slot` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_bookings_user_tutor_slot` ON `bookings` (`user_id`,`tutor_id`,`slot`);--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tutor_id` text NOT NULL,
	`list` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_favorites_user_tutor` ON `favorites` (`user_id`,`tutor_id`);--> statement-breakpoint
CREATE TABLE `lists` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_lists_user` ON `lists` (`user_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tutor_id` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_messages_user` ON `messages` (`user_id`);--> statement-breakpoint
CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tutor_id` text NOT NULL,
	`rating` integer NOT NULL,
	`body` text NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_tutor` ON `reviews` (`tutor_id`);--> statement-breakpoint
CREATE TABLE `tutor_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tutor_profiles_user_id_unique` ON `tutor_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `uploads` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text NOT NULL
);
