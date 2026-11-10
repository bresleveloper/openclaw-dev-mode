import { t as SpawnBrokerError } from "./protocol-foRdUdX7.mjs";
//#region src/process/spawn-broker/pipe.ts
const readers = /* @__PURE__ */ new WeakMap();
const holdReadable = () => {};
/** Command brokerage requires Node's transferable POSIX pipe handles. */
function supportsSpawnBrokerCommandTransport() {
	return process.platform !== "win32" && !process.versions.bun;
}
/** Defer consumption and EOF until the transferred socket is ready for its caller. */
function holdPipe(socket) {
	const held = {
		read: socket.read.bind(socket),
		resumed: false,
		onResume: () => {
			held.resumed = true;
		}
	};
	readers.set(socket, held);
	socket.on("resume", held.onResume);
	socket.on("readable", holdReadable);
	socket.read = () => null;
}
/** Restore native stdin's write-only direction after Node's duplex IPC handoff. */
function restoreStdinPipe(socket) {
	const state = Reflect.get(socket, "_readableState");
	if (!state || typeof state !== "object" || [
		"ended",
		"endEmitted",
		"reading"
	].some((flag) => typeof Reflect.get(state, flag) !== "boolean")) throw new SpawnBrokerError("Spawn broker requires a Node readable state for stdin");
	stopPipeReads(socket);
	Object.assign(state, {
		readable: false,
		ended: true,
		endEmitted: true,
		reading: false
	});
}
function stopPipeReads(socket) {
	const handle = Reflect.get(socket, "_handle");
	if (!handle || typeof handle !== "object" || !("readStop" in handle) || typeof handle.readStop !== "function" || !("reading" in handle) || typeof handle.reading !== "boolean") throw new SpawnBrokerError("Spawn broker requires a transferable Node pipe handle");
	if (handle.readStop() !== 0) throw new SpawnBrokerError("Spawn broker could not stop pipe reads");
	handle.reading = false;
}
/** Publish stream data and EOF after the caller's readiness continuation. */
function releasePipe(socket) {
	const held = restoreReader(socket);
	if (!held) return;
	process.nextTick(() => {
		if (socket.destroyed) return;
		socket.emit("readable");
		if (held.resumed) socket.resume();
	});
}
function restoreReader(socket) {
	const held = readers.get(socket);
	if (!held) return;
	socket.read = held.read;
	readers.delete(socket);
	socket.removeListener("resume", held.onResume);
	socket.removeListener("readable", holdReadable);
	return held;
}
//#endregion
export { supportsSpawnBrokerCommandTransport as i, releasePipe as n, restoreStdinPipe as r, holdPipe as t };
