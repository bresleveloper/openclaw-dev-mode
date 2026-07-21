import "./managed-proxy-undici-RiF2s48t.js";
import "./undici-runtime-BL8ZN-Ey.js";
import "./ssrf-BayeDjCv.js";
import "./node-proxy-agent-DILaWx04.js";
import "./proxy-fetch-ColTyRtu.js";
import "./fetch-D0nBTEZV.js";
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
