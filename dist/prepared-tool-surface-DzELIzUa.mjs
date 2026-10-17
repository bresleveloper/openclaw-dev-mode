import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { r as resolveImageSanitizationLimits } from "./image-sanitization-DhkMOJXD.mjs";
import { r as resolveSessionPermissionCoreToolPolicy } from "./session-permission-exec-mode-B_8rJnOA.mjs";
import { r as resolveToolFsConfig } from "./tool-fs-policy-DAGJ2iyt.mjs";
import { n as resolveExecToolConfig } from "./lazy-exec-tool-B13-2Tux.mjs";
//#region src/agents/prepared-tool-surface.ts
/** Resolve once on the Gateway; placement hosts consume these secret-free facts. */
function prepareCoreToolPolicy(options, execConfig = resolveExecToolConfig({
	cfg: options.config,
	agentId: options.agentId
})) {
	const sessionPolicy = options.sessionPermissionPolicy ? resolveSessionPermissionCoreToolPolicy(options.sessionPermissionPolicy) : void 0;
	const workspaceOnly = options.requireWorkspaceOnly === true || options.trigger === "memory" || (sessionPolicy?.workspaceOnly ?? resolveToolFsConfig({
		cfg: options.config,
		agentId: options.agentId
	}).workspaceOnly === true);
	const readOnly = sessionPolicy?.readOnly ?? false;
	const patch = execConfig.applyPatch;
	const applyPatchContainmentSource = options.requireWorkspaceOnly ? "required-root" : sessionPolicy ? "session" : "config";
	return {
		workspaceOnly,
		readOnly,
		applyPatchEnabled: !readOnly && patch?.enabled !== false && isApplyPatchAllowedForModel(options, patch?.allowModels),
		applyPatchWorkspaceOnly: workspaceOnly || (sessionPolicy?.applyPatchWorkspaceOnly ?? patch?.workspaceOnly !== false),
		applyPatchContainmentSource,
		imageSanitization: resolveImageSanitizationLimits(options.config),
		modelContextWindowTokens: options.modelContextWindowTokens,
		modelHasVision: options.modelHasVision,
		...options.trigger === "memory" && options.memoryFlushWritePath ? { memoryFlushWritePath: options.memoryFlushWritePath } : {}
	};
}
function isApplyPatchAllowedForModel(options, allowModels) {
	if (!Array.isArray(allowModels) || allowModels.length === 0) return true;
	const normalizedModelId = normalizeOptionalLowercaseString(options.modelId);
	if (!normalizedModelId) return false;
	const provider = normalizeOptionalLowercaseString(options.modelProvider);
	const normalizedFull = provider && !normalizedModelId.includes("/") ? `${provider}/${normalizedModelId}` : normalizedModelId;
	return allowModels.some((entry) => {
		const normalized = normalizeOptionalLowercaseString(entry);
		return Boolean(normalized && (normalized === normalizedModelId || normalized === normalizedFull));
	});
}
function projectAgentToolDefinition(tool) {
	const name = tool.name || "tool";
	return {
		name,
		label: tool.label ?? name,
		...tool.hideFromChannelProgress === true ? { hideFromChannelProgress: true } : {},
		...tool.resultContentSource ? { resultContentSource: tool.resultContentSource } : {},
		description: tool.description ?? "",
		parameters: tool.parameters,
		executionMode: tool.executionMode
	};
}
//#endregion
export { projectAgentToolDefinition as n, prepareCoreToolPolicy as t };
