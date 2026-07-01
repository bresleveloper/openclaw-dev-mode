import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { f as normalizeResolvedSecretInputString, p as normalizeSecretInputString } from "./types.secrets-lIZQEgMF.js";
import { a as tryReadSecretFileSync } from "./secret-file-PClaG9G0.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-5IgE9UKY.js";
import { t as resolveAccountEntry } from "./account-lookup-DjMZZ6go.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { c as resolveMergedAccountConfig, t as createAccountListHelpers } from "./account-helpers-DihevCTm.js";
import "./core-etcZhDYQ.js";
import "./routing-DGrdyZ4S.js";
import "./secret-input-Dq7Mxf9Y.js";
//#region extensions/zalo/src/token.ts
function readTokenFromFile(tokenFile) {
	return tryReadSecretFileSync(tokenFile, "Zalo token file", { rejectSymlink: true }) ?? "";
}
function resolveZaloToken(config, accountId, options) {
	const resolvedAccountId = normalizeAccountId(accountId ?? config?.defaultAccount);
	const isDefaultAccount = resolvedAccountId === DEFAULT_ACCOUNT_ID;
	const baseConfig = config;
	const accountConfig = resolveAccountEntry(baseConfig?.accounts, normalizeAccountId(resolvedAccountId));
	const accountHasBotToken = Boolean(accountConfig && Object.hasOwn(accountConfig, "botToken"));
	if (accountConfig && accountHasBotToken) {
		const token = options?.allowUnresolvedSecretRef ? normalizeSecretInputString(accountConfig.botToken) : normalizeResolvedSecretInputString({
			value: accountConfig.botToken,
			path: `channels.zalo.accounts.${resolvedAccountId}.botToken`
		});
		if (token) return {
			token,
			source: "config"
		};
		const fileToken = readTokenFromFile(accountConfig.tokenFile);
		if (fileToken) return {
			token: fileToken,
			source: "configFile"
		};
	}
	if (!accountHasBotToken) {
		const fileToken = readTokenFromFile(accountConfig?.tokenFile);
		if (fileToken) return {
			token: fileToken,
			source: "configFile"
		};
	}
	if (!accountHasBotToken) {
		const token = options?.allowUnresolvedSecretRef ? normalizeSecretInputString(baseConfig?.botToken) : normalizeResolvedSecretInputString({
			value: baseConfig?.botToken,
			path: "channels.zalo.botToken"
		});
		if (token) return {
			token,
			source: "config"
		};
		const fileToken = readTokenFromFile(baseConfig?.tokenFile);
		if (fileToken) return {
			token: fileToken,
			source: "configFile"
		};
	}
	if (isDefaultAccount) {
		const envToken = process.env.ZALO_BOT_TOKEN?.trim();
		if (envToken) return {
			token: envToken,
			source: "env"
		};
	}
	return {
		token: "",
		source: "none"
	};
}
//#endregion
//#region extensions/zalo/src/accounts.ts
const { listAccountIds: listZaloAccountIds, resolveDefaultAccountId: resolveDefaultZaloAccountId } = createAccountListHelpers("zalo", { implicitDefaultAccount: {
	channelKeys: ["botToken", "tokenFile"],
	envVars: ["ZALO_BOT_TOKEN"]
} });
function mergeZaloAccountConfig(cfg, accountId) {
	return resolveMergedAccountConfig({
		channelConfig: cfg.channels?.zalo,
		accounts: (cfg.channels?.zalo)?.accounts,
		accountId,
		omitKeys: ["defaultAccount"]
	});
}
function resolveZaloAccount(params) {
	const accountId = normalizeAccountId(params.accountId ?? (params.cfg.channels?.zalo)?.defaultAccount);
	const baseEnabled = (params.cfg.channels?.zalo)?.enabled !== false;
	const merged = mergeZaloAccountConfig(params.cfg, accountId);
	const accountEnabled = merged.enabled !== false;
	const enabled = baseEnabled && accountEnabled;
	const tokenResolution = resolveZaloToken(params.cfg.channels?.zalo, accountId, { allowUnresolvedSecretRef: params.allowUnresolvedSecretRef });
	return {
		accountId,
		name: normalizeOptionalString(merged.name),
		enabled,
		token: tokenResolution.token,
		tokenSource: tokenResolution.source,
		config: merged
	};
}
function listEnabledZaloAccounts(cfg) {
	return listZaloAccountIds(cfg).map((accountId) => resolveZaloAccount({
		cfg,
		accountId
	})).filter((account) => account.enabled);
}
//#endregion
export { resolveZaloToken as a, resolveZaloAccount as i, listZaloAccountIds as n, resolveDefaultZaloAccountId as r, listEnabledZaloAccounts as t };
