import { t as createDeferredCore } from "./deferred-D0La5CRk.mjs";
import { n as createWindowsJobBindings } from "./service-child-windows-job-native-DZ9lDQG9.mjs";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { extname } from "node:path";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
//#region scripts/lib/managed-windows-job-entrypoint.mts
const managedWindowsJobEntrypoint = {
	currentModuleUrl: import.meta.url,
	sourceWorkerName: "managed-windows-job-launcher",
	sourceExtension: ".mts",
	distWorkerPath: "tooling/managed-windows-job-launcher.js"
};
/** Tooling preflight has no application dependencies, including for worker resolution. */
function resolveManagedWindowsJobEntrypointUrl() {
	const current = new URL(import.meta.url);
	const distIndex = current.pathname.lastIndexOf("/dist/");
	return distIndex < 0 ? new URL(`./${managedWindowsJobEntrypoint.sourceWorkerName}${extname(fileURLToPath(current))}`, current) : new URL(`${current.pathname.slice(0, distIndex + 6)}${managedWindowsJobEntrypoint.distWorkerPath}`, current);
}
//#endregion
//#region scripts/lib/managed-windows-job.mts
var WindowsJobSetupError = class extends Error {
	constructor(reason, cause) {
		super(reason, { cause });
		this.reason = reason;
	}
};
let native;
function bindings() {
	if (!native) {
		const koffi = createRequire(import.meta.url)("koffi");
		const candidate = createWindowsJobBindings(koffi);
		candidate.assertLayouts();
		native = candidate;
	}
	return native;
}
/** One retained kernel Job owns the launcher and every command descendant. */
function spawnWindowsJobChild(command, args, options, admitCommand) {
	if (process.platform !== "win32") return;
	const launcher = resolveManagedWindowsJobEntrypointUrl();
	if (!existsSync(launcher)) return;
	let api;
	try {
		api = bindings();
	} catch {
		return;
	}
	const configuredStdio = options.stdio;
	const stdio = Array.isArray(configuredStdio) ? [...configuredStdio] : Array.from({ length: 3 }, () => configuredStdio ?? "pipe");
	while (stdio.length < 3) stdio.push("pipe");
	const name = `Local\\OpenClawTooling-${randomUUID()}`;
	let handle;
	try {
		handle = api.requireHandle(api.CreateJobObjectW(null, name), "CreateJobObjectW(tooling)");
	} catch (error) {
		throw new WindowsJobSetupError("job-create-failed", error);
	}
	const admission = createDeferredCore();
	admission.promise.catch(() => {});
	const ready = createDeferredCore();
	ready.promise.catch(() => {});
	let child;
	let admitted = false;
	let exited = false;
	let stopped = false;
	let closed = false;
	let commandPid;
	let stopDeadline;
	let certification;
	let extinctionSettled = false;
	let observationTimer;
	const job = {
		admission: admission.promise,
		ready: ready.promise,
		get commandPid() {
			return commandPid;
		},
		isControlMessage: (message) => Boolean(message && typeof message === "object" && "job" in message && message.job === name),
		beginStop: () => {
			stopped = true;
		},
		inspect: () => {
			if (closed) throw new Error("Windows command Job is closed");
			return api.readJobProcessIds(handle);
		},
		stop: () => {
			stopped = true;
			stopDeadline ??= performance.now() + 4e3;
			try {
				if (closed) return;
				if (!api.TerminateJobObject(handle, 1)) throw api.lastError("TerminateJobObject(tooling)");
				if (!admitted) child?.kill("SIGKILL");
			} finally {
				observeExtinction();
			}
		},
		close: () => {
			stopped = true;
			if (!closed) {
				if (!api.CloseHandle(handle)) throw api.lastError("CloseHandle(tooling Job)");
				closed = true;
			}
		},
		certify: () => {
			if (!certification) {
				certification = createDeferredCore();
				observeExtinction();
			}
			return certification.promise;
		}
	};
	function observeExtinction() {
		if (!certification || extinctionSettled) return;
		clearTimeout(observationTimer);
		let outcome;
		try {
			if (!exited || job.inspect().length !== 0) {
				if (stopDeadline !== void 0 && performance.now() >= stopDeadline) throw new Error("Windows Job descendant extinction deadline expired");
				if (exited || stopDeadline !== void 0) observationTimer = setTimeout(observeExtinction, 25);
				return;
			}
			job.close();
			outcome = { status: "confirmed" };
		} catch (error) {
			try {
				job.close();
			} catch {}
			outcome = {
				status: "uncertain",
				reason: "job-observation-failed",
				cause: error instanceof Error ? error : new Error(String(error))
			};
		}
		extinctionSettled = true;
		certification.resolve(outcome);
	}
	try {
		try {
			if (!api.SetExtendedLimits(handle, 9, api.extendedLimits, api.extendedLimitsSize)) throw api.lastError("SetInformationJobObject(tooling)");
		} catch (error) {
			throw new WindowsJobSetupError("job-configuration-failed", error);
		}
		const { stdio: _stdio, signal: _signal, ...commandOptions } = options;
		const commandEnv = { ...options.env ?? process.env };
		const launch = {
			command,
			args: [...args],
			options: {
				...commandOptions,
				cwd: options.cwd instanceof URL ? fileURLToPath(options.cwd) : options.cwd,
				env: commandEnv
			},
			stdio: stdio.map((entry, fd) => entry === "ipc" || entry === "ignore" ? entry : fd)
		};
		if (!stdio.includes("ipc")) stdio.push("ipc");
		const launched = spawn(process.execPath, [fileURLToPath(launcher), name], {
			cwd: launch.options.cwd,
			env: Object.fromEntries(Object.entries(commandEnv).filter(([key]) => key.toUpperCase() !== "NODE_OPTIONS")),
			stdio,
			windowsHide: options.windowsHide,
			signal: options.signal
		});
		child = launched;
		const fail = (error) => {
			admission.reject(error);
			ready.reject(error);
			try {
				job.stop();
			} catch {}
		};
		launched.on("error", fail);
		launched.once("exit", () => {
			exited = true;
			observeExtinction();
			const error = /* @__PURE__ */ new Error("Windows Job launcher exited before command startup");
			admission.reject(new WindowsJobSetupError("job-admission-failed", error));
			ready.reject(error);
		});
		launched.once("close", () => {
			exited = true;
			observeExtinction();
			const error = /* @__PURE__ */ new Error("Windows Job launcher closed before command startup");
			admission.reject(new WindowsJobSetupError("job-admission-failed", error));
			ready.reject(error);
		});
		launched.on("message", (message) => {
			if (!job.isControlMessage(message)) return;
			const control = message;
			if (control.type === "ready" && !admitted && !stopped) try {
				admission.resolve();
				const launchCommand = () => {
					if (!stopped) {
						admitted = true;
						launched.send(launch, (error) => error && launched.emit("error", error));
					}
				};
				if (admitCommand) admitCommand(launchCommand)?.catch((error) => launched.emit("error", error));
				else launchCommand();
			} catch (error) {
				launched.emit("error", error instanceof Error ? error : new Error(String(error)));
			}
			else if (control.type === "spawned") {
				commandPid = control.pid;
				ready.resolve();
			} else if (control.type === "job-error" && !admitted) launched.emit("error", new WindowsJobSetupError("job-admission-failed", new Error(control.error)));
			else if (control.type === "error") launched.emit("error", Object.assign(new Error(control.error), { code: control.code }));
		});
		return {
			child: launched,
			job
		};
	} catch (error) {
		try {
			job.close();
		} catch {}
		throw error;
	}
}
//#endregion
export { spawnWindowsJobChild as n, WindowsJobSetupError as t };
