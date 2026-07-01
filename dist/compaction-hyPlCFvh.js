import { i as formatErrorMessage } from "./errors-DCRXIYSQ.js";
import { m as resolveUserPath } from "./utils-BApvfmPs.js";
import { t as createSubsystemLogger } from "./subsystem-yNfG7O3v.js";
import { y as resolveSessionAgentIds } from "./agent-scope-CDZXADgT.js";
import { c as parseAgentSessionKey } from "./session-key-utils-C7uT9A4s.js";
import { a as resolveAgentDir } from "./agent-scope-config-C3ijpoNo.js";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-DiL2DId7.js";
import { n as resolveAgentHarnessPolicy } from "./harness-runtimes--3bc5qch.js";
import { a as getApiKeyForModel } from "./model-auth-Bvz14MtI.js";
import { i as isCliRuntimeProvider, r as isCliRuntimeAliasForProvider } from "./model-runtime-aliases-CZ8RT-Uc.js";
import { i as selectAgentHarness } from "./selection-Dz3q_Van.js";
import { n as resolveModelAsync } from "./model-Cc001htM.js";
//#region src/agents/harness/compaction-recovery.ts
/** Returns whether a native harness failure reason indicates a recoverable binding issue. */
function isRecoverableNativeHarnessBindingReason(reason) {
	if (typeof reason !== "string") return false;
	const normalized = reason.trim().toLowerCase();
	return normalized === "missing_thread_binding" || normalized === "stale_thread_binding" || normalized.includes("thread not found") || normalized.includes("no thread binding");
}
/** Returns whether a compact result failed due to a recoverable native binding issue. */
function isRecoverableNativeHarnessBindingFailure(result) {
	return result?.ok === false && (isRecoverableNativeHarnessBindingReason(result.failure?.reason) || isRecoverableNativeHarnessBindingReason(result.reason));
}
//#endregion
//#region src/agents/harness/compaction.ts
/**
* Routes compaction through selected native agent harnesses when supported.
*/
/**
* Delegates session compaction to the selected agent harness when that runtime owns compaction.
*
* CLI runtimes and OpenClaw-native compaction stay on the embedded runner path; plugin harnesses
* can opt in through their `compact` hook.
*/
const log = createSubsystemLogger("agents/harness");
function resolveHarnessCompactIdentity(params) {
	const agentIds = resolveSessionAgentIds({
		sessionKey: params.sessionKey,
		config: params.config,
		agentId: params.agentId
	});
	return {
		agentDir: params.agentDir ?? resolveAgentDir(params.config ?? {}, agentIds.sessionAgentId),
		agentId: params.agentId ?? agentIds.sessionAgentId
	};
}
async function resolveHarnessCompactApiKey(params) {
	const { agentDir, compactParams } = params;
	const existing = compactParams.resolvedApiKey?.trim();
	if (existing) return existing;
	if (!compactParams.authProfileId?.trim() || !compactParams.provider?.trim() || !compactParams.model?.trim()) return;
	const workspaceDir = resolveUserPath(compactParams.workspaceDir);
	const { model } = await resolveModelAsync(compactParams.provider, compactParams.model, agentDir, compactParams.config, {
		authProfileId: compactParams.authProfileId,
		workspaceDir
	});
	if (!model) return;
	return (await getApiKeyForModel({
		model,
		cfg: compactParams.config,
		profileId: compactParams.authProfileId,
		agentDir,
		workspaceDir
	})).apiKey?.trim() || void 0;
}
/** Runs harness-provided compaction when the selected runtime supports it. */
async function maybeCompactAgentHarnessSession(params, options = {}) {
	if (params.provider && isCliRuntimeProvider(params.provider, { config: params.config })) return;
	const runtimePolicySessionKey = params.sandboxSessionKey ?? params.sessionKey;
	const runtimePolicyAgentId = params.sandboxSessionKey && parseAgentSessionKey(params.sandboxSessionKey) ? void 0 : params.agentId;
	const runtime = resolveAgentHarnessPolicy({
		provider: params.provider,
		modelId: params.model,
		config: params.config,
		agentId: runtimePolicyAgentId,
		sessionKey: runtimePolicySessionKey
	}).runtime;
	if (isCliRuntimeAliasForProvider({
		runtime,
		provider: params.provider,
		cfg: params.config
	})) return;
	const selectedRuntime = normalizeOptionalAgentRuntimeId(params.agentHarnessId);
	const agentHarnessRuntimeOverride = selectedRuntime && !isDefaultAgentRuntimeId(selectedRuntime) ? selectedRuntime : void 0;
	let harness;
	try {
		harness = selectAgentHarness({
			provider: params.provider ?? "",
			modelId: params.model,
			config: params.config,
			agentId: runtimePolicyAgentId,
			sessionKey: runtimePolicySessionKey,
			agentHarnessRuntimeOverride
		});
	} catch (err) {
		if (agentHarnessRuntimeOverride) {
			if (formatErrorMessage(err).includes("does not support")) return;
		}
		throw err;
	}
	const internalHarness = harness;
	const shouldCompactAfterContextEngine = options.nativeCompactionRequest === "after_context_engine";
	if (shouldCompactAfterContextEngine && !internalHarness.compactAfterContextEngine) return;
	if (!options.nativeCompactionRequest && !harness.compact) {
		if (harness.id !== "openclaw") return {
			ok: false,
			compacted: false,
			reason: `Agent harness "${harness.id}" does not support compaction.`,
			failure: { reason: "unsupported_harness_compaction" }
		};
		return;
	}
	const compactIdentity = resolveHarnessCompactIdentity(params);
	const compactParams = {
		...params,
		agentDir: compactIdentity.agentDir,
		agentId: compactIdentity.agentId
	};
	let resolvedApiKey;
	try {
		resolvedApiKey = await resolveHarnessCompactApiKey({
			agentDir: compactIdentity.agentDir,
			compactParams
		});
	} catch (err) {
		log.debug("agent harness compaction credential lookup failed", { error: formatErrorMessage(err) });
	}
	const resolvedCompactParams = resolvedApiKey ? {
		...compactParams,
		resolvedApiKey
	} : compactParams;
	if (shouldCompactAfterContextEngine) return internalHarness.compactAfterContextEngine?.(resolvedCompactParams);
	return harness.compact?.(resolvedCompactParams);
}
//#endregion
export { isRecoverableNativeHarnessBindingFailure as n, maybeCompactAgentHarnessSession as t };
