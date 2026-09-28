import { r as defaultRuntime } from "./runtime-BC29JSZp.mjs";
import { r as readRegularFile } from "./regular-file-D4i0kJHS.mjs";
import { r as theme } from "./theme-DzaUZY4q.mjs";
import { r as getRuntimeConfig } from "./io.runtime-CZWcIUDk.mjs";
import { n as mutateConfigFileWithRetry } from "./mutate-CdmDoEFy.mjs";
import "./config-DryArA1l.mjs";
import { t as formatDocsLink } from "./links-B3qXeqz-.mjs";
import { s as isLoopbackHost } from "./net-DU4aWKLv.mjs";
import { D as CF_ACCESS_CLIENT_SECRET_HEADER, E as CF_ACCESS_CLIENT_ID_HEADER, O as buildCloudflareAccessHeaders } from "./worker-process-protocol-B6pCNPWA.mjs";
import { i as readResponseWithLimit, t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { t as addNodeCommandOptions } from "./command-options-5SoYNuSl.mjs";
import { a as loadNodeHostConfig, c as nodeHostGatewayMatchesUrl, d as resolveNodeHostCloudflareAccess, l as nodeHostGatewaysShareOrigin, s as nodeHostCloudflareAccessConfigFromEnv } from "./config-DLlmgxee.mjs";
import { t as formatHelpExamples } from "./help-format-Ctl5AOqy.mjs";
import { n as encodePairingSetupCode, t as decodePairingSetupCode } from "./setup-code-BNyr2Ilv.mjs";
import { t as runNodeHost } from "./runner-CM9t-u7g.mjs";
import { t as isDevicePairingJoinCode } from "./join-code-B_OfdZ-j.mjs";
import { t as runNodeDaemonInstall } from "./daemon-DeE4tbn7.mjs";
import { r as resolveNodePairGatewayPayload } from "./gateway-options-CQ_n8bsS.mjs";
import fs from "node:fs/promises";
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
async function resolveConnectTarget(target, targetFile) {
	if (target && targetFile) throw new Error("Provide the connect target or --target-file, not both.");
	if (target) return target;
	const filePath = targetFile?.trim();
	if (!filePath) throw new Error("Connect target is required.");
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
	])}\n\n${theme.muted("Docs:")} ${formatDocsLink("/cli/connect", "docs.openclaw.ai/cli/connect")}\n`).action(async (target, opts) => {
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
