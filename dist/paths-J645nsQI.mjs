import { t as CONFIG_DIR } from "./utils-gjJ-tD2q.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import "./text-utility-runtime-B9RB6Cg0.mjs";
import { a as resolveStrictExistingPathsWithinRoot, i as resolveExistingPathsWithinRoot } from "./security-runtime-6domDoE8.mjs";
import "./temp-path-D_RJiwsA.mjs";
import fs from "node:fs/promises";
import path from "node:path";
//#region extensions/browser/src/browser/paths.ts
const DEFAULT_FALLBACK_BROWSER_TMP_DIR = "/tmp/openclaw";
function canUseNodeFs() {
	const getBuiltinModule = process.getBuiltinModule;
	if (typeof getBuiltinModule !== "function") return false;
	try {
		return getBuiltinModule("fs") !== void 0;
	} catch {
		return false;
	}
}
const DEFAULT_BROWSER_TMP_DIR = canUseNodeFs() ? resolvePreferredOpenClawTmpDir() : DEFAULT_FALLBACK_BROWSER_TMP_DIR;
const DEFAULT_TRACE_DIR = DEFAULT_BROWSER_TMP_DIR;
const DEFAULT_DOWNLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "downloads");
const DEFAULT_UPLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "uploads");
const DEFAULT_INBOUND_MEDIA_DIR = path.join(CONFIG_DIR, "media", "inbound");
function normalizeUploadPathSource(source) {
	const trimmed = source.trim();
	if (/^media:\/\//i.test(trimmed)) return trimmed;
	return trimmed.replace(/^\s*MEDIA\s*:\s*/i, "").trim();
}
function decodeInboundMediaId(value, source) {
	let id;
	try {
		id = decodeURIComponent(value);
	} catch {
		return {
			ok: false,
			error: `Invalid media reference: ${source}`
		};
	}
	if (!id || id === "." || id === ".." || id.includes("/") || id.includes("\\") || id.includes("\0")) return {
		ok: false,
		error: `Invalid media reference: ${source}`
	};
	return {
		ok: true,
		path: id
	};
}
function resolveManagedInboundMediaRef(source, inboundMediaDir) {
	const normalizedSource = normalizeUploadPathSource(source);
	if (!normalizedSource) return null;
	const uploadRootPrecedence = !/^media:\/\//i.test(normalizedSource);
	let mediaId;
	if (!uploadRootPrecedence) {
		const rawPath = /^media:\/\/[^/?#]*([^?#]*)/iu.exec(normalizedSource)?.[1] ?? "";
		const parsed = URL.parse(normalizedSource);
		if (!parsed) return {
			ok: false,
			error: `Invalid media reference: ${normalizedSource}`
		};
		if (parsed.hostname !== "inbound") return {
			ok: false,
			error: `Unsupported media reference location: ${parsed.hostname || "(missing)"}`
		};
		if (!rawPath.startsWith("/") || rawPath.slice(1).includes("/") || rawPath.includes("\\")) return {
			ok: false,
			error: `Invalid media reference: ${normalizedSource}`
		};
		mediaId = rawPath.slice(1);
	} else {
		const relativeMatch = /^(?:\.\/)?media\/inbound\/([^/\\]+)$/u.exec(normalizedSource);
		if (!relativeMatch?.[1]) return null;
		mediaId = relativeMatch[1];
	}
	const decoded = decodeInboundMediaId(mediaId, normalizedSource);
	return decoded.ok ? {
		ok: true,
		path: path.join(inboundMediaDir, decoded.path),
		uploadRootPrecedence
	} : decoded;
}
async function isDirectInboundMediaFile(params) {
	let inboundRoot;
	try {
		inboundRoot = await fs.realpath(params.inboundMediaDir);
	} catch {
		inboundRoot = path.resolve(params.inboundMediaDir);
	}
	const relativePath = path.relative(inboundRoot, params.resolvedPath);
	return Boolean(relativePath) && relativePath !== ".." && !relativePath.startsWith(`..${path.sep}`) && !path.isAbsolute(relativePath) && !relativePath.includes("/") && !relativePath.includes("\\");
}
async function resolveDirectInboundMediaPath(params) {
	const inboundPathsResult = await (params.strict ? resolveStrictExistingPathsWithinRoot : resolveExistingPathsWithinRoot)({
		rootDir: params.inboundMediaDir,
		requestedPaths: [params.requestedPath],
		scopeLabel: `inbound media directory (${params.inboundMediaDir})`
	});
	if (!inboundPathsResult.ok) return inboundPathsResult;
	const resolvedPath = inboundPathsResult.paths[0] ?? params.requestedPath;
	if (!await isDirectInboundMediaFile({
		inboundMediaDir: params.inboundMediaDir,
		resolvedPath
	})) return {
		ok: false,
		error: `Invalid media reference: must be a direct child of inbound media directory (${params.inboundMediaDir})`
	};
	return inboundPathsResult;
}
async function resolveUploadPaths({ requestedPaths, uploadDir = DEFAULT_UPLOAD_DIR, inboundMediaDir = DEFAULT_INBOUND_MEDIA_DIR, strict }) {
	const paths = [];
	for (const requestedPath of requestedPaths) {
		const managedMediaPathResult = resolveManagedInboundMediaRef(requestedPath, inboundMediaDir);
		if (managedMediaPathResult?.ok === false) return managedMediaPathResult;
		if (managedMediaPathResult?.uploadRootPrecedence !== false) {
			const uploadPathsResult = await (strict || managedMediaPathResult?.uploadRootPrecedence === true ? resolveStrictExistingPathsWithinRoot : resolveExistingPathsWithinRoot)({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			});
			if (uploadPathsResult.ok) {
				paths.push(uploadPathsResult.paths[0] ?? requestedPath);
				continue;
			}
		}
		const inboundPathsResult = await resolveDirectInboundMediaPath({
			inboundMediaDir,
			requestedPath: managedMediaPathResult?.path ?? requestedPath,
			strict
		});
		if (!inboundPathsResult.ok) return inboundPathsResult;
		paths.push(inboundPathsResult.paths[0] ?? requestedPath);
	}
	return {
		ok: true,
		paths
	};
}
/** Resolve upload paths and managed media references into existing file paths. */
async function resolveExistingUploadPaths(options) {
	return resolveUploadPaths({
		...options,
		strict: false
	});
}
async function resolveStrictExistingUploadPaths(options) {
	return resolveUploadPaths({
		...options,
		strict: true
	});
}
//#endregion
export { resolveStrictExistingUploadPaths as a, resolveExistingUploadPaths as i, DEFAULT_TRACE_DIR as n, DEFAULT_UPLOAD_DIR as r, DEFAULT_DOWNLOAD_DIR as t };
