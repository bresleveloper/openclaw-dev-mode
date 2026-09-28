import { r as normalizeControlUiBasePath } from "./grammar-Dp605oVy.mjs";
import "./src-Da9425In.mjs";
import { t as escapeHtml } from "./html-escape-BMD_QFeA.mjs";
import { a as classifyMcpAppStandalonePath, i as classifyGatewayProbePath, l as classifyWorkerGatewayPath, s as classifyNodeWorkspaceTransferPath } from "./gateway-http-route-contracts-jBtizxKU.mjs";
import { _ as acceptsControlUiHtmlResponse, v as isReadHttpMethod, y as respondNotFound } from "./http-common-oJ4rIoMl.mjs";
import { t as parseControlUiSessionPath } from "./parse-CUeSqfGE.mjs";
import { o as resolvePluginDiscoveryIdentity } from "./catalog-discovery-DH_QVLJr.mjs";
import { TLSSocket } from "node:tls";
//#region packages/session-url-contract/src/focus.ts
const FOCUS_SEGMENT = "/focus";
function normalizePathname(pathname) {
	const trimmed = pathname.trim();
	const withSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
	return withSlash.length > 1 ? withSlash.replace(/\/+$/u, "") : withSlash;
}
function isControlUiFocusPath(pathname, basePath = "") {
	const normalizedPath = normalizePathname(pathname);
	const root = `${normalizeControlUiBasePath(basePath)}${FOCUS_SEGMENT}`;
	return normalizedPath === root || normalizedPath.startsWith(`${root}/`);
}
//#endregion
//#region src/gateway/control-ui-routing.ts
const CONTROL_UI_PLUGIN_MANAGER_PATH = "/settings/plugins";
/** Keep the plugin recovery surface ahead of plugin-owned HTTP routes. */
function isControlUiPluginManagerRequest(params) {
	if (!isReadHttpMethod(params.method)) return false;
	const path = `${params.basePath}${CONTROL_UI_PLUGIN_MANAGER_PATH}`;
	return params.pathname === path || params.pathname === `${path}/`;
}
/** Core-owned standalone approval document namespace, before plugin routing. */
function isControlUiApprovalDocumentPath(params) {
	const root = `${params.basePath}/approve`;
	if (params.pathname === root || params.pathname === `${root}/`) return true;
	const prefix = `${root}/`;
	if (!params.pathname.startsWith(prefix)) return false;
	const encodedId = params.pathname.slice(prefix.length);
	return encodedId.length > 0 && !encodedId.includes("/");
}
/** Focused presentation namespace used only after plugin routing declines it. */
function isControlUiFocusDocumentPath(params) {
	return isControlUiFocusPath(params.pathname, params.basePath);
}
/** Classify an HTTP request as Control UI serving, redirect, 404, or non-Control-UI. */
function classifyControlUiRequest(params) {
	const { basePath, pathname, search, method } = params;
	const spaFallback = isControlUiPluginManagerRequest(params) || acceptsControlUiHtmlResponse(params.accept);
	if (!basePath) {
		if (pathname === "/ui" || pathname.startsWith("/ui/")) return { kind: "not-found" };
		if (classifyGatewayProbePath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (classifyMcpAppStandalonePath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (classifyWorkerGatewayPath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (classifyNodeWorkspaceTransferPath(pathname) !== "outside") return { kind: "not-control-ui" };
		if (pathname === "/plugins" || pathname.startsWith("/plugins/")) {
			if (!(pathname === "/plugins" || pathname === "/plugins/" || resolvePluginDiscoveryIdentity(pathname.slice(9)) !== void 0) || !isReadHttpMethod(method) || !spaFallback) return { kind: "not-control-ui" };
		}
		if (pathname === "/api" || pathname.startsWith("/api/")) return { kind: "not-control-ui" };
		if (pathname === "/j" || pathname.startsWith("/j/")) return { kind: "not-control-ui" };
		if (pathname === "/v1" || pathname.startsWith("/v1/")) return { kind: "not-control-ui" };
		if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
		return {
			kind: "serve",
			spaFallback
		};
	}
	if (!pathname.startsWith(`${basePath}/`) && pathname !== basePath) return { kind: "not-control-ui" };
	if (!isReadHttpMethod(method)) return { kind: "not-control-ui" };
	if (pathname === basePath) return {
		kind: "redirect",
		location: `${basePath}/${search}`
	};
	return {
		kind: "serve",
		spaFallback
	};
}
//#endregion
//#region src/gateway/control-ui-share.ts
/** This namespace contains only public preview documents and their static card. */
function isControlUiSharePath(pathname, basePath) {
	return pathname === `${basePath}/share` || pathname.startsWith(`${basePath}/share/`);
}
function serveControlUiShareDocument(req, res, url, basePath, publicOrigin) {
	const targetPath = url.pathname.slice(`${basePath}/share`.length);
	const session = parseControlUiSessionPath(targetPath);
	if (!isReadHttpMethod(req.method) || url.href.length > 8192 || !session) {
		respondNotFound(res);
		return;
	}
	const origin = resolveControlUiShareOrigin(req, publicOrigin);
	if (!origin) {
		respondNotFound(res);
		return;
	}
	const search = new URLSearchParams();
	const catalogRouting = [
		"catalog",
		"host",
		"thread"
	].map((key) => [key, url.searchParams.get(key)]);
	if (catalogRouting.every(([, value]) => value)) {
		for (const [key, value] of catalogRouting) if (value) search.set(key, value);
	}
	const suffix = search.size ? `?${search}` : "";
	const target = escapeHtml(`${basePath}${targetPath}${suffix}`);
	const canonical = escapeHtml(`${origin}${url.pathname}${suffix}`);
	const image = escapeHtml(`${origin}${basePath}/share/card.png`);
	const title = session.namespace === "dashboard" ? "OpenClaw dashboard" : "OpenClaw session";
	const description = "Open this shared link in OpenClaw. Access to the session is required.";
	const body = `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title><meta name="robots" content="noindex, nofollow">
<meta property="og:type" content="website"><meta property="og:site_name" content="OpenClaw">
<meta property="og:title" content="${title}"><meta property="og:description" content="${description}">
<meta property="og:url" content="${canonical}"><meta property="og:image" content="${image}">
<meta property="og:image:type" content="image/png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="OpenClaw logo and lobster mascot">
<meta name="twitter:card" content="summary_large_image">
<style>
:root{color-scheme:dark;font-family:system-ui,sans-serif;background:#0b1016;color:#f5f7fa}
body{margin:0;min-height:100svh;display:grid;place-items:center}main{width:min(680px,calc(100% - 40px));padding:40px 0}
img{display:block;width:100%;height:auto;border-radius:20px}h1{font-size:clamp(28px,5vw,40px);letter-spacing:-.04em;margin:28px 0 12px}
p{color:#b2bdc9;line-height:1.6;margin:0 0 28px}a{display:inline-block;border-radius:12px;padding:14px 22px;background:#ff5c50;color:#160b0a;font-weight:700;text-decoration:none}
a:focus-visible{outline:3px solid #fff;outline-offset:5px}
</style></head><body><main>
<img src="${image}" width="1200" height="630" alt="OpenClaw logo and lobster mascot">
<h1>${title}</h1><p>${description}</p><a href="${target}">Open ${title === "OpenClaw dashboard" ? "dashboard" : "session"}</a>
</main></body></html>`;
	res.statusCode = 200;
	res.setHeader("Content-Type", "text/html; charset=utf-8");
	res.setHeader("Content-Security-Policy", "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'");
	res.setHeader("Cache-Control", "no-store");
	res.setHeader("X-Robots-Tag", "noindex, nofollow");
	res.setHeader("Content-Length", Buffer.byteLength(body));
	res.end(req.method === "HEAD" ? void 0 : body);
}
function resolveControlUiShareOrigin(req, publicOrigin) {
	try {
		const protocol = req.socket instanceof TLSSocket ? "https" : "http";
		const address = new URL(publicOrigin ?? `${protocol}://${req.headers.host}`);
		if (!/^https?:$/u.test(address.protocol) || address.username || address.password || address.pathname !== "/" || address.search || address.hash) return null;
		return address.origin;
	} catch {
		return null;
	}
}
//#endregion
export { isControlUiApprovalDocumentPath as a, classifyControlUiRequest as i, resolveControlUiShareOrigin as n, isControlUiFocusDocumentPath as o, serveControlUiShareDocument as r, isControlUiPluginManagerRequest as s, isControlUiSharePath as t };
