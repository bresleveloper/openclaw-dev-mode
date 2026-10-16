import { t as asBoolean } from "./boolean-BEb0Fdt8.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/config/dangerous-name-matching.ts
/** Returns true only for the explicit dangerous name-matching opt-in flag. */
function isDangerousNameMatchingEnabled(config) {
	return config?.dangerouslyAllowNameMatching === true;
}
/** Resolves account-level dangerous name matching, inheriting the provider flag when unset. */
function resolveDangerousNameMatchingEnabled(input) {
	return asBoolean(input.accountConfig?.dangerouslyAllowNameMatching) ?? isDangerousNameMatchingEnabled(input.providerConfig);
}
/** Collects provider/account scopes that policy and doctor surfaces can audit. */
function collectProviderDangerousNameMatchingScopes(cfg, provider) {
	const scopes = [];
	const providerCfg = asNullableRecord(asNullableRecord(cfg.channels)?.[provider]);
	if (!providerCfg) return scopes;
	const providerPrefix = `channels.${provider}`;
	const providerDangerousFlagPath = `${providerPrefix}.dangerouslyAllowNameMatching`;
	const providerDangerousNameMatchingEnabled = isDangerousNameMatchingEnabled(providerCfg);
	scopes.push({
		prefix: providerPrefix,
		account: providerCfg,
		dangerousNameMatchingEnabled: providerDangerousNameMatchingEnabled,
		dangerousFlagPath: providerDangerousFlagPath
	});
	const accounts = asNullableRecord(providerCfg.accounts);
	if (!accounts) return scopes;
	for (const key of Object.keys(accounts)) {
		const account = asNullableRecord(accounts[key]);
		if (!account) continue;
		const accountPrefix = `${providerPrefix}.accounts.${key}`;
		const accountDangerousNameMatching = asBoolean(account.dangerouslyAllowNameMatching);
		scopes.push({
			prefix: accountPrefix,
			account,
			dangerousNameMatchingEnabled: accountDangerousNameMatching ?? providerDangerousNameMatchingEnabled,
			dangerousFlagPath: accountDangerousNameMatching == null ? providerDangerousFlagPath : `${accountPrefix}.dangerouslyAllowNameMatching`
		});
	}
	return scopes;
}
//#endregion
export { isDangerousNameMatchingEnabled as n, resolveDangerousNameMatchingEnabled as r, collectProviderDangerousNameMatchingScopes as t };
