import { c as isRecord } from "../record-coerce-DItp3I4t.mjs";
import { r as signalProcessTree } from "../kill-tree-BGQdx374.mjs";
import "../tailscale-route-owner-protocol-B2D1XMya.mjs";
import process from "node:process";
import { spawn } from "node:child_process";
//#region src/infra/tailscale-route-owner.worker.ts
const READY_MARKER = "Press Ctrl+C to exit.";
const OUTPUT_LIMIT = 2e5;
const STOP_GRACE_MS = 2e3;
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
function signalChild(child, signal) {
	if (typeof child.pid !== "number" || child.pid <= 0) return;
	if (process.platform !== "win32") {
		signalProcessTree(child.pid, signal, { detached: true });
		return;
	}
	child.kill(signal === "SIGKILL" ? "SIGTERM" : signal);
}
function runTailscaleRouteOwner(start, sendMessage = send) {
	const command = start.argv[0];
	if (!command) throw new Error("Tailscale route-owner command is empty");
	const args = start.argv.slice(1);
	let stdout = "";
	let stderr = "";
	let ready = false;
	let stopping = false;
	let forceTimer;
	let resolveExit;
	const exited = new Promise((resolve) => {
		resolveExit = resolve;
	});
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
		if (stopping) return;
		stopping = true;
		signalChild(child, "SIGTERM");
		forceTimer = setTimeout(() => signalChild(child, "SIGKILL"), STOP_GRACE_MS);
		forceTimer.unref?.();
	};
	child.once("spawn", () => {
		if (typeof child.pid === "number") sendMessage({
			type: "spawned",
			pid: child.pid
		});
	});
	child.stdout?.on("data", (chunk) => {
		stdout = appendBounded(stdout, chunk);
		if (!ready && stdout.includes(READY_MARKER)) {
			ready = true;
			sendMessage({ type: "ready" });
		}
	});
	child.stderr?.on("data", (chunk) => {
		stderr = appendBounded(stderr, chunk);
		if (!ready && stderr.includes(READY_MARKER)) {
			ready = true;
			sendMessage({ type: "ready" });
		}
	});
	child.once("error", (error) => {
		stderr = appendBounded(stderr, error instanceof Error ? error.message : String(error));
	});
	child.once("close", (code, signal) => {
		if (forceTimer) clearTimeout(forceTimer);
		if (!stopping || !ready) sendMessage({
			type: "failed",
			code,
			signal,
			stdout,
			stderr
		});
		resolveExit({
			code,
			signal,
			stopping
		});
	});
	return {
		exited,
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
