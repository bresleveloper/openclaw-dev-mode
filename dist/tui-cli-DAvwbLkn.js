import { m as theme } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { p as defaultRuntime } from "./subsystem-CkDRqDzV.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-CIqoN6FN.js";
import "./agent-scope-BAb0j1gt.js";
import "./utils-DMInpDZe.js";
import "./boundary-file-read-DM07oBuv.js";
import "./logger-GQFppKMT.js";
import "./exec-DDBrWr4H.js";
import "./github-copilot-token-B_S63apr.js";
import "./env-overrides-BD1bOZrq.js";
import "./version-BvA7WhZA.js";
import "./runtime-overrides-CGfXKBb_.js";
import "./registry-DznR2BDN.js";
import "./skills-DZCrHNdp.js";
import "./frontmatter-D1I3WE8J.js";
import "./plugins-CjLMQbHJ.js";
import "./windows-spawn-D2jCT_tt.js";
import "./redact-DnTfDLlu.js";
import "./path-alias-guards-BAfWVs88.js";
import "./errors-D6OHuY6d.js";
import "./paths-B52CESY4.js";
import "./chat-envelope-DZwp6OvC.js";
import "./tool-display-B4YdJGcN.js";
import "./commands-CwtsDdaQ.js";
import "./commands-registry-B6Tu3P-e.js";
import "./call-B28h9L2b.js";
import { t as parseTimeoutMs } from "./parse-timeout-m9LO7WBJ.js";
import { t as formatDocsLink } from "./links-y9BHyNI9.js";
import { t as runTui } from "./tui-BPo2BpR_.js";
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
