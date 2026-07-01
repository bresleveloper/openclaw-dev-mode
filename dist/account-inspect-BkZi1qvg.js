import { c as normalizeOptionalString } from "./string-coerce-DW4mBlAt.js";
import { m as FsSafeError } from "./path-BlG8lhgR.js";
import { c as hasConfiguredSecretInput, p as normalizeSecretInputString, s as coerceSecretRef } from "./types.secrets-lIZQEgMF.js";
import { a as tryReadSecretFileSync } from "./secret-file-PClaG9G0.js";
import { c as resolveDefaultSecretProviderAlias } from "./ref-contract-BWYV5Pqz.js";
import { n as normalizeAccountId } from "./account-id-5IgE9UKY.js";
import "./security-runtime-ZGC3cmUc.js";
import "./string-coerce-runtime-BiZzULo_.js";
import { t as resolveAccountWithDefaultFallback } from "./account-core-Dpb-yXIR.js";
import "./channel-core-DR2Gpugl.js";
import "./provider-auth-DKbeFxjY.js";
import "./routing-DGrdyZ4S.js";
import "./secret-input-Dq7Mxf9Y.js";
import "./secret-input-runtime-DqNAuUgp.js";
import { n as resolveTelegramAccountConfig, t as mergeTelegramAccountConfig } from "./account-config-BKRZ3sTn.js";
import { a as resolveDefaultTelegramAccountId } from "./accounts-CZb9tA5_.js";
//#region extensions/telegram/src/account-inspect.ts
function inspectTokenFile(pathValue) {
	const tokenFile = normalizeOptionalString(pathValue) ?? "";
	if (!tokenFile) return null;
	let token;
	try {
		token = tryReadSecretFileSync(tokenFile, "Telegram bot token", { rejectSymlink: true });
	} catch (error) {
		if (!(error instanceof FsSafeError)) throw error;
		return {
			token: "",
			tokenSource: "tokenFile",
			tokenStatus: "configured_unavailable"
		};
	}
	return {
		token: token ?? "",
		tokenSource: "tokenFile",
		tokenStatus: token ? "available" : "configured_unavailable"
	};
}
function canResolveEnvSecretRefInReadOnlyPath(params) {
	const providerConfig = params.cfg.secrets?.providers?.[params.provider];
	if (!providerConfig) return params.provider === resolveDefaultSecretProviderAlias(params.cfg, "env");
	if (providerConfig.source !== "env") return false;
	const allowlist = providerConfig.allowlist;
	return !allowlist || allowlist.includes(params.id);
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
	const accountTokenFile = inspectTokenFile(accountConfig?.tokenFile);
	if (accountTokenFile) return {
		accountId,
		enabled,
		name: normalizeOptionalString(merged.name),
		token: accountTokenFile.token,
		tokenSource: accountTokenFile.tokenSource,
		tokenStatus: accountTokenFile.tokenStatus,
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
		const channelTokenFile = inspectTokenFile(params.cfg.channels?.telegram?.tokenFile);
		if (channelTokenFile) return {
			accountId,
			enabled,
			name: normalizeOptionalString(merged.name),
			token: channelTokenFile.token,
			tokenSource: channelTokenFile.tokenSource,
			tokenStatus: channelTokenFile.tokenStatus,
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
		config: merged
	};
}
function inspectTelegramAccount(params) {
	return resolveAccountWithDefaultFallback({
		accountId: params.accountId,
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
//#endregion
export { inspectTelegramAccount as t };
