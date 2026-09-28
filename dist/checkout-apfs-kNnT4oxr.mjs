import { t as nativeWorktreeFilesystem } from "./filesystem-native-D_acqeQ4.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { setImmediate, setTimeout } from "node:timers/promises";
import { isUtf8 } from "node:buffer";
import { createHash } from "node:crypto";
//#region src/agents/worktrees/checkout-apfs.ts
function parseIndex(data) {
	const algorithm = ["sha1", "sha256"].find((candidate) => {
		const size = candidate === "sha1" ? 20 : 32;
		return data.length >= 12 + size && createHash(candidate).update(data.subarray(0, -size)).digest().equals(data.subarray(-size));
	});
	if (!algorithm || data.toString("ascii", 0, 4) !== "DIRC" || ![2, 3].includes(data.readUInt32BE(4))) return;
	const hashSize = algorithm === "sha1" ? 20 : 32;
	const end = data.length - hashSize;
	const entries = [];
	let offset = 12;
	let previous;
	for (let i = 0; i < data.readUInt32BE(8); i++) {
		const start = offset;
		const nameStart = start + 42 + hashSize;
		if (nameStart >= end || (data.readUInt16BE(nameStart - 2) & 61440) !== 0) return;
		const nameEnd = data.indexOf(0, nameStart);
		if (nameEnd < nameStart || nameEnd >= end) return;
		const bytes = data.subarray(nameStart, nameEnd);
		const name = bytes.toString("utf8");
		if ((data.readUInt16BE(nameStart - 2) & 4095) !== Math.min(bytes.length, 4095) || !isUtf8(bytes) || previous && Buffer.compare(previous, bytes) >= 0 || name.split("/").some((part) => !part || part === "." || part === ".." || part.toLowerCase() === ".git")) return;
		previous = bytes;
		offset = start + Math.ceil((nameEnd + 1 - start) / 8) * 8;
		if (offset > end || !data.subarray(nameEnd, offset).every((byte) => byte === 0)) return;
		entries.push({
			offset: start,
			name
		});
	}
	const entriesEnd = offset;
	const extensions = [];
	while (offset < end) {
		if (offset + 8 > end || data[offset] < 65 || data[offset] > 90) return;
		const next = offset + 8 + data.readUInt32BE(offset + 4);
		if (next > end) return;
		if (data.toString("ascii", offset, offset + 4) === "TREE") extensions.push(data.subarray(offset, next));
		offset = next;
	}
	return {
		algorithm,
		hashSize,
		entries,
		entriesEnd,
		extensions
	};
}
function low32(value) {
	return Number(value & 4294967295n);
}
function matchesSource(data, offset, stat) {
	const size = low32(stat.size) || (stat.size ? 2147483648 : 0);
	return stat.type === 1 && data.readUInt32BE(offset) === stat.ctimeSec >>> 0 && data.readUInt32BE(offset + 4) === stat.ctimeNs && data.readUInt32BE(offset + 8) === stat.mtimeSec >>> 0 && data.readUInt32BE(offset + 12) === stat.mtimeNs && data.readUInt32BE(offset + 16) === stat.dev && data.readUInt32BE(offset + 20) === low32(stat.ino) && (data.readUInt32BE(offset + 24) & 64) === (stat.mode & 64) && data.readUInt32BE(offset + 28) === stat.uid && data.readUInt32BE(offset + 32) === stat.gid && data.readUInt32BE(offset + 36) === size;
}
/** Translate only clone-proven stat identities; Git still validates the result. */
async function copyApfsCloneIndex(source, destination, sourceIndex, destinationIndex, options) {
	const handle = await fs.open(sourceIndex, "r");
	const { data, stamp } = await (async () => {
		try {
			const before = await handle.stat({ bigint: true });
			const contents = await handle.readFile();
			const after = await handle.stat({ bigint: true });
			return {
				data: before.mtimeNs === after.mtimeNs && before.ctimeNs === after.ctimeNs && before.size === after.size ? contents : void 0,
				stamp: before
			};
		} finally {
			await handle.close();
		}
	})();
	const parsed = data && parseIndex(data);
	if (!data || !parsed) return false;
	const deadline = (Math.floor(options.cloneCompletedAtMs / 1e3) + 1) * 1e3;
	const remainingMs = Math.min(1e3, deadline - Date.now());
	if (remainingMs > 0) await setTimeout(remainingMs, void 0, { signal: options.signal });
	const bodySize = parsed.entriesEnd + parsed.extensions.reduce((size, extension) => size + extension.length, 0);
	const updated = Buffer.allocUnsafe(bodySize + parsed.hashSize);
	data.copy(updated, 0, 0, parsed.entriesEnd);
	let extensionOffset = parsed.entriesEnd;
	for (const extension of parsed.extensions) {
		extension.copy(updated, extensionOffset);
		extensionOffset += extension.length;
	}
	const sourcePrefix = path.join(source, ".") + path.sep;
	const destinationPrefix = path.join(destination, ".") + path.sep;
	const indexSecond = Number(stamp.mtimeNs / 1000000000n);
	for (let start = 0; start < parsed.entries.length; start += 256) {
		const entries = [];
		const end = Math.min(start + 256, parsed.entries.length);
		for (let index = start; index < end; index++) {
			const entry = parsed.entries[index];
			if ((data.readUInt32BE(entry.offset + 24) & 61440) === 32768 && data.readUInt32BE(entry.offset + 8) < indexSecond) entries.push(entry);
		}
		options.signal?.throwIfAborted();
		options.commitGuard();
		if (entries.length === 0) {
			await setImmediate();
			continue;
		}
		const snapshotSecond = Math.floor(Date.now() / 1e3);
		const paths = [];
		for (const entry of entries) paths.push(sourcePrefix + entry.name, destinationPrefix + entry.name);
		const metadata = await nativeWorktreeFilesystem.readMetadata(paths, options);
		options.signal?.throwIfAborted();
		options.commitGuard();
		for (let index = 0; index < entries.length; index++) {
			const offset = entries[index].offset;
			const original = metadata[index * 2];
			const cloned = metadata[index * 2 + 1];
			if (!original || !cloned || !matchesSource(data, offset, original) || cloned.type !== 1 || cloned.ctimeSec >= snapshotSecond || !original.cloneId || original.cloneId !== cloned.cloneId || original.dev !== cloned.dev || original.ino === cloned.ino || original.size !== cloned.size || original.mtimeSec !== cloned.mtimeSec || original.mtimeNs !== cloned.mtimeNs || (original.mode & 64) !== (cloned.mode & 64)) continue;
			updated.writeUInt32BE(cloned.ctimeSec >>> 0, offset);
			updated.writeUInt32BE(cloned.ctimeNs, offset + 4);
			updated.writeUInt32BE(cloned.dev, offset + 16);
			updated.writeUInt32BE(low32(cloned.ino), offset + 20);
			updated.writeUInt32BE(cloned.uid, offset + 28);
			updated.writeUInt32BE(cloned.gid, offset + 32);
		}
	}
	const body = updated.subarray(0, bodySize);
	options.signal?.throwIfAborted();
	options.commitGuard();
	createHash(parsed.algorithm).update(body).digest().copy(updated, bodySize);
	await fs.writeFile(destinationIndex, updated);
	return true;
}
//#endregion
export { copyApfsCloneIndex };
