import { o as racePromiseWithAbortSignal } from "./src-Bzfi3cQM.mjs";
import "./abort-signal-C9DFO3n5.mjs";
import "./provider-http-errors-CjVOxCE5.mjs";
import "./provider-attribution-Dr21G8q1.mjs";
import "./provider-request-config-WdycwKIG.mjs";
import { n as buildTimeoutAbortSignal } from "./fetch-timeout-AfCp6rSy.mjs";
import { s as shouldUseEnvHttpProxyForUrl } from "./proxy-env-5Nd20RhP.mjs";
import { n as resolveActiveManagedProxyTlsOptions } from "./managed-proxy-undici-DDJoqkXo.mjs";
import { n as assertHostnameAllowedWithPolicy, p as resolvePinnedHostnameWithPolicy } from "./ssrf-K50Tjeok.mjs";
import { a as isManagedProxyActive } from "./fetch-guard-DRapCKeS.mjs";
import { t as resolveProviderTransportSsrFPolicy } from "./provider-network-policy-DGvgCdvN.mjs";
import { t as WebSocket } from "./websocket-CGHaToS5.mjs";
import { n as createNodeProxyAgent, r as resolveEnvNodeProxyUrlForTarget } from "./node-proxy-agent-DsjkO9Ao.mjs";
import "./operation-retry-B2m6H7IT.mjs";
import "./shared-BMUa_P4s.mjs";
import "./http-tls-preflight-nN0IyrZJ.mjs";
import http from "node:http";
import { inspectTlsCertificateError as inspectTlsCertificateError$1 } from "@openclaw/ai/internal/shared";
import https from "node:https";
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
async function createProviderWebSocketAgent(params) {
	const { dispatcherPolicy, policy, url, signal } = params;
	const canDelegateEnvDns = shouldUseEnvHttpProxyForUrl(toHttpUrl(url.href));
	const useManagedProxy = isManagedProxyActive() && canDelegateEnvDns;
	const envProxyUrl = useManagedProxy || dispatcherPolicy?.mode !== "direct" ? resolveEnvNodeProxyUrlForTarget(url) : void 0;
	let proxyUrl = envProxyUrl;
	if (dispatcherPolicy?.mode === "explicit-proxy") {
		try {
			proxyUrl = new URL(dispatcherPolicy.proxyUrl);
		} catch {
			throw new Error("Invalid explicit proxy URL");
		}
		if (proxyUrl.protocol !== "http:" && proxyUrl.protocol !== "https:") throw new Error("Explicit proxy URL must use http or https");
	}
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
	const proxyTls = !useManagedProxy && (dispatcherPolicy?.mode === "explicit-proxy" || dispatcherPolicy?.mode === "env-proxy") ? dispatcherPolicy.proxyTls : resolveActiveManagedProxyTlsOptions({ proxyUrl: proxyUrl.href });
	const allowPrivateProxy = useManagedProxy || dispatcherPolicy?.mode !== "explicit-proxy" || dispatcherPolicy.allowPrivateProxy === true;
	const pinnedProxy = await resolvePinnedHostnameWithPolicy(proxyUrl.hostname, {
		policy: policy || allowPrivateProxy ? {
			...policy,
			hostnameAllowlist: void 0,
			...allowPrivateProxy ? { allowPrivateNetwork: true } : {}
		} : void 0,
		signal
	});
	return createNodeProxyAgent({
		mode: "explicit",
		proxyUrl,
		proxyConnect: {
			...proxyTls,
			lookup: pinnedProxy.lookup
		}
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
