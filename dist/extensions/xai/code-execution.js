import { o as getRuntimeConfigSnapshot } from "../../runtime-snapshot-DYptB0Cf.mjs";
import { t as jsonResult } from "../../tool-results-BCM3fdVS.mjs";
import { m as readToolStringParam } from "../../common-Dyxcwsy8.mjs";
import "../../runtime-config-snapshot-DlrhEsA8.mjs";
import "../../provider-web-search-DUaDxxRi.mjs";
import { n as createCodeExecutionToolDefinition, t as buildMissingCodeExecutionApiKeyPayload } from "../../code-execution-tool-shared-CeAkKo1Y.mjs";
import { a as XAI_DEFAULT_MODEL_ID } from "../../model-definitions-BTg9V4Hq.mjs";
import { r as resolveXaiToolApiKeyWithAuth } from "../../tool-auth-shared-DfHEiTF0.mjs";
import { n as readPluginCodeExecutionConfig, r as resolveCodeExecutionEnabled, t as readCodeExecutionConfigRecord } from "../../code-execution-config-LHbglujB.mjs";
import { a as requireXaiResponseTextAndCitations, c as resolveXaiToolDefaultReasoningEffort, i as requestXaiResponsesTool, n as resolvePositiveIntegerToolConfig, r as XAI_RESPONSES_ENDPOINT, t as resolveNormalizedXaiToolModel } from "../../tool-config-shared-BH-m0o8C.mjs";
//#region extensions/xai/src/code-execution-shared.ts
function resolveXaiCodeExecutionModel(config) {
	return resolveNormalizedXaiToolModel({
		config,
		defaultModel: XAI_DEFAULT_MODEL_ID
	});
}
function resolveXaiCodeExecutionMaxTurns(config) {
	return resolvePositiveIntegerToolConfig(config, "maxTurns");
}
async function requestXaiCodeExecution(params) {
	return await requestXaiResponsesTool({
		...params,
		endpoint: XAI_RESPONSES_ENDPOINT,
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
		return jsonResult({
			task,
			provider: "xai",
			model,
			tookMs: Date.now() - startedAt,
			...result
		});
	});
}
//#endregion
export { createCodeExecutionTool };
