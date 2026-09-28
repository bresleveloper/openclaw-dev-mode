import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { r as isIncognitoSessionKey } from "./session-key-CUi_tcgF.mjs";
import { j as requiresFoldedSessionKeyAliasProof } from "./session-key-CBvmC8zz.mjs";
import { l as resolveSessionStorePathCore } from "./paths-CcMbq5NY.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import "./io-C0BSvvM5.mjs";
import { r as hasDeliveryTargetFields } from "./delivery-context.shared-CW8dxG7X.mjs";
import { t as deliveryContextFromSession } from "./delivery-context.read-CR06zOJ4.mjs";
import { a as normalizeStoreSessionKey, i as isConfirmedLowercasedLegacyAlias, n as foldedSessionKeyAliasCandidates, r as hasMismatchedCaseSensitiveDeliveryProof } from "./store-entry-DuM7NmYY.mjs";
import { a as resolveAllAgentSessionStoreTargetsSync } from "./targets-Dmb8-YXN.mjs";
import { a as loadExactSessionEntryReadOnly, r as loadExactSessionEntryCandidatesReadOnlyBatch } from "./session-accessor.sqlite-exact-read-Dk6_8wqr.mjs";
import "./session-accessor-C05KQ5A3.mjs";
import { i as resolveSessionStoreKey, r as resolveSessionStoreIdentity } from "./session-store-key-BoleEY7N.mjs";
import { n as openSessionEntryReadView } from "./session-accessor.entry-BFzDgQIL.mjs";
import { t as parseSessionThreadInfo } from "./thread-info-cIAJ239O.mjs";
//#region src/config/sessions/delivery-info.ts
/** Reads only the current session; missing delivery must not widen into alias discovery. */
function readExactSessionDeliveryContext(params) {
	const sessionKey = params.sessionKey?.trim();
	if (!sessionKey) return;
	try {
		const { agentId, canonicalKey } = resolveSessionStoreIdentity({
			cfg: params.cfg,
			sessionKey
		});
		const entry = loadExactSessionEntryReadOnly({
			storePath: resolveSessionStorePathCore(params.cfg.session?.store, { agentId }),
			sessionKey: canonicalKey,
			projection: "list"
		})?.entry;
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
function extractDeliveryInfo(sessionKey, options) {
	return extractDeliveryInfoBatch([sessionKey], options)[0];
}
/** Resolves one synchronous batch; only detached delivery facts leave the read scope. */
function extractDeliveryInfoBatch(sessionKeys, options) {
	const parsed = sessionKeys.map((sessionKey) => ({
		sessionKey,
		...parseSessionThreadInfo(sessionKey)
	}));
	const results = parsed.map(({ threadId }) => ({
		deliveryContext: void 0,
		threadId
	}));
	if (!parsed.some(({ sessionKey, baseSessionKey }) => sessionKey && baseSessionKey)) return results;
	let cfg;
	try {
		cfg = options?.cfg ?? getRuntimeConfig();
	} catch {
		return results;
	}
	let storeTargets;
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
		const storePaths = /* @__PURE__ */ new Set([resolveSessionStorePathCore(cfg.session?.store, { agentId })]);
		for (const target of storeTargets ??= resolveAllAgentSessionStoreTargetsSync(cfg)) if (target.agentId === agentId) storePaths.add(target.storePath);
		return {
			sessionKeys: [sessionKey, canonicalKey],
			baseKeys: [baseSessionKey, canonicalBaseKey],
			storePaths: [...storePaths]
		};
	}
	const reads = [];
	const lookups = parsed.flatMap(({ sessionKey, baseSessionKey }, index) => {
		if (!sessionKey || !baseSessionKey) return [];
		try {
			const lookup = prepareDeliveryLookup(sessionKey, baseSessionKey);
			return [{
				index,
				sessionKey,
				baseSessionKey,
				lookup,
				readIndexes: isIncognitoSessionKey(sessionKey) ? void 0 : lookup.storePaths.map((storePath) => {
					reads.push({
						storePath,
						sessionKeys: deliveryLookupExactKeys([...lookup.sessionKeys, ...lookup.baseKeys])
					});
					return reads.length - 1;
				})
			}];
		} catch {
			return [];
		}
	});
	const readGroups = /* @__PURE__ */ new Map();
	for (const [index, read] of reads.entries()) {
		const group = readGroups.get(read.storePath) ?? [];
		group.push(index);
		readGroups.set(read.storePath, group);
	}
	const exactResults = /* @__PURE__ */ new Map();
	const readExact = (index) => {
		const cached = exactResults.get(index);
		if (cached) return cached;
		const group = readGroups.get(reads[index].storePath);
		const loaded = loadExactSessionEntryCandidatesReadOnlyBatch(group.map((readIndex) => {
			const read = reads[readIndex];
			return {
				storePath: read.storePath,
				sessionKeys: read.sessionKeys,
				projection: "list",
				onReadSource: (source) => {
					read.source = source;
				}
			};
		}));
		for (const [offset, readIndex] of group.entries()) exactResults.set(readIndex, loaded[offset]);
		return exactResults.get(index);
	};
	const indexes = /* @__PURE__ */ new Map();
	for (const { index, sessionKey, baseSessionKey, lookup, readIndexes } of lookups) try {
		const selected = loadDeliverySessionEntry(lookup, (storePath, storeIndex) => {
			const readIndex = readIndexes?.[storeIndex];
			const read = readIndex === void 0 ? void 0 : reads[readIndex];
			const exact = readIndex === void 0 ? void 0 : readExact(readIndex);
			if (exact && !exact.ok) throw exact.error;
			const source = read?.source;
			const indexKey = source ? `${source.agentId}\u0000${source.path}` : storePath;
			let normalizedIndex = indexes.get(indexKey);
			if (!normalizedIndex) {
				normalizedIndex = lazyDeliveryIndex(source ? {
					storePath: source.path,
					agentId: source.agentId
				} : { storePath });
				indexes.set(indexKey, normalizedIndex);
			}
			const entries = exact?.ok ? new Map(exact.value.map(({ sessionKey: key, entry }) => [key, entry])) : void 0;
			return {
				get: (entries ? { get: (key) => entries.get(key) } : openSessionEntryReadView({
					storePath,
					projection: "list"
				})).get,
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
	return () => {
		if (!result) try {
			result = { index: buildFreshestSessionEntryIndex(openSessionEntryReadView({
				...scope,
				projection: "list"
			})) };
		} catch (error) {
			result = { error };
		}
		if ("error" in result) throw result.error;
		return result.index;
	};
}
function findSessionEntryInStore(store, keys) {
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
			const normalizedIndex = store.normalizedIndex();
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
function buildFreshestSessionEntryIndex(store) {
	const index = /* @__PURE__ */ new Map();
	for (const { sessionKey: key, entry } of store.entries()) {
		if (!entry) continue;
		const normalized = normalizeStoreSessionKey(key);
		const existing = index.get(normalized);
		const entryRoutable = hasDeliveryTargetFields(deliveryContextFromSession(entry));
		const existingRoutable = hasDeliveryTargetFields(deliveryContextFromSession(existing));
		if (!existing || entryRoutable && !existingRoutable || entryRoutable === existingRoutable && (entry.updatedAt ?? 0) > (existing.updatedAt ?? 0)) index.set(normalized, entry);
		const foldedLegacyKey = normalizeLowercaseStringOrEmpty(normalized);
		if (foldedLegacyKey === normalized || requiresFoldedSessionKeyAliasProof(normalized)) continue;
		const foldedExisting = index.get(foldedLegacyKey);
		const foldedExistingRoutable = hasDeliveryTargetFields(deliveryContextFromSession(foldedExisting));
		if (!foldedExisting || entryRoutable && !foldedExistingRoutable || entryRoutable === foldedExistingRoutable && (entry.updatedAt ?? 0) > (foldedExisting.updatedAt ?? 0)) index.set(foldedLegacyKey, entry);
	}
	return index;
}
function loadDeliverySessionEntry(lookup, readStore) {
	let fallback;
	for (const [storeIndex, storePath] of lookup.storePaths.entries()) {
		const store = readStore(storePath, storeIndex);
		const entry = findSessionEntryInStore(store, lookup.sessionKeys);
		const baseEntry = findSessionEntryInStore(store, lookup.baseKeys);
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
