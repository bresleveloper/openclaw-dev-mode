import { i as unwrapSecretSentinelsForProviderEgress, r as unwrapModelHeaderSentinelsForProviderEgress, t as unwrapHeaderSentinelsForProviderEgress } from "./provider-secret-egress-LltAZ95s.mjs";
import { d as resolveProviderRuntimePluginHandle, r as getModelProviderRuntimePluginHandle, t as attachModelProviderRuntimePluginHandle } from "./provider-hook-runtime-BIyhXAln.mjs";
import { D as resolveProviderStreamFn } from "./provider-runtime-BMdc4CgR.mjs";
import { o as getModelLlmRuntime } from "./model-runtime-binding-DgnrsJj9.mjs";
import { i as ensureCustomApiRegistered } from "./ai-transport-runtime-host-Da2Me-9h.mjs";
import { createTransportAwareStreamFnForModel } from "@openclaw/ai/transports";
//#region src/agents/provider-stream.ts
/** Resolves and registers the stream function for a provider-backed model. */
function registerProviderStreamForModel(params) {
	const apiRegistry = params.apiRegistry ?? getModelLlmRuntime(params.model)?.registry;
	const runtimeHandle = getModelProviderRuntimePluginHandle(params.model) ?? (params.allowRuntimePluginLoad === false ? void 0 : resolveProviderRuntimePluginHandle({
		provider: params.model.provider,
		modelId: params.model.id,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env
	}));
	const runtimeModel = runtimeHandle ? attachModelProviderRuntimePluginHandle(params.model, runtimeHandle) : params.model;
	const pluginModel = unwrapModelHeaderSentinelsForProviderEgress(runtimeModel, "plugin provider stream construction");
	const providerStreamFn = resolveProviderStreamFn({
		provider: runtimeModel.provider,
		config: params.cfg,
		workspaceDir: params.workspaceDir,
		env: params.env,
		runtimeHandle,
		allowRuntimePluginLoad: params.allowRuntimePluginLoad,
		context: {
			config: params.cfg,
			agentDir: params.agentDir,
			workspaceDir: params.workspaceDir,
			provider: runtimeModel.provider,
			modelId: runtimeModel.id,
			model: pluginModel
		}
	});
	const transportFallback = providerStreamFn ? void 0 : createTransportAwareStreamFnForModel(runtimeModel.api === "google-generative-ai" ? pluginModel : runtimeModel, {
		cfg: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		env: params.env
	});
	const streamFn = providerStreamFn ? wrapPluginProviderStream(providerStreamFn) : transportFallback && params.model.api === "google-generative-ai" ? wrapPluginProviderStream(transportFallback) : transportFallback;
	if (!streamFn) return;
	const providerWrappedStreamFn = params.wrapProviderStream && runtimeHandle ? runtimeHandle.plugin?.wrapStreamFn?.({
		config: params.cfg,
		agentDir: params.agentDir,
		workspaceDir: params.workspaceDir,
		provider: runtimeModel.provider,
		modelId: runtimeModel.id,
		model: runtimeModel,
		auth: params.auth,
		streamFn
	}) ?? streamFn : streamFn;
	const preparedStreamFn = runtimeHandle ? (model, context, options) => providerWrappedStreamFn(attachModelProviderRuntimePluginHandle(model, runtimeHandle), context, options) : providerWrappedStreamFn;
	if (apiRegistry) ensureCustomApiRegistered(apiRegistry, runtimeModel.api, preparedStreamFn);
	return preparedStreamFn;
}
function wrapPluginProviderStream(streamFn) {
	const boundary = "plugin provider stream handoff";
	return (model, context, options) => {
		const apiKey = options?.apiKey ? unwrapSecretSentinelsForProviderEgress(options.apiKey, boundary) : options?.apiKey;
		const headers = options?.headers ? unwrapHeaderSentinelsForProviderEgress(options.headers, boundary) : options?.headers;
		const resolvedOptions = apiKey === options?.apiKey && headers === options?.headers ? options : {
			...options,
			apiKey,
			headers
		};
		return streamFn(unwrapModelHeaderSentinelsForProviderEgress(model, boundary), context, resolvedOptions);
	};
}
//#endregion
export { registerProviderStreamForModel as t };
