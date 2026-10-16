import { c as isRecord } from "../record-coerce-TIsquoVR.mjs";
import { n as serveWorkerTasks } from "../worker-task-server-BC_7U18u.mjs";
import fs from "node:fs";
import { matchRootFileOpenFailure, openRootFileSync, readFileWindowFullySync } from "@openclaw/fs-safe/advanced";
//#region src/gateway/control-ui-file.ts
function readControlUiFile(input) {
	const opened = openRootFileSync({
		absolutePath: input.filePath,
		rootPath: input.rootPath,
		rootRealPath: input.rootRealPath,
		boundaryLabel: "control ui root",
		skipLexicalRootCheck: true,
		rejectSymlinks: false,
		rejectHardlinks: input.rejectHardlinks
	});
	if (!opened.ok) return matchRootFileOpenFailure(opened, {
		io: (failure) => {
			throw failure.error;
		},
		fallback: () => null
	});
	try {
		const snapshot = {
			path: opened.path,
			size: opened.stat.size,
			mtimeMs: opened.stat.mtimeMs
		};
		if (!input.readBody) return snapshot;
		if (opened.stat.size > 2 ** 31 - 1) throw Object.assign(/* @__PURE__ */ new RangeError("Control UI file exceeds the 2 GiB read limit"), { code: "ERR_FS_FILE_TOO_LARGE" });
		const body = new Uint8Array(opened.stat.size);
		const offset = readFileWindowFullySync(opened.fd, Buffer.from(body.buffer), 0);
		snapshot.body = offset === body.length ? body : body.slice(0, offset);
		return snapshot;
	} finally {
		fs.closeSync(opened.fd);
	}
}
//#endregion
//#region src/gateway/control-ui-file.worker.ts
serveWorkerTasks((input) => {
	if (!isRecord(input) || typeof input.rootPath !== "string" || input.rootRealPath !== void 0 && typeof input.rootRealPath !== "string" || typeof input.filePath !== "string" || typeof input.rejectHardlinks !== "boolean" || typeof input.readBody !== "boolean") throw new Error("Invalid Control UI file read request");
	return readControlUiFile({
		rootPath: input.rootPath,
		rootRealPath: input.rootRealPath,
		filePath: input.filePath,
		rejectHardlinks: input.rejectHardlinks,
		readBody: input.readBody
	});
}, { transferList: (snapshot) => snapshot?.body?.buffer instanceof ArrayBuffer ? [snapshot.body.buffer] : [] });
//#endregion
export {};
