import { a as writeRuntimeJson, r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { n as inheritOptionFromParent } from "./command-options-BDuSHeWG.mjs";
import { r as formatInvalidPortOption } from "./error-format-B21fL1a_.mjs";
import { s as publicKeyRawBase64UrlFromPem } from "./device-identity-B_zMrBd6.mjs";
import { t as loadDeviceIdentityIfPresentAsync } from "./device-identity-async-CB1i57hb.mjs";
import { n as createNodeWorkerCommand, t as addNodeCommandOptions } from "./command-options-5SoYNuSl.mjs";
import { a as loadNodeHostConfig } from "./config-DLlmgxee.mjs";
import { t as formatHelpExamples } from "./help-format-Ctl5AOqy.mjs";
import { n as resolveNodePairGatewayOptions, t as resolveNodeGatewayOptions } from "./gateway-options-CQ_n8bsS.mjs";
import { Option } from "commander";
//#region src/cli/node-cli/identity.ts
/**
* Read-only by design: the SSH-verified pairing probe calls this remotely and
* must never mint a fresh identity on a host that has not run the node host.
*/
async function runNodeIdentityShow(opts) {
	const identity = await loadDeviceIdentityIfPresentAsync();
	if (!identity) {
		defaultRuntime.error("no node device identity found (start the node host once with `openclaw node run` or `openclaw node install`)");
		defaultRuntime.exit(1);
		return;
	}
	const payload = {
		deviceId: identity.deviceId,
		publicKey: publicKeyRawBase64UrlFromPem(identity.publicKeyPem)
	};
	if (opts.json) {
		writeRuntimeJson(defaultRuntime, payload, 0);
		return;
	}
	defaultRuntime.log(`deviceId:  ${payload.deviceId}`);
	defaultRuntime.log(`publicKey: ${payload.publicKey}`);
}
//#endregion
//#region src/cli/node-cli/register.ts
function registerNodeCli(program) {
	const node = addNodeCommandOptions(program.command("node").description("Run and manage the headless node host service")).addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw node run --host 127.0.0.1 --port 18789", "Run the node host in the foreground."],
		["openclaw node status", "Check node host service status."],
		["openclaw node install", "Install the node host service."],
		["openclaw node start", "Start the installed node host service."],
		["openclaw node restart", "Restart the installed node host service."]
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/node", "docs.openclaw.ai/cli/node")}\n`);
	node.addCommand(createNodeWorkerCommand().action(async (opts) => {
		const { runNodeHostWorker } = await import("./worker-CNe8XkyD.mjs");
		await runNodeHostWorker({ desktopSharingEnabled: opts.desktopSharing });
	}), { hidden: true });
	addNodeCommandOptions(node.command("run").description("Run the headless node host (foreground)")).option("--pair <code-or-url>", "Pair with a setup code or oc-pair URL; explicit gateway flags take precedence").addOption(new Option("--pair-if-needed <code-or-url>", "Use the saved device token when available; otherwise pair with this setup code").conflicts("pair")).option("--host <host>", "Gateway host").option("--port <port>", "Gateway port").option("--context-path <path>", "Gateway WebSocket context path (e.g. /openclaw-gw)").option("--tls", "Use TLS for the gateway connection").option("--no-tls", "Disable TLS for the gateway connection").option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)").option("--node-id <id>", "Override the generated node instance id").option("--display-name <name>", "Override node display name").option("--session-host", "Host worker sessions for this foreground process").addOption(new Option("--ephemeral").hideHelp()).addOption(new Option("--desktop-sharing").hideHelp()).addOption(new Option("--no-desktop-sharing").hideHelp()).addOption(new Option("--auth-from-env").hideHelp()).addOption(new Option("--parent-stdin").hideHelp()).option("--share-installed-apps", "Share installed macOS applications with the Gateway").option("--no-share-installed-apps", "Disable installed application sharing").action(async (opts, command) => {
		let pair;
		let gatewayOptions;
		try {
			const setupCode = opts.pair ?? opts.pairIfNeeded;
			pair = setupCode ? resolveNodePairGatewayOptions(setupCode) : void 0;
			const existing = await loadNodeHostConfig();
			gatewayOptions = resolveNodeGatewayOptions(opts, existing, pair);
		} catch (error) {
			defaultRuntime.error(error instanceof Error ? error.message : String(error));
			defaultRuntime.exit(1);
			return;
		}
		const { host, port, contextPath, tls, tlsFingerprint, cloudflareAccess, gatewayCandidates } = gatewayOptions;
		if (port === null) {
			defaultRuntime.error(formatInvalidPortOption("--port"));
			defaultRuntime.exit(1);
			return;
		}
		if (opts.tls === false && opts.tlsFingerprint !== void 0) {
			defaultRuntime.error("--no-tls cannot be combined with --tls-fingerprint");
			defaultRuntime.exit(1);
			return;
		}
		const { runNodeHost } = await import("./runner-DZfSWdDU.mjs");
		await runNodeHost({
			gatewayHost: host,
			gatewayPort: port,
			gatewayTls: tls,
			gatewayTlsFingerprint: tlsFingerprint,
			gatewayContextPath: contextPath,
			gatewayCloudflareAccess: cloudflareAccess,
			gatewayCandidates,
			gatewayBootstrapToken: pair?.bootstrapToken,
			preferGatewayBootstrapToken: opts.pair !== void 0,
			...opts.ephemeral === true || opts.sessionHost === true ? { forceWorkerRuns: true } : {},
			...opts.ephemeral === true ? { ephemeral: true } : {},
			nodeId: opts.nodeId,
			displayName: opts.displayName,
			installedAppsSharing: opts.shareInstalledApps,
			desktopSharingEnabled: opts.desktopSharing,
			gatewayAuthFromEnv: opts.authFromEnv,
			parentStdin: opts.parentStdin,
			commands: opts.commands ?? inheritOptionFromParent(command, "commands"),
			allCommands: opts.allCommands ?? inheritOptionFromParent(command, "allCommands")
		});
	});
	node.command("status").description("Show node host status").option("--json", "Output JSON", false).action(async (opts) => {
		const { runNodeDaemonStatus } = await import("./daemon-C40RsJWS.mjs");
		await runNodeDaemonStatus(opts);
	});
	node.command("identity").description("Print the node host device identity (device id + public key)").option("--json", "Output JSON", false).action(async (opts) => {
		await runNodeIdentityShow(opts);
	});
	addNodeCommandOptions(node.command("install").description("Install the node host service (launchd/systemd/schtasks)")).option("--host <host>", "Gateway host").option("--port <port>", "Gateway port").option("--context-path <path>", "Gateway WebSocket context path (e.g. /openclaw-gw)").option("--tls", "Use TLS for the gateway connection").option("--no-tls", "Disable TLS for the gateway connection").option("--tls-fingerprint <sha256>", "Expected TLS certificate fingerprint (sha256)").option("--node-id <id>", "Override the generated node instance id").option("--display-name <name>", "Override node display name").option("--share-installed-apps", "Share installed macOS applications with the Gateway").option("--no-share-installed-apps", "Disable installed application sharing").option("--runtime <runtime>", "Service runtime (node|bun). Default: node").option("--runtime-path <path>", "Pin an absolute Node/Bun executable path").option("--force", "Reinstall/overwrite if already installed", false).option("--json", "Output JSON", false).action(async (opts, command) => {
		const { runNodeDaemonInstall } = await import("./daemon-C40RsJWS.mjs");
		await runNodeDaemonInstall({
			...opts,
			commands: opts.commands ?? inheritOptionFromParent(command, "commands"),
			allCommands: opts.allCommands ?? inheritOptionFromParent(command, "allCommands")
		});
	});
	for (const [name, action] of [
		["uninstall", "runNodeDaemonUninstall"],
		["stop", "runNodeDaemonStop"],
		["start", "runNodeDaemonStart"],
		["restart", "runNodeDaemonRestart"]
	]) node.command(name).description(`${name.charAt(0).toUpperCase()}${name.slice(1)} the node host service (launchd/systemd/schtasks)`).option("--json", "Output JSON", false).action(async (opts) => {
		await (await import("./daemon-C40RsJWS.mjs"))[action](opts);
	});
}
//#endregion
export { registerNodeCli };
