import { n as safeParseJsonRecord } from "./json-coercion-pfKbZnCJ.mjs";
//#region src/media/remote-workspace-file.ts
const REMOTE_FILE_READER = String.raw`
try {
  const fs = require("node:fs"), path = require("node:path");
  const [file, maxText, offsetText, chunkText, workspace] = process.argv.slice(1);
  const max = Number(maxText), offset = Number(offsetText), chunk = Number(chunkText);
  if (!Number.isSafeInteger(max) || max < 0) throw Error("invalid media byte limit");
  if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(chunk) || chunk <= 0) throw Error("invalid media chunk");
  if (fs.lstatSync(file).isSymbolicLink()) throw Error("symbolic links are not allowed");
  const fd = fs.openSync(file, fs.constants.O_RDONLY | (fs.constants.O_NOFOLLOW ?? 0));
  try {
    const before = fs.fstatSync(fd);
    if (!before.isFile()) throw Error("not a regular file");
    if (workspace) {
      const descriptor = process.platform === "linux" ? fs.realpathSync("/proc/self/fd/" + fd) : fs.realpathSync(file);
      const relative = path.relative(fs.realpathSync(workspace), descriptor);
      if (!relative || relative === ".." || relative.startsWith(".." + path.sep) || path.isAbsolute(relative)) throw Error("file escapes remote workspace");
      const verified = fs.statSync(descriptor);
      if (verified.dev !== before.dev || verified.ino !== before.ino) throw Error("file changed while being opened");
    }
    if (before.size > max) throw Error("file exceeds limit of " + max + " bytes");
    if (offset > before.size) throw Error("file changed while being read");
    const expected = Math.min(chunk, before.size - offset), buffer = Buffer.allocUnsafe(expected);
    let total = 0;
    while (total < buffer.length) {
      const count = fs.readSync(fd, buffer, total, buffer.length - total, offset + total);
      if (count === 0) break;
      total += count;
    }
    if (total !== expected) throw Error("file changed while being read");
    const after = fs.fstatSync(fd);
    const revision = stat => [stat.dev, stat.ino, stat.size, stat.mtimeMs, stat.ctimeMs].join(":");
    if (!after.isFile() || revision(after) !== revision(before)) throw Error("file changed while being read");
    process.stdout.write(JSON.stringify({ dataBase64: buffer.toString("base64"), size: before.size, revision: revision(before) }));
  } finally { fs.closeSync(fd); }
} catch (error) { process.stderr.write(error instanceof Error ? error.message : String(error)); process.exitCode = 1; }
`;
/** Transport owns dispatch and its environment; this reader owns bounded file transfer. */
function createBoundedRemoteFileReader(binding) {
	if (!Number.isSafeInteger(binding.outputBytesCap) || binding.outputBytesCap < 1024) throw new Error("Remote file command output cap must be at least 1024 bytes.");
	const chunkBytes = Math.floor(binding.outputBytesCap / 2);
	return async (params) => {
		const check = () => {
			binding.assertCurrent();
			params.signal?.throwIfAborted();
		};
		check();
		if (!Number.isSafeInteger(params.maxBytes) || params.maxBytes < 0) throw new Error("Remote workspace file transfer requires a valid media byte limit.");
		const chunks = [];
		let offset = 0;
		let expectedSize;
		let expectedRevision;
		const startedAt = performance.now();
		do {
			check();
			const timeoutMs = params.timeoutMs === void 0 ? void 0 : Math.floor(params.timeoutMs - (performance.now() - startedAt));
			if (timeoutMs !== void 0 && timeoutMs <= 0) throw new Error("Remote workspace file transfer timed out.");
			const stdout = await binding.execute([
				"node",
				"-e",
				REMOTE_FILE_READER,
				"--",
				params.path,
				String(params.maxBytes),
				String(offset),
				String(chunkBytes),
				...params.workspaceRoot ? [params.workspaceRoot] : []
			], {
				signal: params.signal,
				timeoutMs
			});
			check();
			if (typeof stdout !== "string" || Buffer.byteLength(stdout) > binding.outputBytesCap) throw new Error("Remote workspace artifact exceeded the command output cap.");
			const chunk = safeParseJsonRecord(stdout);
			if (!chunk || typeof chunk.dataBase64 !== "string" || typeof chunk.size !== "number" || !Number.isSafeInteger(chunk.size) || chunk.size < 0 || chunk.size > params.maxBytes || typeof chunk.revision !== "string" || !chunk.revision) throw new Error("Remote workspace artifact returned invalid or oversized chunk data.");
			expectedSize ??= chunk.size;
			expectedRevision ??= chunk.revision;
			if (chunk.size !== expectedSize || chunk.revision !== expectedRevision) throw new Error("Remote workspace artifact changed during chunked transfer.");
			const expectedChunkBytes = Math.min(chunkBytes, expectedSize - offset);
			if (chunk.dataBase64.length > Math.ceil(expectedChunkBytes / 3) * 4) throw new Error("Remote workspace artifact returned oversized chunk data.");
			const buffer = Buffer.from(chunk.dataBase64, "base64");
			if (buffer.byteLength !== expectedChunkBytes || buffer.toString("base64") !== chunk.dataBase64) throw new Error("Remote workspace artifact returned invalid chunk data.");
			chunks.push(buffer);
			offset += buffer.byteLength;
		} while (offset < expectedSize);
		return Buffer.concat(chunks, offset);
	};
}
//#endregion
export { createBoundedRemoteFileReader as t };
