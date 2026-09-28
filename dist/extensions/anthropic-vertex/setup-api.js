import { resolveAnthropicVertexConfigApiKey } from "./region.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/anthropic-vertex/setup-api.ts
/**
* Lightweight Anthropic Vertex setup entry. It exposes provider auth detection
* without importing the stream runtime or Vertex SDK.
*/
/** Setup entry for Anthropic Vertex provider auth probing. */
var setup_api_default = definePluginEntry({
	id: "anthropic-vertex",
	name: "Anthropic Vertex Setup",
	description: "Lightweight Anthropic Vertex setup hooks",
	register(api) {
		api.registerProvider({
			id: "anthropic-vertex",
			label: "Anthropic Vertex",
			auth: [],
			resolveConfigApiKey: ({ env }) => resolveAnthropicVertexConfigApiKey(env)
		});
	}
});
//#endregion
export { setup_api_default as default };
