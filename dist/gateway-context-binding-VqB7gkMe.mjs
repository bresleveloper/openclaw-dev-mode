import { n as prepareGatewayContextBindingOwner, t as getGatewayContextBindingSlot } from "./gateway-context-binding-owner-bQvbtsTz.mjs";
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
export { getGatewayContextResolver as a, getGatewayContextLifetime as i, clearGatewayContextResolver as n, getSharedGatewayContextResolver as o, getCanonicalGatewayContextResolver as r, hasGatewayContextOwner as s, bindGatewayContextResolver as t };
