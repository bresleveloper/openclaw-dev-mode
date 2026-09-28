import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { p as resolveConfigPath, v as resolveGatewayPort } from "./paths-DehQwyE0.mjs";
import { o as redactSensitiveUrlLikeString } from "./redact-sensitive-url-DspuXlEe.mjs";
import { u as isSecureWebSocketUrl } from "./net-DU4aWKLv.mjs";
//#region src/gateway/connection-details.ts
/** Project raw transport details into the credential-safe CLI/report shape. */
function projectGatewayConnectionDetailsForDiagnostics(details) {
	return {
		...details,
		url: redactSensitiveUrlLikeString(details.url),
		message: redactSensitiveUrlLikeString(details.message)
	};
}
/** Redact one Gateway URL before it crosses an operator-visible diagnostic boundary. */
function projectGatewayUrlForDiagnostics(url) {
	return redactSensitiveUrlLikeString(url);
}
/** Build gateway target details and reject unsafe remote plaintext websocket URLs. */
function buildGatewayConnectionDetailsWithResolvers(options = {}, resolvers = {}) {
	const config = options.config ?? resolvers.getRuntimeConfig?.() ?? {};
	const configPath = options.configPath ?? resolvers.resolveConfigPath?.(process.env) ?? resolveConfigPath(process.env);
	const isRemoteMode = options.localPortOverride === void 0 && config.gateway?.mode === "remote";
	const remote = isRemoteMode ? config.gateway?.remote : void 0;
	const tlsEnabled = config.gateway?.tls?.enabled === true;
	const localPort = options.localPortOverride ?? resolvers.resolveGatewayPort?.(config, process.env) ?? resolveGatewayPort(config);
	const bindMode = config.gateway?.bind ?? "loopback";
	const localUrl = `${tlsEnabled ? "wss" : "ws"}://127.0.0.1:${localPort}`;
	const cliUrlOverride = normalizeOptionalString(options.url);
	const serviceUrl = normalizeOptionalString(options.serviceTargetUrl);
	const envUrlOverride = cliUrlOverride || serviceUrl || options.ignoreEnvUrlOverride || options.localPortOverride !== void 0 ? void 0 : normalizeOptionalString(process.env.OPENCLAW_GATEWAY_URL);
	const urlOverride = cliUrlOverride ?? envUrlOverride;
	const remoteUrl = normalizeOptionalString(remote?.url);
	const remoteMisconfigured = isRemoteMode && !urlOverride && !serviceUrl && !remoteUrl;
	const urlSourceHint = options.urlSource ?? (cliUrlOverride ? "cli" : envUrlOverride ? "env" : void 0);
	const url = urlOverride || serviceUrl || remoteUrl || localUrl;
	const displayUrl = redactSensitiveUrlLikeString(url);
	const urlSource = urlOverride ? urlSourceHint === "env" ? "env OPENCLAW_GATEWAY_URL" : "cli --url" : serviceUrl ? "service target" : remoteUrl ? "config gateway.remote.url" : remoteMisconfigured ? "missing gateway.remote.url (fallback local)" : "local loopback";
	const bindDetail = !urlOverride && (serviceUrl || !remoteUrl) ? `Bind: ${bindMode}` : void 0;
	const remoteFallbackNote = remoteMisconfigured ? "Warn: gateway.mode=remote but gateway.remote.url is missing; set gateway.remote.url or switch gateway.mode=local." : void 0;
	const allowPrivateWs = process.env.OPENCLAW_ALLOW_INSECURE_PRIVATE_WS === "1";
	if (!isSecureWebSocketUrl(url, { allowPrivateWs })) throw new Error([
		`SECURITY ERROR: Gateway URL "${displayUrl}" uses plaintext ws:// to a non-loopback address.`,
		"Both credentials and chat data would be exposed to network interception.",
		`Source: ${urlSource}`,
		`Config: ${configPath}`,
		"Fix: Use wss:// for remote gateway URLs.",
		"Safe remote access defaults:",
		"- keep gateway.bind=loopback and use an SSH tunnel (ssh -N -L 18789:127.0.0.1:18789 user@gateway-host)",
		"- or use Tailscale Serve/Funnel for HTTPS remote access",
		allowPrivateWs ? void 0 : "Break-glass (trusted private networks only): set OPENCLAW_ALLOW_INSECURE_PRIVATE_WS=1",
		"Doctor: openclaw doctor --fix",
		"Docs: https://docs.openclaw.ai/gateway/remote"
	].join("\n"));
	return {
		url,
		urlSource,
		bindDetail,
		remoteFallbackNote,
		message: [
			`Gateway target: ${displayUrl}`,
			`Source: ${urlSource}`,
			`Config: ${configPath}`,
			bindDetail,
			remoteFallbackNote
		].filter(Boolean).join("\n")
	};
}
//#endregion
export { projectGatewayConnectionDetailsForDiagnostics as n, projectGatewayUrlForDiagnostics as r, buildGatewayConnectionDetailsWithResolvers as t };
