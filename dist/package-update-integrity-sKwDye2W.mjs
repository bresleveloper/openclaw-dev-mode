import { t as hasErrnoCode } from "./errno-CkbDOfLk.mjs";
import "./errors-DnjwnOju.mjs";
import { t as createSubsystemLogger } from "./subsystem-DleLyu58.mjs";
import { i as UPDATE_RUNNER_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-BXzjx6E8.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { createHash } from "node:crypto";
//#region src/infra/package-update-integrity.ts
const MAX_TREE_BYTES = 1073741824;
const MAX_TREE_ENTRIES = 5e4;
const MAX_MANIFEST_BYTES = 1048576;
const MAX_LAUNCHER_BYTES = 1048576;
const log = createSubsystemLogger("update/package-integrity");
let readerSequence = 0;
function packageLauncherDifferences(expected, actual, ownershipPreserved = true) {
	const symlink = expected.type === "symlink" && actual.type === "symlink";
	return [
		"type",
		"mode",
		"uid",
		"gid",
		"contents"
	].filter((field) => !(symlink && (field === "mode" || !ownershipPreserved && (field === "uid" || field === "gid"))) && expected[field] !== actual[field]).map((field) => field === "contents" && symlink ? "target" : field);
}
var PackageIntegrityTimeoutError = class extends Error {
	constructor(budgetMs) {
		super("Package rollback verification timed out");
		this.budgetMs = budgetMs;
	}
};
/** Resource exhaustion is distinct from a filesystem-integrity failure. */
var PackageIntegrityLimitError = class extends Error {
	constructor(resource) {
		super(`Package rollback verification ${resource} limit exceeded`);
		this.resource = resource;
	}
};
async function readPackageVersionIfPresent(packageRoot) {
	return packageRoot ? readPackageVersion(packageRoot) : null;
}
function identity(stat) {
	return `${stat.dev}:${stat.ino}`;
}
function metadata(stat) {
	return [
		identity(stat),
		stat.mode.toString(),
		stat.uid.toString(),
		stat.gid.toString(),
		stat.nlink.toString(),
		stat.size.toString(),
		stat.mtimeNs.toString(),
		stat.ctimeNs.toString()
	];
}
function unchanged(left, right) {
	return left.ino !== 0n && metadata(left).join("/") === metadata(right).join("/");
}
/** Read-only, bounded observations. These do not exclude writers or seal an inode. */
function createPackageIntegrityReader(timeoutMs = UPDATE_RUNNER_TIMEOUT_MS) {
	const startedAtMonotonicMs = performance.now();
	const budget = Number.isFinite(timeoutMs) ? Math.max(1, timeoutMs) : UPDATE_RUNNER_TIMEOUT_MS;
	const deadline = Date.now() + budget;
	const timing = {
		readerId: `${process.pid}:${++readerSequence}`,
		timeOriginUnixMs: performance.timeOrigin,
		startedAtMonotonicMs,
		budgetMs: budget,
		deadlineClock: "wall",
		deadlineAtUnixMs: deadline
	};
	let timeoutObservedAtMonotonicMs;
	let pendingIo = 0;
	async function trackIo(operation) {
		pendingIo++;
		try {
			return await operation();
		} finally {
			pendingIo--;
		}
	}
	async function observe(phase, operation) {
		const emit = (event, facts) => {
			try {
				log.debug(event, {
					...timing,
					phase,
					event,
					...facts
				});
			} catch {}
		};
		emit("reader-started");
		let outcome = "failed";
		try {
			const result = await operation();
			outcome = "completed";
			return result;
		} finally {
			const settledAtMonotonicMs = performance.now();
			emit("reader-settled", {
				settledAtMonotonicMs,
				elapsedMs: settledAtMonotonicMs - startedAtMonotonicMs,
				outcome: timeoutObservedAtMonotonicMs === void 0 ? outcome : "timed-out",
				timeoutObservedAtMonotonicMs,
				pendingIo
			});
		}
	}
	async function read(operation, closeLate) {
		let pending;
		const value = await awaitWithinDeadline(() => pending = trackIo(operation), deadline);
		if (value === ABSOLUTE_DEADLINE_EXPIRED) {
			timeoutObservedAtMonotonicMs ??= performance.now();
			if (pending && closeLate) pending.then((late) => trackIo(() => closeLate(late)), () => {}).catch(() => {});
			throw new PackageIntegrityTimeoutError(budget);
		}
		return value;
	}
	async function close(resource) {
		const closing = trackIo(() => resource.close()).catch(() => {});
		if (await awaitWithinDeadline(() => closing, deadline) === ABSOLUTE_DEADLINE_EXPIRED) timeoutObservedAtMonotonicMs ??= performance.now();
	}
	async function entries(directoryPath, limit = MAX_TREE_ENTRIES) {
		const directory = await read(() => fs$1.opendir(directoryPath), (late) => late.close());
		const children = [];
		try {
			while (true) {
				const child = await read(() => directory.read());
				if (!child) break;
				if (children.length >= limit) throw new PackageIntegrityLimitError("entry");
				children.push(child.name);
			}
		} finally {
			await close(directory);
		}
		return children.toSorted();
	}
	async function hashFile(file, stat, remainingBytes) {
		if (!stat.isFile()) throw new Error("Package rollback verification byte limit exceeded");
		if (stat.size > BigInt(remainingBytes)) throw new PackageIntegrityLimitError("byte");
		const handle = await read(() => fs$1.open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK), (late) => late.close());
		try {
			if (!unchanged(stat, await read(() => handle.stat({ bigint: true })))) throw new Error("Package rollback file changed before reading");
			const hash = createHash("sha256");
			const buffer = Buffer.allocUnsafe(65536);
			const size = Number(stat.size);
			let position = 0;
			while (position < size) {
				const { bytesRead } = await read(() => handle.read(buffer, 0, Math.min(buffer.length, size - position), position));
				if (bytesRead === 0) throw new Error("Package rollback file changed while reading");
				position += bytesRead;
				hash.update(buffer.subarray(0, bytesRead));
			}
			if (!unchanged(stat, await read(() => handle.stat({ bigint: true })))) throw new Error("Package rollback file changed while reading");
			return {
				digest: hash.digest("hex"),
				bytes: position
			};
		} finally {
			await close(handle);
		}
	}
	async function tree(root, originalRoot = root) {
		const digest = createHash("sha256");
		const observed = [];
		const hardlinks = /* @__PURE__ */ new Map();
		let bytes = 0;
		let remainingEntries = 49999;
		let device;
		let rootIdentity = "";
		async function visit(file, relative) {
			const stat = await read(() => fs$1.lstat(file, { bigint: true }));
			if (stat.ino === 0n || device !== void 0 && device !== stat.dev) throw new Error("Package rollback filesystem identity is unavailable");
			if (!relative) {
				if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("Package rollback root is not a retained directory");
				device = stat.dev;
				rootIdentity = identity(stat);
			}
			observed.push({
				file,
				stat
			});
			const fields = metadata(stat);
			if (!relative) fields.pop();
			digest.update(JSON.stringify([relative, fields]));
			if (stat.isSymbolicLink()) {
				const target = await read(() => fs$1.readlink(file));
				const resolved = path.relative(originalRoot, path.resolve(path.dirname(path.join(originalRoot, relative)), target));
				let descended = false;
				for (const segment of target.split(/[\\/]+/)) {
					if (!segment || segment === ".") continue;
					if (segment === ".." && descended) throw new Error("Package rollback symlink has ambiguous parent traversal");
					descended ||= segment !== "..";
				}
				if (path.isAbsolute(resolved) || resolved === ".." || resolved.startsWith(`..${path.sep}`)) throw new Error("Package rollback symlink leaves the retained tree");
				digest.update(JSON.stringify(["symlink", target]));
			} else if (stat.isFile()) {
				const contents = await hashFile(file, stat, MAX_TREE_BYTES - bytes);
				bytes += contents.bytes;
				const key = identity(stat);
				const owner = stat.nlink > 1n ? hardlinks.get(key) ?? relative : null;
				if (owner !== null) hardlinks.set(key, owner);
				digest.update(JSON.stringify([
					"file",
					owner,
					contents.digest
				]));
			} else if (stat.isDirectory()) {
				const children = await entries(file, remainingEntries);
				remainingEntries -= children.length;
				for (const child of children) await visit(path.join(file, child), relative ? `${relative}/${child}` : child);
			} else throw new Error("Package rollback contains a non-file entry");
		}
		await visit(root, "");
		const version = await read(() => readPackageVersion(root, { maxBytes: MAX_MANIFEST_BYTES }));
		if (!version) throw new Error("Package rollback version is unavailable");
		for (const entry of observed) if (!unchanged(entry.stat, await read(() => fs$1.lstat(entry.file, { bigint: true })))) throw new Error("Package rollback tree changed during verification");
		return {
			digest: digest.digest("hex"),
			identity: rootIdentity,
			version
		};
	}
	async function rootEntry(root, originalRoot = root, expectedKind) {
		const stat = await read(() => fs$1.lstat(root, { bigint: true }));
		if (expectedKind && expectedKind !== (stat.isSymbolicLink() ? "link" : "directory")) throw new Error("Package rollback root entry kind changed");
		if (!stat.isSymbolicLink()) return {
			kind: "directory",
			tree: await tree(root, originalRoot)
		};
		const target = await read(() => fs$1.readlink(root));
		if (!unchanged(stat, await read(() => fs$1.lstat(root, { bigint: true })))) throw new Error("Package rollback link changed while reading");
		return {
			kind: "link",
			metadata: metadata(stat).slice(0, -1),
			target
		};
	}
	async function directoryIdentity(root) {
		const stat = await read(() => fs$1.lstat(root, { bigint: true }));
		if (stat.isSymbolicLink()) return null;
		if (!stat.isDirectory() || stat.ino === 0n) throw new Error("Package rollback filesystem identity is unavailable");
		const version = await read(() => readPackageVersion(root, { maxBytes: MAX_MANIFEST_BYTES }));
		if (!version || !unchanged(stat, await read(() => fs$1.lstat(root, { bigint: true })))) throw new Error("Package rollback identity changed or version is unavailable");
		return {
			identity: identity(stat),
			version
		};
	}
	async function launcher(file) {
		const stat = await read(() => fs$1.lstat(file, { bigint: true }));
		const contents = stat.isSymbolicLink() ? await read(() => fs$1.readlink(file)) : (await hashFile(file, stat, MAX_LAUNCHER_BYTES)).digest;
		if (!unchanged(stat, await read(() => fs$1.lstat(file, { bigint: true })))) throw new Error("Package rollback launcher changed during verification");
		return {
			type: stat.isSymbolicLink() ? "symlink" : "file",
			mode: stat.mode.toString(),
			uid: stat.uid.toString(),
			gid: stat.gid.toString(),
			contents
		};
	}
	async function exists(file) {
		try {
			await read(() => fs$1.lstat(file));
			return true;
		} catch (error) {
			if (hasErrnoCode(error, "ENOENT")) return false;
			throw error;
		}
	}
	return {
		tree,
		rootEntry,
		directoryIdentity,
		launcher,
		exists,
		entries,
		observe
	};
}
//#endregion
export { readPackageVersionIfPresent as a, packageLauncherDifferences as i, PackageIntegrityTimeoutError as n, createPackageIntegrityReader as r, PackageIntegrityLimitError as t };
