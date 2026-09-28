import { Fn as object, Jn as string, Lt as boolean, Nt as array, Un as record } from "./schemas-BOYIvvln.mjs";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.mjs";
//#region src/shared/tailscale-status.ts
const TAILSCALE_STATUS_COMMAND_CANDIDATES = ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
const TailscaleStatusSchema = object({ Self: object({
	DNSName: string().optional(),
	TailscaleIPs: array(string()).optional()
}).optional() });
const TailscaleServeTcpHandlerSchema = object({ HTTPS: boolean().optional() });
const TailscaleServeWebServerSchema = object({ Handlers: record(string(), object({ Proxy: string().optional() })) });
const TailscaleServeConfigSchema = object({
	TCP: record(string(), TailscaleServeTcpHandlerSchema).optional(),
	Web: record(string(), TailscaleServeWebServerSchema).optional(),
	AllowFunnel: record(string(), boolean()).optional()
});
function parsePossiblyNoisyStatus(raw) {
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	if (start === -1 || end <= start) return null;
	return safeParseJsonWithSchema(TailscaleStatusSchema, raw.slice(start, end + 1));
}
function extractTailnetHostFromStatusJson(raw) {
	const parsed = parsePossiblyNoisyStatus(raw);
	const dns = parsed?.Self?.DNSName;
	if (dns && dns.length > 0) return dns.replace(/\.$/, "");
	const ips = parsed?.Self?.TailscaleIPs ?? [];
	return ips.length > 0 ? ips[0] ?? null : null;
}
function parseLoopbackProxyPort(proxy, forAdoption) {
	if (forAdoption) {
		const match = /^http:\/\/(?:127\.0\.0\.1|localhost):(\d+)\/?$/.exec(proxy);
		return match ? Number(match[1]) : null;
	}
	const trimmed = proxy.trim();
	if (/^\d+$/.test(trimmed)) return Number.parseInt(trimmed, 10);
	const normalized = trimmed.includes("://") ? trimmed : `http://${trimmed}`;
	try {
		const parsed = new URL(normalized);
		const host = parsed.hostname.replace(/^\[|\]$/g, "").toLowerCase();
		if (!(host === "localhost" || host === "::1" || /^127(?:\.\d{1,3}){3}$/.test(host))) return null;
		const port = Number.parseInt(parsed.port, 10);
		return Number.isInteger(port) && port >= 1 && port <= 65535 ? port : null;
	} catch {
		return null;
	}
}
function extractTailscaleServeGatewayUrls(raw, gatewayPort, forAdoption = false) {
	const start = raw.indexOf("{");
	const end = raw.lastIndexOf("}");
	const config = end > start && start >= 0 ? safeParseJsonWithSchema(TailscaleServeConfigSchema, raw.slice(start, end + 1)) : null;
	if (!config) return null;
	const web = Object.entries(config.Web ?? {});
	const urls = /* @__PURE__ */ new Set();
	for (const [hostPort, webServer] of web) {
		const handler = webServer.Handlers["/"];
		if (!forAdoption && config.AllowFunnel?.[hostPort] || forAdoption && Object.keys(webServer.Handlers).length !== 1 || !handler?.Proxy || parseLoopbackProxyPort(handler.Proxy, forAdoption) !== gatewayPort) continue;
		try {
			const endpoint = new URL(`https://${hostPort}`);
			const exclusive = !forAdoption || web.filter(([other]) => URL.parse(`https://${other}`)?.port === endpoint.port).length === 1;
			if (config.TCP?.[endpoint.port || "443"]?.HTTPS === true && exclusive) urls.add(`wss://${endpoint.host}`);
		} catch {
			continue;
		}
	}
	return [...urls].toSorted();
}
/** Inspects persistent Serve routes without collapsing malformed output into route absence. */
async function inspectTailscaleServeGatewayUrlsWithRunner(gatewayPort, runCommandWithTimeout, forAdoption = false) {
	if (!runCommandWithTimeout) return { status: "unavailable" };
	let sawValidStatus = false;
	let sawInvalidStatus = false;
	for (const candidate of TAILSCALE_STATUS_COMMAND_CANDIDATES) try {
		const result = await runCommandWithTimeout([
			candidate,
			"serve",
			"status",
			"--json"
		], { timeoutMs: 5e3 });
		if (result.code !== 0 || !result.stdout.trim()) continue;
		const urls = extractTailscaleServeGatewayUrls(result.stdout, gatewayPort, forAdoption);
		if (!urls) {
			sawInvalidStatus = true;
			continue;
		}
		sawValidStatus = true;
		if (urls.length > 0) return {
			status: "ok",
			urls
		};
	} catch {
		continue;
	}
	if (sawValidStatus) return {
		status: "ok",
		urls: []
	};
	return { status: sawInvalidStatus ? "invalid" : "unavailable" };
}
/** Resolves the host published to clients for tailnet or Tailscale Serve gateway modes. */
function resolveTailscalePublishedHost(params) {
	const tailnetHost = params.tailnetHost?.trim();
	if (!tailnetHost) return null;
	const serviceName = params.tailscaleMode === "serve" ? params.serviceName?.trim() || void 0 : void 0;
	if (!serviceName) return tailnetHost;
	if (/^[\d.:]+$/.test(tailnetHost)) return null;
	const bareServiceName = serviceName.replace(/^svc:/, "");
	const tailnetSuffix = tailnetHost.split(".").slice(1).join(".");
	return tailnetSuffix ? `${bareServiceName}.${tailnetSuffix}` : null;
}
/** Runs known Tailscale status commands and returns the first DNS name or tailnet IP found. */
async function resolveTailnetHostWithRunner(runCommandWithTimeout) {
	if (!runCommandWithTimeout) return null;
	for (const candidate of TAILSCALE_STATUS_COMMAND_CANDIDATES) try {
		const result = await runCommandWithTimeout([
			candidate,
			"status",
			"--json"
		], { timeoutMs: 5e3 });
		if (result.code !== 0) continue;
		const raw = result.stdout.trim();
		if (!raw) continue;
		const host = extractTailnetHostFromStatusJson(raw);
		if (host) return host;
	} catch {
		continue;
	}
	return null;
}
/** Finds persistent HTTPS Serve routes whose root proxy targets this gateway port. */
async function resolveTailscaleServeGatewayUrlsWithRunner(gatewayPort, runCommandWithTimeout) {
	const inspection = await inspectTailscaleServeGatewayUrlsWithRunner(gatewayPort, runCommandWithTimeout);
	return inspection.status === "ok" ? inspection.urls : [];
}
//#endregion
export { resolveTailscaleServeGatewayUrlsWithRunner as a, resolveTailscalePublishedHost as i, inspectTailscaleServeGatewayUrlsWithRunner as n, resolveTailnetHostWithRunner as r, extractTailscaleServeGatewayUrls as t };
