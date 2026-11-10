import { t as normalizeCodexServiceTier } from "./service-tier-normalization-BPgw2Wdt.mjs";
import { asOptionalRecord as readRecord, normalizeOptionalString as readNonEmptyString, normalizeTrimmedStringList } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHmac, randomBytes } from "node:crypto";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
import { resolveGlobalSingleton } from "openclaw/plugin-sdk/global-singleton";
import { splitCommandArgs } from "openclaw/plugin-sdk/process-runtime";
//#region extensions/codex/src/app-server/config-utils.ts
const START_OPTIONS_KEY_SECRET = resolveGlobalSingleton(Symbol.for("openclaw.codexAppServerStartOptionsKeySecret"), () => randomBytes(32));
const PLAIN_DECIMAL_NUMBER_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))$/;
function appendCodexGitConfigParameters(base, parameters) {
	return !base ? parameters : base === parameters || base.endsWith(` ${parameters}`) ? base : `${base} ${parameters}`;
}
function isCodexFastServiceTier(value) {
	return normalizeCodexServiceTier(value) === "priority";
}
function normalizeHeaders(value) {
	return Object.fromEntries(Object.entries(value ?? {}).flatMap(([key, child]) => {
		const name = key.trim();
		const header = normalizeResolvedSecretInputString({
			value: child,
			path: `plugins.entries.codex.config.appServer.headers.${key}`
		});
		return name && header ? [[name, header]] : [];
	}));
}
function readExecSecurity(value) {
	return value === "deny" || value === "allowlist" || value === "full" ? value : void 0;
}
function readExecAsk(value) {
	return value === "off" || value === "on-miss" || value === "always" ? value : void 0;
}
function readNumberEnv(value) {
	const trimmed = value?.trim();
	if (!trimmed || !PLAIN_DECIMAL_NUMBER_RE.test(trimmed)) return;
	const parsed = Number(trimmed);
	return Number.isFinite(parsed) ? parsed : void 0;
}
function resolveArgs(configArgs, envArgs) {
	if (Array.isArray(configArgs)) return normalizeTrimmedStringList(configArgs);
	return splitCommandArgs(configArgs ?? envArgs ?? "", { allowUnclosedQuotes: true });
}
function hashSecretForKey(value, label) {
	if (!value) return null;
	return createHmac("sha256", START_OPTIONS_KEY_SECRET).update(label).update("\0").update(value).digest("hex");
}
//#endregion
export { readExecAsk as a, readNumberEnv as c, normalizeHeaders as i, readRecord as l, hashSecretForKey as n, readExecSecurity as o, isCodexFastServiceTier as r, readNonEmptyString as s, appendCodexGitConfigParameters as t, resolveArgs as u };
