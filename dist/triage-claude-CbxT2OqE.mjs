import { a as runUtf8CommandWithTimeout } from "./exec-shcN2-sN.mjs";
//#region src/commands/triage-claude.ts
async function probeClaudeSafeMode(params) {
	try {
		const help = await runUtf8CommandWithTimeout([...params.argv, "--help"], {
			env: params.env,
			...params.cwd ? { cwd: params.cwd } : {},
			timeoutMs: 1e4,
			killProcessTree: true,
			outputCapture: "tail",
			maxOutputBytes: 65536
		});
		return {
			ok: true,
			supported: help.termination === "exit" && help.code === 0 && `${help.stdout}\n${help.stderr}`.includes("--safe-mode")
		};
	} catch (error) {
		return {
			ok: false,
			error
		};
	}
}
//#endregion
export { probeClaudeSafeMode };
