import { t as AsyncWorkScope } from "./async-work-scope-CWk2dk1h.mjs";
import { i as getPluginValueInstance } from "./plugin-instance-scope-C9hxyH_A.mjs";
import { i as capturePluginLifecycleAuthority, l as getPluginRegistryLifetime } from "./registry-lifecycle-BhTDZAHB.mjs";
import { Q as resolvePluginRegistryLoadCacheKey, Z as isPluginRegistryLoadInFlight, t as acquirePluginRegistryForInspection } from "./loader-runtime-load-XbrcYJWd.mjs";
import { f as getPluginRegistryInspectionResources, m as collectRegistryInvocationInstances, p as PluginInvocationScope } from "./registry-Bqh30cGD.mjs";
import "./loader-Vq3hhSQk.mjs";
import { n as preparePluginCapabilityProviderLookup, o as acquireBundledCapabilityRuntimeRegistry, r as preparePluginCapabilityProviderResolution } from "./capability-provider-runtime-CBbnZpy2.mjs";
//#region src/plugins/capability-provider-acquisition.ts
/** Retains owned registrations while external hosts keep their own custody. */
async function acquirePluginCapabilityProviders(params) {
	const work = new AsyncWorkScope();
	const releases = [];
	const loads = /* @__PURE__ */ new Map();
	const retained = /* @__PURE__ */ new Map();
	const authorities = /* @__PURE__ */ new Map();
	const captureAuthority = (registry) => {
		if (!authorities.has(registry)) authorities.set(registry, capturePluginLifecycleAuthority(registry, void 0, { scopedRuntime: true }));
	};
	const dispose = () => {
		for (const invocations of retained.values()) invocations?.forEach((invocation) => invocation.release());
		return Promise.allSettled(releases.map(async (releaseClaim) => await releaseClaim())).then((results) => {
			const errors = results.flatMap((result) => result.status === "rejected" ? [result.reason] : []);
			if (errors.length > 0) throw new AggregateError(errors, "Capability registration cleanup failed");
		});
	};
	const retain = (registry, providerId) => {
		if (!registry) return;
		const resources = getPluginRegistryInspectionResources(registry);
		if (!retained.has(registry)) {
			captureAuthority(registry);
			const release = resources?.retain().release ?? getPluginRegistryLifetime(registry)?.retain();
			if (release) releases.push(release);
			retained.set(registry, release ? /* @__PURE__ */ new Map() : void 0);
		}
		const invocations = retained.get(registry);
		if (!invocations) return;
		return (provider) => {
			const instance = providerId === void 0 ? void 0 : getPluginValueInstance(provider);
			if (providerId !== void 0 && !instance) return provider;
			const key = instance ?? registry;
			let invocation = invocations.get(key);
			if (!invocation) {
				invocation = resources ? resources.createInvocationScope(registry, instance && [instance]) : new PluginInvocationScope(registry, instance ? [instance] : collectRegistryInvocationInstances(registry), { retained: true });
				invocations.set(key, invocation);
			}
			return invocation.wrap(provider);
		};
	};
	let releaseCompletion;
	const release = () => releaseCompletion ??= Promise.resolve().then(async () => {
		work.beginClose();
		try {
			await work.runWhenIdle(dispose);
		} finally {
			await work.drain();
		}
	});
	const run = (operation) => releaseCompletion ? Promise.reject(/* @__PURE__ */ new Error("Capability provider acquisition has been released")) : work.track(operation);
	const execute = async (resolution) => {
		let entries = [];
		if (resolution.load) {
			const load = resolution.prepareLoad();
			let registry = load.loadedRegistry;
			if (!registry) {
				const loadOptions = load.resolveLoadOptions();
				if (!isPluginRegistryLoadInFlight(loadOptions)) {
					const key = resolvePluginRegistryLoadCacheKey(loadOptions);
					let pending = loads.get(key);
					if (!pending) {
						pending = acquirePluginRegistryForInspection(loadOptions).then((acquired) => {
							releases.push(acquired.release);
							captureAuthority(acquired.registry);
							return acquired.registry;
						});
						loads.set(key, pending);
					}
					registry = await pending;
				}
			}
			const fallback = load.fallback(registry);
			entries = fallback.entries;
			if (fallback.pluginIds.length > 0) {
				const captured = await acquireBundledCapabilityRuntimeRegistry({
					...resolution.load.loadOptions,
					pluginIds: fallback.pluginIds
				});
				releases.push(captured.release);
				captureAuthority(captured.registry);
				entries = load.merge(entries, captured.registry);
			}
		}
		return resolution.resolve(entries);
	};
	const resolveProviders = (query) => run(() => execute(preparePluginCapabilityProviderResolution({
		...query,
		key: params.key
	}, retain)));
	const resolveProvider = (query) => run(() => execute(preparePluginCapabilityProviderLookup({
		...query,
		key: params.key
	}, (registry) => retain(registry, query.providerId))));
	try {
		return {
			providers: params.providerId === void 0 ? await resolveProviders(params) : [await resolveProvider({
				providerId: params.providerId,
				cfg: params.cfg
			})].filter((provider) => provider !== void 0),
			run,
			resolveProviders,
			resolveProvider,
			assertOpen: () => {
				if (releaseCompletion || [...authorities.values()].some((isCurrent) => !isCurrent?.())) throw new Error("The provider setup changed while preparing this request. Retry with the current provider setup.");
			},
			release
		};
	} catch (error) {
		return await finishCapabilityOperation({
			ok: false,
			error
		}, release);
	}
}
async function finishCapabilityOperation(outcome, release) {
	let result = outcome;
	try {
		await release();
	} catch (cleanupError) {
		result = {
			ok: false,
			error: outcome.ok ? cleanupError : new AggregateError([outcome.error, cleanupError], "Capability operation and registration cleanup failed", { cause: outcome.error })
		};
	}
	if (!result.ok) throw result.error;
	return result.value;
}
/** Keeps callback-shaped operations on the same acquisition and actual-work owner. */
async function withAcquiredPluginCapabilityProviders(params, run) {
	const acquired = await acquirePluginCapabilityProviders(params);
	let outcome;
	try {
		outcome = {
			ok: true,
			value: await acquired.run(() => run(acquired.providers, acquired))
		};
	} catch (error) {
		outcome = {
			ok: false,
			error
		};
	}
	return await finishCapabilityOperation(outcome, acquired.release);
}
//#endregion
export { finishCapabilityOperation as n, withAcquiredPluginCapabilityProviders as r, acquirePluginCapabilityProviders as t };
