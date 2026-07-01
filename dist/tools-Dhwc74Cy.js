import { g as copyToolTerminalPresentation, j as copyChannelAgentToolMeta, r as copyBeforeToolCallHookMarker } from "./agent-tools.before-tool-call-CP6dTokt.js";
import { n as copyPluginToolMeta } from "./tools-DG6VDQeD.js";
import { n as normalizeProviderToolSchemas, t as logProviderToolSchemaDiagnostics } from "./tool-schema-runtime-CsLQW2gl.js";
import { t as filterProviderNormalizableTools } from "./tool-schema-projection-Bld_BaX8.js";
//#region src/agents/runtime-plan/tools.ts
/** Builds the provider/runtime context passed into runtime-plan tool hooks. */
function runtimePlanToolContext(params) {
	return {
		workspaceDir: params.workspaceDir,
		modelApi: params.modelApi ?? void 0,
		model: params.model
	};
}
function copyRuntimeToolMetadata(source, target) {
	if (source === target) return;
	copyPluginToolMeta(source, target);
	copyChannelAgentToolMeta(source, target);
	copyBeforeToolCallHookMarker(source, target);
	copyToolTerminalPresentation(source, target);
}
function preserveRuntimeToolMetadata(sourceTools, normalizedTools) {
	const sourcesByUniqueName = /* @__PURE__ */ new Map();
	const duplicateNames = /* @__PURE__ */ new Set();
	for (const source of sourceTools) {
		const name = source.name;
		if (sourcesByUniqueName.has(name)) {
			duplicateNames.add(name);
			sourcesByUniqueName.delete(name);
			continue;
		}
		if (!duplicateNames.has(name)) sourcesByUniqueName.set(name, source);
	}
	for (const [index, target] of normalizedTools.entries()) {
		const indexedSource = sourceTools[index];
		const source = indexedSource?.name === target.name ? indexedSource : sourcesByUniqueName.get(target.name);
		if (source) copyRuntimeToolMetadata(source, target);
	}
	return normalizedTools;
}
/** Normalizes tool schemas through a runtime plan or provider fallback policy. */
function normalizeAgentRuntimeTools(params) {
	const planContext = runtimePlanToolContext(params);
	const normalizableToolProjection = filterProviderNormalizableTools(params.tools);
	params.onPreNormalizationSchemaDiagnostics?.(normalizableToolProjection.diagnostics, params.tools);
	const normalizableTools = [...normalizableToolProjection.tools];
	const normalized = params.runtimePlan?.tools.normalize(normalizableTools, planContext) ?? normalizeProviderToolSchemas({
		tools: normalizableTools,
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env,
		modelId: params.modelId,
		modelApi: params.modelApi,
		model: params.model,
		runtimeHandle: params.runtimeHandle,
		allowRuntimePluginLoad: params.allowProviderRuntimePluginLoad
	});
	return preserveRuntimeToolMetadata(normalizableTools, Array.isArray(normalized) ? normalized : normalizableTools);
}
/** Emits runtime-plan or provider fallback diagnostics for normalized tools. */
function logAgentRuntimeToolDiagnostics(params) {
	const planContext = runtimePlanToolContext(params);
	if (params.runtimePlan) {
		params.runtimePlan.tools.logDiagnostics(params.tools, planContext);
		return;
	}
	logProviderToolSchemaDiagnostics({
		tools: params.tools,
		provider: params.provider,
		config: params.config,
		workspaceDir: params.workspaceDir,
		env: params.env ?? process.env,
		modelId: params.modelId,
		modelApi: params.modelApi,
		model: params.model,
		runtimeHandle: params.runtimeHandle
	});
}
//#endregion
export { normalizeAgentRuntimeTools as n, logAgentRuntimeToolDiagnostics as t };
