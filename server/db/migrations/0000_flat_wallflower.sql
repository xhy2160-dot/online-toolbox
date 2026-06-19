CREATE TABLE `fruits` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `fruits_id` PRIMARY KEY(`id`)
);
