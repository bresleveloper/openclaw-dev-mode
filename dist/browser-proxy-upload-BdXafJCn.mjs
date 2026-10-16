import { i as extractErrorCode } from "./error-coercion-CvJK4lmH.mjs";
import { r as asNullableRecord } from "./record-coerce-TIsquoVR.mjs";
import { o as racePromiseWithAbortSignal } from "./src-D1BHGNTj.mjs";
import { t as createSubsystemLogger } from "./subsystem-I-uqdx4f.mjs";
import { t as truncateUtf8Prefix } from "./utf8-truncate-_hf7tp13.mjs";
import "./error-runtime-BmospGvZ.mjs";
import "./string-coerce-runtime-50qKeWeL.mjs";
import { o as sanitizeUntrustedFileName } from "./security-runtime-CpTHQYW2.mjs";
import "./text-utility-runtime-BDs7x8Fk.mjs";
import "./runtime-env-BjPzo7IN.mjs";
import "./time-runtime-Bfsc2GHI.mjs";
import { m as parseBrowserErrorPayload } from "./errors-BqlAThZX.mjs";
import { i as resolveExistingUploadPaths, r as DEFAULT_UPLOAD_DIR } from "./paths-j6Von5wB.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region extensions/browser/src/browser-proxy-envelope.ts
/** Additive opt-in for structured browser route errors over node.invoke. */
const BROWSER_PROXY_ERROR_ENVELOPE = "browser-v1";
/** Additive request envelope for Gateway-owned files sent to a browser node. */
const BROWSER_PROXY_UPLOAD_ENVELOPE = "browser-upload-v1";
/** Private node-host operation; unknown older nodes reject it before closing anything. */
const BROWSER_PROXY_OWNED_TAB_CLOSE_PATH = "/__openclaw/session-tab/close-owned";
const BROWSER_PROXY_MAX_FILE_BYTES = 10485760;
const BROWSER_PROXY_MAX_TOTAL_FILE_BYTES = 16777216;
const BROWSER_PROXY_MAX_FILES = 256;
/** Bound filesystem work even when one action emits many tiny downloads. */
function assertBrowserProxyFileCountWithinLimit(fileCount, direction = "response") {
	if (fileCount > BROWSER_PROXY_MAX_FILES) throw new Error(`browser proxy ${direction} exceeds 256 file limit`);
}
function assertBrowserProxyFileBytesWithinLimits(fileBytes, totalBytes) {
	if (fileBytes > 10485760) throw new Error("browser proxy file exceeds 10 MiB limit");
	if (totalBytes > BROWSER_PROXY_MAX_TOTAL_FILE_BYTES) throw new Error("browser proxy files exceed 16 MiB aggregate limit");
}
/** Visit the route-owned file paths that may cross the Browser node boundary. */
function visitBrowserProxyFilePaths(result, visit) {
	const root = asNullableRecord(result);
	if (!root) return;
	const visitPath = (owner, key) => {
		const filePath = owner[key];
		if (typeof filePath !== "string" || !filePath.trim()) return;
		const replacement = visit(filePath);
		if (typeof replacement === "string") owner[key] = replacement;
	};
	visitPath(root, "path");
	visitPath(root, "imagePath");
	const download = asNullableRecord(root.download);
	if (download) visitPath(download, "path");
	if (Array.isArray(root.downloads)) for (const entry of root.downloads) {
		const record = asNullableRecord(entry);
		if (record) visitPath(record, "path");
	}
}
/** Build a route-failure envelope while allowing only closed Browser metadata. */
function createBrowserProxyFailure(status, body, route) {
	return {
		error: {
			status,
			body: parseBrowserErrorPayload(body) ?? { error: `HTTP ${status}` }
		},
		...route ? { route } : {}
	};
}
function parseBrowserProxyRoute(value) {
	const route = asNullableRecord(asNullableRecord(value)?.route);
	if (!route) return;
	if (route.status === "unavailable") return { status: "unavailable" };
	if (route.status !== "resolved" || typeof route.profile !== "string" || !route.profile || route.profile.trim() !== route.profile || route.driver !== "openclaw" && route.driver !== "existing-session" && route.driver !== "extension") return;
	return {
		status: "resolved",
		profile: route.profile,
		driver: route.driver
	};
}
/** Parse an untrusted node response without forwarding arbitrary metadata. */
function parseBrowserProxyFailure(value) {
	const candidate = asNullableRecord(asNullableRecord(value)?.error);
	if (!candidate) return null;
	if (typeof candidate.status !== "number" || !Number.isInteger(candidate.status) || candidate.status < 400 || candidate.status > 599) return null;
	const body = parseBrowserErrorPayload(candidate.body);
	if (!body) return null;
	const route = parseBrowserProxyRoute(value);
	return {
		error: {
			status: candidate.status,
			body
		},
		...route ? { route } : {}
	};
}
//#endregion
//#region extensions/browser/src/browser-proxy-upload.ts
/**
* Existing Browser upload paths are Gateway-owned. Proxied requests carry
* bounded bytes to the node, which stages private copies under its upload root.
*/
const logger = createSubsystemLogger("browser");
const BROWSER_PROXY_UPLOAD_ROOT_NAME = ".proxy-uploads";
const BROWSER_PROXY_UPLOAD_PREFIX = "upload-";
const BROWSER_PROXY_UPLOAD_MARKER_NAME = ".openclaw-browser-proxy-upload-v1";
const BROWSER_PROXY_UPLOAD_MARKER_CONTENT = "openclaw-browser-proxy-upload-v1\n";
const BROWSER_PROXY_UPLOAD_RETENTION_MS = 864e5;
const BROWSER_PROXY_UPLOAD_CLEANUP_RETRY_MS = 36e5;
const BROWSER_PROXY_UPLOAD_MAX_RETAINED_BYTES = 268435456;
const BROWSER_PROXY_UPLOAD_MAX_RETAINED_DIRECTORIES = 64;
const BROWSER_PROXY_MAX_ENCODED_FILE_LENGTH = Math.ceil(BROWSER_PROXY_MAX_FILE_BYTES / 3) * 4;
const MAX_STAGED_NAME_BYTES = 180;
const cleanupTimers = /* @__PURE__ */ new Map();
const recoveryPromises = /* @__PURE__ */ new Map();
const recoveryRetryTimers = /* @__PURE__ */ new Map();
const stagingLocks = /* @__PURE__ */ new Map();
let activeCleanup = 0;
let activeRecovery = 0;
function hasBrowserProxyUploadWork() {
	return activeCleanup > 0 || activeRecovery > 0 || stagingLocks.size > 0;
}
function isFileChooserRequest(method, requestPath) {
	return method.toUpperCase() === "POST" && `/${requestPath.trim().replace(/^\/+/u, "")}` === "/hooks/file-chooser";
}
/** Identify upload requests before reading files or applying transport-only limits. */
function isBrowserProxyUploadRequest(params) {
	if (!isFileChooserRequest(params.method, params.path)) return false;
	const body = asNullableRecord(params.body);
	return Boolean(body && Array.isArray(body.paths) && body.paths.length > 0);
}
function readUploadPaths(body) {
	if (!Array.isArray(body.paths) || body.paths.length === 0) return null;
	if (!body.paths.every((entry) => typeof entry === "string")) throw new Error("browser proxy upload paths must contain only strings");
	return body.paths;
}
async function readBrowserProxyUploadFiles(paths, signal) {
	assertBrowserProxyFileCountWithinLimit(paths.length, "request");
	const files = [];
	let totalBytes = 0;
	for (const filePath of paths) {
		signal?.throwIfAborted();
		const stat = await fs.stat(filePath).catch(() => null);
		if (!stat?.isFile()) throw new Error(`browser proxy upload file not found: ${filePath}`);
		assertBrowserProxyFileBytesWithinLimits(stat.size, totalBytes + stat.size);
		const buffer = await fs.readFile(filePath, signal ? { signal } : void 0);
		assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
		totalBytes += buffer.byteLength;
		files.push({
			name: path.basename(filePath),
			contentBase64: buffer.toString("base64")
		});
	}
	return files;
}
/** Build a node-only upload envelope while retaining the original body for host fallback. */
async function prepareBrowserProxyUploadRequest(params) {
	params.signal?.throwIfAborted();
	if (!isFileChooserRequest(params.method, params.path)) return { body: params.body };
	const body = asNullableRecord(params.body);
	if (!body) return { body: params.body };
	const requestedPaths = readUploadPaths(body);
	if (!requestedPaths) return { body: params.body };
	assertBrowserProxyFileCountWithinLimit(requestedPaths.length, "request");
	const resolved = await resolveExistingUploadPaths({
		requestedPaths,
		...params.uploadDir ? { uploadDir: params.uploadDir } : {},
		...params.inboundMediaDir ? { inboundMediaDir: params.inboundMediaDir } : {}
	});
	if (!resolved.ok) throw new Error(resolved.error);
	const upload = {
		envelope: BROWSER_PROXY_UPLOAD_ENVELOPE,
		files: await readBrowserProxyUploadFiles(resolved.paths, params.signal)
	};
	const { paths: _paths, ...bodyWithoutPaths } = body;
	return {
		body: bodyWithoutPaths,
		upload
	};
}
function sanitizeUploadName(name) {
	const safe = sanitizeUntrustedFileName(name, "upload").replace(/[!%]/gu, "_");
	const bounded = truncateUtf8Prefix(safe, MAX_STAGED_NAME_BYTES).replace(/[.\s]+$/u, "");
	return sanitizeUntrustedFileName(bounded, "upload");
}
function decodedBase64Size(value) {
	if (value.length % 4 !== 0) throw new Error("INVALID_REQUEST: invalid browser proxy upload encoding");
	const padding = value.endsWith("==") ? 2 : value.endsWith("=") ? 1 : 0;
	return value.length / 4 * 3 - padding;
}
function decodeUploadFile(file, totalBytes) {
	if (!file || typeof file.name !== "string" || !file.name.trim() || typeof file.contentBase64 !== "string" || file.contentBase64.length > BROWSER_PROXY_MAX_ENCODED_FILE_LENGTH) throw new Error("INVALID_REQUEST: invalid browser proxy upload file");
	const estimatedBytes = decodedBase64Size(file.contentBase64);
	assertBrowserProxyFileBytesWithinLimits(estimatedBytes, totalBytes + estimatedBytes);
	const buffer = Buffer.from(file.contentBase64, "base64");
	if (buffer.toString("base64") !== file.contentBase64) throw new Error("INVALID_REQUEST: invalid browser proxy upload encoding");
	assertBrowserProxyFileBytesWithinLimits(buffer.byteLength, totalBytes + buffer.byteLength);
	return buffer;
}
async function removeStagedUpload(directory) {
	activeCleanup += 1;
	const timer = cleanupTimers.get(directory);
	if (timer) {
		clearTimeout(timer);
		cleanupTimers.delete(directory);
	}
	try {
		if ((await fs.lstat(directory)).isDirectory()) {
			for (const entry of await fs.readdir(directory)) if (entry !== BROWSER_PROXY_UPLOAD_MARKER_NAME) await fs.rm(path.join(directory, entry), {
				recursive: true,
				force: true
			});
		}
		await fs.rm(directory, {
			recursive: true,
			force: true
		});
	} catch (error) {
		if (extractErrorCode(error) === "ENOENT") return;
		logger.warn(`browser proxy upload cleanup failed; retrying: ${String(error)}`);
		scheduleCleanup(directory, BROWSER_PROXY_UPLOAD_CLEANUP_RETRY_MS);
	} finally {
		activeCleanup -= 1;
	}
}
async function readDirectoryBytes(directory, signal) {
	signal?.throwIfAborted();
	let entries;
	try {
		entries = await fs.readdir(directory, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return 0;
		throw error;
	}
	let totalBytes = 0;
	for (const entry of entries) {
		signal?.throwIfAborted();
		const entryPath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			totalBytes += await readDirectoryBytes(entryPath, signal);
			continue;
		}
		if (!entry.isFile()) continue;
		const stat = await fs.stat(entryPath).catch(() => null);
		totalBytes += stat?.isFile() ? stat.size : 0;
	}
	return totalBytes;
}
async function readOwnedStagedUploads(stagingRoot, signal) {
	signal?.throwIfAborted();
	let entries;
	try {
		entries = await fs.readdir(stagingRoot, { withFileTypes: true });
	} catch (error) {
		if (error.code === "ENOENT") return [];
		throw error;
	}
	return (await Promise.all(entries.filter((entry) => entry.isDirectory() && entry.name.startsWith(BROWSER_PROXY_UPLOAD_PREFIX)).map(async (entry) => {
		signal?.throwIfAborted();
		const directory = path.join(stagingRoot, entry.name);
		const stat = await fs.stat(directory).catch(() => null);
		if (!stat?.isDirectory()) return null;
		if (typeof process.getuid === "function" && stat.uid !== process.getuid()) return null;
		if (await fs.readFile(path.join(directory, BROWSER_PROXY_UPLOAD_MARKER_NAME), "utf8").catch(() => null) !== BROWSER_PROXY_UPLOAD_MARKER_CONTENT) return null;
		return {
			bytes: await readDirectoryBytes(directory, signal),
			directory,
			mtimeMs: stat.mtimeMs
		};
	}))).filter((upload) => upload !== null);
}
function scheduleCleanup(directory, delayMs) {
	if (cleanupTimers.has(directory)) return;
	const timer = setTimeout(() => {
		cleanupTimers.delete(directory);
		removeStagedUpload(directory);
	}, Math.max(0, delayMs));
	cleanupTimers.set(directory, timer);
	timer.unref?.();
}
async function recoverStagedUploads(params) {
	const { uploadDir, retentionMs, nowMs, limits } = params;
	const stagingRoot = path.join(uploadDir, BROWSER_PROXY_UPLOAD_ROOT_NAME);
	const retained = [];
	for (const upload of await readOwnedStagedUploads(stagingRoot)) if (retentionMs - Math.max(0, nowMs - upload.mtimeMs) <= 0) await removeStagedUpload(upload.directory);
	else retained.push(upload);
	retained.sort((left, right) => left.mtimeMs - right.mtimeMs);
	let totalBytes = retained.reduce((total, upload) => total + upload.bytes, 0);
	while (retained.length > limits.maxRetainedDirectories || totalBytes > limits.maxRetainedBytes) {
		const oldest = retained.shift();
		if (!oldest) break;
		totalBytes -= oldest.bytes;
		await removeStagedUpload(oldest.directory);
	}
	for (const upload of retained) {
		const remaining = retentionMs - Math.max(0, nowMs - upload.mtimeMs);
		scheduleCleanup(upload.directory, remaining);
	}
}
function clearRecoveryRetry(uploadDir) {
	const timer = recoveryRetryTimers.get(uploadDir);
	if (!timer) return;
	clearTimeout(timer);
	recoveryRetryTimers.delete(uploadDir);
}
function scheduleRecoveryRetry(uploadDir, retentionMs) {
	if (recoveryRetryTimers.has(uploadDir)) return;
	const timer = setTimeout(() => {
		recoveryRetryTimers.delete(uploadDir);
		recoveryPromises.set(uploadDir, ensureBrowserProxyUploadCleanup({
			uploadDir,
			retentionMs
		}));
	}, BROWSER_PROXY_UPLOAD_CLEANUP_RETRY_MS);
	recoveryRetryTimers.set(uploadDir, timer);
	timer.unref?.();
}
async function runRecovery(params) {
	activeRecovery += 1;
	try {
		await recoverStagedUploads(params);
		clearRecoveryRetry(params.uploadDir);
	} catch (error) {
		logger.warn(`browser proxy upload recovery failed; retrying: ${String(error)}`);
		scheduleRecoveryRetry(params.uploadDir, params.retentionMs);
	} finally {
		activeRecovery -= 1;
	}
}
/** Restores cleanup timers for staged uploads left by a previous node process. */
function ensureBrowserProxyUploadCleanup(options) {
	const uploadDir = options?.uploadDir ?? DEFAULT_UPLOAD_DIR;
	const retentionMs = options?.retentionMs ?? BROWSER_PROXY_UPLOAD_RETENTION_MS;
	const nowMs = options?.nowMs ?? Date.now();
	const limits = {
		maxRetainedBytes: options?.maxRetainedBytes ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_BYTES,
		maxRetainedDirectories: options?.maxRetainedDirectories ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_DIRECTORIES
	};
	if (options?.retentionMs !== void 0 || options?.nowMs !== void 0 || options?.maxRetainedBytes !== void 0 || options?.maxRetainedDirectories !== void 0) return runRecovery({
		uploadDir,
		retentionMs,
		nowMs,
		limits
	});
	const existing = recoveryPromises.get(uploadDir);
	if (existing) return existing;
	const recovery = runRecovery({
		uploadDir,
		retentionMs,
		nowMs,
		limits
	});
	recoveryPromises.set(uploadDir, recovery);
	return recovery;
}
async function withStagingLock(uploadDir, task, signal) {
	const previous = stagingLocks.get(uploadDir) ?? Promise.resolve();
	let release = () => {};
	const current = new Promise((resolve) => {
		release = resolve;
	});
	const tail = previous.then(() => current);
	stagingLocks.set(uploadDir, tail);
	tail.then(() => {
		if (stagingLocks.get(uploadDir) === tail) stagingLocks.delete(uploadDir);
	});
	try {
		signal?.throwIfAborted();
		await racePromiseWithAbortSignal(previous, signal, ({ reason }) => reason instanceof Error ? reason : new Error(String(reason)));
		return await task();
	} finally {
		release();
	}
}
function validateUploadEnvelope(upload) {
	if (!upload || upload.envelope !== "browser-upload-v1" || !Array.isArray(upload.files) || upload.files.length === 0) throw new Error("INVALID_REQUEST: invalid browser proxy upload envelope");
	assertBrowserProxyFileCountWithinLimit(upload.files.length, "request");
	return upload.files;
}
async function stageBrowserProxyUploadRequest(params) {
	params.signal?.throwIfAborted();
	if (params.upload === void 0) return { body: params.body };
	if (!isFileChooserRequest(params.method, params.path)) throw new Error("INVALID_REQUEST: browser proxy upload requires the file chooser route");
	const body = asNullableRecord(params.body);
	if (!body || Object.hasOwn(body, "paths")) throw new Error("INVALID_REQUEST: browser proxy upload body must omit paths");
	const files = validateUploadEnvelope(params.upload);
	const uploadDir = params.uploadDir ?? DEFAULT_UPLOAD_DIR;
	const stagingRoot = path.join(uploadDir, BROWSER_PROXY_UPLOAD_ROOT_NAME);
	await fs.mkdir(stagingRoot, {
		recursive: true,
		mode: 448
	});
	params.signal?.throwIfAborted();
	if (recoveryRetryTimers.has(uploadDir)) {
		clearRecoveryRetry(uploadDir);
		recoveryPromises.delete(uploadDir);
	}
	await ensureBrowserProxyUploadCleanup({ uploadDir });
	params.signal?.throwIfAborted();
	const decodedFiles = [];
	let fileBytes = 0;
	for (const file of files) {
		const buffer = decodeUploadFile(file, fileBytes);
		fileBytes += buffer.byteLength;
		decodedFiles.push({
			buffer,
			name: file.name
		});
	}
	const retainedRequestBytes = fileBytes + Buffer.byteLength(BROWSER_PROXY_UPLOAD_MARKER_CONTENT);
	const limits = {
		maxRetainedBytes: params.maxRetainedBytes ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_BYTES,
		maxRetainedDirectories: params.maxRetainedDirectories ?? BROWSER_PROXY_UPLOAD_MAX_RETAINED_DIRECTORIES
	};
	return await withStagingLock(uploadDir, async () => {
		params.signal?.throwIfAborted();
		const retained = await readOwnedStagedUploads(stagingRoot, params.signal);
		const retainedBytes = retained.reduce((total, upload) => total + upload.bytes, 0);
		if (retained.length >= limits.maxRetainedDirectories || retainedBytes + retainedRequestBytes > limits.maxRetainedBytes) throw new Error("RESOURCE_EXHAUSTED: browser proxy upload staging limit reached");
		const directory = await fs.mkdtemp(path.join(stagingRoot, BROWSER_PROXY_UPLOAD_PREFIX));
		const stagedPaths = [];
		try {
			await fs.writeFile(path.join(directory, BROWSER_PROXY_UPLOAD_MARKER_NAME), BROWSER_PROXY_UPLOAD_MARKER_CONTENT, {
				flag: "wx",
				mode: 384,
				signal: params.signal
			});
			for (const [index, file] of decodedFiles.entries()) {
				params.signal?.throwIfAborted();
				const fileDirectory = path.join(directory, String(index));
				await fs.mkdir(fileDirectory, { mode: 448 });
				params.signal?.throwIfAborted();
				const filePath = path.join(fileDirectory, sanitizeUploadName(file.name));
				await fs.writeFile(filePath, file.buffer, {
					flag: "wx",
					mode: 384,
					signal: params.signal
				});
				stagedPaths.push(filePath);
			}
		} catch (error) {
			await removeStagedUpload(directory);
			throw error;
		}
		scheduleCleanup(directory, BROWSER_PROXY_UPLOAD_RETENTION_MS);
		return {
			body: {
				...body,
				paths: stagedPaths
			},
			directory
		};
	}, params.signal);
}
/** Remove staged copies after a request fails before Browser ownership is established. */
async function discardStagedBrowserProxyUpload(staged) {
	if (staged.directory) await removeStagedUpload(staged.directory);
}
//#endregion
export { prepareBrowserProxyUploadRequest as a, BROWSER_PROXY_MAX_FILE_BYTES as c, assertBrowserProxyFileCountWithinLimit as d, createBrowserProxyFailure as f, visitBrowserProxyFilePaths as h, isBrowserProxyUploadRequest as i, BROWSER_PROXY_OWNED_TAB_CLOSE_PATH as l, parseBrowserProxyRoute as m, ensureBrowserProxyUploadCleanup as n, stageBrowserProxyUploadRequest as o, parseBrowserProxyFailure as p, hasBrowserProxyUploadWork as r, BROWSER_PROXY_ERROR_ENVELOPE as s, discardStagedBrowserProxyUpload as t, assertBrowserProxyFileBytesWithinLimits as u };
