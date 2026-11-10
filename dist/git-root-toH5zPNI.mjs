import { r as isMissingPathError } from "./errno-FR4CRyya.mjs";
import { t as escapeRegExp } from "./regexp-BZyMFTlj.mjs";
import "./errors-DPfGDWk1.mjs";
import { t as unquoteGitPath } from "./git-path-quote-DUm87W5B.mjs";
import fs from "node:fs";
import path from "node:path";
import { readFileDescriptorBoundedSync, readFileWindowFullySync } from "@openclaw/fs-safe/advanced";
import { safeStatSync } from "@openclaw/fs-safe/path";
import { isUtf8 } from "node:buffer";
//#region src/infra/git-root.ts
function walkUpFrom(startDir, opts, resolveAtDir) {
	let current = path.resolve(startDir);
	for (let i = 0; opts.maxDepth === void 0 || i < opts.maxDepth; i += 1) {
		const resolved = resolveAtDir(current);
		if (resolved !== null && resolved !== void 0) return resolved;
		const parent = path.dirname(current);
		if (parent === current) break;
		current = parent;
	}
	return null;
}
function hasGitMarker(repoRoot) {
	const stat = safeStatSync(path.join(repoRoot, ".git"));
	return stat ? stat.isDirectory() || stat.isFile() : false;
}
function findGitRoot(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => hasGitMarker(repoRoot) ? repoRoot : null);
}
function readGitMetadataFile(filePath, limit = 1048576) {
	const fd = fs.openSync(filePath, fs.constants.O_RDONLY | (fs.constants.O_NONBLOCK ?? 0));
	try {
		const stat = fs.fstatSync(fd);
		if (!stat.isFile() || stat.size > limit) throw new Error("Git metadata is not a bounded regular file");
		const bytes = readFileDescriptorBoundedSync(fd, Math.min(stat.size, limit));
		if (bytes.length !== stat.size) throw new Error("Git metadata changed during its read");
		return bytes;
	} finally {
		fs.closeSync(fd);
	}
}
function readGitDirectoryPointerTarget(filePath, prefix = "") {
	const bytes = readGitMetadataFile(filePath);
	const raw = bytes.toString("utf8").replace(/[\r\n]+$/u, "");
	if (!isUtf8(bytes) || !raw.startsWith(prefix) || raw.length === prefix.length || raw.includes("\0")) throw new Error("Git directory pointer is incomplete or malformed");
	const target = raw.slice(prefix.length);
	return path.isAbsolute(target) ? target : `${path.dirname(filePath)}${path.sep}${target}`;
}
function readGitDirectoryPointer(filePath, prefix = "") {
	return fs.realpathSync.native(readGitDirectoryPointerTarget(filePath, prefix));
}
/** A lookup needs its aliases too: unlinking a traversed symlink can strand an outside target. */
function resolveGitStoragePath(target, paths, assertBudget) {
	assertBudget();
	const raw = path.isAbsolute(target) ? target : `${process.cwd()}${path.sep}${target}`;
	paths.add(raw);
	let canonical;
	try {
		canonical = fs.realpathSync.native(raw);
		paths.add(canonical);
	} catch {}
	if (raw === canonical) return canonical;
	const components = (value) => value.slice(path.parse(value).root.length).split(process.platform === "win32" ? /[\\/]/u : /\//u);
	const pending = components(raw).toReversed();
	let current = path.parse(raw).root;
	let symlinks = 0;
	while (pending.length > 0) {
		assertBudget();
		const component = pending.pop();
		if (!component || component === ".") continue;
		if (component === "..") {
			current = path.dirname(current);
			continue;
		}
		const lookup = path.join(current, component);
		paths.add(lookup);
		try {
			if (fs.lstatSync(lookup).isSymbolicLink()) {
				if (++symlinks > 40) return;
				const link = fs.readlinkSync(lookup);
				if (path.isAbsolute(link)) current = path.parse(link).root;
				pending.push(...components(link).toReversed());
			} else current = fs.realpathSync.native(lookup);
		} catch {
			return;
		}
	}
	return current === canonical ? canonical : void 0;
}
function resolveGitDirFromMarker(repoRoot) {
	const gitPath = path.join(repoRoot, ".git");
	try {
		const stat = fs.statSync(gitPath);
		if (stat.isDirectory()) return gitPath;
		if (!stat.isFile()) return null;
		return readGitDirectoryPointer(gitPath, "gitdir: ");
	} catch {
		return null;
	}
}
/** Resolve storage at an exact root; fleet callers run this uncached census in a worker. */
function readGitMetadataDirectories(repoRoot, assertBudget = () => {}) {
	const paths = /* @__PURE__ */ new Set();
	const root = resolveGitStoragePath(repoRoot, paths, assertBudget);
	if (!root) return;
	const marker = path.join(root, ".git");
	let markerStat;
	let commonMarkerExists;
	let directory;
	try {
		markerStat = fs.lstatSync(marker, { throwIfNoEntry: false });
	} catch {
		return;
	}
	if (markerStat) {
		const physicalMarker = resolveGitStoragePath(marker, paths, assertBudget);
		if (!physicalMarker) return;
		try {
			directory = fs.statSync(physicalMarker).isDirectory() ? physicalMarker : readGitDirectoryPointerTarget(marker, "gitdir: ");
		} catch {
			return;
		}
	} else {
		if (!safeStatSync(path.join(root, "HEAD"))?.isFile() || !safeStatSync(path.join(root, "objects"))?.isDirectory() || !safeStatSync(path.join(root, "refs"))?.isDirectory()) return;
		directory = root;
	}
	const gitDir = resolveGitStoragePath(directory, paths, assertBudget);
	if (!gitDir || !safeStatSync(gitDir)?.isDirectory()) return;
	const commonMarker = path.join(gitDir, "commondir");
	try {
		commonMarkerExists = fs.lstatSync(commonMarker, { throwIfNoEntry: false }) !== void 0;
	} catch {
		return;
	}
	let commonDir = gitDir;
	if (commonMarkerExists) {
		if (!resolveGitStoragePath(commonMarker, paths, assertBudget)) return;
		let target;
		try {
			target = readGitDirectoryPointerTarget(commonMarker);
		} catch {
			return;
		}
		const resolved = resolveGitStoragePath(target, paths, assertBudget);
		if (!resolved || !safeStatSync(resolved)?.isDirectory()) return;
		commonDir = resolved;
	}
	return {
		gitDir,
		commonDir,
		paths: [...paths]
	};
}
function resolveRelativeWorktreePath(base, relative, assertBudget) {
	let resolved = base;
	const components = relative.split(process.platform === "win32" ? /[\\/]/u : /\//u);
	for (const component of components) {
		assertBudget();
		if (!component || component === ".") continue;
		if (component === "..") {
			resolved = path.dirname(resolved);
			continue;
		}
		const next = path.join(resolved, component);
		try {
			resolved = fs.realpathSync.native(next);
		} catch (error) {
			try {
				if (!isMissingPathError(error) || fs.lstatSync(next, { throwIfNoEntry: false })) return;
			} catch {
				return;
			}
			resolved = next;
		}
	}
	return resolved;
}
/** Native removal owns common/worktrees/<id>, independently of the checkout's .git marker. */
function readGitWorktreeAdministrations(commonDir, assertBudget) {
	const entries = [];
	const root = path.join(commonDir, "worktrees");
	let complete = true;
	let directory;
	assertBudget();
	try {
		directory = fs.opendirSync(root);
	} catch (error) {
		return {
			entries,
			complete: isMissingPathError(error) && !fs.lstatSync(root, { throwIfNoEntry: false })
		};
	}
	try {
		for (;;) {
			assertBudget();
			let entry;
			try {
				entry = directory.readSync();
			} catch {
				complete = false;
				break;
			}
			if (!entry) break;
			const adminPath = path.join(root, entry.name);
			let backlink;
			let physicalAdminPath;
			try {
				const marker = path.join(adminPath, "gitdir");
				if (!fs.lstatSync(marker, { throwIfNoEntry: false })) continue;
				const bytes = readGitMetadataFile(marker);
				backlink = bytes.toString("utf8").replace(/[\t-\r ]+$/u, "").replace(/\/\.git$/u, "");
				if (!backlink || !isUtf8(bytes) || backlink.includes("\0")) {
					complete = false;
					continue;
				}
				physicalAdminPath = fs.realpathSync.native(adminPath);
			} catch {
				complete = false;
				continue;
			}
			const checkoutPath = path.isAbsolute(backlink) ? backlink : resolveRelativeWorktreePath(physicalAdminPath, backlink, assertBudget);
			if (!checkoutPath) {
				complete = false;
				continue;
			}
			entries.push({
				checkoutPath,
				adminPath,
				physicalAdminPath
			});
		}
	} finally {
		directory.closeSync();
	}
	assertBudget();
	return {
		entries,
		complete
	};
}
/** Git's object graph follows only info/alternates; each deletion census reads it anew. */
function readGitObjectStorageDependencies(commonDir, assertBudget) {
	const paths = /* @__PURE__ */ new Set();
	const visited = /* @__PURE__ */ new Set();
	let complete = true;
	const visit = (target, depth) => {
		assertBudget();
		const directory = resolveGitStoragePath(target, paths, assertBudget);
		if (!directory) {
			complete = false;
			return;
		}
		let bytes;
		const marker = path.join(directory, "info", "alternates");
		try {
			if (!fs.statSync(directory).isDirectory()) {
				complete = false;
				return;
			}
			const key = process.platform === "win32" ? directory.toLowerCase() : directory;
			if (visited.has(key)) return;
			visited.add(key);
			if (!fs.lstatSync(marker, { throwIfNoEntry: false })) return;
		} catch {
			complete = false;
			return;
		}
		const physicalMarker = resolveGitStoragePath(marker, paths, assertBudget);
		if (!physicalMarker) {
			complete = false;
			return;
		}
		try {
			bytes = readGitMetadataFile(physicalMarker);
		} catch {
			complete = false;
			return;
		}
		assertBudget();
		const nul = bytes.indexOf(0);
		if (nul >= 0) {
			complete = false;
			bytes = bytes.subarray(0, nul);
		}
		if (depth >= 5) return;
		for (let offset = 0; offset < bytes.length;) {
			assertBudget();
			const newline = bytes.indexOf(10, offset);
			const lineEnd = newline < 0 ? bytes.length : newline;
			const comment = bytes[offset] === 35;
			const quoted = comment ? void 0 : unquoteGitPath(bytes, offset);
			const entry = quoted?.bytes ?? bytes.subarray(offset, lineEnd);
			const end = quoted?.end ?? lineEnd;
			offset = end < bytes.length ? end + 1 : end;
			if (comment || entry.length === 0) continue;
			if (entry.includes(0) || !isUtf8(entry)) {
				complete = false;
				continue;
			}
			const pointer = entry.toString("utf8");
			visit(path.isAbsolute(pointer) ? pointer : `${directory}${path.sep}${pointer}`, depth + 1);
		}
	};
	visit(path.join(commonDir, "objects"), -1);
	assertBudget();
	return {
		paths: [...paths],
		complete
	};
}
function resolveGitHeadPath(startDir, opts = {}) {
	return walkUpFrom(startDir, opts, (repoRoot) => {
		const gitDir = resolveGitDirFromMarker(repoRoot);
		return gitDir ? path.join(gitDir, "HEAD") : null;
	});
}
/** Read at most `limit` bytes from Git or build metadata. */
function readGitMetadataPrefix(filePath, limit = 256) {
	const fd = fs.openSync(filePath, fs.constants.O_RDONLY | (fs.constants.O_NONBLOCK ?? 0));
	try {
		if (!fs.fstatSync(fd).isFile()) throw new Error("Git metadata is not a regular file");
		const buf = Buffer.alloc(limit);
		const bytesRead = readFileWindowFullySync(fd, buf, 0);
		return buf.subarray(0, bytesRead).toString("utf-8");
	} finally {
		fs.closeSync(fd);
	}
}
function readGitHead(startDir, opts = {}) {
	const headPath = resolveGitHeadPath(startDir, opts);
	if (!headPath) return;
	const head = readGitMetadataFile(headPath).toString("utf8").trim();
	if (!head.startsWith("ref:")) return {
		headPath,
		ref: null,
		value: head || null
	};
	const ref = head.replace(/^ref:\s*/i, "").trim();
	const refsBase = resolveGitRefsBase(headPath);
	return {
		headPath,
		ref,
		value: readGitRefs(refsBase, [ref]).get(ref) ?? null,
		refsBase
	};
}
function resolveGitRefsBase(headPath) {
	const gitDir = path.dirname(headPath);
	const marker = path.join(gitDir, "commondir");
	try {
		return readGitDirectoryPointer(marker);
	} catch (error) {
		if (!isMissingPathError(error) || fs.lstatSync(marker, { throwIfNoEntry: false })) throw error;
	}
	return gitDir;
}
/** Raw ref contents, sharing one packed inventory across the requested names. */
function readGitRefs(refsBase, refs) {
	const values = new Map(refs.map((ref) => [ref, null]));
	const missing = /* @__PURE__ */ new Set();
	for (const ref of refs) {
		const refPath = resolveRefPath(refsBase, ref);
		if (!refPath) continue;
		try {
			values.set(ref, readGitMetadataPrefix(refPath).trim());
		} catch (error) {
			if (!isMissingPathError(error)) throw error;
			missing.add(ref);
		}
	}
	if (missing.size === 0) return values;
	try {
		const packedRefs = readGitMetadataFile(path.join(refsBase, "packed-refs"), Number.MAX_SAFE_INTEGER).toString("utf8");
		const records = new RegExp(`^(?![#^])[^\\S\\r\\n]*(\\S+)[^\\S\\r\\n]+(${[...missing].map(escapeRegExp).join("|")})(?=\\s|$)`, "gm");
		for (const [, value, packedRef] of packedRefs.matchAll(records)) if (missing.delete(packedRef)) values.set(packedRef, value);
	} catch (error) {
		if (!isMissingPathError(error)) throw error;
	}
	return values;
}
/** Safely resolve a Git ref path, rejecting traversal from a crafted HEAD file. */
function resolveRefPath(refsBase, ref) {
	if (!ref.startsWith("refs/")) return null;
	if (ref.split(/[/]/).includes("..")) return null;
	const resolved = path.resolve(refsBase, ref);
	const rel = path.relative(refsBase, resolved);
	if (!rel || rel.startsWith("..") || path.isAbsolute(rel)) return null;
	return resolved;
}
//#endregion
export { readGitObjectStorageDependencies as a, resolveGitRefsBase as c, readGitMetadataPrefix as i, readGitHead as n, readGitRefs as o, readGitMetadataDirectories as r, readGitWorktreeAdministrations as s, findGitRoot as t };
