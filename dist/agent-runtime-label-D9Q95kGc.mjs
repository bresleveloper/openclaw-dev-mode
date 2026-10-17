import { c as normalizeOptionalLowercaseString, l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { n as sanitizeTerminalText } from "./safe-text-SY_CvCi3.mjs";
import { a as normalizeOptionalAgentRuntimeId, r as isDefaultAgentRuntimeId } from "./agent-runtime-id-BZLMe-UU.mjs";
import "./model-selection-D3_rVb38.mjs";
import { t as isCliProvider } from "./model-selection-cli-CtTygCpm.mjs";
import { h as resolveSessionPinnedHarnessId } from "./agent-harness-session-key-D8EQIzja.mjs";
//#region src/status/agent-runtime-label.ts
const AGENT_RUNTIME_LABELS = {
	openclaw: "OpenClaw Default",
	codex: "OpenAI Codex",
	"codex-cli": "OpenAI Codex",
	"claude-cli": "Claude CLI",
	"google-gemini-cli": "Gemini CLI"
};
/** Operator-facing name for a runtime id; a plugin-declared label wins over the raw id. */
function formatAgentRuntimeName(runtime, pluginLabel) {
	const id = runtime.trim().toLowerCase();
	const label = normalizeOptionalString(pluginLabel);
	return AGENT_RUNTIME_LABELS[id] ?? sanitizeTerminalText(label ?? runtime.trim());
}
function resolveAgentRuntimeLabel(args) {
	const acpAgentRaw = normalizeOptionalString(args.sessionEntry?.acp?.agent);
	const acpAgent = acpAgentRaw ? sanitizeTerminalText(acpAgentRaw) : void 0;
	if (acpAgent) {
		const backendRaw = normalizeOptionalString(args.sessionEntry?.acp?.backend);
		const backend = backendRaw ? sanitizeTerminalText(backendRaw) : void 0;
		return backend ? `${acpAgent} (acp/${backend})` : `${acpAgent} (acp)`;
	}
	const runtimeRaw = normalizeOptionalString(args.resolvedHarness);
	const runtime = normalizeOptionalLowercaseString(runtimeRaw);
	let label;
	if (runtime && runtime !== "auto" && runtime !== "default") label = formatAgentRuntimeName(runtimeRaw ?? runtime);
	else {
		const providerRaw = normalizeOptionalString(args.sessionEntry?.modelProvider) ?? normalizeOptionalString(args.sessionEntry?.providerOverride) ?? normalizeOptionalString(args.fallbackProvider);
		const provider = providerRaw ? sanitizeTerminalText(providerRaw) : void 0;
		const providerRuntime = normalizeOptionalLowercaseString(providerRaw);
		if (provider && (args.classifyCliProvider?.(provider) ?? isCliProvider(provider, args.config))) label = AGENT_RUNTIME_LABELS[providerRuntime ?? ""] ?? `${provider} (cli)`;
		else label = expectDefined(AGENT_RUNTIME_LABELS.openclaw, "OpenClaw runtime label");
	}
	const recordedRuntime = normalizeOptionalAgentRuntimeId(args.sessionEntry?.agentHarnessId);
	const recordedLabel = recordedRuntime ? formatAgentRuntimeName(recordedRuntime) : void 0;
	if (!recordedRuntime || isDefaultAgentRuntimeId(recordedRuntime) || recordedLabel === label) return label;
	const relationship = resolveSessionPinnedHarnessId(args.sessionEntry) ? "session pin" : "previous runtime";
	return `${label} (${relationship}: ${recordedLabel})`;
}
//#endregion
export { resolveAgentRuntimeLabel as n, formatAgentRuntimeName as t };
