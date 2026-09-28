import { r as consumeRootOptionToken, s as isValueToken } from "./cli-root-options-vGuJ5JgW.mjs";
import "./src-CZ2wJvNB.mjs";
import { t as expectDefined } from "./expect-lbe3Hgrh.mjs";
import { l as normalizeOptionalString } from "./string-coerce-CIXf7egm.mjs";
import { t as resolveCliArgvInvocation } from "./argv-invocation-DszZF2nA.mjs";
import { t as parseInlineOptionToken } from "./inline-option-token-Dqt7rKG4.mjs";
import { t as resolveSubprocessExitCode } from "./subprocess-exit-code-AepaGf2z.mjs";
import { spawnSync } from "node:child_process";
import { isIP } from "node:net";
//#region src/cli/root-option-scan.ts
/** Walk argv once, letting callers consume custom flags before forwarding root options. */
function scanCliRootOptions(argv, visit) {
	if (argv.length < 2) return {
		ok: true,
		argv
	};
	const out = argv.slice(0, 2);
	const args = argv.slice(2);
	for (let i = 0; i < args.length; i += 1) {
		const arg = args[i];
		if (arg === void 0) continue;
		if (arg === "--") {
			out.push(arg, ...args.slice(i + 1));
			break;
		}
		const visited = visit({
			arg,
			args,
			index: i,
			out
		});
		if (visited.kind === "error") return {
			ok: false,
			error: visited.error
		};
		if (visited.kind === "handled") {
			if (visited.consumedNext) i += 1;
			continue;
		}
		const consumedRootOption = consumeRootOptionToken(args, i);
		if (consumedRootOption > 0) {
			for (let offset = 0; offset < consumedRootOption; offset += 1) {
				const token = args[i + offset];
				if (token !== void 0) out.push(token);
			}
			i += consumedRootOption - 1;
			continue;
		}
		out.push(arg);
	}
	return {
		ok: true,
		argv: out
	};
}
//#endregion
//#region src/cli/root-option-value.ts
/** Return the normalized option value and whether the next argv token was consumed. */
function takeCliRootOptionValue(raw, next) {
	const parsed = parseInlineOptionToken(raw);
	if (parsed.hasInlineValue) return {
		value: (parsed.inlineValue ?? "").trim() || null,
		consumedNext: false
	};
	const consumedNext = isValueToken(next);
	return {
		value: (consumedNext ? next.trim() : "") || null,
		consumedNext
	};
}
//#endregion
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
function isContainerRunning(params) {
	const result = params.deps.spawnSync(params.runtime, [
		"inspect",
		"--format",
		"{{.State.Running}}",
		params.containerName
	], {
		encoding: "utf8",
		killSignal: "SIGKILL",
		timeout: CONTAINER_RUNTIME_PROBE_TIMEOUT_MS
	});
	return result.status === 0 && result.stdout.trim() === "true";
}
function resolveRunningContainer(params) {
	const matches = [];
	for (const runtime of CONTAINER_RUNTIMES) if (isContainerRunning({
		runtime,
		containerName: params.containerName,
		deps: params.deps
	})) matches.push(runtime);
	if (matches.length === 0) return null;
	if (matches.length > 1) {
		const runtimes = matches.join(", ");
		throw new Error(`Container "${params.containerName}" is running under multiple runtimes (${runtimes}); use a unique container name.`);
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
function maybeRunCliInContainer(argv, deps) {
	const resolvedDeps = {
		env: deps?.env ?? process.env,
		spawnSync: deps?.spawnSync ?? spawnSync,
		stdinIsTTY: deps?.stdinIsTTY ?? process.stdin.isTTY,
		stdoutIsTTY: deps?.stdoutIsTTY ?? process.stdout.isTTY
	};
	if (resolvedDeps.env.OPENCLAW_CLI_CONTAINER_BYPASS === "1") return {
		handled: false,
		argv
	};
	const parsed = parseCliContainerArgs(argv);
	if (!parsed.ok) throw new Error(parsed.error);
	const containerName = resolveCliContainerTarget(argv, resolvedDeps.env);
	if (!containerName) return {
		handled: false,
		argv: parsed.argv
	};
	if (isBlockedContainerCommand(parsed.argv.slice(2))) throw new Error("openclaw update is not supported with --container; rebuild or restart the container image instead.");
	const runningContainer = resolveRunningContainer({
		containerName,
		deps: resolvedDeps
	});
	if (!runningContainer) throw new Error(`No running container matched "${containerName}" under podman or docker.`);
	const result = resolvedDeps.spawnSync(runningContainer, buildContainerExecArgs({
		runtime: runningContainer,
		containerName,
		argv: parsed.argv.slice(2),
		env: resolvedDeps.env,
		stdinIsTTY: resolvedDeps.stdinIsTTY,
		stdoutIsTTY: resolvedDeps.stdoutIsTTY
	}), {
		stdio: "inherit",
		env: buildContainerExecEnv(resolvedDeps.env)
	});
	if (result.error) throw result.error;
	return {
		handled: true,
		exitCode: resolveSubprocessExitCode(result.status, result.signal)
	};
}
//#endregion
export { scanCliRootOptions as a, takeCliRootOptionValue as i, parseCliContainerArgs as n, resolveCliContainerTarget as r, maybeRunCliInContainer as t };
