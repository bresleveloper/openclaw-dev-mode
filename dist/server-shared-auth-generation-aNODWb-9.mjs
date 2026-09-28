import { n as registerListener, t as notifyListeners } from "./listeners-BogSNJ-R.mjs";
import { t as resolveGatewayReloadSettings } from "./config-reload-settings-q1wYjpRM.mjs";
import { r as invalidateGatewayPolicyClient } from "./ws-policy-close-fX60H7oF.mjs";
//#region src/gateway/server-shared-auth-generation.ts
/** One Gateway owns its generation fields, revision and read-only admission capability. */
var SharedGatewaySessionGenerationState = class {
	#current;
	#required;
	#revision = 0;
	#reader;
	#invalidationListeners = /* @__PURE__ */ new Set();
	constructor(initial) {
		this.#current = initial.current;
		this.#required = initial.required;
		this.#reader = () => this.#required === null ? this.#current : this.#required;
		Object.defineProperty(this.#reader, generationReaderStateKey, { value: new GenerationReaderBinding(this.#reader, this) });
	}
	get current() {
		return this.#current;
	}
	get required() {
		return this.#required;
	}
	get requiredGeneration() {
		return this.#required === null ? this.#current : this.#required;
	}
	get reader() {
		return this.#reader;
	}
	static fromReader(read) {
		const binding = read && Object.getOwnPropertyDescriptor(read, generationReaderStateKey)?.value;
		return read ? GenerationReaderBinding.read(binding, read) : void 0;
	}
	/** Follow committed policy even after the originating client leaves the socket set. */
	onInvalidated(generation, listener) {
		return registerListener(this.#invalidationListeners, (event) => {
			if (event.kind === "all" || event.generation !== generation) listener();
		});
	}
	publishInvalidation(event) {
		notifyListeners(this.#invalidationListeners, event);
	}
	capture() {
		return {
			generation: this.#current,
			previousGeneration: this.#current,
			revision: this.#revision
		};
	}
	owns(ownership) {
		return this.#revision === ownership.revision;
	}
	claim(ownership, generation) {
		if (!this.owns(ownership)) return null;
		const previousGeneration = this.#current;
		this.#current = generation;
		return {
			generation,
			previousGeneration,
			revision: ++this.#revision
		};
	}
	publish(next) {
		this.#current = next.current;
		this.#required = next.required;
		this.#revision++;
	}
	replace(ownership, next) {
		if (!this.owns(ownership)) return false;
		this.publish(next);
		return true;
	}
	restoreCurrent(ownership, current) {
		if (!this.owns(ownership)) return false;
		this.#current = current;
		this.#revision++;
		return true;
	}
	setRequired(ownership, required) {
		if (!this.owns(ownership)) return null;
		this.#required = required;
		this.#revision++;
		return this.capture();
	}
	finalize(ownership) {
		if (!this.owns(ownership)) return false;
		this.#current = ownership.generation;
		if (this.#required === ownership.generation || this.#required !== null && ownership.previousGeneration !== ownership.generation) this.#required = null;
		this.#revision++;
		this.publishInvalidation({
			kind: "generation",
			generation: this.requiredGeneration
		});
		return true;
	}
};
const generationReaderStateKey = Symbol("sharedGatewaySessionGenerationReaderState");
var GenerationReaderBinding = class {
	#owner;
	#state;
	constructor(owner, state) {
		this.#owner = owner;
		this.#state = state;
		Object.setPrototypeOf(this, null);
		Object.freeze(this);
	}
	static read(value, owner) {
		return typeof value === "object" && value !== null && #owner in value && value.#owner === owner ? value.#state : void 0;
	}
};
/** Disconnect stale shared-auth clients; null revokes every generation. */
function disconnectStaleSharedGatewayAuthClients(params) {
	for (const gatewayClient of params.clients) {
		if (!gatewayClient.usesSharedGatewayAuth) continue;
		if (gatewayClient.sharedGatewaySessionGeneration === params.expectedGeneration) continue;
		invalidateGatewayPolicyClient(gatewayClient, {
			reason: "gateway-auth-changed",
			code: 4001,
			message: "gateway auth changed",
			revokeSource: params.revokeSource
		});
	}
	if (params.revokeSource !== false) params.state?.publishInvalidation(params.expectedGeneration === null ? { kind: "all" } : {
		kind: "generation",
		generation: params.expectedGeneration
	});
}
/** Enforce shared auth generation behavior after a config write. */
function enforceSharedGatewaySessionGenerationForConfigWrite(params) {
	const reloadMode = resolveGatewayReloadSettings(params.nextConfig).mode;
	const nextSharedGatewaySessionGeneration = params.resolveRuntimeSnapshotGeneration();
	params.state.publish({
		current: nextSharedGatewaySessionGeneration,
		required: reloadMode === "off" ? nextSharedGatewaySessionGeneration : null
	});
	disconnectStaleSharedGatewayAuthClients({
		state: params.state,
		clients: params.clients,
		expectedGeneration: nextSharedGatewaySessionGeneration
	});
}
//#endregion
export { disconnectStaleSharedGatewayAuthClients as n, enforceSharedGatewaySessionGenerationForConfigWrite as r, SharedGatewaySessionGenerationState as t };
