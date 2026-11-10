import { r as getAsyncWorkSignal } from "./async-work-scope-BH2yUdBz.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { f as readDatabasePathIdentitySync, p as resolveDatabasePathKey } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-puNZKEvP.mjs";
import "./session-key-CSDERtm3.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import "./openclaw-agent-db-_fC-kf1x.mjs";
import { a as encodeUsageCostRollup, i as decodeUsageCostRollupEnvelope, o as isUsageCostRollupFresh, r as decodeUsageCostRollup } from "./session-cost-usage-rollup-codec-BkTlisOD.mjs";
import { n as parseSqliteSessionFileMarker, t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { r as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-BMcCyPIg.mjs";
import { t as readSessionActorStorageResult } from "./session-actor-storage-result-BfP7PrnB.mjs";
import { t as createCorePluginStateKeyedStore } from "./plugin-state-store-DY4rDlss.mjs";
import { c as projectCostUsageSummary, l as projectSessionCostSummaries, n as scanMemoryUsageCostRollup } from "./session-cost-usage-rollup-scan-C-xPJUWE.mjs";
//#region src/infra/session-cost-usage-memory.ts
const refreshes = /* @__PURE__ */ new Set();
function refreshKey(binding) {
	return JSON.stringify([binding.agentId, binding.path]);
}
function isSessionActorUsageRefreshRunning(binding) {
	return refreshes.has(refreshKey(binding));
}
function transcriptFile(binding, instance) {
	const filePath = formatSqliteSessionFileMarker({
		agentId: binding.agentId,
		storePath: binding.path,
		sessionId: instance.sessionId
	});
	return {
		kind: "sqlite",
		filePath,
		sourcePath: filePath,
		sessionId: instance.sessionId,
		mtimeMs: instance.stats.lastMutationAtMs ?? 0,
		size: instance.stats.sizeBytes,
		eventCount: instance.stats.eventCount,
		maxSeq: instance.stats.maxSeq
	};
}
/** Selected memory acquisition bypasses the database worker and its host SQL requests completely. */
async function runSessionActorUsage(binding, operation, resolveCost) {
	if ("actor" in binding) return runCapturedSessionActorUsage(binding, operation, resolveCost);
	const selected = binding.binding?.agentId === binding.agentId && binding.binding.path === binding.path ? binding.binding : void 0;
	const sessionKey = selected?.actor.target.sessionKey ?? binding.owner?.listSessions(binding.authority)[0]?.target.sessionKey;
	const lifetime = {
		assertCurrent: () => binding.authority.assertCurrent(),
		assertReadable: () => binding.authority.assertCurrent()
	};
	const actor = sessionKey ? binding.owner ? await binding.owner.acquireExisting(sessionKey, lifetime) : await selected?.actor.storage.acquire(sessionKey, lifetime) : void 0;
	try {
		return await runCapturedSessionActorUsage({
			...binding,
			actor
		}, operation, resolveCost);
	} finally {
		await actor?.release();
	}
}
async function runCapturedSessionActorUsage(binding, operation, resolveCost) {
	const refresh = operation.kind === "refresh";
	const key = refreshKey(binding);
	if (refresh && refreshes.has(key)) return { kind: "busy" };
	if (refresh) refreshes.add(key);
	try {
		const requested = operation.kind === "sessions" ? operation.sessions.map((entry) => entry.sessionFile) : operation.kind === "summary" ? void 0 : operation.sessionFiles;
		const requestedSessionId = (file) => {
			const marker = parseSqliteSessionFileMarker(file);
			if (!marker || marker.agentId !== binding.agentId || marker.storePath !== binding.path) throw new Error("Usage request belongs to another session owner");
			return marker.sessionId;
		};
		const ids = requested?.map(requestedSessionId);
		const metadataLimit = Math.min(ids ? new Set(ids).size : 2e4, 2e4);
		const reportBudget = operation.kind === "summary" || operation.kind === "sessions" ? {
			remainingBytes: (operation.kind === "sessions" ? operation.reportBudgetBytes ?? 33554432 : 33554432) - metadataLimit * 256,
			metadataLimit,
			pricingFingerprint: operation.pricingFingerprint
		} : void 0;
		if (operation.kind === "refresh") operation.rebuildRows?.forEach((row) => requestedSessionId(row.key));
		const instances = binding.actor ? await binding.actor.storage.read({
			type: "session.usage.snapshot",
			input: {
				includeEvents: refresh,
				includeRollupBodies: operation.kind === "summary" || operation.kind === "sessions",
				...reportBudget ? { reportBudget } : {},
				...ids ? { sessionIds: ids } : {}
			}
		}, binding.authority) : [];
		const files = new Map(instances.map((instance) => {
			const file = transcriptFile(binding, instance);
			return [file.filePath, {
				file,
				instance
			}];
		}));
		const selectedFiles = requested?.map((file) => files.get(file)?.file);
		if (operation.kind === "inventory") return {
			kind: "inventory",
			files: (selectedFiles ?? [...files.values()].map(({ file }) => file)).filter((file) => file !== void 0 && (operation.minMtimeMs === void 0 || file.mtimeMs >= operation.minMtimeMs)).map(({ kind, sourcePath, sessionId, mtimeMs }) => ({
				kind,
				sourcePath,
				sessionId,
				mtimeMs
			}))
		};
		const rows = /* @__PURE__ */ new Map();
		const deferredPaths = /* @__PURE__ */ new Set();
		const deferredMetadata = /* @__PURE__ */ new Map();
		for (const [filePath, { instance }] of files) {
			if (instance.rollup) {
				rows.set(filePath, {
					key: filePath,
					valueJson: instance.rollup.valueJson,
					updatedAt: instance.rollup.updatedAt,
					...instance.rollup.bodyBytes === void 0 ? {} : { bodyBytes: instance.rollup.bodyBytes }
				});
				if (reportBudget) reportBudget.remainingBytes -= 2 * instance.rollup.valueJson.length + (instance.rollup.blob?.byteLength ?? 0);
			}
			if (instance.rollupDeferred) deferredPaths.add(filePath);
			if (instance.deferredRollupMetadata) deferredMetadata.set(filePath, instance.deferredRollupMetadata);
		}
		if (operation.kind === "summary" || operation.kind === "sessions") {
			const decodeBudget = { remainingBytes: reportBudget?.remainingBytes ?? 0 };
			const consumed = /* @__PURE__ */ new Set();
			const invalidRows = /* @__PURE__ */ new Map();
			const source = {
				deferredPaths,
				deferredMetadata,
				readRow(filePath) {
					consumed.add(filePath);
					return rows.get(filePath);
				},
				readBody(row) {
					return files.get(row.key)?.instance.rollup?.blob ?? null;
				},
				async readEntry(row) {
					getAsyncWorkSignal()?.throwIfAborted();
					return decodeUsageCostRollup(row.valueJson, operation.pricingFingerprint, files.get(row.key)?.instance.rollup?.blob ?? null, decodeBudget);
				},
				onInvalidBody(filePath) {
					const row = rows.get(filePath);
					if (row) invalidRows.set(filePath, row);
				},
				remainingRows: (function* () {
					for (const row of rows.values()) if (!consumed.has(row.key)) yield row;
				})()
			};
			const result = operation.kind === "summary" ? {
				kind: "summary",
				summary: await projectCostUsageSummary({
					...source,
					...operation,
					files: [...files.values()].map(({ file }) => file)
				})
			} : {
				kind: "sessions",
				...await projectSessionCostSummaries({
					...source,
					...operation,
					files: selectedFiles ?? []
				}),
				remainingReportBytes: Math.max(0, decodeBudget.remainingBytes)
			};
			binding.actor?.snapshot(binding.authority);
			return {
				...result,
				invalidRows: [...invalidRows.values()]
			};
		}
		if (!binding.actor) return {
			kind: "refresh",
			changed: false
		};
		if (selectedFiles?.some((file) => !file)) throw new Error("A requested usage transcript is unavailable");
		const rebuild = new Set(operation.rebuildRows?.map((row) => row.key));
		const selected = requested && new Set(requested);
		const stale = [...files.values()].filter(({ file }) => {
			if (selected?.size ? !selected.has(file.filePath) : operation.startMs !== void 0 && file.mtimeMs < operation.startMs) return false;
			const row = rows.get(file.filePath);
			if (row && Buffer.byteLength(row.valueJson) > 65536) return true;
			const envelope = row && decodeUsageCostRollupEnvelope(row.valueJson, operation.pricingFingerprint);
			return rebuild.has(file.filePath) || row?.bodyBytes !== void 0 && envelope?.body.storedBytes !== row.bodyBytes || !isUsageCostRollupFresh({
				file,
				checkpoint: envelope?.checkpoint
			});
		}).toSorted((a, b) => a.file.size - b.file.size || a.file.filePath.localeCompare(b.file.filePath));
		const limit = operation.maxFiles && Number.isFinite(operation.maxFiles) && operation.maxFiles > 0 ? Math.floor(operation.maxFiles) : void 0;
		let changed = false;
		for (const { file, instance } of stale.slice(0, limit)) {
			getAsyncWorkSignal()?.throwIfAborted();
			const entry = await scanMemoryUsageCostRollup({
				file,
				events: instance.events ?? [],
				pricingFingerprint: operation.pricingFingerprint,
				resolveCosts: async (pairs) => pairs.map(resolveCost)
			});
			const encoded = encodeUsageCostRollup(entry);
			const outcome = await binding.actor.storage.mutate({
				type: "session.usage.write",
				input: {
					sessionId: instance.sessionId,
					rollup: {
						...encoded,
						updatedAt: entry.scannedAt
					}
				}
			}, binding.authority);
			const saved = readSessionActorStorageResult(outcome);
			changed ||= saved;
		}
		if (!limit || stale.length <= limit) return {
			kind: "refresh",
			changed
		};
		return {
			kind: "refresh",
			changed,
			remainingFiles: stale.slice(limit).map(({ file }) => ({
				sessionFile: file.sourcePath,
				rollupId: file.filePath
			}))
		};
	} finally {
		if (refresh) refreshes.delete(key);
	}
}
//#endregion
//#region src/infra/session-cost-usage-cache.sqlite.ts
const activeRefreshes = /* @__PURE__ */ new Set();
function captureCacheDatabaseOptions(inputOptions) {
	const options = {
		...inputOptions,
		env: cloneEnvWithPlatformSemantics(inputOptions.env ?? process.env)
	};
	options.env.OPENCLAW_STATE_DIR = resolveStateDir(options.env);
	return {
		...options,
		path: resolveOpenClawAgentSqlitePath(options)
	};
}
function createCacheWriteSource(authority, signal) {
	return {
		assertCurrent() {
			signal?.throwIfAborted();
			authority?.();
		},
		createAdmission(binding) {
			return () => ({
				nativeLocations: binding.nativeLocations,
				admission: createSqliteWorkerOperationAdmission((request, grant) => {
					binding.authorize(request);
					if (!grant()) throw new Error("Usage cache write authority expired");
				}, binding.attachment)
			});
		}
	};
}
function createCacheWriter(options) {
	const observed = readDatabasePathIdentitySync(options.path);
	const expectedIdentity = observed.key.startsWith("file:") ? {
		kind: "file",
		physicalIdentity: observed.key.slice(5),
		birthtime: observed.birthtime,
		nativeLocation: observed.canonicalPath
	} : void 0;
	let execution = observed.key.startsWith("path:") ? captureOpenClawAgentDatabaseExecution(options, { expectedCreationIdentity: observed }) : void 0;
	let prepared = false;
	return {
		async prepareExisting(authority, signal) {
			if (!observed.key.startsWith("file:")) return;
			const source = createCacheWriteSource(authority, signal);
			await runOpenClawAgentWorkerWrite(options, async () => {
				source.assertCurrent();
				execution ??= captureOpenClawAgentDatabaseExecution(options, { expectedIdentity });
				if (!prepared) {
					await execution.prepare(source, signal);
					prepared = true;
				}
			}, void 0, signal, "background");
		},
		async write(type, input, authority, signal) {
			const captured = structuredClone(input);
			const source = createCacheWriteSource(authority, signal);
			return runOpenClawAgentWorkerWrite(options, async () => {
				source.assertCurrent();
				execution ??= captureOpenClawAgentDatabaseExecution(options, { expectedIdentity });
				if (!prepared) {
					await execution.prepare(source, signal);
					prepared = true;
				}
				source.assertCurrent();
				const result = await execution.runExisting(source, async (worker) => {
					return { value: await worker.execute({
						type,
						input: captured
					}, { signal }) };
				});
				if (!result) throw new Error("Usage cache database disappeared before write");
				return result.value;
			}, void 0, signal, "background");
		},
		async close() {
			await execution?.release();
		}
	};
}
async function deleteSessionCostUsageRollupsExcept(params) {
	const existing = params.rows.filter((row) => !params.liveKeys.has(row.key));
	const writer = createCacheWriter(captureCacheDatabaseOptions({
		agentId: normalizeAgentId(params.agentId),
		env: params.env,
		...params.databasePath ? { path: params.databasePath } : {}
	}));
	try {
		await writer.write("usageCache.prune", existing);
	} finally {
		await writer.close();
	}
}
async function isSessionCostUsageRefreshRunning(agentId, databasePath) {
	const signal = getAsyncWorkSignal();
	const memory = captureSessionActorStorageOwner({
		agentId,
		storePath: databasePath
	}, {
		assertCurrent: () => signal?.throwIfAborted(),
		authorize() {}
	});
	if (memory) return isSessionActorUsageRefreshRunning(memory);
	const options = captureCacheDatabaseOptions({
		agentId: normalizeAgentId(agentId),
		path: databasePath
	});
	return activeRefreshes.has(resolveDatabasePathKey(options.path));
}
function prepareSessionCostUsageRefreshLock(agentId, databasePath, owner) {
	const options = captureCacheDatabaseOptions({
		agentId: normalizeAgentId(agentId),
		path: databasePath,
		env: owner?.env
	});
	const writer = createCacheWriter(options);
	const refreshKey = resolveDatabasePathKey(options.path);
	let releasing;
	let closed = false;
	let acquired = false;
	const assertCurrent = () => {
		if (closed || !acquired) throw new Error("Usage cache refresh owner is closed");
		owner?.assertCurrent?.();
	};
	const release = () => {
		closed = true;
		releasing ??= writer.close().then(() => {
			if (acquired) {
				activeRefreshes.delete(refreshKey);
				acquired = false;
			}
		}).catch((error) => {
			releasing = void 0;
			throw error;
		});
		return releasing;
	};
	return {
		async acquire() {
			if (closed) throw new Error("Usage cache refresh owner is closed");
			owner?.assertCurrent?.();
			if (!acquired && activeRefreshes.has(refreshKey)) return false;
			activeRefreshes.add(refreshKey);
			acquired = true;
			await writer.prepareExisting(assertCurrent, getAsyncWorkSignal());
			return true;
		},
		release,
		writeRollup(params, signal) {
			assertCurrent();
			return writer.write("usageCache.writeRollup", params, assertCurrent, signal);
		},
		pruneRows(rows, signal) {
			assertCurrent();
			return writer.write("usageCache.prune", rows, assertCurrent, signal);
		}
	};
}
//#endregion
//#region src/infra/session-cost-usage-refresh-health.ts
/** Bounded health facts survive worker/process exits; successful refresh retires each fact. */
function openUsageCostRefreshFailures(env) {
	return createCorePluginStateKeyedStore({
		ownerId: "core:usage-cost-cache",
		namespace: "refresh-failures",
		maxEntries: 256,
		env
	});
}
//#endregion
export { isSessionActorUsageRefreshRunning as a, prepareSessionCostUsageRefreshLock as i, deleteSessionCostUsageRollupsExcept as n, runSessionActorUsage as o, isSessionCostUsageRefreshRunning as r, openUsageCostRefreshFailures as t };
