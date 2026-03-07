import { m as theme } from "./globals-DtwqVhkV.js";
import "./paths-BfR2LXbA.js";
import { d as defaultRuntime } from "./subsystem-D-lLN9nd.js";
import "./boolean-DTgd5CzD.js";
import "./auth-profiles-gyYFUuWS.js";
import "./agent-scope-Cp0IkEKB.js";
import "./utils-DMInpDZe.js";
import "./openclaw-root-D_NGSHjv.js";
import "./logger-lJby90xW.js";
import "./exec-9-lXnoNH.js";
import "./github-copilot-token-CcBrBN3h.js";
import "./host-env-security-BnQcDbLl.js";
import "./version-Bxx5bg6l.js";
import "./runtime-overrides-BrDRV8AG.js";
import "./registry-XwiWGUVE.js";
import "./manifest-registry-DpwUhr6x.js";
import "./dock-DXYDVeNl.js";
import "./accounts-CCmToVwr.js";
import "./plugins-BlxnRrWB.js";
import "./logging-DE_Gv8EN.js";
import "./accounts-D9cGmSBd.js";
import "./image-ops-ChuMRt4V.js";
import "./message-channel-CBxyiPG1.js";
import "./pi-embedded-helpers-B5Fkq6oo.js";
import "./sandbox-D8HChyNU.js";
import "./tool-catalog-CFg6jrp9.js";
import "./chrome-C9-sDY0x.js";
import "./tailscale-DUAiX-L-.js";
import "./tailnet-_7OomAtX.js";
import "./ws-skc9U6x4.js";
import "./auth-yZ8XbKKh.js";
import "./server-context-3Ig2duxc.js";
import "./frontmatter-BXR2CPEl.js";
import "./env-overrides-0y0M3S6P.js";
import "./path-alias-guards-CNI693yM.js";
import "./skills-BNw7KbKP.js";
import "./paths-SRstzZpm.js";
import "./redact-DWAErDjv.js";
import "./errors-LFbAe3gQ.js";
import "./fs-safe-DmQzjIXC.js";
import "./proxy-env-BMOu-Lae.js";
import "./store-CEVnidlh.js";
import "./ports-B4ivsR6D.js";
import "./trash-sFfWaYz5.js";
import "./server-middleware-CNN87dgY.js";
import "./sessions-BzabF1Rs.js";
import "./accounts-B9MZJeQz.js";
import "./paths-m-ckvfYo.js";
import "./chat-envelope-BCgyDMmT.js";
import "./tool-images-DCz3azK8.js";
import "./thinking-WUzZvd36.js";
import "./tool-display-Cg06RH6E.js";
import "./commands-DTZsXlMV.js";
import "./commands-registry-D66o69fc.js";
import "./client-x1tOQWHk.js";
import "./call-CT_1cdY_.js";
import "./pairing-token-B2YLkyDu.js";
import { t as parseTimeoutMs } from "./parse-timeout-C6P5Ia6q.js";
import { t as formatDocsLink } from "./links-CPpbuTOP.js";
import "./resolve-configured-secret-input-string-3yotq78d.js";
import { t as runTui } from "./tui-CsX0Y6Ah.js";
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
