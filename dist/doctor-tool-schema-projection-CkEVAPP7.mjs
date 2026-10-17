import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { r as getPluginToolMeta } from "./tool-metadata-DEC0Rqn3.mjs";
import { r as inspectRuntimeToolInputSchemas } from "./tool-schema-projection-D9z9oa3w.mjs";
import { n as normalizeAgentRuntimeTools } from "./tools-Xj0amRUJ.mjs";
import { t as buildReadableToolsByName } from "./tools-effective-inventory-build-BhvA39tn.mjs";
//#region src/flows/doctor-tool-schema-projection.ts
function toolSchemaDiagnosticToFinding(params) {
	let tool;
	try {
		tool = params.tools[params.diagnostic.toolIndex];
	} catch {
		tool = void 0;
	}
	const rawTool = params.rawToolsByName?.get(params.diagnostic.toolName);
	const pluginId = (tool ? getPluginToolMeta(tool)?.pluginId : void 0) ?? (rawTool ? getPluginToolMeta(rawTool)?.pluginId : void 0);
	const owner = pluginId ? ` from plugin ${pluginId}` : "";
	const agent = `Agent ${params.agentId} `;
	const path = pluginId === "bundle-mcp" ? "mcp.servers" : pluginId ? `plugins.entries.${pluginId}` : `tools.${params.diagnostic.toolName}`;
	const fixHint = pluginId === "bundle-mcp" ? "Disable or update the offending MCP server/tool so its parameters are a JSON object schema, then rerun doctor." : "Disable or update the offending plugin/tool so its parameters are a JSON object schema, then rerun doctor.";
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: `${agent}tool ${params.diagnostic.toolName}${owner} has an unsupported input schema for runtime projection.`,
		path,
		target: params.diagnostic.toolName,
		requirement: params.diagnostic.violations.join(", "),
		fixHint
	};
}
function collectNormalizedToolSchemaFindings(params) {
	const preNormalizationFindings = [];
	const rawToolsByName = buildReadableToolsByName(params.tools);
	let normalizedTools;
	try {
		normalizedTools = normalizeAgentRuntimeTools({
			tools: params.tools,
			provider: params.modelRef.provider,
			config: params.cfg,
			workspaceDir: params.workspaceDir,
			env: process.env,
			modelId: params.modelRef.model,
			modelApi: params.model.api,
			model: params.model,
			onPreNormalizationSchemaDiagnostics: (diagnostics, sourceTools) => {
				preNormalizationFindings.push(...diagnostics.map((diagnostic) => toolSchemaDiagnosticToFinding({
					agentId: params.agentId,
					tools: sourceTools,
					diagnostic
				})));
			}
		});
	} catch (error) {
		return [...preNormalizationFindings, params.normalizationFailureFinding(error)];
	}
	return [...preNormalizationFindings, ...inspectRuntimeToolInputSchemas(normalizedTools).map((diagnostic) => toolSchemaDiagnosticToFinding({
		agentId: params.agentId,
		tools: normalizedTools,
		rawToolsByName,
		diagnostic
	}))];
}
function agentRuntimeToolFailureFinding(params) {
	return {
		checkId: "core/doctor/runtime-tool-schemas",
		severity: "error",
		message: `Agent ${params.agentId} runtime tool schema validation could not ${params.phase} the runtime tool set.`,
		path: `agents.${params.agentId}.tools`,
		requirement: formatErrorMessage(params.error),
		fixHint: params.phase === "load" ? "Fix provider/plugin tool loading errors, then rerun doctor before relying on assistant tool startup." : "Fix provider/plugin schema normalization errors, then rerun doctor before relying on assistant tool startup."
	};
}
async function collectAgentRuntimeToolSchemaFindings(params) {
	let tools;
	try {
		const { createOpenClawCodingTools } = await import("./agent-tools-C9j6bWHC.mjs");
		tools = createOpenClawCodingTools({
			agentId: params.agentId,
			agentDir: params.agentDir,
			conversationCapabilityProfile: params.capabilityProfile,
			workspaceDir: params.workspaceDir,
			config: params.cfg,
			modelProvider: params.modelRef.provider,
			modelId: params.modelRef.model,
			modelApi: params.model.api,
			modelCompat: params.model.compat,
			modelContextWindowTokens: params.model.contextWindow,
			allowGatewaySubagentBinding: true,
			emitBeforeToolCallDiagnostics: false
		});
	} catch (error) {
		return [agentRuntimeToolFailureFinding({
			agentId: params.agentId,
			error,
			phase: "load"
		})];
	}
	return collectNormalizedToolSchemaFindings({
		agentId: params.agentId,
		tools,
		cfg: params.cfg,
		workspaceDir: params.workspaceDir,
		modelRef: params.modelRef,
		model: params.model,
		normalizationFailureFinding: (error) => agentRuntimeToolFailureFinding({
			agentId: params.agentId,
			error,
			phase: "normalize"
		})
	});
}
//#endregion
export { collectAgentRuntimeToolSchemaFindings, collectNormalizedToolSchemaFindings };
