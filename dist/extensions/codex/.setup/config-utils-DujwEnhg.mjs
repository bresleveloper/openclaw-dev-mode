import { asOptionalRecord as readRecord, normalizeOptionalString as readNonEmptyString, parseBooleanValue } from "openclaw/plugin-sdk/string-coerce-runtime";
import { createHmac, randomBytes } from "node:crypto";
import { resolvePositiveTimerTimeoutMs } from "openclaw/plugin-sdk/number-runtime";
import { splitCommandArgs } from "openclaw/plugin-sdk/process-runtime";
import { normalizeResolvedSecretInputString } from "openclaw/plugin-sdk/secret-input";
//#region extensions/codex/src/app-server/config-contracts.shared.ts
const CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
//#endregion
//#region extensions/codex/src/app-server/config-utils.ts
const START_OPTIONS_KEY_SECRET_SYMBOL = Symbol.for("openclaw.codexAppServerStartOptionsKeySecret");
const START_OPTIONS_KEY_SECRET = getStartOptionsKeySecret();
const PLAIN_DECIMAL_NUMBER_RE = /^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))$/;
function normalizeCodexServiceTier(value) {
	if (typeof value !== "string") return;
	const trimmed = value.trim();
	if (!trimmed) return;
	const normalized = trimmed.toLowerCase();
	if (normalized === "fast" || normalized === "priority") return "priority";
	if (normalized === "flex") return "flex";
	return trimmed;
}
function isCodexFastServiceTier(value) {
	return normalizeCodexServiceTier(value) === "priority";
}
function normalizePositiveNumber(value, fallback) {
	return resolvePositiveTimerTimeoutMs(value, fallback);
}
function normalizeHeaders(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	return Object.fromEntries(Object.entries(value).map(([key, child]) => [key.trim(), normalizeCodexAppServerSecretInput({
		value: child,
		path: `plugins.entries.codex.config.appServer.headers.${key}`
	})]).filter((entry) => Boolean(entry[0] && entry[1])));
}
function normalizeCodexAppServerSecretInput(params) {
	return normalizeResolvedSecretInputString(params);
}
function readBooleanEnv(value) {
	return parseBooleanValue(value);
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
	if (Array.isArray(configArgs)) return configArgs.map((entry) => readNonEmptyString(entry)).filter((entry) => entry !== void 0);
	return splitCommandArgs(typeof configArgs === "string" ? configArgs : envArgs ?? "", { allowUnclosedQuotes: true });
}
function hashSecretForKey(value, label) {
	if (!value) return null;
	return createHmac("sha256", START_OPTIONS_KEY_SECRET).update(label).update("\0").update(value).digest("hex");
}
function getStartOptionsKeySecret() {
	const globalState = globalThis;
	globalState[START_OPTIONS_KEY_SECRET_SYMBOL] ??= randomBytes(32);
	return globalState[START_OPTIONS_KEY_SECRET_SYMBOL];
}
//#endregion
export { normalizeHeaders as a, readExecAsk as c, readNumberEnv as d, readRecord as f, normalizeCodexServiceTier as i, readExecSecurity as l, CODEX_PLUGIN_MARKETPLACE_NAME_PATTERN as m, isCodexFastServiceTier as n, normalizePositiveNumber as o, resolveArgs as p, normalizeCodexAppServerSecretInput as r, readBooleanEnv as s, hashSecretForKey as t, readNonEmptyString as u };
