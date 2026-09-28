import { a as asOptionalRecord } from "./record-coerce-DItp3I4t.mjs";
import { i as resolveChannelAccountKey, n as resolveAccountKey } from "./account-lookup-CVHGcV8B.mjs";
//#region src/config/channel-account-config.ts
/** Merge authored account overrides over channel defaults, with owner-selected collection rules. */
function mergeAccountConfig(params) {
	const omitKeys = /* @__PURE__ */ new Set(["accounts", ...params.omitKeys ?? []]);
	const base = Object.fromEntries(Object.entries(params.channelConfig ?? {}).filter(([key]) => !omitKeys.has(key)));
	const account = params.accountConfig;
	const merged = {
		...base,
		...account
	};
	const mergedFields = merged;
	for (const [key, kind] of Object.entries(params.inheritEmptyKeys ?? {})) {
		const value = account?.[key];
		const collection = kind === "array" ? Array.isArray(value) ? value : void 0 : asOptionalRecord(value);
		if (collection && Object.keys(collection).length === 0) mergedFields[key] = base[key];
	}
	for (const key of params.nestedObjectKeys ?? []) {
		const baseValue = asOptionalRecord(base[key]);
		const accountValue = asOptionalRecord(account?.[key]);
		if (baseValue && accountValue) mergedFields[key] = {
			...baseValue,
			...accountValue
		};
	}
	if (params.preserveRootAllowFrom && Array.isArray(base.allowFrom) && Array.isArray(account?.allowFrom)) {
		if (base.allowFrom.some((entry) => {
			const value = String(entry).trim();
			return value.length > 0 && value !== "*";
		}) && account.allowFrom.some((entry) => String(entry).trim() === "*")) {
			const entries = account.allowFrom.filter((entry) => String(entry).trim() !== "*");
			mergedFields.allowFrom = entries.length > 0 ? entries : base.allowFrom;
		}
	}
	return merged;
}
/** Resolve a named account before applying the shared channel inheritance rules. */
function resolveMergedAccountConfig(params) {
	const accountKey = params.channelId ? resolveChannelAccountKey(params.accounts, params.accountId, params.channelId, params.normalizeAccountId, params.accountKeyPolicy) : resolveAccountKey(params.accounts, params.accountId, params.normalizeAccountId, params.accountKeyPolicy);
	const accountConfig = accountKey === void 0 ? void 0 : params.accounts?.[accountKey];
	return mergeAccountConfig({
		...params,
		accountConfig
	});
}
//#endregion
export { resolveMergedAccountConfig as n, mergeAccountConfig as t };
