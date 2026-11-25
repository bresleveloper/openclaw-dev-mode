import { runMuseLogin } from "./muse-login.js";
import { a as openclaw_plugin_default, n as META_MODEL_CATALOG } from "./.setup/provider-catalog-mTt0ANDC.mjs";
import { applyMetaConnectionConfig } from "./onboard.js";
import { wrapMetaProviderStream } from "./stream.js";
import { defineSingleProviderPluginEntry } from "openclaw/plugin-sdk/provider-entry";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
// extensions/meta/index.ts
const META_REASONING_MODELS = new Map(META_MODEL_CATALOG.filter((model) => model.reasoning).map((model) => [model.id.toLowerCase(), model]));
const META_THINKING_PROFILE = {
	levels: [
		"off",
		"minimal",
		"low",
		"medium",
		"high",
		"xhigh"
	].map((id) => ({ id })),
	defaultLevel: "high"
};
const META_MAX_THINKING_PROFILE = {
	...META_THINKING_PROFILE,
	levels: [...META_THINKING_PROFILE.levels, { id: "max" }]
};
var meta_default = defineSingleProviderPluginEntry({
	id: "meta",
	name: "Meta Provider",
	description: "Meta provider plugin",
	manifest: openclaw_plugin_default,
	provider: {
		label: "Meta",
		docsPath: "/providers/meta",
		manifestAuth: {
			applyConfig: applyMetaConnectionConfig,
			noteMessage: "Meta provides Responses API inference.",
			noteTitle: "Meta"
		},
		extraAuth: [{
			id: "muse-code",
			label: "Muse Code",
			kind: "device_code",
			starterModel: "meta/muse-spark-1.3",
			run: runMuseLogin
		}],
		catalog: {
			discoveryMode: "strict",
			liveModelDiscovery: true
		},
		...buildProviderReplayFamilyHooks({ family: "openai-compatible" }),
		wrapSimpleCompletionStreamFn: wrapMetaProviderStream,
		wrapStreamFn: wrapMetaProviderStream,
		resolveThinkingProfile: (context) => {
			const catalogModel = META_REASONING_MODELS.get(context.modelId.toLowerCase());
			if (!(context.reasoning ?? catalogModel?.reasoning)) return;
			const efforts = context.compat?.supportedReasoningEfforts ?? catalogModel?.compat.supportedReasoningEfforts;
			return context.thinkingLevelMap?.max !== null && efforts?.includes("max") ? META_MAX_THINKING_PROFILE : META_THINKING_PROFILE;
		}
	}
});
export { meta_default as default };
