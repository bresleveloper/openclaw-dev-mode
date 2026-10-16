import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { n as runCommandWithRuntime } from "./cli-utils-ClVfZRCr.mjs";
//#region src/cli/capability-cli/output.ts
function emitJsonOrText(runtime, json, value, textFormatter) {
	if (json) {
		writeRuntimeJson(runtime, value);
		return;
	}
	runtime.log(textFormatter(value));
}
function formatEnvelopeForText(envelope) {
	if (!envelope.ok) return `${envelope.capability} failed: ${envelope.error ?? "unknown error"}`;
	const lines = [
		`${envelope.capability} via ${envelope.transport}`,
		...envelope.provider ? [`provider: ${envelope.provider}`] : [],
		...envelope.model ? [`model: ${envelope.model}`] : [],
		...envelope.ignoredOverrides && envelope.ignoredOverrides.length > 0 ? [`ignoredOverrides: ${JSON.stringify(envelope.ignoredOverrides)}`] : [],
		`outputs: ${String(envelope.outputs.length)}`
	];
	for (const output of envelope.outputs) {
		const pathValue = typeof output.path === "string" ? output.path : void 0;
		const textValue = typeof output.text === "string" ? output.text : void 0;
		if (envelope.capability === "embedding.create" && Array.isArray(output.embedding)) {
			const preview = output.embedding.slice(0, 8).join(", ");
			lines.push(textValue ?? "", `dimensions: ${String(output.dimensions)}`, `embedding: [${preview}${output.embedding.length > 8 ? ", ..." : ""}]`);
			continue;
		}
		if (pathValue || textValue) lines.push(...[pathValue, textValue].filter((entry) => Boolean(entry)));
		else lines.push(JSON.stringify(output));
	}
	return lines.join("\n");
}
function providerSummaryText(providers) {
	return providers.map((entry) => JSON.stringify(entry)).join("\n") || "No results found.";
}
//#endregion
//#region src/cli/capability-cli/providers-command.ts
function runCapabilityCommand(json, format, run) {
	return runCommandWithRuntime(defaultRuntime, async () => {
		emitJsonOrText(defaultRuntime, Boolean(json), await run(), format ?? ((value) => JSON.stringify(value, null, 2)));
	});
}
function registerLocalProvidersCommand(parent, description, collect, format) {
	parent.command("providers").description(description).option("--agent <id>", "Agent whose provider state should be inspected").option("--json", "Output JSON", false).action((opts, command) => runCapabilityCommand(opts.json, format, async () => {
		const { getRuntimeConfig } = await import("./config/config.js");
		const { resolveCapabilityProviderAgentId, resolveCapabilityAgentOption } = await import("./shared-DGHyWmnS.mjs");
		const cfg = getRuntimeConfig();
		return collect(cfg, resolveCapabilityProviderAgentId(cfg, resolveCapabilityAgentOption(command, opts.agent)));
	}));
}
//#endregion
export { providerSummaryText as a, formatEnvelopeForText as i, runCapabilityCommand as n, emitJsonOrText as r, registerLocalProvidersCommand as t };
