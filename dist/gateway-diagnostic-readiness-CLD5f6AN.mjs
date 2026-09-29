import { a as writeRuntimeJson } from "./runtime-BC29JSZp.mjs";
import { n as sanitizeTerminalText } from "./safe-text-CBmKtmbt.mjs";
import { a as buildGatewayProbeConnectionDetails } from "./call-C_MP4_Gs.mjs";
import { t as GatewayTransportError } from "./transport-error-C-c71VUr.mjs";
import { r as DEFAULT_RESTART_HEALTH_TIMEOUT_MS } from "./restart-health.constants-BnbTHsGr.mjs";
import { t as waitForGatewayDiagnosticReadiness } from "./diagnostic-readiness-D3NkN8y9.mjs";
//#region src/commands/gateway-diagnostic-readiness.ts
/** Keep startup progress separate from terminal diagnostic failure. */
async function waitForGatewayDiagnostic(opts, runtime) {
	const timeoutMs = opts.timeoutMs ?? DEFAULT_RESTART_HEALTH_TIMEOUT_MS;
	const startedAtMs = performance.now();
	const deadlineMs = Math.min(opts.deadlineMs ?? Infinity, startedAtMs + timeoutMs);
	const readiness = await waitForGatewayDiagnosticReadiness({
		...opts,
		deadlineMs,
		onProgress: (phase) => {
			if (!opts.json) runtime.log(`Gateway is still starting (phase: ${sanitizeTerminalText(phase)}).`);
		}
	});
	const remainingMs = Math.max(0, Math.ceil(deadlineMs - performance.now()));
	if (remainingMs > 0 && (!readiness || readiness.healthy || readiness.waitOutcome === "channel-errors" || readiness.waitOutcome === "plugin-errors")) return remainingMs;
	if (readiness?.waitOutcome === "still-starting") {
		if (opts.json) writeRuntimeJson(runtime, {
			status: "starting",
			startupPhase: readiness.startupPhase
		});
		return;
	}
	throw new GatewayTransportError({
		kind: "timeout",
		timeoutMs,
		connectionDetails: await buildGatewayProbeConnectionDetails(opts),
		message: `${!readiness || readiness.healthy ? "Gateway diagnostic budget exhausted" : "Gateway not reachable"} after waiting ${Math.round((performance.now() - startedAtMs) / 1e3)} s.\n${sanitizeTerminalText(readiness?.probeError ?? readiness?.startupPhase ?? "Readiness could not be confirmed.")}\nRun openclaw gateway status --deep to diagnose.`
	});
}
//#endregion
export { waitForGatewayDiagnostic as t };
