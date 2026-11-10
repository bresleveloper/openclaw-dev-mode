import { o as normalizeLowercaseStringOrEmpty } from "./string-coerce-1VuiLaaR.mjs";
import { n as resolveDiagnosticProcessEnv } from "./process-env-BNjOnVtu.mjs";
import { n as assertAppContainerSpawnSupported } from "./windows-appcontainer-spawn-CK6NM058.mjs";
import { s as queryWindowsRegistryValue, t as getWindowsCmdExePath } from "./windows-install-roots-BWNEWHjx.mjs";
import { spawnSync } from "node:child_process";
//#region src/infra/windows-encoding.ts
const WINDOWS_CODEPAGE_ENCODING_MAP = {
	65001: "utf-8",
	54936: "gb18030",
	874: "windows-874",
	936: "gbk",
	950: "big5",
	932: "shift_jis",
	949: "euc-kr",
	1250: "windows-1250",
	1251: "windows-1251",
	1252: "windows-1252",
	1253: "windows-1253",
	1254: "windows-1254",
	1255: "windows-1255",
	1256: "windows-1256",
	1257: "windows-1257",
	1258: "windows-1258"
};
const WINDOWS_ENCODING_PROBE_TIMEOUT_MS = 5e3;
const WINDOWS_NLS_CODEPAGE_KEY = "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Nls\\CodePage";
const WINDOWS_OEM_CODEPAGE_ENCODING_MAP = {
	65001: "utf-8",
	874: "windows-874",
	932: "shift_jis",
	936: "gbk",
	949: "euc-kr",
	950: "big5",
	1258: "windows-1258",
	437: "cp437",
	720: "cp720",
	737: "cp737",
	775: "cp775",
	850: "cp850",
	852: "cp852",
	855: "cp855",
	857: "cp857",
	858: "cp858",
	860: "cp860",
	861: "cp861",
	862: "cp862",
	863: "cp863",
	865: "cp865",
	866: "cp866",
	869: "cp869"
};
const WINDOWS_OEM_ENCODING_CODEPAGE_MAP = new Map(Object.entries(WINDOWS_OEM_CODEPAGE_ENCODING_MAP).map(([codePage, encoding]) => [encoding, Number.parseInt(codePage, 10)]));
let cachedWindowsConsoleEncoding;
let cachedWindowsSystemEncoding;
let cachedWindowsOemCodePage;
/** Extracts a Windows console code page number from localized `chcp` output. */
function parseWindowsCodePage(raw) {
	const codePage = Number(raw.match(/\b(\d{3,5})\b/)?.[1]);
	return codePage > 0 ? codePage : null;
}
/** Resolves and caches the current Windows console encoding for subprocess output. */
function resolveWindowsConsoleEncoding() {
	if (process.platform !== "win32") return null;
	if (cachedWindowsConsoleEncoding !== void 0) return cachedWindowsConsoleEncoding;
	cachedWindowsConsoleEncoding = probeWindowsEncoding(getWindowsCmdExePath, [
		"/d",
		"/s",
		"/c",
		"chcp"
	]);
	return cachedWindowsConsoleEncoding;
}
/** Resolves and caches the Windows system encoding used by legacy text files. */
function resolveWindowsSystemEncoding() {
	if (process.platform !== "win32") return null;
	if (cachedWindowsSystemEncoding !== void 0) return cachedWindowsSystemEncoding;
	cachedWindowsSystemEncoding = probeWindowsEncoding(() => "powershell.exe", [
		"-NoLogo",
		"-NoProfile",
		"-NonInteractive",
		"-Command",
		"[Text.Encoding]::Default.CodePage"
	]);
	return cachedWindowsSystemEncoding;
}
function probeWindowsEncoding(command, args) {
	assertAppContainerSpawnSupported();
	try {
		const result = spawnSync(command(), args, {
			env: resolveDiagnosticProcessEnv(),
			windowsHide: true,
			encoding: "utf8",
			killSignal: "SIGKILL",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			],
			timeout: WINDOWS_ENCODING_PROBE_TIMEOUT_MS
		});
		const codePage = parseWindowsCodePage(`${result.stdout ?? ""}\n${result.stderr ?? ""}`);
		return codePage !== null ? WINDOWS_CODEPAGE_ENCODING_MAP[codePage] ?? null : null;
	} catch {
		return null;
	}
}
/** Resolves and caches the boot-time Windows OEM encoding cmd.exe reads batch files with. */
function resolveWindowsOemEncoding() {
	const codePage = resolveWindowsOemCodePage();
	return codePage !== null ? WINDOWS_OEM_CODEPAGE_ENCODING_MAP[codePage] ?? null : null;
}
/** Resolves and caches the numeric boot-time Windows OEM code page. */
function resolveWindowsOemCodePage() {
	if (process.platform !== "win32") return null;
	if (cachedWindowsOemCodePage !== void 0) return cachedWindowsOemCodePage;
	const raw = queryWindowsRegistryValue(WINDOWS_NLS_CODEPAGE_KEY, "OEMCP");
	cachedWindowsOemCodePage = raw === null ? null : parseWindowsCodePage(raw);
	return cachedWindowsOemCodePage;
}
/** Returns the numeric Windows OEM page for one resolver encoding label. */
function resolveWindowsOemCodePageForEncoding(encoding) {
	return WINDOWS_OEM_ENCODING_CODEPAGE_MAP.get(encoding) ?? null;
}
/** Decodes one complete subprocess output buffer, preferring valid UTF-8 before legacy code pages. */
function decodeWindowsOutputBuffer(params) {
	return decodeWindowsBufferWithFallback({
		...params,
		resolveFallbackEncoding: () => params.windowsEncoding ?? resolveWindowsConsoleEncoding()
	});
}
/** Decodes a text file, preferring valid UTF-8 before the Windows system encoding. */
function decodeWindowsTextFileBuffer(params) {
	return decodeUtf16BomBuffer(params.buffer) ?? decodeWindowsBufferWithFallback({
		...params,
		resolveFallbackEncoding: () => params.windowsEncoding ?? resolveWindowsSystemEncoding()
	});
}
function decodeUtf16BomBuffer(buffer) {
	const [first, second] = buffer;
	return first === 255 && second === 254 || first === 254 && second === 255 ? new TextDecoder(first === 255 ? "utf-16le" : "utf-16be").decode(buffer) : void 0;
}
function decodeWindowsBufferWithFallback(params) {
	if ((params.platform ?? process.platform) !== "win32") return params.buffer.toString("utf8");
	const utf16 = decodeUtf16BomBuffer(params.buffer);
	if (utf16 !== void 0) return utf16;
	const utf8 = decodeStrictUtf8(params.buffer);
	if (utf8 !== null) return utf8;
	const encoding = params.resolveFallbackEncoding();
	if (!encoding || normalizeLowercaseStringOrEmpty(encoding) === "utf-8") return params.buffer.toString("utf8");
	try {
		return new TextDecoder(encoding).decode(params.buffer);
	} catch {
		return params.buffer.toString("utf8");
	}
}
/** Creates a streaming decoder for subprocess output chunks that may split multibyte characters. */
function createWindowsOutputDecoder(params) {
	const platform = params?.platform ?? process.platform;
	const encoding = platform === "win32" ? params?.windowsEncoding ?? resolveWindowsConsoleEncoding() : null;
	const normalizedEncoding = normalizeLowercaseStringOrEmpty(encoding);
	const legacyDecoder = platform === "win32" && encoding && normalizedEncoding !== "utf-8" ? new TextDecoder(encoding) : null;
	const preserveUtf8Bom = params?.preserveUtf8Bom === true;
	let decoder = new TextDecoder("utf-8", legacyDecoder ? {
		fatal: true,
		...preserveUtf8Bom ? { ignoreBOM: true } : {}
	} : preserveUtf8Bom ? { ignoreBOM: true } : void 0);
	let pendingUtf8Bytes = Buffer.alloc(0);
	let pendingBomByte = platform === "win32" ? void 0 : null;
	let utf16Decoder = null;
	const decodeCurrent = (buffer) => {
		const options = buffer === void 0 ? void 0 : { stream: true };
		if (!legacyDecoder || decoder === legacyDecoder) return decoder.decode(buffer, options);
		try {
			const decoded = decoder.decode(buffer, options);
			const trailingBuffer = buffer && buffer.length < 4 && pendingUtf8Bytes.length > 0 ? Buffer.concat([pendingUtf8Bytes, buffer]) : buffer;
			pendingUtf8Bytes = trailingBuffer ? Buffer.from(getTrailingIncompleteUtf8Bytes(trailingBuffer)) : Buffer.alloc(0);
			return decoded;
		} catch {
			const replayBuffer = buffer === void 0 ? pendingUtf8Bytes : pendingUtf8Bytes.length > 0 ? Buffer.concat([pendingUtf8Bytes, buffer]) : buffer;
			decoder = legacyDecoder;
			pendingUtf8Bytes = Buffer.alloc(0);
			return buffer !== void 0 || replayBuffer.length > 0 ? legacyDecoder.decode(replayBuffer, options) : "";
		}
	};
	return {
		decode(chunk) {
			const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
			if (utf16Decoder) return utf16Decoder.decode(buffer, { stream: true });
			if (pendingBomByte === null || buffer.length === 0) return pendingBomByte === null ? decodeCurrent(buffer) : "";
			const candidate = pendingBomByte === void 0 ? buffer : Buffer.concat([Buffer.from([pendingBomByte]), buffer]);
			const [first, second] = candidate;
			if (second === void 0 && (first === 255 || first === 254)) {
				pendingBomByte = first;
				return "";
			}
			pendingBomByte = null;
			if (first === 255 && second === 254 || first === 254 && second === 255) {
				utf16Decoder = new TextDecoder(first === 255 ? "utf-16le" : "utf-16be");
				return utf16Decoder.decode(candidate, { stream: true });
			}
			return decodeCurrent(candidate);
		},
		flush() {
			if (utf16Decoder) return utf16Decoder.decode();
			const pending = typeof pendingBomByte === "number" ? Buffer.from([pendingBomByte]) : null;
			pendingBomByte = null;
			return (pending ? decodeCurrent(pending) : "") + decodeCurrent();
		}
	};
}
function getTrailingIncompleteUtf8Bytes(buffer) {
	let index = buffer.length - 1;
	let continuationBytes = 0;
	while (index >= 0 && continuationBytes < 3) {
		const byte = buffer.readUInt8(index);
		if (byte < 128 || byte > 191) break;
		continuationBytes += 1;
		index -= 1;
	}
	if (index < 0) return buffer;
	const sequenceLength = getUtf8SequenceLength(buffer.readUInt8(index));
	if (sequenceLength <= 1) return Buffer.alloc(0);
	return continuationBytes + 1 < sequenceLength ? buffer.subarray(index) : Buffer.alloc(0);
}
function getUtf8SequenceLength(byte) {
	if (byte >= 194 && byte <= 223) return 2;
	if (byte >= 224 && byte <= 239) return 3;
	if (byte >= 240 && byte <= 244) return 4;
	return 1;
}
function decodeStrictUtf8(buffer) {
	try {
		return new TextDecoder("utf-8", { fatal: true }).decode(buffer);
	} catch {
		return null;
	}
}
//#endregion
export { resolveWindowsOemCodePage as a, resolveWindowsConsoleEncoding as i, decodeWindowsOutputBuffer as n, resolveWindowsOemCodePageForEncoding as o, decodeWindowsTextFileBuffer as r, resolveWindowsOemEncoding as s, createWindowsOutputDecoder as t };
