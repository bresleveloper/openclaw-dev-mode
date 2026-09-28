import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { i as UPDATE_RUN_TRIGGERS, n as UPDATE_RUN_STATUSES, r as UPDATE_RUN_STEP_STATUSES, t as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BYZF4sMi.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
//#region src/infra/update-doctor-config-schema.ts
const UpdateDoctorConfigChangeSchema = discriminatedUnion("kind", [object({
	kind: literal("key"),
	key: string()
}), object({
	kind: literal("migration"),
	message: string()
})]);
const UpdateDoctorConfigWriteRefusalSchema = object({
	reason: string(),
	message: string(),
	keys: array(string())
});
//#endregion
//#region src/infra/update-recovery.ts
const updateRecoverySchema = discriminatedUnion("serviceRestartSafe", [strictObject({
	serviceRestartSafe: literal(true),
	packageRollbackVerified: literal(true).optional(),
	version: string().trim().min(1),
	buildId: string().trim().min(1).max(96).optional(),
	service: _enum(["healthy", "failed"]).optional(),
	reason: string().trim().min(1).optional()
}), strictObject({
	serviceRestartSafe: literal(false),
	packageRollbackVerified: boolean().optional(),
	reason: _enum([
		"source-rollback-failed",
		"state-migration-started",
		"manager-unavailable",
		"deps-install-failed",
		"build-failed",
		"rollback-checkout-dirty",
		"runtime-verification-failed"
	])
})]);
//#endregion
//#region src/infra/update-snapshot-capacity-schema.ts
const locationKind = _enum([
	"explicit-tmpdir",
	"state-volume",
	"system-tmpdir"
]);
const bytes = number().int().nonnegative();
const UpdateSnapshotCapacitySchema = object({
	reason: _enum([
		...locationKind.options,
		"snapshot-capacity-insufficient",
		"snapshot-location-unavailable"
	]),
	sqliteBytes: bytes,
	pluginBytes: bytes.nullable(),
	requiredBytes: bytes,
	candidates: array(object({
		kind: locationKind,
		directory: string(),
		availableBytes: bytes.nullable(),
		allocationError: string().optional()
	})).max(3),
	selection: object({
		kind: locationKind,
		directory: string()
	}).nullable()
});
//#endregion
//#region src/infra/update-run-schema.ts
const destinationPath = string().max(240);
const UpdateDestinationFailureSchema = strictObject({
	ownership: _enum(["foreign", "unknown"]),
	cause: _enum([
		"package-mismatch",
		"launcher-mismatch",
		"permission",
		"probe-failure",
		"unreadable-layout"
	]),
	destinationKind: _enum(["npm-global", "unknown"]),
	prefix: destinationPath.nullable(),
	packageRoot: destinationPath.nullable(),
	runningRoot: destinationPath,
	runningPrefix: destinationPath.nullable(),
	launcher: destinationPath.nullable(),
	launcherTarget: destinationPath.nullable()
});
const UpdateFailureFactSchema = object({
	check: string().max(128),
	code: string().max(80),
	message: string().max(200).optional(),
	affectedKey: string().max(128).optional(),
	pluginId: string().max(80).optional(),
	errorName: string().max(80).nullable().optional(),
	location: string().max(160).nullable().optional(),
	destination: UpdateDestinationFailureSchema.optional()
});
const UpdateRollbackOutcomeSchema = object({
	status: _enum([
		"not-needed",
		"not-attempted",
		"succeeded",
		"failed"
	]),
	reason: string().max(512)
});
const text = string().max(UPDATE_RUN_TEXT_LIMIT);
const timestamp = number().int().nonnegative();
const version = object({
	version: text.nullable().optional(),
	sha: text.nullable().optional(),
	buildId: text.nullable().optional()
});
const UpdateRunStepSchema = object({
	step: text,
	status: _enum(UPDATE_RUN_STEP_STATUSES),
	startedAtMs: timestamp.optional(),
	endedAtMs: timestamp.optional(),
	exitCode: number().int().nullable().optional(),
	detail: text.optional(),
	failureFacts: array(UpdateFailureFactSchema).max(5).optional(),
	configChange: discriminatedUnion("kind", [UpdateDoctorConfigChangeSchema.options[0].extend({ key: text }), UpdateDoctorConfigChangeSchema.options[1].extend({ message: text })]).optional(),
	configWriteRefusal: UpdateDoctorConfigWriteRefusalSchema.extend({
		reason: text,
		message: text,
		keys: array(text).max(32)
	}).optional(),
	snapshotCapacity: UpdateSnapshotCapacitySchema.extend({
		candidates: array(UpdateSnapshotCapacitySchema.shape.candidates.element.extend({
			directory: text,
			allocationError: text.optional()
		})).max(3),
		selection: UpdateSnapshotCapacitySchema.shape.selection.unwrap().extend({ directory: text }).nullable()
	}).optional()
});
const driver = object({
	host: string().min(1).max(255),
	pid: number().int().positive().max(Number.MAX_SAFE_INTEGER),
	startIdentity: string().max(128).regex(/^\d+$/)
});
const UpdateRunRecordSchema = object({
	runId: uuid(),
	createdAtMs: timestamp,
	updatedAtMs: timestamp,
	trigger: _enum(UPDATE_RUN_TRIGGERS),
	phase: _enum(UPDATE_RUN_PHASES),
	status: _enum(UPDATE_RUN_STATUSES),
	reason: text.nullable(),
	origin: object({
		driver: driver.optional(),
		previousDrivers: array(driver).max(7).optional(),
		requester: object({
			channel: text.optional(),
			accountId: text.optional(),
			senderId: text.optional(),
			authorizationSource: text.optional()
		}).optional(),
		sessionKey: text.optional(),
		deliveryContext: object({
			channel: text.optional(),
			to: text.optional(),
			accountId: text.optional(),
			threadId: text.optional()
		}).optional(),
		campaignId: text.optional(),
		doctorHint: text.optional(),
		nextAction: text.optional()
	}),
	target: object({
		channel: text.optional(),
		tag: text.optional(),
		kind: _enum(["package", "git"]).optional(),
		version: text.optional(),
		sha: text.optional(),
		installationMethod: _enum([
			"git-checkout",
			"npm-global",
			"pnpm-global",
			"bun-global",
			"managed-service"
		]).nullable().optional()
	}),
	before: version,
	after: version,
	steps: array(UpdateRunStepSchema).max(128),
	verification: object({
		rollbackOutcome: UpdateRollbackOutcomeSchema.nullable().optional(),
		recovery: updateRecoverySchema.nullable().optional(),
		booted: boolean().optional(),
		runningVersion: text.optional(),
		runningBuildId: text.optional(),
		serviceRunning: boolean().optional(),
		pid: timestamp.optional(),
		port: number().int().min(1).max(65535).optional(),
		versionMatch: boolean().optional(),
		pluginErrors: array(text).max(32).optional(),
		channelsReady: boolean().optional(),
		readyz: boolean().optional(),
		settled: boolean().optional(),
		noticeDelivered: boolean().optional(),
		doctorHint: text.optional()
	}),
	repair: array(object({
		attempt: number().int().positive(),
		status: _enum([
			"succeeded",
			"failed",
			"skipped"
		]),
		startedAtMs: timestamp,
		endedAtMs: timestamp.optional(),
		summary: text.optional(),
		reason: text.optional()
	})).max(16),
	confirmedAtMs: timestamp.nullable(),
	finishedAtMs: timestamp.nullable(),
	downtimeMs: timestamp.nullable()
});
//#endregion
export { UpdateDoctorConfigChangeSchema as a, updateRecoverySchema as i, UpdateFailureFactSchema as n, UpdateDoctorConfigWriteRefusalSchema as o, UpdateRunRecordSchema as r, UpdateDestinationFailureSchema as t };
