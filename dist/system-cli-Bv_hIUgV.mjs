import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { S as isSystemMachineOutput } from "./argv-C7hqFLn5.mjs";
import { r as defaultRuntime } from "./runtime-BazLsT0s.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as formatCliCommand } from "./command-format-CYoE8cOC.mjs";
import { t as danger } from "./globals-XVSoVbNQ.mjs";
import { l as rethrowExpectedCliError, r as formatCliJsonFailure } from "./failure-output-CpIKhMiV.mjs";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-Wcwajg7Y.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { n as setCommandJsonMode } from "./json-mode-BIqJ-P-D.mjs";
//#region src/cli/system-cli.ts
async function runSystemGatewayCommand(opts, action, successText) {
	const machineOutput = opts.json || successText === void 0;
	try {
		const result = await action();
		if (machineOutput) defaultRuntime.writeJson(result);
		else defaultRuntime.log(successText);
	} catch (err) {
		rethrowExpectedCliError(err);
		const message = formatErrorMessage(err);
		if (machineOutput) defaultRuntime.writeJson(formatCliJsonFailure(message));
		else defaultRuntime.error(danger(message));
		defaultRuntime.exit(1);
	}
}
/** Register Gateway-backed system event, heartbeat, and presence commands. */
function registerSystemCli(program) {
	const system = program.command("system").description("System tools (events, heartbeat, presence)").addHelpText("after", () => formatDocsHelp("/cli/system"));
	setCommandJsonMode(system, "output", ({ argv }) => isSystemMachineOutput(argv));
	addGatewayClientOptions(system.command("event").description("Enqueue a system event and optionally trigger a heartbeat").requiredOption("--text <text>", "System event text").option("--mode <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat").option("--session-key <sessionKey>", "Target a specific session for the event (defaults to the agent's main session)").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			const text = normalizeOptionalString(opts.text) ?? "";
			if (!text) throw new Error(`--text is required. Example: ${formatCliCommand("openclaw system event --text \"deploy finished\"")}.`);
			const mode = normalizeOptionalString(opts.mode) ?? "next-heartbeat";
			if (mode !== "now" && mode !== "next-heartbeat") throw new Error("--mode must be now or next-heartbeat");
			const sessionKey = normalizeOptionalString(opts.sessionKey);
			const result = await callGatewayFromCli("wake", opts, sessionKey ? {
				mode,
				text,
				sessionKey
			} : {
				mode,
				text
			}, { expectFinal: false });
			if (typeof result === "object" && result !== null && "ok" in result && !result.ok) {
				const reason = "reason" in result && typeof result.reason === "string" ? result.reason : "Gateway did not accept the system event";
				throw new Error(reason);
			}
			return result;
		}, "ok");
	});
	const heartbeat = system.command("heartbeat").description("Heartbeat controls");
	for (const [parent, name, description, method, params] of [
		[
			heartbeat,
			"last",
			"Show the last heartbeat event",
			"last-heartbeat",
			void 0
		],
		[
			heartbeat,
			"enable",
			"Enable heartbeats",
			"set-heartbeats",
			{ enabled: true }
		],
		[
			heartbeat,
			"disable",
			"Disable heartbeats",
			"set-heartbeats",
			{ enabled: false }
		],
		[
			system,
			"presence",
			"List system presence entries",
			"system-presence",
			void 0
		]
	]) addGatewayClientOptions(parent.command(name).description(description).option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, () => callGatewayFromCli(method, opts, params, { expectFinal: false }));
	});
}
//#endregion
export { registerSystemCli };
