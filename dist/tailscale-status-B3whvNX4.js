import { Et as array, Rn as string, Tn as object } from "./schemas-6cH6bZ7o.js";
import { t as safeParseJsonWithSchema } from "./zod-parse-Bip-sZi_.js";
//#region src/shared/tailscale-status.ts
const TAILSCALE_STATUS_COMMAND_CANDIDATES = ["tailscale", "/Applications/Tailscale.app/Contents/MacOS/Tailscale"];
const TailscaleStatusSchema = object({ Self: object({
	DNSName: string().optional(),
	TailscaleIPs: array(string()).optional()
}).optional() });
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
//#endregion
export { resolveTailscalePublishedHost as n, resolveTailnetHostWithRunner as t };
