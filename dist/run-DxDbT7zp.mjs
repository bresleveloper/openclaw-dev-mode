import "./number-coercion-CkhMiRw8.mjs";
import { i as createAbortError, o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import { t as isAbortError } from "./abort-signal-C9DFO3n5.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { i as getPluginRegistryForContext, l as withPluginRuntimeGatewayRequestScope, o as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { f as readDatabasePathIdentitySync } from "./sqlite-worker-identity-DLqVBf5J.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-Bf3Js0D3.mjs";
import { T as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-FWbk4b3p.mjs";
import { n as listSqliteTargetCandidatePathsForSessionStorePath } from "./session-sqlite-target-paths-DufdR-Na.mjs";
import { n as captureSessionTranscriptTargetBinding } from "./transcript-target-binding-uO0pz59U.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as createSessionMaintenanceOwner } from "./coordinator-CAtNkN-G.mjs";
import { n as fenceScheduledGatewayContextResolver } from "./scheduled-run-gateway-context-Cs6rVhRo.mjs";
//#region src/agents/command/runtime-loaders.ts
const loadAttemptExecutionRuntime = createLazyPromise(async () => {
	const [attempt] = await Promise.all([import("./attempt-execution.runtime.js"), loadDeliveryRuntime()]);
	return attempt;
});
const loadAcpManagerRuntime = createLazyPromise(() => import("./acp/control-plane/manager.js"));
const loadAcpPolicyRuntime = createLazyPromise(() => import("./policy-Ct8lBykH.mjs"));
const loadAcpRuntimeErrorsRuntime = createLazyPromise(() => import("./errors-DuNqyoAU.mjs"));
const loadAcpSessionIdentifiersRuntime = createLazyPromise(() => import("./acp-core/runtime/session-identifiers.js"));
const loadDeliveryRuntime = createLazyPromise(() => import("./delivery.runtime.js"));
const loadSessionStoreRuntime = createLazyPromise(() => import("./session-store.runtime.js"));
const loadCliCompactionRuntime = createLazyPromise(() => import("./cli-compaction-C-I8IFGx.mjs"));
const loadAgentRunnerMemoryRuntime = createLazyPromise(() => import("./agent-runner-memory-apbgMcPK.mjs"));
const loadTranscriptAppendRuntime = createLazyPromise(() => import("./transcript.runtime.js"));
const loadCliDepsRuntime = createLazyPromise(() => import("./deps-DsA_vNBV.mjs"));
const loadExecDefaultsRuntime = createLazyPromise(() => import("./exec-defaults-CgxieY0y.mjs"));
const loadSkillsRuntime = createLazyPromise(async () => {
	const [remote, sessionSnapshot] = await Promise.all([import("./remote-C7EtdSLd.mjs"), import("./session-snapshot-CaUjcXrr.mjs")]);
	return {
		getRemoteSkillEligibility: remote.getRemoteSkillEligibility,
		resolveReusableWorkspaceSkillSnapshot: sessionSnapshot.resolveReusableWorkspaceSkillSnapshot
	};
});
async function resolveAgentCommandDeps(deps) {
	if (deps) return deps;
	const { createDefaultDeps } = await loadCliDepsRuntime();
	return createDefaultDeps();
}
//#endregion
//#region src/agents/command/maintenance-budget.ts
const log$1 = createSubsystemLogger("agents/agent-command");
function createCommandBudget(startedAt, timeoutMs, parent) {
	const controller = new AbortController();
	const deadline = timeoutMs === 2147e6 ? void 0 : startedAt + timeoutMs;
	const expire = () => {
		if (!controller.signal.aborted) {
			controller.abort(createAbortError("Command reached its deadline"));
			log$1.debug("Command work stopped at its deadline.");
		}
	};
	const remainingMs = () => {
		const remaining = controller.signal.aborted ? 0 : deadline === void 0 ? timeoutMs : Math.max(0, deadline - Date.now());
		if (remaining === 0) expire();
		return remaining;
	};
	const remaining = remainingMs();
	const timer = deadline !== void 0 && remaining > 0 ? setTimeout(expire, remaining) : void 0;
	timer?.unref();
	return {
		signal: parent ? AbortSignal.any([parent, controller.signal]) : controller.signal,
		remainingMs,
		dispose: () => clearTimeout(timer)
	};
}
//#endregion
//#region src/agents/session-maintenance/run.ts
const log = createSubsystemLogger("agents/session-maintenance");
/** Copy data only: turn callbacks, tool grants, delivery context and writer custody stay behind. */
function createSessionMaintenanceFollowup(params) {
	const { run, sessionEntry } = params;
	return {
		prompt: "",
		enqueuedAt: Date.now(),
		run: {
			agentId: run.agentId,
			agentDir: run.agentDir,
			sessionId: sessionEntry.sessionId,
			sessionKey: params.sessionKey,
			sessionFile: params.sessionKey ?? sessionEntry.sessionId,
			workspaceDir: run.workspaceDir,
			cwd: run.cwd ?? run.workspaceDir,
			runtimePolicySessionKey: params.runtimePolicySessionKey ?? params.sessionKey,
			config: params.cfg,
			messageProvider: run.messageProvider,
			agentAccountId: run.agentAccountId,
			chatType: run.chatType,
			conversationRoutePeerId: run.conversationRoutePeerId,
			conversationToolPolicy: run.conversationToolPolicy,
			groupId: run.groupId,
			groupChannel: run.groupChannel,
			groupSpace: run.groupSpace,
			provider: params.provider,
			model: params.model,
			authProfileId: params.auth.authProfileId,
			authProfileIdSource: params.auth.authProfileIdSource,
			blockReplyBreak: "message_end",
			skillsSnapshot: run.skillsSnapshot,
			thinkingCatalog: run.thinkingCatalog,
			skipProviderRuntimeHints: run.skipProviderRuntimeHints,
			thinkLevel: run.thinkLevel,
			verboseLevel: run.verboseLevel ?? "off",
			timeoutMs: run.timeoutMs,
			senderIsOwner: false
		},
		memoryAudienceSenderIsOwner: run.senderIsOwner === true
	};
}
/** Optional work has a fresh root and writer admission after the foreground owner closes. */
function scheduleSessionMaintenance(request, afterOwnerSettles) {
	const { prepared, followupRun } = request;
	const sessionKey = prepared.sessionKey;
	if (!sessionKey) return;
	const sessionReadScope = {
		...captureSessionTranscriptTargetBinding({
			agentId: followupRun.run.agentId,
			sessionId: request.sessionId,
			storePath: prepared.storePath,
			sessionKey
		}),
		readConsistency: "latest"
	};
	if (request.oneShotCliRun) {
		log.debug("Optional session maintenance skipped: one-shot CLI owns no post-return runtime.");
		return;
	}
	const pluginRegistry = getPluginRegistryForContext();
	if (!pluginRegistry) {
		log.warn("Optional session maintenance skipped: no active plugin registry.");
		return;
	}
	const resolveGatewayContext = fenceScheduledGatewayContextResolver(getPluginRuntimeGatewayRequestScope()?.resolveGatewayContext);
	let sourceIdentities;
	try {
		sourceIdentities = listSqliteTargetCandidatePathsForSessionStorePath(sessionReadScope.storePath).map(readDatabasePathIdentitySync);
	} catch (error) {
		log.warn(`Optional session maintenance source unavailable: ${formatErrorMessage(error)}`);
		return;
	}
	const budget = createCommandBudget(request.startedAt, prepared.timeoutMs);
	if (budget.remainingMs() === 0) {
		budget.dispose();
		return;
	}
	let readSource;
	const interrupted = new AbortController();
	const owner = createSessionMaintenanceOwner({
		sessionKey,
		preemptible: true,
		abortSignal: AbortSignal.any([interrupted.signal, budget.signal])
	});
	const assertCurrent = () => {
		owner.assertCurrent();
		assertAgentRunLifecycleGenerationCurrent(request.lifecycleGeneration);
		if (resolveGatewayContext && !resolveGatewayContext()) throw createAbortError("Optional maintenance Gateway instance retired");
		readSource?.assertSourceCurrent();
	};
	const run = withPluginRuntimeGatewayRequestScope({
		pluginRegistry,
		resolveGatewayContext,
		isWebchatConnect: () => false
	}, async () => {
		if (afterOwnerSettles && !await racePromiseWithAbortSignal(afterOwnerSettles, owner.signal)) {
			log.debug("Optional session maintenance skipped: foreground owner did not complete successfully.");
			return;
		}
		return owner.run(() => runWithGatewayIndependentRootWorkAdmission(async () => {
			assertCurrent();
			const { captureSessionEntryCurrentRead, withSessionEntryReadOnlyInWorker } = await loadSessionStoreRuntime();
			let entry;
			const admission = await beginSessionWorkAdmission({
				agentId: followupRun.run.agentId,
				scope: prepared.storePath,
				identities: [sessionKey, request.sessionId],
				signal: owner.signal,
				onInterrupt: () => interrupted.abort(createAbortError("Session maintenance writer admission interrupted")),
				assertAllowed: async () => {
					assertCurrent();
					entry = await withSessionEntryReadOnlyInWorker(sessionReadScope, assertCurrent, async (read, source) => {
						if (!read.ok) throw read.error;
						const captured = captureSessionEntryCurrentRead(sessionReadScope, source);
						if (readSource && (captured.kind !== readSource.kind || captured.kind === "file" && readSource.kind === "file" && (captured.source.agentId !== readSource.source.agentId || captured.source.path !== readSource.source.path || captured.source.databaseIdentity !== readSource.source.databaseIdentity || captured.source.databaseBirthtime !== readSource.source.databaseBirthtime)) || captured.kind === "file" && !sourceIdentities.some((identity) => identity.canonicalPath === captured.source.path && identity.key === `file:${captured.source.databaseIdentity}` && identity.birthtime === captured.source.databaseBirthtime)) throw createAbortError("Session maintenance database changed before admission");
						readSource ??= captured;
						return read.value;
					});
					assertCurrent();
					if (!entry || entry.sessionId !== request.sessionId || entry.lifecycleRevision !== request.lifecycleRevision) throw createAbortError("Session changed before optional maintenance admission");
					if (entry.pendingFinalDelivery) throw createAbortError("Optional maintenance skipped while final delivery is pending");
				}
			});
			try {
				await admission.run(async () => {
					assertCurrent();
					if (!entry) throw createAbortError("Session maintenance has no admitted session");
					const sessionStore = { [sessionKey]: entry };
					const maintenanceParams = () => ({
						cfg: prepared.cfg,
						followupRun,
						promptForEstimate: "",
						defaultModel: followupRun.run.model,
						sessionEntry: entry,
						sessionStore,
						sessionKey,
						runtimePolicySessionKey: prepared.runtimePolicySessionKey ?? sessionKey,
						storePath: prepared.storePath,
						isHeartbeat: false,
						abortSignal: owner.signal
					});
					const memory = await loadAgentRunnerMemoryRuntime();
					assertCurrent();
					followupRun.run.timeoutMs = budget.remainingMs();
					assertCurrent();
					const flushed = await memory.runMemoryFlushIfNeeded({
						...maintenanceParams(),
						resolvedVerboseLevel: followupRun.run.verboseLevel ?? "off"
					});
					assertCurrent();
					entry = flushed.sessionEntry ?? entry;
					followupRun.run.sessionId = entry.sessionId;
					followupRun.run.timeoutMs = budget.remainingMs();
					assertCurrent();
					await memory.runSessionCompactionIfNeeded({
						...maintenanceParams(),
						compactionRequestBudget: request.compactionRequestBudget ? {
							...request.compactionRequestBudget,
							pendingTokens: 0
						} : void 0,
						agentHarnessId: request.agentHarnessId,
						authorize: () => {
							assertCurrent();
							return true;
						}
					});
				});
			} finally {
				admission.release();
			}
		}, "session-maintenance", owner.signal));
	});
	owner.track(run).catch((error) => {
		if (owner.signal.aborted || isAbortError(error)) log.debug(`Optional session maintenance cancelled: ${formatErrorMessage(error)}`);
		else log.warn(`Optional session maintenance failed: ${formatErrorMessage(error)}`);
	}).finally(() => budget.dispose());
}
//#endregion
export { loadAcpPolicyRuntime as a, loadAgentRunnerMemoryRuntime as c, loadDeliveryRuntime as d, loadExecDefaultsRuntime as f, resolveAgentCommandDeps as g, loadTranscriptAppendRuntime as h, loadAcpManagerRuntime as i, loadAttemptExecutionRuntime as l, loadSkillsRuntime as m, scheduleSessionMaintenance as n, loadAcpRuntimeErrorsRuntime as o, loadSessionStoreRuntime as p, createCommandBudget as r, loadAcpSessionIdentifiersRuntime as s, createSessionMaintenanceFollowup as t, loadCliCompactionRuntime as u };
