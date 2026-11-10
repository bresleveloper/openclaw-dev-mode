import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as normalizeAgentId } from "./agent-id-D1-Q6vR4.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { a as normalizeMainKey, i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { M as parseAgentSessionKey } from "./session-key-CSDERtm3.mjs";
import { E as tryResolveLegacyCompatibilityAgentId } from "./agent-scope-config-fjA2T9Gz.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { n as resolvePersistedSessionStoreOwnerForKey } from "./session-store-owner-iJNKNMuJ.mjs";
import "./legacy.default-agent-owner-Blrs2q29.mjs";
import { A as projectSessionSharingEntry, v as retainPreparedSessionSharingFacts } from "./session-accessor.sqlite-entry-cache-publication-state-4Z0giEC3.mjs";
import { n as captureSessionActorStorageOwner } from "./session-actor-storage-binding-oCtbPk00.mjs";
import { i as readSessionEntryReadOnlyInWorker, s as withSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import "./session-accessor.sqlite-entry-cache-BGcjBaH_.mjs";
import "./config-B3oiWDlr.mjs";
import "./sessions-CnzPI1yx.mjs";
import "./hook-runner-global-yjqy4fXI.mjs";
import { n as isEmbeddedAgentRunActive, o as resolveActiveEmbeddedRunSessionId } from "./active-run-projections-Crpg2l0z.mjs";
import "./runs-Czr-I6_B.mjs";
import { x as normalizeConversationRef } from "./current-conversation-bindings.kernel-CQnqjy0h.mjs";
import { a as listSessionBindingsBySessionAsync } from "./session-binding-service-ByKk9LiJ.mjs";
import { r as resolveRequesterStoreKey } from "./requester-tool-policy-BmPXAdVs.mjs";
import { t as withSubagentSessionSource } from "./subagent-session-source-b7OOANca.mjs";
import "./queue-Cz-W2oxX.mjs";
import "./best-effort-delivery-C0AupLCM.mjs";
import "./message-CUtguTA0.mjs";
//#region src/infra/outbound/bound-delivery-router.ts
/** Resolves task-completion delivery only within the requester's conversation scope. */
async function resolveBoundDeliveryDestination(input) {
	const targetSessionKey = input.targetSessionKey.trim();
	const requester = input.requester ? normalizeConversationRef(input.requester) : void 0;
	if (!targetSessionKey) return null;
	const activeBindings = (await listSessionBindingsBySessionAsync(targetSessionKey)).filter((record) => record.status === "active");
	if (!requester?.channel || !requester.conversationId) return null;
	const matchingBindings = activeBindings.map((record) => ({
		record,
		conversation: normalizeConversationRef(record.conversation)
	})).filter(({ conversation }) => conversation.channel === requester.channel && conversation.accountId === requester.accountId);
	return matchingBindings.find(({ conversation }) => conversation.conversationId === requester.conversationId)?.record ?? (matchingBindings.length === 1 ? matchingBindings[0].record : null);
}
//#endregion
//#region src/agents/subagents/announce/subagent-announce-delivery.runtime.ts
function hasUsableSessionEntry(entry) {
	if (!isRecord(entry)) return false;
	const sessionId = entry.sessionId;
	return typeof sessionId !== "string" || sessionId.trim() !== "";
}
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
function resolveRequesterSessionEntryScope(requesterSessionKey, explicitAgentId) {
	const cfg = readRuntimeConfig();
	const rawStorageKey = requesterSessionKey.trim();
	const canonicalKey = resolveRequesterStoreKey(cfg, requesterSessionKey, explicitAgentId);
	const configuredMainKey = normalizeMainKey(cfg.session?.mainKey);
	const storageKey = rawStorageKey === "main" || rawStorageKey === configuredMainKey ? canonicalKey : rawStorageKey;
	const agentId = tryResolveSubagentRequesterAgentId(cfg, rawStorageKey, explicitAgentId);
	if (!agentId) return {
		cfg,
		canonicalKey,
		storageKey
	};
	return {
		cfg,
		canonicalKey,
		agentId,
		storePath: resolveSessionStorePathCore(cfg.session?.store, { agentId }),
		storageKey
	};
}
async function loadRequesterSessionEntry(requesterSessionKey, explicitAgentId) {
	const { storageKey, ...resolved } = resolveRequesterSessionEntryScope(requesterSessionKey, explicitAgentId);
	if (!resolved.agentId) return {
		...resolved,
		entry: void 0
	};
	const scope = {
		storePath: resolved.storePath,
		sessionKey: storageKey,
		agentId: resolved.agentId,
		clone: false
	};
	return withSubagentSessionSource({
		agentId: resolved.agentId,
		sessionKey: storageKey
	}, async (source) => {
		const storePath = source?.path ?? resolved.storePath;
		const entry = source ? source.actor.snapshot(source.authority)?.entry : isIncognitoSessionKey(storageKey) ? void 0 : await readSessionEntryReadOnlyInWorker({
			...scope,
			storePath
		});
		return {
			...resolved,
			storePath,
			entry
		};
	});
}
/** Prepare once; effect guards consume the session writer's published facts. */
async function captureRequesterSessionEntryCurrent(requesterSessionKey, explicitAgentId) {
	const source = captureSessionActorStorageOwner({
		sessionKey: requesterSessionKey,
		agentId: explicitAgentId
	}, {
		assertCurrent() {},
		authorize() {}
	});
	if (source) return {
		readCurrent: () => source.binding?.actor.target.sessionKey === requesterSessionKey ? source.binding.actor.snapshot(source.authority)?.entry : source.owner?.readSession(requesterSessionKey, source.authority)?.entry,
		release() {}
	};
	const { storageKey, agentId, storePath } = resolveRequesterSessionEntryScope(requesterSessionKey, explicitAgentId);
	if (!agentId || !storePath) return {
		readCurrent: () => void 0,
		release() {}
	};
	return withSessionEntriesFromStoreInWorker({
		storePath,
		agentId,
		sessionKeys: [storageKey],
		snapshotFields: [],
		includeAuthorization: true
	}, async ({ result }) => {
		const entry = result.entries[0]?.entry;
		const databaseIdentity = result.databaseIdentity?.identity;
		if (!databaseIdentity) return {
			readCurrent: () => void 0,
			release() {}
		};
		const retained = retainPreparedSessionSharingFacts({
			databaseIdentity: `file:${databaseIdentity}`,
			sessionKey: storageKey,
			entry: entry ? projectSessionSharingEntry(entry) : void 0,
			membership: /* @__PURE__ */ new Set()
		});
		return {
			readCurrent: () => retained.readCurrent()?.entry,
			release: retained.release
		};
	});
}
/** Selected requesters retain their actor through all consumers and accepted settlement. */
function withSubagentRequesterSource(requesterSessionKey, explicitAgentId, consume) {
	const agentId = explicitAgentId ?? parseAgentSessionKey(requesterSessionKey)?.agentId;
	if (!agentId) return consume();
	return withSubagentSessionSource({
		agentId,
		sessionKey: requesterSessionKey
	}, async (source) => {
		if (!source) return consume(isIncognitoSessionKey(requesterSessionKey) ? () => false : void 0);
		const current = await captureRequesterSessionEntryCurrent(requesterSessionKey, agentId);
		const isCurrent = () => {
			try {
				return current.readCurrent() !== void 0;
			} catch {
				return false;
			}
		};
		try {
			return await consume(isCurrent);
		} finally {
			current.release();
		}
	});
}
/** Compose requester authority with the caller's guards without replacing either owner. */
function withSubagentRequesterDelivery(requesterSessionKey, params, consume) {
	return withSubagentRequesterSource(requesterSessionKey, params.requesterAgentId, (isCurrent) => consume(isCurrent ? {
		...params,
		isSourceSessionEffectsAllowed: () => isCurrent() && params.isSourceSessionEffectsAllowed?.() !== false,
		isSourceSessionAdmissionAllowed: () => isCurrent() && params.isSourceSessionAdmissionAllowed?.() !== false
	} : params));
}
function getSubagentRequesterSessionActivity(requesterSessionKey, requester) {
	if (!requester.agentId) return { isActive: false };
	const storedSessionId = requester.entry?.sessionId;
	const sessionId = (!isIncognitoSessionKey(requesterSessionKey) && parseAgentSessionKey(requesterSessionKey) ? resolveActiveEmbeddedRunSessionId(requesterSessionKey) : void 0) ?? storedSessionId;
	return {
		sessionId,
		isActive: Boolean(sessionId && isEmbeddedAgentRunActive(sessionId))
	};
}
async function loadSessionEntryByKey(sessionKey, explicitAgentId) {
	const cfg = readRuntimeConfig();
	const agentId = tryResolveSubagentRequesterAgentId(cfg, sessionKey, explicitAgentId);
	if (!agentId) return;
	const storePath = resolveSessionStorePathCore(cfg.session?.store, { agentId });
	return withSubagentSessionSource({
		agentId,
		sessionKey
	}, async (source) => source ? source.actor.snapshot(source.authority)?.entry : isIncognitoSessionKey(sessionKey) ? void 0 : readSessionEntryReadOnlyInWorker({
		storePath,
		sessionKey,
		agentId,
		projection: "list"
	}));
}
//#endregion
export { loadSessionEntryByKey as a, withSubagentRequesterSource as c, loadRequesterSessionEntry as i, resolveBoundDeliveryDestination as l, getSubagentRequesterSessionActivity as n, tryResolveSubagentRequesterAgentId as o, hasUsableSessionEntry as r, withSubagentRequesterDelivery as s, captureRequesterSessionEntryCurrent as t };
