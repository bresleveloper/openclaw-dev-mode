import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { c as resolveOpenClawStateSqlitePath, o as resolveOpenClawStateDirForDatabasePath } from "./openclaw-state-db.paths-DfifnSGp.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { S as listConfiguredSessionStoreAgentIds } from "./openclaw-state-db-D1jWDzK3.mjs";
import { r as runQueuedStoreWrite } from "./store-writer-queue-Cq6rziq_.mjs";
import { n as sessionChanges } from "./session-row-changes-BcJIdta8.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import "./openclaw-agent-db-DBug3LUA.mjs";
import { t as captureSessionTranscriptStorageEnvironment } from "./transcript-target-binding-WjVavOYj.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { n as withOpenClawAgentDatabaseReadOnly, t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { a as prepareSqliteTranscriptReadScope, p as runExclusiveSqliteSessionWrite, u as resolveSqliteTranscriptReadScope } from "./session-accessor.sqlite-scope-CdpbxR_m.mjs";
import { d as withSessionHistoryWorkerReadCandidates, s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { r as readSessionColdTranscript } from "./session-cold-storage-state-CzcE3h3O.mjs";
import "./targets-BbcRkdUC.mjs";
import { o as collectActiveSessionWorkAdmissions } from "./session-lifecycle-admission-GoxISURZ.mjs";
import { c as runSqliteTranscriptArchiveWorkerOperation, d as withSqliteMutationWorkerLifetime } from "./session-accessor.sqlite-archive-B_Nn5x_K.mjs";
import { a as withSqliteReclamationAuthorization } from "./session-accessor.sqlite-reclamation-commit-CC945S9j.mjs";
import { r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import { i as withSqliteSessionPageReclamation, r as reclaimSqliteFreePages } from "./session-history-archive-pruning-BiyaLkTQ.mjs";
import { a as withSessionEntryWorker } from "./session-accessor.sqlite-replacement-worker-9fiwLkM3.mjs";
import { statSync } from "node:fs";
import path from "node:path";
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
async function runColdMutation(plan, assertCurrent, callerSignal) {
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
			const [completed] = await withSqliteReclamationAuthorization(commitGate, retained?.found ? retained.database.db : plan.databaseOptions.path, assertAllowed, (authorize) => runSqliteTranscriptArchiveWorkerOperation({
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
					commitGate
				}
			}));
			if (!completed || completed.cleanupIncomplete) throw new Error("Cold transcript worker cleanup is incomplete; restart OpenClaw before another maintenance operation");
			if (plan.kind !== "cold-restore") await withSqliteSessionPageReclamation(plan.databaseOptions, (reclaimPages) => reclaimSqliteFreePages(plan.databaseOptions, void 0, {
				reclaimPages,
				maxPages: 32768,
				assertCurrent: assertAllowed
			}));
			if (plan.kind === "cold-restore" && completed.result.restored && completed.result.sessionKey !== void 0 && retained?.found && retained.claim.isCurrent()) {
				assertAllowed();
				sessionChanges.emit({
					storePath: retained.database.path,
					sessionKey: completed.result.sessionKey,
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
			const empty = {
				archivedTranscripts: 0,
				externalizedTranscripts: 0,
				envelopeBytes: 0,
				attemptedTranscripts: 0
			};
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
				protectionKeys: batch.protectionKeys
			}, () => {
				assertCurrent();
				const admissions = collectActiveSessionWorkAdmissions().get(options.ownerStorePath);
				if ([...admissions ?? []].some((identity) => batch.protectionKeys.includes(normalizeStoreSessionKey(identity)))) throw new Error("Transcript became active; cold archival was canceled");
				if (included.some((id) => admissions?.has(id) || (restoredUntil.get(`${storePath}\0${id}`) ?? 0) > Date.now())) throw new Error("Transcript became active; cold archival was canceled");
			}) : batch.freePages > 0 ? await runColdMutation({
				kind: "cold-maintain",
				databaseOptions: input.databaseOptions
			}, assertCurrent) : empty;
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
async function restoreSessionColdTranscript(scope, assertCurrent, preparation, turnGuard, signal) {
	signal?.throwIfAborted();
	assertCurrent?.();
	let resolved = preparation?.target;
	if (!resolved && (isIncognitoSessionKey(scope.sessionKey) || scope.agentId && scope.storePath && isIncognitoOpenClawAgentSqlitePath(scope.storePath, {
		agentId: scope.agentId,
		env: scope.env
	}))) resolved = resolveSqliteTranscriptReadScope(scope);
	if (!resolved) {
		const captured = {
			...scope,
			...scope.storePath ? { storePath: path.resolve(scope.storePath) } : {},
			env: captureSessionTranscriptStorageEnvironment(scope.env ?? process.env)
		};
		const context = captureOpenClawStateReadWorkerContext({ env: captured.env });
		const assertPreparedCurrent = () => {
			context.maintenanceScope?.assertAdmission();
			context.admission.assertCurrent();
			signal?.throwIfAborted();
			assertCurrent?.();
		};
		const target = await prepareSqliteTranscriptReadScope(captured, signal);
		assertPreparedCurrent();
		target.path = resolveOpenClawAgentSqlitePath(toDatabaseOptions(target));
		resolved = target;
		const options = toDatabaseOptions(target);
		if (!isIncognitoOpenClawAgentSqlitePath(target.path, options)) {
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
				}, turnGuard, signal);
			});
		}
	}
	const options = toDatabaseOptions(resolved);
	const storePath = resolveOpenClawAgentSqlitePath(options);
	const key = `${storePath}\0${resolved.sessionId}`;
	const readNativeMetadata = () => {
		const result = withOpenClawAgentDatabaseReadOnly((database) => readSessionColdTranscript(database.db, resolved.sessionId), options);
		return result.found ? result.value : void 0;
	};
	const initial = preparation ? await preparation.readMetadata("initial") : readNativeMetadata();
	if (preparation) {
		signal?.throwIfAborted();
		assertCurrent?.();
	}
	if (!initial) return;
	await runQueuedStoreWrite({
		queues: operations,
		storePath,
		label: "session.cold.restore",
		signal,
		fn: async () => {
			signal?.throwIfAborted();
			assertCurrent?.();
			const archive = preparation ? await preparation.readMetadata("queued") : readNativeMetadata();
			if (preparation) {
				signal?.throwIfAborted();
				assertCurrent?.();
			}
			if (!archive) return;
			const result = await runColdMutation({
				kind: "cold-restore",
				databaseOptions: workerDatabaseOptions(options),
				sessionId: resolved.sessionId,
				archive,
				turnGuard
			}, assertCurrent, signal);
			if (result.turnRebound) throw new SessionColdTurnReboundError(result.turnRebound);
			signal?.throwIfAborted();
			assertCurrent?.();
			const now = Date.now();
			for (const [id, until] of restoredUntil) if (until <= now) restoredUntil.delete(id);
			restoredUntil.set(key, now + RESTORE_COOLDOWN_MS);
		}
	});
}
async function configuredStores(config, assertCallerCurrent) {
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
async function runSessionColdStorageMaintenance(params) {
	const result = {
		archivedTranscripts: 0,
		externalizedTranscripts: 0
	};
	const config = params.config.session?.maintenance?.coldStorage;
	if (!config?.enabled) return result;
	const beforeMs = Date.now() - (config.afterDays ?? 30) * 24 * 60 * 60 * 1e3;
	const { stores, assertCurrent } = await configuredStores(params.config, params.assertCurrent);
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
export { restoreSessionColdTranscript as n, runSessionColdStorageMaintenance as r, SessionColdTurnReboundError as t };
