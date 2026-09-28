import { n as normalizeAccountId, r as normalizeOptionalAccountId, t as DEFAULT_ACCOUNT_ID } from "./account-id-B1bfbA5J.mjs";
import { m as resolveSecretInputString, u as normalizeSecretInputString } from "./types.secrets-B5xWSzLp.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-CVHGcV8B.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-DPtRYfnc.mjs";
import "./account-core-CZZ_BKA9.mjs";
import "./routing-JKvWkBDR.mjs";
import { c as tryReadSecretFileSync } from "./secret-file-BqGFHdII.mjs";
import "./secret-file-runtime-C-pb0auB.mjs";
import "./secret-input-DTg0P0Pk.mjs";
import "./secret-ref-readonly-COngYS0C.mjs";
import { r as resolveDefaultTelegramAccountId } from "./account-selection-DO7ZNLRi.mjs";
//#region extensions/telegram/src/token.ts
function resolveEnvSecretRefValue(params) {
	if (canResolveEnvSecretRefInReadOnlyPath(params)) return normalizeSecretInputString(process.env[params.id]);
	const providerConfig = params.cfg?.secrets?.providers?.[params.provider];
	if (!providerConfig) throw new Error(`Secret provider "${params.provider}" is not configured (ref: env:${params.provider}:${params.id}).`);
	if (providerConfig.source !== "env") throw new Error(`Secret provider "${params.provider}" has source "${providerConfig.source}" but ref requests "env".`);
	throw new Error(`Environment variable "${params.id}" is not allowlisted in secrets.providers.${params.provider}.allowlist.`);
}
function resolveRuntimeTokenValue(params) {
	const resolved = resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg?.secrets?.defaults,
		mode: "inspect"
	});
	if (resolved.status === "available") return {
		status: "available",
		value: resolved.value
	};
	if (resolved.status === "missing") return { status: "missing" };
	if (resolved.ref.source === "env") {
		const envValue = resolveEnvSecretRefValue({
			cfg: params.cfg,
			provider: resolved.ref.provider,
			id: resolved.ref.id
		});
		if (envValue) return {
			status: "available",
			value: envValue
		};
		return { status: "configured_unavailable" };
	}
	resolveSecretInputString({
		value: params.value,
		path: params.path,
		defaults: params.cfg?.secrets?.defaults,
		mode: "strict"
	});
	return { status: "configured_unavailable" };
}
function resolveTelegramToken(cfg, opts = {}) {
	const accountId = normalizeOptionalAccountId(opts.accountId) ?? (cfg ? resolveDefaultTelegramAccountId(cfg) : "default");
	const telegramCfg = cfg?.channels?.telegram;
	const resolveAccountCfg = (id) => {
		const accounts = telegramCfg?.accounts;
		return Array.isArray(accounts) ? void 0 : resolveNormalizedAccountEntry(accounts, id, normalizeAccountId);
	};
	const accountCfg = resolveAccountCfg(accountId !== "default" ? accountId : DEFAULT_ACCOUNT_ID);
	if (accountId !== "default" && !accountCfg) {
		const accounts = telegramCfg?.accounts;
		if (Boolean(accounts) && typeof accounts === "object" && !Array.isArray(accounts) && Object.keys(accounts).length > 0) {
			opts.logMissingFile?.(`channels.telegram.accounts: unknown accountId "${accountId}" — not found in config, refusing channel-level fallback`);
			return {
				token: "",
				source: "none"
			};
		}
	}
	const accountTokenFile = accountCfg?.tokenFile?.trim();
	if (accountTokenFile) {
		const result = tryReadSecretFileSync(accountTokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath: `channels.telegram.accounts.${accountId}.tokenFile` });
		if (result.status === "available") return {
			token: result.value,
			source: "tokenFile"
		};
		opts.logMissingFile?.(`channels.telegram.accounts.${accountId}.tokenFile is configured but unavailable`);
		return {
			token: "",
			source: "tokenFile",
			credentialDiagnostics: [result.diagnostic]
		};
	}
	const accountToken = resolveRuntimeTokenValue({
		cfg,
		value: accountCfg?.botToken,
		path: `channels.telegram.accounts.${accountId}.botToken`
	});
	if (accountToken.status === "available") return {
		token: accountToken.value,
		source: "config"
	};
	if (accountToken.status === "configured_unavailable") return {
		token: "",
		source: "none"
	};
	const allowEnv = accountId === DEFAULT_ACCOUNT_ID;
	const tokenFile = telegramCfg?.tokenFile?.trim();
	if (tokenFile) {
		const result = tryReadSecretFileSync(tokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath: "channels.telegram.tokenFile" });
		if (result.status === "available") return {
			token: result.value,
			source: "tokenFile"
		};
		opts.logMissingFile?.("channels.telegram.tokenFile is configured but unavailable");
		return {
			token: "",
			source: "tokenFile",
			credentialDiagnostics: [result.diagnostic]
		};
	}
	const configToken = resolveRuntimeTokenValue({
		cfg,
		value: telegramCfg?.botToken,
		path: "channels.telegram.botToken"
	});
	if (configToken.status === "available") return {
		token: configToken.value,
		source: "config"
	};
	if (configToken.status === "configured_unavailable") return {
		token: "",
		source: "none"
	};
	const envToken = allowEnv ? (opts.envToken ?? process.env.TELEGRAM_BOT_TOKEN)?.trim() : "";
	if (envToken) return {
		token: envToken,
		source: "env"
	};
	return {
		token: "",
		source: "none"
	};
}
//#endregion
export { resolveTelegramToken as t };
