import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { l as resolveSessionStorePathCore } from "./paths-dpReqUI8.mjs";
import { _ as resolveSessionAgentIdStrict } from "./agent-scope-CG17uXFn.mjs";
import { n as resolveCanonicalMainSessionKey } from "./main-session-key-DrfSAS1s.mjs";
import { r as sessionDeliveryOrigin } from "./delivery-context.read-CR06zOJ4.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as listSessionTranscriptArchivesInWorker } from "./session-transcript-inventory-runtime-DuZB__vC.mjs";
import "./session-store-runtime-BS2ijndm.mjs";
import { t as readSessionResetRecallCutoff } from "./session-reset-recall-read-CskgEhwv.mjs";
import "./memory-core-host-engine-sessions-BU7YUvhe.mjs";
import "./agent-scope-runtime-DMJYuX7c.mjs";
import { o as resolveEffectiveSessionToolsVisibility, r as createSessionVisibilityGuard, s as resolveSandboxSessionToolsVisibility, t as createAgentToAgentPolicy } from "./session-visibility-C8925ScR.mjs";
import "./session-store-paths-DrpLkLj5.mjs";
import { i as resolveTranscriptStemToSessionKeys, r as loadCombinedSessionStoreForGateway, t as extractTranscriptIdentityFromSessionsMemoryHit } from "./session-transcript-hit-4b8qt1b3.mjs";
import "./memory-core-host-runtime-core-BPcsOjzw.mjs";
import { t as readSessionArchiveReasonFromHitPath } from "./session-reset-recall-metadata-_gATHFyh.mjs";
//#region extensions/memory-core/src/session-search-visibility.ts
function isGlobalSessionKeyForSharedScope(cfg, key) {
	return cfg.session?.scope === "global" && key.trim().toLowerCase() === "global";
}
function isSameStoredTranscript(anchor, candidate) {
	if (!anchor || !candidate) return false;
	const anchorSessionId = anchor.sessionId?.trim();
	const anchorSessionFile = normalizeOptionalString(anchor.sessionFile);
	return Boolean(anchorSessionId && candidate.sessionId?.trim() === anchorSessionId || anchorSessionFile && normalizeOptionalString(candidate.sessionFile) === anchorSessionFile);
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
	if (key.includes(":direct:") || key.includes(":dm:")) return true;
	return false;
}
function anchorAliasesArePrivate(params) {
	for (const [key, entry] of Object.entries(params.store)) {
		if (key === params.anchorSessionKey) continue;
		if (!isSameStoredTranscript(params.anchorEntry, entry)) continue;
		if (!isPrivateConversation({
			agentId: params.agentId,
			entry,
			key
		})) return false;
	}
	return true;
}
function isTrustedRecallRequester(params) {
	const requesterSessionKey = params.requesterSessionKey?.trim();
	if (!requesterSessionKey) return false;
	if (requesterSessionKey === params.anchorSessionKey) return true;
	if (!requesterSessionKey.startsWith(params.anchorSessionKey)) return false;
	const recallSuffix = requesterSessionKey.slice(params.anchorSessionKey.length);
	return /^:active-memory:[a-f0-9]{12}$/i.test(recallSuffix);
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
	const archiveNames = [...new Set(params.hits.flatMap((hit) => {
		const identity = hit.source === "sessions" ? extractTranscriptIdentityFromSessionsMemoryHit(hit.path) : void 0;
		const archiveName = hit.path.replace(/\\/g, "/").split("/").at(-1);
		return identity?.archived && archiveName ? [archiveName] : [];
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
	const { store: combinedSessionStore, storePath } = loadCombinedSessionStoreForGateway(params.cfg, scopedAgentId ? { agentId: scopedAgentId } : {});
	const conversationRecall = params.conversationRecall;
	const trustedAgentScope = Boolean(params.trustedAgentScope && scopedAgentId && !params.requesterSessionKey && !conversationRecall);
	const anchorSessionKey = conversationRecall?.anchorSessionKey.trim();
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
	const expandRecallAliasKeys = (keys) => {
		const expanded = new Set(keys);
		for (const key of keys) {
			const entry = combinedSessionStore[key];
			if (!entry) continue;
			for (const [candidateKey, candidateEntry] of Object.entries(combinedSessionStore)) if (isSameStoredTranscript(entry, candidateEntry)) expanded.add(candidateKey);
		}
		return [...expanded];
	};
	const areSessionKeysAllowed = (keys, allowAnchorTranscript = false) => {
		return conversationRecall ? expandRecallAliasKeys(keys).every((key) => isSessionKeyAllowed(key, allowAnchorTranscript)) : keys.some((key) => isSessionKeyAllowed(key));
	};
	const next = [];
	for (const hit of params.hits) {
		if (hit.source !== "sessions") {
			if (!conversationRecall || conversationRecall.corpus === "configured") next.push(hit);
			continue;
		}
		if (!trustedAgentScope && (!params.requesterSessionKey || !guard && !conversationRecall)) continue;
		const identity = extractTranscriptIdentityFromSessionsMemoryHit(hit.path);
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
