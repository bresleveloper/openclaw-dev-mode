import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { E as parseThreadSessionSuffix, O as normalizeSessionKeyPreservingOpaquePeerIds, j as requiresFoldedSessionKeyAliasProof } from "./session-key-CBvmC8zz.mjs";
import { n as normalizeConversationPeerId } from "./conversation-ref-8kIjGCCc.mjs";
import { r as sessionDeliveryOrigin, t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
//#region src/config/sessions/store-entry.ts
function normalizeStoreSessionKey(sessionKey) {
	return normalizeSessionKeyPreservingOpaquePeerIds(sessionKey);
}
function foldedSessionKeyAliasCandidates(normalizedKey) {
	const aliases = /* @__PURE__ */ new Set();
	const foldedLegacyKey = normalizeLowercaseStringOrEmpty(normalizedKey);
	if (foldedLegacyKey !== normalizedKey) aliases.add(foldedLegacyKey);
	if (requiresFoldedSessionKeyAliasProof(normalizedKey)) {
		const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
		const foldedBaseKey = normalizeLowercaseStringOrEmpty(baseSessionKey);
		if (baseSessionKey && threadId && foldedBaseKey !== baseSessionKey) aliases.add(`${foldedBaseKey}:thread:${threadId}`);
	}
	return [...aliases];
}
/** The case-sensitive room/peer target an entry actually delivers to. Delivery
*  metadata preserves the real opaque id even when the session KEY was lowercased
*  by the bug, so it distinguishes a lowercased artifact from a distinct room. */
function normalizeEntryTarget(value) {
	if (typeof value !== "string") return "";
	const trimmed = value.trim();
	const sigilIndexes = ["!", "#"].map((sigil) => trimmed.indexOf(sigil)).filter((index) => index >= 0);
	if (sigilIndexes.length === 0) return trimmed;
	return trimmed.slice(Math.min(...sigilIndexes));
}
function entryDeliveryTargets(entry) {
	const context = deliveryContextFromSession(entry);
	const origin = sessionDeliveryOrigin(entry);
	return [
		context?.to,
		origin?.nativeChannelId,
		origin?.to,
		entry?.groupId
	].map(normalizeEntryTarget).filter(Boolean);
}
function normalizeEntryThreadId(value) {
	if (value == null) return "";
	if (typeof value !== "string" && typeof value !== "number") return "";
	return String(value).trim();
}
function entryThreadId(entry) {
	return normalizeEntryThreadId(deliveryContextFromSession(entry)?.threadId);
}
/** Tail-preserved keys like Matrix rooms need delivery-target proof before a
*  folded key is treated as a legacy alias. Segment-preserved legacy keys
*  (Signal groups) keep their old permissive lowercase fallback. */
function isConfirmedLowercasedLegacyAlias(entry, normalizedKey) {
	if (!entry) return false;
	if (!requiresFoldedSessionKeyAliasProof(normalizedKey)) return true;
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
	const normalizedBaseKey = baseSessionKey ?? normalizedKey;
	if (!entryDeliveryTargets(entry).some((target) => normalizedBaseKey.includes(target))) return false;
	if (!threadId) return true;
	return entryThreadId(entry) === threadId;
}
function hasMismatchedCaseSensitiveDeliveryProof(entry, normalizedKey) {
	if (!entry || !requiresFoldedSessionKeyAliasProof(normalizedKey)) return false;
	const { baseSessionKey, threadId } = parseThreadSessionSuffix(normalizedKey);
	const normalizedBaseKey = baseSessionKey ?? normalizedKey;
	const targets = entryDeliveryTargets(entry);
	if (targets.length > 0 && !targets.some((target) => normalizedBaseKey.includes(target))) return true;
	const storedThreadId = entryThreadId(entry);
	return Boolean(threadId && storedThreadId && storedThreadId !== threadId);
}
/** Restores an opaque case-sensitive peer only when the row's delivery target proves it. */
function resolveDeliveryProvenCanonicalSessionKey(sessionKey, entry) {
	const normalizedKey = normalizeStoreSessionKey(sessionKey);
	const delivery = deliveryContextFromSession(entry);
	const channel = delivery?.channel?.trim().toLowerCase();
	const peerId = channel && delivery?.to ? normalizeConversationPeerId(channel, delivery.to) : void 0;
	if (!channel || !peerId) return normalizedKey;
	const parsedThread = parseThreadSessionSuffix(normalizedKey);
	const baseSessionKey = parsedThread.baseSessionKey ?? normalizedKey;
	const foldedBase = baseSessionKey.toLowerCase();
	let peerStart = -1;
	for (const peerKind of ["channel", "group"]) {
		const marker = `${channel}:${peerKind}:`;
		const nestedMarkerIndex = foldedBase.lastIndexOf(`:${marker}`);
		const markerIndex = foldedBase.startsWith(marker) ? 0 : nestedMarkerIndex >= 0 ? nestedMarkerIndex + 1 : -1;
		if (markerIndex >= 0) peerStart = Math.max(peerStart, markerIndex + marker.length);
	}
	if (peerStart < 0) return normalizedKey;
	if (baseSessionKey.slice(peerStart).toLowerCase() !== peerId.toLowerCase()) return normalizedKey;
	const threadId = parsedThread.threadId ? String(delivery?.threadId ?? parsedThread.threadId).trim() : void 0;
	const candidate = normalizeStoreSessionKey(`${baseSessionKey.slice(0, peerStart)}${peerId}${threadId ? `:thread:${threadId}` : ""}`);
	return candidate !== normalizedKey && foldedSessionKeyAliasCandidates(candidate).includes(normalizedKey) && isConfirmedLowercasedLegacyAlias(entry, candidate) ? candidate : normalizedKey;
}
function collectSessionEntryLookupKeys(_database, sessionKey) {
	const trimmedKey = sessionKey.trim();
	return trimmedKey ? [.../* @__PURE__ */ new Set([trimmedKey, ...foldedSessionKeyAliasCandidates(normalizeStoreSessionKey(trimmedKey))])] : [];
}
function resolveSessionEntryCandidates(params) {
	const trimmedKey = params.sessionKey.trim();
	const normalizedKey = normalizeStoreSessionKey(trimmedKey);
	const foldedLegacyKeys = foldedSessionKeyAliasCandidates(normalizedKey);
	const lookupKeys = params.canonicalKeys ? /* @__PURE__ */ new Set([
		trimmedKey,
		normalizedKey,
		...foldedLegacyKeys
	]) : void 0;
	const entries = /* @__PURE__ */ new Map();
	for (const candidate of params.entries) if (!lookupKeys || lookupKeys.has(candidate.sessionKey)) entries.set(candidate.sessionKey, candidate);
	const legacyKeySet = /* @__PURE__ */ new Set();
	const trimmedCandidate = entries.get(trimmedKey);
	if (trimmedKey !== normalizedKey && trimmedCandidate && !hasMismatchedCaseSensitiveDeliveryProof(trimmedCandidate.entry, normalizedKey)) legacyKeySet.add(trimmedKey);
	let foldedLegacyEntry;
	let foldedLegacyUpdatedAt = 0;
	for (const foldedLegacyKey of foldedLegacyKeys) {
		const candidate = entries.get(foldedLegacyKey);
		if (!candidate || !isConfirmedLowercasedLegacyAlias(candidate.entry, normalizedKey)) continue;
		legacyKeySet.add(foldedLegacyKey);
		const updatedAt = candidate.entry.updatedAt ?? 0;
		if (!foldedLegacyEntry || updatedAt > foldedLegacyUpdatedAt) {
			foldedLegacyEntry = candidate;
			foldedLegacyUpdatedAt = updatedAt;
		}
	}
	const exactEntry = entries.get(normalizedKey);
	const usableExactEntry = hasMismatchedCaseSensitiveDeliveryProof(exactEntry?.entry, normalizedKey) ? void 0 : exactEntry;
	const exactKeyWins = requiresFoldedSessionKeyAliasProof(normalizedKey);
	const fallbackLegacyEntry = legacyKeySet.size > 0 && !hasMismatchedCaseSensitiveDeliveryProof(trimmedCandidate?.entry, normalizedKey) ? trimmedCandidate : void 0;
	let existing = exactKeyWins ? usableExactEntry ?? foldedLegacyEntry ?? fallbackLegacyEntry : void 0;
	let existingUpdatedAt = existing?.entry.updatedAt ?? 0;
	if (!exactKeyWins) for (const candidate of [
		usableExactEntry,
		foldedLegacyEntry,
		fallbackLegacyEntry
	]) {
		const candidateUpdatedAt = candidate?.entry.updatedAt ?? 0;
		if (candidate && (!existing || candidateUpdatedAt > existingUpdatedAt)) {
			existing = candidate;
			existingUpdatedAt = candidateUpdatedAt;
		}
	}
	for (const [candidateKey, candidate] of entries) {
		if (params.canonicalKeys || candidateKey === normalizedKey) continue;
		if (normalizeStoreSessionKey(candidateKey) !== normalizedKey) continue;
		if (hasMismatchedCaseSensitiveDeliveryProof(candidate.entry, normalizedKey)) continue;
		legacyKeySet.add(candidateKey);
		const candidateUpdatedAt = candidate.entry.updatedAt ?? 0;
		if (!existing || candidateUpdatedAt > existingUpdatedAt) {
			existing = candidate;
			existingUpdatedAt = candidateUpdatedAt;
		}
	}
	return {
		normalizedKey,
		existing,
		legacyKeys: [...legacyKeySet]
	};
}
function resolveSessionStoreEntryCore(params) {
	const resolved = resolveSessionEntryCandidates({
		entries: Object.entries(params.store).map(([sessionKey, entry]) => ({
			entry,
			sessionKey
		})),
		sessionKey: params.sessionKey
	});
	return {
		normalizedKey: resolved.normalizedKey,
		existing: resolved.existing?.entry,
		legacyKeys: resolved.legacyKeys
	};
}
//#endregion
export { normalizeStoreSessionKey as a, resolveSessionStoreEntryCore as c, isConfirmedLowercasedLegacyAlias as i, foldedSessionKeyAliasCandidates as n, resolveDeliveryProvenCanonicalSessionKey as o, hasMismatchedCaseSensitiveDeliveryProof as r, resolveSessionEntryCandidates as s, collectSessionEntryLookupKeys as t };
