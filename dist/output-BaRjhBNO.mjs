import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
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
		if (pathValue || textValue) lines.push(...[pathValue, textValue].filter((entry) => Boolean(entry)));
		else lines.push(JSON.stringify(output));
	}
	return lines.join("\n");
}
function providerSummaryText(providers) {
	return providers.map((entry) => JSON.stringify(entry)).join("\n") || "No results found.";
}
//#endregion
export { formatEnvelopeForText as n, providerSummaryText as r, emitJsonOrText as t };
