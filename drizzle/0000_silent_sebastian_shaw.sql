CREATE TABLE `test` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tag_name` text NOT NULL,
	`notify_recently_met` integer,
	`notify_number_days` integer
);
