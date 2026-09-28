import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { l as normalizeOptionalString, o as normalizeLowercaseStringOrEmpty } from "./string-coerce-CIXf7egm.mjs";
import { t as isBlockedObjectKey } from "./prototype-keys-CuYw53fZ.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-B1bfbA5J.mjs";
import { r as snapshotReaderSlot } from "./plugin-metadata-snapshot-readers-NmF34DMg.mjs";
//#region src/routing/account-lookup.ts
function resolveChannelAccountKey(accounts, accountId, channelId, normalizeAccountId, accountKeyPolicy, options) {
	return resolveAccountKey(accounts, accountId, normalizeAccountId, accountKeyPolicy, {
		...options,
		channelId
	});
}
function resolveChannelAccountEntry(accounts, accountId, channelId, normalizeAccountId, accountKeyPolicy) {
	const key = resolveChannelAccountKey(accounts, accountId, channelId, normalizeAccountId, accountKeyPolicy);
	return key === void 0 ? void 0 : accounts?.[key];
}
function resolveAccountEntry(accounts, accountId) {
	const key = resolveAccountKey(accounts, accountId);
	return key === void 0 ? void 0 : accounts?.[key];
}
function resolveNormalizedAccountEntry(accounts, accountId, normalizeAccountId, policy) {
	const key = resolveAccountKey(accounts, accountId, normalizeAccountId, policy);
	return key === void 0 ? void 0 : accounts?.[key];
}
/** Select the stored spelling once for account readers and writers; exact keys win. */
function resolveAccountKey(accounts, accountId, normalizeAccountId$1, policy, options) {
	const effectivePolicy = policy ?? (options?.channelId ? snapshotReaderSlot.getCurrentPluginMetadataSnapshot?.({
		allowScopedSnapshot: true,
		allowWorkspaceScopedSnapshot: true
	})?.owners.channelAccountKeyPolicies?.get(options.channelId) : void 0);
	const normalizer = effectivePolicy ? normalizeAccountId : normalizeAccountId$1;
	const normalize = normalizer ?? normalizeLowercaseStringOrEmpty;
	if (options?.allowMissing && (isBlockedObjectKey(normalizeLowercaseStringOrEmpty(accountId)) || isBlockedObjectKey(normalize(accountId)))) throw new Error(`Account id "${accountId}" is reserved. Choose a different account id.`);
	const targetId = effectivePolicy ? normalize(accountId) : accountId;
	const missingKey = options?.allowMissing ? targetId : void 0;
	if (!accounts || typeof accounts !== "object") return missingKey;
	if (Object.hasOwn(accounts, targetId) && (!normalizer || !isBlockedObjectKey(targetId))) return targetId;
	const normalized = normalize(targetId);
	const lowercaseTarget = normalizeLowercaseStringOrEmpty(targetId);
	let canonicalMatch;
	for (const key of Object.keys(accounts)) {
		if (normalizer && isBlockedObjectKey(key)) continue;
		if (effectivePolicy && normalizeLowercaseStringOrEmpty(key) === lowercaseTarget) return key;
		const candidate = normalize(key);
		if ((!normalizer || Boolean(normalizeOptionalAccountId(key)) && !isBlockedObjectKey(candidate)) && candidate === normalized) {
			if (!effectivePolicy) return key;
			const entry = asOptionalRecord(accounts[key]);
			if (canonicalMatch === void 0 && entry && Object.hasOwn(entry, effectivePolicy.canonicalAliasesRequireOwnField) && normalizeOptionalString(entry[effectivePolicy.canonicalAliasesRequireOwnField])) canonicalMatch = key;
		}
	}
	return canonicalMatch ?? missingKey;
}
//#endregion
export { resolveNormalizedAccountEntry as a, resolveChannelAccountKey as i, resolveAccountKey as n, resolveChannelAccountEntry as r, resolveAccountEntry as t };
