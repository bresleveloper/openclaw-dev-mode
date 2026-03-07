import "./paths-BJV7vkaX.js";
import { m as theme } from "./globals-BozXJ-QJ.js";
import "./utils-BzWe_IKB.js";
import "./thinking-BYwvlJ3S.js";
import "./agent-scope-BJ-A8vSB.js";
import { d as defaultRuntime } from "./subsystem-DEHxNIeh.js";
import "./openclaw-root-pxEnyCPl.js";
import "./logger-CybQ0xau.js";
import "./exec-BpxsjP05.js";
import "./model-selection-CX4C7NZp.js";
import "./github-copilot-token-BQoM_VEX.js";
import "./boolean-D8Ha5nYV.js";
import "./env-ZTsIDHVm.js";
import "./host-env-security-8lfqCQOD.js";
import "./runtime-overrides-CzZbXh6c.js";
import "./registry-CAMKAMjq.js";
import "./manifest-registry-CWvKZnOp.js";
import "./dock-Comp2gJ6.js";
import "./message-channel-DQep2kbh.js";
import "./plugins-C0pOwMtf.js";
import "./sessions-HiopsrVS.js";
import "./pi-embedded-helpers-CVA4fQUQ.js";
import "./sandbox-CoGpmvXW.js";
import "./tool-catalog-DE9Q8xiB.js";
import "./chrome-tXGLEhE5.js";
import "./tailscale-Cb--SHEE.js";
import "./tailnet-CjKuOt5U.js";
import "./ws-BeoXlzsZ.js";
import "./auth-32YLiXaF.js";
import "./server-context-CpZq_krd.js";
import "./frontmatter-BNgDHC-E.js";
import "./env-overrides-Dsk7pgN4.js";
import "./path-alias-guards-C7fuvY3a.js";
import "./skills-C12GSy0o.js";
import "./paths-Ds-H_wj4.js";
import "./redact-BuHVrHGi.js";
import "./errors-lgWRdCyT.js";
import "./fs-safe-ByGe0qYX.js";
import "./proxy-env-Ce3yMsLG.js";
import "./image-ops-CVsEAuQZ.js";
import "./store-BCGAnbcB.js";
import "./ports-BFNjqMt6.js";
import "./trash-kZ6uvO8p.js";
import "./server-middleware-Cel4wU9c.js";
import "./accounts-82c5Tbng.js";
import "./accounts-CvmhVLij.js";
import "./logging-T8IDvLh2.js";
import "./accounts-CoSHDMaf.js";
import "./paths-CrgdtCHd.js";
import "./chat-envelope-DyXtQzoD.js";
import "./tool-images-BkNIdbzz.js";
import "./tool-display-C6selhgh.js";
import "./commands-Bf8GhDBS.js";
import "./commands-registry-BcRgECpc.js";
import "./client-CaaDgxx2.js";
import "./call-Ch1eylWu.js";
import "./pairing-token-BiCaqjaN.js";
import { t as formatDocsLink } from "./links-D4VD_bBP.js";
import { t as parseTimeoutMs } from "./parse-timeout-BnVgoHHO.js";
import "./resolve-configured-secret-input-string-B6cdvR9e.js";
import { t as runTui } from "./tui-C4oX1rrU.js";
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
