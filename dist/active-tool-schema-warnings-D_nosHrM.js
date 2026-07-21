import { t as sanitizeForLog } from "./ansi-D1GK_odF.js";
import { i as formatErrorMessage } from "./errors-sMD712F3.js";
import "./agent-scope-B2Pk_xhT.js";
import { a as resolveAgentDir, n as listAgentIds, o as resolveAgentWorkspaceDir, r as resolveAgentConfig } from "./agent-scope-config-BxAUeF6t.js";
import { i as getPluginToolMeta } from "./tools-D0RJIgtl.js";
import { n as extractModelCompat } from "./provider-model-compat-DcfMm2FN.js";
import { t as resolveModel } from "./model-D8T34PHV.js";
import { t as createOpenClawCodingTools } from "./agent-tools-B8Z3K_fP.js";
import { n as filterRuntimeCompatibleTools } from "./tool-schema-projection-BtVCT_Zc.js";
import { n as normalizeAgentRuntimeTools } from "./tools-DmCDHwa6.js";
import { t as buildReadableToolsByName } from "./tools-effective-inventory-build-DO7yfXnE.js";
import { t as resolveDoctorPrimaryModelRef } from "./primary-model-ref-DLm5IbdM.js";
//#region src/commands/doctor/shared/active-tool-schema-warnings.ts
function resolveRuntimeModelContext(params) {
	const model = resolveModel(params.provider, params.modelId, params.agentDir, params.cfg, { workspaceDir: params.workspaceDir }).model;
	if (!model) return {};
	return {
		modelApi: model.api,
		model,
		modelCompat: extractModelCompat(model),
		...typeof model.contextWindow === "number" ? { modelContextWindowTokens: model.contextWindow } : {}
	};
}
function formatDiagnostic(params) {
	const plugin = params.pluginId ? ` from plugin "${params.pluginId}"` : "";
	return sanitizeForLog(`- agents.${params.agentId}: active tool "${params.diagnostic.toolName}"${plugin} has unsupported runtime input schema (${params.diagnostic.violations.join(", ")}). OpenClaw will quarantine this tool at runtime; fix or disable the plugin, or remove the tool from active allowlists.`);
}
function readToolByIndex(tools, index) {
	try {
		return tools[index];
	} catch {
		return;
	}
}
function readPluginId(tool) {
	try {
		return tool ? getPluginToolMeta(tool)?.pluginId : void 0;
	} catch {
		return;
	}
}
/** Collect per-agent warnings for active plugin tools rejected by runtime schema projection. */
function collectActiveToolSchemaProjectionWarnings(params) {
	if (params.cfg.plugins?.enabled === false) return [];
	const env = params.env ?? process.env;
	const warnings = [];
	for (const agentId of listAgentIds(params.cfg)) {
		const agentConfig = resolveAgentConfig(params.cfg, agentId);
		const modelRef = resolveDoctorPrimaryModelRef(params.cfg, agentConfig?.model);
		const agentDir = resolveAgentDir(params.cfg, agentId, env);
		const workspaceDir = resolveAgentWorkspaceDir(params.cfg, agentId, env);
		let runtimeModelContext = {};
		try {
			runtimeModelContext = resolveRuntimeModelContext({
				cfg: params.cfg,
				agentDir,
				workspaceDir,
				provider: modelRef.provider,
				modelId: modelRef.model
			});
		} catch (error) {
			warnings.push(sanitizeForLog(`- agents.${agentId}: active tool schema validation could not resolve the runtime model context (${formatErrorMessage(error)}). Fix provider/model loading errors before relying on assistant tool startup.`));
		}
		let tools;
		try {
			tools = createOpenClawCodingTools({
				agentId,
				agentDir,
				workspaceDir,
				config: params.cfg,
				modelProvider: modelRef.provider,
				modelId: modelRef.model,
				modelApi: runtimeModelContext.modelApi,
				modelCompat: runtimeModelContext.modelCompat,
				modelContextWindowTokens: runtimeModelContext.modelContextWindowTokens,
				allowGatewaySubagentBinding: true,
				toolPolicyAuditLogLevel: "debug"
			});
		} catch (error) {
			warnings.push(sanitizeForLog(`- agents.${agentId}: active tool schema validation could not load the runtime tool set (${formatErrorMessage(error)}). Fix plugin loading errors before relying on assistant tool startup.`));
			continue;
		}
		const rawToolsByName = buildReadableToolsByName(tools);
		const preNormalizationDiagnostics = [];
		let normalizedTools;
		try {
			normalizedTools = normalizeAgentRuntimeTools({
				tools,
				provider: modelRef.provider,
				config: params.cfg,
				workspaceDir,
				env,
				modelId: modelRef.model,
				modelApi: runtimeModelContext.modelApi,
				model: runtimeModelContext.model,
				onPreNormalizationSchemaDiagnostics: (diagnostics) => preNormalizationDiagnostics.push(...diagnostics)
			});
		} catch (error) {
			warnings.push(sanitizeForLog(`- agents.${agentId}: active tool schema validation could not normalize the runtime tool set (${formatErrorMessage(error)}). Fix provider/plugin loading errors before relying on assistant tool startup.`));
			continue;
		}
		for (const diagnostic of preNormalizationDiagnostics) {
			const pluginId = readPluginId(rawToolsByName.get(diagnostic.toolName));
			warnings.push(formatDiagnostic({
				agentId,
				diagnostic,
				...pluginId ? { pluginId } : {}
			}));
		}
		const projection = filterRuntimeCompatibleTools(normalizedTools);
		for (const diagnostic of projection.diagnostics) {
			const tool = readToolByIndex(normalizedTools, diagnostic.toolIndex);
			const rawTool = rawToolsByName.get(diagnostic.toolName);
			const pluginId = readPluginId(tool) ?? readPluginId(rawTool);
			warnings.push(formatDiagnostic({
				agentId,
				diagnostic,
				...pluginId ? { pluginId } : {}
			}));
		}
	}
	return warnings;
}
//#endregion
export { collectActiveToolSchemaProjectionWarnings as t };
