import { D as resolveExpiresAtMsFromDurationMs, F as resolveTimerTimeoutMs } from "./number-coercion-CkhMiRw8.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { M as resolveRegisteredAgentIdForDir } from "./agent-scope-config-fjA2T9Gz.mjs";
import "./session-accessor-Czw4l8kI.mjs";
import { o as patchSessionEntryCore } from "./session-accessor.sqlite-entry-wJ2W65pX.mjs";
import { a as resolveStoredSessionKeyForSessionId } from "./session-Cb56xLxH.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
//#region src/agents/session-suspension.ts
const log = createSubsystemLogger("session-suspension");
const DEFAULT_QUOTA_SUSPENSION_RESUME_MS = 18e5;
/**
* Bundled gateway chunks share one write queue and shutdown fence so one
* module copy cannot persist a suspension after another copy cleaned up.
*/
const suspensionState = resolveGlobalSingleton(Symbol.for("openclaw.sessionSuspensionRuntimeState"), () => ({
	suspensionWriteChain: Promise.resolve(),
	cleanupGeneration: 0,
	cleanupActive: false
}));
const deferredSessionSuspension = new AsyncLocalStorage();
function resolveSessionSuspensionReason(reason) {
	if (reason === "billing") return "manual";
	if (reason === "rate_limit") return "quota_exhausted";
	return "circuit_open";
}
function runWithDeferredSessionSuspension(run, onDeferred) {
	return deferredSessionSuspension.run({
		claimed: false,
		onDeferred
	}, run);
}
function resolveSessionSuspensionTarget() {
	const scope = deferredSessionSuspension.getStore();
	if (!scope || scope.claimed) return { mode: "suspend" };
	scope.claimed = true;
	return {
		mode: "defer",
		defer: (params) => scope.onDeferred?.(params)
	};
}
function fenceSessionSuspensionWritesForGatewayShutdown() {
	suspensionState.cleanupGeneration += 1;
	suspensionState.cleanupActive = true;
}
function enableSessionSuspensionWritesForGatewayStart() {
	suspensionState.cleanupGeneration += 1;
	suspensionState.cleanupActive = false;
}
async function suspendSession(params) {
	const state = suspensionState;
	const queuedGeneration = state.cleanupGeneration;
	const run = state.suspensionWriteChain.then(() => suspendSessionQueued(params, queuedGeneration)).catch((err) => {
		log.warn("failed to persist quota suspension", {
			sessionId: params.sessionId,
			error: err instanceof Error ? err.message : String(err)
		});
	});
	state.suspensionWriteChain = run;
	await run;
}
async function suspendSessionQueued(params, queuedGeneration) {
	if (!params.cfg) return;
	const agentIdFromDir = params.agentDir ? resolveRegisteredAgentIdForDir(params.agentDir) : void 0;
	const { sessionKey, storePath } = await resolveStoredSessionKeyForSessionId({
		cfg: params.cfg,
		sessionId: params.sessionId,
		agentId: params.agentId ?? agentIdFromDir
	});
	if (!sessionKey) return;
	const ttlMs = resolveTimerTimeoutMs(params.ttlMs, DEFAULT_QUOTA_SUSPENSION_RESUME_MS, 0);
	const now = Date.now();
	const expectedResumeBy = resolveExpiresAtMsFromDurationMs(ttlMs, { nowMs: now }) ?? now;
	const state = suspensionState;
	if (state.cleanupActive || state.cleanupGeneration !== queuedGeneration) return;
	const suspensionGeneration = state.cleanupGeneration;
	let previousQuotaSuspension;
	if (await patchSessionEntryCore({
		storePath,
		sessionKey
	}, (entry) => {
		if (state.cleanupGeneration !== suspensionGeneration) return null;
		previousQuotaSuspension = entry.quotaSuspension;
		return { quotaSuspension: {
			schemaVersion: 1,
			suspendedAt: now,
			reason: params.reason,
			failedProvider: params.failedProvider,
			failedModel: params.failedModel,
			summary: params.summary,
			expectedResumeBy,
			state: "suspended"
		} };
	}, {
		skipMaintenance: true,
		takeCacheOwnership: true
	}) !== null && (state.cleanupActive || suspensionGeneration !== state.cleanupGeneration)) try {
		await patchSessionEntryCore({
			storePath,
			sessionKey
		}, (entry) => entry.quotaSuspension?.suspendedAt === now && entry.quotaSuspension.reason === params.reason && entry.quotaSuspension.failedProvider === params.failedProvider && entry.quotaSuspension.failedModel === params.failedModel ? { quotaSuspension: previousQuotaSuspension } : null, {
			skipMaintenance: true,
			takeCacheOwnership: true
		});
	} catch (err) {
		log.warn("failed to clear quota suspension after shutdown cleanup", {
			sessionId: params.sessionId,
			error: err instanceof Error ? err.message : String(err)
		});
	}
}
function resetSessionSuspensionStateForTest() {
	const state = suspensionState;
	state.cleanupGeneration += 1;
	state.suspensionWriteChain = Promise.resolve();
	state.cleanupActive = false;
}
function isSessionSuspensionWriteCleanupActiveForTest() {
	return suspensionState.cleanupActive;
}
if (process.env.VITEST || false) globalThis[Symbol.for("openclaw.sessionSuspensionTestApi")] = {
	isSessionSuspensionWriteCleanupActiveForTest,
	resetSessionSuspensionStateForTest
};
//#endregion
export { runWithDeferredSessionSuspension as a, resolveSessionSuspensionTarget as i, fenceSessionSuspensionWritesForGatewayShutdown as n, suspendSession as o, resolveSessionSuspensionReason as r, enableSessionSuspensionWritesForGatewayStart as t };
