import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as VERSION } from "./version-BkM1aB4w.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./agent-harness-runtime-k4x7zJ-U.mjs";
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
const XAI_NATIVE_API_HOSTS = /* @__PURE__ */ new Set(["api.x.ai"]);
function xaiUserAgentHeaderFor(baseUrl) {
	if (!baseUrl) return {};
	try {
		if (XAI_NATIVE_API_HOSTS.has(new URL(baseUrl).hostname)) return { "User-Agent": xaiUserAgent() };
	} catch {
		return {};
	}
	return {};
}
//#endregion
export { xaiUserAgentHeaderFor as n, xaiUserAgent as t };
