import { a as measureGatewayBootstrapStep } from "./startup-trace-C4xndCPa.mjs";
//#region src/cli/command-startup-timing.ts
let diagnosticsTimelineModulePromise;
/** Measures command-specific work hidden inside Commander parse/action dispatch. */
async function measureCliCommandStartup(stage, run, options = {}) {
	const env = options.env ?? process.env;
	const tracedRun = stage.startsWith("doctor.config-preflight.") ? run : () => measureGatewayBootstrapStep(`cli.command.${stage}`, run);
	if (!env.OPENCLAW_DIAGNOSTICS_TIMELINE_PATH?.trim()) return await tracedRun();
	diagnosticsTimelineModulePromise ??= import("./diagnostics-timeline-iFJd0WBD.mjs");
	const { measureDiagnosticsTimelineSpan } = await diagnosticsTimelineModulePromise;
	return await measureDiagnosticsTimelineSpan("cli.command-startup", tracedRun, {
		config: options.config,
		env,
		phase: "cli.command-startup",
		attributes: { stage }
	});
}
//#endregion
export { measureCliCommandStartup as t };
