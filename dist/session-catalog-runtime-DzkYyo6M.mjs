import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { n as getPluginRegistryForContext } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { i as allowsProcessHomeSessionScan } from "./paths-DehQwyE0.mjs";
import { r as normalizeControlUiBasePath, t as controlUiSessionSlug } from "./grammar-Dp605oVy.mjs";
import { a as isControlUiReservedRouteSegment } from "./src-Da9425In.mjs";
//#region packages/session-url-contract/src/share-build.ts
const LOWERCASE_HEX_RE = /^[0-9a-f]+$/u;
const CATALOG_SHARE_ROUTE_SEGMENT_RE = /^[a-z][a-z0-9-]*$/u;
function isControlUiCatalogShareId(shareRoute, value) {
	return value.length >= shareRoute.minPrefixLength && value.length <= shareRoute.fullLength && LOWERCASE_HEX_RE.test(value);
}
function buildControlUiCatalogSharePath(params) {
	const threadId = normalizeNullableString(params.threadId);
	const shareRoute = params.shareRoute;
	if (!threadId || !CATALOG_SHARE_ROUTE_SEGMENT_RE.test(shareRoute.routeSegment) || isControlUiReservedRouteSegment(shareRoute.routeSegment) || threadId.length !== shareRoute.fullLength || !LOWERCASE_HEX_RE.test(threadId)) return null;
	const length = Math.min(shareRoute.fullLength, Math.max(shareRoute.minPrefixLength, Math.floor(params.prefixLength ?? shareRoute.minPrefixLength)));
	const slug = controlUiSessionSlug(params.displayName);
	return `${normalizeControlUiBasePath(params.basePath)}/${shareRoute.routeSegment}/${slug ? `${slug}-` : ""}${threadId.slice(0, length)}`;
}
//#endregion
//#region src/plugins/session-catalog-active.ts
/**
* Read-only list/read facade over the active registered session catalogs.
* Deliberately excludes continue/archive/terminal so consumers cannot gain
* session control through this seam; mutation stays on the gateway RPCs.
*/
function listActiveSessionCatalogs() {
	const registrations = getPluginRegistryForContext()?.sessionCatalogs ?? [];
	const allowProcessHomeFallback = allowsProcessHomeSessionScan();
	return registrations.map(({ pluginId, provider }) => ({
		pluginId,
		id: provider.id,
		label: provider.label,
		processHomeFallbackAllowed: allowProcessHomeFallback,
		list: (params) => provider.list({
			...params,
			allowProcessHomeFallback
		}),
		read: (params) => provider.read({
			...params,
			allowProcessHomeFallback
		})
	})).toSorted((left, right) => left.id.localeCompare(right.id));
}
//#endregion
export { buildControlUiCatalogSharePath as n, isControlUiCatalogShareId as r, listActiveSessionCatalogs as t };
