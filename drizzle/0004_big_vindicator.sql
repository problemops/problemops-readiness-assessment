ALTER TABLE `assessmentData` ADD `priorityMatrixData` text;--> statement-breakpoint
ALTER TABLE `assessments` ADD `detectedIndustry` varchar(100) DEFAULT 'Professional Services';--> statement-breakpoint
ALTER TABLE `assessments` ADD `industryConfidence` varchar(10);