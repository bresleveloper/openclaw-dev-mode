import { Et as _enum, Jn as string, Nt as array, Pn as number, Un as record, bn as lazy, lr as uuid, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { a as packageActivationIdentitySchema } from "./package-update-activation-schema-CxYgJXV-.mjs";
import path from "node:path";
//#region src/infra/package-update-activation-immutable-recovery-schema.ts
const absolutePath$2 = string().min(1).max(4096).refine((value) => path.resolve(value) === value && !value.includes("\0"));
const ImmutableRecoveryRuntimeReferenceSchema = strictObject({
	root: absolutePath$2,
	path: absolutePath$2,
	sha: string().regex(/^[a-f0-9]{40}$/u),
	identity: packageActivationIdentitySchema,
	buildDigest: string().regex(/^[a-f0-9]{64}$/u),
	helperPath: absolutePath$2,
	helperIdentity: packageActivationIdentitySchema,
	helperDigest: string().regex(/^[a-f0-9]{64}$/u)
});
//#endregion
//#region src/infra/update-immutable-protection-schema.ts
const immutableConfigFingerprintSchema = lazy(() => union([
	string().regex(/^fp:[a-f0-9]{12}$/u),
	array(immutableConfigFingerprintSchema),
	record(string(), immutableConfigFingerprintSchema)
]));
const absolutePath$1 = string().min(1).refine((value) => path.resolve(value) === value);
const hash = string().regex(/^[a-f0-9]{64}$/u);
const immutableProtectedFileIdentitySchema = strictObject({
	dev: string(),
	ino: string(),
	mode: number().int(),
	nlink: literal(1),
	uid: number().int(),
	gid: number().int()
});
const pathProof = strictObject({
	targetPath: absolutePath$1,
	entries: array(union([strictObject({
		path: absolutePath$1,
		kind: literal("missing-directory")
	}), strictObject({
		path: absolutePath$1,
		kind: literal("existing"),
		dev: string(),
		ino: string(),
		link: string().optional()
	})]))
});
/** Recovery retains fingerprints and path facts, never config values or credentials. */
const ImmutableProtectionSnapshotSchema = strictObject({
	capturedAtMs: number().int().nonnegative(),
	auditBoundary: hash.nullable(),
	state: strictObject({
		path: absolutePath$1,
		identity: immutableProtectedFileIdentitySchema,
		pathProof,
		key: string(),
		birthtime: string().optional()
	}),
	config: array(strictObject({
		path: absolutePath$1,
		identity: immutableProtectedFileIdentitySchema,
		pathProof,
		hash,
		fingerprint: immutableConfigFingerprintSchema,
		policyFingerprint: hash
	})).min(1)
});
//#endregion
//#region src/infra/update-immutable-install-schema.ts
const absolutePath = string().min(1).max(4096).refine((value) => path.resolve(value) === value && !value.includes("\0"));
const generation = strictObject({
	sha: string().regex(/^[a-f0-9]{40}$/u),
	path: absolutePath,
	identity: packageActivationIdentitySchema,
	buildDigest: string().regex(/^[a-f0-9]{64}$/u)
});
const ImmutableInstallDescriptorSchema = strictObject({
	version: union([literal(1), literal(2)]),
	activationEnabled: literal(true).optional(),
	kind: literal("immutable"),
	root: absolutePath,
	rootIdentity: packageActivationIdentitySchema,
	releasesIdentity: packageActivationIdentitySchema,
	current: generation.extend({ pointerIdentity: packageActivationIdentitySchema }),
	service: strictObject({
		unit: string().min(1).max(256),
		scope: literal("system"),
		account: string().min(1).max(256),
		stateDir: absolutePath,
		configPath: absolutePath,
		profile: string().min(1).max(256).nullable()
	}),
	runtime: strictObject({
		path: absolutePath,
		identity: string().min(1).max(256)
	}),
	source: literal("https://github.com/openclaw/openclaw.git")
}).refine((value) => value.version === 2 === (value.activationEnabled === true), { message: "Immutable activation requires an explicitly enabled version-2 adoption." });
const ImmutablePreparedGenerationSchema = generation.extend({
	preparedAtMs: number().int().nonnegative(),
	schemaVersions: record(string().min(1).max(256), number().int().nonnegative()).optional()
});
const ImmutableActivationPhaseSchema = _enum([
	"prepared",
	"draining",
	"stopping",
	"stopped",
	"publishing",
	"starting",
	"verifying",
	"rollback-stopping",
	"rollback-publishing",
	"rollback-starting",
	"rolled-back",
	"recovery-required"
]);
const authority = strictObject({
	databasePath: absolutePath,
	databaseIdentity: packageActivationIdentitySchema,
	parentIdentity: packageActivationIdentitySchema,
	installKey: absolutePath,
	owner: string().min(1).max(4096)
});
const ImmutableActivationOperationSchema = strictObject({
	version: literal(1),
	operationId: uuid(),
	authority,
	phase: ImmutableActivationPhaseSchema,
	previous: generation.extend({ pointerIdentity: packageActivationIdentitySchema }),
	candidate: ImmutablePreparedGenerationSchema,
	serviceDigest: string().regex(/^[a-f0-9]{64}$/u),
	protection: ImmutableProtectionSnapshotSchema,
	recovery: ImmutableRecoveryRuntimeReferenceSchema,
	startedAtMs: number().int().nonnegative(),
	candidateStartedAtMs: number().int().nonnegative().optional(),
	servingStartedAtMs: number().int().nonnegative().optional(),
	stoppedService: strictObject({
		controlGroup: string().min(1).max(4096),
		pid: number().int().positive(),
		processStartTicks: string().min(1).max(128)
	}).optional(),
	pointerIntent: strictObject({
		fromIdentity: packageActivationIdentitySchema,
		targetSha: string().regex(/^[a-f0-9]{40}$/u),
		temporaryIdentity: packageActivationIdentitySchema
	}).optional(),
	failure: string().max(2048).optional()
});
const activationState = strictObject({
	operation: ImmutableActivationOperationSchema.optional(),
	previous: generation.optional(),
	lastResult: strictObject({
		operationId: uuid(),
		outcome: _enum(["succeeded", "rolled-back"]),
		selectedSha: string().regex(/^[a-f0-9]{40}$/u),
		verifiedAtMs: number().int().nonnegative(),
		gateway: strictObject({
			pid: number().int().positive(),
			bootId: string().min(1).max(256),
			version: string().min(1).max(256),
			buildId: string().min(1).max(256)
		}).optional()
	}).optional()
});
const ImmutableInstallRecordSchema = strictObject({
	revision: number().int().nonnegative(),
	descriptor: ImmutableInstallDescriptorSchema,
	prepared: ImmutablePreparedGenerationSchema.nullable(),
	activation: activationState.optional()
});
//#endregion
export { immutableProtectedFileIdentitySchema as a, immutableConfigFingerprintSchema as i, ImmutableInstallRecordSchema as n, ImmutableRecoveryRuntimeReferenceSchema as o, ImmutablePreparedGenerationSchema as r, ImmutableInstallDescriptorSchema as t };
