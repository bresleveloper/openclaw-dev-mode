import { n as runExec } from "./exec-shcN2-sN.mjs";
import { n as isWSL2Sync } from "./wsl-BqZ6SFne.mjs";
import "./runtime-env-BaPIl5PP.mjs";
import "./process-runtime-BF3dUvYO.mjs";
import { access } from "node:fs/promises";
//#region extensions/ollama/src/wsl2-crash-loop-check.ts
const SYSTEMCTL_TIMEOUT_MS = 5e3;
const WSL_CUDA_MARKERS = [
	"/dev/dxg",
	"/usr/lib/wsl/lib/nvidia-smi",
	"/usr/lib/wsl/lib/libcuda.so.1",
	"/usr/local/cuda"
];
function parseSystemctlShowProperties(stdout) {
	const properties = /* @__PURE__ */ new Map();
	for (const line of stdout.split(/\r?\n/u)) {
		const separator = line.indexOf("=");
		if (separator <= 0) continue;
		properties.set(line.slice(0, separator), line.slice(separator + 1));
	}
	return properties;
}
async function isOllamaEnabledWithRestartAlways() {
	try {
		const { stdout } = await runExec("systemctl", [
			"show",
			"ollama.service",
			"--property=UnitFileState,Restart",
			"--no-pager"
		], {
			logOutput: false,
			timeoutMs: SYSTEMCTL_TIMEOUT_MS
		});
		const properties = parseSystemctlShowProperties(stdout);
		return properties.get("UnitFileState") === "enabled" && properties.get("Restart") === "always";
	} catch {
		return false;
	}
}
async function hasWslCuda() {
	for (const marker of WSL_CUDA_MARKERS) try {
		await access(marker);
		return true;
	} catch {}
	return false;
}
async function checkWsl2CrashLoopRisk(logger) {
	try {
		if (!isWSL2Sync()) return;
		if (!await isOllamaEnabledWithRestartAlways()) return;
		if (!await hasWslCuda()) return;
		logger.warn([
			"[ollama] WSL2 crash-loop risk: ollama.service is enabled with Restart=always and CUDA is visible.",
			"On WSL2, GPU-backed Ollama can pin host memory while loading a model.",
			"Hyper-V memory reclaim cannot always reclaim those pinned pages, so Windows can terminate and restart the WSL2 VM.",
			"",
			"Common evidence: repeated WSL2 reboots, high CPU in app.slice at startup, and SIGTERM from systemd rather than the Linux OOM killer.",
			"See: https://github.com/ollama/ollama/issues/11317",
			"",
			"Mitigation:",
			"  1. Disable autostart: sudo systemctl disable ollama",
			"  2. Add [experimental] autoMemoryReclaim=disabled to %USERPROFILE%\\.wslconfig on Windows, then run wsl --shutdown",
			"  3. Set OLLAMA_KEEP_ALIVE=5m in the Ollama service environment or start ollama serve manually when needed"
		].join("\n"));
	} catch {}
}
//#endregion
export { checkWsl2CrashLoopRisk };
