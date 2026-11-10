import { t as createSubsystemLogger } from "./subsystem-mStysHHC.mjs";
import { A as withTimeout } from "./fs-safe-6Z4UiMS4.mjs";
import { r as createLazyRuntimeModule } from "./lazy-runtime-CJrzFzqU.mjs";
import "./runtime-env-BMLaJD4Z.mjs";
import "./time-runtime-D6GzEQJ4.mjs";
import { r as parseClaudeCodeVersion, s as supportsClaudeDynamicSystemPromptSections } from "./cli-shared-Bxgc-sAm.mjs";
import { t as resolveClaudeTerminalExecutable } from "./session-catalog-executable-B1_WSP_7.mjs";
//#region extensions/anthropic/cli-version.ts
const log = createSubsystemLogger("anthropic-cli-version");
/** Share one lazy discovery result between native CLI capabilities and OAuth identity. */
function createClaudeCodeVersionProbe(api) {
	let installedVersion;
	const resolveVersion = createLazyRuntimeModule(async () => {
		try {
			const executable = resolveClaudeTerminalExecutable(process.env, { pathStrategy: "direct" });
			if (!executable) {
				log.warn("Claude Code version probe: executable-missing; OAuth requests keep the built-in version floor");
				return;
			}
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
			if (result.code !== 0 || result.outputLimitExceeded) {
				log.warn("Claude Code version probe: command-failed; OAuth requests keep the built-in version floor");
				return;
			}
			installedVersion = parseClaudeCodeVersion(result.stdout);
			if (!installedVersion) log.warn("Claude Code version probe: unparseable-output; OAuth requests keep the built-in version floor");
			return installedVersion;
		} catch {
			log.warn("Claude Code version probe: probe-error; OAuth requests keep the built-in version floor");
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
