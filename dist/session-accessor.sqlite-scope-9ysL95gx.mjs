import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import "./paths-orClZ-2Z.mjs";
import { n as formatErrorMessageWithCode } from "./errors-DPfGDWk1.mjs";
import { r as getChildLogger } from "./logger-DR3u4tgD.mjs";
import { c as withSqliteReaderOwner } from "./sqlite-reader-lifecycle-Cw11HwJP.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { c as resolveOpenClawAgentSqlitePath } from "./openclaw-agent-db.paths-BGqL4GOe.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import "./session-key-CSDERtm3.mjs";
import { a as resolveUnsuffixedSqliteTargetFromSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { a as resolveSessionArtifactDirectory } from "./paths-YgcBNLgG.mjs";
import { n as runOpenClawAgentWorkerWrite, r as runOpenClawAgentWriteAdmission } from "./openclaw-agent-write-admission-HJUGqW5o.mjs";
import { d as withOpenClawAgentDatabaseRuntime, i as getOpenClawAgentDatabaseIfOpen, o as openOpenClawAgentDatabase } from "./openclaw-agent-db-_fC-kf1x.mjs";
import { i as prepareSqliteTargetFromSessionStorePath } from "./session-sqlite-target-DJQA0Ssz.mjs";
import { r as assertAgentSessionWriteAdmission } from "./session-agent-work-admission-D63nonbM.mjs";
import { a as normalizeStoreSessionKey } from "./store-entry-CUxN9KZj.mjs";
import { i as toDatabaseOptions } from "./session-accessor.sqlite-scope-helpers-XTtpZpWK.mjs";
import { t as formatSqliteSessionFileMarker } from "./legacy-sqlite-marker-CkjJ0jcJ.mjs";
import { a as resolveSqliteTranscriptReadScope, n as resolveSqliteReadScope, r as resolveSqliteScope, t as resolveSqliteDatabaseScopeIdentity } from "./session-accessor.sqlite-read-scope-DzGQuOfU.mjs";
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
		const result = withOpenClawAgentDatabaseRuntime(options, admittedOperation, assertCurrent);
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
	assertAgentSessionWriteAdmission(databaseOptions, scope.agentId);
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
			completionDelayMs: Math.round(completedAt - timing.finishedAt),
			reentrant: timing.reentrant
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
	const admitted = () => {
		assertAgentSessionWriteAdmission(databaseOptions, scope.agentId);
		return fn();
	};
	const owned = () => withSqliteReaderOwner({
		operation,
		ownerKind: isMainThread ? "main" : "worker",
		actorId: threadId
	}, () => writer === "worker" ? runOpenClawAgentWorkerWrite(databaseOptions, admitted, timing, signal) : runOpenClawAgentWriteAdmission(databaseOptions, admitted, writer === "foreground-reentrant", timing, signal));
	try {
		const result = await owned();
		completedAt = performance.now();
		if (completedAt - startedAt >= SQLITE_SESSION_SLOW_WRITE_MS) getChildLogger({ subsystem: "session-sqlite" }).warn(logFields(completedAt), "slow SQLite session write");
		return result;
	} catch (error) {
		outcome = "error";
		completedAt = performance.now();
		getChildLogger({ subsystem: "session-sqlite" }).warn({
			...logFields(completedAt),
			error: truncateUtf16Safe(formatErrorMessageWithCode(error), SQLITE_SESSION_WRITE_ERROR_MAX_CHARS)
		}, "SQLite session write failed");
		throw error;
	} finally {
		if (sessionWriteDiagnostics.hasSubscribers) sessionWriteDiagnostics.publish({
			...timingFields(completedAt),
			writer,
			outcome
		});
	}
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
function resolveSqliteTranscriptScope(scope, readSource) {
	assertSqliteTranscriptWriteIdentity(scope);
	return {
		...resolveSqliteScope({
			...scope,
			sessionKey: scope.sessionKey
		}, void 0, readSource ? {
			...readSource,
			shared: true
		} : void 0),
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
	const { getOwnedSessionTranscriptReader } = await import("./transcript-write-context-KCKmzXk-.mjs");
	const reader = getOwnedSessionTranscriptReader(readScope);
	if (reader) return {
		agentId: reader.logicalAgentId,
		databaseAgentId: reader.database.agentId,
		path: reader.database.path,
		ownerStorePath: readScope.storePath,
		env: reader.database.env,
		sessionKey: reader.sessionKey,
		sessionId: readScope.sessionId
	};
	const target = await prepareSqliteScopeTarget(readScope, signal);
	return {
		...resolveSqliteReadScope(readScope, void 0, target),
		sessionId: readScope.sessionId
	};
}
/** Exact locators can reserve their FIFO before worker-owned schema-owner discovery. */
function resolveSqliteWriteAdmissionScope(scope) {
	const { effectiveAgentId, effectiveStorePath, effectiveEnv, explicitIncognito } = resolveSqliteDatabaseScopeIdentity(scope);
	const target = effectiveStorePath ? explicitIncognito ?? resolveUnsuffixedSqliteTargetFromSessionStorePath(effectiveStorePath) : void 0;
	if (target && !target.agentId && !target.shared) return;
	const agentId = effectiveAgentId ?? target?.agentId ?? normalizeAgentId(scope.defaultAgentId);
	return {
		agentId,
		env: effectiveEnv,
		path: target?.path ?? resolveOpenClawAgentSqlitePath({
			agentId,
			env: effectiveEnv
		})
	};
}
/** Writers resolve physical ownership in the existing read worker inside exact-path admission. */
async function prepareSqliteScope(scope) {
	return resolveSqliteScope(scope, void 0, await prepareSqliteScopeTarget(scope));
}
async function prepareSqliteScopeTarget(scope, signal) {
	const { effectiveAgentId, effectiveStorePath, explicitIncognito } = resolveSqliteDatabaseScopeIdentity(scope);
	if (explicitIncognito) return explicitIncognito;
	if (isIncognitoSessionKey(scope.sessionKey)) return;
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
export { prepareSqliteTranscriptReadScope as a, resolveSqliteWriteAdmissionScope as c, withSqliteSessionDatabase as d, prepareSqliteScope as i, runExclusiveSqliteSessionWrite as l, captureLifecycleDatabaseScope as n, resolveSqliteTranscriptArchiveDirectory as o, formatLegacySqliteSessionMarkerForScope as r, resolveSqliteTranscriptScope as s, assertSqliteTranscriptWriteIdentity as t, transcriptWriteScopeIsCurrent as u };
