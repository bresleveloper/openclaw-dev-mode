import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { n as asNullableObjectRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import path from "node:path";
import { inspectTlsCertificateError } from "@openclaw/ai/internal/shared";
//#region src/plugins/provider-openai-chatgpt-oauth-tls.ts
/** TLS helpers for ChatGPT OAuth provider discovery in plugin runtime code. */
const OPENAI_AUTH_PROBE_URL = "https://auth.openai.com/oauth/authorize?response_type=code&client_id=openclaw-preflight&redirect_uri=http%3A%2F%2Flocalhost%3A1455%2Fauth%2Fcallback&scope=openid+profile+email";
const OPENAI_PROVIDER_ID = "openai";
function extractFailure(error) {
	const tlsFailure = inspectTlsCertificateError(error);
	if (tlsFailure) return {
		code: tlsFailure.code,
		message: tlsFailure.message,
		kind: "tls-cert"
	};
	const root = asNullableObjectRecord(error);
	const rootCause = asNullableObjectRecord(root?.cause);
	return {
		code: typeof rootCause?.code === "string" ? rootCause.code : void 0,
		message: typeof rootCause?.message === "string" ? rootCause.message : typeof root?.message === "string" ? root.message : String(error),
		kind: "network"
	};
}
function resolveHomebrewPrefixFromExecPath(execPath) {
	const marker = `${path.sep}Cellar${path.sep}`;
	const idx = execPath.indexOf(marker);
	if (idx > 0) return execPath.slice(0, idx);
	const envPrefix = process.env.HOMEBREW_PREFIX?.trim();
	return envPrefix ? envPrefix : null;
}
function resolveCertBundlePath() {
	const prefix = resolveHomebrewPrefixFromExecPath(process.execPath);
	if (!prefix) return null;
	return path.join(prefix, "etc", "openssl@3", "cert.pem");
}
function hasOpenAICodexOAuthProfile(cfg) {
	const profiles = cfg.auth?.profiles;
	if (!profiles) return false;
	return Object.values(profiles).some((profile) => profile.provider === OPENAI_PROVIDER_ID && profile.mode === "oauth");
}
function shouldRunOpenAIOAuthTlsPrerequisites(params) {
	if (params.deep === true) return true;
	return hasOpenAICodexOAuthProfile(params.cfg);
}
async function runOpenAIOAuthTlsPreflight(options) {
	const timeoutMs = resolveTimerTimeoutMs(options?.timeoutMs, 5e3);
	const fetchImpl = options?.fetchImpl ?? fetch;
	let response;
	try {
		response = await fetchImpl(OPENAI_AUTH_PROBE_URL, {
			method: "GET",
			redirect: "manual",
			signal: AbortSignal.timeout(timeoutMs)
		});
		return { ok: true };
	} catch (error) {
		const failure = extractFailure(error);
		return {
			ok: false,
			kind: failure.kind,
			code: failure.code,
			message: failure.message
		};
	} finally {
		await cancelUnreadResponseBody(response);
	}
}
function formatOpenAIOAuthTlsPreflightFix(result) {
	if (result.kind !== "tls-cert") return [
		"OpenAI OAuth prerequisites check failed due to a network error before the browser flow.",
		`Cause: ${result.message}`,
		"Verify DNS/firewall/proxy access to auth.openai.com and retry."
	].join("\n");
	const certBundlePath = resolveCertBundlePath();
	const lines = [
		"OpenAI OAuth prerequisites check failed: Node/OpenSSL cannot validate TLS certificates.",
		`Cause: ${result.code ? `${result.code} (${result.message})` : result.message}`,
		"",
		"Fix (Homebrew Node/OpenSSL):",
		`- ${formatCliCommand("brew postinstall ca-certificates")}`,
		`- ${formatCliCommand("brew postinstall openssl@3")}`
	];
	if (certBundlePath) lines.push(`- Verify cert bundle exists: ${certBundlePath}`);
	lines.push("- Retry the OAuth login flow.");
	return lines.join("\n");
}
async function noteOpenAIOAuthTlsPrerequisites(params) {
	if (!shouldRunOpenAIOAuthTlsPrerequisites(params)) return;
	const result = await runOpenAIOAuthTlsPreflight({ timeoutMs: 4e3 });
	if (result.ok || result.kind !== "tls-cert") return;
	note(formatOpenAIOAuthTlsPreflightFix(result), "OAuth TLS prerequisites");
}
//#endregion
export { formatOpenAIOAuthTlsPreflightFix, noteOpenAIOAuthTlsPrerequisites, runOpenAIOAuthTlsPreflight, shouldRunOpenAIOAuthTlsPrerequisites };
