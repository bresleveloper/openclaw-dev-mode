import { n as resolveGlobalMap } from "./global-singleton-Dc_stLtU.mjs";
import { i as asOptionalObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { h as normalizeUniqueStringEntries, v as sortUniqueStrings } from "./string-normalization-_gRhJUDw.mjs";
import { n as normalizeAgentId } from "./agent-id-GA8mwdTG.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-IQKOEtZ4.mjs";
import "./session-key-CBvmC8zz.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { a as modelFallbackOverrideFromAvailability, h as resolveModelFallbackAvailability } from "./agent-scope-CTuYDtny.mjs";
import { n as resolveSubagentConfiguredModelSelection } from "./model-selection-config-DZ4sk4C2.mjs";
import { s as normalizeThinkLevel } from "./thinking.shared-BKzBCWpI.mjs";
import { S as isSubagentSpawnDepthAllowed } from "./validation-core-DwJVlxTe.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-CW8dxG7X.mjs";
import { n as formatThinkingLevels } from "./thinking-B1p5pEC8.mjs";
import { o as resolveSubagentSpawnModelSelection } from "./model-selection-CFnUi6iD.mjs";
import { r as resolveInboundConversationResolution, t as resolveChannelDefaultBindingPlacement } from "./conversation-resolution-BQfeG7hv.mjs";
import { c as getSubagentDepthFromSessionStore, o as resolveSubagentCapabilities } from "./subagent-capabilities-D-LyBU4l.mjs";
import { h as resolveMainSessionAlias, m as resolveInternalSessionKey, p as resolveDisplaySessionKey } from "./sessions-helpers-0nPieSUh.mjs";
import { b as registerSubagentRun, s as countActiveRunsForSession } from "./subagent-registry-CM5uFXla.mjs";
import "./subagent-spawn-cleanup-D8KmXbTW.mjs";
import { t as prepareModelChoice } from "./model-runtime-choice-CvBfV0OX.mjs";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-POAubLd3.mjs";
import { c as resolveThreadBindingSpawnPolicy, n as formatThreadBindingSpawnDisabledError, t as formatThreadBindingDisabledError } from "./thread-bindings-policy-BbWqcnDl.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import crypto from "node:crypto";
//#region src/agents/subagents/spawn/subagent-target-policy.ts
/**
* Subagent spawn target policy. Requesters can self-spawn by default, or opt
* into a configured allowlist that is still intersected with known agents.
*/
function normalizeAllowAgents(allowAgents) {
	if (!Array.isArray(allowAgents)) return {
		configured: false,
		allowAny: false,
		allowedIds: []
	};
	const allowedIds = allowAgents.map((value) => value.trim()).filter((value) => value && value !== "*").map((value) => normalizeAgentId(value)).filter(Boolean);
	return {
		configured: true,
		allowAny: allowAgents.some((value) => value.trim() === "*"),
		allowedIds: sortUniqueStrings(allowedIds)
	};
}
function normalizeConfiguredAgentIds(configuredAgentIds) {
	return new Set(normalizeUniqueStringEntries((configuredAgentIds ?? []).map(normalizeAgentId)));
}
function filterConfiguredAllowedIds(params) {
	const configuredIds = normalizeConfiguredAgentIds(params.configuredAgentIds);
	return params.allowedIds.filter((id) => configuredIds.has(id));
}
/** Resolve the normalized agent IDs a requester may target with sessions_spawn. */
function resolveSubagentAllowedTargetIds(params) {
	const requesterAgentId = normalizeAgentId(params.requesterAgentId);
	const policy = normalizeAllowAgents(params.allowAgents);
	if (!policy.configured) return {
		allowAny: false,
		allowedIds: requesterAgentId ? [requesterAgentId] : []
	};
	if (policy.allowAny) {
		const configuredIds = Array.from(normalizeConfiguredAgentIds(params.configuredAgentIds));
		if (requesterAgentId) configuredIds.push(requesterAgentId);
		return {
			allowAny: true,
			allowedIds: sortUniqueStrings(configuredIds)
		};
	}
	return {
		allowAny: false,
		allowedIds: filterConfiguredAllowedIds({
			allowedIds: policy.allowedIds,
			configuredAgentIds: params.configuredAgentIds
		}).toSorted((a, b) => a.localeCompare(b))
	};
}
/** Validate one requested target against subagent spawn policy. */
function resolveSubagentTargetPolicy(params) {
	const requesterAgentId = normalizeAgentId(params.requesterAgentId);
	const targetAgentId = normalizeAgentId(params.targetAgentId);
	if (!params.requestedAgentId?.trim() && targetAgentId === requesterAgentId) return { ok: true };
	const allowed = resolveSubagentAllowedTargetIds({
		requesterAgentId,
		allowAgents: params.allowAgents,
		configuredAgentIds: params.configuredAgentIds
	});
	if (allowed.allowedIds.includes(targetAgentId)) return { ok: true };
	const allowedText = allowed.allowedIds.length > 0 ? allowed.allowedIds.join(", ") : "none";
	const policy = normalizeAllowAgents(params.allowAgents);
	if (allowed.allowAny || policy.allowedIds.includes(targetAgentId)) return {
		ok: false,
		allowedText,
		error: `agentId "${targetAgentId}" is not in the configured agent registry (allowed: ${allowedText})`
	};
	return {
		ok: false,
		allowedText,
		error: `agentId is not allowed for sessions_spawn (allowed: ${allowedText})`
	};
}
//#endregion
//#region src/agents/subagents/spawn/execution-identity-spawn-context.ts
const parentExecutionIdentities = /* @__PURE__ */ new WeakMap();
/** Carry exact parent provenance without adding it to public spawn context types. */
function withParentExecutionIdentity(context, token) {
	if (!token) return context;
	const carried = { ...context };
	parentExecutionIdentities.set(carried, token);
	return carried;
}
function readParentExecutionIdentity(context) {
	return parentExecutionIdentities.get(context);
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
			const completion = registration.queued ? registerSubagentRun(registration, {
				assertCurrent: params.assertActive,
				retainOwnership: (scope) => {
					registrationScope = scope;
				}
			}) : registerSubagentRun(registration);
			if (completion) await completion;
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
	return {
		...admission,
		release() {
			if (!pending.delete(reservation)) return;
			if (pending.size === 0) pendingChildAdmissions.delete(params.controllerSessionKey);
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
function resolveRequesterBoundConversationRef(params) {
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey);
	if (!requesterSessionKey) return;
	const activeBindings = params.bindingService.listBySession(requesterSessionKey).filter((record) => record.status !== "ended" && record.conversation.channel === params.channel && (record.conversation.accountId ?? params.accountId) === params.accountId);
	if (activeBindings.length === 0) return;
	if (activeBindings.length === 1) {
		const conversation = activeBindings[0]?.conversation;
		return conversation ? {
			conversationId: conversation.conversationId,
			...conversation.parentConversationId ? { parentConversationId: conversation.parentConversationId } : {}
		} : void 0;
	}
	if (!params.fallback?.conversationId) return null;
	const matched = activeBindings.filter((record) => record.conversation.conversationId === params.fallback?.conversationId && normalizeOptionalString(record.conversation.parentConversationId) === normalizeOptionalString(params.fallback?.parentConversationId));
	const conversation = matched.length === 1 ? matched[0]?.conversation : void 0;
	return conversation ? {
		conversationId: conversation.conversationId,
		...conversation.parentConversationId ? { parentConversationId: conversation.parentConversationId } : {}
	} : null;
}
function buildThreadBindingUnavailableError(kind, mode) {
	if (kind === "acp") return "thread=true for ACP sessions requires a channel context.";
	if (mode === "session") return "sessions_spawn(mode=\"session\") is only available on channels that expose thread bindings (e.g. Discord threads, Slack threads, Telegram forum topics). This request is not running on a channel that can bind a subagent thread. Use mode=\"run\" for one-shot subagent work.";
	return "thread=true is only available on channels that expose thread bindings (e.g. Discord threads, Slack threads, Telegram forum topics). This request is not running on a channel that can bind a subagent thread. Retry without thread=true, or re-run sessions_spawn from a channel that supports threads.";
}
function prepareSpawnThreadBinding(params) {
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
	if (!policy.enabled) return {
		ok: false,
		error: formatThreadBindingDisabledError({
			channel: policy.channel,
			accountId: policy.accountId,
			kind: params.kind
		})
	};
	if (!policy.spawnEnabled) return {
		ok: false,
		error: formatThreadBindingSpawnDisabledError({
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
	const placement = resolveChannelDefaultBindingPlacement(policy.channel) ?? (capabilities.placements.includes("child") ? "child" : "current");
	if (!capabilities.bindSupported || !capabilities.placements.includes(placement)) return {
		ok: false,
		error: `Thread bindings do not support ${placement} placement for ${policy.channel}.`
	};
	const fallback = resolveInboundConversationResolution({
		cfg: params.cfg,
		channel: policy.channel,
		accountId: policy.accountId,
		to: params.to,
		threadId: params.threadId,
		groupId: params.groupId
	});
	const requesterConversation = params.kind === "subagent" ? resolveRequesterBoundConversationRef({
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
	if (params.enabled === false) return { ok: true };
	const callerDepth = getSubagentDepthFromSessionStore(params.requesterSessionKey, {
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
		activeChildren: countActiveRunsForSession(params.requesterSessionKey, {
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
//#region src/agents/spawn-requester-origin.ts
const KIND_PREFIX_TO_CHAT_TYPE = {
	"room:": "channel",
	"channel:": "channel",
	"conversation:": "channel",
	"chat:": "channel",
	"thread:": "channel",
	"topic:": "channel",
	"group:": "group",
	"team:": "group",
	"user:": "direct",
	"dm:": "direct",
	"pm:": "direct"
};
const GENERIC_PREFIX_PATTERN = /^[a-z][a-z0-9_-]*:/i;
function getKindForRequesterPrefix(prefix) {
	return Object.hasOwn(KIND_PREFIX_TO_CHAT_TYPE, prefix) ? KIND_PREFIX_TO_CHAT_TYPE[prefix] : void 0;
}
function normalizeChannelPrefix(channelId) {
	const normalized = channelId?.trim().toLowerCase();
	return normalized ? `${normalized}:` : void 0;
}
function shouldPeelRequesterPrefix(prefix, channelPrefix) {
	return Boolean(getKindForRequesterPrefix(prefix) || prefix === channelPrefix);
}
function inferPeerKindFromBareId(value) {
	if (value.startsWith("@")) return "direct";
	if (value.startsWith("!") || value.startsWith("#")) return "channel";
}
function extractRequesterPeer(channelId, requesterTo) {
	if (!requesterTo) return {};
	const raw = requesterTo.trim();
	if (!raw) return {};
	const channelPrefix = normalizeChannelPrefix(channelId);
	let inferredKind;
	let allowBareIdKindOverride = false;
	let value = raw;
	while (true) {
		const match = GENERIC_PREFIX_PATTERN.exec(value);
		if (!match) break;
		const prefix = match[0].toLowerCase();
		if (!shouldPeelRequesterPrefix(prefix, channelPrefix)) break;
		const kindFromPrefix = getKindForRequesterPrefix(prefix);
		if (kindFromPrefix) inferredKind ??= kindFromPrefix;
		allowBareIdKindOverride ||= prefix === channelPrefix || prefix === "room:";
		value = value.slice(prefix.length).trim();
	}
	const bareIdKind = value ? inferPeerKindFromBareId(value) : void 0;
	if (bareIdKind && (!inferredKind || allowBareIdKindOverride)) inferredKind = bareIdKind;
	return {
		peerId: value || void 0,
		peerKind: inferredKind
	};
}
function resolveRequesterOriginForChild(params) {
	const { peerId: normalizedPeerId, peerKind: inferredPeerKind } = extractRequesterPeer(params.requesterChannel, params.requesterTo);
	const rawPeerIdAlias = params.requesterTo?.trim();
	const boundAccountId = params.requesterChannel && params.targetAgentId !== params.requesterAgentId ? resolveFirstBoundAccountId({
		cfg: params.cfg,
		channelId: params.requesterChannel,
		agentId: params.targetAgentId,
		peerId: normalizedPeerId,
		exactPeerIdAliases: rawPeerIdAlias && rawPeerIdAlias !== normalizedPeerId ? [rawPeerIdAlias] : void 0,
		peerKind: inferredPeerKind,
		groupSpace: params.requesterGroupSpace,
		memberRoleIds: params.requesterMemberRoleIds
	}) : void 0;
	return normalizeDeliveryContext({
		channel: params.requesterChannel,
		accountId: boundAccountId ?? params.requesterAccountId,
		to: params.requesterTo,
		threadId: params.requesterThreadId
	});
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-thinking.ts
/**
* Resolves subagent thinking-level inheritance and overrides. Spawning uses
* this helper to patch the child session without leaking invalid caller input.
*/
function resolveSubagentThinkingOverride(params) {
	const requesterSubagents = asOptionalObjectRecord(asOptionalObjectRecord(params.requesterAgentConfig)?.subagents);
	const targetSubagents = asOptionalObjectRecord(asOptionalObjectRecord(params.targetAgentConfig)?.subagents);
	const defaultSubagents = asOptionalObjectRecord(params.cfg.agents?.defaults?.subagents);
	const resolvedThinkingDefaultRaw = normalizeOptionalString(requesterSubagents?.thinking) ?? normalizeOptionalString(targetSubagents?.thinking) ?? normalizeOptionalString(defaultSubagents?.thinking);
	const overrideCandidateRaw = params.thinkingOverrideRaw || resolvedThinkingDefaultRaw;
	if (overrideCandidateRaw) {
		const normalizedThinking = normalizeThinkLevel(overrideCandidateRaw);
		if (!normalizedThinking) return {
			status: "error",
			thinkingCandidateRaw: overrideCandidateRaw
		};
		return {
			status: "ok",
			thinkingOverride: normalizedThinking,
			initialSessionPatch: { thinkingLevel: normalizedThinking }
		};
	}
	const normalizedThinking = params.callerThinkingRaw ? normalizeThinkLevel(params.callerThinkingRaw) : void 0;
	return {
		status: "ok",
		thinkingOverride: void 0,
		initialSessionPatch: normalizedThinking ? { thinkingLevel: normalizedThinking } : {}
	};
}
//#endregion
//#region src/agents/subagents/spawn/subagent-spawn-plan.ts
/**
* Subagent spawn planning helpers.
*
* Resolves model, thinking, and timeout choices before the sessions_spawn executor launches work.
*/
/** Splits a provider/model ref while preserving model-only refs. */
function splitModelRef(ref) {
	if (!ref) return {
		provider: void 0,
		model: void 0
	};
	const trimmed = ref.trim();
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
/** Resolves the effective subagent run timeout from per-call override or config default. */
function resolveConfiguredSubagentRunTimeoutSeconds(params) {
	const cfgSubagentTimeout = typeof params.cfg?.agents?.defaults?.subagents?.runTimeoutSeconds === "number" && Number.isFinite(params.cfg.agents.defaults.subagents.runTimeoutSeconds) ? Math.max(0, Math.floor(params.cfg.agents.defaults.subagents.runTimeoutSeconds)) : 0;
	return typeof params.runTimeoutSeconds === "number" && Number.isFinite(params.runTimeoutSeconds) ? Math.max(0, Math.floor(params.runTimeoutSeconds)) : cfgSubagentTimeout;
}
/** Resolves the subagent model plus thinking patch to apply to the spawned session. */
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
		callerThinkingRaw: params.callerThinkingRaw
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
		...inheritedModel ? { inheritedModel: choice.ref } : {},
		modelApplied: true,
		thinkingOverride: thinkingPlan.thinkingOverride,
		initialSessionPatch: {
			model: resolvedModel,
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
//#region src/agents/subagents/spawn/subagent-spawn-ownership.ts
/** Normalizes requester/completion owner aliases into internal and display session keys. */
function resolveSubagentSpawnOwnership(params) {
	const { mainKey, alias } = resolveMainSessionAlias(params.cfg);
	const controllerSessionKey = params.agentSessionKey ? resolveInternalSessionKey({
		key: params.agentSessionKey,
		alias,
		mainKey
	}) : alias;
	const completionOwnerKey = params.completionOwnerKey?.trim();
	const completionRequesterSessionKey = completionOwnerKey ? resolveInternalSessionKey({
		key: completionOwnerKey,
		alias,
		mainKey
	}) : controllerSessionKey;
	return {
		controllerSessionKey,
		completionRequesterSessionKey,
		completionRequesterDisplayKey: resolveDisplaySessionKey({
			key: completionRequesterSessionKey,
			alias,
			mainKey
		})
	};
}
//#endregion
export { withParentExecutionIdentity as _, resolveSubagentThinkingOverride as a, prepareSpawnThreadBinding as c, resolveSpawnMode as d, resolveSpawnSandboxError as f, readParentExecutionIdentity as g, summarizeSpawnError as h, splitModelRef as i, resolveSpawnAdmission as l, runSpawnPipeline as m, resolveConfiguredSubagentRunTimeoutSeconds as n, resolveRequesterOriginForChild as o, reserveChildAdmissionSlot as p, resolveSubagentModelAndThinkingPlan as r, mintSpawnSessionKey as s, resolveSubagentSpawnOwnership as t, resolveSpawnChannelAccountId as u, resolveSubagentAllowedTargetIds as v, resolveSubagentTargetPolicy as y };
