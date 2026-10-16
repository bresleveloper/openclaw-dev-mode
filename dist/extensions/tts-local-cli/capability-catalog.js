import { readdirSync } from "node:fs";
import path from "node:path";
import { truncateUtf16Safe } from "openclaw/plugin-sdk/speech-provider";
import { asOptionalRecord, filterStringRecord } from "openclaw/plugin-sdk/string-coerce-runtime";
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
	return VALID_OUTPUT_FORMATS.find((format) => format === lower) ?? "mp3";
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
	const files = readdirSync(dir).filter((file) => AUDIO_EXTENSIONS.has(path.extname(file).toLowerCase()));
	const file = files.find((candidate) => candidate.includes(baseName)) ?? files[0];
	return file === void 0 ? null : path.join(dir, file);
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
async function readAudioFile(filePath) {
	const { readRegularFileSync } = await import("openclaw/plugin-sdk/security-runtime");
	return readRegularFileSync({
		filePath,
		maxBytes: MAX_AUDIO_OUTPUT_BYTES
	}).buffer;
}
async function runCli(params) {
	const cleanText = stripEmojis(params.text);
	if (!cleanText) throw new Error("CLI TTS: text is empty after removing emojis");
	const ctx = {
		Text: cleanText,
		OutputPath: path.join(params.outputDir, `${params.filePrefix}.${params.config.outputFormat}`),
		OutputDir: params.outputDir,
		OutputBase: params.filePrefix
	};
	const { cmd, initialArgs } = parseCommand(params.config.command);
	if (!cmd) throw new Error("CLI TTS: invalid command");
	const baseArgs = [...initialArgs, ...params.config.args];
	const args = baseArgs.map((a) => applyTemplate(a, ctx));
	const input = baseArgs.some((a) => /{{\s*text\s*}}/i.test(a)) ? "" : cleanText;
	const { runCommandBuffered } = await import("openclaw/plugin-sdk/process-runtime");
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
		const format = detectAudioFormat(buffer) ?? (path.extname(audioFile).toLowerCase() === ".m4a" ? "m4a" : null);
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
async function convertAudio(inputPath, outputDir, target) {
	const outputFileName = target === "pcm" ? "telephony.pcm" : `converted.${target}`;
	const args = [
		"-y",
		"-i",
		inputPath
	];
	if (target === "pcm") args.push("-c:a", "pcm_s16le", "-ar", "16000", "-ac", "1", "-f", "s16le");
	else if (target === "opus") args.push("-c:a", "libopus", "-b:a", "64k", "-f", "opus");
	else if (target === "wav") args.push("-c:a", "pcm_s16le", "-f", "wav");
	else args.push("-c:a", "libmp3lame", "-b:a", "128k", "-f", "mp3");
	const { runFfmpeg } = await import("openclaw/plugin-sdk/media-runtime");
	const { writeExternalFileWithinRoot } = await import("openclaw/plugin-sdk/security-runtime");
	await writeExternalFileWithinRoot({
		rootDir: outputDir,
		path: outputFileName,
		write: async (tempPath) => {
			await runFfmpeg([...args, tempPath]);
		}
	});
	return readAudioFile(path.join(outputDir, outputFileName));
}
async function synthesizeCli(req, target) {
	const { resolvePreferredOpenClawTmpDir, withTempWorkspace } = await import("openclaw/plugin-sdk/temp-path");
	const { createSubsystemLogger } = await import("openclaw/plugin-sdk/runtime-env");
	const log = createSubsystemLogger("tts-local-cli");
	const config = getConfig(req.providerConfig, req.timeoutMs);
	if (!config) throw new Error("CLI TTS not configured");
	const telephony = target === "telephony";
	log.debug(`${telephony ? "synthesizeTelephony" : "synthesize"}: text=${truncateUtf16Safe(req.text, 50)}...`);
	return await withTempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-cli-tts-"
	}, async (temp) => {
		const result = await runCli({
			config,
			text: req.text,
			outputDir: temp.dir,
			filePrefix: telephony ? "telephony" : "speech"
		});
		if (!telephony) log.debug(`synthesize: format=${result.actualFormat}, size=${result.buffer.length}`);
		const format = telephony ? "pcm" : target === "voice-note" ? "opus" : config.outputFormat;
		let audioBuffer = result.buffer;
		if (result.actualFormat !== format) {
			const inputName = `input.${result.actualFormat}`;
			const inputFile = result.audioPath ?? path.join(temp.dir, inputName);
			if (!result.audioPath) await temp.write(inputName, result.buffer);
			audioBuffer = await convertAudio(inputFile, temp.dir, format);
		}
		return {
			audioBuffer,
			outputFormat: format
		};
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
			const result = await synthesizeCli(req, req.target === "voice-note" ? "voice-note" : "audio-file");
			return {
				...result,
				fileExtension: result.outputFormat === "opus" ? ".ogg" : `.${result.outputFormat}`,
				voiceCompatible: req.target === "voice-note" && result.outputFormat === "opus"
			};
		},
		async synthesizeTelephony(req) {
			return {
				...await synthesizeCli(req, "telephony"),
				sampleRate: 16e3
			};
		}
	};
}
//#endregion
//#region extensions/tts-local-cli/capability-catalog.ts
var capability_catalog_default = { speechProviders: [buildCliSpeechProvider()] };
//#endregion
export { capability_catalog_default as default };
