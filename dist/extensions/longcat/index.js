import { t as openclaw_plugin_default } from "./.setup/openclaw.plugin-Bv6LEgMG.mjs";
import { LONGCAT_DEFAULT_MODEL_REF } from "./models.js";
import { applyLongCatConnectionConfig } from "./onboard.js";
import { createLongCatThinkingWrapper } from "./stream.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderToolCompatFamilyHooks } from "openclaw/plugin-sdk/provider-tools";
var longcat_default = defineSingleProviderPluginEntry({
	id: "longcat",
	name: "LongCat Provider",
	description: "Official LongCat provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "LongCat",
		docsPath: "/providers/longcat",
		aliases: ["meituan-longcat"],
		manifestAuth: {
			defaultModel: LONGCAT_DEFAULT_MODEL_REF,
			applyConfig: applyLongCatConnectionConfig,
			noteTitle: "LongCat",
			noteMessage: "Manage API keys at https://longcat.chat/platform/api_keys"
		},
		catalog: {
			liveModelDiscovery: true,
			discoveryMode: "strict"
		},
		...buildProviderReplayFamilyHooks({
			family: "openai-compatible",
			dropReasoningFromHistory: false
		}),
		...buildProviderToolCompatFamilyHooks("openai"),
		wrapStreamFn: (ctx) => createLongCatThinkingWrapper(ctx.streamFn, ctx.thinkingLevel)
	}
});
//#endregion
export { longcat_default as default };
