import { registerAmazonBedrockPlugin } from "./register.sync.runtime.js";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
//#region extensions/amazon-bedrock/index.ts
/**
* Amazon Bedrock provider plugin entry. Registers runtime streaming, discovery,
* auth, thinking policy, guardrail, and memory embedding hooks.
*/
var amazon_bedrock_default = definePluginEntry({
	id: "amazon-bedrock",
	name: "Amazon Bedrock Provider",
	description: "Bundled Amazon Bedrock provider policy plugin",
	register(api) {
		registerAmazonBedrockPlugin(api);
	}
});
//#endregion
export { amazon_bedrock_default as default };
