import { c as DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES, d as DEFAULT_LLAMA_CPP_MODEL_REVISION, f as DEFAULT_LLAMA_CPP_MODEL_SHA256, l as DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE, m as DEFAULT_LLAMA_CPP_MODEL_URI, p as DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES, u as DEFAULT_LLAMA_CPP_MODEL_ID, w as resolveLlamaCppDataDir, y as buildLlamaCppModel } from "./defaults-DX4XN2j1.mjs";
import path from "node:path";
import os from "node:os";
import fs from "node:fs/promises";
import { execFile } from "node:child_process";
//#region extensions/llama-cpp/src/llama-server-assets.ts
const LLAMA_SERVER_RELEASE = "b10809";
const LLAMA_SERVER_BUILD = 10809;
const LLAMA_SERVER_COMMIT = "5266f24da75dc449bd56cbed7addb9c8e4a6a73e";
const MEBIBYTE = 1048576;
const CUDA_ARCHIVE_LIMITS = {
	maxArchiveBytes: 400 * MEBIBYTE,
	maxExtractedBytes: 600 * MEBIBYTE,
	maxEntryBytes: 521 * MEBIBYTE
};
const WINDOWS_X64_VC_RUNTIME = {
	archive: "vc-redist",
	name: "VC_redist.x64.exe",
	url: "https://download.visualstudio.microsoft.com/download/pr/ebdab8e5-1d7b-4d9f-a11b-cbb1720c3b12/843068991DAAA1F73AD9F6239BCE4D0F6A07A51F18C37EA2A867E9BECA71295C/VC_redist.x64.exe",
	sha256: "843068991daaa1f73ad9f6239bce4d0f6a07a51f18c37ea2a867e9beca71295c",
	size: 18731856,
	containerOffset: 63e4,
	containerSize: 18091661,
	nestedCabinet: "a4",
	files: [
		{
			source: "msvcp140.dll_amd64",
			target: "msvcp140.dll"
		},
		{
			source: "vcruntime140.dll_amd64",
			target: "vcruntime140.dll"
		},
		{
			source: "vcruntime140_1.dll_amd64",
			target: "vcruntime140_1.dll"
		}
	]
};
const WINDOWS_ARM64_VC_RUNTIME = {
	archive: "vc-redist",
	name: "VC_redist.arm64.exe",
	url: "https://download.visualstudio.microsoft.com/download/pr/ece44298-3977-4f73-ab91-c13fe79cfea8/B70EF586669A620A0A30A1156969C05C6A3831DC8F8BC992DA75779D2A92F944/VC_redist.arm64.exe",
	sha256: "b70ef586669a620a0a30a1156969c05c6a3831dc8f8bc992da75779d2a92f944",
	size: 11870816,
	containerOffset: 684112,
	containerSize: 11176508,
	nestedCabinet: "a1",
	files: [{
		source: "msvcp140.dll_arm64",
		target: "msvcp140.dll"
	}, {
		source: "vcruntime140.dll_arm64",
		target: "vcruntime140.dll"
	}]
};
const MACOS_ALIASES = [
	["libggml-rpc.0.23.0.dylib", ["libggml-rpc.0.dylib", "libggml-rpc.dylib"]],
	["libllama.0.4.0.dylib", ["libllama.0.dylib", "libllama.dylib"]],
	["libmtmd.0.4.0.dylib", ["libmtmd.0.dylib", "libmtmd.dylib"]],
	["libggml.0.23.0.dylib", ["libggml.0.dylib", "libggml.dylib"]],
	["libggml-base.0.23.0.dylib", ["libggml-base.0.dylib", "libggml-base.dylib"]],
	["libggml-blas.0.23.0.dylib", ["libggml-blas.0.dylib", "libggml-blas.dylib"]],
	["libllama-common.0.4.0.dylib", ["libllama-common.0.dylib", "libllama-common.dylib"]],
	["libggml-cpu.0.23.0.dylib", ["libggml-cpu.0.dylib", "libggml-cpu.dylib"]]
];
const MACOS_METAL_ALIASES = [...MACOS_ALIASES, ["libggml-metal.0.23.0.dylib", ["libggml-metal.0.dylib", "libggml-metal.dylib"]]];
const LINUX_ALIASES = [
	["libllama.so.0.4.0", ["libllama.so.0", "libllama.so"]],
	["libggml.so.0.23.0", ["libggml.so.0", "libggml.so"]],
	["libmtmd.so.0.4.0", ["libmtmd.so.0", "libmtmd.so"]],
	["libggml-base.so.0.23.0", ["libggml-base.so.0", "libggml-base.so"]],
	["libllama-common.so.0.4.0", ["libllama-common.so.0", "libllama-common.so"]]
];
const LLAMA_SERVER_ASSETS = [
	{
		platform: "darwin",
		arch: "arm64",
		backend: "metal",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-arm64.tar.gz`,
		sha256: "7d692df9e1e386e62f1c12b843903218041e6cd74c9415aa39a7ed3176f9eaa2",
		sizeBytes: 11123196,
		executable: "llama-server",
		regularFileAliases: MACOS_METAL_ALIASES
	},
	{
		platform: "darwin",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-macos-x64.tar.gz`,
		sha256: "13b34aa8a5d87341a21065a83f54a8167e1aaa6fe0d66065de01632a1ed64be6",
		sizeBytes: 11175330,
		executable: "llama-server",
		regularFileAliases: MACOS_ALIASES
	},
	{
		platform: "linux",
		arch: "arm64",
		backend: "cpu",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-arm64.tar.gz`,
		sha256: "f2b7333971e1b7b42e9268bfdbfa30f5f56e2897156084d2251385df94aec358",
		sizeBytes: 13380118,
		executable: "llama-server",
		regularFileAliases: LINUX_ALIASES
	},
	{
		platform: "linux",
		arch: "x64",
		backend: "cpu",
		archive: "tar.gz",
		archiveRoot: `llama-${LLAMA_SERVER_RELEASE}`,
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-ubuntu-x64.tar.gz`,
		sha256: "5e34434ddc6d03cd1584f403201aff0d4bd1a5793a72ff7e286532dfd1e4b941",
		sizeBytes: 16734586,
		executable: "llama-server",
		regularFileAliases: LINUX_ALIASES
	},
	{
		platform: "win32",
		arch: "x64",
		backend: "cuda",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cuda-12.4-x64.zip`,
		sha256: "c77bfcd9ed8d91e8721a2d6a290b907fddd4fa5412a47b21c6fa1709116b85f9",
		sizeBytes: 253938543,
		executable: "llama-server.exe",
		regularFileAliases: [],
		limits: CUDA_ARCHIVE_LIMITS,
		dependencies: [{
			archive: "zip",
			archiveRoot: ".",
			name: "cudart-llama-bin-win-cuda-12.4-x64.zip",
			sha256: "8c79a9b226de4b3cacfd1f83d24f962d0773be79f1e7b75c6af4ded7e32ae1d6",
			sizeBytes: 391443627,
			regularFileAliases: [],
			files: [
				"cublas64_12.dll",
				"cublasLt64_12.dll",
				"cudart64_12.dll"
			],
			limits: {
				...CUDA_ARCHIVE_LIMITS,
				maxEntries: 3
			}
		}, WINDOWS_X64_VC_RUNTIME]
	},
	{
		platform: "win32",
		arch: "arm64",
		backend: "cpu",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-arm64.zip`,
		sha256: "c1058fe5764a687275c8d20d6bbc1454e787cdbb8ebb8c37a2f959f2b144dc77",
		sizeBytes: 11974499,
		executable: "llama-server.exe",
		regularFileAliases: [],
		dependencies: [WINDOWS_ARM64_VC_RUNTIME]
	},
	{
		platform: "win32",
		arch: "x64",
		backend: "cpu",
		archive: "zip",
		archiveRoot: ".",
		name: `llama-${LLAMA_SERVER_RELEASE}-bin-win-cpu-x64.zip`,
		sha256: "9df3158ed228a641a4b127942d7f459f24c9e13f04682659d05c00c80099b6b5",
		sizeBytes: 18407457,
		executable: "llama-server.exe",
		regularFileAliases: [],
		dependencies: [WINDOWS_X64_VC_RUNTIME]
	}
];
function selectLlamaServerAsset(platform = process.platform, arch = process.arch, acceleration) {
	const backend = acceleration?.kind ?? (platform === "darwin" && arch === "arm64" ? "metal" : "cpu");
	if (backend === "cuda" && acceleration?.kind === "cuda") {
		if (platform !== "win32" || arch !== "x64") throw new Error(`No verified CUDA llama-server ${LLAMA_SERVER_RELEASE} build is available for ${platform}/${arch}. Install a CUDA-enabled llama-server manually and configure its absolute path, or explicitly choose CPU setup.`);
		if (!(acceleration.devices.length > 0 && acceleration.devices.every((device) => {
			const version = /^(\d+)\.(\d+)(?:\.\d+)?$/u.exec(device.driverVersion);
			return version && (Number(version[1]) > 551 || Number(version[1]) === 551 && Number(version[2]) >= 78) && (device.computeCapability === void 0 || device.computeCapability >= 5);
		}))) throw new Error("The verified CUDA 12.4 build requires NVIDIA driver 551.78 or newer and compute capability 5.0 or newer. Update the NVIDIA driver, configure a compatible llama-server manually, or explicitly choose CPU setup.");
	}
	const asset = LLAMA_SERVER_ASSETS.find((candidate) => candidate.platform === platform && candidate.arch === arch && candidate.backend === backend);
	if (!asset) throw new Error(`No verified llama-server ${LLAMA_SERVER_RELEASE} build is available for ${platform}/${arch}. Install a compatible llama-server manually, then rerun llama.cpp setup with its absolute path.`);
	return asset;
}
function resolveManagedLlamaServerPaths(asset = selectLlamaServerAsset()) {
	const installDir = path.join(resolveLlamaCppDataDir(), LLAMA_SERVER_RELEASE, `${asset.platform}-${asset.arch}${asset.backend === "cuda" ? "-cuda-12.4" : ""}`);
	return {
		installDir,
		command: path.join(installDir, asset.executable),
		presetPath: path.join(resolveLlamaCppDataDir(), "models.ini")
	};
}
function findManagedLlamaServerAsset(command, platform = process.platform, arch = process.arch) {
	return LLAMA_SERVER_ASSETS.find((asset) => asset.platform === platform && asset.arch === arch && resolveManagedLlamaServerPaths(asset).command === command);
}
//#endregion
//#region extensions/llama-cpp/src/hardware.ts
const GIB$2 = 1024 ** 3;
const MIB = 1024 ** 2;
async function runHardwareProbe(command, args, signal) {
	try {
		return await new Promise((resolve, reject) => {
			execFile(command, args, {
				encoding: "utf8",
				timeout: 3e3,
				maxBuffer: 65536,
				signal
			}, (error, stdout) => error ? reject(error) : resolve(stdout));
		});
	} catch {
		signal?.throwIfAborted();
		return;
	}
}
async function readAvailableMemory(platform, signal) {
	if (platform === "linux") {
		const meminfo = await fs.readFile("/proc/meminfo", "utf8").catch(() => "");
		const available = /^MemAvailable:\s+(\d+)\s+kB$/mu.exec(meminfo)?.[1];
		if (available) return Number(available) * 1024;
	}
	if (platform === "darwin") {
		const vmstat = await runHardwareProbe("/usr/bin/vm_stat", [], signal);
		const pageSize = /page size of (\d+) bytes/u.exec(vmstat ?? "")?.[1];
		const free = /^Pages free:\s+(\d+)\./mu.exec(vmstat ?? "")?.[1];
		const inactive = /^Pages inactive:\s+(\d+)\./mu.exec(vmstat ?? "")?.[1];
		if (pageSize && free && inactive) return (Number(free) + Number(inactive)) * Number(pageSize);
	}
	return os.freemem();
}
async function readAvailableDisk(cacheDir, platform, signal) {
	let directory = path.resolve(cacheDir);
	while (true) try {
		const [capacity, stat] = await Promise.all([fs.statfs(directory), fs.stat(directory)]);
		let capacityGroup = `device:${stat.dev}`;
		if (platform === "linux" && ![
			61267,
			1481003842,
			4076150800
		].includes(capacity.type)) capacityGroup = void 0;
		if (platform === "darwin") {
			const disk = /^\/dev\/(disk\d+(?:s\d+)*)\s/mu.exec(await runHardwareProbe("/bin/df", ["-P", directory], signal) ?? "")?.[1];
			const info = disk ? await runHardwareProbe("/usr/sbin/diskutil", [
				"info",
				"-plist",
				disk
			], signal) : void 0;
			const container = /<key>APFSContainerReference<\/key>\s*<string>(disk\d+)<\/string>/u.exec(info ?? "")?.[1];
			const filesystem = /<key>FilesystemType<\/key>\s*<string>([^<]+)<\/string>/u.exec(info ?? "")?.[1];
			capacityGroup = container ? `apfs:${container}` : filesystem && filesystem !== "apfs" ? capacityGroup : void 0;
		}
		return {
			availableBytes: capacity.bavail * capacity.bsize,
			capacityGroup
		};
	} catch (error) {
		signal?.throwIfAborted();
		const code = error instanceof Error && "code" in error ? error.code : void 0;
		const parent = path.dirname(directory);
		if (code !== "ENOENT" && code !== "ENOTDIR" || parent === directory) return;
		directory = parent;
	}
}
async function readAccelerator(platform, arch, signal) {
	if (platform === "darwin" && arch === "arm64") return { kind: "metal" };
	if (platform !== "linux" && platform !== "win32") return {
		kind: "cpu",
		reason: "No managed GPU backend is available for this host."
	};
	const devices = ((await runHardwareProbe("nvidia-smi", ["--query-gpu=name,memory.total,memory.free,driver_version,compute_cap", "--format=csv,noheader,nounits"], signal))?.trim().split(/\r?\n/u) ?? []).slice(0, 32).flatMap((line) => {
		const fields = line.split(",").map((field) => field.trim());
		const [total, available, driverVersion, compute] = fields.slice(-4);
		const name = fields.slice(0, -4).join(", ");
		const totalMemoryBytes = Number(total) * MIB;
		const availableMemoryBytes = Number(available) * MIB;
		const computeCapability = Number(compute);
		if (!name || !driverVersion || !/^\d+(?:\.\d+)+$/u.test(driverVersion) || !Number.isFinite(totalMemoryBytes) || !Number.isFinite(availableMemoryBytes) || totalMemoryBytes <= 0 || availableMemoryBytes < 0 || availableMemoryBytes > totalMemoryBytes) return [];
		return [{
			name,
			totalMemoryBytes,
			availableMemoryBytes,
			driverVersion,
			...Number.isFinite(computeCapability) && computeCapability > 0 ? { computeCapability } : {}
		}];
	});
	return devices.length > 0 ? {
		kind: "cuda",
		devices
	} : {
		kind: "cpu",
		reason: "nvidia-smi did not report a usable NVIDIA GPU."
	};
}
/** Read the Gateway host once during setup; never probe on inference requests. */
async function detectLlamaCppHardware(params) {
	params.signal?.throwIfAborted();
	const platform = os.platform();
	const arch = os.arch();
	const hostMemoryBytes = os.totalmem();
	const constrainedMemory = process.constrainedMemory();
	const constrained = constrainedMemory > 0 && constrainedMemory < hostMemoryBytes;
	const totalMemoryBytes = constrained ? constrainedMemory : hostMemoryBytes;
	const [availableMemory, modelDisk, runtimeDisk, accelerator] = await Promise.all([
		readAvailableMemory(platform, params.signal),
		readAvailableDisk(params.cacheDir, platform, params.signal),
		readAvailableDisk(resolveLlamaCppDataDir(), platform, params.signal),
		readAccelerator(platform, arch, params.signal)
	]);
	params.signal?.throwIfAborted();
	return {
		platform,
		arch,
		totalMemoryBytes,
		availableMemoryBytes: Math.min(totalMemoryBytes, availableMemory, constrained ? process.availableMemory() : totalMemoryBytes),
		availableDiskBytes: modelDisk?.availableBytes,
		availableRuntimeDiskBytes: runtimeDisk?.availableBytes,
		sharedDisk: !modelDisk?.capacityGroup || !runtimeDisk?.capacityGroup || modelDisk.capacityGroup === runtimeDisk.capacityGroup,
		accelerator
	};
}
function formatLlamaCppMemory(bytes) {
	return `${(bytes / GIB$2).toFixed(1).replace(/\.0$/u, "")} GiB`;
}
//#endregion
//#region extensions/llama-cpp/src/model-catalog.ts
const GIB$1 = 1024 ** 3;
function modelRecipe(params) {
	const source = params.source ?? `hf:${params.repository}/${params.file}#${params.revision}`;
	return {
		model: buildLlamaCppModel({
			...params,
			source
		}),
		sizeBytes: params.sizeBytes,
		memoryBytes: params.memoryGiB * GIB$1,
		minimumSystemMemoryBytes: params.minimumSystemGiB * GIB$1,
		requiresAcceleration: params.requiresAcceleration ?? false,
		artifact: {
			fileName: params.cacheFile ?? `hf_${params.repository.replaceAll("/", "_")}_${params.revision}_${params.file}`,
			url: `https://huggingface.co/${params.repository}/resolve/${params.revision}/${params.file}?download=true`,
			expectedSize: params.sizeBytes,
			expectedSha256: params.sha256
		}
	};
}
const LLAMA_CPP_MODEL_RECIPES = [
	modelRecipe({
		id: "qwen3.8-27b-ud-q4_k_m",
		name: "Qwen3.8 27B (UD-Q4_K_M)",
		repository: "unsloth/Qwen3.8-27B-GGUF",
		file: "Qwen3.8-27B-UD-Q4_K_M.gguf",
		revision: "4ca720788d1e01f1bff70c033e0d0028fd02e502",
		sha256: "322e194ff79741c7baa497c240f677f54b201b0efab44ca8e50f122b39123482",
		sizeBytes: 16464440224,
		memoryGiB: 22,
		minimumSystemGiB: 32,
		requiresAcceleration: true,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "muse-glimmer-30b-q4_k_m",
		name: "Muse Glimmer 30B (Q4_K_M)",
		repository: "meta-models/Muse-Glimmer-30B-GGUF",
		file: "Muse-Glimmer-30B-KQuant-17GB-Q4_K_M.gguf",
		revision: "70bf1b61ac09f91b24d39038091b41c582bc5d7a",
		sha256: "4cc57c0f51040a226e5a72cc47b7613f7772950e460a665f7083de89f183f60e",
		sizeBytes: 16756683904,
		memoryGiB: 20,
		minimumSystemGiB: 32,
		requiresAcceleration: true,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "gemma-4-26b-a4b-it-ud-q4_k_m",
		name: "Gemma 4 26B A4B (UD-Q4_K_M)",
		repository: "unsloth/gemma-4-26B-A4B-it-GGUF",
		file: "gemma-4-26B-A4B-it-UD-Q4_K_M.gguf",
		revision: "c099eb48e663fd284577b04978a94ffccb261841",
		sha256: "f2c28b3dc4776931ac6f879e11f203dec637ea0f14267a86ec8f6165f63f293f",
		sizeBytes: 16947541728,
		memoryGiB: 22,
		minimumSystemGiB: 32,
		requiresAcceleration: true
	}),
	modelRecipe({
		id: "gemma-4-12b-it-q4_k_m",
		name: "Gemma 4 12B (Q4_K_M)",
		repository: "unsloth/gemma-4-12b-it-GGUF",
		file: "gemma-4-12b-it-Q4_K_M.gguf",
		revision: "fc034cfff751157913579611efad8462ac1be606",
		sha256: "0a270ec9fe6b34f4a0d33992b6135117b484ebc4766ab76b51d4ae8c457e4c42",
		sizeBytes: 7121861440,
		memoryGiB: 12,
		minimumSystemGiB: 24,
		requiresAcceleration: true,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "qwen3.5-9b-q4_k_m",
		name: "Qwen3.5 9B (Q4_K_M)",
		repository: "unsloth/Qwen3.5-9B-GGUF",
		file: "Qwen3.5-9B-Q4_K_M.gguf",
		revision: "3885219b6810b007914f3a7950a8d1b469d598a5",
		sha256: "03b74727a860a56338e042c4420bb3f04b2fec5734175f4cb9fa853daf52b7e8",
		sizeBytes: 5680522464,
		memoryGiB: 10,
		minimumSystemGiB: 16,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: DEFAULT_LLAMA_CPP_MODEL_ID,
		name: "Gemma 4 E4B (Q4_K_M)",
		repository: "unsloth/gemma-4-E4B-it-GGUF",
		file: "gemma-4-E4B-it-Q4_K_M.gguf",
		revision: DEFAULT_LLAMA_CPP_MODEL_REVISION,
		sha256: DEFAULT_LLAMA_CPP_MODEL_SHA256,
		sizeBytes: DEFAULT_LLAMA_CPP_MODEL_SIZE_BYTES,
		memoryGiB: 10,
		minimumSystemGiB: 16,
		source: DEFAULT_LLAMA_CPP_MODEL_URI,
		cacheFile: DEFAULT_LLAMA_CPP_MODEL_CACHE_FILE
	}),
	modelRecipe({
		id: "qwen3.5-4b-q4_k_m",
		name: "Qwen3.5 4B (Q4_K_M)",
		repository: "unsloth/Qwen3.5-4B-GGUF",
		file: "Qwen3.5-4B-Q4_K_M.gguf",
		revision: "e87f176479d0855a907a41277aca2f8ee7a09523",
		sha256: "00fe7986ff5f6b463e62455821146049db6f9313603938a70800d1fb69ef11a4",
		sizeBytes: 2740937888,
		memoryGiB: 6,
		minimumSystemGiB: 8,
		reasoning: true,
		maxTokens: 16384
	}),
	modelRecipe({
		id: "gemma-4-e2b-it-q4_k_m",
		name: "Gemma 4 E2B (Q4_K_M)",
		repository: "unsloth/gemma-4-E2B-it-GGUF",
		file: "gemma-4-E2B-it-Q4_K_M.gguf",
		revision: "0314792d7f1f7e229411f620751375812bb9faf2",
		sha256: "740185b21d22ceb83a11c3aa62ad5842ef32c70f6096d756bbee85a1e4ec34b8",
		sizeBytes: 3106738272,
		memoryGiB: 6,
		minimumSystemGiB: 8
	})
];
function resolveLlamaCppCatalogArtifact(source) {
	return LLAMA_CPP_MODEL_RECIPES.find((recipe) => recipe.model.params?.modelPath === source)?.artifact;
}
function resolveLlamaCppMemoryBudget(hardware, backend) {
	const systemBudget = Math.min(hardware.availableMemoryBytes, hardware.totalMemoryBytes - Math.max(2 * GIB$1, hardware.totalMemoryBytes * .25));
	const gpuBudget = hardware.accelerator.kind === "cuda" ? Math.max(0, ...hardware.accelerator.devices.map((device) => Math.min(device.availableMemoryBytes, device.totalMemoryBytes - Math.max(GIB$1, device.totalMemoryBytes * .1)))) : 0;
	return Math.max(0, backend === "cuda" ? Math.min(systemBudget, gpuBudget) : systemBudget);
}
function resolveLlamaCppModelCandidates(hardware, backend) {
	const memoryBudgetBytes = resolveLlamaCppMemoryBudget(hardware, backend);
	return {
		recipes: LLAMA_CPP_MODEL_RECIPES.filter((recipe) => (!recipe.requiresAcceleration || backend !== "cpu") && hardware.totalMemoryBytes >= recipe.minimumSystemMemoryBytes && memoryBudgetBytes >= recipe.memoryBytes),
		memoryBudgetBytes
	};
}
function resolveLlamaCppDiskBudget(hardware, backend, runtimeCached = false) {
	if (hardware.availableDiskBytes === void 0 || hardware.availableRuntimeDiskBytes === void 0) return {
		kind: "unavailable",
		reason: "Cannot measure free space in the model cache or runtime directory. Check their permissions and retry setup."
	};
	const runtimeDiskBytes = runtimeCached ? 0 : (backend === "cuda" ? 3 : 2) * GIB$1;
	if (!hardware.sharedDisk && hardware.availableRuntimeDiskBytes < runtimeDiskBytes) return {
		kind: "unavailable",
		reason: "There is not enough free disk space in the runtime directory. Free space on that volume and retry setup."
	};
	return {
		kind: "available",
		modelDiskBudget: hardware.sharedDisk ? Math.min(hardware.availableDiskBytes, hardware.availableRuntimeDiskBytes) - runtimeDiskBytes : hardware.availableDiskBytes,
		runtimeDiskBytes
	};
}
function recommendLlamaCppModel(hardware, backend, cached = {}) {
	const disk = resolveLlamaCppDiskBudget(hardware, backend, cached.runtime);
	if (disk.kind === "unavailable") return disk;
	const { modelDiskBudget, runtimeDiskBytes } = disk;
	const { recipes: candidates, memoryBudgetBytes } = resolveLlamaCppModelCandidates(hardware, backend);
	for (const recipe of candidates) {
		const modelDiskBytes = (cached.modelIds?.has(recipe.model.id) ? 0 : recipe.sizeBytes) + (cached.embedding ? 0 : DEFAULT_LLAMA_CPP_EMBEDDING_MODEL_SIZE_BYTES);
		if (modelDiskBudget < modelDiskBytes) continue;
		const placement = backend === "metal" ? "Metal unified memory" : backend === "cuda" ? "NVIDIA GPU memory" : "CPU memory";
		return {
			kind: "recommended",
			recipe,
			memoryBudgetBytes,
			requiredDiskBytes: modelDiskBytes + runtimeDiskBytes,
			reason: `${recipe.model.name} fits the ${formatLlamaCppMemory(memoryBudgetBytes)} ${placement} budget with a 64K context. Runtime verification checks the actual model before activation.`
		};
	}
	return {
		kind: "unavailable",
		reason: candidates.length > 0 ? "There is not enough free disk space for a recommended model, embeddings, and the runtime. Free space in the model cache and retry setup." : `No recommended model fits the current ${formatLlamaCppMemory(Math.max(0, memoryBudgetBytes))} memory budget. Close other applications and retry, or configure an existing GGUF or external server. For local memory search without a chat model, an embedding-only local server (about 0.3 GB for the default embedding model) can fit instead. Set memory.search.provider to "local" with openclaw config set memory.search.provider local, then re-run openclaw models auth login --provider llama-cpp --method local using the same profile for both commands.`
	};
}
//#endregion
//#region extensions/llama-cpp/src/media-catalog.ts
const GIB = 1024 ** 3;
function artifact(repository, revision, filename, expectedSize, expectedSha256) {
	return {
		repository,
		revision,
		filename,
		source: `hf:${repository}/${filename}#${revision}`,
		fileName: `hf_${repository.replaceAll("/", "_")}_${revision}_${filename}`,
		url: `https://huggingface.co/${repository}/resolve/${revision}/${filename}?download=true`,
		expectedSize,
		expectedSha256
	};
}
const GLM_OCR_REPOSITORY = "ggml-org/GLM-OCR-GGUF";
const GLM_OCR_REVISION = "65a42de1148dbed2297e922b5dbc7d9b70c36578";
const SMOL_VLM2_REPOSITORY = "ggml-org/SmolVLM2-2.2B-Instruct-GGUF";
const SMOL_VLM2_REVISION = "1bc3c9f74ceafd4c8d4411cc9cf188bba3798f91";
const LLAMA_CPP_MEDIA_RECIPES = [{
	id: "glm-ocr-q8_0",
	name: "GLM-OCR (Q8_0)",
	capability: "ocr",
	model: artifact(GLM_OCR_REPOSITORY, GLM_OCR_REVISION, "GLM-OCR-Q8_0.gguf", 950433408, "45bc244a6446aff850521dc41f18bc8d7105ad5f0c2c8c28af04e7cc4f4d50b1"),
	projector: artifact(GLM_OCR_REPOSITORY, GLM_OCR_REVISION, "mmproj-GLM-OCR-Q8_0.gguf", 484403648, "9c4b58e33e316ed142eb5dcb41abec3844d3e6e5dc361ffb782c3fa9d175141f"),
	minimumSystemMemoryBytes: 6 * GIB,
	memoryBytes: 4 * GIB,
	contextSize: 8192,
	maxTokens: 4096,
	imageMaxTokens: 1024,
	prompt: "Text Recognition:",
	limitations: [
		"Recognizes text; use the vision model for scenes, charts, and spatial questions.",
		"Dense or multi-column pages may need separate crops; no document layout detector is installed.",
		"Image encoding is limited to 1024 tokens (about 0.8 megapixels); small text may lose detail."
	]
}, {
	id: "smolvlm2-2.2b-instruct-q4_k_m",
	name: "SmolVLM2 2.2B (Q4_K_M)",
	capability: "vision",
	model: artifact(SMOL_VLM2_REPOSITORY, SMOL_VLM2_REVISION, "SmolVLM2-2.2B-Instruct-Q4_K_M.gguf", 1112602656, "0cf76814555b8665149075b74ab6b5c1d428ea1d3d01c1918c12012e8d7c9f58"),
	projector: artifact(SMOL_VLM2_REPOSITORY, SMOL_VLM2_REVISION, "mmproj-SmolVLM2-2.2B-Instruct-Q8_0.gguf", 592523200, "ae07ea1facd07dd3230c4483b63e8cda96c6944ad2481f33d531f79e892dd024"),
	minimumSystemMemoryBytes: 6 * GIB,
	memoryBytes: 5 * GIB,
	contextSize: 8192,
	maxTokens: 2048,
	imageMaxTokens: 1024,
	limitations: ["Small English-focused vision model; complex diagrams and spatial reasoning may be inaccurate."]
}];
function resolveLlamaCppMediaArtifact(source) {
	for (const recipe of LLAMA_CPP_MEDIA_RECIPES) for (const value of [recipe.model, recipe.projector]) if (value.source === source) return value;
}
function recommendLlamaCppMedia(hardware, cached = {}) {
	const unavailable = (reason) => ({
		kind: "unavailable",
		reason
	});
	const memoryBudgetBytes = resolveLlamaCppMemoryBudget(hardware, "cpu");
	const rejections = [];
	for (const recipe of LLAMA_CPP_MEDIA_RECIPES) {
		if (hardware.totalMemoryBytes < recipe.minimumSystemMemoryBytes) rejections.push(`${recipe.name} requires ${formatLlamaCppMemory(recipe.minimumSystemMemoryBytes)} total RAM; host has ${formatLlamaCppMemory(hardware.totalMemoryBytes)}.`);
		if (memoryBudgetBytes < recipe.memoryBytes) rejections.push(`${recipe.name} requires ${formatLlamaCppMemory(recipe.memoryBytes)} memory; the system memory budget is ${formatLlamaCppMemory(memoryBudgetBytes)} after host headroom and current memory pressure.`);
	}
	if (rejections.length > 0) return unavailable(`${rejections.join(" ")} Close other applications or use a host with more memory and retry setup.`);
	const disk = resolveLlamaCppDiskBudget(hardware, "cpu", cached.runtime);
	if (disk.kind === "unavailable") return unavailable(disk.reason);
	const { modelDiskBudget, runtimeDiskBytes } = disk;
	const [ocr, vision] = LLAMA_CPP_MEDIA_RECIPES;
	const modelDiskBytes = [
		ocr.model,
		ocr.projector,
		vision.model,
		vision.projector
	].reduce((bytes, item) => bytes + (cached.artifactSha256?.has(item.expectedSha256) ? 0 : item.expectedSize), 0);
	if (modelDiskBytes > modelDiskBudget) return unavailable(`Missing OCR and vision models and projectors need ${formatLlamaCppMemory(modelDiskBytes)} disk space; ${formatLlamaCppMemory(Math.max(0, modelDiskBudget))} remains after the runtime reserve. Free space in the model cache and retry setup.`);
	return {
		kind: "recommended",
		ocr,
		vision,
		requiredDiskBytes: modelDiskBytes + runtimeDiskBytes,
		reason: `${ocr.name} (OCR, ${formatLlamaCppMemory(ocr.memoryBytes)}) and ${vision.name} (vision, ${formatLlamaCppMemory(vision.memoryBytes)}) fit the ${formatLlamaCppMemory(memoryBudgetBytes)} CPU memory budget. Load one model at a time, preserving the chat and embedding inventory. Images stay local; runtime verification must pass before activation.`
	};
}
//#endregion
export { resolveLlamaCppCatalogArtifact as a, formatLlamaCppMemory as c, LLAMA_SERVER_RELEASE as d, findManagedLlamaServerAsset as f, recommendLlamaCppModel as i, LLAMA_SERVER_BUILD as l, selectLlamaServerAsset as m, recommendLlamaCppMedia as n, resolveLlamaCppModelCandidates as o, resolveManagedLlamaServerPaths as p, resolveLlamaCppMediaArtifact as r, detectLlamaCppHardware as s, LLAMA_CPP_MEDIA_RECIPES as t, LLAMA_SERVER_COMMIT as u };
