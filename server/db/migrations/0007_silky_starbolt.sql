ALTER TABLE `stocks` DROP FOREIGN KEY `stocks_user_id_users_uid_fk`;
--> statement-breakpoint
ALTER TABLE `stocks` MODIFY COLUMN `user_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `stocks` ADD CONSTRAINT `stocks_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;