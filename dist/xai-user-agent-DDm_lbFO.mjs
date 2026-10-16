import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { t as VERSION } from "./version-BJGPJZu6.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import "./agent-harness-registration-BC861IyH.mjs";
//#region extensions/xai/src/xai-user-agent.ts
const ORIGINATOR = "openclaw";
const UNUSABLE_PACKAGE_VERSION = "0.0.0";
const FALLBACK_VERSION = "unknown";
function resolveXaiUserAgentVersion() {
	const envVersion = normalizeOptionalString(process.env.OPENCLAW_VERSION);
	if (envVersion) return envVersion;
	const packageVersion = normalizeOptionalString(VERSION);
	if (packageVersion && packageVersion !== UNUSABLE_PACKAGE_VERSION) return packageVersion;
	return normalizeOptionalString(process.env.npm_package_version) ?? FALLBACK_VERSION;
}
function xaiUserAgent() {
	return `${ORIGINATOR}/${resolveXaiUserAgentVersion()}`;
}
function xaiUserAgentHeaderFor(baseUrl) {
	if (baseUrl && URL.parse(baseUrl)?.hostname === "api.x.ai") return { "User-Agent": xaiUserAgent() };
	return {};
}
//#endregion
export { xaiUserAgentHeaderFor as n, xaiUserAgent as t };
