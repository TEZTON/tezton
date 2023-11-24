CREATE TABLE `deliverable_diagram_nodes` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`position_x` integer NOT NULL,
	`position_y` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`deliverable_id` text NOT NULL,
	FOREIGN KEY (`deliverable_id`) REFERENCES `deliverables`(`id`) ON UPDATE no action ON DELETE cascade
);
