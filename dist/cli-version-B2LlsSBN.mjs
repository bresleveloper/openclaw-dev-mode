import { r as createLazyRuntimeModule } from "./lazy-runtime-BPNHa36e.mjs";
import { k as withTimeout } from "./fs-safe-BAPek8At.mjs";
import "./time-runtime-BNzd4jag.mjs";
import { r as parseClaudeCodeVersion, s as supportsClaudeDynamicSystemPromptSections } from "./cli-shared-BBdnRLY0.mjs";
import { t as resolveClaudeTerminalExecutable } from "./session-catalog-executable-BtzrAp2a.mjs";
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
