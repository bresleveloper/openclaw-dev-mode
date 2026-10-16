import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-BYeX3gh6.mjs";
import { i as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-DPmgR5gM.mjs";
import { r as getCanonicalGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { a as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BSmCVVpP.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
import { types } from "node:util";
//#region src/plugins/plugin-return-value.ts
const promiseThen = Object.getOwnPropertyDescriptor(Promise.prototype, "then");
const promiseSpecies = Object.getOwnPropertyDescriptor(Promise, Symbol.species);
/** Preserve foreign then/species results while identifying native host continuations. */
function mapPluginReturnPromise(completion, fulfilled, rejected) {
	const then = completion.then;
	const constructor = types.isPromise(completion) && Object.getPrototypeOf(completion) === Promise.prototype ? Object.getOwnPropertyDescriptor(completion, "constructor") ?? Object.getOwnPropertyDescriptor(Promise.prototype, "constructor") : void 0;
	const host = then === promiseThen?.value && constructor?.value === Promise && Object.getOwnPropertyDescriptor(Promise, Symbol.species)?.get === promiseSpecies?.get;
	return {
		value: Reflect.apply(then, completion, rejected ? [fulfilled, rejected] : [fulfilled]),
		host
	};
}
/** Capture a returned then method once without turning synchronous values into async work. */
function resolvePluginReturnPromise(value) {
	if (types.isPromise(value)) return Promise.resolve(value);
	if (value === null || typeof value !== "object" && typeof value !== "function") return;
	let then;
	try {
		then = Reflect.get(value, "then");
	} catch (error) {
		return Promise.reject(error);
	}
	if (typeof then !== "function") return;
	return Promise.resolve({ then(resolve, reject) {
		Reflect.apply(then, value, [resolve, reject]);
	} });
}
//#endregion
//#region src/plugins/legacy-sdk-resource-host.ts
/** Owns resources borrowed by shipped SDK results that have no release method. */
var LegacyPluginSdkResourceHost = class {
	constructor() {
		this.work = new AsyncWorkScope();
		this.claims = /* @__PURE__ */ new Map();
		this.providerProjections = /* @__PURE__ */ new WeakMap();
		this.pending = /* @__PURE__ */ new Set();
		this.failures = [];
	}
	get scheduler() {
		this.assertOpen();
		if (!this.gatewayScheduler) throw new Error("Plugin SDK resource host has no Gateway scheduler");
		this.gatewayScheduler.signal.throwIfAborted();
		return this.gatewayScheduler;
	}
	bindScheduler(scheduler) {
		this.assertOpen();
		scheduler.signal.throwIfAborted();
		if (this.gatewayScheduler && this.gatewayScheduler !== scheduler) throw new Error("Plugin SDK resource host already belongs to another Gateway scheduler");
		this.gatewayScheduler = scheduler;
	}
	assertOpen() {
		if (this.closing || this.work.isClosing) throw new Error("Plugin SDK resource host is closed");
	}
	run(run) {
		return hostContext.run(this, run);
	}
	track(run) {
		this.assertOpen();
		return this.work.track(() => this.run(run));
	}
	/** Preserve synchronous SDK hooks while joining their asynchronous results and descendants. */
	invoke(run) {
		if (getAsyncWorkSignal() !== this.work.signal) this.assertOpen();
		return this.work.run(() => this.run(() => {
			const result = run();
			const completion = resolvePluginReturnPromise(result);
			return completion ? this.work.track(() => completion) : result;
		}));
	}
	adopt(source, claim) {
		this.assertOpen();
		if (this.claims.has(source)) this.releaseClaim(claim);
		else this.claims.set(source, claim);
	}
	/** View lookup shares identity; only adopted or temporary claims own disposal. */
	getProviderProjection(source, create) {
		this.assertOpen();
		let projection = this.providerProjections.get(source);
		if (!projection) {
			projection = create();
			this.providerProjections.set(source, projection);
		}
		return projection;
	}
	forgetProviderProjection(source, projection) {
		if (this.providerProjections.get(source) === projection) this.providerProjections.delete(source);
	}
	/** Projection failures still own their asynchronous release until it settles. */
	releaseClaim(claim) {
		const operation = createDeferredCore();
		const completion = operation.promise.then(() => {
			this.pending.delete(completion);
		}, (error) => {
			this.failures.push(error);
			this.pending.delete(completion);
		});
		this.pending.add(completion);
		try {
			operation.resolve(this.work.hasPendingWork ? AsyncWorkScope.runWhenAllIdle(() => [this.work], () => claim.release()) : claim.release());
		} catch (error) {
			operation.reject(error);
		}
	}
	/** Fence new SDK work and join its tails before prepared resources can retire. */
	async drainWork() {
		await this.work.drain();
		await this.drainPendingReleases();
		if (this.failures.some(hasRetainedPluginRuntimeCloseError)) throw new AggregateError(this.failures, "Plugin SDK resources could not all be disposed");
	}
	async drainPendingReleases() {
		while (this.pending.size > 0) await Promise.all(this.pending);
	}
	close() {
		if (!this.closing) this.closing = Promise.resolve().then(async () => {
			await this.drainWork();
			const claims = [...this.claims.values()];
			this.claims.clear();
			for (const claim of claims) this.releaseClaim(claim);
			await this.drainPendingReleases();
			if (this.failures.length > 0) throw new AggregateError(this.failures, "Plugin SDK resources could not all be disposed");
		});
		return this.closing;
	}
};
const { hostContext, gatewayHosts } = resolveGlobalSingleton(Symbol.for("openclaw.legacyPluginSdkResourceHosts"), () => ({
	hostContext: new AsyncLocalStorage(),
	gatewayHosts: /* @__PURE__ */ new WeakMap()
}));
const STANDALONE_HOST_KEY = Symbol.for("openclaw.legacyPluginSdkStandaloneResourceHost");
/** Associate exact host resolvers without calling them after their authority closes. */
function bindLegacyPluginSdkResourceHost(resolver, host) {
	gatewayHosts.set(resolver, host);
}
function getBoundLegacyPluginSdkResourceHost() {
	const scope = getPluginRuntimeGatewayRequestScope();
	const resolver = scope?.resolveGatewayContext ?? scope?.context?.resolveGatewayContext;
	if (resolver) {
		const owner = getCanonicalGatewayContextResolver(resolver);
		const host = owner ? gatewayHosts.get(owner) : void 0;
		if (!host) throw new Error("Gateway SDK resource host is not bound");
		return host;
	}
	const host = hostContext.getStore();
	return host === globalThis[STANDALONE_HOST_KEY] ? void 0 : host;
}
/** Standalone callers of the shipped bare-result SDK retain their process lifetime. */
function getLegacyPluginSdkResourceHost() {
	return getBoundLegacyPluginSdkResourceHost() ?? resolveGlobalSingleton(STANDALONE_HOST_KEY, () => new LegacyPluginSdkResourceHost());
}
//#endregion
export { mapPluginReturnPromise as a, getLegacyPluginSdkResourceHost as i, bindLegacyPluginSdkResourceHost as n, resolvePluginReturnPromise as o, getBoundLegacyPluginSdkResourceHost as r, LegacyPluginSdkResourceHost as t };
