import { t as resolveConversationCapabilityProfile } from "../conversation-capability-profile-CyHg4VZy.js";
import { h as CODE_MODE_WAIT_TOOL_NAME, m as CODE_MODE_EXEC_TOOL_NAME } from "../agent-tools.before-tool-call-Bn4cnw4c.js";
import { C as isLocalModelLeanEnabled, S as filterLocalModelLeanTools, T as shouldCatalogToolForLocalModelLean, b as resolveToolSearchConfig, f as clearToolSearchCatalog, g as estimateToolSchemaDirectoryToolNames, i as TOOL_SEARCH_RAW_TOOL_NAME, l as applyToolSchemaDirectoryCatalog, m as createToolSearchCatalogRef, n as TOOL_DESCRIBE_RAW_TOOL_NAME, r as TOOL_SEARCH_CODE_MODE_TOOL_NAME, t as TOOL_CALL_RAW_TOOL_NAME, u as applyToolSearchCatalog, w as resolveLocalModelLeanPreserveToolNames, x as applyLocalModelLeanToolSearchDefaults } from "../tool-search-CD1zr4ps.js";
import { i as resolveCodeModeConfig, n as applyCodeModeCatalog, r as createCodeModeTools } from "../code-mode-B5uZimRs.js";
import { n as filterRuntimeCompatibleTools } from "../tool-schema-projection-BtVCT_Zc.js";
//#region src/agents/harness/tool-surface-bridge.ts
const TOOL_SEARCH_CONTROL_ALLOWLIST_NAMES = [
	TOOL_SEARCH_CODE_MODE_TOOL_NAME,
	TOOL_SEARCH_RAW_TOOL_NAME,
	TOOL_DESCRIBE_RAW_TOOL_NAME,
	TOOL_CALL_RAW_TOOL_NAME
];
const CODE_MODE_CONTROL_ALLOWLIST_NAMES = [CODE_MODE_EXEC_TOOL_NAME, CODE_MODE_WAIT_TOOL_NAME];
function createAgentHarnessToolSurfaceRuntime(params) {
	const forceDirectMessageTool = params.forceMessageTool === true || params.sourceReplyDeliveryMode === "message_tool_only";
	const localModelLeanEnabled = isLocalModelLeanEnabled({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const codeModeConfig = resolveCodeModeConfig(params.config, params.agentId);
	const toolSearchRuntimeConfig = forceDirectMessageTool ? params.config : applyLocalModelLeanToolSearchDefaults({
		config: params.config,
		agentId: params.agentId,
		sessionKey: params.sessionKey
	});
	const toolSearchConfig = resolveToolSearchConfig(toolSearchRuntimeConfig);
	const toolsAvailable = params.modelToolsEnabled && params.disableTools !== true && params.isRawModelRun !== true && params.toolsAllow?.length !== 0;
	const codeModeControlsEnabled = toolsAvailable && codeModeConfig.enabled;
	const toolSearchControlsEnabled = toolsAvailable && !codeModeControlsEnabled && toolSearchConfig.enabled;
	const toolSearchCatalogRef = toolSearchControlsEnabled || codeModeControlsEnabled ? createToolSearchCatalogRef() : void 0;
	const runtimeToolAllowlist = (toolSearchControlsEnabled || codeModeControlsEnabled) && params.runtimeToolAllowlist ? [.../* @__PURE__ */ new Set([
		...params.runtimeToolAllowlist,
		...toolSearchControlsEnabled ? TOOL_SEARCH_CONTROL_ALLOWLIST_NAMES : [],
		...codeModeControlsEnabled ? CODE_MODE_CONTROL_ALLOWLIST_NAMES : []
	])] : params.runtimeToolAllowlist ? [...params.runtimeToolAllowlist] : void 0;
	const toolSearchCatalogExecutor = toolSearchControlsEnabled || codeModeControlsEnabled ? params.executeTool : void 0;
	const preserveToolNames = resolveLocalModelLeanPreserveToolNames({
		toolNames: resolveConversationCapabilityProfile({
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			modelProvider: params.modelProvider,
			modelId: params.modelId,
			runtimeToolAllowlist
		}).policy.explicitToolOverrideAllowlist,
		forceMessageTool: params.forceMessageTool,
		sourceReplyDeliveryMode: params.sourceReplyDeliveryMode
	});
	const compactTools = (tools, options = {}) => {
		let effectiveTools = [...filterRuntimeCompatibleTools(options.localModelLeanApplied ? tools : filterLocalModelLeanTools({
			tools,
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			preserveToolNames
		})).tools];
		const codeModeTools = codeModeControlsEnabled ? createCodeModeTools({
			config: params.config,
			runtimeConfig: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			sessionId: params.sessionId,
			runId: params.runId,
			catalogRef: toolSearchCatalogRef,
			abortSignal: params.abortSignal,
			executeTool: params.executeTool
		}) : [];
		const directoryRequiredToolNames = forceDirectMessageTool ? ["message"] : [];
		const directoryHydratedToolNames = toolSearchControlsEnabled && toolSearchConfig.mode === "directory" ? (() => {
			try {
				return estimateToolSchemaDirectoryToolNames({
					tools: effectiveTools,
					query: params.prompt ?? "",
					maxTools: 4,
					requiredToolNames: directoryRequiredToolNames
				});
			} catch {
				return directoryRequiredToolNames;
			}
		})() : [];
		const compacted = codeModeControlsEnabled ? applyCodeModeCatalog({
			tools: [...codeModeTools, ...effectiveTools],
			config: params.config,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			runId: params.runId,
			catalogRef: toolSearchCatalogRef,
			toolHookContext: options.hookContext
		}) : toolSearchConfig.mode === "directory" ? applyToolSchemaDirectoryCatalog({
			tools: effectiveTools,
			config: toolSearchRuntimeConfig,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			runId: params.runId,
			catalogRef: toolSearchCatalogRef,
			toolHookContext: options.hookContext,
			hydrateToolNames: directoryHydratedToolNames
		}) : applyToolSearchCatalog({
			tools: effectiveTools,
			config: toolSearchRuntimeConfig,
			sessionId: params.sessionId,
			sessionKey: params.sessionKey,
			agentId: params.agentId,
			runId: params.runId,
			catalogRef: toolSearchCatalogRef,
			toolHookContext: options.hookContext,
			shouldCatalogTool: localModelLeanEnabled && toolSearchConfig.mode === "tools" ? shouldCatalogToolForLocalModelLean : void 0
		});
		effectiveTools = [...filterRuntimeCompatibleTools(options.localModelLeanApplied ? compacted.tools : filterLocalModelLeanTools({
			tools: compacted.tools,
			config: params.config,
			agentId: params.agentId,
			sessionKey: params.sessionKey,
			preserveToolNames
		})).tools];
		return { tools: effectiveTools };
	};
	return {
		codeModeControlsEnabled,
		compactTools,
		config: toolSearchControlsEnabled ? toolSearchRuntimeConfig : params.config,
		includeToolSearchControls: toolSearchControlsEnabled,
		runtimeToolAllowlist,
		toolSearchCatalogRef,
		toolSearchControlsEnabled,
		cleanup: () => {
			clearToolSearchCatalog({
				sessionId: params.sessionId,
				sessionKey: params.sessionKey,
				agentId: params.agentId,
				runId: params.runId,
				catalogRef: toolSearchCatalogRef
			});
		},
		toolSearchCatalogExecutor
	};
}
//#endregion
export { createAgentHarnessToolSurfaceRuntime };
