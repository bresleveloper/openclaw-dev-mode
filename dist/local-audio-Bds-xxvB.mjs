import { i as getOrCreatePromise } from "./lazy-promise-DGqyc4Y4.mjs";
import { r as resolveEnvironmentValue } from "./process-env-DlZFJzq6.mjs";
import { d as pathExists } from "./fs-safe-BUXBSN-4.mjs";
import { n as runExec } from "./exec-DJvyCA0D.mjs";
import { a as resolveExecutableFromPathEnv } from "./executable-path-CP2HPhgU.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/media-understanding/local-audio.ts
const WHISPER_CPP_MODEL_DIRS = [
	"/opt/homebrew/share/whisper-cpp",
	"/usr/local/share/whisper-cpp",
	"/usr/share/whisper-cpp"
];
async function listDirectoryEntries(dirPath) {
	try {
		return await fs.readdir(dirPath);
	} catch {
		return [];
	}
}
/**
* Picks an installed ggml whisper.cpp model without hardcoding a filename.
* Larger models transcribe better, so prefer non-tiny when several exist;
* WHISPER_CPP_MODEL remains the explicit override.
*/
async function discoverWhisperCppModel(listDirectory) {
	for (const dir of WHISPER_CPP_MODEL_DIRS) {
		const models = (await listDirectory(dir)).filter((name) => name.startsWith("ggml-") && name.endsWith(".bin")).toSorted((a, b) => {
			return (a.includes("tiny") ? 1 : 0) - (b.includes("tiny") ? 1 : 0) || a.localeCompare(b);
		});
		if (models[0]) return path.join(dir, models[0]);
	}
	return null;
}
const libraryCache = /* @__PURE__ */ new Map();
const observedBackendCache = /* @__PURE__ */ new Map();
function commandId(command) {
	return path.basename(command.trim()).replace(/\.(?:exe|com|cmd|bat)$/i, "").toLowerCase();
}
function resolveRequestedLocalAudioBackend(params) {
	const command = commandId(params.command);
	if (command === "sherpa-onnx-offline") {
		const providerIndex = params.args.findIndex((arg) => arg === "--provider");
		return ((providerIndex >= 0 ? params.args[providerIndex + 1] : void 0) ?? params.args.find((arg) => arg.startsWith("--provider="))?.slice(11) ?? "cpu").trim().toLowerCase();
	}
	if (command === "whisper-cli") {
		if (params.args.includes("-ng") || params.args.includes("--no-gpu")) return "cpu";
		const deviceIndex = params.args.findIndex((arg) => arg === "-dev" || arg === "--device");
		const device = (deviceIndex >= 0 ? params.args[deviceIndex + 1] : void 0) ?? params.args.find((arg) => arg.startsWith("--device="))?.slice(9);
		return device?.trim() ? `device:${device.trim()}` : void 0;
	}
}
function observationKey(params) {
	return `${params.command.trim()}\0${resolveRequestedLocalAudioBackend(params) ?? "default"}`;
}
function recordLocalAudioBackendObservation(params) {
	if (commandId(params.command) !== "whisper-cli") return;
	const backend = /failed to initialize\s+(?:MTL\d+|Metal|CUDA\d*)\s+backend/i.test(params.output) ? "cpu" : /using\s+(?:MTL\d+|Metal)\s+backend/i.test(params.output) ? "metal" : /using\s+CUDA\d*\s+backend/i.test(params.output) ? "cuda" : /using\s+CPU\s+backend|no GPU found/i.test(params.output) ? "cpu" : void 0;
	if (backend) observedBackendCache.set(observationKey(params), backend);
	return backend;
}
function expandHomeDir(value, env) {
	const trimmed = value.trim().replace(/^"(.*)"$/, "$1");
	if (trimmed === "~") return env.HOME ?? trimmed;
	if (trimmed.startsWith("~/") || trimmed.startsWith("~\\")) return env.HOME ? `${env.HOME}${path.sep}${trimmed.slice(2)}` : trimmed;
	return trimmed;
}
async function inspectLinkedLibraries(filePath, platform) {
	const key = `${platform}\0${filePath}`;
	return await getOrCreatePromise(libraryCache, key, async () => {
		const command = platform === "darwin" ? "otool" : platform === "linux" ? "readelf" : null;
		if (!command) return null;
		try {
			const result = await runExec(command, platform === "darwin" ? ["-L", filePath] : ["-d", filePath], { timeoutMs: 1500 });
			return `${result.stdout}\n${result.stderr ?? ""}`;
		} catch {
			return null;
		}
	}, { cacheRejections: false });
}
async function inspectWhisperBackend(params) {
	const libraries = await params.libraries(params.command, params.platform);
	if (/(?:ggml[-_]?cuda|libcuda|libcudart)/i.test(libraries ?? "")) return {
		capableBackend: "cuda",
		evidence: "whisper-cli links a CUDA ggml runtime"
	};
	if (params.platform === "darwin" && params.arch === "arm64") {
		const realCommand = await params.realpath(params.command).catch(() => params.command);
		if (/(?:ggml[-_]?metal|Metal\.framework)/i.test(libraries ?? "") || /\/Cellar\/whisper-cpp\/[^/]+\/bin\/whisper-cli$/.test(realCommand)) return {
			capableBackend: "metal",
			evidence: "Apple Silicon Homebrew whisper-cpp runtime with Metal support"
		};
	}
	return { evidence: "whisper-cli backend cannot be proven without loading a model" };
}
function rank(candidate) {
	if (candidate.id === "whisper-cli" && (candidate.observedBackend === "metal" || candidate.observedBackend === "cuda")) return 0;
	if (candidate.id === "sherpa-onnx-offline") return 1;
	if (candidate.id === "whisper-cli") return 2;
	return candidate.id === "parakeet-mlx" ? 3 : 4;
}
async function inspectLocalAudioSelection(options = {}) {
	const env = options.env ?? process.env;
	const platform = options.platform ?? process.platform;
	const arch = options.arch ?? process.arch;
	const delimiter = process.platform === "win32" ? ";" : path.delimiter;
	const pathEntries = (resolveEnvironmentValue(env, "PATH") ?? "").split(delimiter).map((entry) => expandHomeDir(entry, env));
	const resolveBinary = async (name) => options.resolveBinary ? await options.resolveBinary(name, env) : resolveExecutableFromPathEnv(name, pathEntries, env) ?? null;
	const [parakeetCommand, whisperCommand, sherpaCommand, pythonCommand] = await Promise.all([
		"parakeet-mlx",
		"whisper-cli",
		"sherpa-onnx-offline",
		"whisper"
	].map(resolveBinary));
	const envModel = env.WHISPER_CPP_MODEL?.trim();
	const whisperModel = whisperCommand !== null ? envModel && await pathExists(envModel) ? envModel : await discoverWhisperCppModel(options.listDirectory ?? listDirectoryEntries) : null;
	const whisperReady = whisperCommand !== null && Boolean(whisperModel);
	const whisperBackend = whisperCommand ? await inspectWhisperBackend({
		command: whisperCommand,
		platform,
		arch,
		realpath: options.resolveRealpath ?? fs.realpath,
		libraries: options.inspectLinkedLibraries ?? inspectLinkedLibraries
	}) : { evidence: "whisper-cli command not found" };
	const sherpaDir = env.SHERPA_ONNX_MODEL_DIR?.trim();
	const sherpaFiles = sherpaDir ? [
		"tokens.txt",
		"encoder.onnx",
		"decoder.onnx",
		"joiner.onnx"
	].map((file) => path.join(sherpaDir, file)) : [];
	const sherpaReady = sherpaCommand !== null && sherpaFiles.length === 4 && (await Promise.all(sherpaFiles.map((file) => pathExists(file)))).every(Boolean);
	const parakeetReady = parakeetCommand !== null && platform === "darwin" && arch === "arm64";
	const parakeetArgs = [
		"{{AttachmentPath}}",
		"--output-format",
		"txt",
		"--output-dir",
		"{{OutputDir}}",
		"--output-template",
		"{filename}"
	];
	const whisperArgs = [
		"-m",
		whisperModel ?? "",
		"-otxt",
		"-of",
		"{{OutputBase}}",
		"-nt",
		"{{AttachmentPath}}"
	];
	const sherpaArgs = [
		`--tokens=${sherpaFiles[0]}`,
		`--encoder=${sherpaFiles[1]}`,
		`--decoder=${sherpaFiles[2]}`,
		`--joiner=${sherpaFiles[3]}`,
		"{{AttachmentPath}}"
	];
	const pythonArgs = [
		"--model",
		"turbo",
		"--output_format",
		"txt",
		"--output_dir",
		"{{OutputDir}}",
		"--verbose",
		"False",
		"{{AttachmentPath}}"
	];
	const candidates = [
		{
			id: "parakeet-mlx",
			resolvedCommand: parakeetCommand ?? void 0,
			ready: parakeetReady,
			capableBackend: parakeetReady ? "mlx" : void 0,
			evidence: parakeetReady ? "parakeet-mlx is an MLX runtime on Apple Silicon; device use is unobserved" : "parakeet-mlx acceleration is only supported on Apple Silicon",
			reason: parakeetReady ? void 0 : "unsupported platform for MLX acceleration",
			args: parakeetArgs
		},
		{
			id: "whisper-cli",
			resolvedCommand: whisperCommand ?? void 0,
			ready: whisperReady,
			...whisperBackend,
			requestedBackend: resolveRequestedLocalAudioBackend({
				command: "whisper-cli",
				args: whisperArgs
			}),
			observedBackend: whisperCommand ? observedBackendCache.get(observationKey({
				command: whisperCommand,
				args: whisperArgs
			})) : void 0,
			reason: whisperReady ? void 0 : "model file not found",
			args: whisperArgs
		},
		{
			id: "sherpa-onnx-offline",
			resolvedCommand: sherpaCommand ?? void 0,
			ready: sherpaReady,
			requestedBackend: "cpu",
			evidence: "OpenClaw auto args omit --provider, so sherpa-onnx uses its CPU default",
			reason: sherpaReady ? void 0 : "SHERPA_ONNX_MODEL_DIR is missing required model files",
			args: sherpaArgs
		},
		{
			id: "whisper",
			resolvedCommand: pythonCommand ?? void 0,
			ready: Boolean(pythonCommand),
			evidence: "Python Whisper chooses its runtime device when the model loads",
			reason: void 0,
			args: pythonArgs
		}
	].map(({ args, reason, ...candidate }) => Object.assign(candidate, {
		command: candidate.id,
		available: Boolean(candidate.resolvedCommand),
		selected: false,
		reason: candidate.resolvedCommand ? reason : "command not found",
		entry: candidate.ready ? {
			type: "cli",
			command: candidate.resolvedCommand,
			args
		} : void 0
	}));
	candidates.sort((left, right) => rank(left) - rank(right));
	const selected = candidates.find((candidate) => candidate.ready && candidate.entry);
	if (selected) selected.selected = true;
	return {
		candidates,
		entries: candidates.flatMap((candidate) => candidate.ready && candidate.entry ? [candidate.entry] : []),
		selected
	};
}
function formatLocalAudioSelection(selection) {
	const selected = selection.selected;
	if (!selected) return null;
	const describeBackend = (candidate) => [
		candidate.capableBackend ? `capable=${candidate.capableBackend}` : null,
		candidate.requestedBackend ? `requested=${candidate.requestedBackend}` : null,
		`observed=${candidate.observedBackend ?? "unknown"}`
	].filter(Boolean).join(", ");
	const fallbacks = selection.candidates.filter((candidate) => candidate.ready && candidate !== selected).map((candidate) => `${candidate.command} (${describeBackend(candidate)})`);
	return `${selected.command} (${describeBackend(selected)}); ${selected.evidence}${fallbacks.length > 0 ? `; fallbacks: ${fallbacks.join(", ")}` : ""}`;
}
//#endregion
export { resolveRequestedLocalAudioBackend as i, inspectLocalAudioSelection as n, recordLocalAudioBackendObservation as r, formatLocalAudioSelection as t };
