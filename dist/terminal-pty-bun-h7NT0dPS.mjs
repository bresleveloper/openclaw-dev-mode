import { t as signalTerminalPtyTree } from "./terminal-pty-DDAfq3Sz.mjs";
import { constants } from "node:os";
//#region src/process/terminal-pty-bun.ts
const OUTPUT_EOF_GRACE_MS = 200;
/** Runs a PTY on Bun's native terminal; the caller has resolved env and TERM. */
function spawnBunTerminalPty(params) {
	const bun = globalThis.Bun;
	if (!bun) throw new Error("Bun's native terminal is unavailable in this runtime");
	const decoder = new TextDecoder();
	const dataListeners = /* @__PURE__ */ new Set();
	const exitListeners = /* @__PURE__ */ new Set();
	let pending = [];
	let delivered = 0;
	let flushing = false;
	let paused = false;
	let tearingDown = false;
	let outputEnded = false;
	let exitDue = false;
	let processExit;
	let exited;
	let eofGrace;
	const flush = () => {
		if (flushing) return;
		flushing = true;
		try {
			for (;;) {
				const chunk = pending[delivered];
				if (paused && !tearingDown || dataListeners.size === 0 || chunk === void 0) break;
				delivered += 1;
				for (const listener of dataListeners) listener(chunk);
			}
		} finally {
			flushing = false;
		}
		if (delivered > 0 && delivered * 2 >= pending.length) {
			pending = pending.slice(delivered);
			delivered = 0;
		}
		if (exitDue && processExit && !(paused && pending.length > 0 && !tearingDown)) {
			exitDue = false;
			exited = processExit;
			pending = [];
			delivered = 0;
			terminal.close();
			for (const listener of exitListeners) listener(exited);
		}
	};
	const deliver = (chunk) => {
		if (chunk) pending.push(chunk);
		flush();
	};
	const finish = () => {
		if (exited || exitDue || !processExit) return;
		clearTimeout(eofGrace);
		eofGrace = void 0;
		exitDue = true;
		deliver(decoder.decode());
	};
	const armEofGrace = () => {
		if (!processExit || outputEnded || exited || eofGrace || paused && !tearingDown) return;
		eofGrace = setTimeout(finish, OUTPUT_EOF_GRACE_MS);
	};
	const child = bun.spawn([params.file, ...params.args], {
		cwd: params.cwd,
		env: params.env,
		terminal: {
			cols: params.cols,
			rows: params.rows,
			name: params.name,
			data: (_terminal, data) => deliver(decoder.decode(data, { stream: true })),
			exit: () => {
				outputEnded = true;
				finish();
			}
		}
	});
	if (!child.terminal) {
		child.kill("SIGKILL");
		throw new Error("Bun did not attach a terminal to the spawned process");
	}
	const terminal = child.terminal;
	child.exited.then(() => {
		processExit = child.signalCode ? {
			exitCode: 0,
			signal: constants.signals[child.signalCode]
		} : { exitCode: child.exitCode ?? 0 };
		if (outputEnded) finish();
		else armEofGrace();
	});
	const resume = () => {
		paused = false;
		terminal.resume();
		flush();
		armEofGrace();
	};
	return {
		pid: child.pid,
		write: (data) => void terminal.write(data),
		resize: (cols, rows) => terminal.resize(cols, rows),
		pause: () => {
			paused = true;
			if (!tearingDown) {
				terminal.pause();
				clearTimeout(eofGrace);
				eofGrace = void 0;
			}
		},
		resume,
		onData: (listener) => {
			dataListeners.add(listener);
			flush();
			return { dispose: () => dataListeners.delete(listener) };
		},
		onExit: (listener) => {
			exitListeners.add(listener);
			if (exited) listener(exited);
			return { dispose: () => exitListeners.delete(listener) };
		},
		kill: (signal) => {
			signalTerminalPtyTree(child.pid, signal, (direct) => child.kill(direct));
			if (exited || signal !== void 0 && signal !== "SIGKILL" && signal !== "SIGTERM") return;
			tearingDown = true;
			terminal.resume();
			flush();
			armEofGrace();
		}
	};
}
//#endregion
export { spawnBunTerminalPty };
