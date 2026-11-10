import { n as readFileDescriptorBoundedSync } from "./openclaw-state-read-bounded-read-CQOkim7o.mjs";
import { d as assertNoWindowsPathAlias } from "./openclaw-state-read-path-DKRN8JwZ.mjs";
import { l as openRootFileSync } from "./openclaw-state-read-runtime-process-manifest-DvMn2cl1.mjs";
import { t as isBunRuntime } from "./openclaw-state-read-runtime-binary-LcE5xcaN.mjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import "node:crypto";
//#region node_modules/.pnpm/@openclaw+fs-safe@0.26.5/node_modules/@openclaw/fs-safe/dist/json.js
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function resolveInvalidMessage(invalidMessage, relativePath) {
	if (typeof invalidMessage === "function") return invalidMessage(relativePath);
	return invalidMessage ?? `${relativePath} has an unexpected shape`;
}
function readRootStructuredFileSyncInternal(options, parser) {
	let absolutePath;
	let relativePath;
	let rootDir;
	let rootRealPath;
	try {
		rootDir = options.rootDir;
		relativePath = options.relativePath;
		rootRealPath = options.rootRealPath;
		assertNoWindowsPathAlias(rootDir);
		assertNoWindowsPathAlias(relativePath, "relative");
		if (rootRealPath !== void 0) assertNoWindowsPathAlias(rootRealPath);
		absolutePath = path.resolve(rootDir, relativePath);
		assertNoWindowsPathAlias(absolutePath);
	} catch (error) {
		return {
			ok: false,
			reason: "open",
			failure: {
				ok: false,
				reason: "validation",
				error
			}
		};
	}
	const boundaryLabel = options.boundaryLabel;
	const rejectHardlinks = options.rejectHardlinks;
	const maxBytes = options.maxBytes;
	const opened = openRootFileSync({
		absolutePath,
		rootPath: rootDir,
		rootRealPath,
		boundaryLabel,
		rejectHardlinks,
		maxBytes,
		allowedType: "file"
	});
	if (!opened.ok) return {
		ok: false,
		reason: "open",
		failure: opened
	};
	try {
		const raw = maxBytes === void 0 ? fs.readFileSync(opened.fd, "utf8") : readFileDescriptorBoundedSync(opened.fd, maxBytes).toString("utf8");
		const parse = parser.parse;
		const parsed = Reflect.apply(parse, parser, [raw]);
		const validate = parser.validate;
		if (validate && !Reflect.apply(validate, parser, [parsed])) return {
			ok: false,
			reason: "invalid",
			error: resolveInvalidMessage(parser.invalidMessage, relativePath)
		};
		return {
			ok: true,
			value: parsed,
			stat: opened.stat,
			path: opened.path,
			rootRealPath: opened.rootRealPath
		};
	} catch (error) {
		return {
			ok: false,
			reason: "parse",
			error: `failed to parse ${relativePath}: ${String(error)}`
		};
	} finally {
		fs.closeSync(opened.fd);
	}
}
function readRootJsonObjectSync(options) {
	return readRootStructuredFileSyncInternal(options, {
		parse: (raw) => JSON.parse(raw),
		validate: isRecord,
		invalidMessage: (relativePath) => `${relativePath} must contain a JSON object`
	});
}
//#endregion
//#region src/infra/runtime-worker-url.ts
/** Resolve an explicit installed root, source sibling, or stable packaged worker path. */
function resolveRuntimeWorkerUrl(params) {
	if (params.root !== void 0) return pathToFileURL(path.join(params.root, "dist", params.distWorkerPath));
	const currentPath = fileURLToPath(params.currentModuleUrl);
	const distIndex = currentPath.replaceAll(path.sep, "/").lastIndexOf("/dist/");
	if (distIndex >= 0) {
		const distRoot = currentPath.slice(0, distIndex + 6);
		let workerPath = params.distWorkerPath;
		if (params.package) {
			const packageRoot = path.resolve(distRoot, "..");
			const manifest = readRootJsonObjectSync({
				rootDir: packageRoot,
				relativePath: "package.json",
				boundaryLabel: "runtime worker package",
				rejectHardlinks: false
			});
			if (!manifest.ok) throw new Error(`Cannot resolve runtime worker package: ${packageRoot}/package.json`);
			if (manifest.value.name === params.package.name) workerPath = params.package.distWorkerPath;
		}
		return pathToFileURL(path.join(distRoot, workerPath));
	}
	const extension = path.extname(currentPath) || ".js";
	return new URL(`./${params.sourceWorkerName}${extension}`, params.currentModuleUrl);
}
function isBunTargetRuntime(execPath) {
	return execPath === process.execPath ? Boolean(process.versions.bun) : isBunRuntime(execPath);
}
/** Disable implicit package installation in OpenClaw-owned Bun processes. */
function resolveRuntimeArgs(execPath = process.execPath) {
	return isBunTargetRuntime(execPath) ? ["--no-install"] : [];
}
/** Whether a source TypeScript module needs Node's tsx loader; Bun runs TypeScript natively. */
function runtimeNeedsTypeScriptLoader(modulePath, execPath = process.execPath) {
	return /\.[cm]?ts$/.test(modulePath) && !isBunTargetRuntime(execPath);
}
function resolveRuntimeWorkerArgv(url, execPath = process.execPath) {
	const entry = fileURLToPath(url);
	return runtimeNeedsTypeScriptLoader(entry, execPath) ? [
		"--import",
		import.meta.resolve("tsx"),
		entry
	] : [...resolveRuntimeArgs(execPath), entry];
}
/** Select the source Worker preload without feeding Node's TypeScript loader to Bun. */
function resolveRuntimeWorkerThreadExecArgv(url, execPath = process.execPath) {
	return url.protocol === "file:" && runtimeNeedsTypeScriptLoader(fileURLToPath(url), execPath) ? ["--import", import.meta.resolve("tsx/esm")] : [];
}
//#endregion
export { runtimeNeedsTypeScriptLoader as i, resolveRuntimeWorkerThreadExecArgv as n, resolveRuntimeWorkerUrl as r, resolveRuntimeWorkerArgv as t };
