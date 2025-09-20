CREATE TABLE `test` (
	`id` integer PRIMARY KEY NOT NULL,
	`tag_id` integer,
	`name` text NOT NULL,
	`birthday` text,
	`location` text,
	`address` text,
	`celnumber` text,
	`job` text,
	`employer` text,
	`hobbies` text,
	`wishes` text,
	`goals` text,
	`recent_events` text,
	`linkedin` text,
	`email` text,
	`notes` text,
	`know_from` text,
	`know_from_date` text,
	`last_met_date` text,
	FOREIGN KEY (`tag_id`) REFERENCES `tag`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tag` (
	`id` integer PRIMARY KEY NOT NULL,
	`tag_name` text NOT NULL,
	`notify_recently_met` integer,
	`notify_number_days` integer
);
