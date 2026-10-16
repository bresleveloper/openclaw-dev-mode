import { _ as resolveSecretInputString, f as normalizeSecretInputString } from "./types.secrets-DsPRn9Dz.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-DbRsdayc.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-D_rRUHd5.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-qsdt7vnj.mjs";
import "./account-core-BE1fOhGS.mjs";
import "./routing-CEr1aXk1.mjs";
import { c as tryReadSecretFileSync } from "./secret-file-B_nJw6pE.mjs";
import "./secret-file-runtime-DMbN7rMd.mjs";
import "./secret-input-BXhRrpGu.mjs";
import "./secret-ref-readonly-CV8L1W2H.mjs";
import { r as resolveDefaultTelegramAccountId } from "./account-selection-DV4XVSJR.mjs";
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
	const accountCfg = Array.isArray(telegramCfg?.accounts) ? void 0 : resolveNormalizedAccountEntry(telegramCfg?.accounts, accountId, normalizeAccountId);
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
	for (const { config, path } of [{
		config: accountCfg,
		path: `channels.telegram.accounts.${accountId}`
	}, {
		config: telegramCfg,
		path: "channels.telegram"
	}]) {
		const tokenFile = config?.tokenFile?.trim();
		if (tokenFile) {
			const result = tryReadSecretFileSync(tokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath: `${path}.tokenFile` });
			if (result.status === "available") return {
				token: result.value,
				source: "tokenFile"
			};
			opts.logMissingFile?.(`${path}.tokenFile is configured but unavailable`);
			return {
				token: "",
				source: "tokenFile",
				credentialDiagnostics: [result.diagnostic]
			};
		}
		const token = resolveRuntimeTokenValue({
			cfg,
			value: config?.botToken,
			path: `${path}.botToken`
		});
		if (token.status === "available") return {
			token: token.value,
			source: "config"
		};
		if (token.status === "configured_unavailable") return {
			token: "",
			source: "none"
		};
	}
	const envToken = accountId === "default" ? (opts.envToken ?? process.env.TELEGRAM_BOT_TOKEN)?.trim() : "";
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
