import { a as asOptionalRecord, s as filterStringRecord } from "./record-coerce-DItp3I4t.mjs";
import { r as truncateUtf16Safe } from "./utf16-slice-D_ngcYKd.mjs";
import "./string-coerce-runtime-C_MKhRVt.mjs";
import "./speech-provider-CgepLVUd.mjs";
import { readdirSync } from "node:fs";
import path from "node:path";
//#region extensions/tts-local-cli/speech-provider.ts
const VALID_OUTPUT_FORMATS = [
	"mp3",
	"opus",
	"wav"
];
const AUDIO_EXTENSIONS = /* @__PURE__ */ new Set([
	".wav",
	".mp3",
	".opus",
	".ogg",
	".m4a"
]);
const DEFAULT_TIMEOUT_MS = 12e4;
const MAX_AUDIO_OUTPUT_BYTES = 52428800;
const MAX_CLI_STDERR_BYTES = 1048576;
function asStringArray(value) {
	return Array.isArray(value) && value.every((v) => typeof v === "string") ? value : void 0;
}
function normalizeOutputFormat(value) {
	if (typeof value !== "string") return "mp3";
	const lower = value.toLowerCase().trim();
	if (VALID_OUTPUT_FORMATS.includes(lower)) return lower;
	return "mp3";
}
function resolveCliProviderConfig(rawConfig) {
	const providers = asOptionalRecord(rawConfig.providers);
	return asOptionalRecord(providers?.["tts-local-cli"]) ?? asOptionalRecord(providers?.cli) ?? {};
}
function getConfig(cfg, timeoutMs = DEFAULT_TIMEOUT_MS) {
	const command = typeof cfg.command === "string" ? cfg.command.trim() : "";
	if (!command) return null;
	return {
		command,
		args: asStringArray(cfg.args) ?? [],
		outputFormat: normalizeOutputFormat(cfg.outputFormat),
		timeoutMs: typeof cfg.timeoutMs === "number" ? cfg.timeoutMs : timeoutMs,
		cwd: typeof cfg.cwd === "string" ? cfg.cwd : void 0,
		env: filterStringRecord(cfg.env)
	};
}
function stripEmojis(text) {
	return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, " ").replace(/\s+/g, " ").trim();
}
function applyTemplate(str, ctx) {
	return str.replace(/{{\s*(\w+)\s*}}/gi, (_, key) => {
		return ctx[key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()] ?? ctx[key] ?? "";
	});
}
function parseCommand(cmdStr) {
	const parts = [];
	let current = "";
	let tokenStarted = false;
	let inQuote = false;
	let quoteChar = "";
	for (const char of cmdStr.trim()) if (inQuote) {
		if (char === quoteChar) inQuote = false;
		else current += char;
	} else if (char === "\"" || char === "'") {
		tokenStarted = true;
		inQuote = true;
		quoteChar = char;
	} else if (char === " " || char === "	") {
		if (tokenStarted) {
			parts.push(current);
			current = "";
			tokenStarted = false;
		}
	} else {
		tokenStarted = true;
		current += char;
	}
	if (tokenStarted) parts.push(current);
	return {
		cmd: parts[0] || "",
		initialArgs: parts.slice(1)
	};
}
function findAudioFile(dir, baseName) {
	const files = readdirSync(dir);
	for (const file of files) {
		const ext = path.extname(file).toLowerCase();
		if (AUDIO_EXTENSIONS.has(ext) && (file.startsWith(baseName) || file.includes(baseName))) return path.join(dir, file);
	}
	for (const file of files) {
		const ext = path.extname(file).toLowerCase();
		if (AUDIO_EXTENSIONS.has(ext)) return path.join(dir, file);
	}
	return null;
}
function detectFormatFromExtension(filePath) {
	return path.extname(filePath).toLowerCase() === ".m4a" ? "m4a" : null;
}
function hasMpegFrameHeader(buffer, offset) {
	const mpegHeader = buffer[offset + 1] ?? 0;
	const mpegFormat = buffer[offset + 2] ?? 0;
	return buffer.length >= offset + 4 && buffer[offset] === 255 && (mpegHeader & 224) === 224 && (mpegHeader & 24) !== 8 && (mpegHeader & 6) !== 0 && (mpegFormat & 240) !== 240 && (mpegFormat & 12) !== 12;
}
function hasId3v2MpegFrame(buffer) {
	if (buffer.length < 10) return false;
	const majorVersion = buffer[3] ?? 0;
	const revision = buffer[4] ?? 0;
	const flags = buffer[5] ?? 0;
	if (majorVersion < 2 || majorVersion > 4 || revision === 255) return false;
	if ((flags & (255 ^ (majorVersion === 2 ? 192 : majorVersion === 3 ? 224 : 240))) !== 0) return false;
	const size0 = buffer[6] ?? 0;
	const size1 = buffer[7] ?? 0;
	const size2 = buffer[8] ?? 0;
	const size3 = buffer[9] ?? 0;
	if ((size0 | size1 | size2 | size3) & 128) return false;
	const tagSize = size0 << 21 | size1 << 14 | size2 << 7 | size3;
	const footerSize = majorVersion === 4 && (flags & 16) !== 0 ? 10 : 0;
	const audioOffset = 10 + tagSize + footerSize;
	return audioOffset < buffer.length && hasMpegFrameHeader(buffer, audioOffset);
}
function detectAudioFormat(buffer) {
	const prefix = buffer.toString("ascii", 0, 12);
	if (prefix.startsWith("RIFF") && prefix.slice(8, 12) === "WAVE") return "wav";
	if (hasMpegFrameHeader(buffer, 0) || prefix.startsWith("ID3") && hasId3v2MpegFrame(buffer)) return "mp3";
	return prefix.startsWith("OggS") ? "ogg" : null;
}
function getFileExt(format) {
	return `.${format}`;
}
async function readAudioFile(filePath) {
	const { readRegularFileSync } = await import("./plugin-sdk/security-runtime.js");
	return readRegularFileSync({
		filePath,
		maxBytes: MAX_AUDIO_OUTPUT_BYTES
	}).buffer;
}
async function runCli(params) {
	const cleanText = stripEmojis(params.text);
	if (!cleanText) throw new Error("CLI TTS: text is empty after removing emojis");
	const outputExt = getFileExt(params.config.outputFormat);
	const ctx = {
		Text: cleanText,
		OutputPath: path.join(params.outputDir, `${params.filePrefix}${outputExt}`),
		OutputDir: params.outputDir,
		OutputBase: params.filePrefix
	};
	const { cmd, initialArgs } = parseCommand(params.config.command);
	if (!cmd) throw new Error("CLI TTS: invalid command");
	const baseArgs = [...initialArgs, ...params.config.args];
	const args = baseArgs.map((a) => applyTemplate(a, ctx));
	const input = baseArgs.some((a) => /{{\s*text\s*}}/i.test(a)) ? "" : cleanText;
	const { runCommandBuffered } = await import("./plugin-sdk/process-runtime.js");
	const result = await runCommandBuffered([cmd, ...args], {
		cwd: params.config.cwd,
		env: params.config.env,
		input,
		maxOutputBytes: {
			stdout: MAX_AUDIO_OUTPUT_BYTES,
			stderr: MAX_CLI_STDERR_BYTES
		},
		timeoutMs: params.config.timeoutMs
	});
	if (result.termination === "timeout") throw new Error(`CLI TTS timed out after ${params.config.timeoutMs}ms`);
	if (result.termination === "output-limit") {
		const stream = result.outputLimitStream ?? "stdout";
		throw new Error(`CLI TTS ${stream} exceeded ${stream === "stderr" ? MAX_CLI_STDERR_BYTES : MAX_AUDIO_OUTPUT_BYTES} bytes`);
	}
	if (result.code !== null && result.code !== 0) throw new Error(`CLI TTS exit ${result.code}: ${result.stderr.toString("utf8")}`);
	if (result.termination !== "exit" && result.termination !== "error") throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
	if (result.termination === "error" && result.code !== 0) throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
	const audioFile = findAudioFile(params.outputDir, params.filePrefix);
	if (audioFile) {
		const buffer = await readAudioFile(audioFile);
		const format = detectAudioFormat(buffer) ?? detectFormatFromExtension(audioFile);
		if (!format) throw new Error(`CLI TTS: unknown format for ${audioFile}`);
		return {
			buffer,
			actualFormat: format,
			audioPath: audioFile
		};
	}
	if (result.termination === "error" && result.errorStream !== "stderr") throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
	const stdout = result.stdout;
	if (stdout.length > 0) {
		const actualFormat = detectAudioFormat(stdout);
		if (!actualFormat) throw new Error("CLI TTS stdout audio format is not recognized; emit WAV, MP3, or Ogg Opus bytes, or write a supported audio file");
		return {
			buffer: stdout,
			actualFormat
		};
	}
	if (result.termination === "error") throw new Error(`CLI TTS failed: ${result.error?.message ?? result.termination}`);
	throw new Error("CLI TTS produced no output");
}
async function runFfmpegToBuffer(params) {
	const outputPath = path.join(params.outputDir, params.outputFileName);
	const { runFfmpeg } = await import("./plugin-sdk/media-runtime.js");
	const { writeExternalFileWithinRoot } = await import("./plugin-sdk/security-runtime.js");
	await writeExternalFileWithinRoot({
		rootDir: params.outputDir,
		path: params.outputFileName,
		write: async (tempPath) => {
			await runFfmpeg([...params.args, tempPath]);
		}
	});
	return readAudioFile(outputPath);
}
async function convertAudio(inputPath, outputDir, target) {
	const outputFileName = `converted${getFileExt(target)}`;
	const args = [
		"-y",
		"-i",
		inputPath
	];
	if (target === "opus") args.push("-c:a", "libopus", "-b:a", "64k", "-f", "opus");
	else if (target === "wav") args.push("-c:a", "pcm_s16le", "-f", "wav");
	else args.push("-c:a", "libmp3lame", "-b:a", "128k", "-f", "mp3");
	return await runFfmpegToBuffer({
		args,
		outputDir,
		outputFileName
	});
}
async function convertToRawPcm(inputPath, outputDir) {
	return await runFfmpegToBuffer({
		args: [
			"-y",
			"-i",
			inputPath,
			"-c:a",
			"pcm_s16le",
			"-ar",
			"16000",
			"-ac",
			"1",
			"-f",
			"s16le"
		],
		outputDir,
		outputFileName: "telephony.pcm"
	});
}
function buildCliSpeechProvider() {
	return {
		id: "tts-local-cli",
		aliases: ["cli"],
		label: "Local CLI",
		autoSelectOrder: 1e3,
		defaultTimeoutMs: DEFAULT_TIMEOUT_MS,
		resolveConfig(ctx) {
			return resolveCliProviderConfig(ctx.rawConfig);
		},
		isConfigured(ctx) {
			return getConfig(ctx.providerConfig) !== null;
		},
		async synthesize(req) {
			const { resolvePreferredOpenClawTmpDir, withTempWorkspace } = await import("./plugin-sdk/temp-path.js");
			const { createSubsystemLogger } = await import("./plugin-sdk/runtime-env.js");
			const log = createSubsystemLogger("tts-local-cli");
			const config = getConfig(req.providerConfig, req.timeoutMs);
			if (!config) throw new Error("CLI TTS not configured");
			log.debug(`synthesize: text=${truncateUtf16Safe(req.text, 50)}...`);
			return await withTempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: "openclaw-cli-tts-"
			}, async (temp) => {
				const tempDir = temp.dir;
				const result = await runCli({
					config,
					text: req.text,
					outputDir: tempDir,
					filePrefix: "speech"
				});
				log.debug(`synthesize: format=${result.actualFormat}, size=${result.buffer.length}`);
				const format = req.target === "voice-note" ? "opus" : config.outputFormat;
				let buffer = result.buffer;
				if (result.actualFormat !== format) {
					const inputName = `input${getFileExt(result.actualFormat)}`;
					const inputFile = result.audioPath ?? path.join(tempDir, inputName);
					if (!result.audioPath) await temp.write(inputName, result.buffer);
					buffer = await convertAudio(inputFile, tempDir, format);
				}
				const fileExtension = format === "opus" ? ".ogg" : `.${format}`;
				return {
					audioBuffer: buffer,
					outputFormat: format,
					fileExtension,
					voiceCompatible: req.target === "voice-note" && format === "opus"
				};
			});
		},
		async synthesizeTelephony(req) {
			const { resolvePreferredOpenClawTmpDir, withTempWorkspace } = await import("./plugin-sdk/temp-path.js");
			const { createSubsystemLogger } = await import("./plugin-sdk/runtime-env.js");
			const log = createSubsystemLogger("tts-local-cli");
			const config = getConfig(req.providerConfig, req.timeoutMs);
			if (!config) throw new Error("CLI TTS not configured");
			log.debug(`synthesizeTelephony: text=${truncateUtf16Safe(req.text, 50)}...`);
			return await withTempWorkspace({
				rootDir: resolvePreferredOpenClawTmpDir(),
				prefix: "openclaw-cli-tts-"
			}, async (temp) => {
				const tempDir = temp.dir;
				const result = await runCli({
					config,
					text: req.text,
					outputDir: tempDir,
					filePrefix: "telephony"
				});
				const inputFile = result.audioPath ?? path.join(tempDir, `input${getFileExt(result.actualFormat)}`);
				if (!result.audioPath) await temp.write(`input${getFileExt(result.actualFormat)}`, result.buffer);
				return {
					audioBuffer: await convertToRawPcm(inputFile, tempDir),
					outputFormat: "pcm",
					sampleRate: 16e3
				};
			});
		}
	};
}
//#endregion
export { buildCliSpeechProvider as t };
