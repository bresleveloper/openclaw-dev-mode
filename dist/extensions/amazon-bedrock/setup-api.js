import { t as migrateAmazonBedrockLegacyConfig } from "./.setup/config-compat-J5qcaNdT.mjs";
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import { resolveAwsSdkEnvVarName } from "openclaw/plugin-sdk/provider-auth-runtime";
// extensions/amazon-bedrock/setup-api.ts
/**
* Lightweight Amazon Bedrock setup entry. It exposes auth detection and config
* migration hooks without loading runtime streaming or AWS discovery code.
*/
var setup_api_default = definePluginEntry({
	id: "amazon-bedrock",
	name: "Amazon Bedrock Setup",
	description: "Lightweight Amazon Bedrock setup hooks",
	register(api) {
		api.registerProvider({
			id: "amazon-bedrock",
			label: "Amazon Bedrock",
			auth: [],
			resolveConfigApiKey: ({ env }) => resolveAwsSdkEnvVarName(env)
		});
		api.registerConfigMigration((config) => migrateAmazonBedrockLegacyConfig(config));
	}
});
export { setup_api_default as default };
