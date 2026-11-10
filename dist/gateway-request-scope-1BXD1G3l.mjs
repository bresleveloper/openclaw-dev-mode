import { a as resolveGlobalSingleton } from "./global-singleton-DrXvEBww.mjs";
import { a as runWithPluginExecutionFrame, i as pluginInstanceInvocation, r as getPluginExecutionFrame } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { n as withAgentDatabasePreparationContext } from "./agent-database-preparation-context-DK375nya.mjs";
import { n as getPluginRegistryState } from "./runtime-state-Cd-Ga9cg.mjs";
import { n as getPluginRuntimeExecutionFrame, t as PluginRuntimeExecutionFrame } from "./execution-frame-BIyHTHsH.mjs";
import { n as getPluginRuntimeLoadContextState } from "./load-context-state-Dj3BDflJ.mjs";
import { n as prepareGatewayContextBindingOwner, t as getGatewayContextBindingSlot } from "./gateway-context-binding-owner-bQvbtsTz.mjs";
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
//#region src/plugins/runtime/gateway-context-binding.ts
const gatewayContextBindingKey = Symbol("gatewayContextBinding");
const gatewayContextLifetimeKey = Symbol("gatewayContextLifetime");
var GatewayContextBinding = class {
	#owner;
	#resolver;
	constructor(owner) {
		this.#owner = owner;
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value, owner) {
		return typeof value === "object" && value !== null && #owner in value && value.#owner === owner ? value : void 0;
	}
	static get(binding) {
		return binding.#resolver;
	}
	static set(binding, resolver) {
		binding.#resolver = resolver;
	}
};
var GatewayContextLifetime = class {
	#owner;
	#controller = new AbortController();
	constructor(owner) {
		this.#owner = owner;
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value, owner) {
		return typeof value === "object" && value !== null && #owner in value && value.#owner === owner ? value.#controller : void 0;
	}
};
function getGatewayContextBinding(owner) {
	const slot = getGatewayContextBindingSlot(owner);
	const binding = slot && Object.getOwnPropertyDescriptor(slot, gatewayContextBindingKey)?.value;
	return GatewayContextBinding.read(binding, owner);
}
function getGatewayContextLifetime(resolver) {
	const retained = Object.getOwnPropertyDescriptor(resolver, gatewayContextLifetimeKey)?.value;
	const existing = GatewayContextLifetime.read(retained, resolver);
	if (existing) return existing;
	const lifetime = new GatewayContextLifetime(resolver);
	Object.defineProperty(resolver, gatewayContextLifetimeKey, { value: lifetime });
	return GatewayContextLifetime.read(lifetime, resolver);
}
function bindGatewayContextResolver(owner, resolver) {
	if (resolver) {
		prepareGatewayContextBindingOwner(owner);
		let binding = getGatewayContextBinding(owner);
		if (!binding) {
			const slot = getGatewayContextBindingSlot(owner);
			binding = new GatewayContextBinding(owner);
			Object.defineProperty(slot, gatewayContextBindingKey, { value: binding });
			Object.freeze(slot);
		}
		GatewayContextBinding.set(binding, resolver);
	}
}
function getGatewayContextResolver(owner) {
	const binding = getGatewayContextBinding(owner);
	return binding ? GatewayContextBinding.get(binding) : void 0;
}
/** Follows explicit wrapper ownership without invoking any execution resolver. */
function getCanonicalGatewayContextResolver(resolver) {
	const seen = /* @__PURE__ */ new Set();
	let current = resolver;
	while (!seen.has(current)) {
		seen.add(current);
		const parent = getGatewayContextResolver(current);
		if (!parent) return current;
		current = parent;
	}
}
/** Match the host owner without invoking a possibly retired execution resolver. */
function hasGatewayContextOwner(owner, gatewayOwner) {
	const resolver = getGatewayContextResolver(owner);
	return resolver !== void 0 && (getGatewayContextResolver(resolver) ?? resolver) === gatewayOwner;
}
function clearGatewayContextResolver(owner) {
	const binding = getGatewayContextBinding(owner);
	const bound = binding !== void 0 && GatewayContextBinding.get(binding) !== void 0;
	if (binding) GatewayContextBinding.set(binding, void 0);
	return bound;
}
function getSharedGatewayContextResolver(owners) {
	const resolvers = owners.map(getGatewayContextResolver);
	if (resolvers.every((resolve) => !resolve)) return;
	const shared = () => {
		const contexts = resolvers.map((resolve) => {
			try {
				return resolve?.();
			} catch {
				return;
			}
		});
		if (resolvers.some((resolve) => !resolve)) throw new Error("incompatible Gateway bindings: bound and unbound owners");
		if (contexts.some((context) => !context)) return;
		if (contexts.some((context) => context !== contexts[0])) throw new Error("incompatible Gateway instances");
		return contexts[0];
	};
	const canonical = resolvers.map((resolve) => resolve ? getCanonicalGatewayContextResolver(resolve) : void 0);
	const owner = canonical[0];
	if (owner && canonical.every((candidate) => candidate === owner)) bindGatewayContextResolver(shared, owner);
	return shared;
}
//#endregion
//#region src/plugins/runtime/gateway-request-scope.ts
function runWithPluginGatewayScope(gatewayScope, run, invocation = pluginInstanceInvocation.getStore()) {
	const current = getPluginExecutionFrame();
	const runtime = getPluginRuntimeExecutionFrame(current);
	return runWithPluginExecutionFrame(runtime?.gatewayScope === gatewayScope && runtime.invocation === invocation ? runtime : new PluginRuntimeExecutionFrame(current ?? {}, gatewayScope, runtime?.generationRegistry, invocation), run);
}
const isNotWebchatConnect = () => false;
function settleRegistryScope(completion, held) {
	return mapPluginReturnPromise(completion, (value) => {
		held.length = 0;
		return value;
	}, (error) => {
		held.length = 0;
		throw error;
	}).value;
}
const ExpiredPluginRegistryScopeError = resolveGlobalSingleton(Symbol.for("openclaw.expiredPluginRegistryScopeError"), () => class extends Error {
	constructor() {
		super("Plugin registry scope is no longer available");
	}
});
function bindBorrowedRegistry(scope, registry, initiallyExpired = false) {
	let expired = initiallyExpired;
	let reference = registry && new WeakRef(registry);
	Object.defineProperty(scope, "pluginRegistry", {
		enumerable: true,
		configurable: true,
		get() {
			const current = reference?.deref();
			if (expired || reference && !current) throw new ExpiredPluginRegistryScopeError();
			return current;
		},
		set(next) {
			reference = next && new WeakRef(next);
			expired = false;
		}
	});
}
function copyGatewayScope(current, inheritRegistry = true) {
	const scoped = { isWebchatConnect: isNotWebchatConnect };
	if (!current) return scoped;
	for (const key of Reflect.ownKeys(current)) if (key !== "pluginRegistry" && Object.getOwnPropertyDescriptor(current, key)?.enumerable) Object.defineProperty(scoped, key, {
		value: Reflect.get(current, key),
		enumerable: true,
		configurable: true,
		writable: true
	});
	if (inheritRegistry && Object.getOwnPropertyDescriptor(current, "pluginRegistry")?.enumerable) try {
		bindBorrowedRegistry(scoped, current.pluginRegistry);
	} catch (error) {
		if (!(error instanceof ExpiredPluginRegistryScopeError)) throw error;
		bindBorrowedRegistry(scoped, void 0, true);
	}
	return scoped;
}
/** Carry only closure-bound node authorities into a nested request scope. */
function getPluginRuntimeGatewayNodeAuthorities() {
	const scope = getPluginRuntimeGatewayRequestScope();
	return {
		invokeWithSessionNodeAuthority: scope?.invokeWithSessionNodeAuthority,
		nodePlacementGrantAuthority: scope?.nodePlacementGrantAuthority
	};
}
/**
* Runs plugin gateway handlers with request-scoped context that runtime helpers can read.
*/
function withPluginRuntimeGatewayRequestScope(scope, run) {
	return runWithPluginGatewayScope(scope, run);
}
/** Runs detached work with its captured Gateway binding, including an explicitly unbound owner. */
function withPluginRuntimeGatewayContextResolver(resolveGatewayContext, run, options) {
	const current = options?.inheritRequestScope === false ? void 0 : getPluginRuntimeGatewayRequestScope();
	const scoped = copyGatewayScope(current);
	scoped.isWebchatConnect = current?.isWebchatConnect ?? isNotWebchatConnect;
	scoped.resolveGatewayContext = resolveGatewayContext;
	delete scoped.context;
	return withAgentDatabasePreparationContext(() => resolveGatewayContext?.()?.agentDatabaseStartup, () => runWithPluginGatewayScope(scoped, run));
}
/** Runs work against an owned registry handle while preserving any gateway request facts. */
function withPluginRuntimeRegistryScope(registry, run, declaredProviderOwners) {
	if (!registry) return run();
	return runWithPluginGatewayScope(createRegistryScope(registry, getPluginRuntimeGatewayRequestScope(), declaredProviderOwners), () => {
		const value = run();
		const completion = resolvePluginReturnPromise(value);
		return completion ? settleRegistryScope(completion, [registry]) : value;
	});
}
function createRegistryScope(registry, current, declaredProviderOwners) {
	const scoped = copyGatewayScope(current, false);
	let inheritedOwners;
	if (declaredProviderOwners === void 0 && current) try {
		if (current.pluginRegistry === registry) inheritedOwners = current.declaredProviderOwners;
	} catch (error) {
		if (!(error instanceof ExpiredPluginRegistryScopeError)) throw error;
	}
	bindBorrowedRegistry(scoped, registry);
	scoped.declaredProviderOwners = declaredProviderOwners ?? inheritedOwners ?? getPluginRuntimeLoadContextState(registry)?.declaredProviderOwners;
	return scoped;
}
function applyPluginScope(scoped, scope) {
	scoped.pluginId = scope.pluginId;
	if (scope.pluginSource !== void 0) scoped.pluginSource = scope.pluginSource;
	else delete scoped.pluginSource;
	if (scope.pluginOrigin !== void 0) scoped.pluginOrigin = scope.pluginOrigin;
	else delete scoped.pluginOrigin;
	if (scope.pluginTrustedOfficialInstall !== void 0) scoped.pluginTrustedOfficialInstall = scope.pluginTrustedOfficialInstall;
	else delete scoped.pluginTrustedOfficialInstall;
}
/**
* Runs work under the current gateway request scope while attaching plugin identity.
*/
function withPluginRuntimePluginScope(scope, run, registry, invocation) {
	const current = getPluginRuntimeGatewayRequestScope();
	const scoped = registry ? createRegistryScope(registry, current) : copyGatewayScope(current);
	applyPluginScope(scoped, scope);
	return runWithPluginGatewayScope(scoped, run, invocation);
}
/** Drops only generation selection; authenticated Gateway caller and authority stay attached. */
function runOutsidePluginRuntimeRegistryScope(run) {
	const current = getPluginRuntimeGatewayRequestScope();
	if (!current) return run();
	const scoped = copyGatewayScope(current, false);
	scoped.pluginRegistry = void 0;
	scoped.declaredProviderOwners = void 0;
	return runWithPluginGatewayScope(scoped, run);
}
function getPluginRuntimeGatewayRequestScope() {
	return getPluginRuntimeExecutionFrame()?.gatewayScope;
}
/** Reads registration/request/active registry precedence without initializing a cold runtime. */
function getPluginRegistryForContext() {
	const state = getPluginRegistryState();
	return state?.registrationContext?.registry ?? getPluginRuntimeGatewayRequestScope()?.pluginRegistry ?? state?.activeRegistry ?? null;
}
/** Live request context for trusted built-in tools that need direct runtime state. */
function getInProcessGatewayRequestContext(resolveGatewayContext) {
	if (resolveGatewayContext) return resolveGatewayContext();
	const scope = getPluginRuntimeGatewayRequestScope();
	return scope?.resolveGatewayContext ? scope.resolveGatewayContext() : scope?.context;
}
//#endregion
export { getSharedGatewayContextResolver as _, getPluginRuntimeGatewayNodeAuthorities as a, resolvePluginReturnPromise as b, withPluginRuntimeGatewayContextResolver as c, withPluginRuntimeRegistryScope as d, bindGatewayContextResolver as f, getGatewayContextResolver as g, getGatewayContextLifetime as h, getPluginRegistryForContext as i, withPluginRuntimeGatewayRequestScope as l, getCanonicalGatewayContextResolver as m, createRegistryScope as n, getPluginRuntimeGatewayRequestScope as o, clearGatewayContextResolver as p, getInProcessGatewayRequestContext as r, runOutsidePluginRuntimeRegistryScope as s, ExpiredPluginRegistryScopeError as t, withPluginRuntimePluginScope as u, hasGatewayContextOwner as v, mapPluginReturnPromise as y };
