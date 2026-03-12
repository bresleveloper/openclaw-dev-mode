import "./paths-BJV7vkaX.js";
import { m as theme } from "./globals-BozXJ-QJ.js";
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
import "./tool-display-sVkRN5IQ.js";
import "./commands-DJcqkLzs.js";
import "./commands-registry-C6-Sw-9S.js";
import "./call-CGmUC45G.js";
import { t as parseTimeoutMs } from "./parse-timeout-epdDCTgw.js";
import { t as formatDocsLink } from "./links-Kt0rFq9G.js";
import { t as runTui } from "./tui-D1piHteH.js";
//#region src/cli/tui-cli.ts
function registerTuiCli(program) {
	program.command("tui").description("Open a terminal UI connected to the Gateway").option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--password <password>", "Gateway password (if required)").option("--session <key>", "Session key (default: \"main\", or \"global\" when scope is global)").option("--deliver", "Deliver assistant replies", false).option("--thinking <level>", "Thinking level override").option("--message <text>", "Send an initial message after connecting").option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)").option("--history-limit <n>", "History entries to load", "200").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/tui", "docs.openclaw.ai/cli/tui")}\n`).action(async (opts) => {
		try {
			const timeoutMs = parseTimeoutMs(opts.timeoutMs);
			if (opts.timeoutMs !== void 0 && timeoutMs === void 0) defaultRuntime.error(`warning: invalid --timeout-ms "${String(opts.timeoutMs)}"; ignoring`);
			const historyLimit = Number.parseInt(String(opts.historyLimit ?? "200"), 10);
			await runTui({
				url: opts.url,
				token: opts.token,
				password: opts.password,
				session: opts.session,
				deliver: Boolean(opts.deliver),
				thinking: opts.thinking,
				message: opts.message,
				timeoutMs,
				historyLimit: Number.isNaN(historyLimit) ? void 0 : historyLimit
			});
		} catch (err) {
			defaultRuntime.error(String(err));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerTuiCli };
