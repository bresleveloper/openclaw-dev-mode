import { t as createCopilotAgentHarness } from "./.setup/harness-BH2_ctMF.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { isRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
//#region extensions/copilot/index.ts
function readPoolOptions(pluginConfig) {
	if (!isRecord(pluginConfig)) return;
	const pool = pluginConfig.pool;
	if (!isRecord(pool)) return;
	const idleTtlMs = pool.idleTtlMs;
	if (typeof idleTtlMs !== "number" || !Number.isFinite(idleTtlMs) || idleTtlMs < 1) return;
	return { idleTtlMs };
}
var copilot_default = definePluginEntry({
	id: "copilot",
	name: "GitHub Copilot agent runtime",
	description: "Registers the GitHub Copilot agent runtime.",
	register(api) {
		if (api.registrationMode !== "full" && api.registrationMode !== "discovery" && api.registrationMode !== "tool-discovery") return;
		const poolOptions = readPoolOptions(api.pluginConfig);
		let sessionStore;
		const getSessionStore = () => sessionStore ??= api.runtime.state.openKeyedStore({
			namespace: "sdk-sessions",
			maxEntries: 5e3,
			defaultTtlMs: 7776e6
		});
		api.registerAgentHarness(createCopilotAgentHarness({
			...poolOptions ? { poolOptions } : {},
			sessionStore: {
				register: (key, value, options) => getSessionStore().register(key, value, options),
				lookup: (key) => getSessionStore().lookup(key),
				delete: (key) => getSessionStore().delete(key)
			}
		}));
	}
});
//#endregion
export { copilot_default as default };
