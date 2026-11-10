import { k as isErrno, v as parseTcpPort } from "./redact-tYkqLD33.mjs";
import { h as isAbortError } from "./utils-c2rFzEZe.mjs";
import { n as createAbortError, o as sleepWithAbort, r as racePromiseWithAbortSignal } from "./src-Dpfm4nnc.mjs";
import { o as normalizeStringEntries, t as containsAsciiControlCharacter } from "./string-normalization-Djlq3kPB.mjs";
import "./subsystem-Y9GXTYwe.mjs";
import { t as formatErrorMessage } from "./errors-CvkendJg.mjs";
import { n as getWindowsInstallRoots } from "./windows-install-roots-Q8sDBS20.mjs";
import { i as theme } from "./logger-CWAcGbBw.mjs";
import { n as probeTcpListener, r as tryListenOnPort } from "./ports-probe-DsSvFiXd.mjs";
import { t as resolveSystemBin } from "./resolve-system-bin-CG0RxqyB.mjs";
import { spawn } from "node:child_process";
import path from "node:path";
theme.success;
theme.warn;
theme.info;
theme.error;
//#endregion
//#region src/infra/ports.ts
var PortInUseError = class extends Error {
	constructor(port, details) {
		super(`Port ${port} is already in use.`);
		this.name = "PortInUseError";
		this.port = port;
		this.details = details;
	}
};
/** Probes Node's wildcard bind by default; callers may scope checks to their owned interface. */
async function ensurePortAvailable(port, host, signal) {
	try {
		const probe = {
			port,
			...host ? { host } : {},
			...signal ? { signal } : {}
		};
		await tryListenOnPort(probe);
	} catch (err) {
		if (isErrno(err) && err.code === "EADDRINUSE") throw new PortInUseError(port);
		throw err;
	}
}
//#endregion
//#region src/infra/ssh-client.ts
function resolveSshClient() {
	if (process.platform !== "win32") return resolveSystemBin("ssh", { trust: "strict" });
	const { systemRoot } = getWindowsInstallRoots();
	const openSshDir = path.win32.join(systemRoot, "System32", "OpenSSH");
	return resolveSystemBin("ssh", {
		trust: "strict",
		extraDirs: [openSshDir]
	});
}
//#endregion
//#region src/infra/ssh-tunnel.ts
function hasControlOrWhitespace(value) {
	return containsAsciiControlCharacter(value) || /\s/.test(value);
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
	const at = trimmed.indexOf("@");
	const user = at === -1 ? void 0 : trimmed.slice(0, at).trim() || void 0;
	let host = at === -1 ? trimmed : trimmed.slice(at + 1).trim();
	let port = 22;
	const colonIdx = host.lastIndexOf(":");
	if (colonIdx > 0 && colonIdx < host.length - 1) {
		port = parseTcpPort(host.slice(colonIdx + 1).trim());
		host = host.slice(0, colonIdx).trim();
	}
	if (!host || port === null || !isSafeSshTargetHost(host) || user !== void 0 && !isSafeSshTargetUser(user)) return null;
	return {
		user,
		host,
		port
	};
}
async function waitForLocalListener(port, timeoutMs, signal, childPid, isChildActive) {
	const startedAt = performance.now();
	while (performance.now() - startedAt < timeoutMs) {
		if (await probeTcpListener(port, "127.0.0.1", signal) === "busy") {
			const { inspectPortUsage } = await import("./ports-inspect-UKfWNTe3.mjs");
			const usage = await inspectPortUsage(port, {
				probeHosts: ["127.0.0.1"],
				signal
			});
			if (!isChildActive()) throw new Error("ssh exited before tunnel listener ownership was verified");
			if (childPid === void 0 || usage.listeners.length === 0 || usage.listeners.some((listener) => listener.pid !== childPid)) throw new Error(`cannot verify SSH tunnel listener ownership on 127.0.0.1:${port} for SSH process ${childPid ?? "unknown"}; stop any conflicting listener or enable process inspection, then retry`);
			return;
		}
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
		if (err instanceof PortInUseError || isErrno(err) && (err.code === "EADDRINUSE" || err.code === "EACCES" || err.code === "EPERM")) localPort = await tryListenOnPort({
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
		.../:\d+$/.test(opts.target.trim()) ? ["-p", String(parsed.port)] : [],
		"-o",
		"ExitOnForwardFailure=yes",
		"-o",
		"BatchMode=yes",
		"-o",
		"ControlMaster=no",
		"-o",
		"ControlPath=none",
		"-o",
		"ControlPersist=no",
		"-o",
		"ForkAfterAuthentication=no",
		...opts.hostKeyPolicy === "openssh" ? [] : ["-o", "StrictHostKeyChecking=yes"],
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
	let active = true;
	const exited = new Promise((resolve) => {
		const onExit = () => {
			active = false;
			resolve();
		};
		child.once("exit", onExit);
		child.once("close", onExit);
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
	const readiness = waitForLocalListener(localPort, Math.max(250, opts.timeoutMs), readinessController.signal, child.pid, () => active && !stopping);
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
		closed: exited,
		isActive: () => active && !stopping,
		stop
	};
}
//#endregion
export { startSshPortForward };
