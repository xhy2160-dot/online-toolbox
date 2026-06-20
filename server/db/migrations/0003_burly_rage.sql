ALTER TABLE `tools` RENAME COLUMN `img` TO `icon`;--> statement-breakpoint
ALTER TABLE `tools` ADD `url` varchar(300);