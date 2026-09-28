import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { n as normalizeAccountId } from "./account-id-B1bfbA5J.mjs";
import { a as coerceSecretRef, o as hasConfiguredSecretInput, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-DPtRYfnc.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import { t as resolveAccountWithDefaultFallback } from "./account-core-CZZ_BKA9.mjs";
import "./routing-JKvWkBDR.mjs";
import { c as tryReadSecretFileSync } from "./secret-file-BqGFHdII.mjs";
import "./secret-file-runtime-C-pb0auB.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import "./secret-ref-readonly-COngYS0C.mjs";
import { a as mergeTelegramAccountConfig, o as resolveTelegramAccountConfig } from "./account-selection-DO7ZNLRi.mjs";
import { a as resolveDefaultTelegramAccountId, r as listTelegramAccountIds } from "./accounts-ByNW1Cs3.mjs";
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
		token: result.status === "available" ? result.value : "",
		tokenSource: "tokenFile",
		tokenStatus: result.status === "available" ? "available" : "configured_unavailable"
	};
}
function inspectTokenValue(params) {
	const ref = coerceSecretRef(params.value, params.cfg.secrets?.defaults);
	if (ref?.source === "env") {
		if (!canResolveEnvSecretRefInReadOnlyPath({
			cfg: params.cfg,
			provider: ref.provider,
			id: ref.id
		})) return {
			token: "",
			tokenSource: "env",
			tokenStatus: "configured_unavailable"
		};
		const envValue = normalizeOptionalString(process.env[ref.id]);
		if (envValue) return {
			token: envValue,
			tokenSource: "env",
			tokenStatus: "available"
		};
		return {
			token: "",
			tokenSource: "env",
			tokenStatus: "configured_unavailable"
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
	const enabled = params.cfg.channels?.telegram?.enabled !== false && merged.enabled !== false;
	const accountConfig = resolveTelegramAccountConfig(params.cfg, accountId);
	const allowChannelCredentialFallback = accountId === "default" || Boolean(accountConfig) || !hasConfiguredTelegramAccounts(params.cfg);
	const accountTokenFile = inspectTokenFile(accountConfig?.tokenFile, `channels.telegram.accounts.${accountId}.tokenFile`);
	if (accountTokenFile) return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: accountTokenFile.token,
		tokenSource: accountTokenFile.tokenSource,
		tokenStatus: accountTokenFile.tokenStatus,
		...accountTokenFile.credentialDiagnostics ? { credentialDiagnostics: accountTokenFile.credentialDiagnostics } : {},
		configured: accountTokenFile.tokenStatus !== "missing",
		config: merged
	};
	const accountToken = inspectTokenValue({
		cfg: params.cfg,
		value: accountConfig?.botToken
	});
	if (accountToken) return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: accountToken.token,
		tokenSource: accountToken.tokenSource,
		tokenStatus: accountToken.tokenStatus,
		configured: accountToken.tokenStatus !== "missing",
		config: merged
	};
	if (allowChannelCredentialFallback) {
		const channelTokenFile = inspectTokenFile(params.cfg.channels?.telegram?.tokenFile, "channels.telegram.tokenFile");
		if (channelTokenFile) return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			token: channelTokenFile.token,
			tokenSource: channelTokenFile.tokenSource,
			tokenStatus: channelTokenFile.tokenStatus,
			...channelTokenFile.credentialDiagnostics ? { credentialDiagnostics: channelTokenFile.credentialDiagnostics } : {},
			configured: channelTokenFile.tokenStatus !== "missing",
			config: merged
		};
		const channelToken = inspectTokenValue({
			cfg: params.cfg,
			value: params.cfg.channels?.telegram?.botToken
		});
		if (channelToken) return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			token: channelToken.token,
			tokenSource: channelToken.tokenSource,
			tokenStatus: channelToken.tokenStatus,
			configured: channelToken.tokenStatus !== "missing",
			config: merged
		};
	}
	const envToken = accountId === "default" ? normalizeOptionalString(params.envToken) ?? normalizeOptionalString(process.env.TELEGRAM_BOT_TOKEN) ?? "" : "";
	if (envToken) return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: envToken,
		tokenSource: "env",
		tokenStatus: "available",
		configured: true,
		config: merged
	};
	return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: "",
		tokenSource: "none",
		tokenStatus: "missing",
		configured: false,
		stateReason: allowChannelCredentialFallback ? void 0 : `not configured: unknown accountId "${accountId}" in multi-bot setup`,
		config: merged
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
