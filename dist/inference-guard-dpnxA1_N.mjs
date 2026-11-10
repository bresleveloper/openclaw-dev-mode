import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { a as resolveSystemAgentVerifiedInferenceRoute } from "./verified-inference-DGxbE23j.mjs";
//#region src/system-agent/inference-error.ts
const INFERENCE_GUIDANCE = {
	setup: "OpenClaw could not reach working inference. Run `openclaw onboard` on the machine running OpenClaw to reconnect — it live-tests the route before saving it. Then try again.",
	retry: "The inference request failed or returned no usable reply. Try again; if it persists, check the model runtime logs.",
	timeout: "The inference request timed out. Try again; if it persists, check the model runtime and its timeout settings.",
	superseded: "The inference runtime was superseded during this turn. Try again after the current runtime settles.",
	"runtime-unavailable": "The prepared inference runtime became unavailable or was superseded during this turn. Try again; if it persists, check the model runtime logs.",
	"route-changed": "The verified inference route changed or could not be reverified during this turn. Start a new OpenClaw conversation to verify the current route.",
	"compatible-route": "The configured CLI runtime cannot enforce OpenClaw's tool restrictions. Select a compatible model/runtime route and try again."
};
const INFERENCE_FAILURE_SUMMARY_MAX_CHARS = 300;
function inferenceUnavailableMessage(failures, guidance) {
	const detail = failures.length > 0 ? formatErrorMessage(failures[0]).trim() : "";
	if (!detail) return INFERENCE_GUIDANCE[guidance];
	const summary = detail.length > INFERENCE_FAILURE_SUMMARY_MAX_CHARS ? `${truncateUtf16Safe(detail, 299)}…` : detail;
	return `${INFERENCE_GUIDANCE[guidance]} Cause: ${summary}`;
}
/** Safe public error for an OpenClaw turn that could not complete with intelligence. */
var SystemAgentInferenceUnavailableError = class extends Error {
	constructor(stage, failures = [], guidance = stage === "conversation" ? "setup" : "retry") {
		super(inferenceUnavailableMessage(failures, guidance));
		this.stage = stage;
		this.failures = failures;
		this.code = "SYSTEM_AGENT_INFERENCE_UNAVAILABLE";
		this.name = "SystemAgentInferenceUnavailableError";
	}
};
function isSystemAgentInferenceUnavailableError(error) {
	return error instanceof SystemAgentInferenceUnavailableError || error instanceof Error && "code" in error && error.code === "SYSTEM_AGENT_INFERENCE_UNAVAILABLE";
}
//#endregion
//#region src/system-agent/inference-guard.ts
/** The host retains error presentation and conversation cleanup at the write boundary. */
async function requireSystemAgentPersistentApplyInference(params, onUnavailable) {
	if (!params.binding) throw new SystemAgentInferenceUnavailableError("conversation");
	try {
		const { resolvePersistentApplyInference } = await import("./system-agent/setup-inference.js");
		const route = await resolvePersistentApplyInference(params);
		if (route) return route;
	} catch (error) {
		return onUnavailable([error]);
	}
	return onUnavailable([]);
}
/** Read guards share failure classification; the conversation retains cleanup ownership. */
async function requireSystemAgentInferenceRoute(binding, deps, stage, onUnavailable) {
	let failures = [];
	if (binding) try {
		const route = await resolveSystemAgentVerifiedInferenceRoute(binding, deps);
		if (route) return route;
	} catch (error) {
		failures = [error];
	}
	onUnavailable?.(failures);
	throw new SystemAgentInferenceUnavailableError(stage, failures, binding ? "route-changed" : "setup");
}
//#endregion
export { isSystemAgentInferenceUnavailableError as i, requireSystemAgentPersistentApplyInference as n, SystemAgentInferenceUnavailableError as r, requireSystemAgentInferenceRoute as t };
