import { Et as _enum, Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, lr as uuid, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { i as getNodeSqliteKysely, n as executeSqliteQuerySync, r as executeSqliteQueryTakeFirstSync } from "./kysely-sync-Bn6Qrpbz.mjs";
import { r as tableExists } from "./openclaw-state-db-schema-helpers-Cck9Qf-B.mjs";
import { n as assertSqliteIntegrity, t as SqliteRepairableForeignKeyError } from "./sqlite-integrity-B4lhf3Iz.mjs";
import { t as assertSqliteSchemaContains } from "./sqlite-schema-contract-BFcZzasN.mjs";
import { tt as OPENCLAW_STATE_SCHEMA_SQL } from "./openclaw-state-db-read-connection-Beg0AZE7.mjs";
import { l as isOpenClawStateWriteContentionError } from "./openclaw-state-ownership-OLtsPpqu.mjs";
import { c as withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync, s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly } from "./openclaw-state-db-readonly-CbuLJI4_.mjs";
import { c as runOpenClawStateWriteTransaction } from "./openclaw-state-db-BFK9cMiV.mjs";
import { t as UPDATE_RUN_PHASES } from "./update-run-vocabulary-BYZF4sMi.mjs";
import { i as persistRun, l as recordUpdateRunVerificationRecord, n as mutateRun, o as updateRunLedgerSchema, r as mutateRunInTransaction, s as upsertStep, u as encodeRun } from "./update-run-write-cd5VZ7fL.mjs";
import { i as isUnacknowledgedPackageOwnerRefusal, n as isAbandonedUpdateRun, t as finishUpdateRunRecord } from "./update-run-record-B5xSBZMw.mjs";
import { t as runExistingOpenClawStateWriteTransaction } from "./openclaw-state-db-existing-write-UfK-2Yan.mjs";
import { a as recordedUpdateRunDrivers, c as readUpdateRunDriver, i as isStaleIdentitylessUpdateRun, l as sameUpdateRunDriver, s as inspectUpdateRunDriver, t as inspectUpdateRepairDriverAdmission } from "./update-run-activity-C0Hu53Kb.mjs";
import { a as readUpdateRunRecord, c as UPDATE_RECOVERY_KEY_PREFIX, n as hasStoredUpdateRecovery, s as UPDATE_RECOVERY_KEY_END, t as decodeRun } from "./update-run-read.kernel-Blv-D7Xz.mjs";
import { l as readUpdateRunReconciliationCandidates, o as inspectUpdateRunReconciliation } from "./update-run-reader-B17V1KuC.mjs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
import { randomUUID } from "node:crypto";
//#region src/infra/update-run-admission.ts
var UpdateRunAdmissionBusyError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.reason = "update-ledger-busy";
	}
};
function runUpdateRunAdmission(operation, options, contract) {
	if (options.database) throw new Error("Update run admission requires its own writable connection");
	const inspection = withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db, path }) => {
		try {
			assertSqliteIntegrity(db, path);
			return { repairable: void 0 };
		} catch (error) {
			if (!(error instanceof SqliteRepairableForeignKeyError)) throw error;
			return { repairable: error };
		}
	}, options);
	if (inspection) {
		if (inspection.repairable && !contract.recoverTaskDeliveryOrphans) throw inspection.repairable;
		try {
			return runExistingOpenClawStateWriteTransaction(({ db, recoveryChanges }) => operation(db, recoveryChanges), options, {
				schemaSql: contract.schemaSql,
				operationLabel: "update.run",
				busyTimeoutMs: contract.busyTimeoutMs,
				initializeAdditiveSchema: true,
				...inspection.repairable ? { recoverTaskDeliveryOrphans: true } : {}
			});
		} catch (error) {
			if (isOpenClawStateWriteContentionError(error)) throw new UpdateRunAdmissionBusyError("Update history is busy. Admission was deferred; previous history is unchanged. Retry `openclaw update` after the current database writer finishes.", { cause: error });
			if (!inspection.repairable) throw error;
			throw new Error(`${inspection.repairable.message} Update admission could not complete recovery: ${formatErrorMessage(error)}`, { cause: error });
		}
	}
	return runOpenClawStateWriteTransaction(({ db }) => {
		db.exec(contract.schemaSql);
		return operation(db, []);
	}, options, { operationLabel: "update.run" });
}
//#endregion
//#region src/infra/update-run-recovery-native-schema.ts
const text$1 = string().min(1).max(4096);
const absolutePath$1 = text$1.refine((value) => path.isAbsolute(value));
const revision = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const binding = {
	runId: uuid(),
	stateDir: absolutePath$1,
	configPath: absolutePath$1,
	profile: string().regex(/^[a-z0-9][a-z0-9_-]{0,63}$/iu).nullable()
};
/** Canonical daemon-selected identity; never a command, credential or authority. */
const RecoveryNativeIdentitySchema = discriminatedUnion("platform", [
	strictObject({
		...binding,
		platform: literal("win32"),
		taskName: text$1
	}),
	strictObject({
		...binding,
		platform: literal("darwin"),
		domain: text$1,
		label: text$1
	}),
	discriminatedUnion("scope", [strictObject({
		...binding,
		platform: literal("linux"),
		scope: literal("user"),
		unitName: text$1,
		uid: number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
	}), strictObject({
		...binding,
		platform: literal("linux"),
		scope: literal("system"),
		unitName: text$1
	})])
]);
const RecoveryNativeFactsSchema = strictObject({
	exists: boolean(),
	enabled: boolean().nullable(),
	loaded: boolean(),
	stopped: boolean()
}).refine((facts) => facts.exists ? facts.enabled !== null && (facts.loaded || facts.stopped) : facts.enabled === null && !facts.loaded && facts.stopped);
const RecoveryNativeActionSchema = _enum([
	"suppress",
	"stop",
	"restore",
	"enable-for-start"
]);
const effect = strictObject({
	effectId: uuid(),
	action: RecoveryNativeActionSchema,
	before: RecoveryNativeFactsSchema,
	after: RecoveryNativeFactsSchema,
	state: _enum([
		"intent",
		"observed",
		"not-applied",
		"reconciled"
	]),
	reconciledStop: strictObject({
		facts: RecoveryNativeFactsSchema,
		revision
	}).optional(),
	intentRevision: revision,
	observedRevision: revision.optional()
});
const RecoveryNativeManagerSchema = strictObject({
	identity: RecoveryNativeIdentitySchema,
	original: RecoveryNativeFactsSchema,
	boundAtRevision: revision,
	effects: array(effect).max(128)
}).superRefine((manager, ctx) => {
	let last = manager.boundAtRevision;
	const ids = /* @__PURE__ */ new Set();
	let previous = manager.original;
	for (const [index, entry] of manager.effects.entries()) {
		if (!isDeepStrictEqual(entry.before, previous) || ids.has(entry.effectId) || entry.state === "not-applied" && isDeepStrictEqual(entry.before, entry.after) || entry.intentRevision <= last || (entry.state === "intent" ? entry.observedRevision !== void 0 || index !== manager.effects.length - 1 : entry.state === "reconciled" ? entry.observedRevision !== void 0 || !entry.reconciledStop : entry.observedRevision === void 0 || entry.observedRevision <= entry.intentRevision) || entry.reconciledStop !== void 0 && entry.state !== "reconciled" && entry.state !== "observed" || entry.reconciledStop !== void 0 && entry.reconciledStop.revision <= (entry.observedRevision ?? entry.intentRevision) || entry.reconciledStop !== void 0 && (manager.identity.platform !== "linux" || entry.action !== "suppress" || !entry.before.exists || !entry.before.loaded || entry.before.enabled !== true || entry.before.stopped || !isDeepStrictEqual(entry.after, {
			...entry.before,
			enabled: false
		}) || !isDeepStrictEqual(entry.reconciledStop.facts, {
			...entry.after,
			stopped: true
		})) || !validNativeTransition(entry.action, entry.before, entry.after, manager.original, manager.identity.platform)) ctx.addIssue({
			code: "custom",
			message: "Invalid native manager effect history"
		});
		ids.add(entry.effectId);
		previous = entry.reconciledStop?.facts ?? (entry.state === "not-applied" ? entry.before : entry.after);
		last = entry.reconciledStop?.revision ?? entry.observedRevision ?? entry.intentRevision;
	}
});
/** Native stop may unload or remain loaded, but cannot change enable policy or load a job. */
function validNativeTransition(action, before, after, original, platform) {
	if (action === "enable-for-start") return (platform === "win32" || platform === "darwin") && original.exists && original.loaded && !original.stopped && original.enabled === false && before.exists && before.stopped && before.enabled === false && isDeepStrictEqual(after, {
		...before,
		enabled: true
	});
	if (action === "restore") {
		if (!before.exists || !original.exists) return isDeepStrictEqual(after, original);
		return isDeepStrictEqual(after, {
			...before,
			enabled: original.enabled
		}) || isDeepStrictEqual(after, {
			...before,
			loaded: original.loaded,
			stopped: original.stopped
		});
	}
	if (!before.exists || !after.exists) return isDeepStrictEqual(before, after);
	return action === "suppress" ? after.enabled === false && before.loaded === after.loaded && before.stopped === after.stopped : after.stopped && after.enabled === before.enabled && (!after.loaded || before.loaded);
}
/** A rejected, settled native dispatch preserves its target as history but its
* fresh before observation is the current fact. It is never a boot receipt. */
function currentUpdateRecoveryNativeFacts(manager) {
	const last = manager.effects.at(-1);
	return last?.reconciledStop?.facts ?? (last?.state === "not-applied" ? last.before : last?.after ?? manager.original);
}
/** Only a captured, enabled running service stopped before package activation
* may use preparation recovery. Suppression, borrowed enablement, unknown
* dispatches and unrelated native histories require their ordinary owners. */
function isRecoverablePreparationNative(manager, restored = false) {
	const { original, effects } = manager;
	if (effects.length === 0) return true;
	const [stop, restore] = effects;
	return original.exists && original.enabled === true && original.loaded && !original.stopped && effects.length <= 2 && stop?.action === "stop" && stop.state !== "not-applied" && isDeepStrictEqual(stop.before, original) && isDeepStrictEqual(stop.after, {
		...original,
		stopped: true,
		loaded: manager.identity.platform !== "darwin"
	}) && (restore ? stop.state === "observed" && restore.action === "restore" && restore.state !== "not-applied" && isDeepStrictEqual(restore.before, stop.after) && isDeepStrictEqual(restore.after, original) && (!restored || restore.state === "observed") : !restored);
}
//#endregion
//#region src/infra/package-update-recovery-contract.ts
const text = string().min(1).max(32768);
const absolute = text.refine((value) => path.isAbsolute(value) && path.resolve(value) === value);
const launcherName = text.refine((value) => value !== "." && value !== ".." && !/[\\/]/u.test(value));
const fingerprint = strictObject({
	digest: string().regex(/^[a-f0-9]{64}$/u),
	identity: string().regex(/^\d+:\d+$/u),
	version: text
});
const selection = strictObject({
	pairId: uuid(),
	ownerRevision: number().int().nonnegative().max(Number.MAX_SAFE_INTEGER)
});
const retention = discriminatedUnion("state", [
	selection.extend({ state: literal("selected") }),
	strictObject({
		state: literal("unselected"),
		ownerRevision: selection.shape.ownerRevision
	}),
	selection.extend({
		state: literal("superseded"),
		replacement: strictObject({
			pairId: uuid(),
			transactionId: uuid(),
			live: fingerprint,
			retainedRoot: absolute,
			retained: fingerprint,
			launchers: array(strictObject({
				name: launcherName,
				fingerprint: text
			})).max(64)
		})
	})
]);
/** Operational data for Recovery's store, not a sidecar or deletion authority. */
const PackageTransactionDescriptorSchema = strictObject({
	version: literal(1),
	transactionId: uuid(),
	packageName: string().regex(/^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/iu).max(214),
	liveRoot: absolute,
	stageRoot: absolute,
	backupRoot: absolute,
	binDir: absolute,
	shimBackupRoot: absolute.nullable(),
	shimBackupIdentity: text.nullable(),
	previous: fingerprint.nullable(),
	candidate: fingerprint,
	launchers: array(strictObject({
		name: launcherName,
		previous: text.nullable(),
		candidate: text
	})).max(64),
	interruptedLaunchers: array(launcherName).max(64),
	retention: retention.nullable()
}).superRefine((value, ctx) => {
	const parent = path.resolve(value.liveRoot, ...value.packageName.split("/").map(() => ".."));
	if (value.liveRoot === path.parse(value.liveRoot).root || value.stageRoot === path.parse(value.stageRoot).root || value.binDir === path.parse(value.binDir).root || path.join(parent, value.packageName) !== value.liveRoot || value.packageName === "." || value.packageName === ".." || value.shimBackupRoot === null !== (value.shimBackupIdentity === null) || path.dirname(value.backupRoot) !== parent || !path.basename(value.backupRoot).startsWith(".openclaw.package-backup-") || value.stageRoot === value.liveRoot || value.stageRoot.startsWith(`${value.liveRoot}${path.sep}`) || value.liveRoot.startsWith(`${value.stageRoot}${path.sep}`) || value.shimBackupRoot !== null && (path.dirname(value.shimBackupRoot) !== parent || !path.basename(value.shimBackupRoot).startsWith(".openclaw.shim-backup-")) || value.launchers.some((entry) => entry.previous !== null && !value.shimBackupRoot) || value.interruptedLaunchers.some((name) => !value.launchers.some((entry) => entry.name === name)) || new Set(value.launchers.map((entry) => entry.name)).size !== value.launchers.length) ctx.addIssue({
		code: "custom",
		message: "Invalid package recovery paths or launcher inventory"
	});
});
const PackageRecoveryEffectSchema = strictObject({
	effectId: uuid(),
	action: _enum([
		"activate",
		"restore",
		"retire"
	]),
	descriptor: PackageTransactionDescriptorSchema
});
//#endregion
//#region src/infra/update-run-recovery-package-schema.ts
/** Private storage validation of the producer's typed facts, not evidence of live authority. */
const RecoveryPackageObservationSchema = strictObject({
	status: literal("verified"),
	descriptor: PackageTransactionDescriptorSchema,
	observation: strictObject({
		previous: _enum([
			"live",
			"retained",
			"absent"
		]),
		candidate: _enum([
			"live",
			"staged",
			"displaced",
			"absent"
		]),
		launchers: _enum([
			"previous",
			"candidate",
			"both",
			"mixed",
			"interrupted"
		]),
		successorLive: boolean()
	}),
	observedIdentity: string().regex(/^[a-f0-9]{64}$/u)
});
const RecoveryPackageStateSchema = strictObject({
	descriptor: PackageTransactionDescriptorSchema,
	observed: RecoveryPackageObservationSchema
});
const RecoveryPackageEffectSchema = strictObject({
	intent: PackageRecoveryEffectSchema,
	observed: RecoveryPackageObservationSchema.optional(),
	outcome: _enum(["completed", "interrupted"]).optional()
});
//#endregion
//#region src/infra/update-run-recovery-schema.ts
const exactText = string().min(1).max(32768);
const absolutePath = exactText.refine((value) => path.isAbsolute(value));
const counter = number().int().nonnegative().max(Number.MAX_SAFE_INTEGER);
const runtime = strictObject({
	root: absolutePath,
	nodePath: absolutePath,
	version: exactText,
	buildId: exactText.nullable()
});
/** Observed readiness facts only. The producer must preserve its original recovery
* claim/revision across awaited health and HTTP probes. No serialized authority.
* Deliberately no legacy transform: transcript receipts cannot establish readiness,
* and rewriting them during read would also invalidate publication commitments.
*/
const UpdateRecoveryReadinessReceiptSchema = strictObject({
	kind: literal("readiness", { error: "Legacy update verification is not readiness evidence; explicit reconciliation is required." }),
	runId: uuid(),
	transactionId: uuid(),
	claimId: uuid(),
	revision: counter,
	effectId: uuid(),
	runtime: _enum(["candidate", "previous"]),
	gateway: strictObject({
		bootId: string().min(1).max(96),
		version: string().min(1).max(256),
		buildId: string().min(1).max(256).nullable()
	}),
	checks: strictObject({
		serviceRunning: literal(true),
		pluginsReady: literal(true),
		channelsReady: literal(true),
		settled: literal(true),
		readyz: literal(true)
	}),
	verifiedAtMs: counter
});
const UpdateRecoveryEffectSchema = strictObject({
	effectId: uuid(),
	kind: _enum([
		"package-activation",
		"runtime-mutation",
		"checkpoint-restore",
		"package-restore",
		"service-restart",
		"retirement"
	]),
	resourceId: exactText,
	runtime: _enum(["candidate", "previous"]),
	state: _enum([
		"intent",
		"observed",
		"cancelled"
	]),
	cancelledByNativeEffectId: uuid().optional(),
	package: RecoveryPackageEffectSchema.optional(),
	observedIdentity: exactText.nullable()
}).refine((effect) => effect.state === "observed" === (effect.observedIdentity !== null) && (effect.state === "cancelled" ? effect.kind === "service-restart" && !effect.package && effect.cancelledByNativeEffectId !== void 0 : effect.cancelledByNativeEffectId === void 0));
const UpdateRecoveryRestoreProgressSchema = strictObject({
	restoreId: uuid(),
	checkpointId: uuid(),
	planPath: absolutePath,
	planSha256: string().regex(/^[a-f0-9]{64}$/u).nullable(),
	resourceCursor: counter,
	phase: _enum([
		"preparing",
		"intent",
		"observed"
	])
}).refine((progress) => progress.phase === "preparing" || progress.planSha256 !== null);
/** Exact storage projection of the checkpoint owner's ref and manifest binding.
* Retained locators are inspection data only; these facts grant no restoration authority.
*/
const checkpointRef = strictObject({
	checkpointId: uuid(),
	manifestPath: absolutePath,
	manifestSha256: string().regex(/^[a-f0-9]{64}$/u)
});
const checkpoint = strictObject({
	ref: checkpointRef,
	preimageRef: checkpointRef.optional(),
	binding: strictObject({
		runId: uuid(),
		stateDir: absolutePath,
		configPath: absolutePath,
		fromRuntime: runtime.omit({ buildId: true })
	})
});
const afterImage = strictObject({
	checkpointRef,
	afterUpdate: checkpoint,
	effectIds: array(uuid()).min(1).max(4096),
	boundAtRevision: counter
});
const legacyIdentifier = string().min(1).max(256);
const legacyAnchor = strictObject({
	entryId: legacyIdentifier,
	seq: counter
});
const legacyServingReceipt = strictObject({
	runId: uuid(),
	gateway: UpdateRecoveryReadinessReceiptSchema.shape.gateway,
	agentId: legacyIdentifier,
	sessionKey: string().min(1).max(512),
	sessionId: legacyIdentifier,
	agentRunId: uuid(),
	transcript: strictObject({
		generation: legacyIdentifier,
		maxSeq: counter,
		user: legacyAnchor,
		assistant: legacyAnchor
	}),
	verifiedAtMs: counter
}).refine((receipt) => receipt.transcript.user.seq < receipt.transcript.assistant.seq && receipt.transcript.assistant.seq <= receipt.transcript.maxSeq, { message: "Invalid legacy serving transcript sequence" });
const inspectionReceipt = union([UpdateRecoveryReadinessReceiptSchema, legacyServingReceipt]);
/** Private operational state, never passed through the redacted history codec. */
const recoveryInspectionRecordSchema = strictObject({
	runId: uuid(),
	transactionId: uuid(),
	revision: counter,
	claimId: uuid(),
	claimKind: _enum([
		"initial",
		"recovery",
		"handoff"
	]),
	handoff: strictObject({
		handoffId: uuid(),
		state: _enum(["prepared", "accepted"])
	}).nullable(),
	source: strictObject({
		stateDir: absolutePath,
		configPath: absolutePath,
		profile: exactText.nullable().optional()
	}).optional(),
	from: runtime,
	to: runtime,
	createdAtMs: counter,
	updatedAtMs: counter,
	effects: array(UpdateRecoveryEffectSchema).max(4096),
	preimages: checkpoint.omit({ preimageRef: true }).extend({ boundAtRevision: counter }).optional(),
	nativeManager: RecoveryNativeManagerSchema.optional(),
	checkpoint: checkpoint.optional(),
	afterImages: array(afterImage).max(4096).optional(),
	restore: UpdateRecoveryRestoreProgressSchema.nullable().default(null),
	publication: strictObject({
		revision: counter,
		sha256: string().regex(/^[a-f0-9]{64}$/u)
	}).optional(),
	verification: strictObject({
		runtime: _enum(["candidate", "previous"]),
		effectId: uuid(),
		receipt: inspectionReceipt
	}).nullable(),
	package: RecoveryPackageStateSchema.optional(),
	terminal: strictObject({
		status: _enum(["succeeded", "rolled-back"]),
		committedAtMs: counter,
		commitRevision: counter,
		receipt: inspectionReceipt,
		pairId: uuid().nullable()
	}).optional(),
	preparationAborted: strictObject({
		reason: literal("interrupted-preparation"),
		committedAtMs: counter,
		commitRevision: counter,
		observedIdentity: string().regex(/^[a-f0-9]{64}$/u)
	}).optional(),
	retainedPair: strictObject({
		pairId: uuid(),
		state: _enum(["selected", "superseded"]),
		replacementRunId: uuid().optional()
	}).optional(),
	primaryFailure: strictObject({
		code: exactText,
		effectId: uuid().nullable()
	}).nullable()
}).superRefine((record, ctx) => {
	const aborted = record.preparationAborted;
	if (aborted && (!record.source || !record.preimages || !record.nativeManager || !record.package || record.claimKind !== "recovery" || record.effects.length !== 0 || !isRecoverablePreparationNative(record.nativeManager, true) || record.handoff || record.checkpoint || record.afterImages !== void 0 || record.restore || record.publication || record.verification || record.terminal || record.retainedPair || record.primaryFailure?.code !== aborted.reason || record.primaryFailure.effectId !== null || aborted.commitRevision !== record.revision || aborted.committedAtMs > record.updatedAtMs || aborted.observedIdentity !== record.package.observed.observedIdentity || record.package.descriptor.retention !== null || record.package.descriptor.interruptedLaunchers.length !== 0 || record.package.observed.observation.previous !== "live" || record.package.observed.observation.candidate !== "staged" || !["previous", "both"].includes(record.package.observed.observation.launchers) || record.package.observed.observation.successorLive)) ctx.addIssue({
		code: "custom",
		message: "Preparation settlement cannot carry effects or serving authority"
	});
	const verification = record.verification;
	if (verification) {
		const receipt = verification.receipt;
		const identity = verification.runtime === "candidate" ? record.to : record.from;
		const restart = record.effects.find((effect) => effect.effectId === verification.effectId);
		if (receipt.runId !== record.runId || "kind" in receipt && (receipt.transactionId !== record.transactionId || receipt.claimId !== record.claimId || receipt.revision >= record.revision || receipt.runtime !== verification.runtime || receipt.effectId !== verification.effectId) || receipt.gateway.version !== identity.version || receipt.gateway.buildId !== identity.buildId || restart?.kind !== "service-restart" || restart.state !== "observed" || restart.runtime !== verification.runtime || restart.observedIdentity !== receipt.gateway.bootId || !record.terminal && restart !== record.effects.at(-1)) ctx.addIssue({
			code: "custom",
			message: "Verification evidence does not match recovery and restart"
		});
	}
	if (verification && record.terminal && !isDeepStrictEqual(verification.receipt, record.terminal.receipt)) ctx.addIssue({
		code: "custom",
		message: "Terminal and verification receipts differ"
	});
	const native = record.nativeManager;
	const nativeFinal = native ? currentUpdateRecoveryNativeFacts(native) : void 0;
	if (native && (!record.preimages || !record.source || native.identity.runId !== record.runId || native.identity.stateDir !== record.source.stateDir || native.identity.configPath !== record.source.configPath || native.identity.profile !== record.source.profile || native.boundAtRevision > record.revision || !record.primaryFailure && native.effects.some((entry) => entry.state === "not-applied" || entry.state === "reconciled") || native.effects.some((entry, index) => {
		if (!entry.reconciledStop) return false;
		const start = native.effects[index - 1];
		const restart = record.effects.find((effect) => effect.effectId === start?.effectId);
		return !record.primaryFailure || !record.checkpoint || !start || start.action !== "restore" || start.state !== "observed" || !start.before.stopped || start.after.stopped || restart?.kind !== "service-restart" || restart.runtime !== "candidate";
	}) || native.effects.some((entry) => (entry.reconciledStop?.revision ?? entry.observedRevision ?? entry.intentRevision) > record.revision) || native.effects.at(-1)?.state === "intent" && (record.terminal || record.verification) || !nativeFinal?.stopped && record.effects.some((effect) => effect.state === "intent" && (effect.kind === "package-activation" || effect.kind === "runtime-mutation" || effect.kind === "package-restore" || effect.kind === "checkpoint-restore")) || record.terminal && nativeFinal && (nativeFinal.exists !== native.original.exists || nativeFinal.enabled !== native.original.enabled || nativeFinal.loaded !== native.original.loaded || nativeFinal.stopped !== native.original.stopped))) ctx.addIssue({
		code: "custom",
		message: "Native manager evidence must match admitted source and revision"
	});
	const early = record.preimages;
	if (early && (early.boundAtRevision > record.revision || !record.source || early.binding.runId !== record.runId || early.binding.stateDir !== record.source.stateDir || early.binding.configPath !== record.source.configPath || early.binding.fromRuntime.root !== record.from.root || early.binding.fromRuntime.nodePath !== record.from.nodePath || early.binding.fromRuntime.version !== record.from.version) || record.checkpoint && (early && (!isDeepStrictEqual(record.checkpoint.preimageRef, early.ref) || !isDeepStrictEqual(record.checkpoint.binding, early.binding) || record.checkpoint.ref.checkpointId === early.ref.checkpointId || record.checkpoint.ref.manifestPath === early.ref.manifestPath || record.checkpoint.ref.manifestSha256 === early.ref.manifestSha256) || !early && record.checkpoint.preimageRef)) ctx.addIssue({
		code: "custom",
		message: "Early file preimages must remain distinct from the full checkpoint"
	});
	if (record.package && record.package.descriptor.transactionId !== record.transactionId) ctx.addIssue({
		code: "custom",
		message: "Package transaction differs from recovery"
	});
	for (const effect of record.effects) {
		if (effect.state === "cancelled") {
			const startIndex = native?.effects.findIndex((entry) => entry.effectId === effect.effectId) ?? -1;
			const stopIndex = native?.effects.findIndex((entry) => entry.effectId === effect.cancelledByNativeEffectId) ?? -1;
			const start = native?.effects[startIndex];
			const stopped = native?.effects[stopIndex];
			const cancelledBeforeStart = stopIndex === startIndex && stopped?.state === "not-applied" && stopped.before.stopped;
			const stoppedAfterStart = stopIndex > startIndex && stopped?.action === "stop" && stopped.state === "observed" && stopped.after.stopped;
			if (!record.primaryFailure || !start || start.action !== "restore" || !start.before.stopped || start.after.stopped || !(cancelledBeforeStart || stoppedAfterStart)) ctx.addIssue({
				code: "custom",
				message: "Cancelled restart requires resolved native quiescence"
			});
		}
		if (effect.package && (effect.package.intent.effectId !== effect.effectId || effect.package.intent.descriptor.transactionId !== record.transactionId || effect.state === "observed" !== Boolean(effect.package.observed && effect.package.outcome) || effect.package.observed && effect.observedIdentity !== effect.package.observed.observedIdentity)) ctx.addIssue({
			code: "custom",
			message: "Invalid typed package effect"
		});
	}
	if (record.terminal && (record.terminal.commitRevision > record.revision || record.terminal.receipt.runId !== record.runId || record.terminal.pairId !== (record.retainedPair?.pairId ?? null))) ctx.addIssue({
		code: "custom",
		message: "Terminal outcome and selected pair differ"
	});
	if (record.terminal && "kind" in record.terminal.receipt) {
		const receipt = record.terminal.receipt;
		const role = record.terminal.status === "succeeded" ? "candidate" : "previous";
		const identity = role === "candidate" ? record.to : record.from;
		const restart = record.effects.find((effect) => effect.effectId === receipt.effectId);
		if (receipt.transactionId !== record.transactionId || receipt.runtime !== role || receipt.revision + 2 !== record.terminal.commitRevision || receipt.gateway.version !== identity.version || receipt.gateway.buildId !== identity.buildId || restart?.kind !== "service-restart" || restart.state !== "observed" || restart.runtime !== role || restart.observedIdentity !== receipt.gateway.bootId || verification && !isDeepStrictEqual(verification.receipt, receipt)) ctx.addIssue({
			code: "custom",
			message: "Terminal readiness does not match its recorded restart"
		});
	}
	if (record.terminal && !("kind" in record.terminal.receipt)) {
		const receipt = record.terminal.receipt;
		const role = record.terminal.status === "succeeded" ? "candidate" : "previous";
		const identity = role === "candidate" ? record.to : record.from;
		const restart = record.effects.findLast((effect) => effect.kind === "service-restart");
		if (verification && (verification.runtime !== role || verification.effectId !== restart?.effectId) || receipt.gateway.version !== identity.version || receipt.gateway.buildId !== identity.buildId || restart?.state !== "observed" || restart.runtime !== role || restart.observedIdentity !== receipt.gateway.bootId) ctx.addIssue({
			code: "custom",
			message: "Legacy terminal evidence differs from its recorded restart"
		});
	}
	const pair = record.retainedPair;
	const retention = record.package?.descriptor.retention;
	if (pair && (!record.terminal || record.terminal.status !== "succeeded" || !retention || retention.state === "unselected" || retention.state !== pair.state || retention.pairId !== pair.pairId || pair.state === "superseded" !== Boolean(pair.replacementRunId)) || record.terminal?.status === "succeeded" && !pair || record.terminal?.status === "rolled-back" && (pair || retention?.state !== "unselected")) ctx.addIssue({
		code: "custom",
		message: "Recovery selection does not match committed package roles"
	});
	let cursor = 0;
	let revision = -1;
	const refs = record.checkpoint ? [record.checkpoint.ref] : [];
	for (const [index, image] of (record.afterImages ?? []).entries()) {
		const effects = record.effects.slice(cursor, cursor + image.effectIds.length);
		if (!record.checkpoint || !isDeepStrictEqual(image.checkpointRef, record.checkpoint.ref) || !isDeepStrictEqual(image.afterUpdate.binding, record.checkpoint.binding) || image.boundAtRevision <= revision || image.boundAtRevision > record.revision || !isDeepStrictEqual(image.effectIds, effects.map((effect) => effect.effectId)) || effects.some((effect) => effect.state !== "observed" || effect.package?.outcome === "interrupted" || effect.runtime !== "candidate" || effect.kind === "checkpoint-restore" || effect.kind === "package-restore" || effect.kind === "retirement") || refs.some((ref) => ref.checkpointId === image.afterUpdate.ref.checkpointId || ref.manifestPath === image.afterUpdate.ref.manifestPath || ref.manifestSha256 === image.afterUpdate.ref.manifestSha256)) ctx.addIssue({
			code: "custom",
			path: ["afterImages", index],
			message: "After-image must bind a distinct checkpoint to the exact completed mutation interval"
		});
		cursor += image.effectIds.length;
		revision = image.boundAtRevision;
		refs.push(image.afterUpdate.ref);
	}
});
/** Execution/mutation decoding remains readiness-only. The inspection shape is
* intentionally wider, so an inspected legacy row is not a mutation input. */
const UpdateRecoveryRecordSchema = recoveryInspectionRecordSchema.safeExtend({
	verification: recoveryInspectionRecordSchema.shape.verification.unwrap().extend({ receipt: UpdateRecoveryReadinessReceiptSchema }).nullable(),
	terminal: recoveryInspectionRecordSchema.shape.terminal.unwrap().extend({ receipt: UpdateRecoveryReadinessReceiptSchema }).optional()
});
/** Read-only historical inspection. Unknown/corrupt rows fail, never disappear.
* No migration, receipt upgrade, claim acquisition, or mutation eligibility. */
function inspectUpdateRecovery(raw, runId) {
	if (Buffer.byteLength(raw) > MAX_RECOVERY_BYTES) throw new Error("Update recovery record exceeds its storage limit");
	const record = recoveryInspectionRecordSchema.parse(JSON.parse(raw));
	if (record.runId !== runId) throw new Error("Update recovery record does not match its history run");
	return {
		format: [record.verification?.receipt, record.terminal?.receipt].some((receipt) => receipt && !("kind" in receipt)) ? "legacy-serving" : "current",
		raw,
		record
	};
}
var UpdateRecoveryRequiredError = class extends Error {
	constructor(record) {
		super(`Update ${record.runId} has unfinished recovery; reconcile it before starting another update.`);
		this.record = record;
		this.name = "UpdateRecoveryRequiredError";
	}
};
const MAX_RECOVERY_BYTES = 1048576;
function decodeUpdateRecovery(raw, runId) {
	if (Buffer.byteLength(raw) > MAX_RECOVERY_BYTES) throw new Error("Update recovery record exceeds its storage limit");
	const record = UpdateRecoveryRecordSchema.parse(JSON.parse(raw));
	if (record.runId !== runId) throw new Error("Update recovery record does not match its history run");
	return record;
}
/** Only decoded records may be tested: an aborted preparation is historical,
* and can never confer restart, cleanup, or future claim authority. */
function isUpdateRecoveryPending(record) {
	return !record.preparationAborted && (!record.terminal || record.effects.some((effect) => effect.state === "intent") || record.retainedPair?.state === "superseded" && !record.effects.some((effect) => effect.kind === "retirement" && effect.state === "observed" && effect.package?.outcome === "completed"));
}
//#endregion
//#region src/infra/update-run-recovery-store.ts
function readRecoveryRows(db) {
	if (!tableExists(db, "config_machine_state")) return [];
	return executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("config_machine_state").select(["state_key", "value_json"]).where("state_key", ">=", UPDATE_RECOVERY_KEY_PREFIX).where("state_key", "<", UPDATE_RECOVERY_KEY_END).orderBy("state_key", "asc")).rows;
}
function readRecoveries(db) {
	return readRecoveryRows(db).map((row) => decodeUpdateRecovery(row.value_json, row.state_key.slice(UPDATE_RECOVERY_KEY_PREFIX.length)));
}
function inspectRecoveries(db) {
	return readRecoveryRows(db).map((row) => inspectUpdateRecovery(row.value_json, row.state_key.slice(UPDATE_RECOVERY_KEY_PREFIX.length)));
}
/** Private read-only compatibility surface for diagnostics and retained-pair
* inspection. Legacy receipts remain exact historical evidence, never authority.
* Execution loaders below deliberately reject them instead of upgrading them. */
function inspectUpdateRecoveries(options = {}) {
	return withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => inspectRecoveries(db), options) ?? [];
}
//#endregion
//#region src/infra/update-run-ledger.ts
function createUpdateRun(input, options = {}) {
	const now = Date.now();
	const row = encodeRun({
		runId: input.runId ?? randomUUID(),
		createdAtMs: now,
		updatedAtMs: now,
		trigger: input.trigger,
		phase: "requested",
		status: "running",
		reason: null,
		origin: input.origin ?? {},
		target: input.target ?? {},
		before: input.before ?? {},
		after: {},
		steps: [{
			step: "requested",
			status: "in_progress",
			startedAtMs: now
		}],
		verification: {},
		repair: [],
		confirmedAtMs: null,
		finishedAtMs: null,
		downtimeMs: null
	}, options);
	return runUpdateRunAdmission((db, recoveryChanges) => {
		const recordRecovery = (record) => {
			if (recoveryChanges.length > 0) upsertStep(record, {
				step: "task-delivery-recovery",
				status: "completed",
				startedAtMs: now,
				endedAtMs: Date.now(),
				detail: recoveryChanges.join("\n")
			});
			return record;
		};
		const existing = readUpdateRunRecord(db, row.run_id);
		if (existing) return recoveryChanges.length > 0 ? persistRun(db, recordRecovery(existing), options) : existing;
		if (input.supersedeStaleIdentityless && !input.runId && input.trigger === "cli") {
			const active = executeSqliteQuerySync(db, getNodeSqliteKysely(db).selectFrom("update_runs").selectAll().where("status", "=", "running").limit(2)).rows;
			const previous = active.length === 1 && active[0] ? decodeRun(active[0]) : void 0;
			if (previous && !hasStoredUpdateRecovery(db, previous.runId) && isStaleIdentitylessUpdateRun(previous)) {
				upsertStep(previous, {
					step: "reconcile:superseded",
					status: "failed",
					endedAtMs: now,
					detail: "operator-started-update-supersedes-inactive-identityless-run"
				});
				finishUpdateRunRecord(previous, {
					status: "failed",
					reason: "superseded"
				});
				persistRun(db, previous, options);
			}
		}
		const admittedRow = encodeRun(recordRecovery(decodeRun(row)), options);
		executeSqliteQuerySync(db, getNodeSqliteKysely(db).insertInto("update_runs").values(admittedRow));
		return decodeRun(admittedRow);
	}, options, {
		schemaSql: updateRunLedgerSchema,
		busyTimeoutMs: options.busyTimeoutMs,
		recoverTaskDeliveryOrphans: !input.preview
	});
}
/** Adoption is explicit: reading or reserving an existing run does not make this process its driver. */
function adoptUpdateRun(runId, options = {}) {
	const driver = readUpdateRunDriver();
	let identityUnavailable = false;
	const adopted = mutateRun(runId, (record) => {
		if (record.status !== "running") throw new Error(`Update run ${runId} is already ${record.status}; it cannot be adopted.`);
		if (!driver) {
			if (!record.steps.some((step) => step.step === "driver:identity-unavailable")) {
				upsertStep(record, {
					step: "driver:identity-unavailable",
					status: "completed",
					endedAtMs: Date.now()
				});
				identityUnavailable = true;
			}
			return;
		}
		const previousDrivers = [];
		for (const previous of recordedUpdateRunDrivers(record)) if (!sameUpdateRunDriver(previous, driver) && !previousDrivers.some((retained) => sameUpdateRunDriver(retained, previous)) && inspectUpdateRunDriver(previous) !== "dead") previousDrivers.push(previous);
		if (previousDrivers.length >= 8) throw new Error(`Update run ${runId} has too many live or unobservable drivers; adoption refused.`);
		const retained = record.origin.previousDrivers ?? [];
		if (record.origin.driver && sameUpdateRunDriver(record.origin.driver, driver) && record.steps.some((step) => step.step === "driver:adopted") && retained.length === previousDrivers.length && retained.every((previous, index) => {
			const next = previousDrivers[index];
			return next !== void 0 && sameUpdateRunDriver(previous, next);
		})) return;
		record.origin.driver = driver;
		record.origin.previousDrivers = previousDrivers.length ? previousDrivers : void 0;
		upsertStep(record, {
			step: "driver:adopted",
			status: "completed",
			endedAtMs: Date.now()
		});
	}, options);
	if (identityUnavailable) console.warn("[update] Driver identity recording is unavailable. The update will continue; this run requires explicit recovery if it stops reporting progress.");
	return adopted;
}
/** Retained orchestrators can renew their children; pruned identities cannot. */
function heartbeatUpdateRun(runId, driver, options = {}) {
	if (!driver) return;
	mutateRun(runId, (record) => {
		if (record.status === "running" && recordedUpdateRunDrivers(record).some((current) => sameUpdateRunDriver(current, driver))) record.updatedAtMs = Math.max(Date.now(), record.updatedAtMs + 1);
	}, options);
}
/** Record successful repair without changing the failed outcome; report only new acknowledgment. */
function acknowledgeAbandonedUpdateRun(runId, options = {}) {
	let acknowledged = false;
	mutateRun(runId, (record) => {
		if (isAbandonedUpdateRun(record) && !record.steps.some((step) => step.step === "reconcile:acknowledged")) {
			upsertStep(record, {
				step: "reconcile:acknowledged",
				status: "completed",
				endedAtMs: Date.now()
			});
			acknowledged = true;
		}
	}, options);
	return acknowledged;
}
function canReconcileCandidates(candidates, input) {
	return candidates.some(({ rule }) => rule && (!input.legacyOnly || rule === "legacy-driver-expired")) && !(input.explicit && candidates.some(({ record, rule }) => record.status === "running" && !rule));
}
/** Prepare eligibility without write access, then revalidate under the writer's transaction. */
function reconcileAbandonedUpdateRuns(input = {}, options = {}) {
	if (input.runIds?.length === 0) return [];
	return reconcileCandidates(withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(({ db }) => readUpdateRunReconciliationCandidates(db, input), options) ?? [], input, options).reconciled;
}
async function reconcileAbandonedUpdateRunsAsync(input = {}, options = {}) {
	if (input.runIds?.length === 0) return [];
	return reconcileCandidates(await withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(({ db }) => readUpdateRunReconciliationCandidates(db, input), options) ?? [], input, options).reconciled;
}
/** History remains readable when best-effort reconciliation cannot obtain write access. */
async function getUpdateRunWithReconciliationAsync(runId, options = {}) {
	const candidate = await withExistingOpenClawStateDatabaseArtifactPreservingReadOnlyAsync(({ db }) => {
		const run = tableExists(db, "update_runs") ? readUpdateRunRecord(db, runId) : void 0;
		return run ? inspectUpdateRunReconciliation(db, run, {}) : void 0;
	}, options);
	if (!candidate) return { run: void 0 };
	try {
		const { current } = reconcileCandidates([candidate], {}, options);
		return { run: current[0] };
	} catch (error) {
		return {
			run: candidate.record,
			reconciliationError: formatErrorMessage(error)
		};
	}
}
function reconcileCandidates(candidates, input, options) {
	if (!canReconcileCandidates(candidates, input)) return {
		current: candidates.map(({ record }) => record),
		reconciled: []
	};
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		const selected = candidates.flatMap(({ record }) => {
			const current = readUpdateRunRecord(db, record.runId);
			return current ? [inspectUpdateRunReconciliation(db, current, input)] : [];
		});
		const current = selected.map(({ record }) => record);
		if (!canReconcileCandidates(selected, input) || input.requireAllActive && executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("update_runs").select("run_id").where("status", "=", "running").where("run_id", "not in", candidates.map(({ record }) => record.runId)).limit(1))) return {
			current,
			reconciled: []
		};
		const reconciled = [];
		return {
			current: selected.map(({ record, rule }) => {
				if (!rule || input.legacyOnly && rule !== "legacy-driver-expired") return record;
				upsertStep(record, {
					step: "reconcile:abandoned",
					status: "failed",
					endedAtMs: Date.now(),
					detail: rule
				});
				finishUpdateRunRecord(record, {
					status: "failed",
					reason: rule === "legacy-driver-expired" ? rule : "abandoned"
				});
				const saved = persistRun(db, record, options);
				reconciled.push(saved);
				return saved;
			}),
			reconciled
		};
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run",
		busyTimeoutMs: options.busyTimeoutMs
	});
}
function recordUpdateRunPhase(runId, phase, patch = {}, options = {}, captureBefore) {
	return mutateRun(runId, (record) => {
		if (record.status !== "running") return;
		if (patch.origin) record.origin = {
			...record.origin,
			...patch.origin
		};
		if (patch.target) record.target = {
			...record.target,
			...patch.target
		};
		if (patch.before) record.before = {
			...record.before,
			...patch.before
		};
		if (patch.after) record.after = {
			...record.after,
			...patch.after
		};
		if (patch.trigger) record.trigger = patch.trigger;
		const repairsVerification = phase === "repairing" && record.phase === "verifying";
		const advances = UPDATE_RUN_PHASES.indexOf(phase) > UPDATE_RUN_PHASES.indexOf(record.phase);
		const resumesVerification = record.phase === "repairing" && record.steps.some((step) => step.step === "verifying");
		if (phase !== "finished" && (repairsVerification || advances && (!resumesVerification || phase === "verifying"))) {
			const now = Date.now();
			upsertStep(record, {
				step: record.phase,
				status: "completed",
				endedAtMs: now
			});
			record.phase = phase;
			upsertStep(record, {
				step: phase,
				status: "in_progress",
				startedAtMs: now,
				endedAtMs: void 0
			});
		}
		if (patch.step) upsertStep(record, patch.step);
	}, options, captureBefore);
}
function recordUpdateRunStep(runId, { reason, ...step }, options = {}) {
	return mutateRun(runId, (record) => {
		if (record.status === "running") {
			upsertStep(record, step);
			if (reason !== void 0) record.reason = reason;
		}
	}, options);
}
function recordUpdateRunRepairContinuation(runId, inheritedRunId, options = {}) {
	mutateRun(runId, (record) => {
		const admission = inspectUpdateRepairDriverAdmission([record], inheritedRunId);
		if (admission.kind === "conflict") throw new Error(admission.message);
		const step = admission.kind === "continuation" ? "finalize:repair-continuation" : "finalize:repair-takeover";
		if (record.steps.some((entry) => entry.step === step)) return;
		upsertStep(record, {
			step,
			status: "completed",
			endedAtMs: Date.now(),
			detail: admission.kind === "continuation" ? `Repair continued within the owning update by PID ${process.pid}.` : `Repair took over Gateway activation by PID ${process.pid} under abandonment admission.`
		});
	}, options);
}
/** A terminal process diagnostic adds evidence without reopening the recorded outcome. */
function recordUpdateRunDiagnostic(runId, detail, options = {}, step = "finalize:exit") {
	return mutateRun(runId, (record) => {
		upsertStep(record, {
			step,
			status: "completed",
			endedAtMs: Date.now(),
			detail
		});
	}, options);
}
/** Correct the shipped refusal classification only after its install target was satisfied. */
function reconcilePackageOwnerRefusal(expected, options = {}) {
	if (!isUnacknowledgedPackageOwnerRefusal(expected)) return false;
	return runExistingOpenClawStateWriteTransaction(({ db }) => {
		const query = getNodeSqliteKysely(db).selectFrom("update_runs");
		const latest = executeSqliteQueryTakeFirstSync(db, query.selectAll().orderBy("created_at_ms", "desc").orderBy("run_id", "desc").limit(1));
		if (!latest || !isDeepStrictEqual(decodeRun(latest), expected) || executeSqliteQueryTakeFirstSync(db, query.select("run_id").where("status", "=", "running").limit(1)) || readRecoveries(db).some((entry) => entry.runId === expected.runId || isUpdateRecoveryPending(entry))) return false;
		mutateRunInTransaction(db, expected.runId, (record) => {
			record.status = "skipped";
			record.reason = "unmanaged-package-install";
			for (const step of record.steps) if (step.step === "requested") step.status = "skipped";
			upsertStep(record, {
				step: "reconcile:acknowledged",
				status: "completed",
				endedAtMs: Date.now()
			});
		}, options);
		return true;
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.run",
		busyTimeoutMs: options.busyTimeoutMs
	});
}
/** Close only this local preview, excluding recovery in the same stable-schema transaction. */
function finishInterruptedUpdatePreview(expected, options) {
	if (expected.status !== "running" || expected.phase !== "requested") throw new Error("Preview interruption requires an active admission");
	runExistingOpenClawStateWriteTransaction(({ db }) => {
		if (readRecoveries(db).some((entry) => entry.runId === expected.runId || isUpdateRecoveryPending(entry))) return;
		mutateRunInTransaction(db, expected.runId, (record) => {
			if (isDeepStrictEqual(record, expected)) finishUpdateRunRecord(record, {
				status: "skipped",
				reason: "interrupted"
			});
		}, options);
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.preview.interrupted"
	});
}
/** Caller holds fresh local admission and a live executor; retained recovery stays refused. */
function finishInterruptedUpdateBeforeActivation(expected, assertCurrent, options) {
	if (expected.status !== "running" || ![
		"requested",
		"staging",
		"validating"
	].includes(expected.phase)) throw new Error("Update interruption requires its live pre-activation transaction");
	const recoveryTable = "config_machine_state";
	const start = OPENCLAW_STATE_SCHEMA_SQL.indexOf(`CREATE TABLE IF NOT EXISTS ${recoveryTable} (`);
	const end = OPENCLAW_STATE_SCHEMA_SQL.indexOf(") STRICT;", start);
	if (start < 0 || end < 0) throw new Error("Interrupted update schema is unavailable.");
	const recoverySchema = OPENCLAW_STATE_SCHEMA_SQL.slice(start, end + 9);
	assertCurrent();
	runExistingOpenClawStateWriteTransaction(({ db, path: pathname }) => {
		assertCurrent();
		if (executeSqliteQueryTakeFirstSync(db, getNodeSqliteKysely(db).selectFrom("main.sqlite_schema").select("name").where("name", "=", recoveryTable))) assertSqliteSchemaContains(db, pathname, recoverySchema);
		if (!readRecoveries(db).some((entry) => entry.runId === expected.runId || isUpdateRecoveryPending(entry))) mutateRunInTransaction(db, expected.runId, (record) => {
			if (isDeepStrictEqual(record, expected)) finishUpdateRunRecord(record, {
				status: "failed",
				reason: "interrupted"
			});
		}, options);
		assertCurrent();
	}, options, {
		schemaSql: updateRunLedgerSchema,
		operationLabel: "update.interrupted"
	});
}
function recordUpdateRunVerification(runId, verification, options = {}) {
	return mutateRun(runId, (record) => recordUpdateRunVerificationRecord(record, verification, options), options);
}
function recordUpdateRunRepairAttempt(runId, attempt, options = {}) {
	return mutateRun(runId, (record) => {
		if (record.status !== "running") return;
		record.repair = [...record.repair.filter((entry) => entry.attempt !== attempt.attempt), attempt].slice(-16);
	}, options);
}
//#endregion
export { inspectUpdateRecoveries as _, finishInterruptedUpdatePreview as a, isUpdateRecoveryPending as b, reconcileAbandonedUpdateRuns as c, recordUpdateRunDiagnostic as d, recordUpdateRunPhase as f, recordUpdateRunVerification as g, recordUpdateRunStep as h, finishInterruptedUpdateBeforeActivation as i, reconcileAbandonedUpdateRunsAsync as l, recordUpdateRunRepairContinuation as m, adoptUpdateRun as n, getUpdateRunWithReconciliationAsync as o, recordUpdateRunRepairAttempt as p, createUpdateRun as r, heartbeatUpdateRun as s, acknowledgeAbandonedUpdateRun as t, reconcilePackageOwnerRefusal as u, readRecoveries as v, UpdateRunAdmissionBusyError as x, UpdateRecoveryRequiredError as y };
