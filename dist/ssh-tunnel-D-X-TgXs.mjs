import { w as parseStrictPositiveInteger } from "./number-coercion-CLj0HTDM.mjs";
import { d as normalizeStringEntries } from "./string-normalization-_gRhJUDw.mjs";
import { s as sleepWithAbort } from "./src-D4OikzaT.mjs";
import { n as isAbortError, r as racePromiseWithAbortSignal, t as createAbortError } from "./abort-signal-Z3A36sLL.mjs";
import { n as isErrno } from "./errno-CkbDOfLk.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import "./backoff-CszdOMiF.mjs";
import { i as tryListenOnPort, r as probeTcpListener } from "./ports-probe-DxY7uEcU.mjs";
import { r as ensurePortAvailable, t as PortInUseError } from "./ports-CDR43XuJ.mjs";
import { t as resolveSshClient } from "./ssh-client-D1lvRJ3v.mjs";
import { spawn } from "node:child_process";
//#region src/infra/ssh-tunnel.ts
function hasControlOrWhitespace(value) {
	for (const char of value) {
		const code = char.charCodeAt(0);
		if (code <= 31 || code === 127 || /\s/.test(char)) return true;
	}
	return false;
}
function isSafeSshTargetUser(user) {
	return !hasControlOrWhitespace(user) && !user.startsWith("-");
}
function isSafeSshTargetHost(host) {
	return !hasControlOrWhitespace(host) && !host.startsWith("-") && !host.startsWith(":") && !host.endsWith(":") && !host.includes("@");
}
function parseSshTarget(raw) {
	const trimmed = raw.trim().replace(/^ssh\s+/, "");
	if (!trimmed) return null;
	const [userPart, hostPart] = trimmed.includes("@") ? (() => {
		const idx = trimmed.indexOf("@");
		const user = trimmed.slice(0, idx).trim();
		const host = trimmed.slice(idx + 1).trim();
		return [user || void 0, host];
	})() : [void 0, trimmed];
	const colonIdx = hostPart.lastIndexOf(":");
	if (colonIdx > 0 && colonIdx < hostPart.length - 1) {
		const host = hostPart.slice(0, colonIdx).trim();
		const portRaw = hostPart.slice(colonIdx + 1).trim();
		const port = parseStrictPositiveInteger(portRaw);
		if (!host || port === void 0 || port > 65535) return null;
		if (!isSafeSshTargetHost(host)) return null;
		if (userPart !== void 0 && !isSafeSshTargetUser(userPart)) return null;
		return {
			user: userPart,
			host,
			port
		};
	}
	if (!hostPart) return null;
	if (!isSafeSshTargetHost(hostPart)) return null;
	if (userPart !== void 0 && !isSafeSshTargetUser(userPart)) return null;
	return {
		user: userPart,
		host: hostPart,
		port: 22
	};
}
async function waitForLocalListener(port, timeoutMs, signal) {
	const startedAt = performance.now();
	while (performance.now() - startedAt < timeoutMs) {
		if (await probeTcpListener(port, "127.0.0.1", signal) === "busy") return;
		await sleepWithAbort(50, signal);
	}
	throw new Error(`ssh tunnel did not start listening on localhost:${port}`);
}
async function startSshPortForward(opts) {
	const parsed = parseSshTarget(opts.target);
	if (!parsed) throw new Error(`invalid SSH target: ${opts.target}`);
	const sshPath = resolveSshClient();
	if (!sshPath) throw new Error("trusted SSH client not found in system directories");
	let localPort = opts.localPortPreferred;
	try {
		await ensurePortAvailable(localPort, "127.0.0.1");
	} catch (err) {
		if (err instanceof PortInUseError || isErrno(err) && err.code === "EADDRINUSE") localPort = await tryListenOnPort({
			port: 0,
			host: "127.0.0.1"
		});
		else throw err;
	}
	const userHost = parsed.user ? `${parsed.user}@${parsed.host}` : parsed.host;
	const args = [
		"-N",
		"-L",
		`127.0.0.1:${localPort}:127.0.0.1:${opts.remotePort}`,
		"-p",
		String(parsed.port),
		"-o",
		"ExitOnForwardFailure=yes",
		"-o",
		"BatchMode=yes",
		"-o",
		"StrictHostKeyChecking=yes",
		"-o",
		"UpdateHostKeys=yes",
		"-o",
		"ConnectTimeout=5",
		"-o",
		"ServerAliveInterval=15",
		"-o",
		"ServerAliveCountMax=3"
	];
	if (opts.identity?.trim()) args.push("-i", opts.identity.trim());
	args.push("--", userHost);
	if (opts.signal?.aborted) throw createAbortError("SSH tunnel start aborted", { cause: opts.signal.reason });
	const stderr = [];
	const child = spawn(sshPath, args, { stdio: [
		"ignore",
		"ignore",
		"pipe"
	] });
	const stderrStream = child.stderr;
	stderrStream?.on("error", () => {});
	stderrStream?.setEncoding("utf8");
	stderrStream?.on("data", (chunk) => stderr.push(chunk));
	const exited = new Promise((resolve) => {
		child.once("exit", () => resolve());
		child.once("close", () => resolve());
	});
	let onAbort;
	const detachAbort = () => {
		if (onAbort) {
			opts.signal?.removeEventListener("abort", onAbort);
			onAbort = void 0;
		}
	};
	let stopping;
	const stop = () => stopping ??= (async () => {
		detachAbort();
		const timer = setTimeout(() => child.kill("SIGKILL"), 1500);
		try {
			child.kill("SIGTERM");
			await exited;
		} finally {
			clearTimeout(timer);
		}
	})();
	const readinessController = new AbortController();
	const readiness = waitForLocalListener(localPort, Math.max(250, opts.timeoutMs), readinessController.signal);
	try {
		try {
			await racePromiseWithAbortSignal(Promise.race([readiness, new Promise((_, reject) => {
				child.once("error", (err) => reject(err));
				child.once("exit", (code, signal) => {
					reject(/* @__PURE__ */ new Error(`ssh exited (${code ?? "null"}${signal ? `/${signal}` : ""})`));
				});
			})]), opts.signal);
		} finally {
			readinessController.abort();
			await readiness.catch(() => {});
		}
	} catch (err) {
		await stop();
		if (isAbortError(err)) throw err;
		const lines = normalizeStringEntries(stderr.join("").split("\n"));
		const suffix = lines.length > 0 ? `\n${lines.join("\n")}` : "";
		throw new Error(`${formatErrorMessage(err)}${suffix}`, { cause: err });
	}
	if (opts.signal) {
		onAbort = () => void stop().catch(() => {});
		opts.signal.addEventListener("abort", onAbort, { once: true });
		if (opts.signal.aborted) {
			onAbort();
			await stop();
			throw createAbortError("SSH tunnel start aborted", { cause: opts.signal.reason });
		}
	}
	exited.then(detachAbort);
	return {
		localPort,
		pid: typeof child.pid === "number" ? child.pid : null,
		stop
	};
}
//#endregion
export { startSshPortForward as n, parseSshTarget as t };
