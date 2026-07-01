import "./undici-runtime-BfllGx-h.js";
import "./ssrf-DmSIVBht.js";
import "./node-proxy-agent-CWnkEd0Y.js";
import "./proxy-fetch-dlAuw1Au.js";
import "./fetch-CdeDTG83.js";
//#region src/plugin-sdk/fetch-runtime.ts
/** Apply the trusted-env-proxy guarded fetch preset without exposing raw mode strings to plugins. */
function withTrustedEnvProxyGuardedFetchMode(params) {
	return {
		...params,
		mode: "trusted_env_proxy"
	};
}
//#endregion
export { withTrustedEnvProxyGuardedFetchMode as t };
