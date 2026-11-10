import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as note } from "./note-CmoIRLec.mjs";
import { t as runHttpTlsPreflight } from "./http-tls-preflight-nN0IyrZJ.mjs";
import path from "node:path";
//#region src/plugins/provider-openai-chatgpt-oauth-tls.ts
/** TLS helpers for ChatGPT OAuth provider discovery in plugin runtime code. */
const OPENAI_AUTH_PROBE_URL = "https://auth.openai.com/oauth/authorize?response_type=code&client_id=openclaw-preflight&redirect_uri=http%3A%2F%2Flocalhost%3A1455%2Fauth%2Fcallback&scope=openid+profile+email";
const OPENAI_PROVIDER_ID = "openai";
function resolveHomebrewPrefixFromExecPath(execPath) {
	const marker = `${path.sep}Cellar${path.sep}`;
	const idx = execPath.indexOf(marker);
	if (idx > 0) return execPath.slice(0, idx);
	const envPrefix = process.env.HOMEBREW_PREFIX?.trim();
	return envPrefix ? envPrefix : null;
}
function shouldRunOpenAIOAuthTlsPrerequisites(params) {
	return params.deep === true || Object.values(params.cfg.auth?.profiles ?? {}).some((profile) => profile.provider === OPENAI_PROVIDER_ID && profile.mode === "oauth");
}
function runOpenAIOAuthTlsPreflight(options) {
	return runHttpTlsPreflight(OPENAI_AUTH_PROBE_URL, options);
}
function formatOpenAIOAuthTlsPreflightFix(result) {
	if (result.kind !== "tls-cert") return [
		"OpenAI OAuth prerequisites check failed due to a network error before the browser flow.",
		`Cause: ${result.message}`,
		"Verify DNS/firewall/proxy access to auth.openai.com and retry."
	].join("\n");
	const prefix = resolveHomebrewPrefixFromExecPath(process.execPath);
	const certBundlePath = prefix ? path.join(prefix, "etc", "openssl@3", "cert.pem") : null;
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
