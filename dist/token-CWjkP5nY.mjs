import { t as asNonArrayRecord } from "./record-coerce-TIsquoVR.mjs";
import { _ as resolveSecretInputString, f as normalizeSecretInputString } from "./types.secrets-Dgbd2kyP.mjs";
import { n as normalizeAccountId, r as normalizeOptionalAccountId } from "./account-id-ifCOO7_9.mjs";
import { a as resolveNormalizedAccountEntry } from "./account-lookup-Dm5zJglt.mjs";
import { t as canResolveEnvSecretRefInReadOnlyPath } from "./secret-ref-readonly.internal-BueGE3VV.mjs";
import "./string-coerce-runtime-BbIJhy7G.mjs";
import "./account-core-DB3MSA02.mjs";
import "./routing-Dl7FngGa.mjs";
import { c as tryReadSecretFileSync } from "./secret-file-B1IW-_m6.mjs";
import "./secret-file-runtime-Dqf0GOQ3.mjs";
import "./secret-input-CHX7JVid.mjs";
import "./secret-ref-readonly-D__kCl0m.mjs";
import { r as resolveDefaultTelegramAccountId } from "./account-selection-CQ3hKgoh.mjs";
//#region extensions/telegram/src/token.ts
function readTelegramTokenFile(tokenFile, configPath, logMissingFile) {
	const result = tryReadSecretFileSync(tokenFile, "Telegram bot token", { rejectSymlink: true }, { configPath });
	if (result.status === "available") return {
		token: result.value,
		source: "tokenFile"
	};
	logMissingFile?.(`${configPath} is configured but unavailable`);
	return {
		token: "",
		source: "tokenFile",
		credentialDiagnostics: [result.diagnostic]
	};
}
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
	if (resolved.status === "available" || resolved.status === "missing") return resolved;
	if (resolved.ref.source === "env") {
		const envValue = resolveEnvSecretRefValue({
			cfg: params.cfg,
			provider: resolved.ref.provider,
			id: resolved.ref.id
		});
		return envValue ? {
			status: "available",
			value: envValue
		} : { status: "configured_unavailable" };
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
	if (accountId !== "default" && !accountCfg && Object.keys(asNonArrayRecord(telegramCfg?.accounts)).length > 0) {
		opts.logMissingFile?.(`channels.telegram.accounts: unknown accountId "${accountId}" — not found in config, refusing channel-level fallback`);
		return {
			token: "",
			source: "none"
		};
	}
	for (const { config, path } of [{
		config: accountCfg,
		path: `channels.telegram.accounts.${accountId}`
	}, {
		config: telegramCfg,
		path: "channels.telegram"
	}]) {
		const tokenFile = config?.tokenFile?.trim();
		if (tokenFile) return readTelegramTokenFile(tokenFile, `${path}.tokenFile`, opts.logMissingFile);
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
export { resolveTelegramToken as n, readTelegramTokenFile as t };
