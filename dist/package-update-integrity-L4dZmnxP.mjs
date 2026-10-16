import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import "./errors-O33D01XW.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { i as UPDATE_RUNNER_TIMEOUT_MS } from "./update-run-timeouts-Byb-PlTk.mjs";
import { n as awaitWithinDeadline, t as ABSOLUTE_DEADLINE_EXPIRED } from "./absolute-deadline-DoGHpXtD.mjs";
import { i as readPackageVersion } from "./package-json-DuhFvY5l.mjs";
import { constants } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { availableParallelism } from "node:os";
import { createHash } from "node:crypto";
import { Worker } from "node:worker_threads";
//#region src/infra/package-update-integrity-hasher.ts
const log$1 = createSubsystemLogger("update/package-integrity");
const workerSource = String.raw`
const fs = require("node:fs");
const { createHash } = require("node:crypto");
const { parentPort, workerData: { cancel } } = require("node:worker_threads");
const buffer = Buffer.allocUnsafe(64 * 1024);
const fields = ["dev", "ino", "mode", "uid", "gid", "nlink", "size", "mtimeNs", "ctimeNs"];
const unchanged = (job, stat) => job.ino !== 0n && fields.every(key => job[key] === stat[key]);
const cancelled = Symbol("cancelled");
// The owner sets cancellation when its deadline expires; start no further I/O.
const admit = () => {
  if (Atomics.load(cancel, 0)) throw cancelled;
};
function hash(job) {
  admit();
  const fd = fs.openSync(job.file, fs.constants.O_RDONLY | fs.constants.O_NOFOLLOW | fs.constants.O_NONBLOCK);
  try {
    admit();
    if (!unchanged(job, fs.fstatSync(fd, { bigint: true }))) {
      throw new Error("Package rollback file changed before reading");
    }
    const digest = createHash("sha256");
    const size = Number(job.size);
    let position = 0;
    while (position < size) {
      admit();
      const count = fs.readSync(fd, buffer, 0, Math.min(buffer.length, size - position), position);
      if (count === 0) {
        throw new Error("Package rollback file changed while reading");
      }
      position += count;
      digest.update(buffer.subarray(0, count));
    }
    admit();
    if (!unchanged(job, fs.fstatSync(fd, { bigint: true }))) {
      throw new Error("Package rollback file changed while reading");
    }
    return { digest: digest.digest("hex") };
  } finally {
    try { fs.closeSync(fd); } catch {}
  }
}
parentPort.on("message", jobs => {
  if (jobs === "close") {
    parentPort.close();
    return;
  }
  const results = jobs.map(job => {
    try {
      return hash(job);
    } catch (error) {
      if (error === cancelled) return { cancelled: true };
      const { message, code, errno, syscall, path } = error;
      return { error: { message, code, errno, syscall, path } };
    }
  });
  parentPort.postMessage(results);
});
`;
/** One walk owns its workers, queue, and fallback; no file bytes survive a job. */
function createPackageFileHasher(fallback) {
	const width = Math.min(4, availableParallelism());
	const batchSize = 16;
	const cancel = new Int32Array(new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT));
	const slots = [];
	const queued = [];
	let closed = false;
	let flushing = false;
	let inProcess = false;
	let fallbackRunning = 0;
	function retire(slot) {
		if (slot.closing) return;
		slot.closing = true;
		if (slot.tasks.length) {
			try {
				slot.worker.postMessage("close", []);
			} catch {}
			slot.worker.unref();
		} else slot.worker.terminate().catch(() => {});
	}
	function useFallback(error) {
		if (!inProcess) {
			inProcess = true;
			Atomics.store(cancel, 0, 1);
			try {
				log$1.debug("package-file-hasher-fallback", { error });
			} catch {}
			for (const slot of slots) retire(slot);
		}
		dispatch();
	}
	function dispatch() {
		if (closed || !queued.length) {
			flushing = false;
			return;
		}
		if (inProcess) {
			const busy = slots.filter((slot) => slot.tasks.length).length;
			while (queued.length && fallbackRunning + busy < 4) {
				const task = queued.shift();
				fallbackRunning++;
				Promise.resolve().then(() => fallback(task.job.file, task.stat)).then(task.resolve, task.reject).finally(() => {
					fallbackRunning--;
					dispatch();
				});
			}
			return;
		}
		if (!flushing && queued.length < batchSize) return;
		let slot = slots.find((candidate) => !candidate.tasks.length);
		if (!slot && slots.length < width) try {
			const worker = new Worker(workerSource, {
				eval: true,
				execArgv: [],
				env: {},
				workerData: { cancel }
			});
			slot = {
				worker,
				tasks: [],
				closing: false,
				failed: false
			};
			slots.push(slot);
			const owner = slot;
			worker.on("message", (results) => {
				if (owner.failed) return;
				const tasks = owner.tasks;
				owner.tasks = [];
				for (const [index, task] of tasks.entries()) {
					const result = results[index];
					if ("cancelled" in result) {
						if (closed) task.reject(/* @__PURE__ */ new Error("Package file hashing cancelled"));
						else queued.push(task);
					} else if ("error" in result) {
						const { message, ...fields } = result.error;
						task.reject(Object.assign(new Error(message), Object.fromEntries(Object.entries(fields).filter(([, value]) => value !== void 0))));
					} else task.resolve(result.digest);
				}
				dispatch();
			});
			const failed = (error) => {
				owner.failed = true;
				useFallback(error);
			};
			worker.on("error", failed);
			worker.on("messageerror", failed);
			worker.on("exit", (code) => {
				const tasks = owner.tasks;
				owner.tasks = [];
				if (!owner.closing && !closed) useFallback(/* @__PURE__ */ new Error(`Package file hashing worker exited (${code})`));
				if (tasks.length) {
					if (closed) for (const task of tasks) task.reject(/* @__PURE__ */ new Error("Package file hashing cancelled"));
					else {
						queued.push(...tasks);
						useFallback(/* @__PURE__ */ new Error(`Package file hashing worker exited (${code})`));
					}
				}
				dispatch();
			});
		} catch (error) {
			useFallback(error);
			return;
		}
		if (slot) {
			slot.tasks = queued.splice(0, batchSize);
			try {
				slot.worker.postMessage(slot.tasks.map((task) => task.job), []);
				if (!queued.length) flushing = false;
				else dispatch();
			} catch (error) {
				slot.failed = true;
				useFallback(error);
			}
		}
	}
	return {
		hash(file, stat) {
			if (closed) return Promise.reject(/* @__PURE__ */ new Error("Package file hashing cancelled"));
			const { dev, ino, mode, uid, gid, nlink, size, mtimeNs, ctimeNs } = stat;
			return new Promise((resolve, reject) => {
				queued.push({
					job: {
						file,
						dev,
						ino,
						mode,
						uid,
						gid,
						nlink,
						size,
						mtimeNs,
						ctimeNs
					},
					stat,
					resolve,
					reject
				});
				dispatch();
			});
		},
		flush() {
			flushing = true;
			dispatch();
		},
		close() {
			closed = true;
			Atomics.store(cancel, 0, 1);
			for (const task of queued.splice(0)) task.reject(/* @__PURE__ */ new Error("Package file hashing cancelled"));
			for (const slot of slots) retire(slot);
		}
	};
}
//#endregion
//#region src/infra/package-update-integrity.ts
const MAX_TREE_BYTES = 1073741824;
const MAX_TREE_ENTRIES = 5e4;
const MAX_MANIFEST_BYTES = 1048576;
const MAX_LAUNCHER_BYTES = 1048576;
const SETTLED_CTIME_MARGIN_NS = BigInt(5e3) * 1000000n;
const log = createSubsystemLogger("update/package-integrity");
let readerSequence = 0;
const observations = /* @__PURE__ */ new WeakMap();
var PackageIntegrityMismatchError = class extends Error {
	constructor(message, differences) {
		super(`${message}${differences.length ? ` Drift: ${differences.join("; ")}.` : ""}`);
		this.differences = differences;
	}
};
function packageIntegrityDifferences(expected, actual) {
	const before = observations.get(expected);
	const after = observations.get(actual);
	const differences = [];
	if (before && after) for (const name of /* @__PURE__ */ new Set([...before.keys(), ...after.keys()])) {
		const left = before.get(name);
		const right = after.get(name);
		if (left?.retained === right?.retained) continue;
		const fields = !left ? ["added"] : !right ? ["removed"] : [.../* @__PURE__ */ new Set([...left.fields.keys(), ...right.fields.keys()])].filter((field) => left.fields.get(field) !== right.fields.get(field));
		const entry = name.length > 90 ? `${name.slice(0, 87)}...` : name || ".";
		differences.push(`Package rollback entry ${JSON.stringify(entry)}: fields=${fields.join(",")}`);
		if (differences.length === 5) break;
	}
	return differences;
}
function packageLauncherDifferences(expected, actual, options) {
	const symlink = expected.type === "symlink" && actual.type === "symlink";
	return [
		"type",
		"mode",
		"contents"
	].filter((field) => (field !== "mode" || options?.checkMode === true) && expected[field] !== actual[field]).map((field) => field === "contents" && symlink ? `target (expected ${JSON.stringify(expected.contents)}, actual ${JSON.stringify(actual.contents)})` : field);
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
function isPackageIntegrityResourceError(error) {
	return error instanceof PackageIntegrityTimeoutError || error instanceof PackageIntegrityLimitError;
}
async function readPackageVersionIfPresent(packageRoot) {
	return packageRoot ? readPackageVersion(packageRoot) : null;
}
function identity(stat) {
	return `${stat.dev}:${stat.ino}`;
}
function metadata(stat) {
	return {
		"dev:ino": identity(stat),
		mode: stat.mode.toString(),
		uid: stat.uid.toString(),
		gid: stat.gid.toString(),
		nlink: stat.nlink.toString(),
		size: stat.size.toString(),
		mtimeNs: stat.mtimeNs.toString(),
		ctimeNs: stat.ctimeNs.toString()
	};
}
function packageStatUnchanged(left, right) {
	return left.ino !== 0n && left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && left.uid === right.uid && left.gid === right.gid && left.nlink === right.nlink && left.size === right.size && left.mtimeNs === right.mtimeNs && left.ctimeNs === right.ctimeNs;
}
/** Read-only, bounded observations. These do not exclude writers or seal an inode. */
function createPackageIntegrityReader(timeoutMs = UPDATE_RUNNER_TIMEOUT_MS) {
	const now = () => performance.now();
	const startedAtMonotonicMs = now();
	const budget = Number.isFinite(timeoutMs) ? Math.max(1, timeoutMs) : UPDATE_RUNNER_TIMEOUT_MS;
	const deadlineAtMonotonicMs = startedAtMonotonicMs + budget;
	const timing = {
		readerId: `${process.pid}:${++readerSequence}`,
		timeOriginUnixMs: performance.timeOrigin,
		startedAtMonotonicMs,
		budgetMs: budget,
		deadlineClock: "monotonic",
		deadlineAtMonotonicMs
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
		const value = await awaitWithinDeadline(() => pending = trackIo(operation), deadlineAtMonotonicMs, now);
		if (value === ABSOLUTE_DEADLINE_EXPIRED) {
			timeoutObservedAtMonotonicMs ??= performance.now();
			if (pending && closeLate) pending.then((late) => trackIo(() => closeLate(late)), () => {}).catch(() => {});
			throw new PackageIntegrityTimeoutError(budget);
		}
		return value;
	}
	async function close(resource) {
		const closing = trackIo(() => resource.close()).catch(() => {});
		if (await awaitWithinDeadline(() => closing, deadlineAtMonotonicMs, now) === ABSOLUTE_DEADLINE_EXPIRED) timeoutObservedAtMonotonicMs ??= performance.now();
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
	async function hashFile(file, stat, remainingBytes, readBuffer) {
		if (!stat.isFile()) throw new Error("Package rollback verification byte limit exceeded");
		if (stat.size > BigInt(remainingBytes)) throw new PackageIntegrityLimitError("byte");
		const handle = await read(() => fs$1.open(file, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK), (late) => late.close());
		try {
			if (!packageStatUnchanged(stat, await read(() => handle.stat({ bigint: true })))) throw new Error("Package rollback file changed before reading");
			const hash = createHash("sha256");
			const buffer = readBuffer ?? Buffer.allocUnsafe(65536);
			const size = Number(stat.size);
			let position = 0;
			while (position < size) {
				const { bytesRead } = await read(() => handle.read(buffer, 0, Math.min(buffer.length, size - position), position));
				if (bytesRead === 0) throw new Error("Package rollback file changed while reading");
				position += bytesRead;
				hash.update(buffer.subarray(0, bytesRead));
			}
			if (!packageStatUnchanged(stat, await read(() => handle.stat({ bigint: true })))) throw new Error("Package rollback file changed while reading");
			return {
				digest: hash.digest("hex"),
				bytes: position
			};
		} finally {
			await close(handle);
		}
	}
	async function tree(root, originalRoot = root, reuse, legacy = false) {
		const prior = reuse ? observations.get(reuse) : void 0;
		const digest = createHash("sha256");
		const observed = [];
		const entriesObserved = /* @__PURE__ */ new Map();
		let bytes = 0;
		let remainingEntries = 49999;
		let device;
		let rootIdentity = "";
		const pending = [];
		const hasher = createPackageFileHasher(async (file, stat) => (await hashFile(file, stat, Number(stat.size))).digest);
		const window = 64;
		let pendingFiles = 0;
		let fileFailed = false;
		const appendEntry = ({ relative, fields, retained, reusable }) => {
			const retainedEntry = JSON.stringify([relative, retained]);
			if (!legacy) digest.update(retainedEntry);
			entriesObserved.set(relative, {
				fields,
				retained: retainedEntry,
				reusable
			});
		};
		const settled = (entry) => {
			if (pending.length) pending.push({ entry });
			else appendEntry(entry);
		};
		const drainFiles = async (limit = pending.length) => {
			let count = limit;
			if (!count) return;
			const settle = (items) => read(() => {
				hasher.flush();
				return Promise.all(items.map((item) => "outcome" in item ? item.outcome : Promise.resolve(item)));
			});
			let outcomes = await settle(pending.slice(0, count));
			if (count < pending.length && outcomes.some((outcome) => "error" in outcome)) {
				count = pending.length;
				outcomes = await settle(pending);
			}
			for (let next = pending[count]; next && "entry" in next; next = pending[++count]) outcomes.push(next);
			pendingFiles -= pending.splice(0, count).filter((item) => "outcome" in item).length;
			for (const outcome of outcomes) {
				if ("error" in outcome) throw outcome.error;
				appendEntry(outcome.entry);
			}
		};
		async function visit(file, relative) {
			if (fileFailed) await drainFiles();
			const stat = await read(() => fs$1.lstat(file, { bigint: true }));
			if (fileFailed) await drainFiles();
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
			if (!legacy && stat.isFile() && /(?:^|\/)node_modules\/\.package-lock\.json$/u.test(relative)) return;
			const info = metadata(stat);
			const fields = new Map(Object.entries(info));
			const retained = [
				info["dev:ino"],
				info.mode,
				info.uid,
				info.gid
			];
			if (!stat.isDirectory()) retained.push(info.size, info.mtimeNs);
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
				fields.set("target", target);
				retained.push("symlink", target);
			} else if (stat.isFile()) {
				const remainingBytes = MAX_TREE_BYTES - bytes;
				if (stat.size > BigInt(remainingBytes)) throw new PackageIntegrityLimitError("byte");
				bytes += Number(stat.size);
				const previous = prior?.get(relative);
				const previousDigest = previous?.fields.get("sha256");
				if (previous?.reusable && previousDigest !== void 0 && Object.entries(info).every(([field, value]) => previous.fields.get(field) === value)) {
					fields.set("sha256", previousDigest);
					retained.push("file", previousDigest);
					settled({
						relative,
						fields,
						retained,
						reusable: true
					});
					return;
				}
				pendingFiles++;
				const admittedAtNs = BigInt(Date.now()) * 1000000n;
				const reusable = stat.ctimeNs + SETTLED_CTIME_MARGIN_NS <= admittedAtNs;
				pending.push({ outcome: trackIo(() => hasher.hash(file, stat)).then((fileDigest) => {
					fields.set("sha256", fileDigest);
					retained.push("file", fileDigest);
					return { entry: {
						relative,
						fields,
						retained,
						reusable
					} };
				}, (error) => {
					fileFailed = true;
					return { error };
				}) });
				if (pendingFiles === window) await drainFiles(pending.findIndex((item) => "outcome" in item) + 1);
				return;
			} else if (stat.isDirectory()) {
				const children = await entries(file, remainingEntries);
				remainingEntries -= children.length;
				for (const child of children) await visit(path.join(file, child), relative ? `${relative}/${child}` : child);
			} else throw new Error("Package rollback contains a non-file entry");
			settled({
				relative,
				fields,
				retained,
				reusable: false
			});
		}
		try {
			try {
				await visit(root, "");
				await drainFiles();
			} catch (error) {
				if (!(error instanceof PackageIntegrityTimeoutError)) await drainFiles();
				throw error;
			}
			const version = await read(() => readPackageVersion(root, { maxBytes: MAX_MANIFEST_BYTES }));
			if (!version) throw new Error("Package rollback version is unavailable");
			for (const entry of observed) if (!packageStatUnchanged(entry.stat, await read(() => fs$1.lstat(entry.file, { bigint: true })))) throw new Error("Package rollback tree changed during verification");
			if (legacy) for (const { file, stat } of observed) {
				const relative = path.relative(root, file).split(path.sep).join("/");
				const fields = entriesObserved.get(relative).fields;
				const info = Object.values(metadata(stat));
				if (!relative) info.pop();
				digest.update(JSON.stringify([relative, info]));
				const contents = fields.get("sha256");
				if (contents !== void 0) {
					const first = stat.nlink > 1n ? observed.find(({ stat: other }) => other.dev === stat.dev && other.ino === stat.ino) : void 0;
					const owner = first ? path.relative(root, first.file).split(path.sep).join("/") : null;
					digest.update(JSON.stringify([
						"file",
						owner,
						contents
					]));
				} else if (fields.has("target")) digest.update(JSON.stringify(["symlink", fields.get("target")]));
			}
			const fingerprint = {
				digest: digest.digest("hex"),
				identity: rootIdentity,
				version
			};
			observations.set(fingerprint, entriesObserved);
			return fingerprint;
		} finally {
			hasher.close();
		}
	}
	async function rootEntry(root, originalRoot = root, expectedKind) {
		const stat = await read(() => fs$1.lstat(root, { bigint: true }));
		if (expectedKind && expectedKind !== (stat.isSymbolicLink() ? "link" : "directory")) throw new Error("Package rollback root entry kind changed");
		if (!stat.isSymbolicLink()) return {
			kind: "directory",
			tree: await tree(root, originalRoot)
		};
		const target = await read(() => fs$1.readlink(root));
		if (!packageStatUnchanged(stat, await read(() => fs$1.lstat(root, { bigint: true })))) throw new Error("Package rollback link changed while reading");
		return {
			kind: "link",
			metadata: Object.values(metadata(stat)).slice(0, -1),
			target
		};
	}
	async function directoryIdentity(root) {
		const stat = await read(() => fs$1.lstat(root, { bigint: true }));
		if (stat.isSymbolicLink()) return null;
		if (!stat.isDirectory() || stat.ino === 0n) throw new Error("Package rollback filesystem identity is unavailable");
		const version = await read(() => readPackageVersion(root, { maxBytes: MAX_MANIFEST_BYTES }));
		if (!version || !packageStatUnchanged(stat, await read(() => fs$1.lstat(root, { bigint: true })))) throw new Error("Package rollback identity changed or version is unavailable");
		return {
			identity: identity(stat),
			version
		};
	}
	async function launcher(file) {
		let stat = await read(() => fs$1.lstat(file, { bigint: true }));
		const symlink = stat.isSymbolicLink();
		const contents = symlink ? await read(() => fs$1.readlink(file)) : (await hashFile(file, stat, MAX_LAUNCHER_BYTES)).digest;
		const current = await read(() => fs$1.lstat(file, { bigint: true }));
		if (symlink && current.isSymbolicLink()) {
			const target = await read(() => fs$1.readlink(file));
			if (target !== contents) throw new Error(`Package rollback launcher target changed: ${file}; expected ${JSON.stringify(contents)}, actual ${JSON.stringify(target)}`);
			stat = current;
		} else if (!packageStatUnchanged(stat, current)) throw new Error("Package rollback launcher changed during verification");
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
export { packageIntegrityDifferences as a, readPackageVersionIfPresent as c, isPackageIntegrityResourceError as i, PackageIntegrityTimeoutError as n, packageLauncherDifferences as o, createPackageIntegrityReader as r, packageStatUnchanged as s, PackageIntegrityMismatchError as t };
