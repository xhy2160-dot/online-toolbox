CREATE TABLE `stocks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`ticker` varchar(255) NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `stocks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `tools` MODIFY COLUMN `url` varchar(300) NOT NULL;--> statement-breakpoint
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_user_id_users_uid_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`uid`) ON DELETE cascade ON UPDATE no action;