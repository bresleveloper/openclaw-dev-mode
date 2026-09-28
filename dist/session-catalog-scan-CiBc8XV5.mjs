import { r as isPathInside } from "./path-guards-D5kuI0Tv.mjs";
import { t as runTasksWithConcurrency } from "./run-with-concurrency-Dtu208ef.mjs";
import "./concurrency-runtime-BevFACIQ.mjs";
import "./file-access-runtime-CWjkXCju.mjs";
import { t as createDirtyDirectoryWatch } from "./session-catalog-tree-watch-C_yiNljq.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/anthropic/session-catalog-scan.ts
const CLAUDE_PARTIAL_SCAN_TTL_MS = 15e3;
const CLAUDE_SESSION_SCAN_HARD_TTL_MS = 3e5;
const MAX_CATALOG_JSON_CACHE_ENTRIES = 4e3;
const CLAUDE_METADATA_WINDOW_BYTES = 1048576;
const CLAUDE_METADATA_READ_CHUNK_BYTES = 16384;
const CLAUDE_CATALOG_IO_CONCURRENCY = 32;
async function readClaudeCatalogMetadata(handle, fileSize, maxBytes, inspectLine) {
	let pending = Buffer.alloc(0);
	let fileOffset = 0;
	let scannedBytes = 0;
	let stopDiscovery = false;
	let skipPartial = false;
	const readWindow = async (end, metadataOnly) => {
		while (fileOffset < end && scannedBytes < maxBytes) {
			const size = Math.min(CLAUDE_METADATA_READ_CHUNK_BYTES, end - fileOffset, maxBytes - scannedBytes);
			const chunk = Buffer.allocUnsafe(size);
			const { bytesRead } = await handle.read(chunk, 0, size, fileOffset);
			if (bytesRead === 0) return;
			fileOffset += bytesRead;
			scannedBytes += bytesRead;
			pending = pending.length ? Buffer.concat([pending, chunk.subarray(0, bytesRead)]) : chunk.subarray(0, bytesRead);
			let newline;
			while ((newline = pending.indexOf(10)) >= 0) {
				if (!skipPartial) stopDiscovery = inspectLine(pending.subarray(0, newline), metadataOnly || stopDiscovery) || stopDiscovery;
				skipPartial = false;
				pending = pending.subarray(newline + 1);
			}
			if (stopDiscovery && !metadataOnly) return;
		}
	};
	await readWindow(Math.min(fileSize, CLAUDE_METADATA_WINDOW_BYTES), false);
	const prefixReadToEnd = fileOffset >= fileSize;
	const tailOffset = Math.max(fileOffset, fileSize - CLAUDE_METADATA_WINDOW_BYTES);
	skipPartial = tailOffset > fileOffset;
	if (skipPartial) {
		fileOffset = tailOffset - 1;
		pending = Buffer.alloc(0);
	}
	await readWindow(fileSize, true);
	if (fileOffset >= fileSize && !skipPartial && pending.length > 0) inspectLine(pending, stopDiscovery || !prefixReadToEnd);
	return {
		scannedBytes,
		complete: fileOffset >= fileSize
	};
}
const projectTreeSlots = /* @__PURE__ */ new Map();
const catalogJsonCache = /* @__PURE__ */ new Map();
function setBoundedCache(cache, key, value, maxEntries, onEvict) {
	cache.delete(key);
	cache.set(key, value);
	while (cache.size > maxEntries) {
		const oldest = cache.entries().next();
		if (oldest.done) break;
		onEvict?.(oldest.value[1]);
		cache.delete(oldest.value[0]);
	}
}
async function safeSessionFile(root, resolvedRoot, candidate, sessionId) {
	if (!isPathInside(root, candidate) || path.basename(candidate) !== `${sessionId}.jsonl`) return;
	try {
		const resolvedCandidate = await fs.realpath(candidate);
		if (!isPathInside(resolvedRoot, resolvedCandidate)) return;
		const stat = await fs.stat(resolvedCandidate);
		return stat.isFile() ? {
			filePath: resolvedCandidate,
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			ino: stat.ino
		} : void 0;
	} catch (error) {
		const code = error && typeof error === "object" && "code" in error ? error.code : void 0;
		if (code === "ENOENT" || code === "ENOTDIR") return;
		throw new Error("Claude session file validation failed", { cause: error });
	}
}
function safeSessionFileForScan(context, candidate, sessionId) {
	if (!context.resolvedRoot) return Promise.resolve(void 0);
	const resolved = path.resolve(candidate);
	const name = path.basename(resolved);
	const directory = context.directoriesByPath.get(path.dirname(resolved));
	const signature = directory?.files.get(name);
	if (directory && signature && name === `${sessionId}.jsonl`) return Promise.resolve({
		filePath: path.join(directory.resolvedDirectory, name),
		...signature
	});
	const key = `${sessionId}\0${resolved}`;
	let pending = context.safeFiles.get(key);
	if (!pending) {
		pending = safeSessionFile(context.root, context.resolvedRoot, candidate, sessionId).catch(() => {
			context.complete = false;
			if (context.safeFiles.get(key) === pending) context.safeFiles.delete(key);
		});
		context.safeFiles.set(key, pending);
	}
	return pending;
}
async function readJsonFile(filePath, options = {}) {
	const stat = options.signature ?? await fs.stat(filePath).then((value) => value.isFile() ? value : void 0, () => {
		options.onIoFailure?.();
	});
	if (!stat) {
		catalogJsonCache.delete(filePath);
		return;
	}
	const cached = catalogJsonCache.get(filePath);
	if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size && cached.ino === stat.ino) {
		setBoundedCache(catalogJsonCache, filePath, cached, MAX_CATALOG_JSON_CACHE_ENTRIES);
		return cached.value;
	}
	let content;
	try {
		content = await fs.readFile(filePath, "utf8");
	} catch {
		options.onIoFailure?.();
		return;
	}
	try {
		const value = JSON.parse(content);
		setBoundedCache(catalogJsonCache, filePath, {
			mtimeMs: stat.mtimeMs,
			size: stat.size,
			ino: stat.ino,
			value
		}, MAX_CATALOG_JSON_CACHE_ENTRIES);
		return value;
	} catch {
		return;
	}
}
async function childDirectories(root) {
	try {
		return (await fs.readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name));
	} catch {
		return [];
	}
}
function projectsDir(homeDir, configDir) {
	return path.join(configDir ?? path.join(homeDir, ".claude"), "projects");
}
async function readProjectsTreeSnapshot(root, options = {}) {
	let slot = projectTreeSlots.get(root);
	if (slot?.pending) {
		if (!options.forceRefresh) return slot.pending;
		await slot.pending;
		return readProjectsTreeSnapshot(root, options);
	}
	if (!slot) slot = {
		watch: createDirtyDirectoryWatch(root),
		hardExpiresAt: 0
	};
	const current = slot;
	const previous = current.snapshot;
	const dirty = current.watch.takeDirty();
	const full = !previous?.resolvedRoot || options.forceRefresh || current.hardExpiresAt <= Date.now() || dirty === "all";
	setBoundedCache(projectTreeSlots, root, current, 8, (evicted) => evicted.watch.close());
	if (!full && dirty.size === 0 && previous) return previous;
	current.pending = (async () => {
		let complete = true;
		const onReadFailure = () => {
			complete = false;
		};
		const entries = full ? await fs.readdir(root, { withFileTypes: true }).catch(() => void 0) : void 0;
		const resolvedRoot = full ? await fs.realpath(root).catch(() => void 0) : previous?.resolvedRoot;
		if (!resolvedRoot || full && !entries) {
			current.watch.close();
			if (projectTreeSlots.get(root) === current) projectTreeSlots.delete(root);
			return {
				root,
				projectDirectories: [],
				treeStamp: "unavailable"
			};
		}
		const directories = new Map(full ? [] : previous?.projectDirectories.map((dir) => [dir.name, dir]));
		const names = entries ? entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name) : dirty === "all" ? [] : [...dirty];
		current.watch.observeChildDirectories(/* @__PURE__ */ new Set([...directories.keys(), ...names]));
		const { results } = await runTasksWithConcurrency({
			tasks: names.map((name) => async () => {
				const directory = path.join(root, name);
				const stat = await fs.lstat(directory).catch(onReadFailure);
				if (!stat?.isDirectory()) {
					directories.delete(name);
					return;
				}
				const childNames = await fs.readdir(directory).catch(onReadFailure) ?? [];
				return {
					name,
					directory,
					resolvedDirectory: path.join(resolvedRoot, name),
					childNames,
					mtimeMs: stat.mtimeMs,
					files: /* @__PURE__ */ new Map()
				};
			}),
			limit: 32,
			throwOnError: true
		});
		await runTasksWithConcurrency({
			tasks: results.flatMap((dir) => dir ? dir.childNames.map((name) => async () => {
				const stat = await fs.lstat(path.join(dir.directory, name)).catch(onReadFailure);
				if (stat?.isFile()) dir.files.set(name, {
					mtimeMs: stat.mtimeMs,
					size: stat.size,
					ino: stat.ino
				});
			}) : []),
			limit: 32,
			throwOnError: true
		});
		for (const dir of results) if (dir) {
			const files = dir.childNames.map((name) => [name, dir.files.get(name)]);
			directories.set(dir.name, {
				...dir,
				stamp: JSON.stringify([
					dir.name,
					dir.mtimeMs,
					files
				])
			});
		}
		const projectDirectories = [...directories.values()].toSorted((a, b) => a.name.localeCompare(b.name));
		current.watch.observeChildDirectories(directories.keys());
		if (full) current.hardExpiresAt = Date.now() + CLAUDE_SESSION_SCAN_HARD_TTL_MS;
		if (!complete) current.hardExpiresAt = Math.min(current.hardExpiresAt, Date.now() + CLAUDE_PARTIAL_SCAN_TTL_MS);
		return {
			root,
			resolvedRoot,
			projectDirectories,
			treeStamp: JSON.stringify([resolvedRoot, projectDirectories.map((dir) => dir.stamp)])
		};
	})().then((snapshot) => {
		current.snapshot = snapshot;
		return snapshot;
	}).finally(() => {
		current.pending = void 0;
	});
	return current.pending;
}
function desktopSessionsDir(homeDir) {
	return path.join(homeDir, "Library", "Application Support", "Claude", "claude-code-sessions");
}
function configuredClaudeConfigDir(env = process.env) {
	const configured = env.CLAUDE_CONFIG_DIR?.trim();
	return configured ? path.resolve(configured) : void 0;
}
function gatewayClaudeScanOptions(allowProcessHomeFallback) {
	const configDir = configuredClaudeConfigDir();
	return {
		...configDir ? { configDir } : {},
		includeDesktop: allowProcessHomeFallback !== false
	};
}
//#endregion
export { configuredClaudeConfigDir as a, projectsDir as c, readProjectsTreeSnapshot as d, safeSessionFileForScan as f, childDirectories as i, readClaudeCatalogMetadata as l, CLAUDE_PARTIAL_SCAN_TTL_MS as n, desktopSessionsDir as o, setBoundedCache as p, CLAUDE_SESSION_SCAN_HARD_TTL_MS as r, gatewayClaudeScanOptions as s, CLAUDE_CATALOG_IO_CONCURRENCY as t, readJsonFile as u };
