import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { f as isLoopbackIpAddress, m as isRfc1918Ipv4Address } from "./ip-jvtZlu_y.mjs";
//#region src/agents/model-provider-local.ts
/** Shared local model-provider URL classification. */
function isLocalProviderBaseUrl(baseUrl, additionalHostnames) {
	try {
		let host = normalizeLowercaseStringOrEmpty(new URL(baseUrl).hostname);
		if (host.startsWith("[") && host.endsWith("]")) host = host.slice(1, -1);
		return host === "localhost" || host === "0.0.0.0" || host.endsWith(".local") || additionalHostnames?.has(host) === true || isLoopbackIpAddress(host) || isRfc1918Ipv4Address(host);
	} catch {
		return false;
	}
}
//#endregion
export { isLocalProviderBaseUrl as t };
