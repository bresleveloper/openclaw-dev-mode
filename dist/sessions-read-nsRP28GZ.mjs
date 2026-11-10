import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { P as runWithDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-C91J-XX8.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { n as createOpenClawAgentDatabasePathMatcher, r as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey, b as isAcpSessionKey } from "./session-key-CSDERtm3.mjs";
import { O as withAgentRosterFactsBatch } from "./agent-scope-config-fjA2T9Gz.mjs";
import { i as listAgentIds } from "./agent-roster-gkYP38su.mjs";
import { $i as validateSessionsDescribeParams, Da as validateSessionsPreviewParams, Fa as validateSessionsSearchParams, Ki as validateSessionsCleanupParams, Na as validateSessionsResolveParams, Ng as errorShape, Ra as validateSessionsStorageParams, ya as validateSessionsListParams } from "./src-pLJQA6J5.mjs";
import { a as resolveSessionArtifactDirectory, c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { C as listConfiguredSessionStoreAgentIds, S as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-BtDOU_3j.mjs";
import { u as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-DCh0nEqi.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import { t as ErrorCodes } from "./gateway-error-details-Cl-eEOTQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-Coro3qc5.mjs";
import { h as canonicalSessionKeyMigrationRequiredError } from "./session-canonical-key-B7chVWi3.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CWFSrppd.mjs";
import { v as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-resources-D1956Oac.mjs";
import { s as withSessionHistoryWorkerDatabases } from "./session-transcript-worker-runtime-DyHfVUVm.mjs";
import "./targets-DJGC6v85.mjs";
import { i as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-BkD5HoDI.mjs";
import { a as readSessionEntrySummariesInWorker, n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { t as invalidSessionRequest } from "./session-request-error-qLiiFHUD.mjs";
import { r as resolveRequestedSessionAgentId } from "./session-request-agent-ByGzV8Af.mjs";
import { i as resolveSessionStoreAgentId, s as resolveStoredSessionKeyForAgentStore } from "./session-store-key-DKpto8R6.mjs";
import "./sessions-CnzPI1yx.mjs";
import { r as resolveExistingAgentSessionStoreTargetsAsync } from "./targets-runtime-l9s-sghb.mjs";
import { n as runSessionsCleanup, o as serializeSessionCleanupResult } from "./cleanup-service-BHj-66gM.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DXWhtQve.mjs";
import { d as isGatewayAdmin, n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-vx7GWqzs.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-Cdqn6r49.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-BUm5f-cY.mjs";
import { r as createSessionListEntryFilter } from "./session-sharing-read-B9_xLej9.mjs";
import "./session-sharing-DuL10izq.mjs";
import { t as createPreparedReadHandler } from "./prepared-read-C_6yTKv-.mjs";
import { r as projectOperatorModelRead } from "./operator-model-presentation-C1cUPSmr.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-CSzLs_ad.mjs";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { t as prepareProjectedSessionPresentation } from "./session-row-presentation-L_akTnVb.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-CAoWtmWT.mjs";
import { n as emitSessionsChanged } from "./session-change-event-0LxChmzi.mjs";
import { i as summarizeSessionListForWsLog } from "./ws-log-BIFX57Bv.mjs";
import { t as errorShapeFromError } from "./error-shape--ChVezuW.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation--xIH1Pj-.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { n as readRecentSessionMessagesWithStatsAsync } from "./session-transcript-readers-ChK_-oGN.mjs";
import { a as prepareSessionSearchIdentityNames, n as listProjectedSessions, r as prepareProjectedSessionList, s as filterSessionEntries } from "./session-utils-list-cYIWEFPs.mjs";
import "./session-utils-CGx9I2of.mjs";
import { t as searchSessionTranscripts } from "./session-transcript-search-DEeeTAVE.mjs";
import { n as withPreparedSessionResolve } from "./sessions-resolve-T8v8cHAf.mjs";
import { t as sessionLog } from "./session-log-BKA9lku6.mjs";
import "./slow-request-diagnostics-Ba6xRXbV.mjs";
import { n as requestGatewaySessionColdStorageMaintenance, t as getSessionColdStorageMaintenanceStatus } from "./session-cold-storage-maintenance-Bs58-ODC.mjs";
import { a as requireSessionKey } from "./sessions-shared-DECO-QN2.mjs";
import { t as readSessionPreviewItemsFromTranscriptAsync } from "./session-transcript-preview-Cfu5Y_Sl.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { isMainThread, threadId } from "node:worker_threads";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
//#region src/gateway/server-methods/sessions-list-diagnostics.ts
const sessionListDiagnostics = channel("openclaw.session.list");
function startSessionListDiagnostics(respond, operation, params) {
	const logEnabled = areDiagnosticsEnabledForProcess() && sessionLog.isEnabled("warn");
	if (!logEnabled && !sessionListDiagnostics.hasSubscribers) return;
	let checkpoint = performance.now();
	const startedAt = checkpoint;
	const timing = createStageTimingTracker(() => checkpoint);
	const trace = getActiveDiagnosticTraceContext();
	let phase = "setup";
	const projection = {
		prepareSyncMs: 0,
		rowSyncMs: 0,
		yieldWaitMs: 0,
		yieldCount: 0,
		selectedRowCount: 0,
		dirtyRowCount: 0,
		materializedRowCount: 0,
		reusedRowCount: 0
	};
	let responseOutcome = "none";
	let cpuMetrics = {};
	const startSyncCpu = () => {
		if (!cpuMetrics) return;
		try {
			return process.threadCpuUsage();
		} catch {
			cpuMetrics = void 0;
			return;
		}
	};
	const finishSyncCpu = (metric, started) => {
		if (!started || !cpuMetrics) return;
		try {
			const used = process.threadCpuUsage(started);
			cpuMetrics[metric] = (cpuMetrics[metric] ?? 0) + (used.user + used.system) / 1e3;
		} catch {
			cpuMetrics = void 0;
		}
	};
	const mark = (next) => {
		checkpoint = performance.now();
		timing.mark(phase);
		phase = next;
	};
	return {
		trace,
		mark,
		startSyncCpu,
		finishSyncCpu,
		projection,
		respond: ((...args) => {
			mark("response");
			responseOutcome = args[0] ? "ok" : "error";
			const responseCpu = startSyncCpu();
			try {
				return respond(...args);
			} catch (error) {
				responseOutcome = "threw";
				throw error;
			} finally {
				finishSyncCpu("responseThreadCpuMs", responseCpu);
				mark("handlerExit");
			}
		}),
		finish(handlerOutcome) {
			mark("handlerExit");
			const handlerElapsedMs = checkpoint - startedAt;
			const shouldLog = logEnabled && handlerElapsedMs >= 1e3 && areDiagnosticsEnabledForProcess();
			if (!shouldLog && !sessionListDiagnostics.hasSubscribers) return;
			try {
				const phaseDurationsMs = {};
				for (const stage of timing.snapshot().stages) phaseDurationsMs[stage.name] = (phaseDurationsMs[stage.name] ?? 0) + stage.durationMs;
				const fields = {
					operation,
					...summarizeSessionListForWsLog(params),
					pid: process.pid,
					threadId,
					isMainThread,
					handlerElapsedMs: Math.round(handlerElapsedMs),
					phaseDurationsMs,
					...cpuMetrics,
					...Object.fromEntries(Object.entries(projection).map(([key, value]) => [key, Math.round(value)])),
					handlerOutcome,
					responseOutcome
				};
				if (sessionListDiagnostics.hasSubscribers) sessionListDiagnostics.publish(fields);
				if (shouldLog) runWithDiagnosticTraceContext(trace, () => sessionLog.warn("slow session list", { ...fields }));
			} catch {}
		}
	};
}
//#endregion
//#region src/config/sessions/session-cold-storage-status.ts
async function fileBytes(pathname) {
	try {
		return (await fs.stat(pathname)).size;
	} catch (error) {
		if (hasErrnoCode(error, "ENOENT")) return 0;
		throw error;
	}
}
async function getSessionColdStorageStatus(config) {
	const prepared = prepareSessionStoreTargetInventory(config, listConfiguredSessionStoreAgentIds(config), process.env, "configured");
	const { env, candidates } = prepared;
	const context = captureOpenClawStateReadWorkerContext({ env });
	const registryRead = prepareOpenClawAgentDatabaseRegistrySnapshotRead({ env });
	const source = createOpenClawAgentDatabasePathMatcher();
	for (const candidate of candidates) source(candidate.path, candidate.path);
	const assertSnapshotCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		registryRead.assertCurrent();
		if (!source.isCurrent()) throw new Error("Session store changed while reading cold storage status. Retry the request.");
	};
	const result = await withSessionHistoryWorkerReadCandidates(candidates, async (discovery) => {
		const assertCurrent = () => {
			assertSnapshotCurrent();
			discovery.assertCurrent();
		};
		const registry = await registryRead.read();
		assertCurrent();
		const inventory = await discovery.readTargetInventory({
			...prepared,
			registeredDatabases: registry.result.status === "available" ? registry.result.entries : { status: "unavailable" }
		});
		assertCurrent();
		if (inventory.kind === "session-target-registry-required") throw new Error("Cold storage inventory did not receive its registry snapshot");
		const stores = inventory.agents.flatMap(({ reads }) => reads.filter(({ database }) => !isIncognitoOpenClawAgentSqlitePath(database.path, {
			agentId: database.agentId,
			env
		})).map(({ database, target }) => Object.assign({}, database, {
			env,
			storePath: target.storePath
		})));
		return withSessionHistoryWorkerDatabases(stores, async (owners) => {
			const readers = new Map(stores.map((store, index) => [store.path, owners[index]]));
			const results = await Promise.allSettled(stores.map(async ({ agentId, path: databasePath, storePath }) => {
				const owner = readers.get(databasePath);
				const counts = await owner.readColdStorageInventory({ env });
				assertCurrent();
				owner.assertCurrent();
				const directory = path.join(resolveSessionArtifactDirectory(storePath), "cold");
				const files = await fs.readdir(directory, { withFileTypes: true }).catch((error) => {
					if (hasErrnoCode(error, "ENOENT")) return [];
					throw error;
				});
				const archiveBytes = (await Promise.all(files.filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl.zst")).map((entry) => fileBytes(path.join(directory, entry.name))))).reduce((sum, bytes) => sum + bytes, 0);
				const { hotTranscripts, coldTranscripts, embeddedArchiveBytes } = counts;
				return {
					agentId,
					storePath,
					hotTranscripts,
					coldTranscripts,
					embeddedArchiveBytes,
					databaseBytes: await fileBytes(storePath),
					walBytes: await fileBytes(`${storePath}-wal`),
					archiveBytes
				};
			}));
			assertCurrent();
			return results.map((settled) => {
				if (settled.status === "rejected") throw settled.reason;
				return settled.value;
			});
		});
	});
	assertSnapshotCurrent();
	return result;
}
//#endregion
//#region src/gateway/server-methods/sessions-maintenance.ts
const maintenanceError = (error) => errorShape(ErrorCodes.INVALID_REQUEST, formatErrorMessage(error));
function createSessionStorageHandler(method) {
	return defineValidatedGatewayHandler(method, validateSessionsStorageParams, async ({ respond, context, sessionMutationAuthorization, sessionMutationCommitGuard, signal, hasCurrentClientAuthority }) => {
		const agents = await getSessionColdStorageStatus(context.getRuntimeConfig());
		signal?.throwIfAborted();
		sessionMutationCommitGuard?.();
		sessionMutationAuthorization?.assertCurrent();
		if (hasCurrentClientAuthority?.() === false) throw new Error("Transcript maintenance requester is no longer authorized");
		if (method === "sessions.storage.run") requestGatewaySessionColdStorageMaintenance(context.getRuntimeConfig);
		respond(true, {
			agents,
			maintenance: getSessionColdStorageMaintenanceStatus(context.getRuntimeConfig)
		}, void 0);
	}, maintenanceError);
}
const sessionMaintenanceHandlers = {
	"sessions.storage.status": createSessionStorageHandler("sessions.storage.status"),
	"sessions.storage.run": createSessionStorageHandler("sessions.storage.run"),
	"sessions.cleanup": defineValidatedGatewayHandler("sessions.cleanup", validateSessionsCleanupParams, async ({ params, respond, context, signal, hasCurrentClientAuthority, sessionMutationAuthorization, sessionMutationCommitGuard }) => {
		const assertCurrent = () => {
			signal?.throwIfAborted();
			sessionMutationAuthorization?.assertCurrent();
			if (hasCurrentClientAuthority?.() === false) throw new Error("Session cleanup requester is no longer authorized");
		};
		assertCurrent();
		const { mode, appliedSummaries, failure } = await runSessionsCleanup({
			cfg: context.getRuntimeConfig(),
			assertCurrent,
			commitGuard: sessionMutationCommitGuard,
			opts: params
		});
		const result = serializeSessionCleanupResult({
			mode,
			dryRun: false,
			summaries: appliedSummaries,
			failure
		});
		if (failure) respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, failure.message, { details: result }));
		else respond(true, result, void 0);
		for (const summary of appliedSummaries) {
			emitSessionsChanged(context, {
				reason: "cleanup",
				sessionKey: void 0
			});
			if (summary.wouldMutate) context.logGateway.debug(`sessions.cleanup applied ${summary.storePath}: ${summary.beforeCount} -> ${summary.afterCount}`);
		}
		if (failure?.lifecycleCommitted) emitSessionsChanged(context, {
			reason: "cleanup",
			sessionKey: void 0
		});
	}, maintenanceError)
};
//#endregion
//#region src/gateway/server-methods/sessions-read-by-key.ts
const sessionByKeyReadHandlers = {
	"sessions.describe": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsDescribeParams, "sessions.describe", respond)) return;
		const key = requireSessionKey(params.key, respond);
		if (!key) return;
		const projection = requireSessionRowProjection(context);
		await withReadySessionRows(projection, (cfg) => {
			const agent = resolveRequestedSessionAgentId(cfg, key, params.agentId);
			const denied = authorizeIncognitoSessionTarget({
				client: client ?? null,
				sessionKey: key,
				target: null
			});
			return agent.ok && !denied ? [{
				key,
				agentId: agent.agentId
			}] : [];
		}, (read) => {
			sessionMutationAuthorization?.assertCurrent();
			const requestedAgent = resolveRequestedSessionAgentId(read.state.cfg, key, params.agentId);
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			const query = {
				key,
				agentId: requestedAgent.agentId
			};
			const presentation = prepareProjectedSessionPresentation(read, client, Date.now(), createVisibleActiveSessionRunProjector(context, read.state.rowContext.projectedAgentRuns));
			const denied = presentation.authorizeDescription(query);
			if (denied) {
				respond(false, void 0, denied);
				return;
			}
			const record = read.describe(query);
			if (!record || hasOperatorBoundary(client, read.state.policyConfig) && presentation.sharing.entryFilter?.(record.key, record.entry) === false) {
				respond(true, { session: null });
				return;
			}
			respond(true, { session: presentation.present(record, params) });
		});
	},
	"sessions.get": async ({ params, respond, context, client, signal, sessionMutationAuthorization }) => {
		const p = params;
		const key = requireSessionKey(p.key ?? p.sessionKey, respond);
		if (!key) return;
		const limit = resolveIntegerOption(p.limit, 200, { min: 1 });
		const projection = requireSessionRowProjection(context);
		const requestedAgent = () => resolveRequestedSessionAgentId(context.getRuntimeConfig(), key, normalizeOptionalString(p.agentId));
		const queries = () => {
			const requested = requestedAgent();
			return requested.ok ? [{
				key,
				agentId: requested.agentId
			}] : [];
		};
		const selected = await withReadySessionRows(projection, queries, (read) => {
			sessionMutationAuthorization?.assertCurrent();
			const requested = requestedAgent();
			if (!requested.ok) {
				respond(false, void 0, requested.error);
				return;
			}
			const record = read.describe({
				key,
				agentId: requested.agentId
			});
			const policyConfig = read.state.policyConfig;
			const boundaryFilter = hasOperatorBoundary(client, policyConfig) ? createSessionListEntryFilter({
				client,
				cfg: policyConfig
			}) : void 0;
			if (!record?.entry.sessionId || boundaryFilter?.(record.key, record.entry) === false) {
				respond(true, { messages: [] }, void 0);
				return;
			}
			return record;
		});
		if (!selected) return;
		const target = {
			agentId: selected.agentId,
			sessionEntry: { sessionId: selected.entry.sessionId },
			sessionId: selected.entry.sessionId,
			sessionKey: selected.key,
			storePath: selected.storeTarget.storePath
		};
		const limits = {
			maxMessages: limit,
			maxLines: limit * 20 + 20,
			allowResetArchiveFallback: true
		};
		const messages = selected.entry.incognito || isIncognitoSessionKey(selected.key) ? (await readRecentSessionMessagesWithStatsAsync(target, limits)).messages : await (await import("./session-history-worker-runtime-DT3UfXfX.mjs")).readSessionHistoryPageInWorker({
			kind: "recent",
			params: {
				target,
				...limits
			}
		}, signal);
		await withReadySessionRows(projection, queries, (read) => {
			sessionMutationAuthorization?.assertCurrent();
			const requested = requestedAgent();
			const current = requested.ok ? read.describe({
				key,
				agentId: requested.agentId
			}, selected) : void 0;
			const policyConfig = read.state.policyConfig;
			const boundaryFilter = hasOperatorBoundary(client, policyConfig) ? createSessionListEntryFilter({
				client,
				cfg: policyConfig
			}) : void 0;
			if (!current || current.agentId !== selected.agentId || current.key !== selected.key || current.storeTarget.storePath !== selected.storeTarget.storePath || current.entry.sessionId !== target.sessionId || boundaryFilter?.(current.key, current.entry) === false) {
				respond(true, { messages: [] }, void 0);
				return;
			}
			respond(true, projectOperatorModelRead({
				context,
				client,
				agentId: current.agentId
			}, { messages }), void 0);
		});
	}
};
//#endregion
//#region src/gateway/server-methods/sessions-search-projected.ts
/** Search all selected resident metadata; only matching rows cross the wire. */
async function searchProjectedSessionTranscripts(params) {
	const projection = requireSessionRowProjection(params.context);
	let searchIdentities;
	const select = () => {
		const { prepared, presentation, filters } = prepareProjectedSessionList({
			projection,
			opts: params.scope,
			context: params.context,
			client: params.client,
			now: Date.now(),
			searchIdentities
		});
		const { entries } = withAgentRosterFactsBatch(prepared.cfg, () => runSynchronousWork(filterSessionEntries(filters)));
		const stores = /* @__PURE__ */ new Map();
		for (const [key] of entries) {
			const row = prepared.getTarget(key);
			if (!row) continue;
			const store = stores.get(row.storeTarget.storePath) ?? {
				target: row.storeTarget,
				rows: /* @__PURE__ */ new Map()
			};
			store.rows.set(row.key, row);
			stores.set(row.storeTarget.storePath, store);
		}
		return {
			stores,
			presentation
		};
	};
	const limit = params.limit ?? 10;
	const sameSelection = (previous, current) => previous.stores.size === current.stores.size && [...previous.stores].every(([path, store]) => {
		const next = current.stores.get(path);
		return next !== void 0 && store.target.agentId === next.target.agentId && store.rows.size === next.rows.size && [...store.rows].every(([key, row]) => next.rows.get(key)?.generation === row.generation);
	});
	const matchingHits = (selected, pages) => pages.flatMap(({ path, page }) => page.hits.flatMap((hit) => {
		const row = selected.stores.get(path)?.rows.get(hit.sessionKey);
		return row ? [{
			hit,
			row
		}] : [];
	})).toSorted((left, right) => right.hit.score - left.hit.score || right.hit.timestamp - left.hit.timestamp || left.hit.messageId.localeCompare(right.hit.messageId));
	for (let attempt = 0; attempt < 2; attempt++) {
		do {
			await projection.ensureMaterialized();
			if (params.scope.search?.trim()) searchIdentities = await prepareSessionSearchIdentityNames(projection, params.scope);
		} while (projection.needsMaterialization || searchIdentities && searchIdentities.cfg !== projection.state.cfg);
		const selected = select();
		const pages = await Promise.all([...selected.stores].map(async ([path, { target, rows }]) => ({
			path,
			page: await searchSessionTranscripts({
				...target,
				sessionKeys: [...rows.keys()],
				query: params.query,
				match: "prefix",
				limit
			}, {
				agentId: target.agentId,
				path: target.storePath
			})
		})));
		if (getSessionRowProjection(params.context) !== projection) throw new Error("Session search owner changed while reading; retry the request");
		if (projection.needsMaterialization || searchIdentities && searchIdentities.cfg !== projection.state.cfg) continue;
		const current = select();
		if (!sameSelection(selected, current)) continue;
		const matchedRows = new Set(matchingHits(current, pages).slice(0, limit).map(({ row }) => row));
		projection.setArchivePageSize(matchedRows.size);
		if (await withReadySessionRows(projection, () => [...matchedRows].map((row) => ({
			agentId: row.agentId,
			key: row.key,
			storePath: row.storeTarget.storePath
		})), (read) => {
			if (getSessionRowProjection(params.context) !== projection) throw new Error("Session search owner changed while reading; retry the request");
			if (searchIdentities && searchIdentities.cfg !== projection.state.cfg) return false;
			const refreshed = select();
			if (!sameSelection(selected, refreshed)) return false;
			const hits = matchingHits(refreshed, pages);
			const matches = hits.slice(0, limit);
			const sessions = [...new Set(matches.map((match) => match.row))].flatMap((target) => {
				const record = read.describe({
					...target,
					storePath: target.storeTarget.storePath
				});
				const row = record && refreshed.presentation.present(record);
				return row ? [row] : [];
			});
			const archivedTranscriptsExcluded = pages.reduce((count, { page }) => count + (page.archivedTranscriptsExcluded ?? 0), 0);
			params.onResult({
				results: matches.map((match) => match.hit),
				sessions,
				...pages.some(({ page }) => page.indexing) ? { indexing: true } : {},
				...archivedTranscriptsExcluded ? { archivedTranscriptsExcluded } : {},
				...hits.length > limit || pages.some(({ page }) => page.truncated) ? { truncated: true } : {}
			});
			return true;
		}, { selection: true })) return;
	}
	throw new Error("Session search scope changed while reading; retry the request");
}
//#endregion
//#region src/gateway/server-methods/sessions-search-scope.ts
function resolveSessionSearchScope(cfg, params) {
	const normalizedRequest = params.agentId === void 0 ? null : normalizeAgentIdStrict(params.agentId);
	if (normalizedRequest && !normalizedRequest.ok) return invalidSessionRequest(`Unknown agent id "${params.agentId}"`);
	const requestedAgentId = normalizedRequest?.value;
	const sessionKeys = params.sessionKeys ? [] : void 0;
	const agentIds = /* @__PURE__ */ new Set();
	const rosterAgentIds = new Set(listAgentIds(cfg));
	for (const sessionKey of params.sessionKeys ?? []) {
		const acpOwnerAgentId = parseAgentSessionKey(sessionKey) && isAcpSessionKey(sessionKey) ? resolveSessionStoreAgentId(cfg, sessionKey) : void 0;
		const configuredAcpOwner = Boolean(requestedAgentId && !rosterAgentIds.has(requestedAgentId) && isConfiguredSessionStoreAgentId(cfg, requestedAgentId) && acpOwnerAgentId === requestedAgentId && resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey).kind === "none");
		const requestedAgent = requestedAgentId && configuredAcpOwner ? {
			ok: true,
			agentId: requestedAgentId
		} : requestedAgentId && !isConfiguredSessionStoreAgentId(cfg, requestedAgentId) && resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey).kind === "none" ? {
			ok: true,
			agentId: requestedAgentId
		} : resolveRequestedSessionAgentId(cfg, sessionKey, requestedAgentId);
		if (!requestedAgent.ok) return requestedAgent;
		sessionKeys?.push(resolveStoredSessionKeyForAgentStore({
			cfg,
			agentId: requestedAgent.agentId,
			sessionKey
		}));
		agentIds.add(requestedAgent.agentId);
	}
	if (agentIds.size > 1 || requestedAgentId && [...agentIds].some((agentId) => agentId !== requestedAgentId)) return invalidSessionRequest("sessions.search supports one agent per call");
	let agentId = requestedAgentId ?? agentIds.values().next().value;
	if (!agentId) {
		const fallbackAgent = resolveRequestedSessionAgentId(cfg, "main");
		if (!fallbackAgent.ok) return fallbackAgent;
		agentId = fallbackAgent.agentId;
	}
	return {
		ok: true,
		agentId,
		configured: isConfiguredSessionStoreAgentId(cfg, agentId),
		requestedAgentId,
		sessionKeys
	};
}
//#endregion
//#region src/gateway/server-methods/sessions-read.ts
const sessionReadHandlers = {
	"sessions.search": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsSearchParams, "sessions.search", respond)) return;
		const query = params.query.trim();
		if (!query) {
			respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "query must not be empty"));
			return;
		}
		if (params.scope !== void 0) {
			try {
				await searchProjectedSessionTranscripts({
					query,
					limit: params.limit,
					scope: params.scope,
					context,
					client: client ?? null,
					onResult: (result) => {
						sessionMutationAuthorization?.assertCurrent();
						respond(true, result);
					}
				});
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				respond(false, void 0, errorShapeFromError(ErrorCodes.UNAVAILABLE, error, { message: formatErrorMessage(error) }));
			}
			return;
		}
		const discoveredTargets = /* @__PURE__ */ new Map();
		const prepareSearch = async () => {
			sessionMutationAuthorization?.assertCurrent();
			const cfg = context.getRuntimeConfig();
			const policyConfig = context.getCommittedRuntimeConfig?.() ?? cfg;
			const scope = resolveSessionSearchScope(cfg, params);
			if (!scope.ok) {
				respond(false, void 0, scope.error);
				return;
			}
			const { agentId, configured, requestedAgentId, sessionKeys } = scope;
			const restrictIncognito = Boolean(gatewayClientSessionCreator(client)) && !isGatewayAdmin(client);
			const roleVisibilityFilter = hasOperatorBoundary(client, policyConfig) ? createSessionListEntryFilter({
				client,
				cfg: policyConfig
			}) : void 0;
			const restrictVisibility = restrictIncognito || Boolean(roleVisibilityFilter);
			const canSearchSessionKey = (sessionKey, entry) => {
				if (isIncognitoSessionKey(sessionKey) && authorizeIncognitoSessionTarget({
					client: client ?? null,
					sessionKey,
					target: null
				}) !== null) return false;
				if (!roleVisibilityFilter) return true;
				return Boolean(entry && roleVisibilityFilter(sessionKey, entry));
			};
			if (requestedAgentId && !params.sessionKeys && configured) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId requires sessionKeys"));
				return;
			}
			const scopedSessionKeys = configured ? sessionKeys : sessionKeys?.filter((sessionKey) => {
				return (requestedAgentId && (sessionKey === "global" || sessionKey === "unknown") ? requestedAgentId : resolveSessionStoreAgentId(cfg, sessionKey)) === agentId;
			});
			const discoveryKey = JSON.stringify([agentId, cfg.session?.store]);
			let discovery = discoveredTargets.get(discoveryKey);
			if (!configured && !discovery) {
				discovery = resolveExistingAgentSessionStoreTargetsAsync(cfg, agentId);
				discoveredTargets.set(discoveryKey, discovery);
			}
			const searchTargets = configured ? [{
				agentId,
				storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId })
			}] : await discovery;
			if (!configured && (searchTargets.length === 0 || scopedSessionKeys?.length === 0)) {
				respond(true, { results: [] }, void 0);
				return;
			}
			const entriesByTarget = restrictVisibility ? await Promise.all(searchTargets.map(async (target) => scopedSessionKeys ? (await readSessionEntriesFromStoreInWorker({
				...target,
				sessionKeys: scopedSessionKeys,
				projection: "list"
			})).entries : readSessionEntrySummariesInWorker(target))) : void 0;
			const entries = /* @__PURE__ */ new Map();
			if (roleVisibilityFilter) for (const rows of entriesByTarget ?? []) for (const { sessionKey, entry } of rows) {
				const parsed = parseAgentSessionKey(sessionKey);
				if (isIncognitoSessionKey(sessionKey) || parsed && normalizeAgentId(parsed.agentId) !== agentId) continue;
				if (entries.has(sessionKey)) throw canonicalSessionKeyMigrationRequiredError(`duplicate rows resolve to canonical session key ${sessionKey}`);
				entries.set(sessionKey, entry);
			}
			return searchTargets.flatMap((target, index) => {
				const targetSessionKeys = (scopedSessionKeys ?? entriesByTarget?.[index]?.map(({ sessionKey }) => sessionKey))?.filter((sessionKey) => {
					const parsed = parseAgentSessionKey(sessionKey);
					return (!parsed || normalizeAgentId(parsed.agentId) === agentId) && canSearchSessionKey(sessionKey, entries.get(sessionKey));
				});
				if (targetSessionKeys?.length === 0) return [];
				return [{
					...target,
					query,
					limit: configured ? params.limit : 25,
					...targetSessionKeys ? { sessionKeys: targetSessionKeys } : {}
				}];
			});
		};
		try {
			for (let attempt = 0; attempt < 2; attempt++) {
				const requests = await prepareSearch();
				if (!requests) return;
				const targetResults = await Promise.all(requests.map((request) => searchSessionTranscripts(request)));
				const current = await prepareSearch();
				if (!current) return;
				if (JSON.stringify(current) !== JSON.stringify(requests)) continue;
				const archivedTranscriptsExcluded = targetResults.reduce((count, result) => count + (result.archivedTranscriptsExcluded ?? 0), 0);
				const limit = params.limit ?? 10;
				const sortedHits = targetResults.flatMap((result) => result.hits).toSorted((left, right) => right.score - left.score || right.timestamp - left.timestamp || left.messageId.localeCompare(right.messageId));
				const seenHits = /* @__PURE__ */ new Set();
				const hits = sortedHits.filter((hit) => {
					const identity = `${hit.sessionKey}\u0000${hit.sessionId}\u0000${hit.messageId}`;
					if (seenHits.has(identity)) return false;
					seenHits.add(identity);
					return true;
				});
				sessionMutationAuthorization?.assertCurrent();
				respond(true, {
					results: hits.slice(0, limit),
					...archivedTranscriptsExcluded ? { archivedTranscriptsExcluded } : {},
					...targetResults.some((result) => result.indexing) ? { indexing: true } : {},
					...targetResults.some((result) => result.truncated) || hits.length > limit ? { truncated: true } : {}
				});
				return;
			}
			throw new Error("Session search scope changed while reading; retry the request");
		} catch (error) {
			if (error instanceof SessionMutationAuthorizationChangedError) throw error;
			respond(false, void 0, errorShapeFromError(ErrorCodes.UNAVAILABLE, error, { message: formatErrorMessage(error) }));
		}
	},
	"sessions.list": createPreparedReadHandler((args) => {
		const { params, client, context } = args;
		const diagnostics = startSessionListDiagnostics(args.respond, args.req.method === "sessions.subscribe" ? "sessions.subscribe" : "sessions.list", params);
		const respondToCaller = diagnostics?.respond ?? args.respond;
		try {
			if (!assertValidParams(params, validateSessionsListParams, "sessions.list", respondToCaller)) {
				diagnostics?.finish("returned");
				return;
			}
			const projection = requireSessionRowProjection(context);
			const assertCurrent = () => args.sessionMutationAuthorization?.assertCurrent();
			return {
				respond: respondToCaller,
				assertCurrent,
				beforeRespond: () => {
					if (client?.connId) context.forgetConnectionAncestors(client.connId);
				},
				release: (outcome) => diagnostics?.finish(outcome),
				run: async (respond) => {
					await listProjectedSessions({
						projection,
						opts: params,
						context,
						client,
						acceptsSerializedJson: args.acceptsSerializedJson,
						diagnostics,
						onResult: (result) => {
							assertCurrent();
							respond(true, result);
						}
					});
				}
			};
		} catch (error) {
			diagnostics?.finish("threw");
			throw error;
		}
	}),
	"sessions.preview": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsPreviewParams, "sessions.preview", respond)) return;
		const keys = params.keys.map((key) => normalizeOptionalString(key)).filter((key) => Boolean(key)).slice(0, 64);
		const limit = params.limit ?? 12;
		const maxChars = params.maxChars ?? 240;
		if (keys.length === 0) {
			respond(true, {
				ts: Date.now(),
				previews: []
			}, void 0);
			return;
		}
		const projection = requireSessionRowProjection(context);
		const withPreviewRows = (requestedKeys, consume) => withReadySessionRows(projection, (cfg) => requestedKeys.flatMap((key) => {
			const agent = resolveRequestedSessionAgentId(cfg, key);
			return agent.ok ? [{
				key,
				agentId: agent.agentId
			}] : [];
		}), consume);
		const previews = [];
		const buffered = [];
		for (const key of keys) {
			if (previews.length > 0) await setImmediate();
			const requestedAgent = resolveRequestedSessionAgentId(context.getRuntimeConfig(), key);
			if (!requestedAgent.ok) {
				respond(false, void 0, requestedAgent.error);
				return;
			}
			const preview = {
				key,
				status: "missing",
				items: []
			};
			previews.push(preview);
			try {
				const record = await withPreviewRows([key], (read) => {
					sessionMutationAuthorization?.assertCurrent();
					const { cfg, policyConfig } = read.state;
					const currentAgent = resolveRequestedSessionAgentId(cfg, key);
					if (!currentAgent.ok) return;
					const current = read.describe({
						key,
						agentId: currentAgent.agentId
					});
					const visibilityFilter = hasOperatorBoundary(client, policyConfig) ? createSessionListEntryFilter({
						client,
						cfg: policyConfig
					}) : void 0;
					return current?.entry.sessionId && visibilityFilter?.(current.key, current.entry) !== false ? current : void 0;
				});
				if (!record) continue;
				buffered.push({
					preview,
					record,
					generation: record.generation,
					sessionId: record.entry.sessionId,
					lifecycleRevision: record.entry.lifecycleRevision
				});
				preview.items = await readSessionPreviewItemsFromTranscriptAsync({
					agentId: record.agentId,
					sessionEntry: record.entry,
					sessionId: record.entry.sessionId,
					sessionKey: record.key,
					storePath: record.storeTarget.storePath
				}, limit, maxChars);
				preview.status = preview.items.length > 0 ? "ok" : "empty";
			} catch (error) {
				if (error instanceof SessionMutationAuthorizationChangedError) throw error;
				preview.status = error instanceof SessionTranscriptColdError ? "cold" : "error";
			}
		}
		await withPreviewRows(buffered.map(({ preview }) => preview.key), (read) => {
			sessionMutationAuthorization?.assertCurrent();
			const { cfg, policyConfig } = read.state;
			const visibilityFilter = hasOperatorBoundary(client, policyConfig) ? createSessionListEntryFilter({
				client,
				cfg: policyConfig
			}) : void 0;
			for (const previous of buffered) {
				const agent = resolveRequestedSessionAgentId(cfg, previous.preview.key);
				const current = agent.ok ? read.describe({
					key: previous.preview.key,
					agentId: agent.agentId
				}, previous.record) : void 0;
				if (!current || current.agentId !== previous.record.agentId || current.key !== previous.record.key || current.storeTarget.storePath !== previous.record.storeTarget.storePath || current.generation !== previous.generation || current.entry.sessionId !== previous.sessionId || current.entry.lifecycleRevision !== previous.lifecycleRevision || visibilityFilter?.(current.key, current.entry) === false) {
					previous.preview.status = "missing";
					previous.preview.items = [];
				}
			}
			respond(true, {
				ts: Date.now(),
				previews
			}, void 0);
		});
	},
	"sessions.resolve": async ({ params, respond, context, client, sessionMutationAuthorization }) => {
		if (!assertValidParams(params, validateSessionsResolveParams, "sessions.resolve", respond)) return;
		const projection = requireSessionRowProjection(context);
		await withPreparedSessionResolve({
			projection,
			client,
			p: params,
			isCurrent: () => getSessionRowProjection(context) === projection
		}, (resolved) => {
			sessionMutationAuthorization?.assertCurrent();
			if (!resolved.ok) {
				respond(false, void 0, resolved.error);
				return;
			}
			if ("missing" in resolved) {
				respond(true, { ok: false }, void 0);
				return;
			}
			if ("ambiguous" in resolved) {
				respond(true, {
					ok: false,
					candidates: resolved.candidates
				}, void 0);
				return;
			}
			respond(true, resolved, void 0);
		});
	},
	...sessionByKeyReadHandlers,
	...sessionMaintenanceHandlers
};
const sessionsListHandler = sessionReadHandlers["sessions.list"];
//#endregion
export { sessionsListHandler as n, sessionReadHandlers as t };
