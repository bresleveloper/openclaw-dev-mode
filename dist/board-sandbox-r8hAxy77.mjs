import { r as buildSandboxHostPath } from "./sandbox-host-BqeXhFy-.mjs";
import { t as WIDGET_CDN_ORIGINS } from "./widget-html-DuR2hZeB.mjs";
import { t as WIDGET_MEDIA_SOURCES } from "./widget-media-DIMzopdf.mjs";
//#region src/gateway/board-sandbox.ts
function grantedConnectOrigins(document) {
	if (document.grantState !== "granted") return;
	const origins = document.declared?.netOrigins;
	return origins?.length ? origins : void 0;
}
function buildBoardWidgetSandboxPath(document) {
	const connectDomains = grantedConnectOrigins(document);
	return buildSandboxHostPath({
		blockDescendantFrames: true,
		mediaDomains: [...WIDGET_MEDIA_SOURCES, ...document.resourceOrigins ?? []],
		resourceDomains: [.../* @__PURE__ */ new Set([...WIDGET_CDN_ORIGINS, ...document.resourceOrigins ?? []])],
		...connectDomains ? { connectDomains } : {}
	});
}
/** Defense in depth for direct/legacy widget document loads outside the proxy host. */
function buildBoardWidgetContentSecurityPolicy(document) {
	const connectSources = grantedConnectOrigins(document)?.join(" ") ?? "'none'";
	const resourceSources = document.resourceOrigins?.join(" ") ?? "";
	const cdnSources = WIDGET_CDN_ORIGINS.join(" ");
	return [
		"default-src 'none'",
		`script-src 'unsafe-inline' ${cdnSources} ${resourceSources}`.trim(),
		`style-src 'unsafe-inline' ${cdnSources}`,
		`font-src data: ${cdnSources}`,
		`img-src data: ${resourceSources}`.trim(),
		`media-src data: ${WIDGET_MEDIA_SOURCES.join(" ")} ${resourceSources}`.trim(),
		`connect-src ${connectSources}`,
		"webrtc 'block'",
		"base-uri 'none'",
		"object-src 'none'",
		"form-action 'none'",
		"frame-src 'none'",
		"sandbox allow-scripts"
	].join("; ");
}
//#endregion
export { buildBoardWidgetSandboxPath as n, buildBoardWidgetContentSecurityPolicy as t };
