import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import { A as withTimeout } from "./fs-safe-BUXBSN-4.mjs";
import "./time-runtime-Bfsc2GHI.mjs";
import { r as parseClaudeCodeVersion, s as supportsClaudeDynamicSystemPromptSections } from "./cli-shared-BRgGWHFZ.mjs";
import { t as resolveClaudeTerminalExecutable } from "./session-catalog-executable-CCw_I-M0.mjs";
//#region extensions/anthropic/cli-version.ts
/** Share one lazy discovery result between native CLI capabilities and OAuth identity. */
function createClaudeCodeVersionProbe(api) {
	let installedVersion;
	const resolveVersion = createLazyRuntimeModule(async () => {
		try {
			const executable = resolveClaudeTerminalExecutable(process.env, { pathStrategy: "direct" });
			if (!executable) return;
			const result = await withTimeout(api.runtime.system.runCommandWithTimeout([executable.executable, "--version"], {
				timeoutMs: 1500,
				killProcessTree: true,
				killGraceMs: 100,
				maxOutputBytes: {
					stdout: 1024,
					stderr: 1024
				},
				terminateOnOutputLimit: true
			}), 1500);
			installedVersion = result.code === 0 && !result.outputLimitExceeded ? parseClaudeCodeVersion(result.stdout) : void 0;
			return installedVersion;
		} catch {
			return;
		}
	});
	return {
		resolveVersion,
		ensureDynamicSystemPromptSectionsSupport: async () => {
			await resolveVersion();
		},
		supportsDynamicSystemPromptSections: () => supportsClaudeDynamicSystemPromptSections(installedVersion)
	};
}
//#endregion
export { createClaudeCodeVersionProbe as t };
