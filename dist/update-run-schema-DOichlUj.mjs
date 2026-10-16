import { Et as _enum, Fn as object, Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, lr as uuid, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as UPDATE_RUN_TRIGGERS, i as UPDATE_RUN_STEP_STATUSES, n as UPDATE_RUN_PHASES, r as UPDATE_RUN_STATUSES, t as UPDATE_NPM_ERROR_CODES } from "./update-run-vocabulary-BuT3Q1bJ.mjs";
import { t as updateRecoverySchema } from "./update-recovery-nMp5y7WR.mjs";
import { t as UPDATE_RUN_TEXT_LIMIT } from "./update-run-limits-Dcay4rgn.mjs";
import path from "node:path";
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
//#region src/infra/update-recovery-receipt-schema.ts
const sha256 = string().regex(/^[a-f0-9]{64}$/u);
const updateRecoveryWarningSchema = object({
	kind: literal("undeclared-migration-resources"),
	pluginId: string().min(1),
	message: string().min(1)
}).strict();
const updateRecoveryConfigWriteSchema = object({
	path: string().min(1).max(4096).refine((value) => !value.includes("\0") && path.resolve(value) === value),
	beforeHash: sha256.nullable(),
	afterHash: sha256.nullable(),
	contiguous: boolean()
}).strict();
const updateRecoveryRetirementSchema = object({
	directory: string().min(1).max(4096),
	installRoot: string().min(1).max(4096),
	stateDir: string().min(1).max(4096),
	configPath: string().min(1).max(4096),
	identity: object({
		dev: number(),
		ino: number(),
		birthtimeMs: number()
	}).strict(),
	outcome: _enum(["committed", "restored"]),
	generations: array(object({
		kind: _enum(["candidate", "prepared"]),
		manifestSha256: sha256,
		identity: object({
			dev: number(),
			ino: number(),
			birthtimeMs: number()
		}).strict()
	}).strict()).max(2).optional()
}).strict();
const updateRecoveryForwardResolutionSchema = object({
	kind: literal("forward-resolved"),
	binding: object({
		runId: string().min(1),
		failedAtMs: number().int().nonnegative(),
		manifestSha256: sha256,
		candidateSha256: sha256.nullable(),
		preparedSha256: sha256.nullable(),
		incompleteGenerations: object({
			candidate: sha256.optional(),
			prepared: sha256.optional()
		}).strict().optional(),
		installRoot: string().min(1),
		stateDir: string().min(1),
		configPath: string().min(1)
	}).strict(),
	repair: object({
		root: string().min(1),
		packageSha256: sha256,
		node: string().min(1),
		nodeVersion: string().min(1),
		build: string().min(1),
		artifact: object({
			rootIdentity: string().min(1),
			module: string().min(1),
			entry: string().min(1),
			inventorySha256: sha256,
			executableIdentity: string().min(1),
			executableSha256: sha256
		}).strict()
	}).strict(),
	completedAtMs: number().int().nonnegative()
}).strict();
const updateRecoveryCaptureStateSchema = object({
	manifestSha256: sha256,
	configWrites: array(updateRecoveryConfigWriteSchema).max(512),
	warnings: array(updateRecoveryWarningSchema).optional(),
	status: _enum(["pending", "restore-failed"]),
	error: string().max(4096).optional(),
	doctorCompleted: boolean().optional(),
	restored: literal(true).optional(),
	retirement: updateRecoveryRetirementSchema.optional(),
	forwardResolution: updateRecoveryForwardResolutionSchema.optional()
}).strict();
//#endregion
//#region src/infra/update-run-driver-schema.ts
const UpdateRunDriverSchema = object({
	host: string().min(1).max(255),
	pid: number().int().positive().max(Number.MAX_SAFE_INTEGER),
	startIdentity: string().max(128).regex(/^\d+$/)
});
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
const admissionText = string().min(1);
const admissionIdentifier = (maxBytes) => admissionText.refine((value) => Buffer.byteLength(value) <= maxBytes);
const admissionReasonCode = admissionIdentifier(80);
const admissionVersion = admissionIdentifier(128);
const UpdateAdmissionCheckSchema = object({
	name: admissionIdentifier(128),
	status: _enum([
		"ok",
		"warn",
		"refuse"
	]),
	detail: admissionText.optional()
});
const UpdateAdmissionVerdictSchema = object({
	protocol: literal(1),
	verdict: _enum(["admit", "refuse"]),
	reasons: array(object({
		code: admissionReasonCode,
		message: admissionText,
		nextAction: admissionText.optional()
	})).max(32),
	warnings: array(object({
		code: admissionText,
		message: admissionText
	})),
	facts: object({
		candidateVersion: admissionVersion,
		installedVersion: admissionVersion.nullable(),
		nodeEngines: string().optional(),
		checks: array(UpdateAdmissionCheckSchema).max(32)
	})
}).refine((value) => new Set(value.facts.checks.map((check) => check.name)).size === value.facts.checks.length).refine((value) => value.verdict === "refuse" ? value.reasons.length > 0 : value.reasons.length === 0 && value.facts.checks.every((check) => check.status !== "refuse")).refine((value) => {
	const checks = value.facts.checks.map((check) => ({
		...check,
		...check.detail !== void 0 ? { detail: "" } : {}
	}));
	const identity = {
		admission: {
			owner: "candidate",
			protocol: value.protocol,
			candidateVersion: value.facts.candidateVersion,
			checks
		},
		candidateAdmission: {
			...value,
			reasons: value.reasons.map((reason) => ({
				...reason,
				message: "",
				...reason.nextAction !== void 0 ? { nextAction: "" } : {}
			})),
			warnings: [],
			facts: {
				...value.facts,
				checks
			}
		}
	};
	return Buffer.byteLength(JSON.stringify(identity)) <= 2 * UPDATE_RUN_TEXT_LIMIT;
});
function parseUpdateAdmissionVerdict(value) {
	const parsed = UpdateAdmissionVerdictSchema.safeParse(value);
	if (!parsed.success) return null;
	const verdict = parsed.data;
	return {
		...verdict,
		warnings: verdict.warnings.filter((warning) => admissionReasonCode.safeParse(warning.code).success).slice(0, 32)
	};
}
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
	destination: UpdateDestinationFailureSchema.optional(),
	npmErrorCode: _enum(UPDATE_NPM_ERROR_CODES).optional(),
	packageSpec: string().max(200).optional()
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
const admissionCheck = object({
	name: text,
	status: UpdateAdmissionCheckSchema.shape.status,
	detail: text.optional()
});
const admissionChecks = array(admissionCheck).max(32);
const admission = object({
	owner: _enum(["candidate", "installed"]),
	protocol: UpdateAdmissionVerdictSchema.shape.protocol.optional(),
	candidateVersion: text.optional(),
	checks: admissionChecks.optional(),
	fallbackReason: text.optional()
});
const candidateAdmission = object({
	protocol: UpdateAdmissionVerdictSchema.shape.protocol,
	verdict: UpdateAdmissionVerdictSchema.shape.verdict,
	reasons: array(object({
		code: text,
		message: text,
		nextAction: text.optional()
	})).max(32),
	warnings: array(object({
		code: text,
		message: text
	})).max(32),
	facts: object({
		candidateVersion: text,
		installedVersion: text.nullable(),
		nodeEngines: text.optional(),
		checks: admissionChecks
	})
});
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
	termination: _enum([
		"exit",
		"timeout",
		"no-output-timeout",
		"signal"
	]).optional(),
	signal: string().max(32).nullable().optional(),
	stderrTail: string().max(8192).optional(),
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
const UpdateRunRecordSchema = object({
	runId: uuid(),
	createdAtMs: timestamp,
	updatedAtMs: timestamp,
	trigger: _enum(UPDATE_RUN_TRIGGERS),
	phase: _enum(UPDATE_RUN_PHASES),
	status: _enum(UPDATE_RUN_STATUSES),
	reason: text.nullable(),
	admission: admission.optional(),
	origin: object({
		admission: admission.optional(),
		candidateAdmission: candidateAdmission.optional(),
		updateRecoveryCapture: updateRecoveryCaptureStateSchema.optional(),
		driver: UpdateRunDriverSchema.optional(),
		previousDrivers: array(UpdateRunDriverSchema).max(7).optional(),
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
			"managed-service",
			"ocm"
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
export { UpdateRunDriverSchema as a, UpdateDoctorConfigWriteRefusalSchema as c, parseUpdateAdmissionVerdict as i, UpdateFailureFactSchema as n, updateRecoveryCaptureStateSchema as o, UpdateRunRecordSchema as r, UpdateDoctorConfigChangeSchema as s, UpdateDestinationFailureSchema as t };
