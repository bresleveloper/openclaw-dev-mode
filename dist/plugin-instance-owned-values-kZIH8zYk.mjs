//#region src/plugins/plugin-instance-owned-values.ts
var PluginHostObject = class {
	constructor(value) {
		return value;
	}
};
var PluginCallToken = class extends PluginHostObject {
	#hostCleanup;
	constructor(value, hostCleanup) {
		super(value);
		this.#hostCleanup = hostCleanup;
	}
	static isHostCleanup(token) {
		return #hostCleanup in token && token.#hostCleanup;
	}
};
/** Installed once in the shared instance singleton, including its private-field brand. */
function createPluginValueInstances() {
	class OwnedValue extends PluginHostObject {
		#state;
		constructor(value, state) {
			super(value);
			this.#state = state;
		}
		static get(value) {
			if (value === null || typeof value !== "object" && typeof value !== "function") return;
			return #state in value ? value.#state : void 0;
		}
	}
	const foreign = /* @__PURE__ */ new WeakMap();
	const install = (value) => {
		const current = OwnedValue.get(value);
		if (current) return current;
		const state = { instance: foreign.get(value) };
		if (state.instance) foreign.delete(value);
		new OwnedValue(value, state);
		return state;
	};
	return {
		get(value) {
			return OwnedValue.get(value)?.instance ?? foreign.get(value);
		},
		set(value, instance) {
			const owned = OwnedValue.get(value);
			if (owned) owned.instance = instance;
			else foreign.set(value, instance);
			return this;
		},
		adopt(value, instance) {
			const seen = /* @__PURE__ */ new Set();
			const visit = (candidate) => {
				if (!candidate || typeof candidate !== "object" && typeof candidate !== "function" || seen.has(candidate)) return;
				seen.add(candidate);
				this.set(candidate, instance);
				for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(candidate))) if ("value" in descriptor) visit(descriptor.value);
			};
			visit(value);
			return value;
		},
		setHost(value, instance) {
			install(value).instance = instance;
			return this;
		},
		getOriginal(value, instance) {
			const owned = OwnedValue.get(value);
			return owned?.originalInstance === instance ? owned.original : void 0;
		},
		setOriginal(value, original, instance) {
			const owned = install(value);
			owned.originalInstance = instance;
			owned.original = original;
		}
	};
}
//#endregion
export { PluginHostObject as n, createPluginValueInstances as r, PluginCallToken as t };
