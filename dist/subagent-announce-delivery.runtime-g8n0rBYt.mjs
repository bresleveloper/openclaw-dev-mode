import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { T as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-CDYpzA0r.mjs";
import { i as normalizeMainKey } from "./session-key-CmZ4o9-l.mjs";
import { M as parseAgentSessionKey } from "./session-key-C09ow4h0.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-CnfJSmam.mjs";
import "./legacy.default-agent-owner-CiZjlN5C.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CPntde4x.mjs";
import "./config-CzeZu5J_.mjs";
import "./hook-runner-global-eJIIEpha.mjs";
import { o as loadSessionEntryReadOnly } from "./session-accessor.sqlite-entry-AwYVLytL.mjs";
import { u as withSessionEntryReadOnlyInWorker } from "./session-entry-read-runtime-qEzTuOKY.mjs";
import "./session-accessor-cUVSaeKy.mjs";
import { d as isEmbeddedAgentRunActive } from "./runs-BErx7xDZ.mjs";
import { i as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-B86tDIo_.mjs";
import "./sessions-DNhLX2Ep.mjs";
import { i as listSessionBindingsBySessionAsync } from "./session-binding-service-DzGpg6K8.mjs";
import { i as normalizeConversationRef } from "./current-conversation-binding-row-BCcBsEeZ.mjs";
import { r as resolveRequesterStoreKey } from "./requester-tool-policy-DKOkDnWE.mjs";
import "./queue-CuG9CD9y.mjs";
import "./best-effort-delivery-CkLHXrp-.mjs";
import "./message-C1Hs-IRg.mjs";
//#region src/infra/outbound/bound-delivery-router.ts
function resolveBindingForRequester(requester, bindings) {
	let exactBinding = null;
	let matchingBinding = null;
	let matchingCount = 0;
	for (const entry of bindings) {
		const conversation = normalizeConversationRef(entry.conversation);
		if (conversation.channel !== requester.channel || conversation.accountId !== requester.accountId) continue;
		if (conversation.conversationId === requester.conversationId) exactBinding ??= entry;
		matchingBinding = entry;
		matchingCount += 1;
	}
	return exactBinding ?? (matchingCount === 1 ? matchingBinding : null);
}
const fallbackDestination = (reason) => ({
	binding: null,
	mode: "fallback",
	reason
});
const boundDestination = (binding, reason) => ({
	binding,
	mode: "bound",
	reason
});
/** Creates a router that resolves task-completion delivery through active session bindings. */
function createBoundDeliveryRouter(listBySession = listSessionBindingsBySessionAsync) {
	return { resolveDestination: async (input) => {
		const targetSessionKey = input.targetSessionKey.trim();
		const requester = input.requester ? normalizeConversationRef(input.requester) : void 0;
		const failClosed = input.failClosed;
		if (!targetSessionKey) return fallbackDestination("missing-target-session");
		const activeBindings = (await listBySession(targetSessionKey)).filter((record) => record.status === "active");
		if (activeBindings.length === 0) return fallbackDestination("no-active-binding");
		if (!requester) {
			if (failClosed) return fallbackDestination("missing-requester");
			if (activeBindings.length === 1) return boundDestination(activeBindings[0] ?? null, "single-active-binding");
			return fallbackDestination("ambiguous-without-requester");
		}
		if (!requester.channel || !requester.conversationId) return fallbackDestination("invalid-requester");
		const fromRequester = resolveBindingForRequester(requester, activeBindings);
		if (fromRequester) return boundDestination(fromRequester, "requester-match");
		if (activeBindings.length === 1 && !failClosed) return boundDestination(activeBindings[0] ?? null, "single-active-binding-fallback");
		return fallbackDestination("no-requester-match");
	} };
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-delivery.runtime.ts
function tryResolveSubagentRequesterAgentId(cfg, requesterSessionKey, explicitAgentId) {
	const requestedAgentId = explicitAgentId?.trim() ? normalizeAgentId(explicitAgentId) : void 0;
	const parsedAgentId = parseAgentSessionKey(requesterSessionKey)?.agentId;
	if (requestedAgentId && parsedAgentId && requestedAgentId !== parsedAgentId) return;
	const persistedStoreOwner = resolvePersistedSessionStoreOwnerForKey(cfg, requesterSessionKey);
	if (persistedStoreOwner.kind === "retired") return;
	if (requestedAgentId && persistedStoreOwner.kind === "configured" && requestedAgentId !== persistedStoreOwner.agentId) return;
	const resolvedAgentId = requestedAgentId ?? parsedAgentId;
	if (resolvedAgentId) return resolvedAgentId;
	return (persistedStoreOwner.kind === "configured" ? persistedStoreOwner.agentId : void 0) ?? tryResolveLegacyCompatibilityAgentId(cfg);
}
function loadRequesterSessionEntry(requesterSessionKey, explicitAgentId) {
	const cfg = getRuntimeConfig();
	const rawStorageKey = requesterSessionKey.trim();
	const canonicalKey = resolveRequesterStoreKey(cfg, requesterSessionKey, explicitAgentId);
	const configuredMainKey = normalizeMainKey(cfg.session?.mainKey);
	const storageKey = rawStorageKey === "main" || rawStorageKey === configuredMainKey ? canonicalKey : rawStorageKey;
	const agentId = tryResolveSubagentRequesterAgentId(cfg, rawStorageKey, explicitAgentId);
	if (!agentId) return {
		cfg,
		entry: void 0,
		canonicalKey
	};
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	return {
		cfg,
		entry: loadSessionEntryReadOnly({
			storePath,
			sessionKey: storageKey,
			agentId,
			clone: false
		}),
		canonicalKey,
		agentId,
		storePath
	};
}
function getSubagentRequesterSessionActivity(requesterSessionKey, requester) {
	if (!requester.agentId) return { isActive: false };
	const storedSessionId = requester.entry?.sessionId;
	const sessionId = (parseAgentSessionKey(requesterSessionKey) ? resolveActiveEmbeddedRunSessionId(requesterSessionKey) : void 0) ?? storedSessionId;
	return {
		sessionId,
		isActive: Boolean(sessionId && isEmbeddedAgentRunActive(sessionId))
	};
}
async function loadSessionEntryByKey(sessionKey, explicitAgentId) {
	const cfg = getRuntimeConfig();
	const agentId = tryResolveSubagentRequesterAgentId(cfg, sessionKey, explicitAgentId);
	if (!agentId) return;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	return await withSessionEntryReadOnlyInWorker({
		storePath,
		sessionKey,
		agentId,
		projection: "list"
	}, () => {}, async (read) => {
		if (!read.ok) throw read.error;
		return read.value;
	});
}
//#endregion
export { createBoundDeliveryRouter as a, tryResolveSubagentRequesterAgentId as i, loadRequesterSessionEntry as n, loadSessionEntryByKey as r, getSubagentRequesterSessionActivity as t };
