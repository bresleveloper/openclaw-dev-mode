import { t as CONFIG_DIR } from "./utils-aKqR_F_U.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { n as resolveExistingPathsWithinRoot, r as resolveStrictExistingPathsWithinRoot } from "./security-runtime-HdPo6iAV.mjs";
import "./temp-path-PENdksor.mjs";
import "./sdk-security-runtime-Ek_7wYnj.mjs";
import "./utils-Cs3fQhZS.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/browser/paths.ts
/**
* Browser filesystem path helpers.
*
* Defines browser output roots and resolves upload/media references while
* enforcing root-scoped path access for Browser tool file inputs.
*/
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
/** Default root directory for browser trace files. */
const DEFAULT_TRACE_DIR = DEFAULT_BROWSER_TMP_DIR;
/** Default root directory for browser downloads. */
const DEFAULT_DOWNLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "downloads");
/** Default root directory for browser upload inputs. */
const DEFAULT_UPLOAD_DIR = path.join(DEFAULT_BROWSER_TMP_DIR, "uploads");
/** Default root directory for managed inbound media references. */
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
	if (/^media:\/\//i.test(normalizedSource)) {
		const rawPath = /^media:\/\/[^/?#]*([^?#]*)/iu.exec(normalizedSource)?.[1] ?? "";
		let parsed;
		try {
			parsed = new URL(normalizedSource);
		} catch {
			return {
				ok: false,
				error: `Invalid media reference: ${normalizedSource}`
			};
		}
		if (parsed.hostname !== "inbound") return {
			ok: false,
			error: `Unsupported media reference location: ${parsed.hostname || "(missing)"}`
		};
		if (!rawPath.startsWith("/") || rawPath.slice(1).includes("/") || rawPath.includes("\\")) return {
			ok: false,
			error: `Invalid media reference: ${normalizedSource}`
		};
		const decoded = decodeInboundMediaId(rawPath.slice(1), normalizedSource);
		return decoded?.ok ? {
			ok: true,
			path: path.join(inboundMediaDir, decoded.path),
			uploadRootPrecedence: false
		} : decoded;
	}
	const relativeMatch = /^(?:\.\/)?media\/inbound\/([^/\\]+)$/u.exec(normalizedSource);
	if (!relativeMatch?.[1]) return null;
	const decoded = decodeInboundMediaId(relativeMatch[1], normalizedSource);
	return decoded?.ok ? {
		ok: true,
		path: path.join(inboundMediaDir, decoded.path),
		uploadRootPrecedence: true
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
	const inboundPathsResult = params.strict ? await resolveStrictExistingPathsWithinRoot({
		rootDir: params.inboundMediaDir,
		requestedPaths: [params.requestedPath],
		scopeLabel: `inbound media directory (${params.inboundMediaDir})`
	}) : await resolveExistingPathsWithinRoot({
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
/** Resolve upload paths and managed media references into existing file paths. */
async function resolveExistingUploadPaths({ requestedPaths, uploadDir = DEFAULT_UPLOAD_DIR, inboundMediaDir = DEFAULT_INBOUND_MEDIA_DIR }) {
	const paths = [];
	for (const requestedPath of requestedPaths) {
		const managedMediaPathResult = resolveManagedInboundMediaRef(requestedPath, inboundMediaDir);
		if (managedMediaPathResult?.ok === false) return managedMediaPathResult;
		if (managedMediaPathResult?.uploadRootPrecedence !== false) {
			const uploadPathsResult = managedMediaPathResult?.uploadRootPrecedence === true ? await resolveStrictExistingPathsWithinRoot({
				rootDir: uploadDir,
				requestedPaths: [requestedPath],
				scopeLabel: `uploads directory (${uploadDir})`
			}) : await resolveExistingPathsWithinRoot({
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
			strict: false
		});
		if (!inboundPathsResult.ok) return inboundPathsResult;
		paths.push(inboundPathsResult.paths[0] ?? requestedPath);
	}
	return {
		ok: true,
		paths
	};
}
/** Strictly resolve upload paths under the upload root only. */
async function resolveStrictExistingUploadPaths({ requestedPaths, uploadDir = DEFAULT_UPLOAD_DIR, inboundMediaDir = DEFAULT_INBOUND_MEDIA_DIR }) {
	const paths = [];
	for (const requestedPath of requestedPaths) {
		const managedMediaPathResult = resolveManagedInboundMediaRef(requestedPath, inboundMediaDir);
		if (managedMediaPathResult?.ok === false) return managedMediaPathResult;
		if (managedMediaPathResult?.uploadRootPrecedence !== false) {
			const uploadPathsResult = await resolveStrictExistingPathsWithinRoot({
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
			strict: true
		});
		if (!inboundPathsResult.ok) return inboundPathsResult;
		paths.push(inboundPathsResult.paths[0] ?? requestedPath);
	}
	return {
		ok: true,
		paths
	};
}
//#endregion
export { resolveStrictExistingUploadPaths as a, resolveExistingUploadPaths as i, DEFAULT_TRACE_DIR as n, DEFAULT_UPLOAD_DIR as r, DEFAULT_DOWNLOAD_DIR as t };
