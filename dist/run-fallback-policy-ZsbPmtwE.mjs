import { c as normalizeOptionalLowercaseString } from "./string-coerce-1VuiLaaR.mjs";
import { t as createLazyImportLoader } from "./lazy-promise-DGqyc4Y4.mjs";
import "./agent-run-registry-gmaPgO-n.mjs";
import { o as resolveAgentModelFallbackValues } from "./model-input-CeM8o97s.mjs";
import { b as resolveSubagentModelFallbacksOverride, f as resolveEffectiveModelFallbacks } from "./agent-scope-DXrnO3F4.mjs";
import "./thinking.shared-Be8dhC75.mjs";
import "./model-selection-cli-CxV7VRIV.mjs";
import { i as logWarn } from "./logger-DHVmYOKs.mjs";
import "./fast-mode-DezNRstT.mjs";
import { r as resolveModelCandidateChain } from "./model-fallback-candidates-DziklVcV.mjs";
import { t as buildAgentHookContextChannelFields } from "./hook-agent-context-C9bjjC7S.mjs";
import "./lanes-BJoXx6GG.mjs";
import "./bootstrap-budget-96UImSUD.mjs";
import "./run.runtime.js";
//#region src/cron/isolated-agent/channel-output-policy.ts
/** Reads channel plugin output/threading policy for isolated cron delivery. */
const channelPluginRuntimeLoader = createLazyImportLoader(() => import("./plugins-01XRuMGQ.mjs"));
/** Resolves channel-specific cron output preferences from loaded channel plugins. */
async function resolveCronChannelOutputPolicy(channel, opts) {
	const channelId = normalizeOptionalLowercaseString(channel);
	if (!channelId) return { preferFinalAssistantVisibleText: opts?.deliveryRequested !== true };
	const { getChannelPlugin } = await channelPluginRuntimeLoader.load();
	return { preferFinalAssistantVisibleText: getChannelPlugin(channelId)?.outbound?.preferFinalAssistantVisibleText === true };
}
/** Resolves the provider-specific current-thread target for a delivery address. */
async function resolveCurrentChannelTarget(params) {
	if (!params.to) return;
	const channelId = normalizeOptionalLowercaseString(params.channel);
	if (!channelId) return params.to;
	const { getChannelPlugin } = await channelPluginRuntimeLoader.load();
	return getChannelPlugin(channelId)?.threading?.resolveCurrentChannelId?.({
		to: params.to,
		threadId: params.threadId
	}) ?? params.to;
}
//#endregion
//#region src/cron/isolated-agent/run-execution.runtime.ts
/** Lazy runtime facade for isolated cron agent execution dependencies. */
const cronExecutionCliRuntimeLoader = createLazyImportLoader(() => import("./run-execution-cli.runtime.js"));
/** Lazily resolves complete CLI bindings so cron continuations preserve reuse metadata. */
async function getCliSessionBinding(...args) {
	return (await cronExecutionCliRuntimeLoader.load()).getCliSessionBinding(...args);
}
/** Lazily runs the CLI-backed agent path used by isolated cron execution. */
async function runCliAgent(...args) {
	return (await cronExecutionCliRuntimeLoader.load()).runCliAgent(...args);
}
//#endregion
//#region src/cron/isolated-agent/run-fallback-policy.ts
const cronModelPreflightRuntimeLoader = createLazyImportLoader(() => import("./model-preflight.runtime.js"));
/** Prepare one channel projection for both model routing hooks and embedded execution. */
async function prepareCronModelResolveInput(params) {
	const currentChannelId = await resolveCurrentChannelTarget({
		channel: params.messageChannel,
		to: params.resolvedDelivery.to,
		threadId: params.resolvedDelivery.threadId
	});
	return {
		modelResolve: {
			prompt: params.prompt,
			cwd: params.cwd,
			modelSelectionLocked: params.cronSession.sessionEntry.modelSelectionLocked,
			context: {
				trigger: params.trigger === "event" ? "event" : "cron",
				jobId: params.job.id,
				...buildAgentHookContextChannelFields({
					sessionKey: params.runSessionKey,
					messageChannel: params.messageChannel,
					messageTo: params.resolvedDelivery.to,
					currentChannelId,
					agentAccountId: params.resolvedDelivery.accountId
				})
			}
		},
		currentChannelId
	};
}
/** Resolves cron model fallbacks, giving explicit payload fallbacks precedence over subagent/default policy. */
function resolveCronFallbacksOverride(params) {
	const payload = params.job.payload.kind === "agentTurn" ? params.job.payload : void 0;
	const payloadFallbacks = Array.isArray(payload?.fallbacks) ? payload.fallbacks : void 0;
	const hasCronPayloadModelOverride = typeof payload?.model === "string" && payload.model.trim().length > 0;
	if (payloadFallbacks !== void 0) return payloadFallbacks;
	if (params.useSubagentFallbacks === true && !hasCronPayloadModelOverride) {
		const subagentFallbacksOverride = resolveSubagentModelFallbacksOverride(params.cfg, params.agentId);
		if (subagentFallbacksOverride !== void 0) return subagentFallbacksOverride;
	}
	if (!hasCronPayloadModelOverride && params.inheritDefaultFallbacksForAgentStringModel === true) {
		const defaultFallbacks = resolveAgentModelFallbackValues(params.cfg.agents?.defaults?.model);
		if (defaultFallbacks.length > 0) return defaultFallbacks;
	}
	return resolveEffectiveModelFallbacks({
		cfg: params.cfg,
		agentId: params.agentId,
		hasSessionModelOverride: hasCronPayloadModelOverride,
		modelOverrideSource: hasCronPayloadModelOverride ? "auto" : void 0
	});
}
/** Builds the ordered model candidates used by cron preflight checks. */
function resolveCronPreflightCandidates(params) {
	const fallbacksOverride = resolveCronFallbacksOverride(params);
	return resolveModelCandidateChain({
		cfg: params.cfg,
		agentId: params.agentId,
		provider: params.provider,
		model: params.model,
		requestedRouteResolution: "resolved",
		fallbacksOverride
	});
}
/** Selects the reachable candidate and retains only its remaining fallback chain. */
async function resolveCronPreflight(params) {
	const modelPreflightRuntime = await cronModelPreflightRuntimeLoader.load();
	const preflightCandidates = resolveCronPreflightCandidates(params);
	let firstUnavailableReason;
	for (const [index, candidate] of preflightCandidates.entries()) {
		const candidatePreflight = await modelPreflightRuntime.preflightCronModelProvider({
			cfg: params.cfg,
			provider: candidate.provider,
			model: candidate.model
		});
		if (candidatePreflight.status === "unavailable") {
			firstUnavailableReason ??= candidatePreflight.reason;
			continue;
		}
		const modelFallbacksOverride = candidate.provider !== params.provider || candidate.model !== params.model ? preflightCandidates.slice(index + 1).map((remaining) => `${remaining.provider}/${remaining.model}`) : void 0;
		if (modelFallbacksOverride && firstUnavailableReason !== void 0) logWarn(`[cron:${params.job.id}] ${firstUnavailableReason}; continuing with fallback ${candidate.provider}/${candidate.model}.`);
		return {
			ok: true,
			provider: candidate.provider,
			model: candidate.model,
			modelFallbacksOverride,
			runtimePluginCandidates: preflightCandidates.slice(index)
		};
	}
	if (firstUnavailableReason !== void 0) return {
		ok: false,
		reason: firstUnavailableReason
	};
	return {
		ok: true,
		provider: params.provider,
		model: params.model,
		modelFallbacksOverride: void 0,
		runtimePluginCandidates: preflightCandidates
	};
}
//#endregion
export { runCliAgent as a, getCliSessionBinding as i, resolveCronFallbacksOverride as n, resolveCronChannelOutputPolicy as o, resolveCronPreflight as r, prepareCronModelResolveInput as t };
