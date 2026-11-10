import { a as resolveEnvHttpProxyAgentOptions } from "./proxy-env-5Nd20RhP.mjs";
import { n as resolveActiveManagedProxyTlsOptions } from "./managed-proxy-undici-DDJoqkXo.mjs";
import { c as createUndiciAutoSelectFamilyConnectOptions, d as withTemporaryUndiciAutoSelectFamily, i as loadUndiciGlobalDispatcherDeps, l as resolveUndiciAutoSelectFamily, n as createHttp1EnvHttpProxyAgent, s as setGlobalUndiciStreamTimeoutMs, t as createHttp1Agent } from "./undici-runtime-CSZThyLT.mjs";
import { isProxylineDispatcher } from "@openclaw/proxyline/dispatcher-brand";
//#region src/infra/net/undici-global-dispatcher.ts
const DEFAULT_UNDICI_STREAM_TIMEOUT_MS = 18e5;
const HTTP1_ONLY_DISPATCHER_OPTIONS = Object.freeze({ allowH2: false });
let lastAppliedTimeoutKey = null;
let lastAppliedProxyBootstrapKey = null;
const UNDICI_DISPATCH_HELPER_METHODS = /* @__PURE__ */ new Set([
	"compose",
	"connect",
	"pipeline",
	"request",
	"stream",
	"upgrade"
]);
const UNDICI_DISPATCHER_LIFECYCLE_METHODS = /* @__PURE__ */ new Set(["close", "destroy"]);
const timedProxylineManagedDispatchers = /* @__PURE__ */ new WeakMap();
function isTimedProxylineManagedDispatcher(dispatcher) {
	return typeof dispatcher === "object" && dispatcher !== null ? timedProxylineManagedDispatchers.has(dispatcher) : false;
}
function createTimedProxylineManagedDispatcher(dispatcher, timeoutMs, autoSelectFamily) {
	const existingState = timedProxylineManagedDispatchers.get(dispatcher);
	if (existingState) {
		existingState.autoSelectFamily = autoSelectFamily;
		existingState.timeoutMs = timeoutMs;
		return dispatcher;
	}
	const state = {
		autoSelectFamily,
		timeoutMs,
		dispatch(options, handler) {
			return withTemporaryUndiciAutoSelectFamily(state.autoSelectFamily, () => dispatcher.dispatch({
				...options,
				bodyTimeout: options.bodyTimeout ?? state.timeoutMs,
				headersTimeout: options.headersTimeout ?? state.timeoutMs,
				...HTTP1_ONLY_DISPATCHER_OPTIONS
			}, handler));
		}
	};
	const proxy = new Proxy(dispatcher, { get(target, property, receiver) {
		if (property === "dispatch") return state.dispatch;
		const value = Reflect.get(target, property, receiver);
		if (typeof value !== "function") return value;
		if (UNDICI_DISPATCHER_LIFECYCLE_METHODS.has(property)) return value.bind(target);
		if (UNDICI_DISPATCH_HELPER_METHODS.has(property)) return (...args) => Reflect.apply(value, receiver, args);
		return value;
	} });
	timedProxylineManagedDispatchers.set(proxy, state);
	return proxy;
}
function resolveDispatcherKind(dispatcher) {
	const ctorName = dispatcher?.constructor?.name;
	if (typeof ctorName !== "string" || ctorName.length === 0) return "unsupported";
	if (ctorName.includes("EnvHttpProxyAgent")) return "env-proxy";
	if (isTimedProxylineManagedDispatcher(dispatcher) || isProxylineDispatcher(dispatcher)) return "proxyline-managed";
	if (ctorName.includes("ProxyAgent")) return "unsupported";
	if (ctorName.includes("Agent")) return "agent";
	return "unsupported";
}
function resolveEnvProxyBootstrapKey(options) {
	const proxyTls = [.../* @__PURE__ */ new Set([options.httpProxy, options.httpsProxy])].map((proxyUrl) => proxyUrl ? resolveActiveManagedProxyTlsOptions({ proxyUrl }) : void 0);
	return JSON.stringify([
		options.httpProxy,
		options.httpsProxy,
		proxyTls
	]);
}
function resolveCurrentDispatcherInfo(runtime) {
	let dispatcher;
	try {
		dispatcher = runtime.getGlobalDispatcher();
	} catch {
		return null;
	}
	const currentKind = resolveDispatcherKind(dispatcher);
	if (currentKind === "unsupported") return null;
	return {
		kind: currentKind,
		dispatcher
	};
}
/** Installs the env-proxy global dispatcher once proxy env is available. */
function ensureGlobalUndiciEnvProxyDispatcher() {
	const proxyOptions = resolveEnvHttpProxyAgentOptions();
	if (!proxyOptions) return;
	const runtime = loadUndiciGlobalDispatcherDeps();
	const { setGlobalDispatcher } = runtime;
	const nextBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
	const currentKind = resolveCurrentDispatcherInfo(runtime)?.kind;
	if (currentKind === void 0) return;
	if (currentKind === "proxyline-managed") {
		lastAppliedProxyBootstrapKey = nextBootstrapKey;
		return;
	}
	if (currentKind === "env-proxy" && lastAppliedProxyBootstrapKey === null) {
		lastAppliedProxyBootstrapKey = nextBootstrapKey;
		return;
	}
	if (currentKind === "env-proxy" && lastAppliedProxyBootstrapKey === nextBootstrapKey) return;
	try {
		setGlobalDispatcher(createHttp1EnvHttpProxyAgent(proxyOptions));
		lastAppliedProxyBootstrapKey = nextBootstrapKey;
	} catch {}
}
/** Forces timeout/family policy onto the current supported global dispatcher. */
function ensureGlobalUndiciDispatcherStreamTimeouts(opts) {
	const timeoutMsRaw = opts?.timeoutMs ?? 18e5;
	if (!Number.isFinite(timeoutMsRaw)) return;
	const timeoutMs = Math.max(DEFAULT_UNDICI_STREAM_TIMEOUT_MS, Math.floor(timeoutMsRaw));
	setGlobalUndiciStreamTimeoutMs(timeoutMs);
	const runtime = loadUndiciGlobalDispatcherDeps();
	const current = resolveCurrentDispatcherInfo(runtime);
	if (current === null) return;
	const { dispatcher, kind } = current;
	const autoSelectFamily = resolveUndiciAutoSelectFamily();
	const nextKey = `${kind}:${timeoutMs}:${autoSelectFamily === void 0 ? "na" : autoSelectFamily ? "on" : "off"}`;
	const needsProxylineWrapper = kind === "proxyline-managed" && !isTimedProxylineManagedDispatcher(dispatcher);
	if (lastAppliedTimeoutKey === nextKey && !needsProxylineWrapper) return;
	const connect = createUndiciAutoSelectFamilyConnectOptions(autoSelectFamily);
	try {
		if (kind === "proxyline-managed") runtime.setGlobalDispatcher(createTimedProxylineManagedDispatcher(dispatcher, timeoutMs, autoSelectFamily));
		else if (kind === "env-proxy") {
			const proxyOptions = {
				...resolveEnvHttpProxyAgentOptions(),
				...connect ? { connect } : {},
				bodyTimeout: timeoutMs,
				headersTimeout: timeoutMs
			};
			runtime.setGlobalDispatcher(createHttp1EnvHttpProxyAgent(proxyOptions));
		} else runtime.setGlobalDispatcher(createHttp1Agent({
			connect,
			bodyTimeout: timeoutMs,
			headersTimeout: timeoutMs
		}));
		lastAppliedTimeoutKey = nextKey;
	} catch {}
}
/** Clears module-level dispatcher bookkeeping between isolated tests. */
function resetGlobalUndiciStreamTimeoutsForTests() {
	lastAppliedTimeoutKey = null;
	lastAppliedProxyBootstrapKey = null;
	setGlobalUndiciStreamTimeoutMs(void 0);
}
/**
* Re-evaluate proxy env changes for root undici imports. Installs
* EnvHttpProxyAgent when proxy env is present, and restores a direct Agent
* after proxy env is cleared.
*/
function forceResetGlobalDispatcher(opts) {
	lastAppliedTimeoutKey = null;
	const proxyOptions = resolveEnvHttpProxyAgentOptions();
	if (!proxyOptions) {
		if (lastAppliedProxyBootstrapKey === null) return;
		lastAppliedProxyBootstrapKey = null;
		try {
			const { setGlobalDispatcher } = loadUndiciGlobalDispatcherDeps();
			setGlobalDispatcher(createHttp1Agent());
		} catch {}
		return;
	}
	try {
		const runtime = loadUndiciGlobalDispatcherDeps();
		const { setGlobalDispatcher } = runtime;
		if (opts?.preserveProxylineManaged) {
			if (resolveCurrentDispatcherInfo(runtime)?.kind === "proxyline-managed") {
				lastAppliedProxyBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
				return;
			}
		}
		setGlobalDispatcher(createHttp1EnvHttpProxyAgent(proxyOptions));
		lastAppliedProxyBootstrapKey = resolveEnvProxyBootstrapKey(proxyOptions);
	} catch {}
}
//#endregion
export { resetGlobalUndiciStreamTimeoutsForTests as a, forceResetGlobalDispatcher as i, ensureGlobalUndiciDispatcherStreamTimeouts as n, ensureGlobalUndiciEnvProxyDispatcher as r, DEFAULT_UNDICI_STREAM_TIMEOUT_MS as t };
