import { f as resolveManagedCodexNativeCommand, g as CODEX_APP_SERVER_VERSION, m as runCodexVersionCommand, s as parseCodexVersion, t as CODEX_VERSION_TIMEOUT_MS } from "./.setup/managed-binary-CN7ii1MZ.mjs";
import { t as codexNativeProfileRecoveryHealthCheck } from "./.setup/auth-profile-health-BVPZU9I8.mjs";
import { n as findCodexAppServerSpawnError, t as describeCodexSpawnError } from "./.setup/spawn-error-CL3n6MAa.mjs";
import { t as resolveCodexDoctorStartOptions } from "./.setup/doctor-start-options-CbIofkQS.mjs";
import path from "node:path";
import { coerceErrorMessage } from "openclaw/plugin-sdk/error-runtime";
import { fileURLToPath } from "node:url";
//#region extensions/codex/src/doctor.ts
const CODEX_MANAGED_APP_SERVER_CHECK_ID = "codex/managed-app-server";
function managedCodexFindings(params) {
	return [{
		checkId: CODEX_MANAGED_APP_SERVER_CHECK_ID,
		severity: params.severity ?? "error",
		source: "codex",
		message: params.message,
		...params.path ? { path: params.path } : {},
		...params.requirement ? { requirement: params.requirement } : {},
		...params.fixHint ? { fixHint: params.fixHint } : {}
	}];
}
function createCodexManagedAppServerHealthCheck(params) {
	const resolveNativeCommand = params.deps?.resolveNativeCommand ?? resolveManagedCodexNativeCommand;
	return {
		id: CODEX_MANAGED_APP_SERVER_CHECK_ID,
		kind: "plugin",
		description: "Verify the shipped managed Codex app-server binary and pinned version.",
		source: "codex",
		defaultEnabled: false,
		async detect(ctx) {
			const env = ctx.env ?? process.env;
			const isFinalization = ctx.mode === "fix" && env.OPENCLAW_UPDATE_POST_CORE === "1";
			const versionFailureSeverity = isFinalization ? "warning" : "error";
			const versionFailureHint = isFinalization ? "Codex readiness will be rechecked by its plugin after restart; inspect the Codex plugin if the warning persists." : void 0;
			let selection;
			try {
				selection = await resolveCodexDoctorStartOptions({
					cfg: ctx.cfg,
					env,
					pluginRoot: params.pluginRoot,
					managedOnly: true,
					deps: params.deps
				});
			} catch (error) {
				return managedCodexFindings({
					message: `Managed Codex app-server could not be resolved: ${coerceErrorMessage(error)}`,
					path: params.pluginRoot,
					requirement: `an executable Codex ${CODEX_APP_SERVER_VERSION} managed artifact`,
					fixHint: "Reinstall the staged OpenClaw package with its @openai/codex platform dependency, then rerun the candidate check."
				});
			}
			if (selection.status === "skipped") return [];
			const resolved = selection.start;
			const nativeCommand = resolveNativeCommand(resolved.command);
			if (!nativeCommand) return managedCodexFindings({
				message: "Managed Codex app-server resolved a launcher without a native artifact.",
				path: resolved.command,
				requirement: `the platform-native Codex ${CODEX_APP_SERVER_VERSION} executable`,
				fixHint: "Reinstall the staged OpenClaw package with the matching @openai/codex platform package, then rerun the candidate check."
			});
			let output;
			try {
				output = await (params.deps?.runVersionCommand ? params.deps.runVersionCommand(nativeCommand) : runCodexVersionCommand(nativeCommand, env));
			} catch (error) {
				const spawnFailure = findCodexAppServerSpawnError(describeCodexSpawnError(error, nativeCommand));
				return managedCodexFindings({
					message: spawnFailure?.message ?? `Managed Codex app-server version check failed: ${coerceErrorMessage(error)}`,
					severity: spawnFailure && resolved.managedCommandOrder === "package-only" ? "warning" : versionFailureSeverity,
					path: nativeCommand,
					requirement: `Codex ${CODEX_APP_SERVER_VERSION} must report its version within ${CODEX_VERSION_TIMEOUT_MS} ms`,
					fixHint: versionFailureHint ?? "Repair or reinstall the staged OpenClaw package, then rerun the candidate check before cutover."
				});
			}
			const detectedVersion = parseCodexVersion(output);
			if (detectedVersion !== "0.164.0") return managedCodexFindings({
				severity: versionFailureSeverity,
				message: detectedVersion ? `Managed Codex app-server version mismatch: expected ${CODEX_APP_SERVER_VERSION}, detected ${detectedVersion}.` : `Managed Codex app-server did not report a parseable version; expected ${CODEX_APP_SERVER_VERSION}.`,
				path: nativeCommand,
				requirement: `the exact OpenClaw-pinned Codex version ${CODEX_APP_SERVER_VERSION}`,
				fixHint: versionFailureHint ?? "Reinstall the staged OpenClaw package so its managed @openai/codex dependency matches the pinned version, then rerun the candidate check."
			});
			return [];
		}
	};
}
function registerCodexManagedAppServerDoctorChecks$1(host, deps) {
	if (host.getHealthCheck("codex/managed-app-server")) return;
	host.registerHealthCheck(createCodexManagedAppServerHealthCheck({
		pluginRoot: host.pluginRoot,
		deps
	}));
}
//#endregion
//#region extensions/codex/api.ts
const CODEX_PLUGIN_ROOT = path.dirname(fileURLToPath(import.meta.url));
async function probeCodexWorkspaceWriteSandbox(params) {
	try {
		const { probeCodexWorkspaceWriteSandbox: probe } = await import("./.setup/workspace-write-sandbox-probe-BoJp6Lyj.mjs");
		return await probe({
			...params,
			pluginRoot: CODEX_PLUGIN_ROOT
		});
	} catch (error) {
		return {
			status: "inconclusive",
			reason: coerceErrorMessage(error)
		};
	}
}
function registerCodexManagedAppServerDoctorChecks(host) {
	registerCodexManagedAppServerDoctorChecks$1({
		...host,
		pluginRoot: CODEX_PLUGIN_ROOT
	});
	if (!host.getHealthCheck(codexNativeProfileRecoveryHealthCheck.id)) host.registerHealthCheck(codexNativeProfileRecoveryHealthCheck);
}
//#endregion
export { CODEX_MANAGED_APP_SERVER_CHECK_ID, probeCodexWorkspaceWriteSandbox, registerCodexManagedAppServerDoctorChecks };
