import { n as isRedactedSecretValue } from "./redact-sentinel-f_PhnHTI.mjs";
//#region src/gateway/known-weak-gateway-secrets.ts
const KNOWN_WEAK_GATEWAY_TOKENS = /* @__PURE__ */ new Set(["change-me-to-a-long-random-token", "change-me-now"]);
const KNOWN_WEAK_GATEWAY_PASSWORDS = /* @__PURE__ */ new Set(["change-me-to-a-strong-password"]);
/** Known non-secret values left by blank input or JavaScript string coercion. */
function isInvalidGatewaySecret(value) {
	return typeof value === "string" && [
		"",
		"undefined",
		"null"
	].includes(value.trim());
}
/** Optional proxy passwords remain diagnosable without owning proxy startup. */
function getTrustedProxyPasswordRedactionWarning(auth) {
	if (auth.mode !== "trusted-proxy" || !isRedactedSecretValue(auth.password)) return;
	return "Gateway optional password is a known redaction sentinel. Trusted-proxy authentication remains available, but local password fallback is unavailable. Replace or remove gateway.auth.password / OPENCLAW_GATEWAY_PASSWORD and restart the Gateway.";
}
function assertGatewayAuthNotKnownWeak(auth, rawToken, rawPassword) {
	if (auth.mode !== "token" && auth.mode !== "password") return;
	const credentialKind = auth.mode;
	const credential = auth[credentialKind] ?? (credentialKind === "token" ? rawToken : rawPassword);
	if (isRedactedSecretValue(credential)) throw new Error(`Gateway auth ${credentialKind} is a known redaction sentinel, not a credential. ` + (credentialKind === "password" ? "Replace gateway.auth.password, OPENCLAW_GATEWAY_PASSWORD, or its external secret source with a real password, then restart the Gateway." : "Run `openclaw doctor --fix` to repair the Gateway token or replace the external secret, then restart and re-pair devices."));
	const placeholders = credentialKind === "token" ? KNOWN_WEAK_GATEWAY_TOKENS : KNOWN_WEAK_GATEWAY_PASSWORDS;
	if (isInvalidGatewaySecret(credential) || typeof credential === "string" && placeholders.has(credential.trim())) throw new Error(`Invalid config: gateway auth ${credentialKind} is blank, a published example placeholder, or the literal string undefined/null. Generate a real secret (for example, \`openssl rand -hex 32\`) and ` + (credentialKind === "token" ? "update gateway.auth.token or its external source. For blank or undefined/null inline tokens, `openclaw doctor --fix --generate-gateway-token` can generate one." : "set OPENCLAW_GATEWAY_PASSWORD or gateway.auth.password (or its external source) before starting the gateway."));
}
//#endregion
export { getTrustedProxyPasswordRedactionWarning as n, isInvalidGatewaySecret as r, assertGatewayAuthNotKnownWeak as t };
