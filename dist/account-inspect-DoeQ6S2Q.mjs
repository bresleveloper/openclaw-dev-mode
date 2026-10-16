import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { a as coerceSecretRef, f as normalizeSecretInputString, o as hasConfiguredSecretInput } from "./types.secrets-DsPRn9Dz.mjs";
import { n as normalizeAccountId } from "./account-id-DbRsdayc.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-qsdt7vnj.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { t as resolveAccountWithDefaultFallback } from "./account-core-BE1fOhGS.mjs";
import "./routing-CEr1aXk1.mjs";
import { c as tryReadSecretFileSync } from "./secret-file-B_nJw6pE.mjs";
import "./secret-file-runtime-DMbN7rMd.mjs";
import "./secret-input-BXhRrpGu.mjs";
import "./secret-ref-readonly-CV8L1W2H.mjs";
import { a as mergeTelegramAccountConfig, o as resolveTelegramAccountConfig } from "./account-selection-DV4XVSJR.mjs";
import { i as resolveDefaultTelegramAccountId, r as listTelegramAccountIds } from "./accounts-Dt8wbZ2I.mjs";
//#region extensions/telegram/src/account-inspect.ts
function inspectTokenFile(pathValue, configPath) {
	const tokenFile = normalizeOptionalString(pathValue) ?? "";
	if (!tokenFile) return null;
	const result = tryReadSecretFileSync(tokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath });
	if (result.status === "configured_unavailable") return {
		token: "",
		tokenSource: "tokenFile",
		tokenStatus: "configured_unavailable",
		credentialDiagnostics: [result.diagnostic]
	};
	return {
		token: result.value,
		tokenSource: "tokenFile",
		tokenStatus: "available"
	};
}
function inspectTokenValue(params) {
	const ref = coerceSecretRef(params.value, params.cfg.secrets?.defaults);
	if (ref?.source === "env") {
		const envValue = canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: ref.provider,
			id: ref.id
		}) ? normalizeOptionalString(process.env[ref.id]) : void 0;
		return {
			token: envValue ?? "",
			tokenSource: "env",
			tokenStatus: envValue ? "available" : "configured_unavailable"
		};
	}
	const token = normalizeSecretInputString(params.value);
	if (token) return {
		token,
		tokenSource: "config",
		tokenStatus: "available"
	};
	if (hasConfiguredSecretInput(params.value, params.cfg.secrets?.defaults)) return {
		token: "",
		tokenSource: "config",
		tokenStatus: "configured_unavailable"
	};
	return null;
}
function hasConfiguredTelegramAccounts(cfg) {
	const accounts = cfg.channels?.telegram?.accounts;
	return Boolean(accounts) && typeof accounts === "object" && !Array.isArray(accounts) && Object.keys(accounts).length > 0;
}
function inspectTelegramAccountPrimary(params) {
	const accountId = normalizeAccountId(params.accountId);
	const merged = mergeTelegramAccountConfig(params.cfg, accountId);
	const account = {
		accountId,
		enabled: params.cfg.channels?.telegram?.enabled !== false && merged.enabled !== false,
		name: normalizeOptionalString(merged.name),
		config: merged
	};
	const accountConfig = resolveTelegramAccountConfig(params.cfg, accountId);
	const allowChannelCredentialFallback = accountId === "default" || Boolean(accountConfig) || !hasConfiguredTelegramAccounts(params.cfg);
	const credentialScopes = [{
		config: accountConfig,
		path: `channels.telegram.accounts.${accountId}`
	}, ...allowChannelCredentialFallback ? [{
		config: params.cfg.channels?.telegram,
		path: "channels.telegram"
	}] : []];
	for (const { config, path } of credentialScopes) {
		const credential = inspectTokenFile(config?.tokenFile, `${path}.tokenFile`) ?? inspectTokenValue({
			cfg: params.cfg,
			value: config?.botToken
		});
		if (credential) return {
			...account,
			...credential,
			configured: credential.tokenStatus !== "missing"
		};
	}
	const envToken = accountId === "default" ? normalizeOptionalString(params.envToken) ?? normalizeOptionalString(process.env.TELEGRAM_BOT_TOKEN) ?? "" : "";
	if (envToken) return {
		...account,
		token: envToken,
		tokenSource: "env",
		tokenStatus: "available",
		configured: true
	};
	return {
		...account,
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		configured: false,
		stateReason: allowChannelCredentialFallback ? void 0 : `not configured: unknown accountId "${accountId}" in multi-bot setup`
	};
}
function readTelegramAccount(params) {
	const resolvedAccountId = params.accountId ?? resolveDefaultTelegramAccountId(params.cfg);
	return resolveAccountWithDefaultFallback({
		accountId: resolvedAccountId,
		normalizeAccountId,
		resolvePrimary: (accountId) => inspectTelegramAccountPrimary({
			cfg: params.cfg,
			accountId,
			envToken: params.envToken
		}),
		hasCredential: (account) => account.tokenSource !== "none",
		resolveDefaultAccountId: () => resolveDefaultTelegramAccountId(params.cfg)
	});
}
function findTelegramTokenOwnerAccountId(params) {
	const normalizedAccountId = normalizeAccountId(params.accountId);
	const tokenOwners = /* @__PURE__ */ new Map();
	for (const id of listTelegramAccountIds(params.cfg)) {
		const account = readTelegramAccount({
			...params,
			accountId: id
		});
		const token = account.token.trim();
		if (!token) continue;
		const ownerAccountId = tokenOwners.get(token);
		if (!ownerAccountId) {
			tokenOwners.set(token, account.accountId);
			continue;
		}
		if (account.accountId === normalizedAccountId) return ownerAccountId;
	}
	return null;
}
function formatDuplicateTelegramTokenReason(params) {
	return `Duplicate Telegram bot token: account "${params.accountId}" shares a token with account "${params.ownerAccountId}". Keep one owner account per bot token.`;
}
function inspectTelegramAccount(params) {
	const account = readTelegramAccount(params);
	const ownerAccountId = account.token ? findTelegramTokenOwnerAccountId({
		...params,
		accountId: account.accountId
	}) : null;
	const groups = params.cfg.channels?.telegram?.accounts?.[account.accountId]?.groups ?? params.cfg.channels?.telegram?.groups;
	return {
		...account,
		configured: account.configured && !ownerAccountId,
		stateReason: ownerAccountId ? formatDuplicateTelegramTokenReason({
			accountId: account.accountId,
			ownerAccountId
		}) : account.stateReason,
		mode: account.config.webhookUrl ? "webhook" : "polling",
		allowUnmentionedGroups: Object.values(groups ?? {}).some((group) => group?.requireMention === false)
	};
}
//#endregion
export { formatDuplicateTelegramTokenReason as n, inspectTelegramAccount as r, findTelegramTokenOwnerAccountId as t };
