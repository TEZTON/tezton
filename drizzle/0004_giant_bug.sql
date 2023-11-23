CREATE TABLE `deliverable_phases` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deliverable_id` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`deliverable_id`) REFERENCES `deliverables`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`type`) REFERENCES `deliverableTypes`(`id`) ON UPDATE no action ON DELETE no action
);
