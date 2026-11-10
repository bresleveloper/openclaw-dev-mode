import { t as createStatusGatewayProbeBudget } from "./status.gateway-probe-budget-DyNYY-tA.mjs";
import { n as runStatusJsonCommand } from "./status-json-command-C9w2GBcw.mjs";
//#region src/commands/status-json.ts
/** Runs status JSON with the standard fast scan and all-mode security audit behavior. */
async function statusJsonCommand(opts, runtime) {
	await runStatusJsonCommand({
		opts: {
			...opts,
			...createStatusGatewayProbeBudget(opts.timeoutMs)
		},
		runtime
	});
}
//#endregion
export { statusJsonCommand };
