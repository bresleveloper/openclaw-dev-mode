import { t as definePluginEntry } from "../../plugin-entry-D4OPnFRH.mjs";
import { n as registerAnthropicPlugin } from "../../register.runtime-DQXIvDst.mjs";
//#region extensions/anthropic/index.ts
var anthropic_default = definePluginEntry({
	id: "anthropic",
	name: "Anthropic",
	description: "Anthropic models, Claude CLI, and native Claude session catalog",
	register: registerAnthropicPlugin
});
//#endregion
export { anthropic_default as default };
