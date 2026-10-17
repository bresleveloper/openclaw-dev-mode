import { r as defaultRuntime } from "./runtime-DlO3PTAd.mjs";
import { t as formatCliCommand } from "./command-format-DwEdrDKL.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { n as quotePowerShellArg, t as quoteCliArg } from "./quote-cli-arg-BEt71TUh.mjs";
import { i as readResponseWithLimit, t as cancelUnreadResponseBody } from "./http-response-body-umfRGZ-E.mjs";
import "./http-body-CgfQBa7S.mjs";
import { r as getRuntimeConfig } from "./io.runtime-BSum32pK.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { t as normalizeHostname } from "./hostname-Db1ZcSGB.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-DI6biu8d.mjs";
import { s as isLoopbackHost } from "./net-C6WEu3pd.mjs";
import { t as addNodeCommandOptions } from "./command-options-5SoYNuSl.mjs";
import { a as loadNodeHostConfig, c as nodeHostGatewaysShareOrigin, o as nodeHostCloudflareAccessConfigFromEnv, s as nodeHostGatewayMatchesUrl, u as resolveNodeHostCloudflareAccess } from "./config-BO4n0NZx.mjs";
import { d as CF_ACCESS_CLIENT_SECRET_HEADER, f as buildCloudflareAccessHeaders, u as CF_ACCESS_CLIENT_ID_HEADER } from "./launch-descriptor-BQV4k-tD.mjs";
import { n as formatHelpExamples, t as formatDocsHelp } from "./help-format-xds_bDSp.mjs";
import { n as decodePairingSetupCode, r as encodePairingSetupCode } from "./setup-code-DQhRCoLc.mjs";
import { n as runNodeHost, r as formatGatewayCandidateUrl, t as loadResumableNodeHostGateway } from "./runner-BAmTuCCB.mjs";
import { t as isDevicePairingJoinCode } from "./join-code-B_OfdZ-j.mjs";
import { t as runNodeDaemonInstall } from "./daemon-DiOZCS4w.mjs";
import { r as resolveNodePairGatewayPayload } from "./gateway-options-DyhpCjjI.mjs";
import fs from "node:fs/promises";
import { readRegularFile } from "@openclaw/fs-safe/advanced";
//#region src/cli/connect-cli.ts
const MAX_JOIN_PAYLOAD_BYTES = 24576;
const MAX_TARGET_FILE_BYTES = 65536;
const JOIN_FETCH_TIMEOUT_MS = 15e3;
function parseJoinTarget(target) {
	let parsed;
	try {
		parsed = new URL(target);
	} catch {
		return null;
	}
	if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
	const shortcode = /(?:^|\/)j\/([^/]+)$/u.exec(parsed.pathname)?.[1] ?? "";
	if (parsed.username || parsed.password || parsed.search || parsed.hash || !isDevicePairingJoinCode(shortcode)) throw new Error("Join URL must end with the exact /j/<shortcode> form.");
	if (parsed.protocol === "http:" && !isLoopbackHost(parsed.hostname)) throw new Error("Plain HTTP join URLs are allowed only for loopback gateways.");
	return parsed;
}
async function fetchJoinPayload(target, cloudflareAccess) {
	const expectedHost = normalizeHostname(target.hostname);
	let release = async () => {};
	try {
		const guarded = await fetchWithSsrFGuard({
			url: target.toString(),
			auditContext: "openclaw-connect-join",
			maxRedirects: 0,
			requireHttps: target.protocol === "https:",
			timeoutMs: JOIN_FETCH_TIMEOUT_MS,
			...cloudflareAccess ? {
				init: { headers: buildCloudflareAccessHeaders(cloudflareAccess) },
				capture: { sensitiveRequestHeaderNames: [CF_ACCESS_CLIENT_ID_HEADER, CF_ACCESS_CLIENT_SECRET_HEADER] }
			} : {},
			policy: {
				allowPrivateNetwork: true,
				allowedHostnames: [expectedHost],
				hostnameAllowlist: [expectedHost]
			}
		});
		release = guarded.release;
		const response = guarded.response;
		if (!response.ok || !response.headers.get("content-type")?.startsWith("application/json")) {
			await cancelUnreadResponseBody(response);
			throw new Error("Gateway join code was not found or has expired.");
		}
		const body = await readResponseWithLimit(response, MAX_JOIN_PAYLOAD_BYTES);
		let decoded;
		try {
			decoded = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(body));
		} catch {
			throw new Error("Gateway returned an invalid pairing payload.");
		}
		return decodePairingSetupCode(encodePairingSetupCode(decoded));
	} catch (error) {
		if (error instanceof Error && error.message.startsWith("Gateway ")) throw error;
		throw new Error("Could not fetch the Gateway join payload securely.", { cause: error });
	} finally {
		await release();
	}
}
function selectCloudflareAccessConfig(params) {
	const saved = params.savedGateway;
	return (saved && nodeHostGatewayMatchesUrl(saved, params.target) ? saved.cloudflareAccess : void 0) ?? nodeHostCloudflareAccessConfigFromEnv(params.env);
}
/** Connect only redeems one-shot targets; a saved pairing resumes through `openclaw node`. */
function formatMissingTargetError(opts, savedGateway) {
	const missing = "Connect target is required.";
	if (opts.ephemeral) return missing;
	const command = (fixed, ...args) => [formatCliCommand(fixed), ...args].join(" ");
	const quote = process.platform === "win32" ? quotePowerShellArg : quoteCliArg;
	const sessionHostFlags = opts.sessionHost ? ["--session-host"] : [];
	const hostFlags = [
		...opts.displayName !== void 0 ? ["--display-name", quote(opts.displayName)] : [],
		...opts.commands ? ["--commands", quote(opts.commands.join(","))] : [],
		...opts.allCommands ? ["--all-commands"] : []
	];
	const pair = `mint a join URL on the Gateway host with ${command("openclaw devices join-code")}, then run: ${command("openclaw connect <join-url>", ...opts.service ? ["--service"] : [], ...sessionHostFlags, ...hostFlags)}`;
	if (!savedGateway) return `${missing} To pair this machine, ${pair}`;
	const reconnect = opts.service ? [...opts.sessionHost ? [command("openclaw config set nodeHost.workerRuns.enabled true")] : [], command("openclaw node install --force", ...hostFlags)].join(", then ") : command("openclaw node run", ...sessionHostFlags, ...hostFlags);
	return [
		`${missing} Join URLs and setup codes are single-use.`,
		`If this machine is still paired with ${formatGatewayCandidateUrl(savedGateway)}, reconnect with the saved pairing: ${reconnect}`,
		`Otherwise, ${pair}`
	].join("\n");
}
async function resolveConnectTarget(target, targetFile) {
	if (target && targetFile) throw new Error("Provide the connect target or --target-file, not both.");
	if (target) return target;
	const filePath = targetFile?.trim();
	if (!filePath) return;
	let buffer;
	try {
		const resolvedFilePath = await fs.realpath(filePath);
		({buffer} = await readRegularFile({
			filePath: resolvedFilePath,
			maxBytes: MAX_TARGET_FILE_BYTES
		}));
	} catch (error) {
		const cause = error instanceof Error ? error.message : String(error);
		throw new Error(`Could not read --target-file ${filePath} (max ${MAX_TARGET_FILE_BYTES} bytes): ${cause}`, { cause: error });
	}
	const value = buffer.toString("utf8").trim();
	if (!value) throw new Error("Connect target file is empty.");
	await fs.rm(filePath, { force: true });
	return value;
}
async function runConnectCommand(target, opts) {
	if (opts.ephemeral && opts.sessionHost) throw new Error("--ephemeral cannot be combined with --session-host.");
	if (opts.ephemeral && opts.service) throw new Error("--ephemeral cannot be combined with --service.");
	const resolvedTarget = await resolveConnectTarget(target, opts.targetFile);
	if (!resolvedTarget) throw new Error(formatMissingTargetError(opts, await loadResumableNodeHostGateway()));
	const joinTarget = parseJoinTarget(resolvedTarget);
	const saved = await loadNodeHostConfig();
	const initialCloudflareAccess = joinTarget ? selectCloudflareAccessConfig({
		savedGateway: saved?.gateway,
		target: joinTarget,
		env: process.env
	}) : void 0;
	if (initialCloudflareAccess && joinTarget?.protocol !== "https:") throw new Error("Cloudflare Access credentials require an HTTPS join URL.");
	const joinCredentials = await resolveNodeHostCloudflareAccess({
		value: initialCloudflareAccess,
		config: getRuntimeConfig(),
		env: process.env
	});
	const payload = joinTarget ? await fetchJoinPayload(joinTarget, joinCredentials) : decodePairingSetupCode(resolvedTarget);
	const pair = resolveNodePairGatewayPayload(payload);
	const cloudflareAccess = initialCloudflareAccess ?? (saved?.gateway && nodeHostGatewaysShareOrigin(saved.gateway, pair.candidates[0]) ? saved.gateway.cloudflareAccess : void 0) ?? nodeHostCloudflareAccessConfigFromEnv(process.env);
	const gatewayCandidates = pair.candidates.map((candidate, index) => {
		return (joinTarget ? nodeHostGatewayMatchesUrl(candidate, joinTarget) : index === 0) && cloudflareAccess ? {
			...candidate,
			cloudflareAccess
		} : candidate;
	});
	const forceWorkerRuns = opts.ephemeral === true || opts.sessionHost === true && !opts.service;
	const nodeRunOptions = {
		gatewayHost: pair.host,
		gatewayPort: pair.port,
		gatewayTls: pair.tls,
		gatewayTlsFingerprint: pair.tlsFingerprint,
		gatewayContextPath: pair.contextPath,
		...gatewayCandidates[0]?.cloudflareAccess ? { gatewayCloudflareAccess: gatewayCandidates[0].cloudflareAccess } : {},
		gatewayCandidates,
		gatewayBootstrapToken: pair.bootstrapToken,
		preferGatewayBootstrapToken: opts.ephemeral !== true,
		...forceWorkerRuns ? { forceWorkerRuns: true } : {},
		...opts.ephemeral === true ? { ephemeral: true } : {},
		displayName: opts.displayName,
		commands: opts.commands,
		allCommands: opts.allCommands
	};
	if (!opts.service) {
		await runNodeHost(nodeRunOptions);
		return;
	}
	await runNodeHost({
		...nodeRunOptions,
		stopAfterFirstConnect: true
	});
	if (opts.sessionHost) await mutateConfigFileWithRetry({
		writeOptions: {
			auditOrigin: "cli",
			explicitSetPaths: [[
				"nodeHost",
				"workerRuns",
				"enabled"
			]]
		},
		mutate: (draft) => {
			draft.nodeHost = {
				...draft.nodeHost,
				workerRuns: {
					...draft.nodeHost?.workerRuns,
					enabled: true
				}
			};
		}
	});
	await runNodeDaemonInstall({
		displayName: opts.displayName,
		commands: opts.commands,
		allCommands: opts.allCommands,
		force: true
	});
}
function registerConnectCli(program) {
	addNodeCommandOptions(program.command("connect").description("Connect this machine to an OpenClaw Gateway as a node")).argument("[target]", "oc-pair URL, setup code, or HTTPS Gateway join URL").option("--service", "Install and run the node host as an OS service", false).option("--ephemeral", "Run as an environment-managed disposable session host", false).option("--session-host", "Host worker sessions (process-scoped unless installed as a service)", false).option("--target-file <path>", "Read the connect target from a private file and remove it").option("--display-name <name>", "Override the node display name").addHelpText("after", () => `\n${theme.heading("Examples:")}\n${formatHelpExamples([
		["openclaw connect oc-pair://<setup-code>", "Connect in the foreground."],
		["openclaw connect https://gateway.example/j/<code> --service", "Install the node host service."],
		["openclaw connect https://gateway.example/j/<code> --service --session-host", "Install a worker-session host service."]
	])}\n${formatDocsHelp("/cli/connect")}`).action(async (target, opts) => {
		try {
			await runConnectCommand(target, opts);
		} catch (error) {
			defaultRuntime.error(error instanceof Error ? error.message : String(error));
			defaultRuntime.exit(1);
		}
	});
}
//#endregion
export { registerConnectCli };
