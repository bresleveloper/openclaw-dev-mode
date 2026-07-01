import { i as logVerbose } from "./globals-BWmHKFNH.js";
import { t as applyPreparedRuntimeAuthToModel } from "./provider-request-config-B7N9imAw.js";
import { c as resolveDefaultModelForAgent } from "./model-selection-i8V2iTdL.js";
import { o as requireApiKey } from "./model-auth-runtime-shared-D8fFlbsz.js";
import { n as completeSimple } from "./stream-Bs1DzXcN.js";
import "./model-auth-Bvz14MtI.js";
import { n as resolveModelAsync } from "./model-Cc001htM.js";
import { t as prepareModelForSimpleCompletion } from "./simple-completion-transport-830TQwEh.js";
import { n as getRuntimeAuthForModel } from "./runtime-model-auth.runtime-DpVkK3Fk.js";
//#region src/auto-reply/reply/conversation-label-generator.ts
const DEFAULT_MAX_LABEL_LENGTH = 128;
const TIMEOUT_MS = 15e3;
function isTextContentBlock(block) {
	return block.type === "text";
}
function isCodexSimpleCompletionModel(model) {
	return model.api === "openai-chatgpt-responses";
}
function extractSimpleCompletionError(result) {
	if (result.stopReason !== "error") return null;
	return result.errorMessage?.trim() || "unknown error";
}
/** Generates a bounded human-readable label for a session, or null on failure. */
async function generateConversationLabel(params) {
	const { userMessage, prompt, cfg, agentId, agentDir } = params;
	const maxLength = typeof params.maxLength === "number" && Number.isFinite(params.maxLength) && params.maxLength > 0 ? Math.floor(params.maxLength) : DEFAULT_MAX_LABEL_LENGTH;
	const modelRef = resolveDefaultModelForAgent({
		cfg,
		agentId
	});
	const resolved = await resolveModelAsync(modelRef.provider, modelRef.model, agentDir, cfg);
	if (!resolved.model) {
		logVerbose(`conversation-label-generator: failed to resolve model ${modelRef.provider}/${modelRef.model}`);
		return null;
	}
	const completionModel = prepareModelForSimpleCompletion({
		model: resolved.model,
		cfg
	});
	const runtimeAuth = await getRuntimeAuthForModel({
		model: completionModel,
		cfg,
		workspaceDir: agentDir
	});
	const apiKey = requireApiKey(runtimeAuth, modelRef.provider);
	const runtimeModel = applyPreparedRuntimeAuthToModel(completionModel, runtimeAuth);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
	try {
		const result = await completeSimple(runtimeModel, {
			systemPrompt: prompt,
			messages: [{
				role: "user",
				content: userMessage,
				timestamp: Date.now()
			}]
		}, {
			apiKey,
			maxTokens: 100,
			...isCodexSimpleCompletionModel(runtimeModel) ? {} : { temperature: .3 },
			signal: controller.signal
		});
		const errorMessage = extractSimpleCompletionError(result);
		if (errorMessage) {
			logVerbose(`conversation-label-generator: completion failed: ${errorMessage}`);
			return null;
		}
		const text = result.content.filter(isTextContentBlock).map((block) => block.text).join("").trim();
		if (!text) return null;
		return text.slice(0, maxLength);
	} finally {
		clearTimeout(timeout);
	}
}
//#endregion
export { generateConversationLabel as t };
