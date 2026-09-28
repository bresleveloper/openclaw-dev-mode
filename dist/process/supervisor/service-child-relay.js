import { t as resolveRuntimeWorkerArgv } from "../../runtime-worker-url-B4o9tqvO.mjs";
import { t as resolveRuntimeProcessEntrypointUrl } from "../../runtime-process-url-q9v1M311.mjs";
import { n as isOwnedProcessGroupGone } from "../../service-child-group-ownership-Qp-X4dOa.mjs";
import { n as setStdioEntry, t as reserveStdioEntry } from "../../service-child-stdio-Di1Z5Fp4.mjs";
import { closeSync, createWriteStream } from "node:fs";
import { spawn } from "node:child_process";
import { setTimeout } from "node:timers/promises";
//#region src/process/supervisor/service-child-relay.ts
function runServiceChildRelay() {
	let generation;
	let anchor;
	let parentLost = false;
	let forcedSequence;
	let signalError;
	let anchorExit;
	let parentLineageFds = [];
	let parentLineageReleased = false;
	const report = (message) => {
		if (!process.connected) return;
		try {
			process.send?.(message, () => {});
		} catch {}
	};
	const reportRetirement = () => {
		if (generation && forcedSequence !== void 0) report({
			type: "retirement",
			generation,
			sequence: forcedSequence,
			anchorExited: anchorExit !== void 0,
			signalError
		});
	};
	const settleAnchorExit = () => {
		if (!anchorExit || !parentLineageReleased) return;
		if (forcedSequence !== void 0 && !parentLost && process.connected) reportRetirement();
		else process.exit(anchorExit.code === 0 || anchorExit.signal === "SIGKILL" ? 0 : 1);
	};
	const releaseParentLineage = async () => {
		if (parentLineageFds.length > 0) {
			let reportedFailure = false;
			for (;;) {
				try {
					if (isOwnedProcessGroupGone(anchor.pid)) break;
				} catch (error) {
					if (!reportedFailure) {
						reportedFailure = true;
						report({
							type: "relay-error",
							generation,
							error: error instanceof Error ? error.message : String(error)
						});
					}
				}
				await setTimeout(100);
			}
			for (const fd of parentLineageFds) closeSync(fd);
			parentLineageFds = [];
		}
		parentLineageReleased = true;
		settleAnchorExit();
	};
	const notifyParentLoss = () => {
		if (parentLost) return;
		parentLost = true;
		if (anchorExit) {
			settleAnchorExit();
			return;
		}
		if (anchor?.connected) anchor.send({
			type: "parent-loss",
			generation
		});
	};
	process.once("disconnect", notifyParentLoss);
	process.once("SIGTERM", notifyParentLoss);
	process.once("SIGINT", notifyParentLoss);
	process.on("message", (raw) => {
		const start = raw;
		if (start?.type === "cancel") {
			if (!generation || !anchor || start.generation !== generation || start.signal !== "SIGKILL" || !Number.isSafeInteger(start.sequence) || start.sequence <= 0 || forcedSequence !== void 0) return;
			forcedSequence = start.sequence;
			if (!anchorExit) try {
				if (!anchor.kill("SIGKILL")) signalError ??= "retained anchor SIGKILL was not delivered";
			} catch (error) {
				signalError = error instanceof Error ? error.message : String(error);
			}
			reportRetirement();
			return;
		}
		if (generation) return;
		if (!start || start.type !== "start" || !start.generation) {
			process.exitCode = 1;
			return;
		}
		generation = start.generation;
		if (start.controlFd === void 0) {
			report({
				type: "relay-error",
				generation,
				error: "service child control fd is missing"
			});
			process.exitCode = 1;
			return;
		}
		const anchorUrl = resolveRuntimeProcessEntrypointUrl("serviceChildGroupAnchor");
		const stdio = [
			"inherit",
			"inherit",
			"inherit"
		];
		parentLineageFds = start.parentLineageFds ?? [];
		for (const fd of [
			start.controlFd,
			start.lineageFd,
			...parentLineageFds,
			start.secretFd
		]) if (fd !== void 0) setStdioEntry(stdio, fd, fd);
		reserveStdioEntry(stdio, "ipc");
		try {
			anchor = spawn(process.execPath, resolveRuntimeWorkerArgv(anchorUrl), {
				stdio,
				detached: true,
				windowsHide: true,
				env: process.env
			});
		} catch (error) {
			report({
				type: "relay-error",
				generation,
				error: error instanceof Error ? error.message : String(error)
			});
			process.exitCode = 1;
			return;
		}
		if (!anchor.connected) {
			report({
				type: "relay-error",
				generation,
				error: "anchor lifecycle IPC was not created"
			});
			anchor.kill("SIGKILL");
			process.exitCode = 1;
			return;
		}
		anchor.once("spawn", () => {
			closeSync(start.controlFd);
			if (start.lineageFd !== void 0) closeSync(start.lineageFd);
			if (process.versions.bun) for (const fd of [1, 2]) {
				const output = createWriteStream("", {
					fd,
					autoClose: true
				});
				output.once("error", (error) => {
					report({
						type: "relay-error",
						generation: start.generation,
						error: error.message
					});
					notifyParentLoss();
				});
				output.end();
			}
			else {
				process.stdout.destroy();
				process.stderr.destroy();
			}
			anchor?.send(start);
			if (parentLost) anchor?.send({
				type: "parent-loss",
				generation
			});
		});
		anchor.once("error", (error) => {
			if (forcedSequence !== void 0) {
				signalError = error.message;
				reportRetirement();
			} else report({
				type: "relay-error",
				generation,
				error: error.message
			});
		});
		anchor.once("exit", (code, signal) => {
			anchorExit = {
				code,
				signal
			};
			releaseParentLineage().catch((error) => {
				report({
					type: "relay-error",
					generation,
					error: error instanceof Error ? error.message : String(error)
				});
			});
		});
	});
}
runServiceChildRelay();
//#endregion
export {};
