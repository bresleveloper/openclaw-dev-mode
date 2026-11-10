import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { a as coerceSecretRef, f as normalizeSecretInputString, o as hasConfiguredSecretInput } from "./types.secrets-Dgbd2kyP.mjs";
import { n as normalizeAccountId } from "./account-id-ifCOO7_9.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-BueGE3VV.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./routing-Dl7FngGa.mjs";
import "./secret-input-CHX7JVid.mjs";
import "./secret-ref-readonly-D__kCl0m.mjs";
import { a as mergeTelegramAccountConfig, n as listTelegramAccountIds, o as resolveTelegramAccountConfig } from "./account-selection-CQ3hKgoh.mjs";
import { t as readTelegramTokenFile } from "./token-CWjkP5nY.mjs";
import { a as resolveTelegramAccountFallback } from "./accounts-CHcpIFN8.mjs";
//#region extensions/telegram/src/account-inspect.ts
function inspectTokenFile(pathValue, configPath) {
	const tokenFile = normalizeOptionalString(pathValue) ?? "";
	if (!tokenFile) return null;
	const result = readTelegramTokenFile(tokenFile, configPath);
	return {
		token: result.token,
		tokenSource: result.source,
		tokenStatus: result.credentialDiagnostics ? "configured_unavailable" : "available",
		...result.credentialDiagnostics ? { credentialDiagnostics: result.credentialDiagnostics } : {}
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
	if (token || hasConfiguredSecretInput(params.value, params.cfg.secrets?.defaults)) return {
		token: token || "",
		tokenSource: "config",
		tokenStatus: token ? "available" : "configured_unavailable"
	};
	return null;
}
function hasConfiguredTelegramAccounts(cfg) {
	return Object.keys(asNonArrayRecord(cfg.channels?.telegram?.accounts)).length > 0;
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
	return resolveTelegramAccountFallback(params, (accountId) => inspectTelegramAccountPrimary({
		cfg: params.cfg,
		accountId,
		envToken: params.envToken
	}));
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
	const groups = resolveTelegramAccountConfig(params.cfg, account.accountId)?.groups ?? params.cfg.channels?.telegram?.groups;
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
