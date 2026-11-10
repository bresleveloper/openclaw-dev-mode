import { r as spawnTerminalPty, t as prepareTerminalPty } from "../terminal-pty-AuGVyE64.mjs";
//#region src/process/terminal-pty-worker.ts
let pty;
let starting = false;
let parentLost = false;
let finished = false;
let authorizeLaunch;
function report(message, done) {
	if (!process.connected) {
		done?.();
		return;
	}
	process.send?.(message, () => done?.());
}
function finish(message) {
	if (finished) return;
	finished = true;
	pty?.kill();
	process.stdout.end(() => {
		report(message, () => {
			if (process.connected) process.disconnect?.();
		});
	});
}
function close() {
	parentLost = true;
	pty?.kill();
}
process.once("disconnect", close);
process.once("SIGTERM", close);
process.once("SIGINT", close);
process.stdout.on("error", close);
process.stdout.on("drain", () => pty?.resume());
process.on("message", (message) => {
	if (message.type === "start" || message.type === "prepare") {
		if (starting || parentLost) return;
		starting = true;
		if (process.versions.bun) {
			finish({
				type: "error",
				message: "Terminal worker requires Node; PATH resolves node to Bun."
			});
			return;
		}
		(message.type === "prepare" ? prepareTerminalPty(message.params).then((launch) => new Promise((resolve, reject) => {
			authorizeLaunch = () => {
				try {
					if (parentLost || finished) throw new Error("Terminal host retired before launch");
					resolve(launch());
				} catch (error) {
					reject(error instanceof Error ? error : new Error(String(error)));
				}
			};
			report({ type: "prepared" });
		})) : spawnTerminalPty(message.params)).then((handle) => {
			pty = handle;
			pty.onData((data) => {
				if (!process.stdout.write(data)) handle.pause();
			});
			pty.onExit((event) => finish({
				type: "exit",
				...event
			}));
			if (parentLost || finished) pty.kill();
			else report({
				type: "ready",
				pid: pty.pid
			});
		}, (error) => finish({
			type: "error",
			message: error instanceof Error ? error.message : String(error)
		}));
	} else if (message.type === "launch") {
		const launch = authorizeLaunch;
		authorizeLaunch = void 0;
		launch?.();
	} else if (message.type === "input") pty?.write("data" in message ? message.data : Buffer.from(message.dataBase64, "base64"));
	else if (message.type === "resize") pty?.resize(message.cols, message.rows);
	else pty?.kill(message.signal);
});
report({ type: "boot" });
//#endregion
export {};
