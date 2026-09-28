import { F as resolveTimerTimeoutMs, n as MAX_TIMER_TIMEOUT_MS } from "./number-coercion-CLj0HTDM.mjs";
import "./number-runtime-CGwowceO.mjs";
//#region extensions/browser/src/browser-proxy-timeouts.ts
const DEFAULT_BROWSER_PROXY_TIMEOUT_MS = 2e4;
const BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS = 5e3;
function resolveBrowserProxyTimeoutMs(timeoutMs) {
	return resolveTimerTimeoutMs(timeoutMs, DEFAULT_BROWSER_PROXY_TIMEOUT_MS);
}
/** Leave time for browser diagnostics to cross the node and Gateway watchdogs. */
function resolveBrowserProxyTimeouts(timeoutMs) {
	const proxyTimeoutMs = Math.min(resolveBrowserProxyTimeoutMs(timeoutMs), MAX_TIMER_TIMEOUT_MS - 2 * BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS);
	const nodeInvokeTimeoutMs = proxyTimeoutMs + BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS;
	return {
		proxyTimeoutMs,
		nodeInvokeTimeoutMs,
		gatewayTimeoutMs: nodeInvokeTimeoutMs + BROWSER_PROXY_GATEWAY_TIMEOUT_SLACK_MS
	};
}
//#endregion
export { resolveBrowserProxyTimeouts as n, resolveBrowserProxyTimeoutMs as t };
