import { h as registerSecretValueForRedaction } from "./redact-B9QQ4Wyz.js";
import { randomBytes } from "node:crypto";
//#region src/secrets/sentinel.ts
const SECRET_SENTINEL_PREFIX = "oc-sent-v1-";
const SECRET_SENTINEL_SOURCE = `${SECRET_SENTINEL_PREFIX}[0-9a-f]{24}`;
const SECRET_SENTINEL_PATTERN = new RegExp(SECRET_SENTINEL_SOURCE, "g");
const valuesBySentinel = /* @__PURE__ */ new Map();
const sentinelsByValueAndLabel = /* @__PURE__ */ new Map();
function secretSentinelsEnabled(env = process.env) {
	const configured = env.OPENCLAW_SECRET_SENTINELS?.trim().toLowerCase();
	return configured !== "off" && configured !== "0" && configured !== "false";
}
function looksLikeSecretSentinel(value) {
	return new RegExp(`^${SECRET_SENTINEL_SOURCE}$`).test(value);
}
/** Mints one stable process-local sentinel for a secret value and label. */
function mintSecretSentinel(value, meta) {
	registerSecretValueForRedaction(value);
	if (!secretSentinelsEnabled()) return value;
	const byLabel = sentinelsByValueAndLabel.get(value) ?? /* @__PURE__ */ new Map();
	const existing = byLabel.get(meta.label);
	if (existing) return existing;
	let sentinel;
	do
		sentinel = `${SECRET_SENTINEL_PREFIX}${randomBytes(12).toString("hex")}`;
	while (valuesBySentinel.has(sentinel));
	byLabel.set(meta.label, sentinel);
	sentinelsByValueAndLabel.set(value, byLabel);
	valuesBySentinel.set(sentinel, value);
	return sentinel;
}
/** Resolves a process-local sentinel without exposing the registry itself. */
function resolveSecretSentinel(sentinel) {
	const value = valuesBySentinel.get(sentinel);
	if (value !== void 0) registerSecretValueForRedaction(value);
	return value;
}
/** Swaps every known sentinel substring and reports unknown sentinel-shaped values. */
function swapSecretSentinelsInText(text) {
	if (!text.includes(SECRET_SENTINEL_PREFIX)) return {
		text,
		unknown: []
	};
	const unknown = /* @__PURE__ */ new Set();
	return {
		text: text.replace(new RegExp(SECRET_SENTINEL_SOURCE, "g"), (sentinel) => {
			const value = resolveSecretSentinel(sentinel);
			if (value === void 0) {
				unknown.add(sentinel);
				return sentinel;
			}
			return value;
		}),
		unknown: [...unknown]
	};
}
//#endregion
export { swapSecretSentinelsInText as a, resolveSecretSentinel as i, looksLikeSecretSentinel as n, mintSecretSentinel as r, SECRET_SENTINEL_PATTERN as t };
