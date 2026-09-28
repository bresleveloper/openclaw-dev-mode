import { r as asNullableRecord } from "../../record-coerce-DItp3I4t.mjs";
import { r as isPathInside } from "../../path-guards-D5kuI0Tv.mjs";
import { E as resolveStateDir } from "../../paths-DehQwyE0.mjs";
import "../../string-coerce-runtime-C_MKhRVt.mjs";
import "../../file-access-runtime-CWjkXCju.mjs";
import "../../state-paths-Bk2vDLZh.mjs";
import { t as readPrivateNativeHostFile } from "../../extension-native-host-file-B8Lb2IZe.mjs";
import "../../extension-native-host.constants-CchS6g7H.mjs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
//#region extensions/browser/src/browser/extension-native-protocol.ts
const BROWSER_NATIVE_REQUEST_MAX_BYTES = 4096;
const BROWSER_NATIVE_RESPONSE_MAX_BYTES = 1048576;
const NONCE_PATTERN = /^[A-Za-z0-9_-]+$/;
function readNativeUint32(buffer, offset = 0) {
	return os.endianness() === "LE" ? buffer.readUInt32LE(offset) : buffer.readUInt32BE(offset);
}
function writeNativeUint32(buffer, value, offset = 0) {
	if (os.endianness() === "LE") buffer.writeUInt32LE(value, offset);
	else buffer.writeUInt32BE(value, offset);
}
function rootJsonKeys(raw) {
	const keys = [];
	let index = 0;
	const skipWhitespace = () => {
		while (/\s/u.test(raw[index] ?? "")) index += 1;
	};
	const readJsonString = () => {
		if (raw[index] !== "\"") return null;
		const start = index++;
		while (index < raw.length) {
			const char = raw[index++];
			if (char === "\\") index += 1;
			else if (char === "\"") try {
				return JSON.parse(raw.slice(start, index));
			} catch {
				return null;
			}
		}
		return null;
	};
	const skipValue = () => {
		let depth = 0;
		let inString = false;
		let escaped = false;
		while (index < raw.length) {
			const char = raw[index];
			if (inString) {
				index += 1;
				if (escaped) escaped = false;
				else if (char === "\\") escaped = true;
				else if (char === "\"") inString = false;
				continue;
			}
			if (char === "\"") {
				inString = true;
				index += 1;
				continue;
			}
			if (char === "{" || char === "[") depth += 1;
			else if (char === "}" || char === "]") {
				if (depth === 0) return true;
				depth -= 1;
			} else if (char === "," && depth === 0) return true;
			index += 1;
		}
		return true;
	};
	skipWhitespace();
	if (raw[index++] !== "{") return null;
	for (;;) {
		skipWhitespace();
		if (raw[index] === "}") return keys;
		const key = readJsonString();
		if (key === null) return null;
		keys.push(key);
		skipWhitespace();
		if (raw[index++] !== ":") return null;
		skipWhitespace();
		if (!skipValue()) return null;
		skipWhitespace();
		if (raw[index] === ",") {
			index += 1;
			continue;
		}
		return raw[index] === "}" ? keys : null;
	}
}
function isCanonicalNonce(value) {
	if (typeof value !== "string" || !NONCE_PATTERN.test(value)) return false;
	const bytes = Buffer.from(value, "base64url");
	return bytes.length >= 16 && bytes.length <= 32 && bytes.toString("base64url") === value;
}
/** Strictly validate one decoded native bootstrap request. */
function parseBrowserNativeRequest(raw) {
	const keys = rootJsonKeys(raw);
	if (!keys || new Set(keys).size !== keys.length) return null;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return null;
	}
	const record = asNullableRecord(parsed);
	if (record?.v !== 1 || !isCanonicalNonce(record.nonce)) return null;
	const expected = record.op === "ensure_relay" ? [
		"v",
		"op",
		"nonce",
		"relayPort"
	] : [
		"v",
		"op",
		"nonce"
	];
	if (keys.length !== expected.length || !expected.every((key) => keys.includes(key))) return null;
	if (record.op === "bootstrap") return {
		v: 1,
		op: "bootstrap",
		nonce: record.nonce
	};
	return record.op === "ensure_relay" && typeof record.relayPort === "number" && Number.isInteger(record.relayPort) && record.relayPort >= 1 && record.relayPort <= 65535 ? {
		v: 1,
		op: "ensure_relay",
		nonce: record.nonce,
		relayPort: record.relayPort
	} : null;
}
function decodeBrowserNativeFrame(frame) {
	if (frame.length < 4) return {
		ok: false,
		code: "invalid_frame"
	};
	const length = readNativeUint32(frame);
	if (length === 0 || length > BROWSER_NATIVE_REQUEST_MAX_BYTES || frame.length !== length + 4) return {
		ok: false,
		code: "invalid_frame"
	};
	let raw;
	try {
		raw = new TextDecoder("utf-8", { fatal: true }).decode(frame.subarray(4));
	} catch {
		return {
			ok: false,
			code: "invalid_utf8"
		};
	}
	const request = parseBrowserNativeRequest(raw);
	return request ? {
		ok: true,
		request
	} : {
		ok: false,
		code: "invalid_request"
	};
}
/** Read exactly one small frame without allocating from an untrusted length. */
async function readBrowserNativeFrame(input) {
	let buffered = Buffer.alloc(0);
	let expected = 4;
	for await (const chunk of input) {
		if (buffered.length + chunk.length > 4100) throw new Error("invalid_frame");
		buffered = Buffer.concat([buffered, chunk], buffered.length + chunk.length);
		if (expected === 4 && buffered.length >= 4) {
			const length = readNativeUint32(buffered);
			if (length === 0 || length > BROWSER_NATIVE_REQUEST_MAX_BYTES) throw new Error("invalid_frame");
			expected = length + 4;
		}
		if (buffered.length >= expected) {
			if (buffered.length !== expected) throw new Error("invalid_frame");
			return buffered;
		}
	}
	throw new Error("invalid_frame");
}
function encodeBrowserNativeResponse(response) {
	const payload = Buffer.from(JSON.stringify(response), "utf8");
	if (payload.length >= BROWSER_NATIVE_RESPONSE_MAX_BYTES) throw new Error("native response exceeds Chrome's 1 MiB limit");
	const frame = Buffer.allocUnsafe(payload.length + 4);
	writeNativeUint32(frame, payload.length);
	payload.copy(frame, 4);
	return frame;
}
//#endregion
//#region extensions/browser/src/browser/extension-native-host.ts
const EXTENSION_ORIGIN_PATTERN = /^chrome-extension:\/\/[a-p]{32}\/$/;
function validateExpectedOrigins(origins) {
	const canonical = [...new Set(origins)].toSorted();
	if (origins.length === 0 || origins.length !== canonical.length || origins.some((origin, index) => origin !== canonical[index]) || origins.some((origin) => !EXTENSION_ORIGIN_PATTERN.test(origin))) throw new Error("invalid expected origins");
	return canonical;
}
function parseBrowserNativeHostOrigins(argv) {
	const expectedOrigins = [];
	let callerOrigin = "";
	for (let index = 0; index < argv.length; index += 1) {
		const argument = argv[index];
		if (argument === "--expected-origin") {
			const value = argv[index + 1];
			if (!value || callerOrigin) throw new Error("invalid expected-origin arguments");
			expectedOrigins.push(value);
			index += 1;
		} else if (argument?.startsWith("chrome-extension://")) {
			if (callerOrigin) throw new Error("multiple Chrome extension origins");
			callerOrigin = argument;
		}
	}
	validateExpectedOrigins(expectedOrigins);
	if (!EXTENSION_ORIGIN_PATTERN.test(callerOrigin)) throw new Error("missing Chrome extension origin");
	return {
		expectedOrigins,
		callerOrigin
	};
}
async function validateNativeManifest(params) {
	const manifestFile = await readPrivateNativeHostFile(params.manifestPath, false);
	const { realPath: launcherPath } = await readPrivateNativeHostFile(params.launcherPath, true);
	const managedRoot = path.resolve(params.stateDir ?? resolveStateDir(), "browser", "native-messaging");
	if (!isPathInside(managedRoot, launcherPath)) throw new Error("launcher is outside the managed root");
	const parsed = JSON.parse(manifestFile.buffer.toString("utf8"));
	const manifestRecord = asNullableRecord(parsed);
	if (!manifestRecord) throw new Error("invalid manifest");
	const manifest = manifestRecord;
	const expectedOrigins = validateExpectedOrigins(params.expectedOrigins);
	const keys = [
		"name",
		"description",
		"path",
		"type",
		"allowed_origins"
	];
	if (Object.keys(manifest).length !== keys.length || !keys.every((key) => Object.hasOwn(manifest, key)) || manifest.name !== "ai.openclaw.browser_bootstrap" || manifest.type !== "stdio" || (process.platform === "win32" ? typeof manifest.path !== "string" || manifest.path.toLowerCase() !== launcherPath.toLowerCase() : manifest.path !== launcherPath) || !Array.isArray(manifest.allowed_origins) || JSON.stringify(manifest.allowed_origins) !== JSON.stringify(expectedOrigins)) throw new Error("invalid manifest");
	if (!expectedOrigins.includes(params.callerOrigin)) throw new Error("origin forbidden");
}
/** Run one request/response native host process. */
async function runBrowserNativeHost(params) {
	let response;
	try {
		const decoded = decodeBrowserNativeFrame(await readBrowserNativeFrame(params.input));
		if (!decoded.ok) response = {
			v: 1,
			ok: false,
			code: decoded.code
		};
		else if ((params.platform ?? process.platform) === "win32" && process.platform !== "win32") response = {
			v: 1,
			ok: false,
			code: "manual_required"
		};
		else {
			let boundProfile;
			try {
				if ((params.platform ?? process.platform) === "win32") {
					const { validateWindowsNativeContext } = await import("../../extension-windows-host-De9dw0U9.mjs");
					boundProfile = await validateWindowsNativeContext(params);
					if (!params.expectedOrigins.includes(params.callerOrigin)) throw new Error("origin forbidden");
				} else await validateNativeManifest(params);
			} catch (error) {
				response = {
					v: 1,
					ok: false,
					code: error instanceof Error && error.message === "origin forbidden" ? "origin_forbidden" : "manifest_invalid"
				};
				params.write(encodeBrowserNativeResponse(response));
				return response;
			}
			if (decoded.request.op === "ensure_relay") try {
				const relay = await params.ensureRelay(decoded.request.relayPort);
				response = {
					v: 1,
					ok: true,
					nonce: decoded.request.nonce,
					relay
				};
			} catch {
				response = {
					v: 1,
					ok: false,
					code: "relay_unavailable"
				};
			}
			else try {
				const pairing = await params.buildPairing(boundProfile);
				response = pairing.topology === "direct-remote" ? {
					v: 1,
					ok: false,
					code: "manual_required"
				} : {
					v: 1,
					ok: true,
					nonce: decoded.request.nonce,
					pairingString: pairing.pairingString
				};
			} catch (error) {
				response = {
					v: 1,
					ok: false,
					code: error instanceof Error && error.message.includes("--gateway-url") ? "manual_required" : "pairing_unavailable"
				};
			}
		}
	} catch {
		response = {
			v: 1,
			ok: false,
			code: "invalid_frame"
		};
	}
	params.write(encodeBrowserNativeResponse(response));
	return response;
}
//#endregion
//#region extensions/browser/native-host-entry.ts
function requiredArgument(name) {
	const index = process.argv.indexOf(name);
	const value = index >= 0 ? process.argv[index + 1] : void 0;
	if (!value) throw new Error(`Missing ${name}`);
	return value;
}
async function main() {
	const { callerOrigin, expectedOrigins } = parseBrowserNativeHostOrigins(process.argv.slice(2));
	let responseFrame;
	await runBrowserNativeHost({
		manifestPath: requiredArgument("--manifest"),
		launcherPath: requiredArgument("--launcher"),
		callerOrigin,
		expectedOrigins,
		input: process.stdin,
		write: (frame) => {
			responseFrame = frame;
		},
		buildPairing: async (boundProfile) => {
			const { buildBrowserNativeHostPairing } = await import("../../extension-native-host.runtime-CON80GlP.mjs");
			const profile = process.argv.indexOf("--browser-profile") >= 0 ? requiredArgument("--browser-profile") : void 0;
			return await buildBrowserNativeHostPairing(boundProfile ?? profile);
		},
		ensureRelay: async (port) => {
			const { ensureBrowserNativeRelay } = await import("../../extension-native-host.runtime-CON80GlP.mjs");
			return await ensureBrowserNativeRelay(port, fileURLToPath(new URL("./relay-daemon-entry.js", import.meta.url)));
		}
	});
	const response = responseFrame;
	if (!response) throw new Error("Native host produced no response frame");
	await new Promise((resolve) => {
		process.stdout.write(response, () => resolve());
	});
}
main().catch(() => {
	process.exitCode = 1;
});
//#endregion
export {};
