import { agentHarnessStructuredInput } from "openclaw/plugin-sdk/agent-harness-runtime";
//#region extensions/codex/src/app-server/elicitation-input.ts
/** Compiles a validated Codex input snapshot before it enters the per-turn queue. */
function compileCodexOrdinaryElicitation(params) {
	const requestTurnId = readValue(params.snapshot, "turnId");
	if (typeof requestTurnId === "string" && requestTurnId !== params.turnId) return { kind: "ignored" };
	if (requestTurnId !== null && typeof requestTurnId !== "string") return {
		kind: "compiled",
		input: {
			kind: "unsupported",
			message: "OpenClaw declined an MCP elicitation with invalid turn correlation."
		}
	};
	const mode = readCodexElicitationString(params.snapshot, "mode");
	if (mode === "url") return {
		kind: "compiled",
		input: agentHarnessStructuredInput.compileUrl({
			url: readValue(params.snapshot, "url"),
			elicitationId: readValue(params.snapshot, "elicitationId"),
			message: readValue(params.snapshot, "message"),
			fallbackMessage: "Codex provided a URL",
			protocolName: "MCP"
		})
	};
	if (mode !== "form" && mode !== "openai/form") return {
		kind: "compiled",
		input: {
			kind: "unsupported",
			message: `OpenClaw does not support MCP elicitation mode ${JSON.stringify(mode ?? "unknown")}.`
		}
	};
	return {
		kind: "compiled",
		input: agentHarnessStructuredInput.compileForm({
			schema: readValue(params.snapshot, "requestedSchema"),
			message: readCodexElicitationString(params.snapshot, "message"),
			fallbackMessage: "Codex needs input",
			options: {
				protocolName: mode === "openai/form" ? "OpenAI" : "MCP",
				allowEmptyForm: true,
				minimumChoiceCount: 1,
				allowEnumNames: true,
				allowImagePicker: mode === "openai/form",
				metadata: { secretPath: ["isSecret"] }
			}
		})
	};
}
function readValue(record, key) {
	return Object.hasOwn(record, key) ? record[key] : void 0;
}
function readCodexElicitationString(record, key) {
	const value = readValue(record, key);
	return typeof value === "string" ? value : void 0;
}
//#endregion
export { compileCodexOrdinaryElicitation };
