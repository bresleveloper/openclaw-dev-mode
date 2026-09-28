import "./number-coercion-CLj0HTDM.mjs";
import { i as getPluginRuntimeGatewayRequestScope, n as getPluginRegistryForContext, s as withPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as createLazyPromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { n as isAbortError, r as racePromiseWithAbortSignal, t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { S as runWithGatewayIndependentRootWorkAdmission } from "./gateway-work-admission-CHv_0noy.mjs";
import { t as assertAgentRunLifecycleGenerationCurrent } from "./agent-events-BOSJcayE.mjs";
import "./runtime-B2zZQffc.mjs";
import { n as beginSessionWorkAdmission } from "./session-lifecycle-admission-Pys9TN37.mjs";
import { n as createSessionMaintenanceOwner } from "./coordinator-KBr1fVd6.mjs";
import { n as fenceScheduledGatewayContextResolver } from "./scheduled-run-gateway-context-CudRX7U4.mjs";
//#region src/agents/command/runtime-loaders.ts
const loadAttemptExecutionRuntime = createLazyPromise(async () => {
	const [attempt] = await Promise.all([import("./attempt-execution.runtime.js"), loadDeliveryRuntime()]);
	return attempt;
});
const loadAcpManagerRuntime = createLazyPromise(() => import("./acp/control-plane/manager.js"));
const loadAcpPolicyRuntime = createLazyPromise(() => import("./policy-o_HxYJ8I.mjs"));
const loadAcpRuntimeErrorsRuntime = createLazyPromise(() => import("./errors-CmXMhX6C.mjs"));
const loadAcpSessionIdentifiersRuntime = createLazyPromise(() => import("./acp-core/runtime/session-identifiers.js"));
const loadDeliveryRuntime = createLazyPromise(() => import("./delivery.runtime.js"));
const loadSessionStoreRuntime = createLazyPromise(() => import("./session-store.runtime.js"));
const loadCliCompactionRuntime = createLazyPromise(() => import("./cli-compaction-ftm-5V1t.mjs"));
const loadAgentRunnerMemoryRuntime = createLazyPromise(() => import("./agent-runner-memory-VKpLVsQZ.mjs"));
const loadTranscriptResolveRuntime = createLazyPromise(() => import("./transcript-resolve.runtime.js"));
const loadTranscriptAppendRuntime = createLazyPromise(() => import("./transcript.runtime.js"));
const loadCliDepsRuntime = createLazyPromise(() => import("./deps-XxjsNBru.mjs"));
const loadExecDefaultsRuntime = createLazyPromise(() => import("./exec-defaults-nAdDd220.mjs"));
const loadSkillsRuntime = createLazyPromise(async () => {
	const [remote, sessionSnapshot] = await Promise.all([import("./remote-oPvbN3Jo.mjs"), import("./session-snapshot-CGxQKCJK.mjs")]);
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
		}
	};
}
/** Optional work has a fresh root and writer admission after the foreground owner closes. */
function scheduleSessionMaintenance(request, afterOwnerSettles) {
	const { prepared, followupRun } = request;
	const sessionKey = prepared.sessionKey;
	if (!sessionKey) return;
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
	const budget = createCommandBudget(request.startedAt, prepared.timeoutMs);
	if (budget.remainingMs() === 0) {
		budget.dispose();
		return;
	}
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
			const { loadSessionEntryReadOnly } = await loadSessionStoreRuntime();
			let entry;
			const admission = await beginSessionWorkAdmission({
				scope: prepared.storePath,
				identities: [sessionKey, request.sessionId],
				signal: owner.signal,
				onInterrupt: () => interrupted.abort(createAbortError("Session maintenance writer admission interrupted")),
				assertAllowed: () => {
					assertCurrent();
					entry = loadSessionEntryReadOnly({
						storePath: prepared.storePath,
						sessionKey,
						readConsistency: "latest"
					});
					if (!entry || entry.sessionId !== request.sessionId || entry.lifecycleRevision !== request.lifecycleRevision) throw createAbortError("Session changed before optional maintenance admission");
					if (entry.pendingFinalDelivery) throw createAbortError("Optional maintenance skipped while final delivery is pending");
				}
			});
			try {
				await admission.run(async () => {
					assertCurrent();
					if (!entry) throw createAbortError("Session maintenance has no admitted session");
					const sessionStore = { [sessionKey]: entry };
					const memory = await loadAgentRunnerMemoryRuntime();
					assertCurrent();
					followupRun.run.timeoutMs = budget.remainingMs();
					assertCurrent();
					const flushed = await memory.runMemoryFlushIfNeeded({
						cfg: prepared.cfg,
						followupRun,
						promptForEstimate: "",
						defaultModel: followupRun.run.model,
						resolvedVerboseLevel: followupRun.run.verboseLevel ?? "off",
						sessionEntry: entry,
						sessionStore,
						sessionKey,
						runtimePolicySessionKey: prepared.runtimePolicySessionKey ?? sessionKey,
						storePath: prepared.storePath,
						isHeartbeat: false,
						abortSignal: owner.signal
					});
					assertCurrent();
					entry = flushed.sessionEntry ?? entry;
					followupRun.run.sessionId = entry.sessionId;
					followupRun.run.timeoutMs = budget.remainingMs();
					assertCurrent();
					await memory.runSessionCompactionIfNeeded({
						cfg: prepared.cfg,
						followupRun,
						promptForEstimate: "",
						compactionRequestBudget: request.compactionRequestBudget ? {
							...request.compactionRequestBudget,
							pendingTokens: 0
						} : void 0,
						sessionEntry: entry,
						sessionStore,
						sessionKey,
						runtimePolicySessionKey: prepared.runtimePolicySessionKey ?? sessionKey,
						storePath: prepared.storePath,
						defaultModel: followupRun.run.model,
						isHeartbeat: false,
						agentHarnessId: request.agentHarnessId,
						abortSignal: owner.signal,
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
export { resolveAgentCommandDeps as _, loadAcpPolicyRuntime as a, loadAgentRunnerMemoryRuntime as c, loadDeliveryRuntime as d, loadExecDefaultsRuntime as f, loadTranscriptResolveRuntime as g, loadTranscriptAppendRuntime as h, loadAcpManagerRuntime as i, loadAttemptExecutionRuntime as l, loadSkillsRuntime as m, scheduleSessionMaintenance as n, loadAcpRuntimeErrorsRuntime as o, loadSessionStoreRuntime as p, createCommandBudget as r, loadAcpSessionIdentifiersRuntime as s, createSessionMaintenanceFollowup as t, loadCliCompactionRuntime as u };
