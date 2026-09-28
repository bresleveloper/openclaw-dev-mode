import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { i as resolveGlobalSingleton } from "./global-singleton-Dc_stLtU.mjs";
import { r as getAsyncWorkSignal, t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { t as resolvePluginReturnPromise } from "./plugin-return-value-CKL2xLy9.mjs";
import { n as hasRetainedPluginRuntimeCloseError } from "./runtime-close-error-CYO2S35x.mjs";
import { r as getCanonicalGatewayContextResolver } from "./gateway-context-binding-VqB7gkMe.mjs";
import { i as getPluginRuntimeGatewayRequestScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { AsyncLocalStorage } from "node:async_hooks";
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
	return hostContext.getStore();
}
/** Standalone callers of the shipped bare-result SDK retain their process lifetime. */
function getLegacyPluginSdkResourceHost() {
	return getBoundLegacyPluginSdkResourceHost() ?? resolveGlobalSingleton(Symbol.for("openclaw.legacyPluginSdkStandaloneResourceHost"), () => new LegacyPluginSdkResourceHost());
}
//#endregion
export { bindLegacyPluginSdkResourceHost as n, getLegacyPluginSdkResourceHost as r, LegacyPluginSdkResourceHost as t };
