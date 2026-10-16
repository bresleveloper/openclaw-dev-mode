import { o as isPidDefinitelyDead } from "./pid-alive-CPS_shDt.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as isRosettaTranslatedProcess } from "./rosetta-translation-DvPrY0r4.mjs";
import { createRequire } from "node:module";
//#region src/process/supervisor/darwin-process-command.ts
let native;
let reportedForeignArguments = false;
function loadNative() {
	const koffi = createRequire(import.meta.url)("koffi");
	const sysctl = koffi.load("/usr/lib/libSystem.B.dylib").func("int sysctl(const int *name, unsigned int namelen, void *oldp, size_t *oldlenp, const void *newp, size_t newlen)");
	const size = Buffer.alloc(8);
	const argMax = Buffer.alloc(4);
	size.writeBigUInt64LE(4n);
	if (sysctl(new Int32Array([1, 8]), 2, argMax, size, null, 0) !== 0 || argMax.readInt32LE() <= 4) throw new Error("Darwin process argument limit is unavailable");
	const buffer = Buffer.alloc(argMax.readInt32LE());
	return { readArguments(pid) {
		size.writeBigUInt64LE(BigInt(buffer.length));
		if (sysctl(new Int32Array([
			1,
			49,
			pid
		]), 3, buffer, size, null, 0) !== 0) return { errno: koffi.errno() };
		const length = Number(size.readBigUInt64LE());
		if (length < 4 || length > buffer.length) throw new Error(`Incomplete Darwin process arguments for PID ${pid}`);
		return { bytes: buffer.subarray(0, length) };
	} };
}
function parseArguments(bytes, pid) {
	const argc = bytes.readInt32LE();
	let offset = bytes.indexOf(0, 4);
	if (argc <= 0 || argc > bytes.length || offset <= 4) throw new Error(`Invalid Darwin process arguments for PID ${pid}`);
	while (offset < bytes.length && bytes[offset] === 0) offset++;
	const argv = [];
	for (let index = 0; index < argc; index++) {
		const end = bytes.indexOf(0, offset);
		if (end < 0) throw new Error(`Truncated Darwin process arguments for PID ${pid}`);
		argv.push(bytes.toString("utf8", offset, end));
		offset = end + 1;
	}
	const marker = bytes.toString("utf8", offset).split("\0").find((entry) => entry.startsWith("OPENCLAW_SERVICE_MARKER="));
	return {
		argv,
		...marker ? { serviceMarker: marker.slice(24) } : {}
	};
}
/** Exact argv, or observed foreign ownership when Darwin denies argument inspection. */
function readDarwinProcessCommand(pid, uid) {
	if (isRosettaTranslatedProcess()) throw new Error("Cannot inspect Darwin process arguments under Rosetta; run OpenClaw with native arm64 Node.js.");
	native ??= loadNative();
	const result = native.readArguments(pid);
	if ("bytes" in result) return parseArguments(result.bytes, pid);
	if (isPidDefinitelyDead(pid)) return;
	const currentUid = process.getuid?.();
	if (uid !== void 0 && currentUid !== void 0 && uid !== currentUid) {
		if (!reportedForeignArguments) {
			reportedForeignArguments = true;
			createSubsystemLogger("process/census").debug("Unreadable Darwin arguments for another UID do not establish capture custody.", {
				pid,
				uid,
				errno: result.errno
			});
		}
		return {
			argvUnavailable: true,
			uid
		};
	}
	throw new Error(`Could not classify PID ${pid}: cannot inspect Darwin arguments (errno ${result.errno}).`);
}
//#endregion
export { readDarwinProcessCommand as t };
