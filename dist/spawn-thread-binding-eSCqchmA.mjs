import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CkhMiRw8.mjs";
import { r as resolveGlobalMap } from "./global-singleton-DrXvEBww.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-fjA2T9Gz.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as modelFallbackOverrideFromAvailability, p as resolveModelFallbackAvailability } from "./agent-scope-DXrnO3F4.mjs";
import { n as resolveSubagentConfiguredModelSelection } from "./model-selection-config-CrboVKXT.mjs";
import { l as normalizeThinkLevel } from "./thinking.shared-Be8dhC75.mjs";
import { t as isSubagentSpawnDepthAllowed } from "./agent-limits-CB2bq0ey.mjs";
import { d as withExecRequestOwners, l as readExecRequestOwners } from "./exec-request-context-CWnK9ayt.mjs";
import { a as resolveSubagentSpawnModelSelection } from "./model-selection-DdQ-ffuG.mjs";
import { n as formatThinkingLevels } from "./thinking-BCNoGfZ5.mjs";
import { c as getSubagentDepthFromSessionStore, h as resolveSubagentTargetPolicy, o as resolveSubagentCapabilities } from "./subagent-capabilities-l3WVTf-e.mjs";
import { M as resolveSpawnThreadBindingPlacement, j as resolveInboundConversationResolution } from "./session-binding-service-ByKk9LiJ.mjs";
import { u as countActiveRunsForSession, w as registerSubagentRun } from "./subagent-registry-CfK3_UcO.mjs";
import "./subagent-spawn-cleanup-Csz52Q2U.mjs";
import { t as prepareModelChoice } from "./model-runtime-choice-CkAP1g7y.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, c as resolveThreadBindingSpawnPolicy, n as formatThreadBindingSpawnDisabledError, s as resolveThreadBindingMaxAgeMsForChannel, t as formatThreadBindingDisabledError } from "./thread-bindings-policy-Hq7cocye.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { i as resolveThreadBindingThreadName, r as resolveThreadBindingIntroText } from "./thread-bindings-messages-BiGDDOIC.mjs";
import crypto from "node:crypto";
//#region src/agents/spawn-requester-policy.ts
/** Sender policy provenance is host-owned and survives delegated turns. */
function resolveSenderRestrictedSpawnError(params) {
	if (params.inheritedToolPolicySource === "sender" && (params.visible || params.targetAgentId && params.targetAgentId !== params.requesterAgentId)) return "This sender may only start hidden helpers of the same agent.";
}
//#endregion
//#region src/agents/spawn-pipeline.ts
function summarizeSpawnError(error) {
	return error instanceof Error ? error.message : typeof error === "string" ? error : "error";
}
async function runSpawnPipeline(params) {
	let phase = "initialize";
	let state;
	let runId;
	let registrationScope;
	try {
		let registration;
		try {
			params.assertActive?.();
			state = await params.adapter.initialize();
			phase = "dispatch";
			params.assertActive?.();
			({runId} = await params.adapter.dispatchTurn(state));
			phase = "register";
			params.assertActive?.();
			registration = params.buildRegistration(state, runId);
			await registerSubagentRun(registration, withExecRequestOwners({
				assertCurrent: params.assertActive,
				retainOwnership: (scope) => {
					registrationScope = scope;
					params.adapter.retainRegistrationScope?.(scope);
				}
			}, readExecRequestOwners(params)));
			params.admissionReservation?.release();
		} catch (error) {
			await params.adapter.cleanupOnFailure({
				phase,
				state,
				error,
				...registrationScope ? { registrationScope } : {}
			});
			return {
				ok: false,
				phase,
				state,
				runId,
				error
			};
		}
		if (params.hookRunner?.hasHooks("subagent_progress")) try {
			await params.hookRunner.runSubagentProgress({
				phase: "started",
				runId,
				childSessionKey: registration.childSessionKey,
				requester: params.progressOrigin
			}, {
				runId,
				childSessionKey: registration.childSessionKey,
				requesterSessionKey: params.progressSessionKey
			});
		} catch {}
		return {
			ok: true,
			state,
			runId,
			...registrationScope ? { registrationScope } : {}
		};
	} finally {
		params.admissionReservation?.release();
	}
}
//#endregion
//#region src/agents/child-admission.ts
/** ACP child keys deduplicate task rows; symbols keep anonymous starts distinct. */
const pendingChildAdmissions = resolveGlobalMap(Symbol.for("openclaw.pendingChildAdmissions"), "close-only");
function reserveChildAdmissionSlot(params) {
	const pending = pendingChildAdmissions.get(params.controllerSessionKey) ?? /* @__PURE__ */ new Set();
	const pendingChildSessionKeys = new Set([...pending].filter((sessionKey) => typeof sessionKey === "string"));
	const admission = params.resolveAdmission(pending.size, pendingChildSessionKeys);
	if (!admission.ok) return admission;
	const reservation = params.childSessionKey ?? Symbol("pending child admission");
	pending.add(reservation);
	pendingChildAdmissions.set(params.controllerSessionKey, pending);
	let references = 1;
	let released = false;
	const releaseReference = () => {
		references -= 1;
		if (references > 0) return;
		pending.delete(reservation);
		if (pending.size === 0 && pendingChildAdmissions.get(params.controllerSessionKey) === pending) pendingChildAdmissions.delete(params.controllerSessionKey);
	};
	return {
		...admission,
		release() {
			if (released) return;
			released = true;
			releaseReference();
		},
		retain() {
			if (released || pendingChildAdmissions.get(params.controllerSessionKey) !== pending || !pending.has(reservation)) throw new Error("Child admission reservation is no longer current");
			references += 1;
			let retainedReleased = false;
			return () => {
				if (retainedReleased) return;
				retainedReleased = true;
				releaseReference();
			};
		}
	};
}
const rejectChildAdmission = (governingCap, error) => ({
	ok: false,
	governingCap,
	error
});
function resolveChildAdmission(params) {
	if (!isSubagentSpawnDepthAllowed(params.callerDepth, params.maxSpawnDepth)) return rejectChildAdmission("subagents.maxSpawnDepth", `sessions_spawn is not allowed at this depth (current depth: ${params.callerDepth}, max: ${params.maxSpawnDepth}; agents.defaults.subagents.maxSpawnDepth).`);
	if (params.collect && params.totalChildren >= params.maxTotalChildren) return rejectChildAdmission("tools.swarm.maxTotalPerGroup", `sessions_spawn reached tools.swarm.maxTotalPerGroup (${params.totalChildren}/${params.maxTotalChildren}).`);
	if (params.activeChildren < params.maxActiveChildren) return { ok: true };
	return params.collect ? rejectChildAdmission("tools.swarm.maxChildrenPerGroup", `sessions_spawn reached tools.swarm.maxChildrenPerGroup (${params.activeChildren}/${params.maxActiveChildren}).`) : rejectChildAdmission("subagents.maxChildrenPerAgent", `sessions_spawn has reached max active children for this session (${params.activeChildren}/${params.maxActiveChildren}; agents.defaults.subagents.maxChildrenPerAgent).`);
}
//#endregion
//#region src/agents/spawn-plan.ts
function resolveSpawnMode(params) {
	if (params.requestedMode === "run" || params.requestedMode === "session") return params.requestedMode;
	return params.threadRequested ? "session" : "run";
}
function mintSpawnSessionKey(params) {
	const kind = params.backend === "acp" ? "acp" : "subagent";
	return `agent:${params.targetAgentId}:${kind}:${crypto.randomUUID()}`;
}
function resolveSpawnChannelAccountId(params) {
	const channel = normalizeOptionalLowercaseString(params.channel);
	const explicitAccountId = normalizeOptionalString(params.accountId);
	if (explicitAccountId) return explicitAccountId;
	if (!channel) return;
	const channels = params.cfg.channels;
	return normalizeOptionalString(channels?.[channel]?.defaultAccount) ?? "default";
}
async function resolveRequesterBoundConversationRef(params) {
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey);
	if (!requesterSessionKey) return;
	const activeBindings = (await params.bindingService.listBySession(requesterSessionKey)).filter((record) => record.status !== "ended" && record.conversation.channel === params.channel && (record.conversation.accountId ?? params.accountId) === params.accountId);
	if (activeBindings.length === 0) return;
	if (activeBindings.length > 1 && !params.fallback?.conversationId) return null;
	const matched = activeBindings.length === 1 ? activeBindings : activeBindings.filter((record) => record.conversation.conversationId === params.fallback?.conversationId && normalizeOptionalString(record.conversation.parentConversationId) === normalizeOptionalString(params.fallback?.parentConversationId));
	const conversation = matched.length === 1 ? matched[0]?.conversation : void 0;
	return conversation ? {
		conversationId: conversation.conversationId,
		...conversation.parentConversationId ? { parentConversationId: conversation.parentConversationId } : {}
	} : activeBindings.length === 1 ? void 0 : null;
}
function buildThreadBindingUnavailableError(kind, mode) {
	if (kind === "acp") return "thread=true for ACP sessions requires a channel context.";
	if (mode === "session") return "sessions_spawn(mode=\"session\") is only available on channels that open a separate thread for the worker (e.g. Discord or Matrix threads). This request is not running on a channel that can bind a subagent thread. Use mode=\"run\" for one-shot subagent work.";
	return "thread=true is only available on channels that open a separate thread for the worker (e.g. Discord or Matrix threads). This request is not running on a channel that can bind a subagent thread. Retry without thread=true, or re-run sessions_spawn from a channel that supports threads.";
}
async function prepareSpawnThreadBinding(params) {
	const channel = normalizeOptionalLowercaseString(params.channel);
	if (!channel) return {
		ok: false,
		error: buildThreadBindingUnavailableError(params.kind, params.mode)
	};
	const accountId = resolveSpawnChannelAccountId({
		cfg: params.cfg,
		channel,
		accountId: params.accountId
	});
	const policy = resolveThreadBindingSpawnPolicy({
		cfg: params.cfg,
		channel,
		accountId,
		kind: params.kind
	});
	if (!policy.enabled || !policy.spawnEnabled) return {
		ok: false,
		error: (policy.enabled ? formatThreadBindingSpawnDisabledError : formatThreadBindingDisabledError)({
			channel: policy.channel,
			accountId: policy.accountId,
			kind: params.kind
		})
	};
	const capabilities = params.bindingService.getCapabilities({
		channel: policy.channel,
		accountId: policy.accountId
	});
	if (!capabilities.adapterAvailable) return {
		ok: false,
		error: params.kind === "acp" ? `Thread bindings are unavailable for ${policy.channel}.` : buildThreadBindingUnavailableError(params.kind, params.mode)
	};
	const placement = resolveSpawnThreadBindingPlacement(policy.channel, capabilities.placements);
	if (placement !== "child") return {
		ok: false,
		error: `thread=true on ${policy.channel} would bind this conversation to the worker instead of opening a separate thread. Retry without thread=true (mode="run"); the result is announced back here.`
	};
	if (!capabilities.bindSupported || !capabilities.placements.includes(placement)) return {
		ok: false,
		error: `Thread bindings do not support child placement for ${policy.channel}.`
	};
	const fallback = resolveInboundConversationResolution({
		cfg: params.cfg,
		channel: policy.channel,
		accountId: policy.accountId,
		to: params.to,
		threadId: params.threadId,
		groupId: params.groupId
	});
	const requesterConversation = params.kind === "subagent" ? await resolveRequesterBoundConversationRef({
		bindingService: params.bindingService,
		requesterSessionKey: params.requesterSessionKey,
		channel: policy.channel,
		accountId: policy.accountId,
		fallback
	}) : void 0;
	if (requesterConversation === null) return {
		ok: false,
		error: `Could not resolve a unique ${policy.channel} requester conversation for subagent thread spawn.`
	};
	const conversation = requesterConversation ?? fallback;
	if (!conversation?.conversationId) return {
		ok: false,
		error: `Could not resolve a ${policy.channel} conversation for ${params.kind} thread spawn.`
	};
	return {
		ok: true,
		binding: {
			channel: policy.channel,
			accountId: policy.accountId,
			placement,
			conversationId: conversation.conversationId,
			...conversation.parentConversationId ? { parentConversationId: conversation.parentConversationId } : {}
		}
	};
}
function resolveSpawnAdmission(params) {
	const requesterPolicyError = resolveSenderRestrictedSpawnError(params);
	if (requesterPolicyError) return {
		ok: false,
		error: requesterPolicyError
	};
	if (params.enabled === false) return { ok: true };
	const callerDepth = params.callerDepth ?? getSubagentDepthFromSessionStore(params.requesterSessionKey, {
		cfg: params.cfg,
		agentId: params.requesterAgentId
	});
	const maxSpawnDepth = params.cfg.agents?.defaults?.subagents?.maxSpawnDepth ?? 5;
	const collector = params.collector;
	const childAdmission = collector ? resolveChildAdmission({
		callerDepth,
		maxSpawnDepth,
		collect: true,
		activeChildren: collector.liveChildren,
		maxActiveChildren: collector.maxChildrenPerGroup,
		totalChildren: collector.totalChildren,
		maxTotalChildren: collector.maxTotalPerGroup
	}) : resolveChildAdmission({
		callerDepth,
		maxSpawnDepth,
		collect: false,
		activeChildren: (params.countActiveRuns ?? countActiveRunsForSession)(params.requesterSessionKey, {
			collect: false,
			requesterAgentId: params.requesterAgentId
		}) + (params.additionalActiveChildren ?? 0),
		maxActiveChildren: params.cfg.agents?.defaults?.subagents?.maxChildrenPerAgent ?? 5
	});
	if (!childAdmission.ok) return childAdmission;
	const requesterSubagentConfig = resolveAgentConfig(params.cfg, params.requesterAgentId)?.subagents;
	if ((requesterSubagentConfig?.requireAgentId ?? params.cfg.agents?.defaults?.subagents?.requireAgentId ?? false) && !params.requestedAgentId?.trim()) return {
		ok: false,
		error: "sessions_spawn requires explicit agentId when requireAgentId is configured. Provide an allowed configured agentId."
	};
	const targetPolicy = resolveSubagentTargetPolicy({
		requesterAgentId: params.requesterAgentId,
		targetAgentId: params.targetAgentId,
		requestedAgentId: params.requestedAgentId,
		allowAgents: requesterSubagentConfig?.allowAgents ?? params.cfg.agents?.defaults?.subagents?.allowAgents,
		configuredAgentIds: params.configuredAgentIds
	});
	if (!targetPolicy.ok) return {
		ok: false,
		error: targetPolicy.error
	};
	const capabilities = resolveSubagentCapabilities({
		depth: callerDepth + 1,
		maxSpawnDepth
	});
	return {
		ok: true,
		maxSpawnDepth,
		childSessionPatch: {
			spawnDepth: capabilities.depth,
			subagentRole: capabilities.role === "main" ? null : capabilities.role,
			subagentControlScope: capabilities.controlScope
		}
	};
}
function resolveSpawnSandboxError(params) {
	if (params.backend === "acp") {
		if (params.requesterSandboxed) return "Sandboxed sessions cannot spawn ACP sessions because runtime=\"acp\" runs on the host. Use runtime=\"subagent\" from sandboxed sessions.";
		return params.sandbox === "require" ? "sessions_spawn sandbox=\"require\" is unsupported for runtime=\"acp\" because ACP sessions run outside the sandbox. Use runtime=\"subagent\" or sandbox=\"inherit\"." : void 0;
	}
	if (params.childSandboxed || !params.requesterSandboxed && params.sandbox !== "require") return;
	return params.requesterSandboxed ? "Sandboxed sessions cannot spawn unsandboxed subagents. Set a sandboxed target agent or use the same agent runtime." : "sessions_spawn sandbox=\"require\" needs a sandboxed target runtime. Pick a sandboxed agentId or use sandbox=\"inherit\".";
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-thinking.ts
function resolveSubagentThinkingOverride(params) {
	const resolvedThinkingDefaultRaw = normalizeOptionalString(params.requesterAgentConfig?.subagents?.thinking) ?? normalizeOptionalString(params.targetAgentConfig?.subagents?.thinking) ?? normalizeOptionalString(params.cfg.agents?.defaults?.subagents?.thinking);
	const overrideCandidateRaw = params.thinkingOverrideRaw || resolvedThinkingDefaultRaw;
	const candidate = overrideCandidateRaw || (params.callerThinkingExplicit === false ? void 0 : params.callerThinkingRaw);
	const normalizedThinking = candidate ? normalizeThinkLevel(candidate) : void 0;
	if (overrideCandidateRaw && !normalizedThinking) return {
		status: "error",
		thinkingCandidateRaw: overrideCandidateRaw
	};
	return {
		status: "ok",
		thinkingOverride: overrideCandidateRaw ? normalizedThinking : void 0,
		initialSessionPatch: normalizedThinking ? { thinkingLevel: normalizedThinking } : {}
	};
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-plan.ts
function splitModelRef(ref) {
	const trimmed = ref?.trim();
	if (!trimmed) return {
		provider: void 0,
		model: void 0
	};
	const slash = trimmed.indexOf("/");
	if (slash > 0 && slash < trimmed.length - 1) return {
		provider: trimmed.slice(0, slash),
		model: trimmed.slice(slash + 1)
	};
	return {
		provider: void 0,
		model: trimmed
	};
}
function resolveConfiguredSubagentRunTimeoutSeconds(params) {
	return resolveNonNegativeIntegerOption(params.runTimeoutSeconds, resolveNonNegativeIntegerOption(params.cfg?.agents?.defaults?.subagents?.runTimeoutSeconds, 0));
}
async function resolveSubagentModelAndThinkingPlan(params) {
	const { model: rawResolvedModel, resolvedModel: inheritedModel } = resolveSubagentSpawnModelSelection({
		cfg: params.cfg,
		agentId: params.targetAgentId,
		modelOverride: params.modelOverride,
		inheritedModel: params.inheritedModel
	});
	const { model: requestedModel, profile: authProfileId } = splitTrailingAuthProfile(rawResolvedModel);
	const thinkingPlan = resolveSubagentThinkingOverride({
		cfg: params.cfg,
		requesterAgentConfig: params.requesterAgentConfig,
		targetAgentConfig: params.targetAgentConfig,
		thinkingOverrideRaw: params.thinkingOverrideRaw,
		callerThinkingRaw: params.callerThinkingRaw,
		callerThinkingExplicit: params.callerThinkingExplicit
	});
	if (thinkingPlan.status === "error") {
		const { provider, model } = splitModelRef(requestedModel);
		const hint = formatThinkingLevels(provider, model);
		return {
			status: "error",
			resolvedModel: requestedModel,
			error: `Invalid thinking level "${thinkingPlan.thinkingCandidateRaw}". Use one of: ${hint}.`
		};
	}
	const modelOverrideSource = params.modelOverride?.trim() ? "user" : "auto";
	let choice;
	try {
		choice = await prepareModelChoice({
			cfg: params.cfg,
			agentId: params.targetAgentId,
			workspaceDir: params.workspaceDir,
			raw: rawResolvedModel,
			source: modelOverrideSource === "user" ? "override" : "automatic",
			...inheritedModel ? { resolvedRef: inheritedModel } : {},
			...modelOverrideSource === "auto" ? { fallbacks: modelFallbackOverrideFromAvailability(resolveModelFallbackAvailability({
				cfg: params.cfg,
				agentId: params.targetAgentId,
				hasSessionModelOverride: true,
				modelOverrideSource: "auto",
				subagentSpawnLineage: true
			})) } : {}
		});
	} catch (error) {
		return {
			status: "error",
			resolvedModel: requestedModel,
			error: `sessions_spawn could not verify the selected model: ${summarizeSpawnError(error)}`
		};
	}
	if (choice.kind === "unavailable") return {
		status: "error",
		resolvedModel: requestedModel,
		error: `sessions_spawn model "${requestedModel}" is not usable: ${choice.error}`
	};
	const resolvedModel = `${choice.ref.provider}/${choice.ref.model}`;
	if (params.requiresTools && choice.kind === "resolved" && !supportsModelTools(choice.model)) return {
		status: "error",
		resolvedModel,
		error: `sessions_spawn outputSchema requires a tool-capable target model; "${resolvedModel}" declares compat.supportsTools=false.`
	};
	const modelOrigin = modelOverrideSource === "auto" && Boolean(params.inheritedModel ?? resolveSubagentConfiguredModelSelection({
		cfg: params.cfg,
		agentId: params.targetAgentId
	})) ? choice.ref : void 0;
	return {
		status: "ok",
		resolvedModel,
		modelRef: choice.ref,
		...inheritedModel ? { inheritedModel: choice.ref } : {},
		modelApplied: true,
		thinkingOverride: thinkingPlan.thinkingOverride,
		initialSessionPatch: {
			model: choice.ref.model,
			modelProvider: choice.ref.provider,
			modelOverride: choice.ref.model,
			providerOverride: choice.ref.provider,
			modelOverrideRouteResolution: "resolved",
			modelOverrideSource,
			...modelOrigin ? {
				modelOverrideFallbackOriginProvider: modelOrigin.provider,
				modelOverrideFallbackOriginModel: modelOrigin.model
			} : {},
			...authProfileId ? {
				authProfileOverride: authProfileId,
				authProfileOverrideSource: "user"
			} : {},
			...thinkingPlan.initialSessionPatch,
			...params.fastMode !== void 0 ? { fastMode: params.fastMode } : {}
		}
	};
}
//#endregion
//#region src/agents/subagents/spawn/spawn-thread-binding.ts
function buildSpawnThreadBinding(params) {
	const { cfg, agentId, label, binding } = params;
	const policyContext = {
		cfg,
		channel: binding.channel,
		accountId: binding.accountId
	};
	return {
		targetSessionKey: params.sessionKey,
		targetKind: params.targetKind,
		conversation: {
			channel: binding.channel,
			accountId: binding.accountId,
			conversationId: binding.conversationId,
			...binding.parentConversationId ? { parentConversationId: binding.parentConversationId } : {}
		},
		placement: binding.placement,
		metadata: {
			threadName: resolveThreadBindingThreadName({
				agentId,
				label: label || agentId
			}),
			agentId,
			label: label || void 0,
			boundBy: "system",
			introText: resolveThreadBindingIntroText({
				agentId,
				label: label || void 0,
				idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel(policyContext),
				maxAgeMs: resolveThreadBindingMaxAgeMsForChannel(policyContext),
				sessionCwd: params.sessionCwd,
				sessionDetails: params.sessionDetails
			})
		}
	};
}
//#endregion
export { resolveSubagentThinkingOverride as a, resolveSpawnAdmission as c, resolveSpawnSandboxError as d, reserveChildAdmissionSlot as f, resolveSenderRestrictedSpawnError as h, splitModelRef as i, resolveSpawnChannelAccountId as l, summarizeSpawnError as m, resolveConfiguredSubagentRunTimeoutSeconds as n, mintSpawnSessionKey as o, runSpawnPipeline as p, resolveSubagentModelAndThinkingPlan as r, prepareSpawnThreadBinding as s, buildSpawnThreadBinding as t, resolveSpawnMode as u };
