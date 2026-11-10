import { createHash } from "node:crypto";
//#region src/gateway/control-ui-csp.ts
/** The contextual host policy admits explicit secure origins and the supported embedding scheme. */
function validateRemoteControlUiFrameAncestors(values) {
	if (!Array.isArray(values) || values.length > 16 || values.join(" ").length > 4096) throw new Error("Remote Control UI frame ancestors must contain at most 16 bounded origins");
	for (const value of values) {
		if (value === "codex-sandbox:") continue;
		const origin = typeof value === "string" ? URL.parse(value) : null;
		if (!origin || origin.protocol !== "https:" || origin.origin !== value || origin.hostname.includes("*") && !/^https:\/\/\*\.(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(value) || origin.username || origin.password) throw new Error("Remote Control UI frame ancestors must be exact HTTPS origins, https://*.<domain>, or codex-sandbox:");
	}
	return Object.freeze([...new Set(values)]);
}
const SCRIPT_ATTRIBUTE_NAME_RE = /\s([^\s=/>]+)(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/g;
/**
* Compute SHA-256 CSP hashes for inline `<script>` blocks in an HTML string.
* Only scripts without a `src` attribute are considered inline.
*/
function computeInlineScriptHashes(html) {
	const hashes = [];
	const re = /<script(?:\s[^>]*)?>([^]*?)<\/script>/gi;
	let match;
	while ((match = re.exec(html)) !== null) {
		const openTag = match[0].slice(0, match[0].indexOf(">") + 1);
		if (Array.from(openTag.matchAll(SCRIPT_ATTRIBUTE_NAME_RE)).some((attribute) => attribute[1]?.toLowerCase() === "src")) continue;
		const content = match[1];
		if (!content) continue;
		const hash = createHash("sha256").update(content, "utf8").digest("base64");
		hashes.push(`sha256-${hash}`);
	}
	return hashes;
}
/** Build the CSP header applied to Gateway-served Control UI HTML. */
function buildControlUiCspHeader(opts) {
	const hashes = opts?.inlineScriptHashes;
	const scriptTokens = ["'self'"];
	if (hashes?.length) scriptTokens.push(...hashes.map((h) => `'${h}'`));
	if (opts?.allowWasm) scriptTokens.push("'wasm-unsafe-eval'");
	const connectTokens = [
		"'self'",
		"ws:",
		"wss:",
		"data:",
		"blob:",
		"https://api.openai.com",
		"https://tweakcn.com"
	];
	if (opts?.portalHost) {
		const parsed = URL.parse(`http://${opts.portalHost}`);
		if (parsed?.hostname && !parsed.username && !parsed.password && parsed.pathname === "/" && !parsed.search && !parsed.hash) connectTokens.push(`http://${parsed.hostname}:*`, `https://${parsed.hostname}:*`);
	}
	return [
		"default-src 'self'",
		"base-uri 'none'",
		"object-src 'none'",
		`frame-ancestors ${opts?.frameAncestors?.length ? opts.frameAncestors.join(" ") : "'none'"}`,
		"frame-src 'self' blob: http: https:",
		`script-src ${scriptTokens.join(" ")}`,
		"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
		"img-src 'self' data: blob: https:",
		"media-src 'self' data: blob:",
		"font-src 'self' https://fonts.gstatic.com",
		"worker-src 'self'",
		`connect-src ${connectTokens.join(" ")}`
	].join("; ");
}
function applyControlUiSecurityHeaders(res, remote) {
	remote?.signal.throwIfAborted();
	remote?.assertCurrent();
	if (remote?.frameAncestors.length) res.removeHeader("X-Frame-Options");
	else res.setHeader("X-Frame-Options", "DENY");
	res.setHeader("Content-Security-Policy", buildControlUiCspHeader({ frameAncestors: remote?.frameAncestors }));
	res.setHeader("X-Content-Type-Options", "nosniff");
	res.setHeader("Referrer-Policy", "no-referrer");
	res.setHeader("Permissions-Policy", "camera=(self), microphone=*, geolocation=*, clipboard-write=*");
}
//#endregion
export { validateRemoteControlUiFrameAncestors as i, buildControlUiCspHeader as n, computeInlineScriptHashes as r, applyControlUiSecurityHeaders as t };
