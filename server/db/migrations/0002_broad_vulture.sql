CREATE TABLE `tools` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`name` varchar(255) NOT NULL,
	`cat_id` int NOT NULL,
	`clicks` int NOT NULL DEFAULT 0,
	`description` text,
	`img` varchar(500),
	CONSTRAINT `tools_id` PRIMARY KEY(`id`)
);
