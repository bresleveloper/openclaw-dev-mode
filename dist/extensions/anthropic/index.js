import { t as definePluginEntry } from "../../plugin-entry-2l_2QeB2.mjs";
import { n as registerAnthropicPlugin } from "../../register.runtime-u_tygPjH.mjs";
//#region extensions/anthropic/index.ts
var anthropic_default = definePluginEntry({
	id: "anthropic",
	name: "Anthropic",
	description: "Anthropic models, Claude CLI, and native Claude session catalog",
	register: registerAnthropicPlugin
});
//#endregion
export { anthropic_default as default };
