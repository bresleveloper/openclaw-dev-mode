import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-BHJORNly.mjs";
import "./paths-DGIwWbpu.mjs";
import { n as formatErrorMessageWithCode } from "./errors-O33D01XW.mjs";
import { s as withSqliteReaderOwner } from "./sqlite-reader-lifecycle-CYQdd96B.mjs";
import { r as getChildLogger } from "./logger-Mnn26Jj7.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey, l as resolveAgentIdFromSessionKey } from "./session-key-C09ow4h0.mjs";
import { c as resolveOpenClawAgentSqlitePath, s as resolveIncognitoOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-DVbbFaej.mjs";
import { o as resolveSessionArtifactDirectory } from "./paths-dpReqUI8.mjs";
import { w as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./openclaw-state-db-D1jWDzK3.mjs";
import { a as getOpenClawAgentDatabaseIfOpen, f as withOpenClawAgentDatabaseAsync, s as openOpenClawAgentDatabase } from "./openclaw-agent-db-DBug3LUA.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-CKOCIcah.mjs";
import { i as prepareSqliteTargetFromSessionStorePath, o as resolveSqliteTargetFromSessionStorePath } from "./session-sqlite-target-Cnk9g9d0.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-COPKCuIN.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-Bb_svqyv.mjs";
import { i as toDatabaseOptions, n as resolveSqliteAgentId, r as resolveSqliteSessionKey } from "./session-accessor.sqlite-scope-helpers-DOK3pvYX.mjs";
import { isMainThread, threadId } from "node:worker_threads";
import { channel } from "node:diagnostics_channel";
import { performance } from "node:perf_hooks";
//#region src/config/sessions/session-accessor.sqlite-scope.ts
const SQLITE_SESSION_SLOW_WRITE_MS = 1e3;
const SQLITE_SESSION_WRITE_ERROR_MAX_CHARS = 2048;
const sessionWriteDiagnostics = channel("openclaw.session.write");
/** Checks the freshly read identity and lifecycle before a synchronous transcript mutation. */
function transcriptWriteScopeIsCurrent(entry, sessionId, scope) {
	return entry !== void 0 && entry.sessionId === sessionId && (scope.expectedOwner === void 0 || entry.lifecycleRevision === scope.expectedOwner.lifecycleRevision && entry.activeWriterRunId === scope.expectedOwner.activeWriterRunId) && (scope.expectedLifecycleRevision === void 0 || entry.lifecycleRevision === scope.expectedLifecycleRevision) && (scope.expectedWriterRunId === void 0 || entry.activeWriterRunId === scope.expectedWriterRunId);
}
function withSqliteSessionDatabase(options, operation, assertCurrent, diagnostics) {
	assertCurrent?.();
	const startedAt = diagnostics ? performance.now() : 0;
	const finishAdmission = diagnostics ? () => {
		if (diagnostics.admissionMs === void 0) diagnostics.admissionMs = performance.now() - startedAt;
	} : void 0;
	const admittedOperation = finishAdmission ? (database) => {
		finishAdmission();
		return operation(database);
	} : operation;
	try {
		if (getOpenClawAgentDatabaseIfOpen(options)) {
			if (diagnostics) diagnostics.admissionMode = "cached";
			return admittedOperation(openOpenClawAgentDatabase(options));
		}
		if (diagnostics) diagnostics.admissionMode = "async";
		const result = withOpenClawAgentDatabaseAsync(options, admittedOperation, assertCurrent);
		return finishAdmission ? result.finally(finishAdmission) : result;
	} catch (error) {
		finishAdmission?.();
		throw error;
	}
}
function artifactPreparationLogFields(diagnostics) {
	const milliseconds = (value) => value === void 0 ? void 0 : Math.round(value);
	return {
		admissionMode: diagnostics.admissionMode,
		admissionMs: milliseconds(diagnostics.admissionMs),
		nodeInventoryMs: milliseconds(diagnostics.nodeInventoryMs),
		referencePlanningMs: milliseconds(diagnostics.referencePlanningMs),
		orphanPlanningMs: milliseconds(diagnostics.orphanPlanningMs),
		markerScanMs: milliseconds(diagnostics.markerScanMs),
		nodeRows: diagnostics.nodeRows,
		windowRows: diagnostics.windowRows,
		referenceIds: diagnostics.referenceIds,
		selectedEntries: diagnostics.selectedEntries,
		markerWindows: diagnostics.markerWindows,
		markerRows: diagnostics.markerRows,
		deletePlans: diagnostics.deletePlans,
		completed: diagnostics.completed === true
	};
}
async function runExclusiveSqliteSessionWrite(scope, fn, operation, diagnostics, writer = "foreground", signal) {
	const databaseOptions = toDatabaseOptions(scope);
	const timing = {};
	const storePath = resolveOpenClawAgentSqlitePath(databaseOptions);
	const startedAt = performance.now();
	const timingFields = (completedAt) => ({
		pid: process.pid,
		threadId,
		isMainThread,
		operation,
		...diagnostics?.kind ? { reclamationKind: diagnostics.kind } : {},
		...diagnostics?.workerThreadId !== void 0 ? { workerThreadId: diagnostics.workerThreadId } : {},
		...diagnostics?.artifactPreparation ? { artifactPreparation: artifactPreparationLogFields(diagnostics.artifactPreparation) } : {},
		elapsedMs: Math.round(completedAt - startedAt),
		...timing.startedAt !== void 0 && timing.finishedAt !== void 0 ? {
			queueWaitMs: Math.round(timing.startedAt - startedAt),
			writerExecutionMs: Math.round(timing.finishedAt - timing.startedAt),
			completionDelayMs: Math.round(completedAt - timing.finishedAt)
		} : {}
	});
	const logFields = (completedAt) => ({
		agentId: scope.agentId,
		...timingFields(completedAt),
		...diagnostics?.reclamationAdmission ? {
			reclamationAdmissionId: diagnostics.reclamationAdmission.admissionId,
			reclamationAdmissionReleaseCause: diagnostics.reclamationAdmission.releaseCause
		} : {},
		storePath
	});
	let completedAt = startedAt;
	let outcome = "ok";
	const owned = () => withSqliteReaderOwner({
		operation,
		ownerKind: isMainThread ? "main" : "worker",
		actorId: threadId
	}, () => writer === "worker" ? runOpenClawAgentWorkerWrite(databaseOptions, fn, timing, signal) : runOpenClawAgentWriteAdmission(databaseOptions, fn, false, timing, signal));
	try {
		const result = await owned();
		completedAt = performance.now();
		if (completedAt - startedAt >= SQLITE_SESSION_SLOW_WRITE_MS) getChildLogger({ subsystem: "session-sqlite" }).warn("slow SQLite session write", logFields(completedAt));
		return result;
	} catch (error) {
		outcome = "error";
		completedAt = performance.now();
		getChildLogger({ subsystem: "session-sqlite" }).warn("SQLite session write failed", {
			...logFields(completedAt),
			error: truncateUtf16Safe(formatErrorMessageWithCode(error), SQLITE_SESSION_WRITE_ERROR_MAX_CHARS)
		});
		throw error;
	} finally {
		if (sessionWriteDiagnostics.hasSubscribers) sessionWriteDiagnostics.publish({
			...timingFields(completedAt),
			writer,
			outcome
		});
	}
}
function resolveSqliteDatabaseScopeIdentity(scope) {
	const parsedAgentId = parseAgentSessionKey(scope.sessionKey)?.agentId;
	const scopedAgentId = scope.agentId ? normalizeAgentId(scope.agentId) : parsedAgentId;
	const incognitoAgentId = isIncognitoSessionKey(scope.sessionKey) ? resolveAgentIdFromSessionKey(scope.sessionKey) : void 0;
	const effectiveStorePath = incognitoAgentId ? resolveIncognitoOpenClawAgentSqlitePath({
		agentId: incognitoAgentId,
		env: scope.env
	}) : scope.storePath;
	return {
		effectiveAgentId: incognitoAgentId ?? scopedAgentId,
		effectiveStorePath
	};
}
function resolveSqliteDatabaseScope(scope, targetCache, preparedStoreTarget) {
	const { effectiveAgentId, effectiveStorePath } = resolveSqliteDatabaseScopeIdentity(scope);
	const storeTarget = preparedStoreTarget ?? (effectiveStorePath ? resolveCachedSqliteStoreTarget({
		agentId: effectiveAgentId,
		defaultAgentId: scope.defaultAgentId,
		env: scope.env,
		storePath: effectiveStorePath
	}, targetCache) : void 0);
	return {
		agentId: resolveSqliteAgentId({
			scopedAgentId: effectiveAgentId,
			sessionKey: scope.sessionKey,
			storeAgentId: storeTarget?.agentId,
			storeShared: storeTarget?.shared
		}),
		...storeTarget?.shared && storeTarget.agentId ? { databaseAgentId: storeTarget.agentId } : {},
		...scope.env ? { env: scope.env } : {},
		...effectiveStorePath ? { ownerStorePath: effectiveStorePath } : {},
		...storeTarget ? { path: storeTarget.path } : {}
	};
}
function resolveSqliteScope(scope, targetCache, preparedStoreTarget) {
	const { agentId, ...database } = resolveSqliteDatabaseScope(scope, targetCache, preparedStoreTarget);
	if (!agentId) throw new Error("Cannot resolve SQLite session scope without an agent id");
	return {
		agentId,
		...database,
		sessionKey: resolveSqliteSessionKey(scope.sessionKey, agentId)
	};
}
function resolveSqliteReadScope(scope, targetCache, preparedStoreTarget) {
	const sessionKey = scope.sessionKey ? normalizeStoreSessionKey(scope.sessionKey) : void 0;
	const { agentId, ...database } = resolveSqliteDatabaseScope({
		...scope,
		sessionKey
	}, targetCache, preparedStoreTarget);
	if (!agentId) throw new Error("Cannot resolve SQLite transcript read scope without an agent id");
	return {
		agentId,
		...database,
		...sessionKey ? { sessionKey } : {}
	};
}
function resolveCachedSqliteStoreTarget(params, targetCache) {
	const envCache = targetCache && (targetCache.get(params.env) ?? /* @__PURE__ */ new Map());
	if (envCache) targetCache?.set(params.env, envCache);
	const cacheKey = envCache ? JSON.stringify([
		params.storePath,
		params.agentId,
		params.defaultAgentId
	]) : "";
	const cached = envCache?.get(cacheKey);
	if (cached) return cached;
	const resolved = resolveSqliteTargetFromSessionStorePath(params.storePath, {
		agentId: params.agentId,
		defaultAgentId: params.defaultAgentId,
		...params.env ? { env: params.env } : {}
	});
	envCache?.set(cacheKey, resolved);
	return resolved;
}
function resolveSqliteStoreScope(storePath, options = {}) {
	return resolveSqliteScope({
		...options.agentId ? { agentId: options.agentId } : {},
		sessionKey: "",
		storePath
	});
}
function resolveSqliteTranscriptArchiveDirectory(scope) {
	const storePath = scope.ownerStorePath ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope));
	return resolveSessionArtifactDirectory(storePath);
}
/** Validate prepared write identity without resolving or reopening its physical target. */
function assertSqliteTranscriptWriteIdentity(scope) {
	if (typeof scope.sessionId !== "string" || !scope.sessionId) throw new Error(`Cannot resolve SQLite transcript scope without a session id: ${scope.sessionKey}`);
	if (typeof scope.sessionKey !== "string" || !scope.sessionKey) throw new Error(`Cannot resolve SQLite transcript scope without a session key: ${scope.sessionId}`);
}
function resolveSqliteTranscriptScope(scope) {
	assertSqliteTranscriptWriteIdentity(scope);
	return {
		...resolveSqliteScope({
			...scope,
			sessionKey: scope.sessionKey
		}),
		sessionId: scope.sessionId
	};
}
function resolveSqliteTranscriptReadScope(scope, targetCache) {
	return {
		...resolveSqliteReadScope(scope, targetCache),
		sessionId: scope.sessionId
	};
}
/** Prepare file ownership once; the history resource and its kernel consume this same scope. */
async function prepareSqliteTranscriptReadScope(scope, signal) {
	const readScope = {
		...scope,
		sessionKey: scope.sessionKey ? normalizeStoreSessionKey(scope.sessionKey) : void 0
	};
	if (isIncognitoSessionKey(readScope.sessionKey)) return resolveSqliteTranscriptReadScope(readScope);
	return {
		...resolveSqliteReadScope(readScope, void 0, await prepareSqliteScopeTarget(readScope, signal)),
		sessionId: readScope.sessionId
	};
}
/** Exact locators can reserve their FIFO before worker-owned schema-owner discovery. */
function resolveSqliteWriteAdmissionScope(scope) {
	const { effectiveAgentId, effectiveStorePath } = resolveSqliteDatabaseScopeIdentity(scope);
	const target = effectiveStorePath ? resolveUnsuffixedSqliteTargetFromSessionStorePath(effectiveStorePath) : void 0;
	if (target && !target.agentId && !target.shared) return;
	const agentId = effectiveAgentId ?? target?.agentId ?? normalizeAgentId(scope.defaultAgentId);
	return {
		agentId,
		env: scope.env,
		path: target?.path ?? resolveOpenClawAgentSqlitePath({
			agentId,
			env: scope.env
		})
	};
}
/** Writers resolve physical ownership in the existing read worker inside exact-path admission. */
async function prepareSqliteScope(scope) {
	return resolveSqliteScope(scope, void 0, await prepareSqliteScopeTarget(scope));
}
async function prepareSqliteScopeTarget(scope, signal) {
	if (isIncognitoSessionKey(scope.sessionKey)) return;
	const { effectiveAgentId, effectiveStorePath } = resolveSqliteDatabaseScopeIdentity(scope);
	return effectiveStorePath ? await prepareSqliteTargetFromSessionStorePath(effectiveStorePath, {
		agentId: effectiveAgentId,
		defaultAgentId: scope.defaultAgentId,
		env: scope.env
	}, signal) : void 0;
}
/** Pin the environment and database locator before lifecycle work yields. */
function captureLifecycleDatabaseScope(scope) {
	const env = { ...scope.env ?? process.env };
	env.OPENCLAW_STATE_DIR = resolveStateDir(env);
	return {
		...scope,
		env,
		path: resolveOpenClawAgentSqlitePath(toDatabaseOptions({
			...scope,
			env
		}))
	};
}
/** Legacy identity string retained only for transcript artifact metadata and plugin contracts. */
function formatLegacySqliteSessionMarkerForScope(scope) {
	return formatSqliteSessionFileMarker({
		agentId: scope.agentId,
		sessionId: scope.sessionId,
		storePath: scope.path ?? resolveOpenClawAgentSqlitePath(toDatabaseOptions(scope))
	});
}
//#endregion
export { prepareSqliteTranscriptReadScope as a, resolveSqliteStoreScope as c, resolveSqliteTranscriptScope as d, resolveSqliteWriteAdmissionScope as f, withSqliteSessionDatabase as h, prepareSqliteScope as i, resolveSqliteTranscriptArchiveDirectory as l, transcriptWriteScopeIsCurrent as m, captureLifecycleDatabaseScope as n, resolveSqliteReadScope as o, runExclusiveSqliteSessionWrite as p, formatLegacySqliteSessionMarkerForScope as r, resolveSqliteScope as s, assertSqliteTranscriptWriteIdentity as t, resolveSqliteTranscriptReadScope as u };
