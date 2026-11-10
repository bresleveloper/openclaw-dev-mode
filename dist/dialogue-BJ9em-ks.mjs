import { l as isInvalidConfigSetOperation, o as parseSystemAgentOperation, r as describeSystemAgentPersistentOperation } from "./operations-parse-B9TfqALv.mjs";
import "./operations-6fJefeqF.mjs";
import { r as SystemAgentInferenceUnavailableError } from "./inference-guard-dpnxA1_N.mjs";
import { i as loadSystemAgentOverview } from "./overview-DFEP0f2_.mjs";
import { a as resolveSystemAgentVerifiedInferenceRoute } from "./verified-inference-DGxbE23j.mjs";
//#region src/system-agent/dialogue.ts
function approvalQuestion(operation) {
	return `Apply this operation: ${describeSystemAgentPersistentOperation(operation)}?`;
}
async function resolveSystemAgentOperation(input, runtime, opts) {
	if (!opts.verifiedInference) throw new SystemAgentInferenceUnavailableError("conversation");
	const operation = parseSystemAgentOperation(input);
	const trimmed = input.trim().toLowerCase();
	if (operation.kind !== "none" || isInvalidConfigSetOperation(operation) || !trimmed || trimmed === "quit" || trimmed === "exit") return operation;
	const overview = await (opts.loadOverview ?? loadSystemAgentOverview)();
	const planner = opts.planWithAssistant ?? (await import("./assistant-JuSD1SGm.mjs")).planSystemAgentCommand;
	let plan;
	try {
		plan = await planner({
			input,
			overview,
			verifiedInference: opts.verifiedInference
		});
		if (plan && !await resolveSystemAgentVerifiedInferenceRoute(opts.verifiedInference, opts.deps)) throw new SystemAgentInferenceUnavailableError("planner", [], "route-changed");
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
	const modelLabel = plan.modelLabel ?? overview.defaultModel ?? "configured model";
	runtime.log(`[openclaw] planner: ${modelLabel}`);
	if (plan.reply) runtime.log(plan.reply);
	runtime.log(`[openclaw] interpreted: ${plan.command}`);
	return planned;
}
//#endregion
export { resolveSystemAgentOperation as n, approvalQuestion as t };
