import { Et as _enum, Jn as string, Lt as boolean, Nt as array, Pn as number, Yt as discriminatedUnion, lr as uuid, or as union, qn as strictObject, xn as literal } from "./schemas-BOYIvvln.mjs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
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
function isRecoverablePreparationNative(manager) {
	const { original, effects } = manager;
	if (effects.length === 0) return true;
	const [stop, restore] = effects;
	return original.exists && original.enabled === true && original.loaded && !original.stopped && effects.length === 2 && stop?.action === "stop" && isDeepStrictEqual(stop.before, original) && isDeepStrictEqual(stop.after, {
		...original,
		stopped: true,
		loaded: manager.identity.platform !== "darwin"
	}) && stop.state === "observed" && restore?.action === "restore" && restore.state === "observed" && isDeepStrictEqual(restore.before, stop.after) && isDeepStrictEqual(restore.after, original);
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
	if (aborted && (!record.source || !record.preimages || !record.nativeManager || !record.package || record.claimKind !== "recovery" || record.effects.length !== 0 || !isRecoverablePreparationNative(record.nativeManager) || record.handoff || record.checkpoint || record.afterImages !== void 0 || record.restore || record.publication || record.verification || record.terminal || record.retainedPair || record.primaryFailure?.code !== aborted.reason || record.primaryFailure.effectId !== null || aborted.commitRevision !== record.revision || aborted.committedAtMs > record.updatedAtMs || aborted.observedIdentity !== record.package.observed.observedIdentity || record.package.descriptor.retention !== null || record.package.descriptor.interruptedLaunchers.length !== 0 || record.package.observed.observation.previous !== "live" || record.package.observed.observation.candidate !== "staged" || !["previous", "both"].includes(record.package.observed.observation.launchers) || record.package.observed.observation.successorLive)) ctx.addIssue({
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
/** Only validated inspection/execution records qualify. Historical completion
* permits admission, never restart, cleanup, or another recovery claim. */
function isUpdateRecoveryPending(record) {
	return !record.preparationAborted && (!record.terminal || record.restore !== null && record.restore.phase !== "observed" || record.effects.some((effect) => effect.state === "intent" && !(effect.kind === "retirement" && effect.package?.intent.action === "retire")));
}
//#endregion
export { isUpdateRecoveryPending as i, decodeUpdateRecovery as n, inspectUpdateRecovery as r, UpdateRecoveryRequiredError as t };
