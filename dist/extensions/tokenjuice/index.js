import { createTokenjuiceAgentToolResultMiddleware } from "./tool-result-middleware.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
// extensions/tokenjuice/index.ts
var tokenjuice_default = definePluginEntry({
	id: "tokenjuice",
	name: "tokenjuice",
	description: "Compacts exec and bash tool results with tokenjuice reducers.",
	register(api) {
		api.registerAgentToolResultMiddleware(createTokenjuiceAgentToolResultMiddleware());
	}
});
export { tokenjuice_default as default };
