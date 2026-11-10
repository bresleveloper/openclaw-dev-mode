import { S as parseStrictInteger } from "./number-coercion-CkhMiRw8.mjs";
import { w as isProxyMachineOutput } from "./argv-C7hqFLn5.mjs";
import { t as collectOption } from "./helpers-CZZt1vds.mjs";
import { n as setCommandJsonMode } from "./json-mode-BIqJ-P-D.mjs";
import { InvalidArgumentError } from "commander";
//#region src/cli/proxy-cli.ts
function parseIntegerOption(value, flag) {
	const parsed = parseStrictInteger(value);
	if (parsed === void 0) throw new InvalidArgumentError(`${flag} must be an integer.`);
	return parsed;
}
function parsePortOption(value) {
	const parsed = parseIntegerOption(value, "--port");
	if (parsed < 0 || parsed > 65535) throw new InvalidArgumentError("--port must be between 0 and 65535.");
	return parsed;
}
function parsePositiveIntegerOption(value, flag) {
	const parsed = parseIntegerOption(value, flag);
	if (parsed <= 0) throw new InvalidArgumentError(`${flag} must be a positive integer.`);
	return parsed;
}
function registerProxyCli(program) {
	const proxy = program.command("proxy").description("Run the OpenClaw debug proxy and inspect captured traffic");
	setCommandJsonMode(proxy, "output", ({ argv }) => isProxyMachineOutput(argv));
	proxy.command("start").description("Start the local explicit debug proxy").option("--host <host>", "Bind host", "127.0.0.1").option("--port <port>", "Bind port", parsePortOption).action(async (opts) => {
		await (await import("./proxy-cli.runtime.js")).runDebugProxyStartCommand(opts);
	});
	proxy.command("run").description("Run a child command with OpenClaw debug proxy capture enabled").allowUnknownOption(true).allowExcessArguments(true).option("--host <host>", "Bind host", "127.0.0.1").option("--port <port>", "Bind port", parsePortOption).argument("[cmd...]", "Command to run after --").action(async (cmd, opts) => {
		await (await import("./proxy-cli.runtime.js")).runDebugProxyRunCommand({
			host: opts.host,
			port: opts.port,
			commandArgs: cmd
		});
	});
	proxy.command("validate").description("Validate the operator-managed network proxy").option("--json", "Print machine-readable JSON").option("--proxy-url <url>", "Proxy URL to validate instead of config/env").option("--proxy-ca-file <path>", "CA bundle file for verifying an HTTPS proxy endpoint").option("--allowed-url <url>", "Destination expected to succeed through the proxy", collectOption).option("--denied-url <url>", "Destination expected to be blocked by the proxy", collectOption).option("--apns-reachable", "Also verify sandbox APNs HTTP/2 is reachable through the proxy").option("--apns-authority <url>", "APNs authority to check with --apns-reachable").option("--timeout-ms <ms>", "Per-request timeout in milliseconds", (value) => parsePositiveIntegerOption(value, "--timeout-ms")).action(async (opts) => {
		await (await import("./proxy-cli.runtime.js")).runProxyValidateCommand({
			json: opts.json,
			proxyUrl: opts.proxyUrl,
			proxyCaFile: opts.proxyCaFile,
			allowedUrls: opts.allowedUrl,
			deniedUrls: opts.deniedUrl,
			apnsReachability: opts.apnsReachable,
			apnsAuthority: opts.apnsAuthority,
			timeoutMs: opts.timeoutMs
		});
	});
	proxy.command("coverage").description("Report current debug proxy transport coverage and remaining gaps").option("--json", "Print machine-readable JSON").action(async () => {
		await (await import("./proxy-cli.runtime.js")).runDebugProxyCoverageCommand();
	});
	proxy.command("sessions").description("List recent capture sessions").option("--json", "Print machine-readable JSON").option("--limit <count>", "Maximum sessions to show", (value) => parsePositiveIntegerOption(value, "--limit")).action(async (opts) => {
		await (await import("./proxy-cli.runtime.js")).runDebugProxySessionsCommand(opts);
	});
	proxy.command("query").description("Run a built-in query preset against captured traffic").requiredOption("--preset <name>", "Query preset: double-sends, retry-storms, cache-busting, ws-duplicate-frames, missing-ack, error-bursts").option("--json", "Print machine-readable JSON").option("--session <id>", "Restrict to a capture session id").action(async (opts) => {
		await (await import("./proxy-cli.runtime.js")).runDebugProxyQueryCommand({
			json: opts.json,
			preset: opts.preset,
			sessionId: opts.session
		});
	});
	proxy.command("blob").description("Read a captured payload blob by id").requiredOption("--id <blobId>", "Blob id").action(async (opts) => {
		await (await import("./proxy-cli.runtime.js")).readDebugProxyBlobCommand({ blobId: opts.id });
	});
	proxy.command("purge").description("Delete all captured traffic metadata and blobs").action(async () => {
		await (await import("./proxy-cli.runtime.js")).runDebugProxyPurgeCommand();
	});
}
//#endregion
export { registerProxyCli };
