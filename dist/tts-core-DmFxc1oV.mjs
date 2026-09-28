import { F as resolveTimerTimeoutMs } from "./number-coercion-CLj0HTDM.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as splitTrailingAuthProfile } from "./model-ref-profile-BIKs-96s.mjs";
import { s as resolveAgentModelPrimaryValue } from "./model-input-DKxKaZGG.mjs";
import { i as buildModelAliasIndex, v as resolveModelRefFromString } from "./model-selection-shared-0uvJbX1M.mjs";
import { t as resolveDefaultModelForAgent } from "./model-selection-config-DZ4sk4C2.mjs";
import "./model-selection-CFnUi6iD.mjs";
import { s as sanitizeAssistantVisibleText } from "./assistant-visible-text-CVgfl6Gk.mjs";
import { t as runWithAsyncWorkResources } from "./async-work-resources-CUDFzL8J.mjs";
//#region src/tts/tts-core.ts
let defaultSummarizeTextDepsPromise;
function loadDefaultSummarizeTextDeps() {
	return defaultSummarizeTextDepsPromise ??= Promise.all([import("./simple-completion-runtime-4Gs1XG0p.mjs"), import("./model-auth-DULCZeLw.mjs")]).then(([completionRuntime, { requireApiKey }]) => ({
		completeWithPreparedSimpleCompletionModel: completionRuntime.completeWithPreparedSimpleCompletionModel,
		acquireSimpleCompletionModelWithSelection: completionRuntime.acquireSimpleCompletionModelWithSelection,
		requireApiKey
	}));
}
function resolveSummaryModelSelection(cfg, config, manifestPlugins) {
	const defaultRef = resolveDefaultModelForAgent({
		cfg,
		manifestPlugins
	});
	const override = normalizeOptionalString(config.summaryModel);
	const resolved = override ? resolveModelRefFromString({
		cfg,
		raw: override,
		defaultProvider: defaultRef.provider,
		aliasIndex: buildModelAliasIndex({
			cfg,
			defaultProvider: defaultRef.provider,
			manifestPlugins
		}),
		manifestPlugins
	}) : null;
	const raw = resolved ? override : resolveAgentModelPrimaryValue(cfg.agents?.defaults?.model);
	const model = raw ? splitTrailingAuthProfile(raw).model : void 0;
	const ref = resolved?.ref ?? defaultRef;
	return {
		selection: {
			provider: ref.provider,
			modelId: ref.model
		},
		...model && !model.includes("/") ? { shorthandModelId: model } : {}
	};
}
/** Summarize long text before synthesis using the configured summary model. */
async function summarizeText(params, deps) {
	const { text, targetLength, cfg, config, timeoutMs } = params;
	if (targetLength < 100 || targetLength > 1e4) throw new Error(`Invalid targetLength: ${targetLength}`);
	const startTime = Date.now();
	const completeSummary = async (prepared, provider, completionDeps) => {
		if ("error" in prepared) throw new Error(prepared.error);
		const completionModel = prepared.model;
		const providerKey = completionDeps.requireApiKey(prepared.auth, provider ?? completionModel.provider);
		try {
			const controller = new AbortController();
			const resolvedTimeoutMs = resolveTimerTimeoutMs(timeoutMs, 1);
			const timeout = setTimeout(() => controller.abort(), resolvedTimeoutMs);
			try {
				const res = await completionDeps.completeWithPreparedSimpleCompletionModel({
					model: completionModel,
					auth: {
						...prepared.auth,
						apiKey: providerKey
					},
					context: { messages: [{
						role: "user",
						content: `You are an assistant that summarizes texts concisely while keeping the most important information. Summarize the text to approximately ${targetLength} characters. Maintain the original tone and style. Reply only with the summary, without additional explanations.\n\n<text_to_summarize>\n${text}\n</text_to_summarize>`,
						timestamp: Date.now()
					}] },
					cfg,
					options: {
						maxTokens: Math.ceil(targetLength / 2),
						temperature: .3,
						strictReasoningTags: true,
						signal: controller.signal
					}
				});
				const summary = sanitizeAssistantVisibleText(res.content.filter((block) => block.type === "text").map((block) => block.text.trim()).filter(Boolean).join(" "));
				if (!summary) throw new Error("No summary returned");
				return {
					summary,
					latencyMs: Date.now() - startTime,
					inputLength: text.length,
					outputLength: summary.length
				};
			} finally {
				clearTimeout(timeout);
			}
		} catch (err) {
			if (err.name === "AbortError") throw new Error("Summarization timed out", { cause: err });
			throw err;
		}
	};
	if (deps) {
		const { selection } = resolveSummaryModelSelection(cfg, config);
		return await completeSummary(await deps.prepareSimpleCompletionModel({
			cfg,
			provider: selection.provider,
			modelId: selection.modelId
		}), selection.provider, deps);
	}
	const resolvedDeps = await loadDefaultSummarizeTextDeps();
	return await runWithAsyncWorkResources(async (onAcquired) => {
		const prepared = await resolvedDeps.acquireSimpleCompletionModelWithSelection({
			cfg,
			allowBundledStaticCatalogFallback: true
		}, (manifestPlugins) => resolveSummaryModelSelection(cfg, config, manifestPlugins));
		if (!("error" in prepared)) onAcquired({ release: async () => await prepared[Symbol.asyncDispose]() });
		return await completeSummary(prepared, prepared.selection?.provider, resolvedDeps);
	});
}
//#endregion
export { summarizeText as t };
