import { a as resolveGlobalSingleton } from "./global-singleton-0m-JziJW.mjs";
import * as module from "node:module";
import { readFileSync, statSync } from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import os from "node:os";
import { createHash } from "node:crypto";
import { Worker, isMainThread, workerData } from "node:worker_threads";
//#region node-compile-cache.mjs
const MAX_BYTES = 536870912;
const MAX_AGE_MS = 6048e5;
const MAINTENANCE_INTERVAL_MS = 36e5;
const BUILD_MARKER_RE = /^(?:[a-f0-9]{16}|\d+-\d+|no-package-json|build-[A-Za-z0-9._-]+)$/;
const sanitize = (value) => {
	const segment = value.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
	return segment && segment !== "." && segment !== ".." ? segment : "unknown";
};
function resolveOpenClawCompileCacheDirectory({ installRoot, env = process.env }) {
	const packagePath = path.join(installRoot, "package.json");
	let version = "unknown";
	let marker = "no-package-json";
	try {
		const parsed = JSON.parse(readFileSync(packagePath, "utf8"));
		version = typeof parsed.version === "string" ? sanitize(parsed.version) : version;
		const stat = statSync(packagePath);
		marker = `${Math.trunc(stat.mtimeMs)}-${stat.size}`;
	} catch {}
	try {
		const build = JSON.parse(readFileSync(path.join(installRoot, "dist", "build-info.json"), "utf8"));
		if (typeof build.buildId === "string" && build.buildId.trim()) marker = createHash("sha256").update(build.buildId).digest("hex").slice(0, 16);
	} catch {}
	let base = path.resolve(env.NODE_COMPILE_CACHE || path.join(os.tmpdir(), "node-compile-cache"));
	while (path.basename(path.dirname(path.dirname(base))) === "openclaw" && BUILD_MARKER_RE.test(path.basename(base))) base = path.dirname(path.dirname(path.dirname(base)));
	return resolveSafeNodeCompileCacheDirectory(path.join(base, "openclaw", version, marker));
}
function resolveSafeNodeCompileCacheDirectory(directory) {
	if (process.platform === "win32" && path.resolve(directory).length > 200) {
		process.stderr.write("[openclaw] Compile cache disabled: Windows cache path exceeds 200 characters.\n");
		return;
	}
	return directory;
}
async function maintainOpenClawCompileCache(directory) {
	if (process.permission) return;
	const owner = globalThis[Symbol.for("openclaw.nodeCompileCacheBase")] ??= {};
	const pending = owner.maintenance ??= /* @__PURE__ */ new Map();
	if (pending.has(directory)) return pending.get(directory);
	const task = new Promise((resolve) => {
		const worker = new Worker(new URL(import.meta.url), {
			workerData: { openclawCompileCacheDirectory: directory },
			execArgv: [],
			env: Object.fromEntries(Object.entries(process.env).filter(([name]) => !/^(NODE_OPTIONS|BUN_OPTIONS)$/i.test(name)))
		});
		worker.on("error", () => {});
		worker.once("exit", () => resolve());
		worker.unref();
	}).catch(() => {}).finally(() => pending.delete(directory));
	pending.set(directory, task);
	return task;
}
async function maintain(directory) {
	const root = path.dirname(path.dirname(directory));
	const version = path.basename(path.dirname(directory));
	if (path.basename(root) !== "openclaw" || sanitize(version) !== version || !BUILD_MARKER_RE.test(path.basename(directory))) return;
	const now = Date.now();
	const previous = await fs$1.lstat(root).catch(() => void 0);
	for (const target of [
		root,
		path.dirname(directory),
		directory
	]) {
		const stat = target === root ? previous : await fs$1.lstat(target).catch(() => void 0);
		if (stat && !stat.isDirectory()) return;
	}
	await fs$1.mkdir(directory, { recursive: true });
	let retired = false;
	for (const entry of await fs$1.readdir(root, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const versionRoot = path.join(root, entry.name);
		for (const build of await fs$1.readdir(versionRoot, { withFileTypes: true })) {
			const candidate = path.join(versionRoot, build.name);
			if (build.isDirectory() && candidate !== directory) {
				await fs$1.rm(candidate, {
					recursive: true,
					force: true
				});
				retired = true;
			}
		}
		if (versionRoot !== path.dirname(directory)) await fs$1.rmdir(versionRoot).catch(() => {});
	}
	if (!retired && previous && now - previous.mtimeMs < MAINTENANCE_INTERVAL_MS) return;
	await fs$1.utimes(root, new Date(now), new Date(now));
	const files = [];
	let bytes = 0;
	async function visit(dir) {
		for (const entry of await fs$1.readdir(dir, { withFileTypes: true })) {
			const file = path.join(dir, entry.name);
			if (entry.isDirectory()) await visit(file);
			else if (entry.isFile()) {
				const stat = await fs$1.lstat(file);
				bytes += stat.size;
				files.push({
					file,
					size: stat.size,
					mtimeMs: stat.mtimeMs
				});
			}
		}
	}
	await visit(directory);
	files.sort((left, right) => left.mtimeMs - right.mtimeMs);
	for (const file of files) if (bytes > MAX_BYTES || now - file.mtimeMs > MAX_AGE_MS) {
		await fs$1.unlink(file.file);
		bytes -= file.size;
	}
}
if (!isMainThread && typeof workerData?.openclawCompileCacheDirectory === "string") maintain(workerData.openclawCompileCacheDirectory).catch(() => {});
//#endregion
//#region src/infra/node-compile-cache-env.ts
const COMPILE_CACHE_BASE_KEY = Symbol.for("openclaw.nodeCompileCacheBase");
function compileCacheOwner() {
	return resolveGlobalSingleton(COMPILE_CACHE_BASE_KEY, () => ({}));
}
/** Enable through OpenClaw, retaining only the input to a successful first enable. */
function enableOwnedNodeCompileCache(directory) {
	const baseDirectory = path.resolve(directory);
	const result = module.enableCompileCache(directory);
	const enabled = module.constants?.compileCacheStatus?.ENABLED;
	if (enabled !== void 0 && result?.status === enabled) {
		compileCacheOwner().baseDirectory ??= baseDirectory;
		maintainOpenClawCompileCache(baseDirectory);
	}
}
function resolveNodeCompileCacheEnv(env = process.env) {
	if (env.NODE_DISABLE_COMPILE_CACHE !== void 0) return env;
	const directory = env.NODE_COMPILE_CACHE ?? compileCacheOwner().baseDirectory;
	if (directory && !resolveSafeNodeCompileCacheDirectory(directory)) {
		const disabled = {
			...env,
			NODE_DISABLE_COMPILE_CACHE: "1"
		};
		delete disabled.NODE_COMPILE_CACHE;
		return disabled;
	}
	if (env.NODE_COMPILE_CACHE !== void 0) return env;
	return directory ? {
		...env,
		NODE_COMPILE_CACHE: directory
	} : env;
}
//#endregion
export { resolveNodeCompileCacheEnv as n, resolveOpenClawCompileCacheDirectory as r, enableOwnedNodeCompileCache as t };
