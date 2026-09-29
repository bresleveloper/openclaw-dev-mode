import { t as createStatusGatewayProbeBudget } from "./status.gateway-probe-budget-DkP8SzQT.mjs";
import { n as runStatusJsonCommand } from "./status-json-command-HYz4j3Aa.mjs";
import { t as scanStatusJsonFast } from "./status.scan.fast-json-DgVH6hB5.mjs";
//#region src/commands/status-json.ts
/** Runs status JSON with the standard fast scan and all-mode security audit behavior. */
async function statusJsonCommand(opts, runtime) {
	await runStatusJsonCommand({
		opts: {
			...opts,
			...createStatusGatewayProbeBudget(opts.timeoutMs)
		},
		runtime,
		scanStatusJsonFast,
		includeSecurityAudit: opts.all === true || opts.deep === true,
		includePluginCompatibility: opts.all === true,
		suppressHealthErrors: true
	});
}
//#endregion
export { statusJsonCommand };
