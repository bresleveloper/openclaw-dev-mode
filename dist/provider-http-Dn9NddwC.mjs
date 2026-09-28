import { r as racePromiseWithAbortSignal } from "./abort-signal-Z3A36sLL.mjs";
import { t as WebSocket } from "./websocket-CGHaToS5.mjs";
import { c as shouldUseEnvHttpProxyForUrl } from "./proxy-env-BwCPCI9p.mjs";
import { n as resolveActiveManagedProxyTlsOptions } from "./managed-proxy-undici-B-MQJy6x.mjs";
import "./provider-http-errors-CTY_-ABT.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-BOG6Do5a.mjs";
import { _ as resolvePinnedHostnameWithPolicy, n as assertHostnameAllowedWithPolicy } from "./ssrf-BQRtcdBp.mjs";
import { a as isManagedProxyActive } from "./fetch-guard-EFfAF2PS.mjs";
import "./provider-attribution-DUtJJsHV.mjs";
import "./provider-request-config-DOrVD029.mjs";
import "./operation-retry-Dopl7EnK.mjs";
import "./shared-BLFkM12I.mjs";
import { r as resolveProviderTransportSsrFPolicy } from "./provider-transport-fetch-DnNw-XtJ.mjs";
import { n as createNodeProxyAgent, r as resolveEnvNodeProxyUrlForTarget } from "./node-proxy-agent-DS6ACVaa.mjs";
import http from "node:http";
import https from "node:https";
import { inspectTlsCertificateError as inspectTlsCertificateError$1 } from "@openclaw/ai/internal/shared";
//#region src/infra/net/provider-websocket.ts
const DEFAULT_PROVIDER_WEBSOCKET_MAX_PAYLOAD_BYTES = 16777216;
function toHttpUrl(value) {
	const url = new URL(value);
	if (url.protocol === "ws:") url.protocol = "http:";
	else if (url.protocol === "wss:") url.protocol = "https:";
	return url.toString();
}
function targetTlsOptions(policy) {
	return policy?.mode === "direct" || policy?.mode === "env-proxy" ? { ...policy.connect } : {};
}
function proxyPolicy(policy, allowPrivateProxy) {
	if (!policy && !allowPrivateProxy) return;
	return {
		...policy,
		hostnameAllowlist: void 0,
		...allowPrivateProxy ? { allowPrivateNetwork: true } : {}
	};
}
async function createProxyAgent(params) {
	const pinnedProxy = await resolvePinnedHostnameWithPolicy(params.proxyUrl.hostname, {
		policy: proxyPolicy(params.policy, params.allowPrivateProxy),
		signal: params.signal
	});
	return createNodeProxyAgent({
		mode: "explicit",
		proxyUrl: params.proxyUrl,
		proxyConnect: {
			...params.proxyTls,
			lookup: pinnedProxy.lookup
		}
	});
}
async function createProviderWebSocketAgent(params) {
	const { dispatcherPolicy, policy, url, signal } = params;
	const canDelegateEnvDns = shouldUseEnvHttpProxyForUrl(toHttpUrl(url.href));
	const useManagedProxy = isManagedProxyActive() && canDelegateEnvDns;
	const envProxyUrl = useManagedProxy || dispatcherPolicy?.mode !== "direct" ? resolveEnvNodeProxyUrlForTarget(url) : void 0;
	let proxyUrl;
	if (dispatcherPolicy?.mode === "explicit-proxy") {
		try {
			proxyUrl = new URL(dispatcherPolicy.proxyUrl);
		} catch {
			throw new Error("Invalid explicit proxy URL");
		}
		if (proxyUrl.protocol !== "http:" && proxyUrl.protocol !== "https:") throw new Error("Explicit proxy URL must use http or https");
	} else if (dispatcherPolicy?.mode !== "direct") proxyUrl = envProxyUrl;
	if (useManagedProxy) proxyUrl = envProxyUrl;
	if (!proxyUrl) {
		const pinned = await resolvePinnedHostnameWithPolicy(url.hostname, {
			policy,
			signal
		});
		const options = {
			keepAlive: false,
			...targetTlsOptions(dispatcherPolicy),
			lookup: pinned.lookup
		};
		return url.protocol === "wss:" ? new https.Agent(options) : new http.Agent(options);
	}
	if (!useManagedProxy && (dispatcherPolicy || !canDelegateEnvDns)) await resolvePinnedHostnameWithPolicy(url.hostname, {
		policy,
		signal
	});
	else assertHostnameAllowedWithPolicy(url.hostname, policy);
	return await createProxyAgent({
		policy,
		proxyUrl,
		proxyTls: !useManagedProxy && (dispatcherPolicy?.mode === "explicit-proxy" || dispatcherPolicy?.mode === "env-proxy") ? dispatcherPolicy.proxyTls : resolveActiveManagedProxyTlsOptions({ proxyUrl: proxyUrl.href }),
		allowPrivateProxy: useManagedProxy || dispatcherPolicy?.mode !== "explicit-proxy" || dispatcherPolicy.allowPrivateProxy === true,
		signal
	});
}
/** Opens a provider WebSocket through the resolved request and network policy. */
async function openProviderWebSocket(params) {
	let url;
	try {
		url = new URL(params.url);
	} catch {
		throw new Error("Invalid provider WebSocket URL");
	}
	if (url.protocol !== "ws:" && url.protocol !== "wss:") throw new Error("Provider WebSocket URL must use ws or wss");
	const policy = resolveProviderTransportSsrFPolicy({
		baseUrl: toHttpUrl(params.baseUrl),
		url: toHttpUrl(url.toString()),
		allowPrivateNetwork: params.allowPrivateNetwork,
		trustConfiguredBaseUrlOrigin: params.trustConfiguredBaseUrlOrigin
	});
	const { signal, cleanup } = buildTimeoutAbortSignal({
		signal: params.signal,
		timeoutMs: Math.max(1, params.timeoutMs),
		operation: "Provider WebSocket connection"
	});
	let agent;
	try {
		signal?.throwIfAborted();
		const pending = createProviderWebSocketAgent({
			dispatcherPolicy: params.dispatcherPolicy,
			policy,
			url,
			signal
		});
		pending.then((resolved) => signal?.aborted && resolved.destroy(), () => void 0);
		agent = await racePromiseWithAbortSignal(pending, signal);
	} catch (error) {
		cleanup();
		throw error;
	}
	let socket;
	try {
		signal?.throwIfAborted();
		socket = new WebSocket(url, {
			agent,
			headers: Object.fromEntries(new Headers(params.headers).entries()),
			maxPayload: params.maxPayloadBytes ?? DEFAULT_PROVIDER_WEBSOCKET_MAX_PAYLOAD_BYTES,
			perMessageDeflate: false,
			...targetTlsOptions(params.dispatcherPolicy)
		});
	} catch (error) {
		cleanup();
		agent.destroy();
		throw error;
	}
	const onAbort = () => socket.terminate();
	signal?.addEventListener("abort", onAbort, { once: true });
	socket.once("open", cleanup);
	socket.once("close", () => {
		signal?.removeEventListener("abort", onAbort);
		cleanup();
		agent.destroy();
	});
	return socket;
}
//#endregion
export { openProviderWebSocket as n, inspectTlsCertificateError$1 as t };
