CREATE TABLE `access_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionToken` varchar(128) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp NOT NULL,
	CONSTRAINT `access_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `access_sessions_sessionToken_unique` UNIQUE(`sessionToken`)
);
--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`lastAnalysisAt` timestamp NOT NULL DEFAULT (now()),
	`analysisCount` int NOT NULL DEFAULT 1,
	CONSTRAINT `rate_limits_id` PRIMARY KEY(`id`)
);
