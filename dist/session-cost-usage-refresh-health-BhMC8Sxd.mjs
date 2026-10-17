import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
import { a as isPidAlive } from "./pid-alive-CPS_shDt.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import { _ as isOpenClawAgentDatabasePathCurrent } from "./openclaw-agent-db-validation-cache-_HDeZNQr.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { n as createSqliteWorkerOperationAdmission } from "./sqlite-worker-operation-admission-cNGSH5v0.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-DjPHKieF.mjs";
import "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, i as isIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { y as retainAgentDatabase } from "./openclaw-agent-db-lifecycle-BJiYtXuW.mjs";
import { u as runOpenClawAgentWriteTransaction } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as runOpenClawAgentWorkerWrite } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { t as createCorePluginStateKeyedStore } from "./plugin-state-store-yKq-W0-T.mjs";
import { n as supportsOpenClawAgentDatabaseExecution, t as captureOpenClawAgentDatabaseExecution } from "./openclaw-agent-execution-CaPKglUL.mjs";
import { s as withSessionHistoryWorkerDatabase } from "./session-transcript-worker-runtime-CTwaPfeT.mjs";
import { t as withOpenClawAgentDatabaseWrite } from "./openclaw-agent-db-write-CVe9DulI.mjs";
import { c as writeSessionCostUsageRollupInDatabase, n as deleteSessionCostUsageRefreshLockInDatabase, r as pruneSessionCostUsageRollupsInDatabase, t as acquireSessionCostUsageRefreshLockInDatabase } from "./session-cost-usage-cache.kernel-B9i4w4X5.mjs";
//#region src/infra/session-cost-usage-cache.sqlite.ts
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
function createCacheWriter(options) {
	const execution = supportsOpenClawAgentDatabaseExecution(options) ? captureOpenClawAgentDatabaseExecution(options) : void 0;
	let identity;
	let database;
	let releaseBorrow;
	let prepared = false;
	return {
		async write(type, input, native, operationLabel, authority, onAdmitted, signal) {
			if (!execution) return withOpenClawAgentDatabaseWrite(options, (opened) => runOpenClawAgentWriteTransaction((current) => {
				if (current !== opened || !isOpenClawAgentDatabasePathCurrent(current)) throw new Error("Usage cache database changed before write admission");
				authority?.(current);
				signal?.throwIfAborted();
				database = current;
				releaseBorrow ??= retainAgentDatabase(current.db);
				onAdmitted?.();
				return native(current);
			}, options, { operationLabel }), database?.db, signal);
			const captured = structuredClone(input);
			const cleanup = type === "usageCache.releaseLock";
			const current = cleanup ? captureOpenClawAgentDatabaseExecution(options, { expectedIdentity: identity }) : execution;
			let opening = false;
			const source = {
				assertCurrent() {
					signal?.throwIfAborted();
					identity ??= current.fileIdentity;
					authority?.(void 0, current, opening);
				},
				createAdmission(binding) {
					return () => ({
						nativeLocations: binding.nativeLocations,
						admission: createSqliteWorkerOperationAdmission((request, grant) => {
							binding.authorize(request);
							if (request.stage === "prepare" && isRecord(request.facts) && request.facts.kind === "shared-owner") opening = true;
							if (request.stage === "transaction") onAdmitted?.();
							if (!grant()) throw new Error("Usage cache write authority expired");
						}, binding.attachment)
					});
				}
			};
			try {
				return await runOpenClawAgentWorkerWrite(options, async () => {
					if (!prepared && !cleanup) {
						await current.prepare(source, signal);
						opening = false;
						prepared = true;
					}
					source.assertCurrent();
					const result = await current.runExisting(source, async (worker) => ({ value: await worker.execute({
						type,
						input: captured
					}, { signal }) }));
					if (!result) throw new Error("Usage cache database disappeared before write");
					return result.value;
				}, void 0, signal);
			} finally {
				if (cleanup) await current.release();
			}
		},
		async close() {
			await execution?.release();
			releaseBorrow?.();
			releaseBorrow = void 0;
		}
	};
}
async function readCacheDatabase(options, request) {
	if (isIncognitoOpenClawAgentSqlitePath(options.path, options)) {
		const { readSessionCostUsageCache } = await import("./session-cost-usage-cache-read-cifcG34S.mjs");
		return readSessionCostUsageCache(options, request);
	}
	return withSessionHistoryWorkerDatabase(options, (owner) => owner.readUsageCache({
		request,
		env: {
			...options.env,
			OPENCLAW_STATE_DIR: options.env.OPENCLAW_STATE_DIR
		}
	}));
}
async function readRefreshLock(options) {
	const result = await readCacheDatabase(options, { kind: "usage-refresh-lock" });
	if (result.kind !== "usage-refresh-lock") throw new Error("Invalid usage refresh-lock worker result");
	return result.value;
}
async function deleteSessionCostUsageRollupsExcept(params) {
	const existing = params.rows.filter((row) => !params.liveKeys.has(row.key));
	const writer = createCacheWriter(captureCacheDatabaseOptions({
		agentId: normalizeAgentId(params.agentId),
		env: params.env,
		...params.databasePath ? { path: params.databasePath } : {}
	}));
	try {
		await writer.write("usageCache.prune", existing, (database) => pruneSessionCostUsageRollupsInDatabase(database.db, existing), "session-cost-usage.rollup.prune");
	} finally {
		await writer.close();
	}
}
function parseRefreshLock(raw) {
	const value = safeParseJsonRecord(raw ?? "");
	if (!value || typeof value.pid !== "number" || !Number.isInteger(value.pid) || value.pid <= 0 || typeof value.startedAt !== "number" || !Number.isFinite(value.startedAt) || typeof value.ownerNonce !== "string" || !value.ownerNonce) return null;
	return {
		pid: value.pid,
		startedAt: value.startedAt,
		ownerNonce: value.ownerNonce
	};
}
async function isSessionCostUsageRefreshRunning(agentId, databasePath) {
	const lock = parseRefreshLock(await readRefreshLock(captureCacheDatabaseOptions({
		agentId: normalizeAgentId(agentId),
		path: databasePath
	})));
	return lock !== null && isPidAlive(lock.pid);
}
function prepareSessionCostUsageRefreshLock(agentId, databasePath, owner) {
	const options = captureCacheDatabaseOptions({
		agentId: normalizeAgentId(agentId),
		path: databasePath,
		env: owner?.env
	});
	const lock = {
		pid: process.pid,
		startedAt: Date.now(),
		ownerNonce: `${process.pid}:${Date.now()}:${process.hrtime.bigint()}`
	};
	const lockJson = JSON.stringify(lock);
	const writer = createCacheWriter(options);
	let acquiring;
	let releasing;
	let closed = false;
	let acquired = false;
	let mayOwnLock = false;
	const assertCurrent = (current, execution, opening) => {
		if (closed || !acquired) throw new Error("Usage cache refresh owner is closed");
		owner?.assertCurrent?.(current, execution, opening);
	};
	const release = () => {
		closed = true;
		releasing ??= (async () => {
			await acquiring?.catch(() => void 0);
			if (mayOwnLock) {
				await writer.write("usageCache.releaseLock", lockJson, (current) => deleteSessionCostUsageRefreshLockInDatabase(current.db, lockJson), "session-cost-usage.refresh-lock.delete");
				mayOwnLock = false;
			}
			await writer.close();
		})().catch((error) => {
			releasing = void 0;
			throw error;
		});
		return releasing;
	};
	return {
		acquire() {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("Usage cache refresh owner is closed"));
			acquiring ??= (async () => {
				owner?.assertCurrent?.();
				const previousRaw = await readRefreshLock(options);
				const previousLock = parseRefreshLock(previousRaw);
				const input = {
					previousRaw,
					previousOwnerIsRunning: previousLock ? isPidAlive(previousLock.pid) : false,
					lockJson,
					startedAt: lock.startedAt
				};
				acquired = await writer.write("usageCache.acquireLock", input, (current) => acquireSessionCostUsageRefreshLockInDatabase(current.db, input), "session-cost-usage.refresh-lock.acquire", (current, execution, opening) => {
					if (closed) throw new Error("Usage cache refresh owner is closed");
					owner?.assertCurrent?.(current, execution, opening);
				}, () => {
					mayOwnLock = true;
				});
				mayOwnLock = acquired;
				return acquired;
			})();
			return acquiring;
		},
		release,
		writeRollup(params, signal) {
			assertCurrent();
			return writer.write("usageCache.writeRollup", params, (current) => writeSessionCostUsageRollupInDatabase(current.db, params), "session-cost-usage.rollup.write", assertCurrent, void 0, signal);
		},
		pruneRows(rows, signal) {
			assertCurrent();
			return writer.write("usageCache.prune", rows, (current) => pruneSessionCostUsageRollupsInDatabase(current.db, rows), "session-cost-usage.rollup.prune", assertCurrent, void 0, signal);
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
export { prepareSessionCostUsageRefreshLock as i, deleteSessionCostUsageRollupsExcept as n, isSessionCostUsageRefreshRunning as r, openUsageCostRefreshFailures as t };
