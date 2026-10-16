import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { r as consumeRootOptionToken } from "./cli-root-options-DGcy1qRg.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-CV_-dmd8.mjs";
import { n as scanCliRootOptions, t as takeCliRootOptionValue } from "./root-option-value-CXdqL8nr.mjs";
import "./src-CdRlGRnW.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.mjs";
import { spawnSync } from "node:child_process";
import { isIP } from "node:net";
//#region src/cli/container-target.ts
const CONTAINER_RUNTIMES = ["podman", "docker"];
const CONTAINER_ALLOW_LOOPBACK_PROXY_URL_ENV = "OPENCLAW_CONTAINER_ALLOW_LOOPBACK_PROXY_URL";
const CONTAINER_RUNTIME_PROBE_TIMEOUT_MS = 1e4;
function parseCliContainerArgs(argv) {
	let container = null;
	const scanned = scanCliRootOptions(argv, ({ arg, args, index }) => {
		if (arg === "--container" || arg.startsWith("--container=")) {
			const next = args[index + 1];
			const { value, consumedNext } = takeCliRootOptionValue(arg, next);
			if (!value) return {
				kind: "error",
				error: "--container requires a value"
			};
			container = value;
			return {
				kind: "handled",
				consumedNext
			};
		}
		return { kind: "pass" };
	});
	if (!scanned.ok) return scanned;
	return {
		ok: true,
		container,
		argv: scanned.argv
	};
}
function resolveCliContainerTarget(argv, env = process.env) {
	const parsed = parseCliContainerArgs(argv);
	if (!parsed.ok) throw new Error(parsed.error);
	return parsed.container ?? normalizeOptionalString(env.OPENCLAW_CONTAINER) ?? null;
}
function resolveRunningContainer(containerName) {
	const matches = CONTAINER_RUNTIMES.filter((runtime) => {
		const result = spawnSync(runtime, [
			"inspect",
			"--format",
			"{{.State.Running}}",
			containerName
		], {
			encoding: "utf8",
			killSignal: "SIGKILL",
			timeout: CONTAINER_RUNTIME_PROBE_TIMEOUT_MS
		});
		return result.status === 0 && result.stdout.trim() === "true";
	});
	if (matches.length === 0) return null;
	if (matches.length > 1) {
		const runtimes = matches.join(", ");
		throw new Error(`Container "${containerName}" is running under multiple runtimes (${runtimes}); use a unique container name.`);
	}
	return expectDefined(matches[0], "matches capture group 0");
}
function buildContainerExecArgs(params) {
	const envFlag = params.runtime === "docker" ? "-e" : "--env";
	const proxyUrl = normalizeOptionalString(params.env.OPENCLAW_PROXY_URL);
	if (proxyUrl) assertContainerProxyUrlIsReachable(proxyUrl, params.env);
	const proxyEnvArgs = proxyUrl ? [envFlag, `OPENCLAW_PROXY_URL=${proxyUrl}`] : [];
	return [
		"exec",
		...["-i", ...params.stdinIsTTY && params.stdoutIsTTY ? ["-t"] : []],
		envFlag,
		`OPENCLAW_CONTAINER_HINT=${params.containerName}`,
		envFlag,
		"OPENCLAW_CLI_CONTAINER_BYPASS=1",
		...proxyEnvArgs,
		params.containerName,
		"openclaw",
		...params.argv
	];
}
function assertContainerProxyUrlIsReachable(proxyUrl, env) {
	if (env[CONTAINER_ALLOW_LOOPBACK_PROXY_URL_ENV] === "1") return;
	let parsed;
	try {
		parsed = new URL(proxyUrl);
	} catch {
		return;
	}
	if (!isLoopbackProxyHostname(parsed.hostname)) return;
	throw new Error(`OPENCLAW_PROXY_URL=${redactProxyUrlForMessage(proxyUrl)} is loopback; 127.0.0.1 inside a container points at the container, not the host. Use a container-reachable proxy address, or set ${CONTAINER_ALLOW_LOOPBACK_PROXY_URL_ENV}=1 if this is intentional.`);
}
function isLoopbackProxyHostname(hostname) {
	const normalizedHostname = hostname.toLowerCase().replace(/\.+$/, "");
	if (normalizedHostname === "localhost") return true;
	if (isIP(normalizedHostname) === 4) return normalizedHostname.startsWith("127.");
	const ipv6Hostname = normalizedHostname.replace(/^\[|\]$/g, "");
	if (isIP(ipv6Hostname) !== 6) return false;
	if (ipv6Hostname === "::1" || ipv6Hostname === "0:0:0:0:0:0:0:1") return true;
	const mapped = /^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(ipv6Hostname);
	if (!mapped) return false;
	const high = Number.parseInt(expectDefined(mapped[1], "mapped capture group 1"), 16);
	return Number.isInteger(high) && high >= 32512 && high <= 32767;
}
function redactProxyUrlForMessage(raw) {
	try {
		const url = new URL(raw);
		if (url.username || url.password) {
			url.username = "redacted";
			url.password = url.password ? "redacted" : "";
		}
		url.search = "";
		url.hash = "";
		return url.toString();
	} catch {
		return "<invalid URL>";
	}
}
function buildContainerExecEnv(env) {
	const next = { ...env };
	delete next.OPENCLAW_PROFILE;
	delete next.OPENCLAW_GATEWAY_PORT;
	delete next.OPENCLAW_GATEWAY_URL;
	delete next.OPENCLAW_GATEWAY_TOKEN;
	delete next.OPENCLAW_GATEWAY_PASSWORD;
	next.OPENCLAW_CONTAINER = "";
	return next;
}
function isBlockedContainerCommand(argv) {
	if (resolveCliArgvInvocation([
		"node",
		"openclaw",
		...argv
	]).primary === "update") return true;
	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		if (!arg || arg === "--") return false;
		if (arg === "--update") return true;
		const consumedRootOption = consumeRootOptionToken(argv, i);
		if (consumedRootOption > 0) {
			i += consumedRootOption - 1;
			continue;
		}
		if (!arg.startsWith("-")) return false;
	}
	return false;
}
function maybeRunCliInContainer(argv) {
	if (process.env.OPENCLAW_CLI_CONTAINER_BYPASS === "1") return {
		handled: false,
		argv
	};
	const parsed = parseCliContainerArgs(argv);
	if (!parsed.ok) throw new Error(parsed.error);
	const containerName = parsed.container ?? normalizeOptionalString(process.env.OPENCLAW_CONTAINER);
	if (!containerName) return {
		handled: false,
		argv: parsed.argv
	};
	if (isBlockedContainerCommand(parsed.argv.slice(2))) throw new Error("openclaw update is not supported with --container; rebuild or restart the container image instead.");
	const runningContainer = resolveRunningContainer(containerName);
	if (!runningContainer) throw new Error(`No running container matched "${containerName}" under podman or docker.`);
	const result = spawnSync(runningContainer, buildContainerExecArgs({
		runtime: runningContainer,
		containerName,
		argv: parsed.argv.slice(2),
		env: process.env,
		stdinIsTTY: process.stdin.isTTY,
		stdoutIsTTY: process.stdout.isTTY
	}), {
		stdio: "inherit",
		env: buildContainerExecEnv(process.env)
	});
	if (result.error) throw result.error;
	return {
		handled: true,
		exitCode: resolveSubprocessExitCode(result.status, result.signal)
	};
}
//#endregion
export { parseCliContainerArgs as n, resolveCliContainerTarget as r, maybeRunCliInContainer as t };
