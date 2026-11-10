import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as resolveUserPath } from "./home-dir-CtsdYvX3.mjs";
import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import "./utils-gjJ-tD2q.mjs";
import "./errors-DPfGDWk1.mjs";
import { o as composeSessionSourceAssertion } from "./session-source-authority-fdILH-PW.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import "./agent-scope-DXrnO3F4.mjs";
import { S as runExclusiveSessionLifecycleMutation } from "./session-lifecycle-admission-BihxXo5j.mjs";
import { n as resolveConfiguredSubagentSpawnModelSelection } from "./model-selection-DdQ-ffuG.mjs";
import { n as formatThinkingLevels } from "./thinking-BCNoGfZ5.mjs";
import { r as resolveThinkingDefaultCore } from "./model-thinking-default-BKqBSSHy.mjs";
import { i as logVerbose } from "./globals-XVSoVbNQ.mjs";
import { i as resolveSandboxRuntimeStatusAsync } from "./runtime-status-DWm-5zUj.mjs";
import { i as resolveAcpThreadSessionDetailLines, n as resolveAcpSessionCwd } from "./session-identifiers-2CkhpQUq.mjs";
import { c as isAcpOwnerRepairRequired, n as getAcpSessionManager } from "./manager-Cge77N9B.mjs";
import { t as getSessionBindingService } from "./session-binding-service-ByKk9LiJ.mjs";
import { t as captureSessionEntryCurrentCheckAsyncInternal } from "./session-entry-current-check-Df7ye0eB.mjs";
import { a as getInProcessGatewayToolContext, c as runWithGatewayToolCleanupContext, r as callInProcessGatewayTool } from "./in-process-gateway-DaAxH7mK.mjs";
import { a as resolveSubagentThinkingOverride, d as resolveSpawnSandboxError, h as resolveSenderRestrictedSpawnError, i as splitModelRef, t as buildSpawnThreadBinding } from "./spawn-thread-binding-eSCqchmA.mjs";
import fs from "node:fs/promises";
//#region src/acp/control-plane/spawn.ts
/** Cleanup helpers for failed ACP spawn flows. */
/** Roll back only the provisional session owned by this failed spawn. */
async function cleanupFailedAcpSpawn(params) {
	if (!params.sessionEntry) return;
	const { sessionId, lifecycleRevision } = params.sessionEntry;
	const storePath = resolveSessionStorePathCore(params.cfg.session?.store, { agentId: params.agentId });
	let source;
	const assertCurrent = async () => {
		if (!source) throw new Error(`ACP provisional session ${params.sessionKey} changed before cleanup.`);
		await source.assertCurrent();
	};
	let deletionStarted = false;
	let deletionExecution;
	const cancellation = new AbortController();
	try {
		source = await captureSessionEntryCurrentCheckAsyncInternal({
			storePath,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			fields: ["sessionId", "lifecycleRevision"],
			expected: {
				sessionId,
				lifecycleRevision
			},
			errorMessage: `ACP provisional session ${params.sessionKey} changed before cleanup.`
		});
		await runWithGatewayToolCleanupContext(async () => {
			const context = getInProcessGatewayToolContext();
			if (!context) throw new Error("ACP provisional cleanup Gateway is unavailable.");
			const assertCleanupCurrent = (assertSource) => {
				cancellation.signal.throwIfAborted();
				context.requestEntryLifetime?.signal.throwIfAborted();
				assertSource();
			};
			await callInProcessGatewayTool("sessions.delete", {
				key: params.sessionKey,
				agentId: params.agentId,
				expectedSessionId: sessionId,
				...lifecycleRevision ? { expectedLifecycleRevision: lifecycleRevision } : {},
				deleteTranscript: params.deleteTranscript,
				emitLifecycleHooks: false
			}, {
				onExecution: (execution) => {
					deletionExecution = execution;
				},
				sessionMutationCommitGuard: composeSessionSourceAssertion([source.source], (assertSource) => {
					assertCleanupCurrent(assertSource);
					deletionStarted = true;
				}, { preparedCheck: assertCleanupCurrent }),
				signal: cancellation.signal,
				timeoutMs: 1e4
			});
		});
	} catch (error) {
		if (!deletionStarted) cancellation.abort(error);
		if (!deletionStarted && params.closeRuntimeOnFailure) await runExclusiveSessionLifecycleMutation("acp-spawn-cleanup", {
			scope: storePath,
			identities: [params.sessionKey, sessionId],
			run: async () => {
				await assertCurrent();
				await params.closeRuntimeOnFailure();
			}
		}).catch((releaseError) => {
			if (isAcpOwnerRepairRequired(releaseError)) throw releaseError;
			logVerbose(`acp-spawn: provisional runtime cleanup failed: ${String(releaseError)}`);
		});
		logVerbose(`acp-spawn: provisional session cleanup failed: ${String(error)}`);
	} finally {
		try {
			if (deletionStarted) await deletionExecution;
		} finally {
			source?.release();
		}
	}
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-policy.ts
async function resolveAcpSpawnRuntimePolicyError(params) {
	const requesterRuntime = await resolveSandboxRuntimeStatusAsync({
		cfg: params.cfg,
		sessionKey: params.requesterSessionKey,
		agentId: params.requesterAgentId
	});
	return resolveSpawnSandboxError({
		backend: "acp",
		requesterSandboxed: params.requesterSandboxed === true || requesterRuntime.sandboxed,
		sandbox: params.sandbox === "require" ? "require" : "inherit"
	});
}
function resolveAcpSenderSpawnError(params) {
	const targetError = resolveSenderRestrictedSpawnError(params);
	if (targetError) return targetError;
	if (params.inheritedToolPolicySource !== "sender") return;
	const root = params.sessionPermissionPolicy?.root ?? params.workspaceDir;
	return params.sessionPermissionPolicy && params.sessionPermissionPolicy.mode !== "full" || !root || params.cwd && resolveUserPath(params.cwd) !== resolveUserPath(root) ? `ACP cannot preserve this sender's session root restrictions. Use runtime="subagent" without a cwd override.` : void 0;
}
//#endregion
//#region src/agents/subagents/spawn/acp-spawn-runtime.ts
const ACP_RUNTIME_TIMEOUT_MAX_SECONDS = 86400;
async function resolveRuntimeCwdForAcpSpawn(params) {
	if (!params.resolvedCwd) return;
	if (normalizeOptionalString(params.explicitCwd)) return params.resolvedCwd;
	try {
		await fs.access(params.resolvedCwd);
		return params.resolvedCwd;
	} catch (error) {
		if (isMissingPathError(error)) return;
		throw error;
	}
}
function resolveAcpSpawnRuntimeOptions(params) {
	const policyAgentId = params.configAgentId ?? params.targetAgentId;
	const modelExplicit = normalizeOptionalString(params.model) !== void 0;
	const thinkingExplicit = normalizeOptionalString(params.thinking) !== void 0;
	const rawModel = resolveConfiguredSubagentSpawnModelSelection({
		cfg: params.cfg,
		agentId: policyAgentId,
		modelOverride: params.model,
		modelRuntime: "acp"
	});
	const modelSelection = splitTrailingAuthProfile(rawModel ?? "");
	if (modelExplicit && modelSelection.profile) return {
		ok: false,
		error: "ACP model overrides cannot select OpenClaw auth profiles; configure credentials in the ACP runtime instead."
	};
	const model = modelSelection.model || void 0;
	const targetAgentConfig = resolveAgentConfig(params.cfg, policyAgentId);
	const thinkingPlan = resolveSubagentThinkingOverride({
		cfg: params.cfg,
		targetAgentConfig,
		thinkingOverrideRaw: params.thinking
	});
	if (thinkingPlan.status === "error") {
		const { provider, model: modelId } = splitModelRef(model);
		return {
			ok: false,
			error: `Invalid thinking level "${thinkingPlan.thinkingCandidateRaw}". Use one of: ${formatThinkingLevels(provider, modelId)}.`
		};
	}
	let thinking = thinkingPlan.thinkingOverride;
	if (!thinking) {
		const { provider, model: modelId } = splitModelRef(model);
		thinking = provider && modelId ? resolveThinkingDefaultCore({
			cfg: params.cfg,
			agentId: policyAgentId,
			provider,
			model: modelId
		}) : targetAgentConfig?.thinkingDefault;
	}
	const timeoutSeconds = params.runTimeoutSeconds ? Math.min(params.runTimeoutSeconds, ACP_RUNTIME_TIMEOUT_MAX_SECONDS) : void 0;
	return {
		ok: true,
		runtimeOptions: model || thinking || timeoutSeconds ? {
			...model ? { model } : {},
			...thinking ? { thinking } : {},
			...timeoutSeconds ? { timeoutSeconds } : {}
		} : void 0,
		modelExplicit,
		thinkingExplicit
	};
}
async function initializeAcpSpawnRuntime(params) {
	params.assertActive?.();
	const initialized = await getAcpSessionManager().initializeSession({
		assertActive: params.assertActive,
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		agentId: params.ownerAgentId,
		agent: params.runtimeAgentId,
		mode: params.runtimeMode,
		resumeSessionId: params.resumeSessionId,
		revalidateResume: params.revalidateResume,
		runtimeOptions: params.runtimeOptions,
		modelExplicit: params.modelExplicit,
		thinkingExplicit: params.thinkingExplicit,
		cwd: params.cwd,
		backendId: params.backendId
	});
	return {
		initialized,
		sessionId: initialized.sessionEntry.sessionId,
		sessionEntry: initialized.sessionEntry
	};
}
async function bindPreparedAcpThread(params) {
	const binding = await getSessionBindingService().bind(buildSpawnThreadBinding({
		cfg: params.cfg,
		sessionKey: params.sessionKey,
		targetKind: "session",
		agentId: params.targetAgentId,
		label: params.label,
		binding: params.preparedBinding,
		sessionCwd: resolveAcpSessionCwd(params.initializedRuntime.initialized.meta),
		sessionDetails: resolveAcpThreadSessionDetailLines({
			sessionKey: params.sessionKey,
			meta: params.initializedRuntime.initialized.meta
		})
	}));
	params.assertActive?.();
	if (!binding.conversation.conversationId) throw new Error(params.preparedBinding.placement === "child" ? `Failed to create and bind a ${params.preparedBinding.channel} thread for this ACP session.` : `Failed to bind the current ${params.preparedBinding.channel} conversation for this ACP session.`);
	return binding;
}
//#endregion
export { resolveAcpSenderSpawnError as a, resolveRuntimeCwdForAcpSpawn as i, initializeAcpSpawnRuntime as n, resolveAcpSpawnRuntimePolicyError as o, resolveAcpSpawnRuntimeOptions as r, cleanupFailedAcpSpawn as s, bindPreparedAcpThread as t };
