import { c as isRecord, l as isStringRecord } from "./record-coerce-DItp3I4t.mjs";
//#region src/process/terminal-pty-protocol.ts
function decodeTerminalPtyControl(raw) {
	if (!isRecord(raw)) return;
	if (raw.type === "start") {
		const params = raw.params;
		if (isRecord(params) && typeof params.file === "string" && Array.isArray(params.args) && params.args.every((arg) => typeof arg === "string") && (params.cwd === void 0 || typeof params.cwd === "string") && (params.env === void 0 || isStringRecord(params.env)) && (params.name === void 0 || typeof params.name === "string") && typeof params.cols === "number" && typeof params.rows === "number") return {
			type: "start",
			params: {
				file: params.file,
				args: params.args,
				cwd: params.cwd,
				env: params.env,
				name: params.name,
				cols: params.cols,
				rows: params.rows
			}
		};
	} else if (raw.type === "input") {
		if (typeof raw.data === "string") return {
			type: "input",
			data: raw.data
		};
		if (typeof raw.dataBase64 === "string") return {
			type: "input",
			dataBase64: raw.dataBase64
		};
	} else if (raw.type === "resize" && typeof raw.cols === "number" && typeof raw.rows === "number") return {
		type: "resize",
		cols: raw.cols,
		rows: raw.rows
	};
	else if (raw.type === "kill" && (raw.signal === void 0 || typeof raw.signal === "string")) return {
		type: "kill",
		signal: raw.signal
	};
}
function decodeTerminalPtyEvent(raw) {
	if (!isRecord(raw)) return;
	if (raw.type === "boot") return { type: "boot" };
	if (raw.type === "ready" && typeof raw.pid === "number" && Number.isInteger(raw.pid) && raw.pid > 0) return {
		type: "ready",
		pid: raw.pid
	};
	if (raw.type === "error" && typeof raw.message === "string") return {
		type: "error",
		message: raw.message
	};
	if (raw.type === "exit" && typeof raw.exitCode === "number" && (raw.signal === void 0 || typeof raw.signal === "number")) return {
		type: "exit",
		exitCode: raw.exitCode,
		signal: raw.signal
	};
}
//#endregion
export { decodeTerminalPtyEvent as n, decodeTerminalPtyControl as t };
