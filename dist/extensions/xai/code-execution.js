import { s as getRuntimeConfigSnapshot } from "../../runtime-snapshot-DbgWcCyV.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { h as readToolStringParam } from "../../common-XfKigJno.mjs";
import "../../runtime-config-snapshot-Bc7N5SpK.mjs";
import "../../provider-web-search-CRDOBhl4.mjs";
import { n as createCodeExecutionToolDefinition, t as buildMissingCodeExecutionApiKeyPayload } from "../../code-execution-tool-shared-CeAkKo1Y.mjs";
import { a as XAI_DEFAULT_MODEL_ID } from "../../model-definitions-DA8Fbxqz.mjs";
import { r as resolveXaiToolApiKeyWithAuth } from "../../tool-auth-shared-BKm-JLrq.mjs";
import { n as readPluginCodeExecutionConfig, r as resolveCodeExecutionEnabled, t as readCodeExecutionConfigRecord } from "../../code-execution-config-B0N75YRG.mjs";
import { a as requestXaiResponsesTool, i as XAI_RESPONSES_ENDPOINT, l as resolveXaiToolDefaultReasoningEffort, n as resolveNormalizedXaiToolModel, o as requireXaiResponseTextAndCitations, r as resolvePositiveIntegerToolConfig } from "../../tool-config-shared-C1JjZS0I.mjs";
//#region extensions/xai/src/code-execution-shared.ts
const XAI_CODE_EXECUTION_ENDPOINT = XAI_RESPONSES_ENDPOINT;
const XAI_DEFAULT_CODE_EXECUTION_MODEL = XAI_DEFAULT_MODEL_ID;
function resolveXaiCodeExecutionModel(config) {
	return resolveNormalizedXaiToolModel({
		config,
		defaultModel: XAI_DEFAULT_CODE_EXECUTION_MODEL
	});
}
function resolveXaiCodeExecutionMaxTurns(config) {
	return resolvePositiveIntegerToolConfig(config, "maxTurns");
}
function buildXaiCodeExecutionPayload(params) {
	return {
		task: params.task,
		provider: "xai",
		model: params.model,
		tookMs: params.tookMs,
		content: params.content,
		citations: params.citations,
		usedCodeExecution: params.usedCodeExecution,
		outputTypes: params.outputTypes
	};
}
async function requestXaiCodeExecution(params) {
	return await requestXaiResponsesTool({
		...params,
		endpoint: XAI_CODE_EXECUTION_ENDPOINT,
		inputText: params.task,
		tools: [{ type: "code_interpreter" }],
		reasoningEffort: resolveXaiToolDefaultReasoningEffort(params.model, "low"),
		errorLabel: "xAI code execution failed"
	}, (data) => {
		const { content, citations } = requireXaiResponseTextAndCitations(data, "xAI code execution failed");
		const outputTypes = Array.isArray(data.output) ? [...new Set(data.output.map((entry) => entry?.type).filter((value) => Boolean(value)))] : [];
		return {
			content,
			citations,
			usedCodeExecution: outputTypes.includes("code_interpreter_call"),
			outputTypes
		};
	});
}
//#endregion
//#region extensions/xai/code-execution.ts
function createCodeExecutionTool(options) {
	const runtimeConfig = options?.runtimeConfig ?? getRuntimeConfigSnapshot();
	const codeExecutionConfig = readPluginCodeExecutionConfig(runtimeConfig ?? void 0) ?? readPluginCodeExecutionConfig(options?.config);
	if (!resolveCodeExecutionEnabled({
		sourceConfig: options?.config,
		runtimeConfig: runtimeConfig ?? void 0,
		config: codeExecutionConfig,
		auth: options?.auth
	})) return null;
	return createCodeExecutionToolDefinition(async (_toolCallId, args) => {
		const apiKey = await resolveXaiToolApiKeyWithAuth({
			runtimeConfig: runtimeConfig ?? void 0,
			sourceConfig: options?.config,
			auth: options?.auth
		});
		if (!apiKey) return jsonResult(buildMissingCodeExecutionApiKeyPayload());
		const task = readToolStringParam(args, "task", { required: true });
		const codeExecutionConfigRecord = readCodeExecutionConfigRecord(codeExecutionConfig);
		const model = resolveXaiCodeExecutionModel(codeExecutionConfigRecord);
		const maxTurns = resolveXaiCodeExecutionMaxTurns(codeExecutionConfigRecord);
		const timeoutSeconds = typeof codeExecutionConfigRecord?.timeoutSeconds === "number" && Number.isFinite(codeExecutionConfigRecord.timeoutSeconds) ? codeExecutionConfigRecord.timeoutSeconds : 30;
		const startedAt = Date.now();
		const result = await requestXaiCodeExecution({
			apiKey,
			model,
			timeoutSeconds,
			maxTurns,
			task
		});
		return jsonResult(buildXaiCodeExecutionPayload({
			task,
			model,
			tookMs: Date.now() - startedAt,
			content: result.content,
			citations: result.citations,
			usedCodeExecution: result.usedCodeExecution,
			outputTypes: result.outputTypes
		}));
	});
}
//#endregion
export { createCodeExecutionTool };
