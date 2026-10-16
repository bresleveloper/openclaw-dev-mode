import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { j as resolveIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { P as runWithDiagnosticTraceContext, k as getActiveDiagnosticTraceContext, t as areDiagnosticsEnabledForProcess } from "./diagnostic-events-BADdmgZf.mjs";
import { n as normalizeAgentId, r as normalizeAgentIdStrict } from "./agent-id-D1-Q6vR4.mjs";
import { n as captureOpenClawStateReadWorkerContext } from "./openclaw-state-worker-context-DRG_I6tz.mjs";
import { D as withAgentRosterFactsBatch } from "./agent-scope-config-CDYpzA0r.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { i as isIncognitoOpenClawAgentSqlitePath, r as createOpenClawAgentDatabasePathMatcher } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { l as resolveSessionStorePathCore, o as resolveSessionArtifactDirectory } from "./paths-dpReqUI8.mjs";
import { S as listConfiguredSessionStoreAgentIds, x as isConfiguredSessionStoreAgentId } from "./openclaw-state-db-D1jWDzK3.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
import { c as prepareOpenClawAgentDatabaseRegistrySnapshotRead } from "./openclaw-agent-db-registry-listing-BmvvQ59E.mjs";
import { g as readOpenIncognitoAgentDatabaseGeneration, u as getOpenIncognitoAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { Zi as validateSessionsListParams, aa as validateSessionsPreviewParams, da as validateSessionsResolveParams, ga as validateSessionsStorageParams, ji as validateSessionsDescribeParams, pa as validateSessionsSearchParams, wi as validateSessionsCleanupParams } from "./src-l2dWvEsN.mjs";
import { t as ErrorCodes } from "./gateway-error-details-DIefe7Zy.mjs";
import { f as errorShape } from "./error-codes-Dh56LniQ.mjs";
import { r as hasOperatorBoundary } from "./operator-role-policy-BqPaarjx.mjs";
import { t as retainOpenClawAgentDatabaseReadOnly } from "./openclaw-agent-db-readonly-C4wDuLrp.mjs";
import { c as withSessionHistoryWorkerDatabases, d as withSessionHistoryWorkerReadCandidates } from "./session-transcript-worker-runtime-EUbUbAQu.mjs";
import { t as SessionTranscriptColdError } from "./session-cold-storage-state-CzcE3h3O.mjs";
import { t as listSessionEntriesReadOnly } from "./session-accessor.sqlite-entry-list.read-jgvuh1fV.mjs";
import { l as resolveExistingAgentSessionStoreTargetsSync } from "./targets-BbcRkdUC.mjs";
import { _ as withSessionEntryReadOnlyScope } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { r as prepareSessionStoreTargetInventory } from "./session-store-target-inventory-Dj6Sq0En.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { c as invalidSessionRequest, n as resolveRequestedSessionAgentId } from "./session-request-agent-Bxi11ET4.mjs";
import { o as resolveStoredSessionKeyForAgentStore, r as resolveSessionStoreAgentId } from "./session-store-key-Ci099tm9.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { n as runSessionsCleanup, o as serializeSessionCleanupResult } from "./cleanup-service-CThkApeP.mjs";
import { t as createStageTimingTracker } from "./stage-timing-BUG4Fnsv.mjs";
import { t as readRecentSessionMessagesWithStatsAsync } from "./session-transcript-readers-CDyCeaj9.mjs";
import { t as SessionMutationAuthorizationChangedError } from "./session-mutation-authorization-error-CCz8QGWh.mjs";
import { i as gatewayClientSessionCreator } from "./gateway-client-identity-DnDs09-7.mjs";
import { i as withReadySessionRows } from "./session-row-prepared-read-eHG52FnK.mjs";
import { r as runSynchronousWork } from "./sort-and-limit-NdojqZsZ.mjs";
import { _ as resolveSessionSharingTarget, c as canAccessIncognitoSession, f as isGatewayAdmin, h as prepareSessionSharingTargets, n as authorizeIncognitoSessionTarget } from "./session-sharing-policy-4QkIpHi4.mjs";
import { n as getSessionRowProjection, r as requireSessionRowProjection } from "./session-row-projection-access-C2RDnj28.mjs";
import { l as createSessionListEntryFilter } from "./session-sharing-target-read-D_4wDbBo.mjs";
import "./session-sharing-t7UPtrZq.mjs";
import { t as createVisibleActiveSessionRunProjector } from "./session-active-runs-6vHANwv_.mjs";
import { r as serializeSessionRow, t as prepareProjectedSessionPresentation } from "./session-row-presentation-CxWwfXbM.mjs";
import { n as registerSerializedJsonArray } from "./serialized-json-B87207AB.mjs";
import { r as projectOperatorModelRead } from "./operator-model-presentation-B_liypCy.mjs";
import { a as prepareSessionSearchIdentityNames, n as listProjectedSessions, o as filterSessionEntries, r as prepareProjectedSessionList } from "./session-utils-list-BdG70nKd.mjs";
import "./session-utils-CwljFiKR.mjs";
import { t as searchSessionTranscripts } from "./session-transcript-search-DZgabJd-.mjs";
import { t as withPreparedSessionResolve } from "./sessions-resolve-u5DoVBS3.mjs";
import { t as readSessionColdStorageInventory } from "./session-cold-storage-inventory-QKXzoVgr.mjs";
import { t as errorShapeFromError } from "./error-shape-Bqp-ECwX.mjs";
import { r as emitSessionsChanged } from "./session-change-event-B7XNN_I7.mjs";
import { n as defineValidatedGatewayHandler, t as assertValidParams } from "./validation-Bu27N0nv.mjs";
import { t as sessionLog } from "./session-log-BRT6fN7h.mjs";
import "./slow-request-diagnostics-D4R2ZRNA.mjs";
import { n as requestGatewaySessionColdStorageMaintenance, t as getSessionColdStorageMaintenanceStatus } from "./session-cold-storage-maintenance-DNOTXSnj.mjs";
import { t as readSessionPreviewItemsFromTranscriptAsync } from "./session-transcript-preview-BUGWxBaV.mjs";
import { o as requireSessionKey } from "./sessions-shared-CHxhVZeL.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { isMainThread, threadId } from "node:worker_threads";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
import { setImmediate } from "node:timers/promises";
//#region src/gateway/server-methods/sessions-list-diagnostics.ts
const sessionListDiagnostics = channel("openclaw.session.list");
function startSessionListDiagnostics(respond, operation) {
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
function withSessionListDiagnostics(handler) {
	return async (args) => {
		const diagnostics = startSessionListDiagnostics(args.respond, args.req.method === "sessions.subscribe" ? "sessions.subscribe" : "sessions.list");
		let outcome = "returned";
		try {
			await handler(diagnostics ? {
				...args,
				respond: diagnostics.respond
			} : args, diagnostics);
		} catch (error) {
			outcome = "threw";
			throw error;
		} finally {
			diagnostics?.finish(outcome);
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
	const nativeGeneration = readOpenIncognitoAgentDatabaseGeneration();
	let hasNativeStores = false;
	const assertSnapshotCurrent = () => {
		context.maintenanceScope?.assertAdmission();
		context.admission.assertCurrent();
		registryRead.assertCurrent();
		if (hasNativeStores && nativeGeneration !== readOpenIncognitoAgentDatabaseGeneration()) throw new Error("Incognito session storage changed while reading its status. Retry the request.");
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
		const stores = inventory.agents.flatMap(({ reads }) => reads.map(({ database, target }) => ({
			...database,
			env,
			storePath: target.storePath,
			native: isIncognitoOpenClawAgentSqlitePath(database.path, {
				agentId: database.agentId,
				env
			})
		})));
		hasNativeStores = stores.some((store) => store.native);
		assertCurrent();
		const retained = /* @__PURE__ */ new Map();
		try {
			for (const store of stores) if (store.native && getOpenIncognitoAgentDatabase(store.agentId, store.path)) retained.set(store.path, retainOpenClawAgentDatabaseReadOnly(store));
			const durable = stores.filter((store) => !store.native);
			return await withSessionHistoryWorkerDatabases(durable, async (owners) => {
				const readers = new Map(durable.map((store, index) => [store.path, owners[index]]));
				const assertStoresCurrent = () => {
					assertCurrent();
					for (const read of retained.values()) if (read.found) read.claim.assertCurrent();
				};
				const results = await Promise.allSettled(stores.map(async ({ agentId, path: databasePath, storePath, native }) => {
					const owner = readers.get(databasePath);
					const read = retained.get(databasePath);
					const counts = native ? readSessionColdStorageInventory(read?.found ? read.database : void 0) : await owner.readColdStorageInventory({ env });
					assertStoresCurrent();
					owner?.assertCurrent();
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
				assertStoresCurrent();
				return results.map((settled) => {
					if (settled.status === "rejected") throw settled.reason;
					return settled.value;
				});
			});
		} finally {
			for (const read of retained.values()) if (read.found) read.claim.release();
		}
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
	"sessions.cleanup": defineValidatedGatewayHandler("sessions.cleanup", validateSessionsCleanupParams, async ({ params, respond, context }) => {
		const { mode, appliedSummaries, failure } = await runSessionsCleanup({
			cfg: context.getRuntimeConfig(),
			opts: {
				agent: params.agent,
				allAgents: params.allAgents,
				enforce: params.enforce,
				activeKey: params.activeKey,
				fixMissing: params.fixMissing,
				fixDmScope: params.fixDmScope
			}
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
		const messages = selected.entry.incognito || isIncognitoSessionKey(selected.key) ? (await readRecentSessionMessagesWithStatsAsync(target, limits)).messages : await (await import("./session-history-worker-runtime-BP7n5Xql.mjs")).readSessionHistoryPageInWorker({
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
	for (const sessionKey of params.sessionKeys ?? []) {
		const requestedAgent = requestedAgentId && !isConfiguredSessionStoreAgentId(cfg, requestedAgentId) && resolvePersistedSessionStoreOwnerForKey(cfg, sessionKey).kind === "none" ? {
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
		const prepareSearch = () => {
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
			const targetDiscoveryCache = /* @__PURE__ */ new Map();
			const canSearchSessionKey = (sessionKey, prepared) => {
				if (isIncognitoSessionKey(sessionKey) && !canAccessIncognitoSession({
					cfg,
					client: client ?? null,
					sessionKey,
					agentId
				})) return false;
				if (!roleVisibilityFilter) return true;
				if (prepared && !prepared.ok) throw prepared.error;
				const target = prepared ? prepared.value : resolveSessionSharingTarget({
					cfg,
					sessionKey,
					agentId,
					targetDiscoveryCache
				});
				return Boolean(target && roleVisibilityFilter(target.storeKey, target.entry));
			};
			if (requestedAgentId && !params.sessionKeys && configured) {
				respond(false, void 0, errorShape(ErrorCodes.INVALID_REQUEST, "agentId requires sessionKeys"));
				return;
			}
			const scopedSessionKeys = (configured ? sessionKeys : sessionKeys?.filter((sessionKey) => {
				return (requestedAgentId && (sessionKey === "global" || sessionKey === "unknown") ? requestedAgentId : resolveSessionStoreAgentId(cfg, sessionKey)) === agentId;
			}))?.filter((sessionKey) => canSearchSessionKey(sessionKey));
			const searchTargets = configured ? [{
				agentId,
				storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId })
			}] : resolveExistingAgentSessionStoreTargetsSync(cfg, agentId);
			if (!configured && (searchTargets.length === 0 || scopedSessionKeys?.length === 0)) {
				respond(true, { results: [] }, void 0);
				return;
			}
			return searchTargets.flatMap((target) => {
				const targetSessionKeys = scopedSessionKeys ?? (restrictVisibility ? withSessionEntryReadOnlyScope(target, () => {
					const keys = listSessionEntriesReadOnly({
						agentId: target.agentId,
						storePath: target.storePath,
						projection: "list",
						clone: false
					}).map((entry) => entry.sessionKey).filter((sessionKey) => {
						const parsed = parseAgentSessionKey(sessionKey);
						return !parsed || normalizeAgentId(parsed.agentId) === agentId;
					});
					const prepared = roleVisibilityFilter ? prepareSessionSharingTargets({
						cfg,
						targets: keys.filter((sessionKey) => !isIncognitoSessionKey(sessionKey)).map((sessionKey) => ({
							sessionKey,
							agentId
						}))
					}) : [];
					let ordinal = 0;
					return keys.filter((sessionKey) => {
						const sharing = roleVisibilityFilter && !isIncognitoSessionKey(sessionKey) ? prepared[ordinal++] : void 0;
						return canSearchSessionKey(sessionKey, sharing);
					});
				}) : void 0);
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
				const requests = prepareSearch();
				if (!requests) return;
				const targetResults = await Promise.all(requests.map((request) => searchSessionTranscripts(request)));
				const current = prepareSearch();
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
	"sessions.list": withSessionListDiagnostics(async (args, diagnostics) => {
		const { params, respond, client, context } = args;
		if (!assertValidParams(params, validateSessionsListParams, "sessions.list", respond)) return;
		const projection = requireSessionRowProjection(context);
		await listProjectedSessions({
			projection,
			opts: params,
			context,
			client,
			diagnostics,
			onResult: (result, sharedRows) => {
				args.sessionMutationAuthorization?.assertCurrent();
				if (client?.connId) context.forgetConnectionAncestors(client.connId);
				for (const row of result.sessions) Object.freeze(row);
				registerSerializedJsonArray(Object.freeze(result.sessions), sharedRows.map(serializeSessionRow));
				respond(true, result);
			}
		});
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
