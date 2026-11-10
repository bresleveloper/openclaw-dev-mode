import "./sqlite-readonly-subsystem-DxzYbxOQ.mjs";
import { D as getNodeSqliteKysely, T as executeSqliteQuerySync, Z as enableNodeSqliteKyselyStatementCache, i as setSqliteBusyTimeout, l as resolveExistingSqliteFileUri, r as runWithSqliteBusyTimeout, s as openNodeSqliteDatabase } from "./sqlite-readonly-sqlite-busy-timeout-CPLgQzS6.mjs";
import { a as boolean, c as lazy, d as number, g as union, h as string, i as array, l as literal, m as strictObject, n as _enum, p as record, v as uuid } from "./sqlite-readonly-schemas-CYdKD5YK.mjs";
import { It as runSqliteImmediateTransactionSync } from "./sqlite-readonly-location.worker.js";
import path from "node:path";
import { createHash } from "node:crypto";
import fs from "node:fs";
import "node:util";
//#region src/infra/package-update-activation-paths.ts
const PACKAGE_ACTIVATION_PREFIX = ".openclaw.package-activation-";
function resolvePackageActivationAnchor(installKey) {
	const key = createHash("sha256").update(installKey).digest("hex").slice(0, 24);
	return path.join(path.dirname(installKey), `${PACKAGE_ACTIVATION_PREFIX}${key}`);
}
function resolvePackageActivationControl(anchor) {
	return `${anchor}.control`;
}
function resolvePackageActivationJournalPath(anchor) {
	return path.join(resolvePackageActivationControl(anchor), "operation.sqlite");
}
function assertPackageActivationLayout(anchor) {
	if ([
		path.join(anchor, "operation.sqlite"),
		`${anchor}.sqlite`,
		`${anchor}.recovery.mjs`
	].some((file) => fs.lstatSync(file, { throwIfNoEntry: false }))) throw new Error("Legacy package activation artifacts require their original recovery owner; no migration is performed.");
}
//#endregion
//#region src/infra/sqlite-existing-database.ts
/** Keep a SQLite-owned read lock until the existing writer has acquired its lock. */
function withExistingSqliteRollbackDatabase(pathname, options, operation, retained) {
	options.assertIdentity();
	if (fs.statSync(pathname).size === 0) throw new Error("Existing SQLite storage is empty.");
	const existing = retained?.database;
	const reader = existing ?? openNodeSqliteDatabase(pathname, { readOnly: true });
	if (retained && !retained.database) {
		enableNodeSqliteKyselyStatementCache(reader);
		retained.database = reader;
	}
	let writer;
	let snapshotOpen = false;
	let normalLocking = false;
	const releaseReader = () => {
		if (!reader.isOpen) return;
		try {
			if (snapshotOpen && reader.isTransaction) {
				reader.exec("ROLLBACK");
				if (normalLocking) reader.exec("PRAGMA page_count");
			}
			snapshotOpen = false;
		} finally {
			if (!retained) reader.close();
		}
	};
	try {
		if (!existing) setSqliteBusyTimeout(reader, options.busyTimeoutMs);
		reader.exec("PRAGMA locking_mode = EXCLUSIVE");
		reader.exec("BEGIN");
		snapshotOpen = true;
		const mode = reader.prepare("PRAGMA journal_mode").get()?.journal_mode;
		if (![
			"delete",
			"truncate",
			"persist"
		].includes(String(mode))) throw new Error("Existing SQLite storage requires rollback journal mode.");
		reader.exec("PRAGMA locking_mode = NORMAL");
		normalLocking = true;
		if (!existing) options.validate?.(reader);
		if (!options.write) return operation(reader, () => {
			throw new Error("Read-only SQLite observation cannot admit a writer.");
		});
		writer = openNodeSqliteDatabase(resolveExistingSqliteFileUri(pathname));
		setSqliteBusyTimeout(writer, options.busyTimeoutMs);
		const database = writer;
		return operation(database, (write, transactionOptions) => {
			return runWithSqliteBusyTimeout(database, 0, (restore) => runSqliteImmediateTransactionSync(database, () => {
				if (snapshotOpen) releaseReader();
				restore();
				options.assertIdentity();
				return write();
			}, transactionOptions));
		});
	} finally {
		try {
			if (writer?.isOpen) writer.close();
		} finally {
			releaseReader();
		}
	}
}
//#endregion
//#region src/infra/package-update-activation-schema.ts
const absolutePath$3 = string().min(1).max(4096).refine((value) => path.resolve(value) === value);
const packageActivationIdentitySchema = string().regex(/^\d+:\d+$/u);
const fingerprint = strictObject({
	digest: string().regex(/^[a-f0-9]{64}$/u),
	identity: packageActivationIdentitySchema,
	version: string().min(1).max(256)
});
const settlementDetail = string().min(1).max(1048576);
const basename$1 = string().min(1).max(255).refine((value) => value !== "." && value !== ".." && !/[\\/\0]/u.test(value));
const transferName = _enum([
	"anchor",
	"helper",
	"candidate",
	"launchers",
	"previous-launchers"
]);
strictObject({
	layout: literal("external-helper"),
	version: literal(1),
	operationId: uuid(),
	recoveryNodePath: absolutePath$3,
	authority: strictObject({
		databasePath: absolutePath$3,
		databaseIdentity: packageActivationIdentitySchema,
		parentIdentity: packageActivationIdentitySchema,
		installKey: absolutePath$3,
		owner: string().min(1).max(4096)
	}),
	anchorIdentity: packageActivationIdentitySchema,
	journalIdentity: packageActivationIdentitySchema,
	journalParentIdentity: packageActivationIdentitySchema,
	parentIdentity: packageActivationIdentitySchema,
	binDir: absolutePath$3,
	binIdentity: packageActivationIdentitySchema,
	originalStageRoot: absolutePath$3,
	previous: fingerprint,
	candidate: union([fingerprint, fingerprint.omit({ digest: true })]),
	launcherRootIdentity: packageActivationIdentitySchema,
	previousLauncherRootIdentity: packageActivationIdentitySchema.nullable(),
	helperIdentity: packageActivationIdentitySchema,
	preparation: array(strictObject({
		name: transferName,
		source: absolutePath$3,
		sourceParentIdentity: packageActivationIdentitySchema,
		identity: packageActivationIdentitySchema
	})).min(4).max(5),
	helperDigest: string().regex(/^[a-f0-9]{64}$/u),
	launchers: array(strictObject({
		name: basename$1,
		previous: string().max(4096).nullable(),
		candidate: string().max(4096),
		previousIdentity: packageActivationIdentitySchema.nullable(),
		candidateIdentity: packageActivationIdentitySchema
	})).max(64)
});
_enum([
	"preparing",
	"prepared",
	"publishing",
	"publication-complete",
	"rollback-in-progress",
	"rolled-back",
	"aborted",
	"retiring",
	"anchor-retired",
	"superseded"
]);
union([
	strictObject({
		kind: literal("publication-settled-external-change"),
		replacementIdentity: packageActivationIdentitySchema,
		settled: boolean(),
		detail: settlementDetail
	}),
	strictObject({
		kind: _enum([
			"publication-not-started",
			"superseded-by-manual-install",
			"recovery-lease-identity-changed",
			"recovery-lease-missing"
		]),
		replacementIdentity: packageActivationIdentitySchema,
		settled: boolean(),
		detail: settlementDetail.optional()
	}),
	strictObject({
		kind: literal("prepare"),
		completed: array(transferName).max(5),
		moving: transferName.nullable()
	}),
	strictObject({
		kind: _enum(["remove-anchor", "unlink-helper"]),
		identity: packageActivationIdentitySchema,
		selected: _enum(["previous", "candidate"])
	}),
	strictObject({ kind: _enum(["displace", "publish"]) }),
	strictObject({
		kind: literal("copy-previous"),
		identity: packageActivationIdentitySchema
	}),
	strictObject({
		kind: literal("displace-copy"),
		source: fingerprint,
		removing: boolean()
	}),
	strictObject({
		kind: literal("launcher"),
		name: basename$1,
		identity: packageActivationIdentitySchema
	}),
	strictObject({
		kind: literal("retire"),
		selected: _enum(["previous", "candidate"])
	}),
	strictObject({
		kind: literal("remove"),
		name: _enum([
			"previous",
			"candidate",
			"previous.candidate",
			"launchers",
			"previous-launchers"
		]),
		identity: packageActivationIdentitySchema,
		selected: _enum(["previous", "candidate"])
	})
]).nullable();
//#endregion
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
const hash$1 = string().regex(/^[a-f0-9]{64}$/u);
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
	auditBoundary: hash$1.nullable(),
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
		hash: hash$1,
		fingerprint: immutableConfigFingerprintSchema,
		policyFingerprint: hash$1
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
const buildIdentity = strictObject({
	account: string().regex(/^[a-z_][a-z0-9_-]{0,31}$/u).refine((value) => value !== "root"),
	uid: number().int().positive().max(2147483647),
	gid: number().int().positive().max(2147483647),
	toolchainPath: absolutePath,
	resources: strictObject({
		memoryMaxBytes: number().int().positive().safe(),
		tasksMax: number().int().positive().max(65536),
		buildFreeBytes: number().int().positive().safe(),
		runtimeFreeBytes: number().int().positive().safe()
	})
});
const releaseRetention = strictObject({
	version: literal(1),
	mode: literal("inspect"),
	keepVerifiedGenerations: literal(3),
	pins: array(strictObject({
		sha: generation.shape.sha,
		identity: generation.shape.identity
	}))
});
const ImmutableRetainedGenerationSchema = generation.extend({
	publishedRevision: number().int().nonnegative(),
	verifiedRevision: number().int().nonnegative().nullable()
});
const ImmutableInstallDescriptorSchema = strictObject({
	version: union([
		literal(1),
		literal(2),
		literal(3)
	]),
	activationEnabled: literal(true).optional(),
	releaseRetention: releaseRetention.optional(),
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
	source: literal("https://github.com/openclaw/openclaw.git"),
	build: buildIdentity.optional()
}).refine((value) => value.version !== 1 === (value.activationEnabled === true), { message: "Immutable activation requires an explicitly enabled version-2 or version-3 adoption." }).refine((value) => !value.releaseRetention || value.version === 3, { message: "Immutable release retention requires an explicitly adopted version-3 bridge." });
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
	activation: activationState.optional(),
	releases: array(ImmutableRetainedGenerationSchema).optional()
});
//#endregion
//#region src/infra/package-update-activation-immutable.ts
const MAX_RECORD_BYTES = 1048576;
const MAX_RELEASE_ROWS = 4096;
const queries = (db) => getNodeSqliteKysely(db);
function readReleaseInventory(db, record) {
	if (!record.descriptor.releaseRetention) return;
	const rows = executeSqliteQuerySync(db, queries(db).selectFrom("immutable_release_generations").select((eb) => [
		[
			"sha",
			"=",
			40
		],
		[
			"path",
			"<=",
			4096
		],
		[
			"identity",
			"<=",
			256
		],
		[
			"build_digest",
			"=",
			64
		]
	].map(([column, comparison, maxBytes]) => eb.case().when(eb.fn("length", [eb.cast(column, "blob")]), comparison, maxBytes).then(eb.ref(column)).end().as(column))).select(["published_revision", "verified_revision"]).orderBy("published_revision").orderBy("sha").limit(4097)).rows;
	if (rows.length > MAX_RELEASE_ROWS) throw new Error("Immutable release inventory exceeds its admission budget; nothing removed.");
	record.releases = rows.map((row) => {
		const generation = ImmutableRetainedGenerationSchema.parse({
			sha: row.sha,
			path: row.path,
			identity: row.identity,
			buildDigest: row.build_digest,
			publishedRevision: row.published_revision,
			verifiedRevision: row.verified_revision
		});
		if (generation.path !== path.join(record.descriptor.root, "releases", generation.sha) || generation.publishedRevision > record.revision || generation.verifiedRevision !== null && (generation.verifiedRevision < generation.publishedRevision || generation.verifiedRevision > record.revision)) throw new Error("Immutable release inventory has invalid path or revision evidence.");
		return generation;
	});
	if (Buffer.byteLength(JSON.stringify(record)) > MAX_RECORD_BYTES) throw new Error("Immutable installation and release inventory exceed 1 MiB; nothing removed.");
}
function rootOwnedIdentity(file, directory) {
	const stat = fs.lstatSync(file, { bigint: true });
	if (stat.uid !== 0n || stat.ino === 0n || (directory ? !stat.isDirectory() : !stat.isFile() || stat.nlink !== 1n) || (stat.mode & 18n) !== 0n || fs.realpathSync(file) !== file) throw new Error(`Immutable installation control has unsafe ownership or permissions: ${file}`);
	return `${stat.dev}:${stat.ino}`;
}
function validateRecord(record) {
	const parsed = ImmutableInstallRecordSchema.parse(record);
	for (const generation of [
		parsed.descriptor.current,
		parsed.prepared,
		parsed.activation?.previous,
		parsed.activation?.operation?.previous,
		parsed.activation?.operation?.candidate
	]) if (generation && generation.path !== path.join(parsed.descriptor.root, "releases", generation.sha)) throw new Error("Immutable generation is outside its recorded release root.");
	if (Buffer.byteLength(JSON.stringify(parsed)) > MAX_RECORD_BYTES) throw new Error("Immutable installation record exceeds 1 MiB.");
	if (parsed.activation?.operation && (!parsed.descriptor.activationEnabled || parsed.activation.operation.authority.installKey !== parsed.descriptor.root)) throw new Error("Immutable activation does not match its enabled installation owner.");
	const recovery = parsed.activation?.operation?.recovery;
	if (recovery) {
		const control = resolvePackageActivationControl(resolvePackageActivationAnchor(parsed.descriptor.root));
		if (recovery.root !== parsed.descriptor.root || recovery.path !== path.join(control, `recovery-${recovery.sha}`) || recovery.helperPath !== path.join(control, "recovery.mjs")) throw new Error("Immutable recovery artifact is outside its installation control.");
	}
	return parsed;
}
function readRecord(db, root, rootIdentity) {
	const rows = executeSqliteQuerySync(db, queries(db).selectFrom("immutable_installation").selectAll().where((eb) => eb.fn("length", [eb.cast("descriptor_json", "blob")]), "<=", MAX_RECORD_BYTES).where((eb) => eb.fn("length", [eb.cast("prepared_json", "blob")]), "<=", MAX_RECORD_BYTES).limit(2)).rows;
	const row = rows[0];
	if (rows.length !== 1 || !row || row.slot !== 1) throw new Error("Immutable installation control must contain one bounded record.");
	if (row.activation_json && Buffer.byteLength(row.activation_json) > MAX_RECORD_BYTES) throw new Error("Immutable activation record exceeds 1 MiB.");
	const record = validateRecord({
		revision: row.revision,
		descriptor: JSON.parse(row.descriptor_json),
		prepared: JSON.parse(row.prepared_json),
		...row.activation_json && row.activation_json !== "null" ? { activation: JSON.parse(row.activation_json) } : {}
	});
	if (record.descriptor.root !== root || record.descriptor.rootIdentity !== rootIdentity) throw new Error("Immutable installation control does not match the installation.");
	readReleaseInventory(db, record);
	return record;
}
function captureImmutableControl(root) {
	const anchor = resolvePackageActivationAnchor(root);
	assertPackageActivationLayout(anchor);
	const control = resolvePackageActivationControl(anchor);
	const journal = resolvePackageActivationJournalPath(anchor);
	const rootIdentity = rootOwnedIdentity(root, true);
	const identities = [
		root,
		path.dirname(root),
		control,
		journal
	].map((file, index) => rootOwnedIdentity(file, index !== 3));
	const assertIdentity = () => {
		if ([
			root,
			path.dirname(root),
			control,
			journal
		].some((file, index) => rootOwnedIdentity(file, index !== 3) !== identities[index])) throw new Error("Immutable installation control identity changed.");
	};
	const validate = (db) => {
		if (db.prepare("SELECT name FROM sqlite_schema WHERE type = 'table' AND name = 'package_activation'").get()) throw new Error("An existing package activation journal remains with its recovery owner.");
	};
	const read = (db) => readRecord(db, root, rootIdentity);
	return {
		control,
		journal,
		assertIdentity,
		assertFileSafe: (file) => {
			rootOwnedIdentity(file, false);
		},
		validate,
		read
	};
}
function withImmutableControl(root, write, operation) {
	const { journal, assertIdentity, validate, read } = captureImmutableControl(root);
	return withExistingSqliteRollbackDatabase(journal, {
		write,
		busyTimeoutMs: 0,
		assertIdentity,
		validate
	}, (db, transact) => {
		if (write) db.exec("PRAGMA synchronous = EXTRA");
		const fencedTransaction = (work, options) => transact(work, {
			...options,
			withCommit(commit) {
				assertIdentity();
				if (options?.withCommit) options.withCommit(commit);
				else commit();
			}
		});
		return operation(db, fencedTransaction, () => read(db));
	});
}
const immutableInstallReadOperations = { "immutableInstall.read": (input, context) => {
	if (resolvePackageActivationJournalPath(resolvePackageActivationAnchor(input.root)) !== context.path) throw new Error("Immutable installation read names another control database.");
	return withImmutableControl(input.root, false, (_db, _transact, read) => read());
} };
//#endregion
export { immutableInstallReadOperations };
