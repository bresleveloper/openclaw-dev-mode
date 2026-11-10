import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { o as parseUsageCountedSessionIdFromFileName } from "./transcript-file-names-BZ8jA63H.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import { g as resolveSessionAgentIdStrict } from "./agent-scope-DXrnO3F4.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-BNNxukz6.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./agent-scope-runtime-Dld1eD8B.mjs";
import { a as resolveEffectiveSessionToolsVisibility, o as resolveSandboxSessionToolsVisibility, r as createSessionVisibilityGuard, t as createAgentToAgentPolicy } from "./session-visibility-CMzmBVR3.mjs";
import "./session-store-runtime-DVNFhqCK.mjs";
import "./session-store-paths-BdzlbB7M.mjs";
import { a as resolveTranscriptStemToSessionKeys, t as extractTranscriptIdentityFromSessionsMemoryHit } from "./session-transcript-hit-Xi9vo7lx.mjs";
import { c as readSessionResetRecallCutoff, i as loadMemorySearchSessionStore } from "./memory-core-host-engine-sessions-D3l0Zm6q.mjs";
import { t as listSessionTranscriptArchivesInWorker } from "./session-transcript-inventory-runtime-Ci94oSyU.mjs";
import "./memory-core-host-runtime-core-CNLFAky0.mjs";
import { t as readSessionArchiveReasonFromHitPath } from "./session-reset-recall-metadata-_gATHFyh.mjs";
//#region extensions/memory-core/src/session-search-visibility.ts
function isGlobalSessionKeyForSharedScope(cfg, key) {
	return cfg.session?.scope === "global" && key.trim().toLowerCase() === "global";
}
function isSameStoredTranscript(anchor, candidate) {
	const anchorSessionId = anchor?.sessionId.trim();
	const anchorSessionFile = normalizeOptionalString(anchor?.sessionFile);
	return Boolean(anchorSessionId && candidate?.sessionId.trim() === anchorSessionId || anchorSessionFile && normalizeOptionalString(candidate?.sessionFile) === anchorSessionFile);
}
function isPrivateConversation(params) {
	if (!params.entry) return false;
	const key = params.key.trim().toLowerCase();
	const chatTypes = [params.entry.chatType, sessionDeliveryOrigin(params.entry)?.chatType].filter((chatType) => chatType !== void 0);
	if (chatTypes.some((chatType) => chatType === "group" || chatType === "channel") || /:active-memory:[a-f0-9]{12}$/i.test(key)) return false;
	const prefix = `agent:${params.agentId.trim().toLowerCase()}:`;
	if (key === "global" || key === `${prefix}global`) return false;
	if (key.startsWith(`${prefix}explicit:`)) return chatTypes.length > 0 && chatTypes.every((chatType) => chatType === "direct");
	if (key.includes(":group:") || key.includes(":channel:") || /:(?:active-memory|cron|heartbeat|hook|node|subagent)(?::|$)/.test(key)) return false;
	if (chatTypes.length > 0) return chatTypes.every((chatType) => chatType === "direct");
	return key.includes(":direct:") || key.includes(":dm:");
}
function anchorAliasesArePrivate(params) {
	return Object.entries(params.store).every(([key, entry]) => key === params.anchorSessionKey || !isSameStoredTranscript(params.anchorEntry, entry) || isPrivateConversation({
		agentId: params.agentId,
		entry,
		key
	}));
}
function isTrustedRecallRequester(params) {
	const requesterSessionKey = params.requesterSessionKey?.trim();
	if (!requesterSessionKey || !requesterSessionKey.startsWith(params.anchorSessionKey)) return false;
	const recallSuffix = requesterSessionKey.slice(params.anchorSessionKey.length);
	return recallSuffix.length === 0 || /^:active-memory:[a-f0-9]{12}$/i.test(recallSuffix);
}
function filterSessionKeysByScopedAgent(params) {
	const scopedAgentId = normalizeOptionalLowercaseString(params.scopedAgentId);
	if (!scopedAgentId) return params.keys;
	return params.keys.filter((key) => {
		if (isGlobalSessionKeyForSharedScope(params.cfg, key)) return true;
		const ownerAgentId = resolveSessionAgentIdStrict({
			sessionKey: key,
			config: params.cfg
		});
		return normalizeOptionalLowercaseString(ownerAgentId) === scopedAgentId;
	});
}
async function filterMemorySearchHitsBySessionVisibility(params) {
	if (!params.hits.some((hit) => hit.source === "sessions")) return params.conversationRecall?.corpus === "sessions" ? [] : params.hits;
	const visibility = resolveEffectiveSessionToolsVisibility({
		cfg: params.cfg,
		sandboxed: params.sandboxed
	});
	const a2aPolicy = createAgentToAgentPolicy(params.cfg);
	const requesterAgentId = params.requesterSessionKey ? resolveSessionAgentIdStrict({
		sessionKey: params.requesterSessionKey,
		config: params.cfg,
		agentId: params.agentId
	}) : void 0;
	const scopedAgentId = params.agentId?.trim() || requesterAgentId;
	const identities = new Map(params.hits.filter((hit) => hit.source === "sessions").map((hit) => [hit.path, extractTranscriptIdentityFromSessionsMemoryHit(hit.path)]));
	const archiveNames = [...new Set(params.hits.flatMap((hit) => {
		const name = identities.get(hit.path)?.archived ? hit.path.replace(/\\/g, "/").split("/").at(-1) : void 0;
		return name ? [name] : [];
	}))];
	const archives = archiveNames.length ? await listSessionTranscriptArchivesInWorker({
		agentId: scopedAgentId,
		archiveNames,
		storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId: scopedAgentId })
	}) : [];
	const archivedSessionsByName = new Map(archives.map((archive) => [archive.archiveName, archive]));
	const guard = params.requesterSessionKey ? await createSessionVisibilityGuard({
		action: "history",
		requesterSessionKey: params.requesterSessionKey,
		requesterAgentId,
		mainSessionKey: requesterAgentId && (!params.sandboxed || resolveSandboxSessionToolsVisibility(params.cfg) === "all") ? resolveCanonicalMainSessionKey({
			agentId: requesterAgentId,
			mainKey: params.cfg.session?.mainKey,
			sessionScope: params.cfg.session?.scope
		}) : void 0,
		visibility,
		a2aPolicy
	}) : null;
	const conversationRecall = params.conversationRecall;
	const trustedAgentScope = Boolean(params.trustedAgentScope && scopedAgentId && !params.requesterSessionKey && !conversationRecall);
	if (!params.requesterSessionKey && !trustedAgentScope) return conversationRecall?.corpus === "sessions" ? [] : params.hits.filter((hit) => hit.source !== "sessions");
	const anchorSessionKey = conversationRecall?.anchorSessionKey.trim();
	const sessionKeys = new Set(archives.map((archive) => archive.sessionKey));
	if (params.requesterSessionKey) sessionKeys.add(params.requesterSessionKey);
	if (anchorSessionKey) sessionKeys.add(anchorSessionKey);
	const sessionIds = /* @__PURE__ */ new Set();
	for (const [path, identity] of identities) {
		if (!identity) continue;
		const archive = identity.archived ? archivedSessionsByName.get(path.replace(/\\/g, "/").split("/").at(-1) ?? "") : void 0;
		if (archive?.sessionKey) continue;
		if (identity.archived && identity.ownerAgentId) sessionKeys.add(`agent:${identity.ownerAgentId}:${identity.stem}`);
		const stem = archive?.sessionId ?? identity.stem;
		sessionIds.add(stem);
		const parsedId = parseUsageCountedSessionIdFromFileName(stem.endsWith(".jsonl") ? stem : `${stem}.jsonl`);
		if (parsedId) sessionIds.add(parsedId);
	}
	const { store: combinedSessionStore, storePath } = await loadMemorySearchSessionStore(params.cfg, {
		agentId: scopedAgentId,
		sessionKeys: [...sessionKeys],
		sessionIds: [...sessionIds]
	});
	const recallAgentId = anchorSessionKey ? resolveSessionAgentIdStrict({
		sessionKey: anchorSessionKey,
		config: params.cfg
	}) : void 0;
	const anchorEntry = anchorSessionKey ? combinedSessionStore[anchorSessionKey] : void 0;
	let anchorResetCutoffPromise;
	const resolveAnchorResetCutoff = () => {
		if (anchorResetCutoffPromise) return anchorResetCutoffPromise;
		const sessionId = anchorEntry?.sessionId?.trim();
		if (!recallAgentId || !sessionId || !anchorSessionKey) return Promise.resolve({ state: "invalid" });
		anchorResetCutoffPromise = readSessionResetRecallCutoff({
			agentId: recallAgentId,
			sessionId,
			sessionKey: anchorSessionKey,
			storePath
		}).catch(() => ({ state: "invalid" }));
		return anchorResetCutoffPromise;
	};
	const recallAuthorized = Boolean(conversationRecall && !params.sandboxed && conversationRecall.scope === "same-agent-private" && (conversationRecall.corpus === "sessions" || conversationRecall.corpus === "configured") && anchorSessionKey && isTrustedRecallRequester({
		anchorSessionKey,
		requesterSessionKey: params.requesterSessionKey
	}) && normalizeOptionalLowercaseString(recallAgentId) === normalizeOptionalLowercaseString(scopedAgentId) && recallAgentId && isPrivateConversation({
		agentId: recallAgentId,
		entry: anchorEntry,
		key: anchorSessionKey
	}) && anchorAliasesArePrivate({
		store: combinedSessionStore,
		agentId: recallAgentId,
		anchorSessionKey,
		anchorEntry
	}));
	if (conversationRecall && !recallAuthorized) return conversationRecall.corpus === "configured" ? params.hits.filter((hit) => hit.source !== "sessions") : [];
	const isSessionKeyAllowed = (key, allowAnchorTranscript = false) => {
		if (!conversationRecall || !anchorSessionKey || !recallAgentId) {
			const visibilityKey = scopedAgentId && isGlobalSessionKeyForSharedScope(params.cfg, key) ? `agent:${scopedAgentId}:global` : key;
			return trustedAgentScope || guard?.check(visibilityKey).allowed === true;
		}
		const candidateEntry = combinedSessionStore[key];
		if (!allowAnchorTranscript && (key === anchorSessionKey || isSameStoredTranscript(anchorEntry, candidateEntry))) return false;
		const candidateAgentId = resolveSessionAgentIdStrict({
			sessionKey: key,
			config: params.cfg
		});
		if (normalizeOptionalLowercaseString(candidateAgentId) !== normalizeOptionalLowercaseString(recallAgentId)) return false;
		return isPrivateConversation({
			agentId: recallAgentId,
			entry: candidateEntry,
			key
		});
	};
	const areSessionKeysAllowed = (keys, allowAnchorTranscript = false) => {
		if (!conversationRecall) return keys.some((key) => isSessionKeyAllowed(key));
		return keys.every((key) => isSessionKeyAllowed(key, allowAnchorTranscript)) && Object.entries(combinedSessionStore).every(([key, candidate]) => !keys.some((source) => isSameStoredTranscript(combinedSessionStore[source], candidate)) || isSessionKeyAllowed(key, allowAnchorTranscript));
	};
	const next = [];
	for (const hit of params.hits) {
		if (hit.source !== "sessions") {
			if (!conversationRecall || conversationRecall.corpus === "configured") next.push(hit);
			continue;
		}
		const identity = identities.get(hit.path);
		if (!identity) continue;
		const archiveReason = readSessionArchiveReasonFromHitPath(hit.path);
		if (conversationRecall && archiveReason === "deleted") continue;
		const normalizedScopedAgentId = normalizeOptionalLowercaseString(scopedAgentId);
		const normalizedOwnerAgentId = normalizeOptionalLowercaseString(identity.ownerAgentId);
		if (normalizedScopedAgentId && normalizedOwnerAgentId && normalizedOwnerAgentId !== normalizedScopedAgentId) continue;
		const sameAgentLiveOwnerId = !identity.archived && normalizedScopedAgentId && normalizedOwnerAgentId === normalizedScopedAgentId ? normalizedOwnerAgentId : void 0;
		const archivedOwnerAgentId = Boolean(identity.archived && identity.ownerAgentId && (!scopedAgentId || normalizeOptionalLowercaseString(identity.ownerAgentId) === normalizeOptionalLowercaseString(scopedAgentId))) ? identity.ownerAgentId ?? scopedAgentId : void 0;
		const canonicalArchive = identity.archived ? archivedSessionsByName.get(hit.path.replace(/\\/g, "/").split("/").at(-1) ?? "") : void 0;
		const resolvedKeys = canonicalArchive?.sessionKey ? [canonicalArchive.sessionKey] : resolveTranscriptStemToSessionKeys({
			store: combinedSessionStore,
			stem: canonicalArchive?.sessionId ?? identity.stem,
			...archivedOwnerAgentId ? { archivedOwnerAgentId } : {}
		});
		const keys = filterSessionKeysByScopedAgent({
			cfg: params.cfg,
			scopedAgentId,
			keys: resolvedKeys
		});
		if (keys.length === 0) {
			if (sameAgentLiveOwnerId && (visibility === "agent" || visibility === "all") && !conversationRecall) next.push(hit);
			continue;
		}
		let allowResetAnchor = false;
		const anchorSessionId = anchorEntry?.sessionId?.trim();
		if (conversationRecall && !identity.archived && recallAgentId && anchorSessionId && identity.stem === anchorSessionId && normalizedOwnerAgentId === normalizeOptionalLowercaseString(recallAgentId)) {
			const cutoff = await resolveAnchorResetCutoff();
			allowResetAnchor = cutoff?.state === "valid" && hit.endLine < cutoff.cutoffLine;
		}
		if (!areSessionKeysAllowed(keys, archiveReason === "reset" || allowResetAnchor)) continue;
		next.push(hit);
	}
	return next;
}
//#endregion
export { filterMemorySearchHitsBySessionVisibility as t };
