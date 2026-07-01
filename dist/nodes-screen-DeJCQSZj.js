import { p as readStringValue } from "./string-coerce-DW4mBlAt.js";
import { a as asRecord } from "./record-coerce-DHZ4bFlT.js";
import { s as asFiniteNumber, y as parseStrictNonNegativeInteger } from "./number-coercion-CJQ8TR--.js";
import "./parse-finite-number-Z7n6tXLk.js";
import { u as toErrorObject } from "./errors-DCRXIYSQ.js";
import { n as resolveCliName } from "./cli-name-CAJoj2J5.js";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DOKojISm.js";
import { t as normalizeHostname } from "./hostname-DAZapKzN.js";
import { r as fetchWithSsrFGuard } from "./fetch-guard-Behn5ZPn.js";
import { t as asBoolean } from "./boolean-CrriykWV.js";
import fs from "node:fs";
import * as path$1 from "node:path";
import * as fs$2 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/cli/nodes-media-utils.ts
const asString = readStringValue;
function resolveTempPathParts(opts) {
	const tmpDir = opts.tmpDir ?? resolvePreferredOpenClawTmpDir();
	const rawExt = opts.ext.startsWith(".") ? opts.ext : `.${opts.ext}`;
	if (!/^\.[A-Za-z0-9][A-Za-z0-9_-]{0,15}$/u.test(rawExt)) throw new Error("invalid media format");
	if (!opts.tmpDir) fs.mkdirSync(tmpDir, {
		recursive: true,
		mode: 448
	});
	return {
		tmpDir,
		id: opts.id ?? randomUUID(),
		ext: rawExt
	};
}
//#endregion
//#region src/cli/nodes-camera.ts
const MAX_CAMERA_URL_DOWNLOAD_BYTES = 250 * 1024 * 1024;
const MAX_CAMERA_BASE64_BYTES = MAX_CAMERA_URL_DOWNLOAD_BYTES;
async function cancelIgnoredResponseBody(response) {
	if (response?.bodyUsed !== true) await response?.body?.cancel().catch(() => void 0);
}
/** Validate and normalize an unknown camera still-image payload. */
function parseCameraSnapPayload(value) {
	const obj = asRecord(value);
	const format = asString(obj.format);
	const base64 = asString(obj.base64);
	const url = asString(obj.url);
	const width = asFiniteNumber(obj.width);
	const height = asFiniteNumber(obj.height);
	if (!format || !base64 && !url || width === void 0 || height === void 0) throw new Error("invalid camera.snap payload");
	return {
		format,
		...base64 ? { base64 } : {},
		...url ? { url } : {},
		width,
		height
	};
}
/** Validate and normalize an unknown camera clip payload. */
function parseCameraClipPayload(value) {
	const obj = asRecord(value);
	const format = asString(obj.format);
	const base64 = asString(obj.base64);
	const url = asString(obj.url);
	const durationMs = asFiniteNumber(obj.durationMs);
	const hasAudio = asBoolean(obj.hasAudio);
	if (!format || !base64 && !url || durationMs === void 0 || hasAudio === void 0) throw new Error("invalid camera.clip payload");
	return {
		format,
		...base64 ? { base64 } : {},
		...url ? { url } : {},
		durationMs,
		hasAudio
	};
}
/** Build a deterministic temp path for a camera artifact. */
function cameraTempPath(opts) {
	const { tmpDir, id, ext } = resolveTempPathParts({
		tmpDir: opts.tmpDir,
		id: opts.id,
		ext: opts.ext
	});
	const facingPart = opts.facing ? `-${opts.facing}` : "";
	const cliName = resolveCliName();
	return path$1.join(tmpDir, `${cliName}-camera-${opts.kind}${facingPart}-${id}${ext}`);
}
/** Download a node-hosted media URL to disk after HTTPS, host, redirect, and size checks. */
async function writeUrlToFile(filePath, url, opts) {
	const parsed = new URL(url);
	if (parsed.protocol !== "https:") throw new Error(`writeUrlToFile: only https URLs are allowed, got ${parsed.protocol}`);
	const expectedHost = normalizeHostname(opts.expectedHost);
	if (!expectedHost) throw new Error("writeUrlToFile: expectedHost is required");
	if (normalizeHostname(parsed.hostname) !== expectedHost) throw new Error(`writeUrlToFile: url host ${parsed.hostname} must match node host ${opts.expectedHost}`);
	const policy = {
		allowPrivateNetwork: true,
		allowedHostnames: [expectedHost],
		hostnameAllowlist: [expectedHost]
	};
	let release = async () => {};
	let bytes = 0;
	try {
		const guarded = await fetchWithSsrFGuard({
			url,
			auditContext: "writeUrlToFile",
			policy
		});
		release = guarded.release;
		const res = guarded.response;
		const finalUrl = new URL(guarded.finalUrl);
		if (finalUrl.protocol !== "https:") {
			await cancelIgnoredResponseBody(res);
			throw new Error(`writeUrlToFile: redirect resolved to non-https URL ${guarded.finalUrl}`);
		}
		if (normalizeHostname(finalUrl.hostname) !== expectedHost) {
			await cancelIgnoredResponseBody(res);
			throw new Error(`writeUrlToFile: redirect host ${finalUrl.hostname} must match node host ${opts.expectedHost}`);
		}
		if (!res.ok) {
			await cancelIgnoredResponseBody(res);
			throw new Error(`failed to download ${url}: ${res.status} ${res.statusText}`);
		}
		const contentLength = parseStrictNonNegativeInteger(res.headers.get("content-length"));
		if (typeof contentLength === "number" && Number.isFinite(contentLength) && contentLength > MAX_CAMERA_URL_DOWNLOAD_BYTES) {
			await cancelIgnoredResponseBody(res);
			throw new Error(`writeUrlToFile: content-length ${contentLength} exceeds max ${MAX_CAMERA_URL_DOWNLOAD_BYTES}`);
		}
		const body = res.body;
		if (!body) {
			await cancelIgnoredResponseBody(res);
			throw new Error(`failed to download ${url}: empty response body`);
		}
		const fileHandle = await fs$2.open(filePath, "w");
		let thrown;
		const reader = body.getReader();
		try {
			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				if (!value || value.byteLength === 0) continue;
				bytes += value.byteLength;
				if (bytes > MAX_CAMERA_URL_DOWNLOAD_BYTES) {
					await reader.cancel().catch(() => void 0);
					throw new Error(`writeUrlToFile: downloaded ${bytes} bytes, exceeds max ${MAX_CAMERA_URL_DOWNLOAD_BYTES}`);
				}
				await fileHandle.write(value);
			}
		} catch (err) {
			thrown = err;
			await reader.cancel().catch(() => void 0);
		} finally {
			reader.releaseLock();
			await fileHandle.close();
		}
		if (thrown) {
			await fs$2.unlink(filePath).catch(() => {});
			throw toErrorObject(thrown, "Non-Error thrown");
		}
	} finally {
		await release();
	}
	return {
		path: filePath,
		bytes
	};
}
function estimateDecodedBase64Bytes(base64) {
	const normalized = base64.replace(/\s+/g, "");
	const padding = normalized.endsWith("==") ? 2 : normalized.endsWith("=") ? 1 : 0;
	return Math.floor(normalized.length * 3 / 4) - padding;
}
/** Decode a base64 media payload to disk with preflight and post-decode size checks. */
async function writeBase64ToFile(filePath, base64, opts = {}) {
	const maxBytes = opts.maxBytes ?? MAX_CAMERA_BASE64_BYTES;
	if (estimateDecodedBase64Bytes(base64) > maxBytes) throw new Error(`writeBase64ToFile: decoded payload exceeds max ${maxBytes}`);
	const buf = Buffer.from(base64, "base64");
	if (buf.length > maxBytes) throw new Error(`writeBase64ToFile: decoded ${buf.length} bytes, exceeds max ${maxBytes}`);
	await fs$2.writeFile(filePath, buf);
	return {
		path: filePath,
		bytes: buf.length
	};
}
/** Require the node remote IP needed to validate URL-backed camera payloads. */
function requireNodeRemoteIp(remoteIp) {
	const normalized = remoteIp?.trim();
	if (!normalized) throw new Error("camera URL payload requires node remoteIp");
	return normalized;
}
/** Write either a URL-backed or base64-backed camera payload to disk. */
async function writeCameraPayloadToFile(params) {
	if (params.payload.url) {
		await writeUrlToFile(params.filePath, params.payload.url, { expectedHost: requireNodeRemoteIp(params.expectedHost) });
		return;
	}
	if (params.payload.base64) {
		await writeBase64ToFile(params.filePath, params.payload.base64);
		return;
	}
	throw new Error(params.invalidPayloadMessage ?? "invalid camera payload");
}
/** Write a camera clip payload to a generated temp file and return its path. */
async function writeCameraClipPayloadToFile(params) {
	const filePath = cameraTempPath({
		kind: "clip",
		facing: params.facing,
		ext: params.payload.format,
		tmpDir: params.tmpDir,
		id: params.id
	});
	await writeCameraPayloadToFile({
		filePath,
		payload: params.payload,
		expectedHost: params.expectedHost,
		invalidPayloadMessage: "invalid camera.clip payload"
	});
	return filePath;
}
//#endregion
//#region src/cli/nodes-screen.ts
/** Validate and normalize an unknown screen-record payload. */
function parseScreenRecordPayload(value) {
	const obj = asRecord(value);
	const format = asString(obj.format);
	const base64 = asString(obj.base64);
	if (!format || !base64) throw new Error("invalid screen.record payload");
	return {
		format,
		base64,
		durationMs: typeof obj.durationMs === "number" ? obj.durationMs : void 0,
		fps: typeof obj.fps === "number" ? obj.fps : void 0,
		screenIndex: typeof obj.screenIndex === "number" ? obj.screenIndex : void 0,
		hasAudio: typeof obj.hasAudio === "boolean" ? obj.hasAudio : void 0
	};
}
/** Build the temp output path for a screen recording artifact. */
function screenRecordTempPath(opts) {
	const { tmpDir, id, ext } = resolveTempPathParts(opts);
	return path$1.join(tmpDir, `openclaw-screen-record-${id}${ext}`);
}
/** Decode and write a screen recording payload to disk. */
async function writeScreenRecordToFile(filePath, base64, opts) {
	return writeBase64ToFile(filePath, base64, opts);
}
/** Validate and normalize an unknown screen-snapshot payload. */
function parseScreenSnapshotPayload(value) {
	const obj = asRecord(value);
	const format = asString(obj.format);
	const base64 = asString(obj.base64);
	if (!format || !base64) throw new Error("invalid screen.snapshot payload");
	return {
		format,
		base64,
		screenIndex: typeof obj.screenIndex === "number" ? obj.screenIndex : void 0,
		width: typeof obj.width === "number" ? obj.width : void 0,
		height: typeof obj.height === "number" ? obj.height : void 0
	};
}
/** Build the temp output path for a screen snapshot artifact. */
function screenSnapshotTempPath(opts) {
	const { tmpDir, id, ext } = resolveTempPathParts({
		...opts,
		ext: opts.ext ?? ".png"
	});
	return path$1.join(tmpDir, `openclaw-screen-snapshot-${id}${ext}`);
}
/** Decode and write a screen snapshot payload to disk. */
async function writeScreenSnapshotToFile(filePath, base64, opts) {
	return writeBase64ToFile(filePath, base64, opts);
}
//#endregion
export { writeScreenRecordToFile as a, parseCameraClipPayload as c, writeCameraPayloadToFile as d, screenSnapshotTempPath as i, parseCameraSnapPayload as l, parseScreenSnapshotPayload as n, writeScreenSnapshotToFile as o, screenRecordTempPath as r, cameraTempPath as s, parseScreenRecordPayload as t, writeCameraClipPayloadToFile as u };
