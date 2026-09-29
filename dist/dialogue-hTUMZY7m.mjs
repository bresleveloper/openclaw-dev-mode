import { c as isInvalidConfigSetOperation, o as parseSystemAgentOperation, r as describeSystemAgentPersistentOperation } from "./operations-parse-B6VcQhEV.mjs";
import "./operations-BIpdn-VT.mjs";
import { t as SystemAgentInferenceUnavailableError } from "./inference-error-C-Vf2B5Y.mjs";
import { i as loadSystemAgentOverview } from "./overview-DJH3LymW.mjs";
import { a as resolveSystemAgentVerifiedInferenceRoute } from "./verified-inference-BKhGtG5v.mjs";
//#region src/system-agent/dialogue.ts
/** Format the interactive approval prompt for a persistent operation. */
function approvalQuestion(operation) {
	return `Apply this operation: ${describeSystemAgentPersistentOperation(operation)}?`;
}
/** Resolve user input to an OpenClaw operation, optionally using the assistant planner. */
async function resolveSystemAgentOperation(input, runtime, opts) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	const operation = parseSystemAgentOperation(input);
	if (!shouldAskAssistant(input, operation)) return operation;
	const overview = await (opts.loadOverview ?? loadSystemAgentOverview)();
	const planner = opts.planWithAssistant ?? (await import("./assistant-C5FJNnC_.mjs")).planSystemAgentCommand;
	let plan;
	try {
		plan = await planner({
			input,
			overview,
			verifiedInference: opts.verifiedInference
		});
		if (plan && !await resolveSystemAgentVerifiedInferenceRoute(opts.verifiedInference, opts.deps)) throw new SystemAgentInferenceUnavailableError("planner");
	} catch (error) {
		if (error instanceof SystemAgentInferenceUnavailableError) throw error;
		throw new SystemAgentInferenceUnavailableError("planner", [error]);
	}
	if (!plan) throw new SystemAgentInferenceUnavailableError("planner");
	if (!plan.command) {
		if (!plan.reply?.trim()) throw new SystemAgentInferenceUnavailableError("planner");
		runtime.log(plan.reply);
		return {
			kind: "none",
			message: ""
		};
	}
	const planned = parseSystemAgentOperation(plan.command);
	if (planned.kind === "none") throw new SystemAgentInferenceUnavailableError("planner");
	logAssistantPlan(runtime, plan, overview);
	return planned;
}
function shouldAskAssistant(input, operation) {
	if (operation.kind !== "none") return false;
	if (isInvalidConfigSetOperation(operation)) return false;
	const trimmed = input.trim().toLowerCase();
	if (!trimmed || trimmed === "quit" || trimmed === "exit") return false;
	return true;
}
function logAssistantPlan(runtime, plan, overview) {
	const modelLabel = plan.modelLabel ?? overview.defaultModel ?? "configured model";
	runtime.log(`[openclaw] planner: ${modelLabel}`);
	if (plan.reply) runtime.log(plan.reply);
	runtime.log(`[openclaw] interpreted: ${plan.command}`);
}
//#endregion
export { resolveSystemAgentOperation as n, approvalQuestion as t };
