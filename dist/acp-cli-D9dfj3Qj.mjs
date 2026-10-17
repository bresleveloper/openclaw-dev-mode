import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatErrorMessage } from "./errors-O33D01XW.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { t as normalizeAcpProvenanceMode } from "./types-CH9TQs-4.mjs";
import { t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import "./types-D_YxRLY4.mjs";
import { t as resolveGatewayAuthOptions } from "./gateway-secret-options-gmw_klfN.mjs";
//#region src/cli/acp-cli.ts
function registerAcpCli(program) {
	const acp = program.command("acp").description("Run an ACP bridge backed by the Gateway");
	acp.option("--url <url>", "Gateway WebSocket URL (defaults to gateway.remote.url when configured)").option("--token <token>", "Gateway token (if required)").option("--token-file <path>", "Read gateway token from file").option("--password <password>", "Gateway password (if required)").option("--password-file <path>", "Read gateway password from file").option("--session <key>", "Default session key (e.g. agent:main:main)").option("--session-label <label>", "Default session label to resolve").option("--require-existing", "Fail if the session key/label does not exist", false).option("--reset-session", "Reset the session key before first use", false).option("--no-prefix-cwd", "Do not prefix prompts with the working directory").option("--provenance <mode>", "ACP provenance mode: off, meta, or meta+receipt").option("-v, --verbose", "Verbose logging to stderr", false).addHelpText("after", () => formatDocsHelp("/cli/acp")).action(async (opts) => {
		try {
			const { gatewayToken, gatewayPassword } = resolveGatewayAuthOptions(opts);
			const provenanceMode = normalizeAcpProvenanceMode(opts.provenance);
			if (opts.provenance && !provenanceMode) throw new Error("Invalid --provenance. Use \"off\", \"meta\", or \"meta+receipt\".");
			const { serveAcpGateway } = await import("./server-BR20HBji.mjs");
			await serveAcpGateway({
				gatewayUrl: opts.url,
				gatewayToken,
				gatewayPassword,
				defaultSessionKey: opts.session,
				defaultSessionLabel: opts.sessionLabel,
				requireExistingSession: Boolean(opts.requireExisting),
				resetSession: Boolean(opts.resetSession),
				prefixCwd: opts.prefixCwd !== false,
				provenanceMode,
				verbose: Boolean(opts.verbose)
			});
		} catch (err) {
			defaultRuntime.error(`ACP bridge failed: ${formatErrorMessage(err)}`);
			defaultRuntime.exit(1);
		}
	});
	acp.command("client").description("Run an interactive ACP client against the local ACP bridge").option("--cwd <dir>", "Working directory for the ACP session").option("--server <command>", "ACP server command (default: openclaw)").option("--server-args <args...>", "Extra arguments for the ACP server").option("--server-verbose", "Enable verbose logging on the ACP server", false).option("-v, --verbose", "Verbose client logging", false).action(async (opts, command) => {
		const inheritedVerbose = inheritOptionFromParent(command, "verbose");
		try {
			const { runAcpClientInteractive } = await import("./client-8oF_-UN5.mjs");
			await runAcpClientInteractive({
				cwd: opts.cwd,
				serverCommand: opts.server,
				serverArgs: opts.serverArgs,
				serverVerbose: Boolean(opts.serverVerbose),
				verbose: Boolean(opts.verbose || inheritedVerbose)
			});
		} catch (err) {
			defaultRuntime.error(formatErrorMessage(err));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerAcpCli };
