import { createAccountListHelpers } from "openclaw/plugin-sdk/account-helpers";
import { DEFAULT_ACCOUNT_ID, normalizeAccountId, normalizeOptionalAccountId } from "openclaw/plugin-sdk/account-id";
import { resolveAccountEntry, resolveListedDefaultAccountId } from "openclaw/plugin-sdk/account-resolution";
import { tryReadSecretFileSync } from "openclaw/plugin-sdk/secret-file-runtime";
//#region extensions/line/src/accounts.ts
const { resolveAccountConfig: resolveMergedLineAccountConfig } = createAccountListHelpers("line", { omitKeys: ["defaultAccount"] });
function resolveLineCredential(params) {
	const { accountId, baseConfig, accountConfig, credentialKey, fileKey, envKey } = params;
	const candidates = accountId === DEFAULT_ACCOUNT_ID ? [accountConfig, baseConfig] : [accountConfig];
	for (const [index, config] of candidates.entries()) {
		const credential = config?.[credentialKey]?.trim();
		if (credential) return {
			value: credential,
			source: "config",
			status: "available"
		};
		const file = config?.[fileKey];
		if (file?.trim()) {
			const scope = index === 0 ? `accounts.${accountId}.` : "";
			const result = tryReadSecretFileSync(file, "LINE credential file", { rejectSymlink: true }, { configPath: `channels.line.${scope}${fileKey}` });
			return result.status === "available" ? {
				value: result.value,
				source: "file",
				status: "available"
			} : {
				value: "",
				source: "file",
				status: "configured_unavailable",
				diagnostic: result.diagnostic
			};
		}
	}
	const envCredential = accountId === DEFAULT_ACCOUNT_ID ? process.env[envKey]?.trim() : void 0;
	if (envCredential) return {
		value: envCredential,
		source: "env",
		status: "available"
	};
	return {
		value: "",
		source: "none",
		status: "missing"
	};
}
function resolveLineAccount(params) {
	const cfg = params.cfg;
	const accountId = normalizeAccountId(params.accountId ?? resolveDefaultLineAccountId(cfg));
	const lineConfig = cfg.channels?.line;
	const accounts = lineConfig?.accounts;
	const accountConfig = resolveAccountEntry(accounts, accountId);
	const token = resolveLineCredential({
		accountId,
		baseConfig: lineConfig,
		accountConfig,
		credentialKey: "channelAccessToken",
		fileKey: "tokenFile",
		envKey: "LINE_CHANNEL_ACCESS_TOKEN"
	});
	const secret = resolveLineCredential({
		accountId,
		baseConfig: lineConfig,
		accountConfig,
		credentialKey: "channelSecret",
		fileKey: "secretFile",
		envKey: "LINE_CHANNEL_SECRET"
	});
	const mergedConfig = resolveMergedLineAccountConfig(cfg, accountId);
	const baseEnabled = lineConfig?.enabled !== false;
	const accountEnabled = accountConfig?.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	return {
		accountId,
		name: accountConfig?.name ?? (accountId === DEFAULT_ACCOUNT_ID ? lineConfig?.name : void 0),
		enabled,
		channelAccessToken: token.value,
		channelSecret: secret.value,
		tokenSource: token.source,
		signingSecretSource: secret.source,
		tokenStatus: token.status,
		signingSecretStatus: secret.status,
		...[token.diagnostic, secret.diagnostic].some(Boolean) ? { credentialDiagnostics: [token.diagnostic, secret.diagnostic].filter((diagnostic) => Boolean(diagnostic)) } : {},
		config: mergedConfig
	};
}
function listLineAccountIds(cfg) {
	const lineConfig = cfg.channels?.line;
	const accounts = lineConfig?.accounts;
	const ids = /* @__PURE__ */ new Set();
	if (lineConfig?.channelAccessToken?.trim() || lineConfig?.tokenFile || process.env.LINE_CHANNEL_ACCESS_TOKEN?.trim()) ids.add(DEFAULT_ACCOUNT_ID);
	if (accounts) for (const id of Object.keys(accounts)) ids.add(id);
	return Array.from(ids);
}
function resolveDefaultLineAccountId(cfg) {
	return resolveListedDefaultAccountId({
		accountIds: listLineAccountIds(cfg),
		configuredDefaultAccountId: normalizeOptionalAccountId((cfg.channels?.line)?.defaultAccount),
		normalizeListedAccountId: normalizeAccountId
	});
}
function normalizeAccountId$1(accountId) {
	return normalizeAccountId(accountId);
}
//#endregion
export { resolveLineAccount as i, normalizeAccountId$1 as n, resolveDefaultLineAccountId as r, listLineAccountIds as t };
