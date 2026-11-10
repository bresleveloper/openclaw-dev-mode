import { t as createMuseAgentHarness } from "./.setup/harness-DFnhalb6.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/muse/index.ts
var muse_default = definePluginEntry({
	id: "muse",
	name: "Muse Code agent runtime",
	description: "Runs Meta models through the Muse Code CLI.",
	register(api) {
		if (![
			"full",
			"discovery",
			"tool-discovery"
		].includes(api.registrationMode)) return;
		let store;
		const getStore = () => store ??= api.runtime.state.openKeyedStore({
			namespace: "msp-sessions",
			maxEntries: 5e3,
			defaultTtlMs: 7776e6
		});
		const binaryPath = isRecord(api.pluginConfig) && typeof api.pluginConfig.binaryPath === "string" ? api.pluginConfig.binaryPath : void 0;
		const harness = createMuseAgentHarness({
			binaryPath,
			sessionStore: {
				register: (key, value, options) => getStore().register(key, value, options),
				lookup: (key) => getStore().lookup(key),
				delete: (key) => getStore().delete(key)
			},
			logger: api.logger
		});
		let disposal;
		const dispose = () => disposal ??= Promise.resolve().then(() => harness.dispose?.());
		api.lifecycle.registerRuntimeLifecycle({
			id: "muse-runtime",
			cleanup: ({ reason }) => reason === "restart" || reason === "disable" ? dispose() : void 0,
			dispose
		});
		api.registerAgentHarness(harness);
	}
});
//#endregion
export { muse_default as default };
