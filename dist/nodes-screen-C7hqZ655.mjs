import { s as asFiniteNumber } from "./number-coercion-CLj0HTDM.mjs";
import { u as toErrorObject } from "./error-coercion-C787aVxk.mjs";
import { o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { g as readStringValue } from "./string-coerce-CIXf7egm.mjs";
import { t as asBoolean } from "./boolean-C30ltbL7.mjs";
import "./errors-DnjwnOju.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { t as cancelUnreadResponseBody } from "./http-response-body-DXfezLdR.mjs";
import "./http-body-Bl_jph25.mjs";
import { t as normalizeHostname } from "./hostname-BEfh3sRX.mjs";
import { i as fetchWithSsrFGuard } from "./fetch-guard-EFfAF2PS.mjs";
import { n as extnameFromAnyPath } from "./file-name-CKnWacTs.mjs";
import { n as estimateBase64DecodedBytes, t as canonicalizeBase64 } from "./base64-B5EyWEOm.mjs";
import { t as publishOutputFileAtomically } from "./output-file.runtime.js";
import { t as CLI_NAME } from "./cli-name-Dp_huZBR.mjs";
import { t as parseMediaContentLength } from "./content-length-CHOuQ9D3.mjs";
import fs from "node:fs";
import * as path$1 from "node:path";
import * as fs$2 from "node:fs/promises";
import { randomUUID } from "node:crypto";
//#region src/cli/nodes-media-utils.ts
function normalizeMediaExtension(value) {
	const raw = (value.startsWith(".") ? value.slice(1) : value).toLowerCase();
	if (!/^[a-z0-9][a-z0-9_-]{0,15}$/u.test(raw)) return;
	return raw === "jpeg" ? ".jpg" : `.${raw}`;
}
/**
* True when `filePath` does not contradict media encoded as `format`.
*
* Callers choose an output path before the node reports how it encoded the
* media, so the name can end up describing bytes it never received. Everything
* that dispatches on extension — viewers, uploads, content-type headers,
* channel attachment handling — is misled when that happens. A path with no
* extension claims nothing and is therefore accepted.
*
* This only compares; it never rewrites the path. Output paths reach the media
* writers already workspace-guarded, and that guard alias-checks the exact
* final segment, so swapping the extension afterwards would write to a name
* nothing validated.
*/
function mediaPathMatchesFormat(filePath, format) {
	const current = extnameFromAnyPath(filePath);
	if (!current) return true;
	const desired = normalizeMediaExtension(format);
	return !desired || normalizeMediaExtension(current) === desired;
}
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
const MAX_CAMERA_URL_DOWNLOAD_BYTES = 262144e3;
const MAX_CAMERA_BASE64_BYTES = MAX_CAMERA_URL_DOWNLOAD_BYTES;
const CAMERA_URL_DOWNLOAD_TIMEOUT_MS = 9e5;
/** Resolve snap requests without inventing a facing when the CLI or node cannot select one. */
function resolveCameraSnapTargets(params) {
	if (params.platform?.toLowerCase() === "linux") return [{ artifactFacing: "unknown" }];
	if (!params.facing) return [{ artifactFacing: "unknown" }];
	const facings = params.facing === "both" ? ["front", "back"] : [params.facing];
	if (params.deviceId && facings.length > 1) throw new Error("facing=both is not allowed when deviceId is set");
	return facings.map((facing) => ({
		requestFacing: facing,
		artifactFacing: facing
	}));
}
/** Keep Linux clip requests and artifact labels honest when V4L2 position is unknown. */
function resolveCameraClipTarget(params) {
	return params.platform?.toLowerCase() === "linux" ? { artifactFacing: "unknown" } : {
		requestFacing: params.facing,
		artifactFacing: params.facing
	};
}
/** Validate a complete still-image payload before any capture can be published. */
function parseCameraSnapPayload(value, opts = {}) {
	const obj = asRecord(value);
	const format = readStringValue(obj.format);
	const base64 = readStringValue(obj.base64);
	const url = readStringValue(obj.url);
	const width = asFiniteNumber(obj.width);
	const height = asFiniteNumber(obj.height);
	if (!format || !base64 && !url || width === void 0 || height === void 0) throw new Error("invalid camera.snap payload");
	if (url) validateCameraPayloadUrl(url, requireNodeRemoteIp(opts.expectedHost));
	if (base64) validateCameraPayloadBase64(base64, MAX_CAMERA_BASE64_BYTES);
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
	const format = readStringValue(obj.format);
	const base64 = readStringValue(obj.base64);
	const url = readStringValue(obj.url);
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
	return path$1.join(tmpDir, `${CLI_NAME}-camera-${opts.kind}${facingPart}-${id}${ext}`);
}
function validateCameraPayloadUrl(url, expectedNodeHost) {
	const parsed = new URL(url);
	if (parsed.protocol !== "https:") throw new Error(`writeUrlToFile: only https URLs are allowed, got ${parsed.protocol}`);
	const expectedHost = normalizeHostname(expectedNodeHost);
	if (!expectedHost) throw new Error("writeUrlToFile: expectedHost is required");
	if (normalizeHostname(parsed.hostname) !== expectedHost) throw new Error(`writeUrlToFile: url host ${parsed.hostname} must match node host ${expectedNodeHost}`);
	return expectedHost;
}
/** Download a node-hosted media URL to disk after HTTPS, host, redirect, and size checks. */
async function writeUrlToFile(filePath, url, opts) {
	const expectedHost = validateCameraPayloadUrl(url, opts.expectedHost);
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
			policy,
			requireHttps: true,
			timeoutMs: CAMERA_URL_DOWNLOAD_TIMEOUT_MS
		});
		release = guarded.release;
		const res = guarded.response;
		const finalUrl = new URL(guarded.finalUrl);
		if (normalizeHostname(finalUrl.hostname) !== expectedHost) {
			await cancelUnreadResponseBody(res);
			throw new Error(`writeUrlToFile: redirect host ${finalUrl.hostname} must match node host ${opts.expectedHost}`);
		}
		if (!res.ok) {
			await cancelUnreadResponseBody(res);
			throw new Error(`failed to download ${url}: ${res.status} ${res.statusText}`);
		}
		let contentLength;
		try {
			contentLength = parseMediaContentLength(res.headers.get("content-length"));
		} catch (err) {
			await cancelUnreadResponseBody(res);
			throw err;
		}
		if (contentLength !== null && contentLength > MAX_CAMERA_URL_DOWNLOAD_BYTES) {
			await cancelUnreadResponseBody(res);
			throw new Error(`writeUrlToFile: content-length ${contentLength} exceeds max ${MAX_CAMERA_URL_DOWNLOAD_BYTES}`);
		}
		const body = res.body;
		if (!body) {
			await cancelUnreadResponseBody(res);
			throw new Error(`failed to download ${url}: empty response body`);
		}
		await publishOutputFileAtomically({
			filePath,
			writeTemp: async (tempPath) => {
				const fileHandle = await fs$2.open(tempPath, "wx");
				const reader = body.getReader();
				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;
						bytes += value.byteLength;
						if (bytes > MAX_CAMERA_URL_DOWNLOAD_BYTES) {
							await reader.cancel().catch(() => void 0);
							throw new Error(`writeUrlToFile: downloaded ${bytes} bytes, exceeds max ${MAX_CAMERA_URL_DOWNLOAD_BYTES}`);
						}
						await fileHandle.writeFile(value);
					}
				} catch (err) {
					await reader.cancel().catch(() => void 0);
					throw toErrorObject(err, "Non-Error thrown");
				} finally {
					reader.releaseLock();
					await fileHandle.close();
				}
				if (bytes === 0) throw new Error(`writeUrlToFile: empty download from ${url}`);
			}
		});
	} finally {
		await release();
	}
	return {
		path: filePath,
		bytes
	};
}
function validateCameraPayloadBase64(base64, maxBytes) {
	if (estimateBase64DecodedBytes(base64) > maxBytes) throw new Error(`writeBase64ToFile: decoded payload exceeds max ${maxBytes}`);
	const canonicalBase64 = canonicalizeBase64(base64);
	if (!canonicalBase64) throw new Error("writeBase64ToFile: invalid base64 payload");
	return canonicalBase64;
}
/** Decode a base64 media payload to disk with preflight and post-decode size checks. */
async function writeBase64ToFile(filePath, base64, opts = {}) {
	const maxBytes = opts.maxBytes ?? MAX_CAMERA_BASE64_BYTES;
	const canonicalBase64 = validateCameraPayloadBase64(base64, maxBytes);
	const buf = Buffer.from(canonicalBase64, "base64");
	if (buf.length > maxBytes) throw new Error(`writeBase64ToFile: decoded ${buf.length} bytes, exceeds max ${maxBytes}`);
	await fs$2.stat(path$1.dirname(filePath));
	await publishOutputFileAtomically({
		filePath,
		writeTemp: async (tempPath) => {
			await fs$2.writeFile(tempPath, buf, { flag: "wx" });
		}
	});
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
	const format = readStringValue(obj.format);
	const base64 = readStringValue(obj.base64);
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
/**
* Maps a caller-chosen snapshot path to the encoding the node should produce.
*
* `screen.snapshot` lets the node pick its encoding, so asking for the one the
* filename already promises is what keeps the name and the bytes in agreement.
* Returns undefined when the path claims nothing recognizable and the node's
* own default should stand.
*/
function screenSnapshotFormatForPath(filePath) {
	const ext = extnameFromAnyPath(filePath).toLowerCase();
	if (ext === ".png") return "png";
	return ext === ".jpg" || ext === ".jpeg" ? "jpeg" : void 0;
}
/** Build the temp output path for a screen snapshot artifact. */
function screenSnapshotTempPath(opts) {
	const { tmpDir, id, ext } = resolveTempPathParts(opts);
	return path$1.join(tmpDir, `openclaw-screen-snapshot-${id}${ext}`);
}
//#endregion
export { cameraTempPath as a, resolveCameraClipTarget as c, writeCameraClipPayloadToFile as d, writeCameraPayloadToFile as f, screenSnapshotTempPath as i, resolveCameraSnapTargets as l, screenRecordTempPath as n, parseCameraClipPayload as o, mediaPathMatchesFormat as p, screenSnapshotFormatForPath as r, parseCameraSnapPayload as s, parseScreenRecordPayload as t, writeBase64ToFile as u };
