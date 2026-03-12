import "./paths-BJV7vkaX.js";
import { m as theme, t as danger } from "./globals-BozXJ-QJ.js";
import "./utils-BzWe_IKB.js";
import "./model-selection-BRhJAUKb.js";
import "./agent-scope-Dx6t10xJ.js";
import { p as defaultRuntime } from "./subsystem-NSiOA8hi.js";
import "./openclaw-root-BgG4cyU3.js";
import "./logger-CX3t1bKz.js";
import "./exec-B1lVds_y.js";
import "./github-copilot-token-BD0SJwml.js";
import "./boolean-B6zcAynR.js";
import "./env-ChlBW8C4.js";
import "./env-overrides-C_5dHP8H.js";
import "./runtime-overrides-BlDGW6c7.js";
import "./registry-Bwq7RDwU.js";
import "./skills-B5bzQ_n_.js";
import "./frontmatter-CNhVfaKz.js";
import "./plugins-7t5A5YJP.js";
import "./windows-spawn-BAKAvVI9.js";
import "./redact-DWSz2XT_.js";
import "./path-alias-guards-CbtFbGMl.js";
import "./errors-Cvi_W98b.js";
import "./paths-B3fM69Ic.js";
import "./chat-envelope-DUjyuML-.js";
import "./call-CGmUC45G.js";
import { t as formatDocsLink } from "./links-Kt0rFq9G.js";
import "./progress-DFpY5mr6.js";
import { n as callGatewayFromCli, t as addGatewayClientOptions } from "./gateway-rpc-Cgeph-5i.js";
//#region src/cli/system-cli.ts
const normalizeWakeMode = (raw) => {
	const mode = typeof raw === "string" ? raw.trim() : "";
	if (!mode) return "next-heartbeat";
	if (mode === "now" || mode === "next-heartbeat") return mode;
	throw new Error("--mode must be now or next-heartbeat");
};
async function runSystemGatewayCommand(opts, action, successText) {
	try {
		const result = await action();
		if (opts.json || successText === void 0) defaultRuntime.log(JSON.stringify(result, null, 2));
		else defaultRuntime.log(successText);
	} catch (err) {
		defaultRuntime.error(danger(String(err)));
		defaultRuntime.exit(1);
	}
}
function registerSystemCli(program) {
	const system = program.command("system").description("System tools (events, heartbeat, presence)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/system", "docs.openclaw.ai/cli/system")}\n`);
	addGatewayClientOptions(system.command("event").description("Enqueue a system event and optionally trigger a heartbeat").requiredOption("--text <text>", "System event text").option("--mode <mode>", "Wake mode (now|next-heartbeat)", "next-heartbeat").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			const text = typeof opts.text === "string" ? opts.text.trim() : "";
			if (!text) throw new Error("--text is required");
			return await callGatewayFromCli("wake", opts, {
				mode: normalizeWakeMode(opts.mode),
				text
			}, { expectFinal: false });
		}, "ok");
	});
	const heartbeat = system.command("heartbeat").description("Heartbeat controls");
	addGatewayClientOptions(heartbeat.command("last").description("Show the last heartbeat event").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("last-heartbeat", opts, void 0, { expectFinal: false });
		});
	});
	addGatewayClientOptions(heartbeat.command("enable").description("Enable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("set-heartbeats", opts, { enabled: true }, { expectFinal: false });
		});
	});
	addGatewayClientOptions(heartbeat.command("disable").description("Disable heartbeats").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("set-heartbeats", opts, { enabled: false }, { expectFinal: false });
		});
	});
	addGatewayClientOptions(system.command("presence").description("List system presence entries").option("--json", "Output JSON", false)).action(async (opts) => {
		await runSystemGatewayCommand(opts, async () => {
			return await callGatewayFromCli("system-presence", opts, void 0, { expectFinal: false });
		});
	});
}
//#endregion
export { registerSystemCli };
