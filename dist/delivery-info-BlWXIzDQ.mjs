import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { g as readRuntimeConfig } from "./runtime-snapshot-BBYDJbw9.mjs";
import { i as isIncognitoSessionKey } from "./incognito-session-key-BWpn88lo.mjs";
import { N as requiresFoldedSessionKeyAliasProof } from "./session-key-CSDERtm3.mjs";
import { c as resolveSessionStorePathCore } from "./paths-YgcBNLgG.mjs";
import "./io-DIF-KW3P.mjs";
import { r as hasDeliveryTargetFields } from "./delivery-context.shared-I8-iaaj1.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as normalizeStoreSessionKey, i as isConfirmedLowercasedLegacyAlias, n as foldedSessionKeyAliasCandidates, r as hasMismatchedCaseSensitiveDeliveryProof } from "./store-entry-CUxN9KZj.mjs";
import { n as captureMemoryExactSessionReader } from "./session-accessor.memory-exact-read-UNAhvKNR.mjs";
import { a as readSessionEntrySummariesInWorker, i as readSessionEntryReadOnlyInWorker, n as readSessionEntriesFromStoreInWorker } from "./session-entry-read-runtime-CgqUrGct.mjs";
import { a as resolveSessionStoreIdentity, o as resolveSessionStoreKey } from "./session-store-key-DKpto8R6.mjs";
import { i as resolveSessionThreadInfo } from "./session-conversation-DnUQmZJM.mjs";
import { n as resolveAllAgentSessionStoreTargetsAsync } from "./targets-runtime-l9s-sghb.mjs";
//#region src/config/sessions/delivery-info.ts
/** Reads only the current session; missing delivery must not widen into alias discovery. */
async function readExactSessionDeliveryContext(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	try {
		const { agentId, canonicalKey } = resolveSessionStoreIdentity({
			cfg: params.cfg,
			sessionKey
		});
		const entry = await readSessionEntryReadOnlyInWorker({
			agentId,
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
			sessionKey: canonicalKey,
			projection: "list"
		});
		if (params.sessionId && entry?.sessionId !== params.sessionId) return;
		return deliveryContextFromSession(entry);
	} catch {
		return;
	}
}
/**
* Extracts the routable delivery context and thread id for a persisted session key.
*
* Thread/topic keys first try their exact store entry, then fall back to the base session when
* the thread entry has no delivery route of its own.
*/
async function extractDeliveryInfo(sessionKey, options) {
	return (await extractDeliveryInfoBatch([sessionKey], options))[0];
}
/** Resolves one batch through the session owner; only detached delivery facts leave the read scope. */
async function extractDeliveryInfoBatch(sessionKeys, options) {
	const parsed = sessionKeys.map((sessionKey) => ({
		sessionKey,
		...resolveSessionThreadInfo(sessionKey)
	}));
	const results = parsed.map(({ threadId }) => ({
		deliveryContext: void 0,
		threadId
	}));
	if (!parsed.some(({ sessionKey, baseSessionKey }) => sessionKey && baseSessionKey)) return results;
	let cfg;
	try {
		cfg = options?.cfg ?? readRuntimeConfig();
	} catch {
		return results;
	}
	let storeTargets;
	try {
		storeTargets = await resolveAllAgentSessionStoreTargetsAsync(cfg);
	} catch {
		return results;
	}
	function prepareDeliveryLookup(sessionKey, baseSessionKey) {
		const { agentId, canonicalKey: canonicalBaseKey } = resolveSessionStoreIdentity({
			cfg,
			sessionKey: baseSessionKey
		});
		const canonicalKey = resolveSessionStoreKey({
			cfg,
			sessionKey,
			storeAgentId: agentId
		});
		const incognito = isIncognitoSessionKey(sessionKey) ? captureMemoryExactSessionReader({
			agentId,
			sessionKey
		}) : void 0;
		const storePaths = /* @__PURE__ */ new Set([incognito?.path ?? resolveSessionStorePathCore(cfg.session?.store, { agentId })]);
		for (const target of incognito ? [] : storeTargets) if (target.agentId === agentId) storePaths.add(target.storePath);
		return {
			agentId,
			sessionKeys: [sessionKey, canonicalKey],
			baseKeys: [baseSessionKey, canonicalBaseKey],
			storePaths: [...storePaths]
		};
	}
	const lookups = parsed.flatMap(({ sessionKey, baseSessionKey }, index) => {
		if (!sessionKey || !baseSessionKey) return [];
		try {
			return [{
				index,
				sessionKey,
				baseSessionKey,
				lookup: prepareDeliveryLookup(sessionKey, baseSessionKey)
			}];
		} catch {
			return [];
		}
	});
	const exactReads = /* @__PURE__ */ new Map();
	const readExact = (storePath, lookup) => {
		const candidateKeys = deliveryLookupExactKeys([...lookup.sessionKeys, ...lookup.baseKeys]);
		const cacheKey = JSON.stringify([storePath, candidateKeys]);
		let read = exactReads.get(cacheKey);
		if (!read) {
			read = lookup.sessionKeys.some(isIncognitoSessionKey) ? Promise.all(candidateKeys.map(async (sessionKey) => {
				const entry = await readSessionEntryReadOnlyInWorker({
					agentId: lookup.agentId,
					storePath,
					sessionKey,
					projection: "list"
				});
				return entry ? [{
					sessionKey,
					entry
				}] : [];
			})).then((rows) => ({ entries: rows.flat() })) : readSessionEntriesFromStoreInWorker({
				agentId: lookup.agentId,
				storePath,
				sessionKeys: candidateKeys,
				projection: "list",
				snapshotFields: []
			});
			exactReads.set(cacheKey, read);
		}
		return read;
	};
	const indexes = /* @__PURE__ */ new Map();
	for (const { index, sessionKey, baseSessionKey, lookup } of lookups) try {
		const selected = await loadDeliverySessionEntry(lookup, async (storePath) => {
			const read = await readExact(storePath, lookup);
			const source = read.source;
			const indexKey = source ? `${source.agentId}\u0000${source.path}` : storePath;
			let normalizedIndex = indexes.get(indexKey);
			if (!normalizedIndex) {
				normalizedIndex = lazyDeliveryIndex(source ? {
					storePath: source.path,
					agentId: source.agentId
				} : { storePath });
				indexes.set(indexKey, normalizedIndex);
			}
			const entries = new Map(read.entries.map(({ sessionKey: key, entry }) => [key, entry]));
			return {
				get: (key) => entries.get(key),
				normalizedIndex
			};
		});
		let context = deliveryContextFromSession(selected.entry);
		if (!hasDeliveryTargetFields(context) && baseSessionKey !== sessionKey) context = deliveryContextFromSession(selected.baseEntry);
		if (hasDeliveryTargetFields(context)) results[index].deliveryContext = {
			channel: context.channel,
			to: context.to,
			accountId: context.accountId,
			threadId: context.threadId
		};
	} catch {}
	return results;
}
function deliveryLookupExactKeys(keys) {
	return [...new Set(keys.flatMap((key) => {
		const normalized = normalizeStoreSessionKey(key);
		return [
			normalized,
			...foldedSessionKeyAliasCandidates(normalized),
			key.trim()
		];
	}))];
}
function lazyDeliveryIndex(scope) {
	let result;
	return () => result ??= readSessionEntrySummariesInWorker(scope).then(buildFreshestSessionEntryIndex);
}
async function findSessionEntryInStore(store, keys) {
	let bestEntry;
	let bestUpdatedAt = 0;
	let bestRoutable = false;
	let bestExact = false;
	const acceptCandidate = (entry, isExact = false) => {
		if (!entry) return;
		const candidateRoutable = hasDeliveryTargetFields(deliveryContextFromSession(entry));
		const candidateUpdatedAt = entry.updatedAt ?? 0;
		if (!bestEntry || candidateRoutable && !bestRoutable || candidateRoutable === bestRoutable && isExact && !bestExact || candidateRoutable === bestRoutable && isExact === bestExact && candidateUpdatedAt > bestUpdatedAt) {
			bestEntry = entry;
			bestUpdatedAt = candidateUpdatedAt;
			bestRoutable = candidateRoutable;
			bestExact = isExact;
		}
	};
	for (const key of keys) {
		const trimmed = key.trim();
		const normalized = normalizeStoreSessionKey(key);
		const foldedLegacyKeys = foldedSessionKeyAliasCandidates(normalized);
		const exactKeyWins = requiresFoldedSessionKeyAliasProof(normalized);
		let foundRoutableCandidate = false;
		const exactEntry = store.get(normalized);
		if (exactEntry && !hasMismatchedCaseSensitiveDeliveryProof(exactEntry, normalized)) {
			foundRoutableCandidate ||= hasDeliveryTargetFields(deliveryContextFromSession(exactEntry));
			acceptCandidate(exactEntry, exactKeyWins);
		}
		for (const foldedLegacyKey of foldedLegacyKeys) {
			const foldedLegacyEntry = store.get(foldedLegacyKey);
			if (!foldedLegacyEntry || !isConfirmedLowercasedLegacyAlias(foldedLegacyEntry, normalized)) continue;
			foundRoutableCandidate ||= hasDeliveryTargetFields(deliveryContextFromSession(foldedLegacyEntry));
			acceptCandidate(foldedLegacyEntry);
		}
		const trimmedEntry = trimmed !== normalized ? store.get(trimmed) : void 0;
		if (trimmedEntry && !hasMismatchedCaseSensitiveDeliveryProof(trimmedEntry, normalized)) {
			foundRoutableCandidate ||= hasDeliveryTargetFields(deliveryContextFromSession(trimmedEntry));
			acceptCandidate(trimmedEntry);
		}
		if (trimmed !== normalized || !foundRoutableCandidate) {
			const normalizedIndex = await store.normalizedIndex();
			const freshest = normalizedIndex.get(normalized);
			if (!hasMismatchedCaseSensitiveDeliveryProof(freshest, normalized)) acceptCandidate(freshest);
			for (const foldedLegacyKey of foldedLegacyKeys) {
				const foldedFreshest = normalizedIndex.get(foldedLegacyKey);
				if (isConfirmedLowercasedLegacyAlias(foldedFreshest, normalized)) acceptCandidate(foldedFreshest);
			}
		}
	}
	return bestEntry;
}
function buildFreshestSessionEntryIndex(entries) {
	const index = /* @__PURE__ */ new Map();
	const indexEntry = (key, entry) => {
		const existing = index.get(key);
		const entryRoutable = hasDeliveryTargetFields(deliveryContextFromSession(entry));
		const existingRoutable = hasDeliveryTargetFields(deliveryContextFromSession(existing));
		if (!existing || entryRoutable && !existingRoutable || entryRoutable === existingRoutable && (entry.updatedAt ?? 0) > (existing.updatedAt ?? 0)) index.set(key, entry);
	};
	for (const { sessionKey: key, entry } of entries) {
		if (!entry) continue;
		const normalized = normalizeStoreSessionKey(key);
		indexEntry(normalized, entry);
		const foldedLegacyKey = normalizeLowercaseStringOrEmpty(normalized);
		if (foldedLegacyKey === normalized || requiresFoldedSessionKeyAliasProof(normalized)) continue;
		indexEntry(foldedLegacyKey, entry);
	}
	return index;
}
async function loadDeliverySessionEntry(lookup, readStore) {
	let fallback;
	for (const [storeIndex, storePath] of lookup.storePaths.entries()) {
		const store = await readStore(storePath, storeIndex);
		const entry = await findSessionEntryInStore(store, lookup.sessionKeys);
		const baseEntry = await findSessionEntryInStore(store, lookup.baseKeys);
		if (!entry && !baseEntry) continue;
		fallback ??= {
			entry,
			baseEntry
		};
		if (hasDeliveryTargetFields(deliveryContextFromSession(entry)) || hasDeliveryTargetFields(deliveryContextFromSession(baseEntry))) return {
			entry,
			baseEntry
		};
	}
	return fallback ?? {
		entry: void 0,
		baseEntry: void 0
	};
}
//#endregion
export { extractDeliveryInfoBatch as n, readExactSessionDeliveryContext as r, extractDeliveryInfo as t };
