CREATE TABLE `assessmentDrafts` (
	`id` varchar(21) NOT NULL,
	`userId` varchar(64),
	`draftData` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `assessmentDrafts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `idx_draft_expires_at` ON `assessmentDrafts` (`expiresAt`);--> statement-breakpoint
CREATE INDEX `idx_draft_user_id` ON `assessmentDrafts` (`userId`);