import { index, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Assessment tables for ProblemOps Team Readiness Assessment
 * Optimized for high-performance, multi-client usage
 */

// Table 1: Core assessment data (hot path - optimized for fast reads)
export const assessments = mysqlTable("assessments", {
  // Primary key (UUID stored as CHAR(36) for MySQL compatibility)
  id: varchar("id", { length: 36 }).primaryKey(),
  
  // Company information
  companyName: varchar("companyName", { length: 255 }).notNull(),
  companyEmail: varchar("companyEmail", { length: 255 }),
  companyWebsite: varchar("companyWebsite", { length: 500 }),
  teamName: varchar("teamName", { length: 100 }),
  
  // Team metrics
  teamSize: int("teamSize").notNull(),
  avgSalary: int("avgSalary").notNull(),
  trainingType: mysqlEnum("trainingType", ["half-day", "full-day", "month-long", "not-sure"]).notNull(),
  
  // Calculated results (denormalized for performance)
  readinessScore: varchar("readinessScore", { length: 10 }).notNull(), // Stored as string to preserve precision
  dysfunctionCost: varchar("dysfunctionCost", { length: 20 }).notNull(),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, (table) => ({
  // Indexes for fast lookups
  companyNameIdx: index("idx_company_name").on(table.companyName),
  createdAtIdx: index("idx_created_at").on(table.createdAt),
}));

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

// Table 2: Detailed assessment data (large JSON blobs)
export const assessmentData = mysqlTable("assessmentData", {
  assessmentId: varchar("assessmentId", { length: 36 }).primaryKey().references(() => assessments.id, { onDelete: "cascade" }),
  
  // Raw data stored as JSON text
  answers: text("answers").notNull(), // JSON: {1: 3, 2: 4, ...}
  driverScores: text("driverScores").notNull(), // JSON: {trust: 3.4, ...}
  priorityAreas: text("priorityAreas"), // JSON: cached priority rankings
  roiData: text("roiData"), // JSON: cached ROI calculations
  
  // Timestamps
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssessmentData = typeof assessmentData.$inferSelect;
export type InsertAssessmentData = typeof assessmentData.$inferInsert;

// Table 3: Email delivery tracking
export const emailLogs = mysqlTable("emailLogs", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: varchar("assessmentId", { length: 36 }).notNull().references(() => assessments.id, { onDelete: "cascade" }),
  
  // Email details
  recipientEmail: varchar("recipientEmail", { length: 255 }).notNull(),
  emailType: mysqlEnum("emailType", ["results_link", "results_with_pdf"]).notNull(),
  
  // Delivery status
  status: mysqlEnum("status", ["pending", "sent", "failed", "bounced"]).default("pending").notNull(),
  providerMessageId: varchar("providerMessageId", { length: 255 }),
  errorMessage: text("errorMessage"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
}, (table) => ({
  assessmentIdIdx: index("idx_email_assessment_id").on(table.assessmentId),
  statusIdx: index("idx_email_status").on(table.status),
  createdAtIdx: index("idx_email_created_at").on(table.createdAt),
}));

export type EmailLog = typeof emailLogs.$inferSelect;
export type InsertEmailLog = typeof emailLogs.$inferInsert;

// Table 4: PDF cache for performance
export const pdfCache = mysqlTable("pdfCache", {
  assessmentId: varchar("assessmentId", { length: 36 }).primaryKey().references(() => assessments.id, { onDelete: "cascade" }),
  
  // PDF storage (S3/CDN URL)
  pdfUrl: varchar("pdfUrl", { length: 500 }),
  pdfSizeBytes: int("pdfSizeBytes"),
  
  // Cache metadata
  generatedAt: timestamp("generatedAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PdfCache = typeof pdfCache.$inferSelect;
export type InsertPdfCache = typeof pdfCache.$inferInsert;
// Table 5: Master Test Registry
// Centralized registry of all tests (unit, integration, BDD, browser, API)
export const testRegistry = mysqlTable("testRegistry", {
  id: int("id").autoincrement().primaryKey(),
  
  // Test Identification
  testId: varchar("testId", { length: 100 }).notNull().unique(),
  testType: mysqlEnum("testType", ["unit", "integration", "bdd", "browser", "api"]).notNull(),
  testCategory: varchar("testCategory", { length: 50 }).notNull(),
  
  // Test Details
  testSuite: varchar("testSuite", { length: 255 }).notNull(),
  testName: varchar("testName", { length: 500 }).notNull(),
  description: text("description"),
  
  // BDD Structure (for BDD scenarios)
  givenContext: text("givenContext"),
  whenAction: text("whenAction"),
  thenOutcome: text("thenOutcome"),
  additionalExpectations: text("additionalExpectations"),
  
  // Test Metadata
  priority: mysqlEnum("priority", ["P0", "P1", "P2", "P3"]).default("P2").notNull(),
  status: mysqlEnum("status", ["ACTIVE", "PENDING", "SKIPPED", "DEPRECATED"]).default("ACTIVE").notNull(),
  isAutomated: int("isAutomated").default(0).notNull(), // 0 = manual, 1 = automated
  
  // Implementation Details
  filePath: varchar("filePath", { length: 500 }),
  implementationLocation: varchar("implementationLocation", { length: 500 }),
  testCoverageMethod: varchar("testCoverageMethod", { length: 255 }),
  
  // Tracking
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastRunAt: timestamp("lastRunAt"),
  lastRunStatus: mysqlEnum("lastRunStatus", ["PASS", "FAIL", "SKIPPED"]),
  
  // Notes
  notes: text("notes"),
}, (table) => ({
  testTypeIdx: index("idx_test_type").on(table.testType),
  testCategoryIdx: index("idx_test_category").on(table.testCategory),
  priorityIdx: index("idx_priority").on(table.priority),
  statusIdx: index("idx_status").on(table.status),
  isAutomatedIdx: index("idx_is_automated").on(table.isAutomated),
}));

export type TestRegistry = typeof testRegistry.$inferSelect;
export type InsertTestRegistry = typeof testRegistry.$inferInsert;
