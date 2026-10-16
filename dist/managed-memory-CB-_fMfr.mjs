import { n as hasUnjoinedWork } from "./managed-child-process-DzXLUTpR.mjs";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path, { extname } from "node:path";
import { spawnSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { setTimeout } from "node:timers/promises";
//#region scripts/lib/managed-memory-entrypoint.mts
const managedMemoryEntrypoint = {
	currentModuleUrl: import.meta.url,
	sourceWorkerName: "managed-memory-launcher",
	sourceExtension: ".mts",
	distWorkerPath: "tooling/managed-memory-launcher.js"
};
/** Resolve the standalone launcher in source checkouts and packaged tooling. */
function resolveManagedMemoryEntrypointUrl() {
	const current = new URL(import.meta.url);
	const distIndex = current.pathname.lastIndexOf("/dist/");
	return distIndex < 0 ? new URL(`./managed-memory-launcher${extname(fileURLToPath(current))}`, current) : new URL(current.pathname.slice(0, distIndex + 6) + managedMemoryEntrypoint.distWorkerPath, current);
}
//#endregion
//#region scripts/lib/managed-memory.mts
/** systemd owns the cgroup; the managed child owner still owns signals and output. */
async function runLinuxMemoryCommand(options, run) {
	const { memoryLimitBytes, onMemoryScope, ...command } = options;
	const unit = "openclaw-check-" + randomUUID() + ".scope";
	options.signal?.throwIfAborted();
	const control = (args) => spawnSync("systemctl", [
		"--user",
		...args,
		unit
	], {
		encoding: "utf8",
		timeout: 5e3,
		killSignal: "SIGKILL",
		env: options.env,
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		]
	});
	const initial = control(["show", "--property=LoadState"]);
	if (initial.error || !initial.stdout?.includes("LoadState=not-found")) throw new Error("[memory] A cgroup-v2 systemd user manager is required. Use a bounded Crabbox worker.");
	onMemoryScope?.(unit);
	options.signal?.throwIfAborted();
	const env = { ...options.env ?? process.env };
	env.OPENCLAW_MANAGED_NODE_OPTIONS = env.NODE_OPTIONS ?? "";
	delete env.NODE_OPTIONS;
	const cleanupScope = async (failure) => {
		control([
			"kill",
			"--kill-whom=all",
			"--signal=SIGKILL"
		]);
		control(["stop"]);
		const deadline = Date.now() + 5e3;
		let empty;
		do {
			const state = control([
				"show",
				"--property=LoadState",
				"--property=ActiveState",
				"--property=ControlGroup"
			]);
			const fields = Object.fromEntries((state.stdout ?? "").trim().split("\n").map((line) => line.split("=")));
			empty = !state.error && fields.LoadState === "not-found";
			if (!state.error && fields.ControlGroup?.endsWith("/" + unit)) try {
				empty = /^populated 0$/mu.test(fs.readFileSync(path.join("/sys/fs/cgroup", fields.ControlGroup, "cgroup.events"), "utf8"));
			} catch (error) {
				empty = Boolean(error && typeof error === "object" && "code" in error && error.code === "ENOENT" && fields.ActiveState === "inactive");
			}
			if (empty) break;
			await setTimeout(50);
		} while (Date.now() < deadline);
		if (!empty) throw Object.assign(new Error("Memory scope cleanup could not be verified: " + unit, { cause: failure }), {
			code: "EPROCESSGROUP_CLEANUP_FAILED",
			processTreeState: "indeterminate"
		});
		if (hasUnjoinedWork(failure)) throw Object.assign(new Error(failure instanceof Error ? failure.message : String(failure)), {
			code: "EPROCESSGROUP_CLEANUP_FAILED",
			processTreeState: "terminated"
		});
	};
	let failure;
	try {
		return await run({
			...command,
			requireProcessTreeExit: true,
			bin: "systemd-run",
			shell: false,
			env,
			args: [
				"--user",
				"--scope",
				"--collect",
				"--quiet",
				"--expand-environment=no",
				"--unit=" + unit,
				"--property=MemoryMax=" + memoryLimitBytes,
				"--property=MemorySwapMax=0",
				"--property=OOMPolicy=kill",
				"--",
				process.execPath,
				fileURLToPath(resolveManagedMemoryEntrypointUrl()),
				String(memoryLimitBytes),
				unit,
				String(options.shell ?? false),
				options.bin,
				...options.args ?? []
			]
		});
	} catch (error) {
		failure = error;
		throw error;
	} finally {
		await cleanupScope(failure);
	}
}
//#endregion
export { runLinuxMemoryCommand };
