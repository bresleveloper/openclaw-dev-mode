import { t as formatCliCommand } from "./command-format-DRYc0E-8.mjs";
import { a as resolveGatewayService } from "./service-BCULlL85.mjs";
import { r as hasEnvHttpProxyConfigured } from "./proxy-env-BwCPCI9p.mjs";
import { t as note } from "./note-UlSlsJKw.mjs";
import { t as probeManagedProxyLoopback } from "./proxy-validation-UaMcyagY.mjs";
import { l as shouldManageGatewayService } from "./doctor-service-repair-policy-B56mlGZD.mjs";
import tls from "node:tls";
//#region src/commands/doctor-web-fetch-proxy.ts
/** Doctor diagnostics for managed loopback and web_fetch proxy routing. */
const DIRECT_PROBE_HOST = "docs.openclaw.ai";
const DIRECT_PROBE_PORT = 443;
const DIRECT_PROBE_TIMEOUT_MS = 3e3;
const HTTP_PROXY_ENV_KEYS = [
	"HTTP_PROXY",
	"HTTPS_PROXY",
	"http_proxy",
	"https_proxy"
];
function listConfiguredProxyKeys(env) {
	return HTTP_PROXY_ENV_KEYS.filter((key) => Boolean(env[key]?.trim()));
}
async function probeDirectTlsConnectivity() {
	return await new Promise((resolve) => {
		let settled = false;
		const socket = tls.connect({
			host: DIRECT_PROBE_HOST,
			port: DIRECT_PROBE_PORT,
			servername: DIRECT_PROBE_HOST,
			timeout: DIRECT_PROBE_TIMEOUT_MS
		});
		const finish = (result) => {
			if (settled) return;
			settled = true;
			socket.destroy();
			resolve(result);
		};
		socket.once("secureConnect", () => finish("reachable"));
		socket.once("timeout", () => finish("unreachable"));
		socket.once("error", () => finish("unreachable"));
	});
}
async function resolveProxyEnvSources(params) {
	const sources = [];
	if (hasEnvHttpProxyConfigured("https", params.env)) sources.push({
		env: params.env,
		label: "doctor process"
	});
	if (!await shouldManageGatewayService(params.env)) return sources;
	const serviceEnv = (await params.service.readCommand(params.env).catch(() => null))?.environment;
	if (serviceEnv && hasEnvHttpProxyConfigured("https", serviceEnv)) sources.push({
		env: serviceEnv,
		label: "installed Gateway service"
	});
	return sources;
}
/** Builds a read-only diagnostic when proxy env exists but web_fetch remains direct. */
async function collectWebFetchProxyDiagnostic(params) {
	if (params.cfg.gateway?.mode === "remote" || params.cfg.tools?.web?.fetch?.enabled === false || params.cfg.tools?.web?.fetch?.useTrustedEnvProxy === true) return null;
	const sources = await resolveProxyEnvSources({
		env: params.env ?? process.env,
		service: params.service ?? resolveGatewayService()
	});
	if (sources.length === 0) return null;
	const directConnectivity = await (params.probeDirectConnectivity ?? probeDirectTlsConnectivity)();
	const sourceLines = sources.map((source) => {
		const keys = listConfiguredProxyKeys(source.env);
		return `- HTTP(S) proxy environment detected in the ${source.label}: ${keys.join(", ")}.`;
	});
	const directProbe = directConnectivity === "reachable" ? `- Direct TLS connectivity to ${DIRECT_PROBE_HOST}:${DIRECT_PROBE_PORT} succeeded.` : `- Direct TLS connectivity to ${DIRECT_PROBE_HOST}:${DIRECT_PROBE_PORT} failed.`;
	return [
		...sourceLines,
		"- web_fetch still uses direct connections because tools.web.fetch.useTrustedEnvProxy is not enabled.",
		directProbe,
		"- If direct web_fetch requests time out and the proxy is operator-controlled, enable the explicit opt-in:",
		`  ${formatCliCommand("openclaw config set tools.web.fetch.useTrustedEnvProxy true")}`,
		"- Keep the opt-in disabled for untrusted proxies; enabling it lets the proxy resolve DNS after OpenClaw's hostname checks."
	].join("\n");
}
/** Emits a managed-loopback failure or the web_fetch proxy diagnostic when relevant. */
async function noteWebFetchProxyDiagnostic(params) {
	if (params.cfg.gateway?.mode === "remote") return;
	const env = params.env ?? process.env;
	if (await probeManagedProxyLoopback({
		config: params.cfg.proxy,
		env
	}).catch(() => false) === false) {
		const loopbackMode = params.cfg.proxy?.loopbackMode ?? env.OPENCLAW_PROXY_LOOPBACK_MODE;
		const repair = loopbackMode === "proxy" || loopbackMode === "block" ? [`- proxy.loopbackMode=${loopbackMode} prevents direct local routing. Restore it with:`, `  ${formatCliCommand("openclaw config set proxy.loopbackMode gateway-only")}`] : [
			"- Temporarily disable managed routing to recover local connections:",
			`  ${formatCliCommand("openclaw config set proxy.enabled false")}`,
			"- If external traffic requires a proxy, keep HTTP_PROXY/HTTPS_PROXY and set NO_PROXY=127.0.0.1,localhost,::1 in the Gateway service environment."
		];
		(params.noteFn ?? note)([
			"- Managed proxy routing (proxy.enabled) is active, but a request to this process's loopback listener failed. This can cause WebChat/Codex handshake errors or 502 responses.",
			`- Inspect the proxy configuration: ${formatCliCommand("openclaw config get proxy")}`,
			...repair,
			`- Apply the change: ${formatCliCommand("openclaw gateway restart")}`
		].join("\n"), "Managed proxy loopback");
		return;
	}
	const diagnostic = await collectWebFetchProxyDiagnostic(params);
	if (diagnostic) (params.noteFn ?? note)(diagnostic, "Web fetch proxy");
}
//#endregion
export { noteWebFetchProxyDiagnostic };
