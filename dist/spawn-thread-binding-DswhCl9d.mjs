import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { M as resolveNonNegativeIntegerOption } from "./number-coercion-CuVhdCBs.mjs";
import { r as resolveGlobalMap } from "./global-singleton-0m-JziJW.mjs";
import { h as normalizeUniqueStringEntries, v as sortUniqueStrings } from "./string-normalization-CECOqf64.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { r as resolveAgentConfig } from "./agent-scope-config-CDYpzA0r.mjs";
import "./session-key-C09ow4h0.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BNjB2hED.mjs";
import { a as modelFallbackOverrideFromAvailability, m as resolveModelFallbackAvailability } from "./agent-scope-CG17uXFn.mjs";
import { n as resolveSubagentConfiguredModelSelection } from "./model-selection-config-DYd_ufXT.mjs";
import { c as normalizeThinkLevel } from "./thinking.shared-Jy32Vp-O.mjs";
import { t as isSubagentSpawnDepthAllowed } from "./agent-limits-D-OOBnZ7.mjs";
import { s as normalizeDeliveryContext } from "./delivery-context.shared-PF5njaoI.mjs";
import { n as formatThinkingLevels } from "./thinking-DK1cFezU.mjs";
import { a as resolveSubagentSpawnModelSelection } from "./model-selection-C1qxt1eY.mjs";
import { n as buildSpawnAuthorityReceipt } from "./session-entry-lineage-Dms9xZt1.mjs";
import { c as getSubagentDepthFromSessionStore, o as resolveSubagentCapabilities } from "./subagent-capabilities-DD6QCsqy.mjs";
import { D as resolveSpawnThreadBindingPlacement, E as resolveInboundConversationResolution } from "./session-binding-service-DzGpg6K8.mjs";
import { C as registerSubagentRun, u as countActiveRunsForSession } from "./subagent-registry-CPK6wmy6.mjs";
import "./subagent-spawn-cleanup-BjmHhNbJ.mjs";
import { t as prepareModelChoice } from "./model-runtime-choice-C4AorDB3.mjs";
import { a as resolveInternalSessionKey, i as resolveDisplaySessionKey, o as resolveMainSessionAlias } from "./sessions-resolution-ZZ7dnwCs.mjs";
import "./sessions-helpers-BhYHEF2P.mjs";
import { t as resolveFirstBoundAccountId } from "./bound-account-read-DfL2KIt0.mjs";
import { a as resolveThreadBindingIdleTimeoutMsForChannel, c as resolveThreadBindingSpawnPolicy, n as formatThreadBindingSpawnDisabledError, s as resolveThreadBindingMaxAgeMsForChannel, t as formatThreadBindingDisabledError } from "./thread-bindings-policy-DE7-D4c0.mjs";
import { n as supportsModelTools } from "./model-tool-support-DIQSEumC.mjs";
import { i as resolveThreadBindingThreadName, r as resolveThreadBindingIntroText } from "./thread-bindings-messages-BhQOhR26.mjs";
import crypto from "node:crypto";
//#region src/agents/subagents/spawn/subagent-target-policy.ts
/**
* Subagent spawn target policy. Requesters can self-spawn by default, or opt
* into a configured allowlist that is still intersected with known agents.
*/
function normalizeAllowAgents(allowAgents) {
	if (!Array.isArray(allowAgents)) return;
	return new Set(allowAgents.map((value) => value.trim()).filter(Boolean).map((value) => value === "*" ? value : normalizeAgentId(value)).filter(Boolean));
}
function normalizeConfiguredAgentIds(configuredAgentIds) {
	return new Set(normalizeUniqueStringEntries((configuredAgentIds ?? []).map(normalizeAgentId)));
}
/** Resolve the normalized agent IDs a requester may target with sessions_spawn. */
function resolveSubagentAllowedTargetIds(params) {
	const requesterAgentId = normalizeAgentId(params.requesterAgentId);
	const policy = normalizeAllowAgents(params.allowAgents);
	if (!policy) return {
		allowAny: false,
		allowedIds: requesterAgentId ? [requesterAgentId] : []
	};
	if (policy.has("*")) {
		const configuredIds = Array.from(normalizeConfiguredAgentIds(params.configuredAgentIds));
		if (requesterAgentId) configuredIds.push(requesterAgentId);
		return {
			allowAny: true,
			allowedIds: sortUniqueStrings(configuredIds)
		};
	}
	const configuredIds = normalizeConfiguredAgentIds(params.configuredAgentIds);
	return {
		allowAny: false,
		allowedIds: [...policy].filter((id) => configuredIds.has(id)).toSorted((a, b) => a.localeCompare(b))
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
	if (allowed.allowAny || policy?.has(targetAgentId)) return {
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
			await registerSubagentRun(registration, {
				assertCurrent: params.assertActive,
				retainOwnership: (scope) => {
					registrationScope = scope;
					params.adapter.retainRegistrationScope?.(scope);
				}
			});
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
function resolveRequesterBoundConversationRef(params) {
	const requesterSessionKey = normalizeOptionalString(params.requesterSessionKey);
	if (!requesterSessionKey) return;
	const activeBindings = params.bindingService.listBySession(requesterSessionKey).filter((record) => record.status !== "ended" && record.conversation.channel === params.channel && (record.conversation.accountId ?? params.accountId) === params.accountId);
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
//#region src/agents/spawn-requester-origin.ts
const KIND_PREFIX_TO_CHAT_TYPE = /* @__PURE__ */ new Map([
	["room:", "channel"],
	["channel:", "channel"],
	["conversation:", "channel"],
	["chat:", "channel"],
	["thread:", "channel"],
	["topic:", "channel"],
	["group:", "group"],
	["team:", "group"],
	["user:", "direct"],
	["dm:", "direct"],
	["pm:", "direct"]
]);
const GENERIC_PREFIX_PATTERN = /^[a-z][a-z0-9_-]*:/i;
function inferPeerKindFromBareId(value) {
	if (value.startsWith("@")) return "direct";
	if (value.startsWith("!") || value.startsWith("#")) return "channel";
}
function extractRequesterPeer(channelId, requesterTo) {
	if (!requesterTo) return {};
	const raw = requesterTo.trim();
	if (!raw) return {};
	const normalizedChannel = channelId?.trim().toLowerCase();
	const channelPrefix = normalizedChannel ? `${normalizedChannel}:` : void 0;
	let inferredKind;
	let allowBareIdKindOverride = false;
	let value = raw;
	while (true) {
		const match = GENERIC_PREFIX_PATTERN.exec(value);
		if (!match) break;
		const prefix = match[0].toLowerCase();
		const kindFromPrefix = KIND_PREFIX_TO_CHAT_TYPE.get(prefix);
		if (!kindFromPrefix && prefix !== channelPrefix) break;
		inferredKind ??= kindFromPrefix;
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
function resolveSubagentThinkingOverride(params) {
	const resolvedThinkingDefaultRaw = normalizeOptionalString(params.requesterAgentConfig?.subagents?.thinking) ?? normalizeOptionalString(params.targetAgentConfig?.subagents?.thinking) ?? normalizeOptionalString(params.cfg.agents?.defaults?.subagents?.thinking);
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
		modelRef: choice.ref,
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
		alias
	}) : alias;
	const completionOwnerKey = params.completionOwnerKey?.trim();
	const completionRequesterSessionKey = completionOwnerKey ? resolveInternalSessionKey({
		key: completionOwnerKey,
		alias
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
//#region src/agents/subagents/spawn/spawn-parent-lineage.ts
const PARENT_CHANGED_ERROR = "Parent session changed before spawn; retry from the current turn.";
/**
* Captures the parent incarnation a spawned child records in its lineage receipt.
* A stored parent must still be the spawning turn's incarnation, and it is re-read
* through the caller's session read worker immediately before the child commits.
* A stale receipt can only deny memory access later; the recheck rejects it early.
* A rowless parent records no incarnation and grants nothing, so it spawns as before.
*/
function captureSpawnParentLineage(params) {
	const { parentEntry } = params;
	if (parentEntry && params.expectedParentSessionId !== void 0 && parentEntry.sessionId !== params.expectedParentSessionId) throw new Error(PARENT_CHANGED_ERROR);
	return {
		receipt: buildSpawnAuthorityReceipt(parentEntry, params.senderIsOwner),
		assertParentUnchanged: async () => {
			if (!parentEntry) return;
			const latest = await params.readParentEntry();
			if (latest?.sessionId !== parentEntry.sessionId || latest.lifecycleRevision !== parentEntry.lifecycleRevision) throw new Error(PARENT_CHANGED_ERROR);
		}
	};
}
//#endregion
//#region src/agents/subagents/spawn/spawn-thread-binding.ts
function buildSpawnThreadBinding(params) {
	const { cfg, agentId, label, binding } = params;
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
				idleTimeoutMs: resolveThreadBindingIdleTimeoutMsForChannel({
					cfg,
					channel: binding.channel,
					accountId: binding.accountId
				}),
				maxAgeMs: resolveThreadBindingMaxAgeMsForChannel({
					cfg,
					channel: binding.channel,
					accountId: binding.accountId
				}),
				sessionCwd: params.sessionCwd,
				sessionDetails: params.sessionDetails
			})
		}
	};
}
//#endregion
export { summarizeSpawnError as _, resolveSubagentModelAndThinkingPlan as a, resolveSubagentAllowedTargetIds as b, resolveRequesterOriginForChild as c, resolveSpawnAdmission as d, resolveSpawnChannelAccountId as f, runSpawnPipeline as g, reserveChildAdmissionSlot as h, resolveConfiguredSubagentRunTimeoutSeconds as i, mintSpawnSessionKey as l, resolveSpawnSandboxError as m, captureSpawnParentLineage as n, splitModelRef as o, resolveSpawnMode as p, resolveSubagentSpawnOwnership as r, resolveSubagentThinkingOverride as s, buildSpawnThreadBinding as t, prepareSpawnThreadBinding as u, readParentExecutionIdentity as v, withParentExecutionIdentity as y };
