import { o as measureDiagnosticsTimelineSpan } from "./diagnostics-timeline-DxQ8TaVy.mjs";
//#region src/agents/startup-timing.ts
/** Measures local agent startup work before the canonical provider-preparation spans begin. */
function measureAgentStartup(stage, run, options = {}) {
	return measureDiagnosticsTimelineSpan("agent.startup", run, {
		config: options.config,
		env: options.env,
		phase: "agent.startup",
		attributes: { stage }
	});
}
//#endregion
export { measureAgentStartup as t };
