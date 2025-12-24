CREATE TABLE `testRegistry` (
	`id` int AUTO_INCREMENT NOT NULL,
	`testId` varchar(100) NOT NULL,
	`testType` enum('unit','integration','bdd','browser','api') NOT NULL,
	`testCategory` varchar(50) NOT NULL,
	`testSuite` varchar(255) NOT NULL,
	`testName` varchar(500) NOT NULL,
	`description` text,
	`givenContext` text,
	`whenAction` text,
	`thenOutcome` text,
	`additionalExpectations` text,
	`priority` enum('P0','P1','P2','P3') NOT NULL DEFAULT 'P2',
	`status` enum('ACTIVE','PENDING','SKIPPED','DEPRECATED') NOT NULL DEFAULT 'ACTIVE',
	`isAutomated` int NOT NULL DEFAULT 0,
	`filePath` varchar(500),
	`implementationLocation` varchar(500),
	`testCoverageMethod` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastRunAt` timestamp,
	`lastRunStatus` enum('PASS','FAIL','SKIPPED'),
	`notes` text,
	CONSTRAINT `testRegistry_id` PRIMARY KEY(`id`),
	CONSTRAINT `testRegistry_testId_unique` UNIQUE(`testId`)
);
--> statement-breakpoint
CREATE INDEX `idx_test_type` ON `testRegistry` (`testType`);--> statement-breakpoint
CREATE INDEX `idx_test_category` ON `testRegistry` (`testCategory`);--> statement-breakpoint
CREATE INDEX `idx_priority` ON `testRegistry` (`priority`);--> statement-breakpoint
CREATE INDEX `idx_status` ON `testRegistry` (`status`);--> statement-breakpoint
CREATE INDEX `idx_is_automated` ON `testRegistry` (`isAutomated`);