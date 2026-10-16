import { t as createDeferredCore } from "../deferred-D0La5CRk.mjs";
import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { r as signalProcessTree } from "../kill-tree-ecObdMeW.mjs";
import "../tailscale-route-owner-protocol-B2D1XMya.mjs";
import process from "node:process";
import { execFile, spawn } from "node:child_process";
import { promisify } from "node:util";
//#region src/infra/tailscale-route-owner.worker.ts
const READY_MARKER = "Press Ctrl+C to exit.";
const OUTPUT_LIMIT = 2e5;
const STOP_GRACE_MS = 2e3;
const execFileAsync = promisify(execFile);
function appendBounded(current, chunk) {
	const next = current + chunk.toString();
	return next.length <= OUTPUT_LIMIT ? next : next.slice(next.length - OUTPUT_LIMIT);
}
function parseStart(raw) {
	const parsed = JSON.parse(raw ?? "null");
	const argv = isRecord(parsed) ? parsed.argv : void 0;
	if (!Array.isArray(argv) || !argv.every((entry) => typeof entry === "string") || argv.length === 0) throw new Error("invalid Tailscale route-owner start payload");
	return { argv };
}
function send(message) {
	if (!process.connected || !process.send) return;
	try {
		process.send(message, () => void 0);
	} catch {}
}
async function signalChild(child, signal, privileged, onError) {
	if (typeof child.pid !== "number" || child.pid <= 0) return;
	if (process.platform !== "win32") {
		if (privileged) {
			try {
				await execFileAsync("sudo", [
					"-n",
					"/bin/kill",
					`-${signal.slice(3)}`,
					"--",
					`-${child.pid}`
				], {
					timeout: 5e3,
					maxBuffer: 16384
				});
			} catch {
				onError(`Could not stop the owned Tailscale process group ${child.pid} through sudo. Run \`sudo /bin/kill -TERM -- -${child.pid}\` to stop it, then \`sudo tailscale set --operator=\$USER\` to avoid privileged claims.`);
			}
			return;
		}
		signalProcessTree(child.pid, signal, { detached: true });
		return;
	}
	child.kill(signal === "SIGKILL" ? "SIGTERM" : signal);
}
function runTailscaleRouteOwner(start, sendMessage = send) {
	const command = start.argv[0];
	if (!command) throw new Error("Tailscale route-owner command is empty");
	const args = start.argv.slice(1);
	const output = {
		stdout: "",
		stderr: ""
	};
	let ready = false;
	let stopping = false;
	let closed = false;
	let forceTimer;
	const signalOperations = [];
	const exit = createDeferredCore();
	const child = spawn(command, args, {
		detached: process.platform !== "win32",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		],
		windowsHide: true
	});
	const stop = () => {
		if (stopping || closed) return;
		stopping = true;
		const signal = (value) => {
			signalOperations.push(signalChild(child, value, command === "sudo" && args[0] === "-n", (message) => {
				if (!closed) sendMessage({
					type: "stop-failed",
					message
				});
			}));
		};
		signal("SIGTERM");
		forceTimer = setTimeout(() => signal("SIGKILL"), STOP_GRACE_MS);
		forceTimer.unref?.();
	};
	child.once("spawn", () => {
		if (typeof child.pid === "number") sendMessage({
			type: "spawned",
			pid: child.pid
		});
	});
	for (const stream of ["stdout", "stderr"]) child[stream]?.on("data", (chunk) => {
		output[stream] = appendBounded(output[stream], chunk);
		if (!ready && output[stream].includes(READY_MARKER)) {
			ready = true;
			sendMessage({ type: "ready" });
		}
	});
	child.once("error", (error) => {
		output.stderr = appendBounded(output.stderr, error instanceof Error ? error.message : String(error));
	});
	child.once("close", (code, signal) => {
		closed = true;
		if (forceTimer) clearTimeout(forceTimer);
		Promise.all(signalOperations).then(() => {
			if (!stopping || !ready) sendMessage({
				type: "failed",
				code,
				signal,
				...output
			});
			exit.resolve({
				code,
				signal,
				stopping
			});
		});
	});
	return {
		exited: exit.promise,
		stop
	};
}
if (process.argv[2] === "--openclaw-tailscale-route-owner") try {
	const owner = runTailscaleRouteOwner(parseStart(process.argv[3]));
	for (const signal of [
		"SIGINT",
		"SIGTERM",
		"SIGHUP"
	]) process.once(signal, owner.stop);
	process.once("disconnect", owner.stop);
	process.once("message", (message) => {
		if (isRecord(message) && message.type === "stop") owner.stop();
	});
	if (!process.connected) owner.stop();
	owner.exited.then((exit) => process.exit(exit.stopping ? 0 : 1));
} catch (error) {
	send({
		type: "failed",
		code: null,
		signal: null,
		stdout: "",
		stderr: error instanceof Error ? error.message : String(error)
	});
	process.exit(1);
}
//#endregion
export { runTailscaleRouteOwner };
