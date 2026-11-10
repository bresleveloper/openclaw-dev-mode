import { A as isRootPathEscapeError, B as createAsyncDirectoryGuard, C as admitPathInsideRoot, Ct as inspectFileIdentitySync, F as assertDirectoryIdentitySync, G as inspectDirectoryObservationSync, H as extendDirectoryObservationGuard, J as directoryComponentNotDirectoryError, Mt as sha256Hex, P as assertDirectoryGuard, St as inspectFileIdentity, W as inspectDirectoryIdentitySync, Y as errorCauseOptions, at as isDriveRelativePath, b as resolveExistingAncestor, ct as assertNoUnsafeDeviceReadPath, d as resolveReadOpenFlags, dt as realpathSync$1, f as ROOT_PATH_ALIAS_POLICIES, h as resolveRootPathSync, it as rootPathChangedError, jt as sameFileIdentityForCleanup, o as mutationSymlinkResolution, p as resolveRootPath, r as readFileHandleBounded, rt as outsideWorkspaceError, s as readSymlinkResolution, t as readBoundedSync } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { a as isPathInside, b as FsSafeError, d as assertNoWindowsPathAlias, g as resolvePathPreservingWindowsRoot, h as resolvePathFromBasePreservingWindowsRoot, i as isNotFoundPathError, m as pathForWindowsFilesystem, n as hasNodeErrorCode, t as assertNoNulPathInput } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { F as sleep, I as sleepSync, L as recursiveMkdirPath, P as hasErrorCode, W as assertExclusiveCreateStat, z as assertSynchronousCallbackResult } from "./openclaw-state-read-sidecar-lock-registration-C-Pbqw8O.mjs";
import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import os from "node:os";
import fs$1 from "node:fs/promises";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/temp-cleanup.js
const tempCleanupEntries = /* @__PURE__ */ new Map();
let cleanupRegistered = false;
function pathStillMatchesReceipt(entry) {
	if (!entry.identity) return false;
	try {
		const current = fs.lstatSync(entry.path, { bigint: true });
		return (!entry.singleLinkFile || current.isFile() && current.nlink === 1n) && sameFileIdentityForCleanup(current, entry.identity);
	} catch {
		return false;
	}
}
function removeRegisteredPathSync(entry) {
	if (entry.singleLinkFile) fs.unlinkSync(entry.path);
	else fs.rmSync(entry.path, {
		force: true,
		recursive: entry.recursive
	});
}
function cleanupEntrySync(entry) {
	if (entry.cleanupSync) entry.cleanupSync();
	else if (pathStillMatchesReceipt(entry)) removeRegisteredPathSync(entry);
}
function cleanupRegisteredTempPathsSync() {
	for (const entry of tempCleanupEntries.values()) try {
		cleanupEntrySync(entry);
	} catch {}
	tempCleanupEntries.clear();
}
function registerTempPathForExit(tempPath, options) {
	if (!cleanupRegistered) {
		cleanupRegistered = true;
		process.once("exit", cleanupRegisteredTempPathsSync);
	}
	const entry = {
		path: tempPath,
		recursive: options?.recursive === true,
		identity: options?.identity,
		singleLinkFile: options?.singleLinkFile,
		cleanupSync: options?.cleanupSync
	};
	tempCleanupEntries.set(tempPath, entry);
	const unregister = (() => {
		if (tempCleanupEntries.get(tempPath) === entry) tempCleanupEntries.delete(tempPath);
	});
	unregister.setIdentity = (identity) => {
		entry.identity = identity;
	};
	return unregister;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/root-context.js
const ensureTrailingSep = (value) => value.endsWith(path.sep) ? value : value + path.sep;
function assertValidRootRelativePath(relativePath) {
	assertNoNulPathInput(relativePath, "relative path contains a NUL byte");
	assertNoWindowsPathAlias(relativePath, "filesystem", "relative path uses a Windows filesystem namespace alias");
}
function assertValidRootDestinationPath(relativePath) {
	assertValidRootRelativePath(relativePath);
	if (isDriveRelativePath(relativePath)) throw new FsSafeError("invalid-path", "relative path must not start with a drive letter");
}
let cachedHomePath;
const POSIX_PARENT_COMPONENT = /(?:^|\/)\.\.(?:\/|$)/;
const WINDOWS_PARENT_COMPONENT = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
async function expandRelativePathWithHome(relativePath) {
	const homeOnly = relativePath === "~";
	const homePrefix = relativePath.startsWith("~/") || path.sep === "\\" && relativePath.startsWith("~\\");
	if (!homeOnly && !homePrefix) {
		assertNoWindowsPathAlias(relativePath, "filesystem", "relative path uses a Windows filesystem namespace alias");
		return relativePath;
	}
	const rawHome = process.env.HOME || process.env.USERPROFILE || os.homedir();
	assertNoWindowsPathAlias(rawHome, "filesystem", "home path uses a Windows filesystem namespace alias");
	if (cachedHomePath?.raw !== rawHome) {
		let realHome = rawHome;
		try {
			realHome = realpathSync$1.native(pathForWindowsFilesystem(rawHome));
		} catch {}
		cachedHomePath = {
			raw: rawHome,
			real: realHome
		};
	}
	if (homeOnly) {
		assertNoWindowsPathAlias(cachedHomePath.real, "filesystem", "home path uses a Windows filesystem namespace alias");
		return cachedHomePath.real;
	}
	const expanded = `${ensureTrailingSep(cachedHomePath.real)}${relativePath.slice(2)}`;
	assertNoWindowsPathAlias(expanded, "filesystem", "expanded path uses a Windows filesystem namespace alias");
	return expanded;
}
async function resolveRootContext(rootDir) {
	assertNoNulPathInput(rootDir, "root dir contains a NUL byte");
	assertNoWindowsPathAlias(rootDir, "filesystem", "root dir uses a Windows filesystem namespace alias");
	const lexicalRoot = resolvePathPreservingWindowsRoot(rootDir);
	assertNoWindowsPathAlias(lexicalRoot, "filesystem", "root dir uses a Windows filesystem namespace alias");
	let rootReal;
	let rootStat;
	let rootIdentity;
	try {
		rootReal = realpathSync$1.native(pathForWindowsFilesystem(rootDir));
		assertNoWindowsPathAlias(rootReal, "filesystem", "canonical root path uses a Windows filesystem namespace alias");
		rootStat = await inspectFileIdentity(() => {
			const stat = fs.statSync(rootReal, { bigint: true });
			if (!stat.isDirectory()) throw new FsSafeError("invalid-path", "root dir is not a directory");
			return stat;
		});
		rootIdentity = {
			dev: rootStat.dev,
			ino: rootStat.ino
		};
	} catch (err) {
		if (err instanceof FsSafeError) throw err;
		if (isNotFoundPathError(err)) throw new FsSafeError("not-found", "root dir not found");
		throw err;
	}
	return {
		rootDir: lexicalRoot,
		rootGuard: {
			dir: rootReal,
			realPath: rootReal,
			stat: rootStat
		},
		rootIdentity,
		rootReal,
		rootWithSep: ensureTrailingSep(rootReal)
	};
}
function rootRelativeReadPath(root, filePath) {
	if (!path.isAbsolute(filePath)) return filePath;
	const raw = process.platform === "win32" ? filePath.replaceAll("/", path.sep) : filePath;
	const bases = root.rootDir === root.rootReal ? [root.rootReal] : [root.rootDir, root.rootReal];
	for (const base of bases) {
		if (process.platform === "win32") {
			const admitted = admitPathInsideRoot({
				rootPath: base,
				candidatePath: raw,
				rootIdentity: root.rootIdentity,
				resolveCandidateRoot: base === root.rootDir && root.rootDir !== root.rootReal
			});
			if (admitted) return `.${path.sep}${admitted.relativePath}`;
			continue;
		}
		const prefix = ensureTrailingSep(base);
		if (raw.startsWith(prefix)) {
			let start = prefix.length;
			while (raw[start] === path.sep) start += 1;
			return `.${path.sep}${raw.slice(start)}`;
		}
	}
	return raw;
}
function assertRootIdentityCurrentSync(root, observe) {
	try {
		const stat = inspectDirectoryIdentitySync(root.rootReal, {
			dev: root.rootIdentity.dev,
			ino: root.rootIdentity.ino
		});
		observe?.(stat);
	} catch (error) {
		throw rootPathChangedError(error instanceof Error ? error : void 0);
	}
}
async function assertRootIdentityCurrent(root, observe) {
	assertRootIdentityCurrentSync(root, observe);
}
/**
* Observe the current Root with an exact, operation-local receipt.
*
* This is deliberately separate from {@link assertRootIdentityCurrent}: callers
* must not retain the returned guard beyond the operation that requested it.
*/
async function createRootObservationGuard(root) {
	const rootIdentity = root.rootIdentity;
	if (typeof rootIdentity?.dev !== "bigint" || typeof rootIdentity.ino !== "bigint") throw rootPathChangedError();
	try {
		const observed = await inspectDirectoryObservationSync(root.rootReal, rootIdentity);
		return extendDirectoryObservationGuard(observed, root.rootReal, root.rootReal);
	} catch (error) {
		throw rootPathChangedError(error instanceof Error ? error : void 0);
	}
}
async function resolvePathInRoot(root, relativePath, options) {
	assertValidRootRelativePath(relativePath);
	await assertRootIdentityCurrent(root);
	const expanded = await expandRelativePathWithHome(relativePath);
	assertNoWindowsPathAlias(expanded, "filesystem", "expanded path uses a Windows filesystem namespace alias");
	let resolved = resolvePathFromBasePreservingWindowsRoot(root.rootWithSep, expanded);
	assertNoWindowsPathAlias(resolved, "filesystem", "resolved path uses a Windows filesystem namespace alias");
	if (!options?.resolveCanonical && !isPathInside(root.rootWithSep, resolved)) throw outsideWorkspaceError();
	if (options?.rejectUnsafeDeviceReads === true) assertNoUnsafeDeviceReadPath(resolved);
	const rawAbsolutePath = path.isAbsolute(expanded) ? expanded : `${root.rootWithSep}${expanded}`;
	assertNoWindowsPathAlias(rawAbsolutePath, "filesystem", "resolved path uses a Windows filesystem namespace alias");
	try {
		const resolution = {
			absolutePath: rawAbsolutePath,
			rootPath: root.rootReal,
			rootCanonicalPath: root.rootReal,
			rootIdentity: root.rootIdentity,
			boundaryLabel: "root",
			policy: options?.allowFinalSymlink ? ROOT_PATH_ALIAS_POLICIES.unlinkTarget : void 0,
			rejectSymlinks: options?.rejectSymlinks,
			rejectFinalSymlink: options?.rejectFinalSymlink
		};
		const checked = await resolveRootPath(resolution);
		const parentComponent = process.platform === "win32" ? WINDOWS_PARENT_COMPONENT : POSIX_PARENT_COMPONENT;
		if (options?.rejectAmbiguousParents && parentComponent.test(expanded) && path.relative(checked.canonicalPath, resolved) !== "") {
			const normalized = await resolveRootPath({
				...resolution,
				absolutePath: resolved
			});
			if (path.relative(checked.canonicalPath, normalized.canonicalPath) !== "") throw new FsSafeError("path-alias", "parent traversal resolves differently through a symlink");
		}
		if (options?.resolveCanonical) resolved = checked.canonicalPath;
		else {
			const admitted = admitPathInsideRoot({
				rootPath: root.rootReal,
				candidatePath: checked.absolutePath,
				rootIdentity: root.rootIdentity
			});
			if (!admitted) throw outsideWorkspaceError();
			resolved = admitted.path;
		}
	} catch (error) {
		if (error instanceof FsSafeError && error.code === "symlink") throw error;
		if (hasNodeErrorCode(error, "ENAMETOOLONG")) throw new FsSafeError("invalid-path", "relative path is too long", errorCauseOptions(error));
		const code = options?.aliasErrorCode ?? "outside-workspace";
		throw new FsSafeError(code, code === "path-alias" ? "path alias escape blocked" : "file is outside workspace root", errorCauseOptions(error));
	}
	return {
		rootReal: root.rootReal,
		rootWithSep: root.rootWithSep,
		resolved
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/pinned-mutation-observation.js
const checkedDirectoryObservation = Symbol("checked mutation directory observation");
const directoryObservers = /* @__PURE__ */ new WeakMap();
function identity(stat) {
	return Object.freeze({
		dev: stat.dev,
		ino: stat.ino,
		mode: stat.mode,
		nlink: stat.nlink
	});
}
function sameIdentity(left, right, directory = false) {
	return left.dev === right.dev && left.ino === right.ino && left.mode === right.mode && (directory || left.nlink === right.nlink);
}
function directoryMode(mode) {
	return (mode & 61440n) === 16384n;
}
function absent(pathname) {
	try {
		return fs.lstatSync(pathname, { throwIfNoEntry: false }) === void 0;
	} catch (error) {
		return isNotFoundPathError(error) && error.code === "ENOENT";
	}
}
function missingMutationSegments(observation) {
	return observation.missingSegments.length - observation.missingOffset;
}
function nextMissingMutationPath(observation) {
	const segment = observation.missingSegments[observation.missingOffset];
	return segment === void 0 ? void 0 : path.join(observation.ancestor, segment);
}
function checkedMutationDirectory(pathname, canonicalPath, stat, observeCurrent) {
	if (!directoryMode(stat.mode)) throw new TypeError("mutation directory evidence must describe a real directory");
	const observation = Object.freeze({
		path: pathname,
		canonicalPath,
		identity: identity(stat),
		[checkedDirectoryObservation]: true
	});
	if (observeCurrent) directoryObservers.set(observation, observeCurrent);
	return observation;
}
function checkedDirectory(observation) {
	return observation[checkedDirectoryObservation] === true && path.isAbsolute(observation.path) && path.isAbsolute(observation.canonicalPath) && directoryMode(observation.identity.mode);
}
function mutationObservationUsesDirectory(observation, directory) {
	return checkedDirectory(directory) && observation.ancestor === directory.path && observation.canonicalAncestor === directory.canonicalPath && sameIdentity(observation.entry, directory.identity) && sameIdentity(observation.identity, directory.identity);
}
function observeMutationPath(pathname) {
	try {
		let ancestor = pathname;
		const reversedMissing = [];
		while (absent(ancestor)) {
			const parent = path.dirname(ancestor);
			if (parent === ancestor) return void 0;
			reversedMissing.push(path.basename(ancestor));
			ancestor = parent;
		}
		reversedMissing.reverse();
		const missingSegments = Object.freeze(reversedMissing);
		const entry = inspectFileIdentitySync(() => fs.lstatSync(ancestor, { bigint: true }));
		const canonicalAncestor = realpathSync$1.native(ancestor);
		const stat = canonicalAncestor === ancestor ? entry : inspectFileIdentitySync(() => fs.lstatSync(canonicalAncestor, { bigint: true }));
		if (stat.isSymbolicLink() || missingSegments.length > 0 && !stat.isDirectory()) return void 0;
		const observation = Object.freeze({
			path: pathname,
			ancestor,
			canonicalAncestor,
			canonicalPath: path.join(canonicalAncestor, ...missingSegments),
			entry: identity(entry),
			identity: identity(stat),
			missingSegments,
			missingOffset: 0
		});
		return mutationObservationCurrent(observation) ? observation : void 0;
	} catch {
		return;
	}
}
function mutationObservationCurrent(observation) {
	try {
		const entry = inspectFileIdentitySync(() => fs.lstatSync(observation.ancestor, { bigint: true }));
		if (!sameIdentity(observation.entry, entry, entry.isDirectory()) || realpathSync$1.native(observation.ancestor) !== observation.canonicalAncestor) return false;
		const stat = observation.canonicalAncestor === observation.ancestor ? entry : inspectFileIdentitySync(() => fs.lstatSync(observation.canonicalAncestor, { bigint: true }));
		return sameIdentity(observation.identity, stat, stat.isDirectory()) && (missingMutationSegments(observation) === 0 || stat.isDirectory() && absent(nextMissingMutationPath(observation)));
	} catch {
		return false;
	}
}
function mutationObservationsCurrent(observations, directories) {
	const groups = /* @__PURE__ */ new Map();
	const groupFor = (pathname) => {
		let group = groups.get(pathname);
		if (!group) {
			group = {
				observations: [],
				directories: []
			};
			groups.set(pathname, group);
		}
		return group;
	};
	try {
		for (const observation of observations) if (observation.ancestor !== observation.canonicalAncestor) {
			if (!mutationObservationCurrent(observation)) return false;
		} else groupFor(observation.ancestor).observations.push(observation);
		for (const directory of directories) {
			if (!checkedDirectory(directory)) return false;
			groupFor(directory.path).directories.push(directory);
		}
		const current = (pathname, group) => {
			const missing = new Set(group.observations.flatMap((observation) => {
				const next = nextMissingMutationPath(observation);
				return next === void 0 ? [] : [next];
			}));
			if (group.directories.length && ![...missing].every(absent)) return false;
			const observed = group.directories.length ? directoryObservers.get(group.directories[0])?.() : void 0;
			const stat = observed?.identity ?? inspectFileIdentitySync(() => fs.lstatSync(pathname, { bigint: true }));
			const canonical = observed?.canonicalPath ?? realpathSync$1.native(pathname);
			const isDirectory = directoryMode(stat.mode);
			if (!group.observations.every((observation) => canonical === observation.canonicalAncestor && sameIdentity(observation.entry, stat, isDirectory) && sameIdentity(observation.identity, stat, isDirectory) && (missingMutationSegments(observation) === 0 || isDirectory))) return false;
			if (!group.directories.every((directory) => isDirectory && sameIdentity(directory.identity, stat) && canonical === directory.canonicalPath)) return false;
			return group.directories.length > 0 || [...missing].every(absent);
		};
		for (const [pathname, group] of groups) if (!group.directories.length && !current(pathname, group)) return false;
		const checked = /* @__PURE__ */ new Set();
		for (const directory of directories) {
			if (checked.has(directory.path)) continue;
			if (!current(directory.path, groups.get(directory.path))) return false;
			checked.add(directory.path);
		}
		return true;
	} catch {
		return false;
	}
}
function advanceMutationObservation(observation, parent, child) {
	const nextMissingPath = nextMissingMutationPath(observation);
	if (nextMissingPath === void 0 || nextMissingPath !== child.path) return observation;
	if (!checkedDirectory(parent) || !checkedDirectory(child) || observation.ancestor !== parent.path || observation.canonicalAncestor !== parent.canonicalPath || !sameIdentity(observation.entry, parent.identity, true) || !sameIdentity(observation.identity, parent.identity, true) || parent.path !== parent.canonicalPath || child.path !== child.canonicalPath || path.dirname(child.path) !== parent.path) return void 0;
	return Object.freeze({
		...observation,
		ancestor: child.path,
		canonicalAncestor: child.canonicalPath,
		entry: child.identity,
		identity: child.identity,
		missingOffset: observation.missingOffset + 1
	});
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/atomic-io.js
function* wait(value) {
	return yield value;
}
function runSync(procedure) {
	let step = procedure.next();
	while (!step.done) step = procedure.next(step.value);
	return step.value;
}
function inspectAtomicIdentity(io, read, expected, synchronous = false, admit) {
	if (io.asynchronous && !synchronous) return inspectFileIdentity(admit ? async () => {
		const stat = await read();
		admit(stat);
		return stat;
	} : read, expected);
	return inspectFileIdentitySync(admit ? () => {
		const stat = read();
		admit(stat);
		return stat;
	} : read, expected);
}
/** One adapter per operation; each admitted descriptor receives one AtomicFile. */
var AtomicIo = class AtomicIo {
	asyncFs;
	syncFs;
	fchmodSync;
	asynchronous;
	constructor(asyncFs, syncFs, fchmodSync) {
		this.asyncFs = asyncFs;
		this.syncFs = syncFs;
		this.fchmodSync = fchmodSync;
		this.asynchronous = asyncFs !== void 0;
	}
	static async(fsModule) {
		return new AtomicIo(fsModule, void 0);
	}
	static sync(fsModule, fchmodSync) {
		return new AtomicIo(void 0, fsModule, fchmodSync);
	}
	wrap(resource) {
		return new AtomicFile(this, resource);
	}
	*open(pathname, flags, mode) {
		const withMode = arguments.length > 2;
		const exclusive = fs.constants.O_CREAT | fs.constants.O_EXCL;
		if (process.platform === "win32" && (typeof flags === "string" ? flags.includes("x") : (flags & exclusive) === exclusive)) try {
			assertExclusiveCreateStat(pathname, yield* this.lstat(pathname));
		} catch (error) {
			if (!hasNodeErrorCode(error, "ENOENT")) throw error;
		}
		const resource = this.asyncFs ? yield* wait(withMode ? this.asyncFs.open(pathname, flags, mode) : this.asyncFs.open(pathname, flags)) : withMode ? this.syncFs.openSync(pathname, flags, mode) : this.syncFs.openSync(pathname, flags);
		return this.wrap(resource);
	}
	*lstat(pathname) {
		if (!this.asyncFs) return this.syncFs.lstatSync(pathname);
		if (this.asyncFs === fs$1) return fs.lstatSync(pathname);
		return yield* wait(this.asyncFs.lstat(pathname));
	}
	lstatExact(pathname, synchronousBuiltin = true) {
		if (!this.asyncFs) return this.syncFs.lstatSync(pathname, { bigint: true });
		if (synchronousBuiltin && this.asyncFs === fs$1) return fs.lstatSync(pathname, { bigint: true });
		return this.asyncFs.lstat(pathname, { bigint: true });
	}
	*mkdir(directory, mode) {
		if (this.asyncFs) {
			const pathname = this.asyncFs === fs$1 ? recursiveMkdirPath(directory) : directory;
			yield* wait(this.asyncFs.mkdir(pathname, {
				recursive: true,
				mode
			}));
		} else {
			const pathname = this.syncFs === fs ? recursiveMkdirPath(directory) : directory;
			this.syncFs.mkdirSync(pathname, {
				recursive: true,
				mode
			});
		}
	}
	*rename(source, destination) {
		if (this.asyncFs) yield* wait(this.asyncFs.rename(source, destination));
		else this.syncFs.renameSync(source, destination);
	}
	*remove(pathname) {
		if (this.asyncFs) yield* wait(this.asyncFs.rm(pathname, { force: true }));
		else this.syncFs.rmSync(pathname, { force: true });
	}
	*unlink(pathname) {
		if (this.asyncFs) yield* wait(this.asyncFs.unlink(pathname));
		else this.syncFs.unlinkSync(pathname);
	}
	*delay(milliseconds) {
		if (this.asynchronous) yield* wait(sleep(milliseconds));
		else sleepSync(milliseconds);
	}
};
var AtomicFile = class {
	io;
	resource;
	constructor(io, resource) {
		this.io = io;
		this.resource = resource;
	}
	get fd() {
		return typeof this.resource === "number" ? this.resource : this.resource.fd;
	}
	*stat() {
		if (typeof this.resource === "number") return this.io.syncFs.fstatSync(this.resource);
		if (this.io.asyncFs === fs$1) return fs.fstatSync(this.resource.fd);
		return yield* wait(this.resource.stat());
	}
	statExact() {
		if (typeof this.resource === "number") return this.io.syncFs.fstatSync(this.resource, { bigint: true });
		if (this.io.asyncFs === fs$1) return fs.fstatSync(this.resource.fd, { bigint: true });
		return this.resource.stat({ bigint: true });
	}
	close() {
		if (typeof this.resource === "number") this.io.syncFs.closeSync(this.resource);
		else return this.resource.close();
	}
	*sync() {
		if (typeof this.resource === "number") this.io.syncFs.fsyncSync(this.resource);
		else yield* wait(this.resource.sync());
	}
	*syncBestEffort() {
		try {
			yield* this.sync();
		} catch (error) {
			if (error?.code !== "EPERM") throw error;
		}
	}
	chmod(mode) {
		if (typeof this.resource === "number") {
			const chmod = this.io.fchmodSync;
			chmod?.(this.resource, mode);
		} else return this.resource.chmod(mode);
	}
	writeFile(data, throughModule = false) {
		if (typeof this.resource === "number") this.io.syncFs.writeFileSync(this.resource, data);
		else if (throughModule) return this.io.asyncFs.writeFile(this.resource, data);
		else return this.resource.writeFile(data);
	}
	*readFile(sizeHint) {
		if (typeof this.resource !== "number") return yield* wait(readFileHandleBounded(this.resource, Infinity));
		if (sizeHint === void 0) return this.io.syncFs.readFileSync(this.resource);
		const fd = this.resource;
		let position = 0;
		return readBoundedSync(Infinity, (buffer, length) => {
			const bytesRead = this.io.syncFs.readSync(fd, buffer, 0, length, position);
			position += bytesRead;
			return bytesRead;
		}, { initialSize: Number.isSafeInteger(sizeHint) && sizeHint >= 0 ? sizeHint : void 0 });
	}
	read(buffer, offset, length, position) {
		if (typeof this.resource === "number") return this.io.syncFs.readSync(this.resource, buffer, offset, length, position);
		return this.resource.read(buffer, offset, length, position);
	}
	write(buffer, offset, length, position) {
		if (typeof this.resource === "number") {
			const written = this.io.syncFs.writeSync(this.resource, buffer, offset, length, position);
			if (written === 0) throw new Error("Copy fallback write made no progress");
			return written;
		}
		return this.resource.write(buffer, offset, length, position);
	}
	*truncate(length) {
		if (typeof this.resource === "number") this.io.syncFs.ftruncateSync(this.resource, length);
		else yield* wait(this.resource.truncate(length));
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/replace-file-descriptor.js
function* writeTempFile(io, params) {
	params.mutation?.assert();
	const file = yield* io.open(params.tempPath, "wx", params.mode);
	try {
		const openedInspection = inspectAtomicIdentity(io, () => file.statExact());
		const identity = io.asynchronous ? yield openedInspection : openedInspection;
		params.onIdentity?.(identity);
		params.mutation?.assert();
		const writing = file.writeFile(params.content, true);
		if (io.asynchronous) yield writing;
		if ((io.asyncFs === fs$1 || process.platform === "win32" && io.syncFs === fs) && !params.sync) {
			const current = inspectAtomicIdentity(io, () => file.statExact(), identity, true);
			const modeMask = process.platform === "win32" ? 128 : 4095;
			if (Number(current.mode & BigInt(modeMask)) === (params.mode & modeMask)) return {
				file,
				identity
			};
		}
		const chmod = file.chmod(params.mode);
		if (io.asynchronous) yield chmod;
		if (params.sync) yield* file.syncBestEffort();
		const currentInspection = inspectAtomicIdentity(io, () => file.statExact(), identity);
		if (io.asynchronous) yield currentInspection;
		return {
			file,
			identity
		};
	} catch (error) {
		try {
			const closing = file.close();
			if (io.asynchronous) yield closing;
		} catch (closeError) {
			throw new AggregateError([error, closeError], "Atomic temp write and close failed");
		}
		throw error;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/guarded-mutation.js
async function withAsyncDirectoryGuards(guards, mutate, options = {}) {
	for (const guard of guards) assertDirectoryGuard(guard, "native");
	const result = await mutate();
	if (options.verifyAfter !== false) try {
		for (const guard of guards) assertDirectoryGuard(guard, "native");
	} catch (error) {
		if (options.onPostGuardFailure) try {
			await options.onPostGuardFailure(result, error);
		} catch {}
		throw error;
	}
	return result;
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/replace-file-temp-owner.js
const PUBLISHED_READ_FLAGS = resolveReadOpenFlags();
function describeFailure(error) {
	try {
		return String(error);
	} catch {
		return "<unprintable failure>";
	}
}
function isErrorValue(error) {
	try {
		return error instanceof Error;
	} catch {
		return false;
	}
}
async function removePathIfIdentityUnchanged(targetPath, identity) {
	await withAsyncDirectoryGuards([await createAsyncDirectoryGuard(path.dirname(targetPath), { bigint: true })], async () => {
		const current = fs.lstatSync(targetPath, { bigint: true });
		if (current.isSymbolicLink() || !current.isFile() || !sameFileIdentityForCleanup(current, identity)) return;
		await fs$1.unlink(targetPath);
	});
}
function assertOwnedFile(stat, pathname, pathnameEntry) {
	if (stat.isSymbolicLink()) throw new FsSafeError("symlink", `Atomic replace owned file became a symlink: ${pathname}`);
	if (!stat.isFile()) throw new FsSafeError("not-file", `Atomic replace owned file must remain regular: ${pathname}`);
	if (stat.nlink > 1n || pathnameEntry && stat.nlink !== 1n) throw new FsSafeError("hardlink", `Atomic replace owned file must retain one link: ${pathname}`);
}
function missingOwnedFile(pathname, cause) {
	return new FsSafeError("path-mismatch", `Atomic replace owned file disappeared: ${pathname}`, { cause });
}
function cleanupFailure(originalFailure, cleanupError) {
	if (originalFailure) return new Error(`Atomic file replace failed (${describeFailure(originalFailure.error)}); cleanup also failed (${describeFailure(cleanupError)})`, { cause: originalFailure.error });
	return isErrorValue(cleanupError) ? cleanupError : new Error(describeFailure(cleanupError));
}
function closeFailure(closeError, params, cleanupFailure) {
	return { error: cleanupFailure ? new AggregateError([cleanupFailure.error, closeError], "Atomic temp cleanup and close failed") : params.originalFailure ? new AggregateError([params.originalFailure.error, closeError], "Atomic file replace and close failed") : closeError };
}
var AtomicTempOwner = class {
	pathname;
	io;
	resource;
	recordedIdentity;
	exists = false;
	unregister;
	constructor(pathname, io) {
		this.pathname = pathname;
		this.io = io;
		this.unregister = registerTempPathForExit(pathname, { singleLinkFile: true });
	}
	start() {
		this.exists = true;
	}
	onIdentity = (identity) => {
		this.recordedIdentity = identity;
		this.unregister.setIdentity(identity);
	};
	get identity() {
		if (!this.recordedIdentity) throw new Error("Atomic temp owner has no identity");
		return this.recordedIdentity;
	}
	markRenamed() {
		this.exists = false;
		this.unregister();
	}
	takeResource() {
		const resource = this.resource;
		this.resource = void 0;
		return resource;
	}
	adopt(temp) {
		this.resource = temp.file;
		this.onIdentity(temp.identity);
	}
	inspectOwned(read, pathname, pathnameEntry, expected) {
		return inspectAtomicIdentity(this.io, read, expected, false, (stat) => assertOwnedFile(stat, pathname, pathnameEntry));
	}
	*assertCurrent(pathname = this.pathname) {
		const openedInspection = this.inspectOwned(() => this.resource.statExact(), pathname, false, this.identity);
		const opened = this.io.asynchronous ? yield openedInspection : openedInspection;
		try {
			const currentInspection = this.inspectOwned(() => this.io.lstatExact(pathname), pathname, true, opened);
			if (this.io.asynchronous) yield currentInspection;
		} catch (error) {
			if (hasErrorCode(error, "ENOENT")) throw missingOwnedFile(pathname, error);
			throw error;
		}
	}
	*assertPublished(pathname, expectedHash, onVerified) {
		let identityCurrent = false;
		try {
			yield* this.assertCurrent(pathname);
			identityCurrent = true;
		} catch (error) {
			if (!(error instanceof FsSafeError) || !hasErrorCode(error, "path-mismatch") || !expectedHash) throw error;
		}
		if (identityCurrent) {
			onVerified?.(this.identity);
			return;
		}
		let published;
		try {
			try {
				published = yield* this.io.open(pathname, PUBLISHED_READ_FLAGS);
			} catch (error) {
				if (hasErrorCode(error, "ELOOP")) throw new FsSafeError("symlink", `Atomic replace published file became a symlink: ${pathname}`, { cause: error });
				throw error;
			}
			const openedInspection = this.inspectOwned(() => published.statExact(), pathname, false);
			const identity = this.io.asynchronous ? yield openedInspection : openedInspection;
			const currentInspection = this.inspectOwned(() => this.io.lstatExact(pathname), pathname, true, identity);
			if (this.io.asynchronous) yield currentInspection;
			if (sha256Hex(yield* published.readFile()) !== expectedHash) throw new FsSafeError("path-mismatch", `Atomic replace published content changed: ${pathname}`);
			onVerified?.(identity);
			const previous = this.takeResource();
			const closing = previous?.close();
			if (previous && this.io.asynchronous) yield closing;
			this.resource = published;
			this.recordedIdentity = identity;
			published = void 0;
		} finally {
			try {
				const closing = published?.close();
				if (published && this.io.asynchronous) yield closing;
			} catch {}
		}
	}
	*cleanupOwnedPath(params) {
		const identity = this.recordedIdentity;
		if (!identity) return true;
		try {
			const observation = this.io.lstatExact(this.pathname);
			const current = this.io.asyncFs && this.io.asyncFs !== fs$1 ? yield* wait(observation) : observation;
			if (!current.isSymbolicLink() && current.isFile() && current.nlink === 1n && sameFileIdentityForCleanup(current, identity)) yield* this.io.unlink(this.pathname);
			return true;
		} catch (cleanupError) {
			if (hasErrorCode(cleanupError, "ENOENT")) return true;
			if (params.throwOnCleanupError) throw cleanupFailure(params.originalFailure, cleanupError);
			return false;
		}
	}
	*finish(params) {
		let deferredFailure;
		let cleanupComplete = !this.exists;
		if (this.exists) try {
			cleanupComplete = yield* this.cleanupOwnedPath(params);
		} catch (error) {
			deferredFailure = { error };
		}
		if (cleanupComplete) this.unregister();
		const file = this.takeResource();
		try {
			const closing = file?.close();
			if (file && this.io.asynchronous) yield closing;
		} catch (closeError) {
			deferredFailure = closeFailure(closeError, params, deferredFailure);
		}
		if (deferredFailure) throw deferredFailure.error;
	}
};
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path-case.js
function swapAsciiCase(value) {
	return value.replace(/[A-Za-z]/g, (character) => {
		const lower = character.toLowerCase();
		return character === lower ? character.toUpperCase() : lower;
	});
}
function probeEntry(directory, name, names) {
	const alternate = swapAsciiCase(name);
	if (alternate === name) return void 0;
	const bothListed = names.has(name) && names.has(alternate);
	const originalPath = path.join(directory, name);
	let original;
	let observed;
	try {
		original = inspectFileIdentitySync(() => fs.lstatSync(originalPath, { bigint: true }));
		try {
			const other = inspectFileIdentitySync(() => fs.lstatSync(path.join(directory, alternate), { bigint: true }));
			const sameIdentity = sameFileIdentityForCleanup(original, other);
			if (sameIdentity || bothListed) {
				const currentNames = new Set(fs.readdirSync(directory));
				const bothCurrent = currentNames.has(name) && currentNames.has(alternate);
				if (bothListed && !bothCurrent) return void 0;
				observed = sameIdentity && !bothCurrent;
			} else observed = false;
		} catch (error) {
			if (bothListed || !isNotFoundPathError(error)) return void 0;
			observed = false;
		}
	} catch {
		return;
	}
	inspectFileIdentitySync(() => fs.lstatSync(originalPath, { bigint: true }), original);
	return observed;
}
function probeTemporaryEntry(directory) {
	const name = `.fs-safe-case-probe-${randomUUID()}`;
	const io = AtomicIo.sync(fs);
	const owner = new AtomicTempOwner(path.join(directory, name), io);
	try {
		owner.start();
		owner.adopt(runSync(writeTempFile(io, {
			tempPath: owner.pathname,
			content: "",
			mode: 384,
			sync: false,
			onIdentity: owner.onIdentity
		})));
		runSync(owner.assertCurrent());
		const observed = probeEntry(directory, name, new Set(fs.readdirSync(directory)));
		runSync(owner.assertCurrent());
		return observed;
	} finally {
		runSync(owner.finish({ throwOnCleanupError: true }));
	}
}
function probeDirectory(directory, allowTemporaryProbe, preferredName) {
	const canonical = realpathSync$1.native(directory);
	const identity = inspectDirectoryIdentitySync(canonical);
	const names = new Set(fs.readdirSync(canonical));
	let observed = preferredName === void 0 ? void 0 : probeEntry(canonical, preferredName, names);
	for (const name of names) {
		if (observed !== void 0) break;
		observed = probeEntry(canonical, name, names);
	}
	if (observed === void 0 && allowTemporaryProbe) observed = probeTemporaryEntry(canonical);
	assertDirectoryIdentitySync(canonical, identity);
	return realpathSync$1.native(directory) === canonical ? observed : void 0;
}
/** Observe local ASCII case behavior; unknown observations never imply an operating-system default. */
function probePathCaseInsensitiveSync(targetPath, options = {}) {
	const resolved = path.resolve(targetPath);
	const allowTemporaryProbe = options.allowTemporaryProbe !== false;
	let targetExists = true;
	try {
		fs.lstatSync(resolved);
	} catch (error) {
		if (!isNotFoundPathError(error)) return void 0;
		targetExists = false;
	}
	if (targetExists) try {
		return probeDirectory(path.dirname(resolved), allowTemporaryProbe, path.basename(resolved));
	} catch {
		return;
	}
	let directory = path.dirname(resolved);
	for (;;) {
		let exists = false;
		try {
			exists = fs.statSync(directory).isDirectory();
		} catch {}
		if (exists) try {
			return probeDirectory(directory, allowTemporaryProbe);
		} catch {
			return;
		}
		const parent = path.dirname(directory);
		if (parent === directory) return void 0;
		directory = parent;
	}
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/deny-mutation-match.js
function foldedName(name) {
	return name.normalize("NFD").replace(/[^\u0131]+/gu, (part) => part.toLowerCase().toUpperCase().toLowerCase()).normalize("NFC");
}
function asciiCasePair(left, right) {
	return /^[\x00-\x7f]*$/.test(left) && /^[\x00-\x7f]*$/.test(right) && left.toLowerCase() === right.toLowerCase();
}
/** Cache observations only within one synchronous policy check, never across mutations or callbacks. */
function createMutationDenyMatcher() {
	const observations = /* @__PURE__ */ new Map();
	const caseObservations = /* @__PURE__ */ new Map();
	const observe = (pathname) => {
		if (!observations.has(pathname)) observations.set(pathname, observeMutationPath(pathname));
		return observations.get(pathname);
	};
	const prospectiveInside = (parent, child) => {
		const root = path.parse(parent).root;
		if (root !== path.parse(child).root) return false;
		const left = parent.slice(root.length).split(path.sep);
		const right = child.slice(root.length).split(path.sep).slice(0, left.length);
		if (left.length !== right.length || !left.every((name, i) => foldedName(name) === foldedName(right[i]))) return false;
		if (left.every((name, i) => name === right[i])) return false;
		const alignedChild = path.join(root, ...right);
		const a = observe(parent);
		const b = observe(alignedChild);
		if (!a || !b) return true;
		if (a.canonicalAncestor !== b.canonicalAncestor || a.missingSegments.length === 0 || a.missingSegments.length !== b.missingSegments.length) return false;
		const missingLeft = a.missingSegments;
		const missingRight = b.missingSegments;
		if (!missingLeft.every((name, i) => foldedName(name) === foldedName(missingRight[i]))) return false;
		const difference = missingLeft.findIndex((name, i) => name !== missingRight[i]);
		if (difference === -1) return true;
		if (difference === 0 && asciiCasePair(missingLeft[0], missingRight[0])) {
			if (!caseObservations.has(a.canonicalAncestor)) caseObservations.set(a.canonicalAncestor, probePathCaseInsensitiveSync(path.join(a.canonicalAncestor, missingLeft[0]), { allowTemporaryProbe: false }));
			if (caseObservations.get(a.canonicalAncestor) === false) return false;
		}
		return true;
	};
	return (target, denied, prefix, protectAncestors = false) => {
		if (isPathInside(denied, target) && (prefix || isPathInside(target, denied)) || protectAncestors && isPathInside(target, denied)) return true;
		return (prefix || target.split(path.sep).length === denied.split(path.sep).length) && prospectiveInside(denied, target) || protectAncestors && prospectiveInside(target, denied);
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/deny-mutations.js
function resolveMutationComparablePaths(rawPath) {
	assertNoNulPathInput(rawPath, "path contains a NUL byte");
	assertNoWindowsPathAlias(rawPath, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	const resolved = resolvePathPreservingWindowsRoot(rawPath);
	assertNoWindowsPathAlias(resolved, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	const canonical = resolveExistingAncestor(resolved, "native");
	assertNoWindowsPathAlias(canonical, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	return /* @__PURE__ */ new Set([resolved, canonical]);
}
function strictMutationComparablePaths(pathname) {
	const resolved = resolvePathPreservingWindowsRoot(pathname);
	assertNoWindowsPathAlias(resolved, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	let cursor = resolved;
	const filesystemRoot = path.parse(resolved).root;
	while (cursor !== filesystemRoot) try {
		fs.lstatSync(pathForWindowsFilesystem(cursor));
		break;
	} catch (error) {
		if (!isNotFoundPathError(error)) throw error;
		cursor = path.dirname(cursor);
	}
	const canonicalAncestor = realpathSync$1.native(pathForWindowsFilesystem(cursor));
	assertNoWindowsPathAlias(canonicalAncestor, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	const canonical = cursor === resolved ? canonicalAncestor : path.resolve(canonicalAncestor, `.${path.sep}${resolved.slice(cursor.length)}`);
	assertNoWindowsPathAlias(canonical, "filesystem", "mutation path uses a Windows filesystem namespace alias");
	return path.relative(path.resolve(resolved), path.resolve(canonical)) === "" ? [resolved] : [resolved, canonical];
}
function policyPathEntries(entries, strict) {
	const paths = [];
	for (const entry of entries ?? []) {
		if (strict && (!entry || !path.isAbsolute(entry))) throw new FsSafeError("invalid-path", "deny mutation paths must be non-empty absolute paths");
		if (entry.length === 0) throw new FsSafeError("invalid-path", "deny mutation paths must be non-empty");
		assertNoNulPathInput(entry, "deny mutation path contains a NUL byte");
		assertNoWindowsPathAlias(entry, "filesystem", "deny mutation path uses a Windows filesystem namespace alias");
		if (!strict && !path.isAbsolute(entry)) throw new FsSafeError("invalid-path", "deny mutation paths must be absolute");
		paths.push(strict ? resolvePathPreservingWindowsRoot(entry) : entry);
	}
	return paths;
}
function assertMutationNotDenied(filePath, policy, options = {}, mode = "root") {
	if (!policy?.paths?.length && !policy?.prefixes?.length) return;
	const strict = mode === "sync-root-lock";
	const comparablePaths = strict ? strictMutationComparablePaths : resolveMutationComparablePaths;
	const targets = comparablePaths(filePath);
	const matches = createMutationDenyMatcher();
	for (const kind of ["paths", "prefixes"]) for (const entry of policyPathEntries(policy[kind], strict)) {
		const deniedPaths = comparablePaths(entry);
		for (const target of targets) for (const denied of deniedPaths) if (matches(target, denied, kind === "prefixes", options.protectAncestors)) throw new FsSafeError("denied-path", "path is denied by denyMutations policy");
	}
}
function mergeDenyMutationPolicies(defaultPolicy, callPolicy) {
	if (!defaultPolicy) return callPolicy;
	if (!callPolicy) return defaultPolicy;
	return {
		paths: [...defaultPolicy.paths ?? [], ...callPolicy.paths ?? []],
		prefixes: [...defaultPolicy.prefixes ?? [], ...callPolicy.prefixes ?? []]
	};
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/path-segment-route.js
function sameAbsolutePath(left, right) {
	return path.relative(path.resolve(left), path.resolve(right)) === "";
}
function createPathSegmentRoute(segments) {
	const offsets = new Array(segments.length + 1);
	let cursor = 0;
	for (let index = 0; index < segments.length; index += 1) {
		offsets[index] = cursor;
		cursor += segments[index].length;
		if (index + 1 < segments.length) cursor += path.sep.length;
	}
	offsets[segments.length] = cursor;
	return Object.freeze({
		joined: segments.join(path.sep),
		offsets: Object.freeze(offsets)
	});
}
function joinPathSegmentRoute(base, route, offset, tail) {
	const start = route.offsets[offset];
	if (start === void 0) throw new RangeError("path segment offset is outside the route");
	const suffix = route.joined.slice(start);
	if (suffix) return tail === void 0 ? path.join(base, suffix) : path.join(base, suffix, tail);
	return tail === void 0 ? base : path.join(base, tail);
}
//#endregion
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/file-lock-sync-root.js
const retainedRootContexts = /* @__PURE__ */ new WeakMap();
const retainedRootDefaults = /* @__PURE__ */ new WeakMap();
/** @internal Registers only instances constructed by RootHandle itself. */
function registerFileLockSyncRootAdapter(handle, context, defaults) {
	const identity = context.rootIdentity;
	if (typeof identity.dev !== "bigint" || typeof identity.ino !== "bigint") return;
	retainedRootContexts.set(handle, context);
	retainedRootDefaults.set(handle, defaults);
}
function snapshotPolicy(policy) {
	if (policy === void 0) return void 0;
	const paths = policy.paths;
	const prefixes = policy.prefixes;
	return Object.freeze({
		paths: paths === void 0 ? void 0 : Object.freeze([...paths]),
		prefixes: prefixes === void 0 ? void 0 : Object.freeze([...prefixes])
	});
}
function captureFileLockSyncRootAuthority(lockRoot) {
	const adapter = lockRoot;
	const retainedContext = retainedRootContexts.get(adapter);
	const retainedDefaults = retainedRootDefaults.get(adapter);
	if (!retainedContext || !retainedDefaults) throw new FsSafeError("helper-unavailable", "synchronous Root-backed file locks require a genuine fs-safe Root handle");
	const identity = retainedContext.rootIdentity;
	if (typeof identity.dev !== "bigint" || typeof identity.ino !== "bigint") throw new FsSafeError("helper-unavailable", "synchronous Root identity is unavailable");
	const context = Object.freeze({
		rootDir: retainedContext.rootDir,
		rootGuard: retainedContext.rootGuard,
		rootIdentity: Object.freeze({
			dev: identity.dev,
			ino: identity.ino
		}),
		rootReal: retainedContext.rootReal,
		rootWithSep: retainedContext.rootWithSep
	});
	const defaults = retainedDefaults;
	const assertBeforeMutation = defaults.assertBeforeMutation;
	const denyMutations = snapshotPolicy(defaults.denyMutations);
	const hardlinks = defaults.hardlinks;
	const mutationSymlinks = defaults.mutationSymlinks;
	const symlinks = defaults.symlinks;
	assertRootIdentityCurrentSync(context);
	const mutation = mutationSymlinkResolution(mutationSymlinks);
	const mutationPolicy = Object.freeze({
		rejectSymlinks: mutation.rejectSymlinks,
		rejectFinalSymlink: mutation.rejectFinalSymlink,
		rejectUnresolvedSymlinks: true
	});
	const readPolicy = Object.freeze({
		...readSymlinkResolution(symlinks),
		rejectUnresolvedSymlinks: true
	});
	return Object.freeze({
		adapter,
		context,
		assertBeforeMutation,
		denyMutations,
		hardlinks,
		mutationPolicy,
		readPolicy,
		policiesMatch: mutationPolicy.rejectSymlinks === readPolicy.rejectSymlinks && mutationPolicy.rejectFinalSymlink === readPolicy.rejectFinalSymlink
	});
}
function invokeFileLockSyncRootMutationAuthority(authority) {
	const assertion = authority.assertBeforeMutation;
	if (!assertion) return false;
	assertSynchronousCallbackResult(assertion(), "assertBeforeMutation");
	return true;
}
function absoluteRootPath(authority, relativePath) {
	const segments = relativePath.split(path.posix.sep);
	const absolute = path.join(authority.context.rootReal, ...segments);
	assertNoWindowsPathAlias(absolute, "filesystem", "sidecar lock path uses a Windows filesystem namespace alias");
	return absolute;
}
function assertFileLockSyncRootMutationAllowed(pathname, policy, protectAncestors = false) {
	assertMutationNotDenied(pathname, policy, { protectAncestors }, "sync-root-lock");
}
function resolveAdmittedPath(authority, absolutePath, policy, rootPath) {
	const context = authority.context;
	let resolved;
	try {
		resolved = resolveRootPathSync({
			absolutePath,
			rootPath,
			rootCanonicalPath: context.rootReal,
			rootIdentity: context.rootIdentity,
			boundaryLabel: "sidecar lock root",
			...policy
		});
	} catch (error) {
		if (isRootPathEscapeError(error)) throw new FsSafeError("outside-workspace", "sidecar lock path is outside lockRoot", { cause: error });
		throw error;
	}
	const admitted = admitPathInsideRoot({
		rootPath: context.rootReal,
		candidatePath: resolved.canonicalPath,
		rootIdentity: context.rootIdentity
	});
	if (!admitted || admitted.relativePath === "" || sameAbsolutePath(admitted.path, context.rootReal)) throw outsideWorkspaceError();
	return {
		path: admitted.path,
		relativePath: admitted.relativePath.split(path.sep).join(path.posix.sep)
	};
}
function resolveBothPolicies(authority, absolutePath, rootPath) {
	const { mutationPolicy, readPolicy, policiesMatch } = authority;
	const mutation = resolveAdmittedPath(authority, absolutePath, mutationPolicy, rootPath);
	const readable = policiesMatch ? mutation : resolveAdmittedPath(authority, absolutePath, readPolicy, rootPath);
	if (!sameAbsolutePath(mutation.path, readable.path)) throw new FsSafeError("path-mismatch", "sidecar read and mutation paths resolve differently");
	assertFileLockSyncRootMutationAllowed(mutation.path, authority.denyMutations);
	return mutation;
}
function admitRequestedRootPrefix(authority, requestedPath) {
	const context = authority.context;
	const identityCache = process.platform === "win32" ? /* @__PURE__ */ new Map() : void 0;
	const original = admitPathInsideRoot({
		rootPath: context.rootDir,
		candidatePath: requestedPath,
		rootIdentity: context.rootIdentity,
		resolveCandidateRoot: context.rootDir !== context.rootReal,
		identityCache
	});
	if (original && original.relativePath !== "") return {
		path: original.path,
		rootPath: context.rootDir
	};
	const canonical = context.rootDir === context.rootReal ? void 0 : admitPathInsideRoot({
		rootPath: context.rootReal,
		candidatePath: requestedPath,
		rootIdentity: context.rootIdentity,
		identityCache
	});
	if (!canonical || canonical.relativePath === "") throw outsideWorkspaceError();
	return {
		path: canonical.path,
		rootPath: context.rootReal
	};
}
function admitFileLockSyncRootPath(authority, requestedPath) {
	assertNoNulPathInput(requestedPath, "sidecar lock path contains a NUL byte");
	const resolved = resolvePathPreservingWindowsRoot(requestedPath);
	assertNoWindowsPathAlias(resolved, "filesystem", "sidecar lock path uses a Windows filesystem namespace alias");
	assertRootIdentityCurrentSync(authority.context);
	const prefixed = admitRequestedRootPrefix(authority, resolved);
	const selected = resolveBothPolicies(authority, prefixed.path, prefixed.rootPath);
	assertRootIdentityCurrentSync(authority.context);
	const admitted = Object.freeze({
		authority,
		path: selected.path,
		relativePath: selected.relativePath
	});
	assertMissingParentMutationsAllowed(admitted);
	return admitted;
}
function assertFileLockSyncRootResolvedPathCurrent(pathAuthority) {
	if (!sameAbsolutePath(resolveBothPolicies(pathAuthority.authority, absoluteRootPath(pathAuthority.authority, pathAuthority.relativePath), pathAuthority.authority.context.rootReal).path, pathAuthority.path)) throw new FsSafeError("path-mismatch", "sidecar lock path changed during operation");
}
function assertMissingParentMutationsAllowed(pathAuthority) {
	const authority = pathAuthority.authority;
	const context = authority.context;
	const relativeParent = path.posix.dirname(pathAuthority.relativePath);
	const relative = relativeParent === "." ? "" : relativeParent;
	let current = context.rootReal;
	let missing = false;
	for (const segment of relative.split(path.posix.sep).filter(Boolean)) {
		current = path.join(current, segment);
		if (!missing) try {
			const stat = fs.lstatSync(pathForWindowsFilesystem(current), { bigint: true });
			if (stat.isSymbolicLink() || !stat.isDirectory()) throw directoryComponentNotDirectoryError();
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
			missing = true;
		}
		if (missing) assertFileLockSyncRootMutationAllowed(current, authority.denyMutations);
	}
}
function assertFileLockSyncRootPathsCurrent(paths) {
	const authority = paths[0]?.authority;
	for (const pathAuthority of paths) if (authority && pathAuthority.authority !== authority) throw new FsSafeError("path-mismatch", "sidecar paths use different Root authority");
	if (authority && invokeFileLockSyncRootMutationAuthority(authority)) {
		assertRootIdentityCurrentSync(authority.context);
		for (const pathAuthority of paths) {
			assertFileLockSyncRootResolvedPathCurrent(pathAuthority);
			assertMissingParentMutationsAllowed(pathAuthority);
		}
		assertRootIdentityCurrentSync(authority.context);
	}
}
function resolveTargetPathViaExistingAncestorSync(targetPath) {
	const normalized = resolvePathPreservingWindowsRoot(targetPath);
	const canonicalize = process.platform === "win32" ? realpathSync$1.native : realpathSync$1;
	let cursor = normalized;
	let canonicalAncestor;
	while (true) {
		try {
			fs.lstatSync(pathForWindowsFilesystem(cursor));
			try {
				canonicalAncestor = canonicalize(pathForWindowsFilesystem(cursor));
				break;
			} catch (error) {
				if (!isNotFoundPathError(error)) throw error;
			}
		} catch (error) {
			if (!isNotFoundPathError(error)) throw error;
		}
		const parent = path.dirname(cursor);
		if (parent === cursor) {
			canonicalAncestor = canonicalize(pathForWindowsFilesystem(cursor));
			break;
		}
		cursor = parent;
	}
	assertNoWindowsPathAlias(canonicalAncestor, "filesystem", "file-lock target ancestor uses a Windows filesystem namespace alias");
	return resolvePathPreservingWindowsRoot(cursor === normalized ? canonicalAncestor : path.resolve(canonicalAncestor, `.${path.sep}${normalized.slice(cursor.length)}`));
}
function normalizeFileLockSyncTargetWithRoot(authority, resolvedTargetPath) {
	assertNoNulPathInput(resolvedTargetPath, "file-lock target contains a NUL byte");
	assertNoWindowsPathAlias(resolvedTargetPath, "filesystem", "file-lock target uses a Windows filesystem namespace alias");
	assertRootIdentityCurrentSync(authority.context);
	const normalized = process.platform === "win32" ? resolveTargetPathViaExistingAncestorSync(resolvedTargetPath) : path.join(resolveTargetPathViaExistingAncestorSync(path.dirname(resolvedTargetPath)), path.basename(resolvedTargetPath));
	assertNoWindowsPathAlias(normalized, "filesystem", "file-lock target uses a Windows filesystem namespace alias");
	assertRootIdentityCurrentSync(authority.context);
	return normalized;
}
//#endregion
export { createRootObservationGuard as A, mutationObservationsCurrent as C, assertRootIdentityCurrentSync as D, assertRootIdentityCurrent as E, rootRelativeReadPath as F, registerTempPathForExit as I, expandRelativePathWithHome as M, resolvePathInRoot as N, assertValidRootDestinationPath as O, resolveRootContext as P, mutationObservationUsesDirectory as S, observeMutationPath as T, withAsyncDirectoryGuards as _, captureFileLockSyncRootAuthority as a, missingMutationSegments as b, registerFileLockSyncRootAdapter as c, sameAbsolutePath as d, assertMutationNotDenied as f, removePathIfIdentityUnchanged as g, probePathCaseInsensitiveSync as h, assertFileLockSyncRootResolvedPathCurrent as i, ensureTrailingSep as j, assertValidRootRelativePath as k, createPathSegmentRoute as l, createMutationDenyMatcher as m, assertFileLockSyncRootMutationAllowed as n, invokeFileLockSyncRootMutationAuthority as o, mergeDenyMutationPolicies as p, assertFileLockSyncRootPathsCurrent as r, normalizeFileLockSyncTargetWithRoot as s, admitFileLockSyncRootPath as t, joinPathSegmentRoute as u, advanceMutationObservation as v, nextMissingMutationPath as w, mutationObservationCurrent as x, checkedMutationDirectory as y };
