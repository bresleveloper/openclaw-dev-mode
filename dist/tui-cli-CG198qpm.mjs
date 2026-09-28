import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { t as CHAT_HISTORY_MAX_ENTRIES } from "./chat-history-constants-C-H8nkgi.mjs";
import { t as parseTimeoutMs } from "./parse-timeout-G1LpD3Dj.mjs";
import { n as resolveSessionTarget } from "./session-target-BHApc4OB.mjs";
import { t as addTuiOptions } from "./tui-cli-options-5C6_KTVs.mjs";
//#region src/cli/tui-cli.ts
async function runTuiCliAction(target, opts, invokedSubcommand = "tui") {
	const invokedAsLocalAlias = invokedSubcommand === "terminal" || invokedSubcommand === "chat";
	const isLocal = Boolean(opts.local) || invokedAsLocalAlias;
	if (target && isLocal) throw new Error("a session target cannot be combined with --local, openclaw chat, or openclaw terminal");
	if (isLocal && (opts.url || opts.token || opts.password || opts.tlsFingerprint)) throw new Error("--local cannot be combined with --url, --token, --password, or --tls-fingerprint");
	if (target && opts.session) throw new Error("pass one session target: use either the positional target or --session");
	const timeoutMs = parseTimeoutMs(opts.timeoutMs);
	if (opts.timeoutMs !== void 0 && timeoutMs === void 0) defaultRuntime.error(`warning: invalid --timeout-ms "${opts.timeoutMs}"; ignoring`);
	const historyLimit = parseStrictPositiveInteger(opts.historyLimit ?? "200");
	if (historyLimit === void 0) throw new Error("--history-limit must be a positive integer.");
	if (!isLocal && historyLimit > 1e3) throw new Error(`--history-limit must be at most ${CHAT_HISTORY_MAX_ENTRIES}.`);
	const resolved = target ? await resolveSessionTarget({
		raw: target,
		requiredScope: "operator.admin",
		gateway: {
			url: opts.url,
			token: opts.token,
			password: opts.password,
			tlsFingerprint: opts.tlsFingerprint
		}
	}) : void 0;
	const { runTui } = await import("./tui-DLSRIP9m.mjs");
	await runTui({
		local: isLocal,
		...resolved?.gateway.url ? { boundGateway: {
			url: resolved.gateway.url,
			token: resolved.gateway.token,
			password: resolved.gateway.password,
			tlsFingerprint: resolved.gateway.tlsFingerprint
		} } : {
			url: opts.url,
			token: opts.token,
			password: opts.password,
			tlsFingerprint: opts.tlsFingerprint
		},
		session: resolved?.sessionKey ?? opts.session,
		...resolved ? { agentId: resolved.agentId } : {},
		deliver: Boolean(opts.deliver),
		thinking: opts.thinking,
		message: opts.message,
		timeoutMs,
		historyLimit,
		forceProcessExitOnReturn: true
	});
}
/** Attach the `tui` command plus its `terminal`/`chat` aliases to the root CLI. */
function registerTuiCli(program) {
	const command = program.command("tui").alias("terminal").alias("chat").description("Open a terminal UI connected to the Gateway").argument("[target]", "Control UI URL, host/agent/ref, short ref, or agent:... key").option("--local", "Run against the local embedded agent runtime", false);
	addTuiOptions(command).option("--session <key>", "Session key (default: \"main\", or \"global\" when scope is global)").option("--deliver", "Deliver assistant replies", false).option("--thinking <level>", "Thinking level override").option("--message <text>", "Send an initial message after connecting").option("--timeout-ms <ms>", "Agent timeout in ms (defaults to agents.defaults.timeoutSeconds)").option("--history-limit <n>", "History entries to load", "200").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/tui", "docs.openclaw.ai/cli/tui")}\n`).action(async (target, opts, cmd) => {
		try {
			const invokedSubcommand = cmd.parent?.args[0];
			await runTuiCliAction(target, opts, invokedSubcommand);
		} catch (err) {
			defaultRuntime.error(formatErrorMessage(err));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerTuiCli, runTuiCliAction };
