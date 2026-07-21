import { p as resolveGatewaySystemdServiceName } from "./constants-obO8goqF.js";
import { l as readSystemdServiceRuntime } from "./systemd-Hq_NZE0o.js";
import { o as buildGatewayConnectionDetails } from "./call-5Sj7eTyY.js";
import { spawn } from "node:child_process";
//#region src/cli/logs-cli.runtime.ts
const STDERR_MAX_BYTES = 64 * 1024;
function appendByteTail(tail, chunk, maxBytes) {
	tail.chunks.push(chunk);
	tail.bytes += chunk.length;
	while (tail.bytes > maxBytes && tail.chunks.length > 0) {
		const first = tail.chunks[0];
		const overflow = tail.bytes - maxBytes;
		if (first.length <= overflow) {
			tail.chunks.shift();
			tail.bytes -= first.length;
		} else {
			tail.chunks[0] = first.subarray(overflow);
			tail.bytes -= overflow;
		}
		tail.truncated = true;
	}
}
function decodeUtf8Tail(tail) {
	const buffer = Buffer.concat(tail.chunks, tail.bytes);
	if (!tail.truncated || buffer.length === 0) return buffer.toString("utf8");
	let offset = 0;
	while (offset < buffer.length && (buffer[offset] & 192) === 128) offset += 1;
	return buffer.subarray(offset).toString("utf8");
}
async function execFileUtf8Tail(command, args, options) {
	return await new Promise((resolve) => {
		const child = spawn(command, args, {
			env: options.env,
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		});
		const stdoutTail = {
			chunks: [],
			bytes: 0,
			truncated: false
		};
		const stderrTail = {
			chunks: [],
			bytes: 0,
			truncated: false
		};
		let settled = false;
		child.stdout?.on("data", (chunk) => {
			appendByteTail(stdoutTail, chunk, options.maxBytes);
		});
		child.stderr?.on("data", (chunk) => {
			appendByteTail(stderrTail, chunk, STDERR_MAX_BYTES);
		});
		const resolveWithError = (error, terminateChild = false) => {
			if (settled) return;
			settled = true;
			if (terminateChild) child.kill();
			resolve({
				stdout: decodeUtf8Tail(stdoutTail),
				stderr: error instanceof Error ? error.message : String(error),
				code: 1,
				truncated: stdoutTail.truncated
			});
		};
		child.stdout?.on("error", (error) => resolveWithError(error, true));
		child.stderr?.on("error", (error) => resolveWithError(error, true));
		child.on("error", resolveWithError);
		child.on("close", (code) => {
			if (settled) return;
			settled = true;
			resolve({
				stdout: decodeUtf8Tail(stdoutTail),
				stderr: decodeUtf8Tail(stderrTail),
				code: typeof code === "number" ? code : 1,
				truncated: stdoutTail.truncated
			});
		});
	});
}
//#endregion
export { buildGatewayConnectionDetails, execFileUtf8Tail, readSystemdServiceRuntime, resolveGatewaySystemdServiceName };
