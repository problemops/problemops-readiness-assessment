CREATE TABLE `assessmentData` (
	`assessmentId` varchar(36) NOT NULL,
	`answers` text NOT NULL,
	`driverScores` text NOT NULL,
	`priorityAreas` text,
	`roiData` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessmentData_assessmentId` PRIMARY KEY(`assessmentId`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` varchar(36) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`companyEmail` varchar(255),
	`companyWebsite` varchar(500),
	`teamName` varchar(100),
	`teamSize` int NOT NULL,
	`avgSalary` int NOT NULL,
	`trainingType` enum('half-day','full-day','month-long','not-sure') NOT NULL,
	`readinessScore` varchar(10) NOT NULL,
	`dysfunctionCost` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `emailLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` varchar(36) NOT NULL,
	`recipientEmail` varchar(255) NOT NULL,
	`emailType` enum('results_link','results_with_pdf') NOT NULL,
	`status` enum('pending','sent','failed','bounced') NOT NULL DEFAULT 'pending',
	`providerMessageId` varchar(255),
	`errorMessage` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`sentAt` timestamp,
	CONSTRAINT `emailLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pdfCache` (
	`assessmentId` varchar(36) NOT NULL,
	`pdfUrl` varchar(500),
	`pdfSizeBytes` int,
	`generatedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pdfCache_assessmentId` PRIMARY KEY(`assessmentId`)
);
--> statement-breakpoint
ALTER TABLE `assessmentData` ADD CONSTRAINT `assessmentData_assessmentId_assessments_id_fk` FOREIGN KEY (`assessmentId`) REFERENCES `assessments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `emailLogs` ADD CONSTRAINT `emailLogs_assessmentId_assessments_id_fk` FOREIGN KEY (`assessmentId`) REFERENCES `assessments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pdfCache` ADD CONSTRAINT `pdfCache_assessmentId_assessments_id_fk` FOREIGN KEY (`assessmentId`) REFERENCES `assessments`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `idx_company_name` ON `assessments` (`companyName`);--> statement-breakpoint
CREATE INDEX `idx_created_at` ON `assessments` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_email_assessment_id` ON `emailLogs` (`assessmentId`);--> statement-breakpoint
CREATE INDEX `idx_email_status` ON `emailLogs` (`status`);--> statement-breakpoint
CREATE INDEX `idx_email_created_at` ON `emailLogs` (`createdAt`);