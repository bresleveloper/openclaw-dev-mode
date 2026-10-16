import { Et as _enum, Fn as object, Jn as string } from "./schemas-BOYIvvln.mjs";
import { n as truncateUtf8Suffix } from "./utf8-truncate-_hf7tp13.mjs";
import { c as redactSupportString } from "./diagnostic-support-redaction-C72A4r6A.mjs";
//#region src/infra/update-repair-turn.ts
const resultLineSchema = object({
	status: _enum([
		"fixed",
		"partial",
		"not-fixed"
	]),
	summary: string().max(1024)
});
function repairSummary(text, target) {
	const lastLine = text.trim().split(/\r?\n/u).at(-1) ?? "";
	let summary = text.trim() || "The agent returned no repair result.";
	if (lastLine.startsWith("REPAIR_RESULT:")) try {
		const parsed = resultLineSchema.safeParse(JSON.parse(lastLine.slice(14)));
		if (parsed.success) summary = parsed.data.summary;
	} catch {}
	const redacted = redactSupportString(summary, {
		env: process.env,
		stateDir: target.stateDir
	}, { maxLength: Number.MAX_SAFE_INTEGER });
	return truncateUtf8Suffix(redacted, 1024);
}
async function runLocalUpdateRepairTurn(params) {
	const runtime = await import("./update-repair-agent.runtime.js");
	const outcome = await runtime.withUpdateRepairEnvironment(params.target, () => runtime.runUpdateRepairTurn(params));
	if (outcome.status === "unavailable") return outcome;
	return {
		status: "completed",
		model: outcome.envelope.model ?? params.route.model,
		provider: outcome.envelope.provider ?? params.route.provider,
		toolCalls: outcome.toolCalls,
		summary: repairSummary(outcome.envelope.final || outcome.envelope.error?.message || "", params.target),
		timedOut: outcome.envelope.status === "timeout"
	};
}
//#endregion
export { runLocalUpdateRepairTurn as n, repairSummary as t };
