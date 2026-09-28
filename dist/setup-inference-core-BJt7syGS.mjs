import { t as coerceErrorMessage } from "./error-coercion-C787aVxk.mjs";
import { o as resolveUserPath } from "./home-dir-BKwhAL2c.mjs";
import "./utils-aKqR_F_U.mjs";
import { r as normalizeProviderId } from "./provider-id-DCtsDflE.mjs";
import { t as DEFAULT_AGENT_WORKSPACE_DIR } from "./workspace-default-hMJcajDi.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { r as normalizeAgentModelRefForConfig } from "./model-input-DKxKaZGG.mjs";
//#region src/system-agent/setup-inference-core.ts
const setupInferenceLog = createSubsystemLogger("system-agent/setup-inference");
/**
* Inference is the one required onboarding step (docs/cli/setup.md
* "Setup bootstrap"). This module gives structured clients (macOS app) the
* same ladder the conversation uses, with one hard guarantee: a candidate is
* persisted as the default model only after a real completion round-trips.
* A failing candidate must never leave config pointing at a broken model.
*/
const SETUP_INFERENCE_TEST_TIMEOUT_MS = 9e4;
const SETUP_INFERENCE_TEST_PROMPT = "Reply with the single word OK. Do not use tools.";
const PROVIDER_AUTO_SETUP_KIND_PREFIX = "provider-auto:";
const SAVED_AUTH_SETUP_KIND_PREFIX = "saved-auth:";
/**
* The config commit may have happened, so callers must verify current setup
* instead of treating this like a definitive candidate failure and retrying.
*/
var SetupInferenceActivationIndeterminateError = class extends Error {
	constructor(..._args) {
		super(..._args);
		this.name = "SetupInferenceActivationIndeterminateError";
	}
};
var SetupInferenceActivationUnavailableError = class extends Error {
	constructor(..._args2) {
		super(..._args2);
		this.name = "SetupInferenceActivationUnavailableError";
	}
};
/**
* The live-tested owner no longer matches current config. Activation maps this
* to `{ ok: false, status: "auth" }` so the guided-onboarding ladder can move
* to its next candidate instead of crashing the CLI.
*/
var SetupInferenceOwnerDriftError = class extends Error {
	constructor(..._args3) {
		super(..._args3);
		this.name = "SetupInferenceOwnerDriftError";
	}
};
var SetupInferenceCancelledError = class extends Error {
	constructor() {
		super("Provider login was cancelled.");
	}
};
function throwIfSetupInferenceCancelled(params) {
	if (params.signal?.aborted || params.isCancelled?.()) throw new SetupInferenceCancelledError();
}
async function waitForProviderAuth(promise, signal) {
	if (!signal) return await promise;
	if (signal.aborted) {
		promise.catch(() => {});
		throw new SetupInferenceCancelledError();
	}
	let rejectAborted;
	const aborted = new Promise((_resolve, reject) => {
		rejectAborted = reject;
	});
	const onAbort = () => rejectAborted?.(new SetupInferenceCancelledError());
	signal.addEventListener("abort", onAbort, { once: true });
	try {
		return await Promise.race([promise, aborted]);
	} finally {
		signal.removeEventListener("abort", onAbort);
	}
}
function toProviderAutoSetupKind(choiceId) {
	return `${PROVIDER_AUTO_SETUP_KIND_PREFIX}${encodeURIComponent(choiceId)}`;
}
function toSavedAuthSetupKind(profileId) {
	return `${SAVED_AUTH_SETUP_KIND_PREFIX}${encodeURIComponent(profileId)}`;
}
function parseSavedAuthSetupProfileId(kind) {
	if (!kind.startsWith(SAVED_AUTH_SETUP_KIND_PREFIX)) return;
	const encoded = kind.slice(11);
	if (!encoded) return;
	try {
		return decodeURIComponent(encoded) || void 0;
	} catch {
		return;
	}
}
function parseInferenceRef(modelRef) {
	const slash = modelRef.indexOf("/");
	return slash === -1 ? {
		provider: modelRef,
		model: ""
	} : {
		provider: modelRef.slice(0, slash),
		model: modelRef.slice(slash + 1)
	};
}
function parseProviderAutoSetupChoiceId(kind) {
	if (!kind.startsWith(PROVIDER_AUTO_SETUP_KIND_PREFIX)) return;
	const encoded = kind.slice(14);
	if (!encoded) return;
	try {
		return decodeURIComponent(encoded) || void 0;
	} catch {
		return;
	}
}
function invalidSetupConfigError(snapshot) {
	const issue = snapshot.issues?.[0];
	const detail = issue ? ` (${issue.path ? `${issue.path}: ` : ""}${issue.message})` : "";
	return `OpenClaw config ${snapshot.path} is invalid${detail}. Fix it before running setup.`;
}
async function redactSetupInferenceError(message, ...apiKeys) {
	const secrets = new Set(apiKeys.flatMap((apiKey) => [apiKey, apiKey?.trim()]).filter((value) => Boolean(value)));
	let redacted = coerceErrorMessage(message);
	for (const secret of Array.from(secrets).toSorted((a, b) => b.length - a.length)) redacted = redacted.split(secret).join("[redacted]");
	const { redactToolPayloadText } = await import("./redact-omZQGwDV.mjs");
	return redactToolPayloadText(redacted);
}
function resolveCandidatePresentation(candidate, authChoices) {
	const choice = authChoices.find((entry) => entry.choiceId === candidate.kind || entry.deprecatedChoiceIds?.includes(candidate.kind) === true);
	const brandId = resolveSetupInferenceCandidateBrandId(candidate, choice?.providerId);
	return {
		...brandId ? { brandId } : {},
		...choice?.icon ? { icon: choice.icon } : {},
		...choice?.website ? { website: choice.website } : {}
	};
}
function resolveSetupInferenceWorkspace(snapshot) {
	const config = snapshot.exists && snapshot.valid ? snapshot.sourceConfig ?? snapshot.config : void 0;
	return resolveUserPath(config?.agents?.defaults?.workspace?.trim() || DEFAULT_AGENT_WORKSPACE_DIR);
}
const SETUP_STATUS_BY_FAILOVER_REASON = {
	auth: "auth",
	auth_permanent: "auth",
	format: "format",
	rate_limit: "rate_limit",
	overloaded: "rate_limit",
	billing: "billing",
	server_error: "unknown",
	timeout: "timeout",
	tls_certificate: "unknown",
	context_overflow: "unknown",
	model_not_found: "format",
	session_expired: "unknown",
	empty_response: "unknown",
	no_error_details: "unknown",
	unclassified: "unknown",
	unknown: "unknown"
};
function mapFailoverReasonToSetupStatus(reason) {
	return reason ? SETUP_STATUS_BY_FAILOVER_REASON[reason] : "unknown";
}
function validateSetupInferenceOwnerEvidence(params) {
	if (!params.auth.authFingerprint && (!params.auth.runtimeOwnerFingerprint || !params.auth.runtimeOwnerKind || !params.auth.runtimeOwnerId?.trim())) return {
		ok: false,
		status: "unknown",
		error: "Inference succeeded, but its runtime did not report an owner that OpenClaw can safely reuse. No default model was changed."
	};
	if (params.runner === "cli" && (!params.auth.runtimeArtifactFingerprint || !params.auth.runtimeArtifactId?.trim())) return {
		ok: false,
		status: "unknown",
		error: "Inference succeeded, but its CLI executable/package artifact could not be safely reused. No default model was changed."
	};
	if (params.runner === "embedded") {
		const successfulHarnessId = params.auth.agentHarnessId?.trim();
		const configuredHarnessId = params.configuredHarnessId?.trim();
		if (!successfulHarnessId || configuredHarnessId !== void 0 && configuredHarnessId !== "auto" && successfulHarnessId !== configuredHarnessId) return {
			ok: false,
			status: "unknown",
			error: "Inference succeeded, but its exact agent harness could not be safely reused. No default model was changed."
		};
		if (successfulHarnessId !== "openclaw" && (params.auth.runtimeOwnerKind !== "plugin-harness" || params.auth.runtimeOwnerId?.trim() !== successfulHarnessId || !params.auth.runtimeArtifactFingerprint || !params.auth.runtimeArtifactId?.trim())) return {
			ok: false,
			status: "unknown",
			error: "Inference succeeded, but its agent harness artifact could not be safely reused. No default model was changed."
		};
	}
}
function resolveSetupInferenceCandidateBrandId(candidate, providerId) {
	if (candidate.kind === "claude-cli") return "claude";
	if (candidate.kind === "codex-cli") return "openai";
	return providerId?.trim() || candidate.modelRef.split("/", 1)[0]?.trim() || void 0;
}
/** CLI backends need a hard tool-free mode; the probe must not let a CLI act on the host. */
async function resolveToolFreeCliSetupError(route) {
	if (route.runner !== "cli") return;
	const [{ resolveCliBackendConfig }, { GEMINI_CLI_DEFAULT_MODEL_REF }] = await Promise.all([import("./cli-backends-BX9SWwa0.mjs"), import("./onboard-inference-ambient-vnD5ibQo.mjs")]);
	const backend = resolveCliBackendConfig(route.provider, route.runConfig, { agentId: route.agentId });
	if (backend?.sideQuestionToolMode === "disabled") return;
	const geminiCliProvider = parseInferenceRef(GEMINI_CLI_DEFAULT_MODEL_REF).provider;
	if (backend?.nativeToolMode === "none" && route.provider !== geminiCliProvider) return;
	return route.provider === geminiCliProvider ? "Gemini CLI cannot be used for inference-gated setup because it has no hard tool-free mode. Choose Claude Code, Codex, or an API-key provider; normal Gemini CLI agent runs remain available after setup." : `CLI backend ${backend?.id ?? route.provider} cannot be used for inference-gated setup because it has no hard tool-free mode. Choose another inference provider.`;
}
async function resolveSetupInferenceWinnerError(route, result) {
	const winnerProvider = result.meta?.executionTrace?.winnerProvider?.trim();
	const winnerModel = result.meta?.executionTrace?.winnerModel?.trim();
	if (!winnerProvider || !winnerModel) return "The inference run did not report which provider and model produced its reply.";
	if (winnerProvider === route.provider) {
		if (winnerModel === route.model) return;
		const { resolveDirectBundledProviderPolicySurface } = await import("./provider-policy-surface-B2-OkNKH.mjs");
		if (resolveDirectBundledProviderPolicySurface(route.provider)?.isResponseModelEquivalent?.({
			provider: route.provider,
			requestedModelId: route.model,
			responseModelId: winnerModel
		}) === true) return;
	}
	return `The inference run answered through ${winnerProvider}/${winnerModel} instead of the requested ${route.provider}/${route.model}. Disable model-routing overrides or choose the working route directly, then retry.`;
}
function validateSetupModelTarget(expected, requested) {
	return expected === requested ? void 0 : { error: expected === "utility" ? "This model is for setup and utility tasks. Update this client and select utility setup; it cannot be activated as a regular agent model." : "The requested setup model role does not match this provider choice. Refresh setup and choose again." };
}
function resolveSetupModel(params) {
	const selected = params.modelRef?.trim() || params.defaultModel;
	const modelRef = selected ? normalizeAgentModelRefForConfig(selected) : "";
	if (!modelRef || !parseInferenceRef(modelRef).model) return { error: `${params.label} does not expose a starter model for app-guided setup.` };
	const provider = params.defaultModel ? parseInferenceRef(normalizeAgentModelRefForConfig(params.defaultModel)).provider : params.providerId;
	if (normalizeProviderId(parseInferenceRef(modelRef).provider) !== normalizeProviderId(provider)) return { error: `${modelRef} is not compatible with the ${params.label} inference route.` };
	return modelRef;
}
//#endregion
export { validateSetupModelTarget as C, validateSetupInferenceOwnerEvidence as S, resolveToolFreeCliSetupError as _, SetupInferenceCancelledError as a, toProviderAutoSetupKind as b, mapFailoverReasonToSetupStatus as c, parseSavedAuthSetupProfileId as d, redactSetupInferenceError as f, resolveSetupModel as g, resolveSetupInferenceWorkspace as h, SetupInferenceActivationUnavailableError as i, parseInferenceRef as l, resolveSetupInferenceWinnerError as m, SETUP_INFERENCE_TEST_TIMEOUT_MS as n, SetupInferenceOwnerDriftError as o, resolveCandidatePresentation as p, SetupInferenceActivationIndeterminateError as r, invalidSetupConfigError as s, SETUP_INFERENCE_TEST_PROMPT as t, parseProviderAutoSetupChoiceId as u, setupInferenceLog as v, waitForProviderAuth as w, toSavedAuthSetupKind as x, throwIfSetupInferenceCancelled as y };
