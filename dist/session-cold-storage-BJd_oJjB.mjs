import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { c as resolveOpenClawStateSqlitePath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { c as resolveOpenClawAgentSqlitePath, n as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as parseTranscriptAppendRefusal, t as SessionTranscriptWriterClaimReboundError } from "./session-transcript-writer-claim-error-eP-_sDN9.mjs";
import { i as runQueuedStoreWrite } from "./store-writer-queue-AKR6NnXM.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { a as sessionChanges } from "./session-row-changes-vFaNnKNM.mjs";
import { L as iterateProjectedAgentRunSessionKeys, t as buildProjectedAgentRunIndex } from "./agent-run-registry-gmaPgO-n.mjs";
import { C as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-BtDOU_3j.mjs";
import { u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-uO0pz59U.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { a as prepareSqliteTranscriptReadScope, l as runExclusiveSqliteSessionWrite } from "./session-accessor.sqlite-scope-9ysL95gx.mjs";
import { a as publishUnchangedSessionTranscriptReceipts } from "./session-transcript-authority-Bd3kv5VJ.mjs";
import { r as captureOpenClawAgentDatabaseExecution, s as supportsOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { l as projectionLane, v as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { o as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import "./targets-DJGC6v85.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-DYvA41kd.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { f as withSqliteMutationWorkerLifetime, l as runSqliteTranscriptArchiveWorkerOperation } from "./session-accessor.sqlite-archive-C60vk-we.mjs";
import { a as withSqliteReclamationAuthorization } from "./session-accessor.sqlite-reclamation-commit-DnAU8RAC.mjs";
import { l as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-BpIicMPG.mjs";
import { i as withSqliteSessionPageReclamation, n as reclaimSqliteFreePages } from "./session-history-archive-pruning-CaAaXzvE.mjs";
import { statSync } from "node:fs";
import path from "node:path";
//#region src/config/sessions/session-cold-storage-targets.ts
async function prepareSessionColdStorageTargets(config, assertCallerCurrent) {
	const prepared = prepareSessionStoreTargetInventory(config, listConfiguredSessionStoreAgentIds(config), process.env, "configured");
	const { env, candidates } = prepared;
	const context = captureOpenClawStateReadWorkerContext({ env });
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
	const source = createOpenClawAgentDatabasePathMatcher();
	for (const candidate of candidates) source(candidate.path, candidate.path);
	const assertCurrent = () => {
		assertCallerCurrent?.();
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		if (!source.isCurrent()) throw new Error("Session store changed during cold maintenance");
	};
	const stores = await withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		const registry = await registryRead.read();
		assertCurrent();
		registryRead.assertCurrent();
		discovery.assertCurrent();
		const inventory = await discovery.readTargetInventory({
			...prepared,
			registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
		});
		assertCurrent();
		registryRead.assertCurrent();
		discovery.assertCurrent();
		if (inventory.kind === "session-target-registry-required") throw new Error("Cold maintenance did not receive its registry snapshot");
		return inventory.agents.flatMap(({ result, reads }) => result.available ? result.targets.map((target, index) => ({
			databaseOptions: {
				...reads[index].database,
				path: reads[index].target.storePath,
				env
			},
			ownerStorePath: target.storePath
		})) : []);
	});
	assertCurrent();
	registryRead.assertCurrent();
	return {
		stores,
		assertCurrent
	};
}
//#endregion
//#region src/config/sessions/session-cold-storage.ts
const operations = /* @__PURE__ */ new Map();
const log = createSubsystemLogger("session-cold-storage");
const oversizedUntil = /* @__PURE__ */ new Map();
let nextStore = 0;
const restoredUntil = /* @__PURE__ */ new Map();
const RESTORE_COOLDOWN_MS = 864e5;
const MAX_TRANSCRIPTS_PER_PASS = 128;
const MAX_BATCH_BYTES = 67108864;
function workerDatabaseOptions(options) {
	const sourceEnv = options.env ?? process.env;
	return {
		agentId: options.agentId,
		path: resolveOpenClawAgentSqlitePath(options),
		env: { OPENCLAW_STATE_DIR: resolveOpenClawStateDirForDatabasePath(options.database?.path ?? resolveOpenClawStateSqlitePath(sourceEnv)) }
	};
}
async function runColdMutation(plan, assertCurrent, callerSignal, acceptSourceValidation) {
	const sourceMatches = plan.kind === "cold-restore" ? plan.guard?.sources?.flatMap((source, index) => source.conversationAlternatives ? [{
		index,
		matches: new Int32Array(new SharedArrayBuffer((source.conversationAlternatives.length + 1) * Int32Array.BYTES_PER_ELEMENT))
	}] : []) : void 0;
	return await withSqliteMutationWorkerLifetime(plan.databaseOptions, async ({ assertCurrent: assertRequestCurrent, commitGate, signal }) => {
		const execution = plan.kind !== "cold-restore" && supportsOpenClawAgentDatabaseExecution(plan.databaseOptions) ? captureOpenClawAgentDatabaseExecution(plan.databaseOptions) : void 0;
		let retained;
		try {
			const assertOpeningCurrent = () => {
				assertRequestCurrent();
				assertCurrent?.();
			};
			if (!execution) retained = await runExclusiveSqliteSessionWrite(plan.databaseOptions, async () => {
				assertOpeningCurrent();
				return retainOpenClawAgentDatabaseReadOnly(plan.databaseOptions);
			}, "session.reclamation.retain", void 0, "foreground", signal);
			const executionClaim = execution ? await withSessionEntryWorker(plan.databaseOptions, void 0, assertOpeningCurrent, (owner, source) => owner.runExisting(source, async () => owner.captureGenerationClaim()), void 0, execution, signal) : void 0;
			const claim = executionClaim ?? (retained?.found ? retained.claim : void 0);
			if (!claim) throw new Error("Cold transcript operation lost its owning database");
			const assertAllowed = () => {
				claim.assertCurrent();
				assertRequestCurrent();
				assertCurrent?.();
			};
			const diagnostics = { kind: plan.kind };
			const [completed] = await withSqliteReclamationAuthorization(commitGate, retained?.found ? retained.database.db : plan.databaseOptions.path, () => {
				if (sourceMatches?.length) {
					if (!acceptSourceValidation) throw new Error("Cold restoration requires source validation acceptance");
					const validation = { conversationMatches: sourceMatches.map(({ index, matches }) => {
						if (Atomics.load(matches, 0) !== 1) throw new Error("Cold restoration source alternatives are not ready");
						return {
							index,
							alternatives: Array.from({ length: matches.length - 1 }, (_, alternative) => alternative).filter((alternative) => Atomics.load(matches, alternative + 1) === 1)
						};
					}) };
					acceptSourceValidation(validation);
					assertAllowed();
					for (const match of validation.conversationMatches) {
						const matches = sourceMatches.find(({ index }) => index === match.index).matches;
						const accepted = match.acceptedAlternatives ?? match.alternatives;
						for (let alternative = 0; alternative < matches.length - 1; alternative++) Atomics.store(matches, alternative + 1, accepted.includes(alternative) ? 1 : 0);
					}
					return;
				}
				assertAllowed();
			}, (authorize) => runSqliteTranscriptArchiveWorkerOperation({
				diagnostics,
				signal,
				expectedMessageType: "reclaimed",
				validationOwner: executionClaim ? {
					source: plan.databaseOptions,
					claim: executionClaim
				} : retained?.found ? {
					database: retained.database,
					isCurrent: retained.claim.isCurrent
				} : void 0,
				onCommitRequest: authorize,
				withWriteAdmission: async (run, reclamationAdmission) => runExclusiveSqliteSessionWrite(plan.databaseOptions, async () => {
					let refusal;
					try {
						assertAllowed();
					} catch (error) {
						refusal = { error };
					}
					await run(refusal);
				}, "session.reclamation.worker-commit", {
					...diagnostics,
					reclamationAdmission
				}, "worker", signal),
				workerData: {
					type: "sqlite-transcript-archive-v2",
					operation: "cold-mutate",
					plan,
					commitGate,
					sourceMatches
				}
			}));
			if (!completed || completed.cleanupIncomplete) throw new Error("Cold transcript worker cleanup is incomplete; restart OpenClaw before another maintenance operation");
			publishUnchangedSessionTranscriptReceipts(completed.result.transcriptPublication);
			if (plan.kind !== "cold-restore") await withSqliteSessionPageReclamation(plan.databaseOptions, (reclaimPages) => reclaimSqliteFreePages(plan.databaseOptions, void 0, {
				reclaimPages,
				maxPages: 32768,
				assertCurrent: assertAllowed
			}));
			else if (completed.result.restored && completed.result.sessionKey !== void 0 && retained?.found && retained.claim.isCurrent()) {
				assertAllowed();
				sessionChanges.emit({
					storePath: retained.database.path,
					sessionKey: completed.result.sessionKey,
					scope: "transcript",
					facts: { kind: "unchanged" }
				});
			}
			return completed.result;
		} finally {
			await execution?.release();
			if (retained?.found) retained.claim.release();
		}
	}, callerSignal);
}
async function archiveSessionColdBatch(options) {
	const storePath = resolveOpenClawAgentSqlitePath(options.databaseOptions);
	const source = createOpenClawAgentDatabasePathMatcher();
	source(storePath, storePath);
	const assertCurrent = () => {
		options.assertCurrent?.();
		if (!source.isCurrent()) throw new Error("Cold transcript database changed during maintenance");
	};
	return runQueuedStoreWrite({
		queues: operations,
		storePath,
		label: "session.cold.archive",
		fn: async () => {
			assertCurrent();
			const cooled = /* @__PURE__ */ new Set();
			const now = Date.now();
			for (const cache of [restoredUntil, oversizedUntil]) for (const [key, until] of cache) if (until <= now) cache.delete(key);
			else if (key.startsWith(`${storePath}\0`)) cooled.add(key.slice(storePath.length + 1));
			const input = {
				databaseOptions: workerDatabaseOptions(options.databaseOptions),
				admissionIdentities: [...collectActiveSessionWorkAdmissions().get(options.ownerStorePath) ?? []],
				liveSessionKeys: [...iterateProjectedAgentRunSessionKeys(buildProjectedAgentRunIndex())],
				cooledSessionIds: [...cooled],
				beforeMs: options.beforeMs,
				maxTranscripts: options.maxTranscripts,
				maxBytes: options.maxBytes
			};
			const [batch] = await withSqliteMutationWorkerLifetime(input.databaseOptions, async ({ assertCurrent: assertRequestCurrent, signal }) => {
				const prepared = await runSqliteTranscriptArchiveWorkerOperation({
					expectedMessageType: "done",
					signal,
					assertCurrent: () => {
						assertRequestCurrent();
						assertCurrent();
					},
					workerData: {
						type: "sqlite-transcript-archive-v2",
						operation: "cold-prepare",
						input
					}
				});
				assertRequestCurrent();
				assertCurrent();
				return prepared;
			});
			assertCurrent();
			if (!batch) throw new Error("Cold archive worker returned no prepared batch");
			for (const sessionId of batch.oversizedSessionIds) {
				oversizedUntil.set(`${storePath}\0${sessionId}`, Date.now() + RESTORE_COOLDOWN_MS);
				log.warn("Transcript remains in SQLite because its archive exceeds the 64 MiB limit", { agentId: input.databaseOptions.agentId });
			}
			const included = [...batch.prepared.map((item) => item.plan.sessionId), ...batch.externalizations.map((item) => item.archive.session_id)];
			const result = included.length > 0 ? await runColdMutation({
				kind: "cold-batch",
				databaseOptions: input.databaseOptions,
				prepared: batch.prepared,
				externalizations: batch.externalizations,
				beforeMs: options.beforeMs,
				protectionKeys: batch.protectionKeys,
				liveSessionKeys: input.liveSessionKeys
			}, () => {
				assertCurrent();
				const admissions = collectActiveSessionWorkAdmissions().get(options.ownerStorePath);
				if ([...admissions ?? [], ...iterateProjectedAgentRunSessionKeys(buildProjectedAgentRunIndex())].some((identity) => batch.protectionKeys.includes(normalizeStoreSessionKey(identity))) || included.some((id) => admissions?.has(id) || (restoredUntil.get(`${storePath}\0${id}`) ?? 0) > Date.now())) throw new Error("Transcript became active; cold archival was canceled");
			}) : batch.freePages > 0 ? await runColdMutation({
				kind: "cold-maintain",
				databaseOptions: input.databaseOptions
			}, assertCurrent) : {
				archivedTranscripts: 0,
				externalizedTranscripts: 0
			};
			assertCurrent();
			return {
				archivedTranscripts: result.archivedTranscripts,
				externalizedTranscripts: result.externalizedTranscripts,
				envelopeBytes: batch.envelopeBytes,
				attemptedTranscripts: included.length + batch.oversizedSessionIds.length
			};
		}
	});
}
var SessionColdTurnReboundError = class extends Error {
	constructor(result) {
		super("Session changed before cold transcript restoration");
		this.result = result;
		this.name = "SessionColdTurnReboundError";
	}
};
var SessionColdSourceReboundError = class extends Error {
	constructor(refusal) {
		super("Session source changed before cold transcript restoration");
		this.refusal = refusal;
		this.name = "SessionColdSourceReboundError";
	}
};
async function restoreSessionColdTranscript(scope, assertCurrent, preparation, guard, signal) {
	signal?.throwIfAborted();
	const memory = captureSessionActorStorageOwner({
		...scope,
		storePath: scope.storePath ?? preparation?.target.path
	}, {
		assertCurrent: () => assertCurrent?.(),
		authorize: () => assertCurrent?.()
	});
	if (memory) {
		memory.authority.assertCurrent();
		memory.binding?.actor.assertReadable();
		return;
	}
	assertCurrent?.();
	if (!preparation) {
		const captured = {
			...scope,
			...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
			env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
		};
		const context = captureOpenClawStateReadWorkerContext({ env: captured.env });
		const assertPreparedCurrent = () => {
			signal?.throwIfAborted();
			context.maintenanceScope?.assertAdmission();
			context.admission.assertCurrent();
			assertCurrent?.();
		};
		const target = await prepareSqliteTranscriptReadScope(captured, signal);
		assertPreparedCurrent();
		target.path = resolveOpenClawAgentSqlitePath(toDatabaseOptions(target));
		const options = toDatabaseOptions(target);
		try {
			statSync(target.path);
		} catch (error) {
			if (!hasErrnoCode(error, "ENOENT")) throw error;
			return;
		}
		const source = createOpenClawAgentDatabasePathMatcher();
		source(target.path, target.path);
		return await withSessionHistoryWorkerDatabase(options, async (owner) => {
			const assertAllowed = () => {
				assertPreparedCurrent();
				owner.assertCurrent();
				if (!source.isCurrent()) throw new Error("Session store changed while preparing its metadata. Retry the request.");
			};
			return await restoreSessionColdTranscript(captured, assertAllowed, {
				target,
				readMetadata: async () => {
					return (await owner.readColdMetadata({
						sessionId: target.sessionId,
						env: captured.env
					}, signal)).archive;
				}
			}, guard, signal);
		}, projectionLane);
	}
	const resolved = preparation.target;
	const options = toDatabaseOptions(resolved);
	const storePath = resolveOpenClawAgentSqlitePath(options);
	const key = `${storePath}\0${resolved.sessionId}`;
	const initial = await preparation.readMetadata("initial");
	signal?.throwIfAborted();
	assertCurrent?.();
	if (!initial) return;
	await runQueuedStoreWrite({
		queues: operations,
		storePath,
		label: "session.cold.restore",
		signal,
		fn: async () => {
			assertCurrent?.();
			const archive = await preparation.readMetadata("queued");
			signal?.throwIfAborted();
			assertCurrent?.();
			if (!archive) return;
			const result = await runColdMutation({
				kind: "cold-restore",
				databaseOptions: workerDatabaseOptions(options),
				sessionId: resolved.sessionId,
				archive,
				guard
			}, assertCurrent, signal, preparation.acceptSourceValidation);
			if (result.turnRebound) throw new SessionColdTurnReboundError(result.turnRebound);
			if (result.refusedSource) throw new SessionColdSourceReboundError(result.refusedSource);
			if (result.writerRefusal !== void 0) {
				const refusal = parseTranscriptAppendRefusal(result.writerRefusal);
				if (!refusal) throw new Error("Cold transcript writer refusal has an invalid identity");
				throw new SessionTranscriptWriterClaimReboundError(refusal);
			}
			signal?.throwIfAborted();
			assertCurrent?.();
			const now = Date.now();
			for (const [id, until] of restoredUntil) if (until <= now) restoredUntil.delete(id);
			restoredUntil.set(key, now + RESTORE_COOLDOWN_MS);
		}
	});
}
async function runSessionColdStorageMaintenance(params) {
	const result = {
		archivedTranscripts: 0,
		externalizedTranscripts: 0
	};
	const config = params.config.session?.maintenance?.coldStorage;
	if (!config?.enabled) return result;
	const beforeMs = Date.now() - (config.afterDays ?? 30) * 24 * 60 * 60 * 1e3;
	const { stores, assertCurrent } = await prepareSessionColdStorageTargets(params.config, params.assertCurrent);
	assertCurrent();
	const start = stores.length ? nextStore % stores.length : 0;
	nextStore = start + 1;
	let remainingTranscripts = MAX_TRANSCRIPTS_PER_PASS;
	let remainingBytes = MAX_BATCH_BYTES;
	for (const { databaseOptions, ownerStorePath } of [...stores.slice(start), ...stores.slice(0, start)]) {
		if (remainingTranscripts <= 0 || remainingBytes <= 0) break;
		assertCurrent();
		const batch = await archiveSessionColdBatch({
			databaseOptions,
			ownerStorePath,
			beforeMs,
			maxTranscripts: remainingTranscripts,
			maxBytes: remainingBytes,
			assertCurrent
		});
		assertCurrent();
		result.archivedTranscripts += batch.archivedTranscripts;
		result.externalizedTranscripts += batch.externalizedTranscripts;
		remainingTranscripts -= batch.attemptedTranscripts;
		remainingBytes -= batch.envelopeBytes;
		params.onProgress?.({ ...result });
	}
	return result;
}
//#endregion
export { runSessionColdStorageMaintenance as i, SessionColdTurnReboundError as n, restoreSessionColdTranscript as r, SessionColdSourceReboundError as t };
