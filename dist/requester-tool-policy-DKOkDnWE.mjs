import { i as normalizeMainKey } from "./session-key-CmZ4o9-l.mjs";
import "./session-key-C09ow4h0.mjs";
import { g as resolveSessionAgentId } from "./agent-scope-CG17uXFn.mjs";
import { r as resolveAgentMainSessionKey } from "./main-session-00MgEWj5.mjs";
import { h as normalizeInputProvenance } from "./input-provenance-D1LHo5Qj.mjs";
import { n as resolvePersistedSubagentToolPolicyEnvelope, s as resolveSubagentCapabilityStore, t as isSubagentEnvelopeSession } from "./subagent-capabilities-DD6QCsqy.mjs";
import { a as resolveSubagentToolPolicyForSession, i as resolveInheritedToolPolicyForSession, r as resolveGroupToolPolicy } from "./agent-tools.policy-Ni4Rljqy.mjs";
import { t as resolveSenderToolPolicy } from "./sender-tool-policy-Ck68dqxT.mjs";
import "./internal-event-contract-pF6FHp8g.mjs";
//#region src/agents/subagents/announce/subagent-announce-handoff.ts
function resolveExactSubagentCompletionEvent(params) {
	if (params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_announce") return;
	const completionEvents = params.internalEvents?.filter((event) => event.type === "task_completion" && event.source === "subagent");
	const completionEvent = completionEvents?.length === 1 ? completionEvents[0] : void 0;
	return completionEvent?.childSessionKey === params.inputProvenance.sourceSessionKey ? completionEvent : void 0;
}
/** Identifies the delivery-only turn that hands a completed subagent result to its requester. */
function isSubagentAnnounceCompletionHandoff(params) {
	if (params.inputProvenance?.kind !== "inter_session" || params.inputProvenance.sourceTool !== "subagent_announce") return false;
	return params.internalEvents?.some((event) => event.type === "task_completion" && event.source === "subagent") === true;
}
/** Verify that a consumed in-process handoff still matches this exact model attempt. */
function isTrustedSubagentCompletionHandoffForRun(params) {
	const handoff = params.handoff;
	const completionEvent = resolveExactSubagentCompletionEvent({
		inputProvenance: params.inputProvenance,
		internalEvents: params.internalEvents
	});
	if (!handoff || handoff.kind !== "subagent-completion" || params.inputProvenance?.kind !== "inter_session" || (handoff.settleBatch ? params.inputProvenance.sourceTool !== "subagent_settle" || !handoff.settleBatch.isCurrent() : params.inputProvenance.sourceTool !== "subagent_announce" || params.internalEvents !== void 0 && !completionEvent)) return false;
	return handoff.sourceSessionKey === params.inputProvenance.sourceSessionKey && (handoff.settleBatch !== void 0 || params.internalEvents === void 0 || handoff.sourceSessionId === completionEvent?.childSessionId) && handoff.targetSessionKey === params.sessionKey && handoff.targetSessionId === params.sessionId && handoff.provider === params.provider?.trim().toLowerCase() && handoff.model === params.model?.trim();
}
//#endregion
//#region src/agents/subagents/announce/subagent-requester-store-key.ts
function resolveRequesterStoreKey(cfg, requesterSessionKey, explicitAgentId) {
	const raw = (requesterSessionKey ?? "").trim();
	if (!raw || raw === "global" || raw === "unknown" || raw.startsWith("agent:")) return raw;
	const agentId = resolveSessionAgentId({
		sessionKey: raw,
		config: cfg,
		agentId: explicitAgentId
	});
	const mainKey = normalizeMainKey(cfg?.session?.mainKey);
	if (raw === "main" || raw === mainKey) return cfg.session?.scope === "global" ? "global" : resolveAgentMainSessionKey({
		cfg,
		agentId
	});
	return `agent:${agentId}:${raw}`;
}
function policyFromEnvelope(envelope) {
	if (!envelope) return;
	return envelope.inheritedToolAllow.length > 0 || envelope.inheritedToolDeny.length > 0 ? {
		...envelope.inheritedToolAllow.length > 0 ? { allow: envelope.inheritedToolAllow } : {},
		...envelope.inheritedToolDeny.length > 0 ? { deny: envelope.inheritedToolDeny } : {}
	} : void 0;
}
function resolveDelegatedPolicy(params, subagentStore) {
	const provenance = normalizeInputProvenance(params.inputProvenance);
	const hasExternalRequester = provenance?.kind === "external_user" || Boolean(params.senderId || params.senderName || params.senderUsername || params.senderE164);
	if (isTrustedSubagentCompletionHandoffForRun({
		handoff: params.trustedInternalHandoff,
		inputProvenance: provenance,
		sessionKey: params.sessionKey,
		sessionId: params.sessionId,
		provider: params.modelProvider,
		model: params.modelId
	})) {
		if (!provenance?.sourceSessionKey || !params.sessionKey) return { delegated: false };
		if (!params.config) throw new Error("Trusted internal handoff policy resolution requires configuration.");
		const config = params.config;
		const targetSessionKey = resolveRequesterStoreKey(config, params.sessionKey);
		const settleBatch = params.trustedInternalHandoff?.settleBatch;
		const envelopes = (settleBatch?.sourceSessionKeys ?? [provenance.sourceSessionKey]).map((sourceSessionKey) => {
			let currentSessionKey = resolveRequesterStoreKey(config, sourceSessionKey);
			const visited = /* @__PURE__ */ new Set();
			for (let depth = 0; depth < 32; depth += 1) {
				if (visited.has(currentSessionKey)) return;
				visited.add(currentSessionKey);
				const completionStore = resolveSubagentCapabilityStore(currentSessionKey, {
					cfg: config,
					store: params.preparedSessionCapabilityStore
				});
				const envelope = resolvePersistedSubagentToolPolicyEnvelope(currentSessionKey, {
					cfg: config,
					store: completionStore
				});
				if (!envelope) return;
				const parentSessionKey = resolveRequesterStoreKey(config, envelope.spawnedBy);
				if (((envelope.completionOwnerSessionKey ? resolveRequesterStoreKey(config, envelope.completionOwnerSessionKey) : void 0) ?? parentSessionKey) === targetSessionKey) return envelope;
				currentSessionKey = parentSessionKey;
			}
		});
		const envelope = envelopes[0];
		if (settleBatch) {
			const policyKey = (entry) => JSON.stringify([entry.inheritedToolAllow.toSorted(), entry.inheritedToolDeny.toSorted()]);
			if (!envelope || envelopes.some((entry) => !entry || policyKey(entry) !== policyKey(envelope))) return { delegated: false };
		}
		return envelope ? {
			delegated: true,
			source: "completion-handoff",
			policy: policyFromEnvelope(envelope)
		} : { delegated: false };
	}
	if (!hasExternalRequester) {
		const ownEnvelope = resolvePersistedSubagentToolPolicyEnvelope(params.subagentSessionKey, {
			cfg: params.config,
			store: subagentStore
		});
		if (ownEnvelope) return {
			delegated: true,
			source: "persisted-child",
			policy: policyFromEnvelope(ownEnvelope)
		};
	}
	return { delegated: false };
}
/** Confirms that an exact consumed completion capability also owns persisted requester lineage. */
function hasVerifiedRequesterCompletionHandoff(params) {
	const delegatedPolicy = resolveDelegatedPolicy(params, void 0);
	return delegatedPolicy.delegated && delegatedPolicy.source === "completion-handoff";
}
/** Resolve sender/group policy or a verified inherited projection, never both. */
function resolveRequesterToolPolicies(params) {
	const subagentSessionKey = params.subagentSessionKey ?? params.sessionKey;
	const subagentStore = resolveSubagentCapabilityStore(subagentSessionKey, {
		cfg: params.config,
		preparedSessionEntry: params.preparedSessionEntry,
		store: params.preparedSessionCapabilityStore
	});
	const delegatedPolicy = resolveDelegatedPolicy({
		...params,
		subagentSessionKey
	}, subagentStore);
	const subagentPolicy = subagentSessionKey && isSubagentEnvelopeSession(subagentSessionKey, {
		cfg: params.config,
		store: subagentStore
	}) ? resolveSubagentToolPolicyForSession(params.config, subagentSessionKey, { store: subagentStore }) : void 0;
	if (delegatedPolicy.delegated) return {
		delegated: true,
		requesterPolicySource: delegatedPolicy.source,
		subagentPolicy,
		inheritedToolPolicy: delegatedPolicy.policy,
		subagentStore
	};
	const senderPolicyMode = params.senderPolicyMode ?? "always";
	const shouldResolveSenderPolicy = senderPolicyMode === "always" || senderPolicyMode === "when-sender-id" && Boolean(params.senderId);
	return {
		delegated: false,
		requesterPolicySource: "current-request",
		groupPolicy: params.conversationPolicy ?? resolveGroupToolPolicy({
			config: params.config,
			sessionKey: params.groupPolicySessionKey ?? params.sessionKey,
			spawnedBy: params.spawnedBy,
			messageProvider: params.messageProvider ?? void 0,
			groupId: params.groupId,
			groupChannel: params.groupChannel,
			groupSpace: params.groupSpace,
			accountId: params.accountId,
			requireConfiguredAccount: params.requireConfiguredGroupAccount,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164,
			senderPolicyMode: senderPolicyMode === "never" ? "never" : "always"
		}),
		senderPolicy: shouldResolveSenderPolicy ? resolveSenderToolPolicy({
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			messageProvider: params.messageProvider,
			senderId: params.senderId,
			senderName: params.senderName,
			senderUsername: params.senderUsername,
			senderE164: params.senderE164
		}) : void 0,
		subagentPolicy,
		inheritedToolPolicy: resolveInheritedToolPolicyForSession(params.config, subagentSessionKey, { store: subagentStore }),
		subagentStore
	};
}
//#endregion
export { isTrustedSubagentCompletionHandoffForRun as a, isSubagentAnnounceCompletionHandoff as i, resolveRequesterToolPolicies as n, resolveExactSubagentCompletionEvent as o, resolveRequesterStoreKey as r, hasVerifiedRequesterCompletionHandoff as t };
