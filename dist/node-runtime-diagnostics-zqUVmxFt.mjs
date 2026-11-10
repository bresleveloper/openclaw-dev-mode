import { n as isNodeRuntime } from "./runtime-binary-GM6c0Hou.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CPodxfi3.mjs";
import { o as isDefaultInstallIdentity } from "./paths-orClZ-2Z.mjs";
import { l as formatUnsupportedNodeVersionMessage, r as SUPPORTED_NODE_VERSIONS, s as formatNodeSecurityWarning } from "./node-version-BfT-yCVT.mjs";
import { i as nodeRuntimeFailure } from "./node-sqlite-BvDyEHkZ.mjs";
import { c as summarizeGatewayServiceLayout } from "./service-layout-DcU2-cAg.mjs";
import { n as readInstallOwner, t as formatInstallOwnerMessage } from "./install-owner-BPfYmnil.mjs";
import { n as detectRuntime } from "./runtime-guard-BzyF4hYe.mjs";
import { o as resolveNodeRuntimeInfo } from "./runtime-paths-v6m7qRRF.mjs";
import { n as resolveGatewayService } from "./service-CCmqtriJ.mjs";
//#region src/commands/node-runtime-diagnostics.ts
/** Read-only Node findings shared by Doctor and status commands. */
const CHECK_ID = "core/doctor/node-runtime";
/** Inspect the CLI and recorded service without starting or repairing the service. */
async function collectNodeRuntimeFindings(env = process.env) {
	const findings = [];
	const cliRuntime = await detectRuntime();
	if (cliRuntime.kind === "node" && cliRuntime.sqliteProbe) {
		const failure = nodeRuntimeFailure(cliRuntime.version, cliRuntime.sqliteProbe);
		const securityWarning = failure ? null : formatNodeSecurityWarning(cliRuntime.version);
		if (failure || securityWarning) {
			const installOwner = await readInstallOwner(await resolveOpenClawPackageRoot({
				moduleUrl: import.meta.url,
				argv1: process.argv[1]
			}));
			findings.push({
				checkId: CHECK_ID,
				severity: failure ? "error" : "warning",
				source: "cli",
				message: failure ?? `SECURITY WARNING: ${securityWarning}`,
				requirement: failure ? SUPPORTED_NODE_VERSIONS : "recommended Node security patches",
				target: cliRuntime.execPath ?? void 0,
				fixHint: installOwner ? formatInstallOwnerMessage(installOwner) : failure ? formatUnsupportedNodeVersionMessage(cliRuntime.version) : "Upgrade the Node.js runtime to the recommended security patch level. Compatible older Node remains usable."
			});
		}
	}
	if (!isDefaultInstallIdentity(env)) return findings;
	try {
		const command = await resolveGatewayService().readCommand(env, { timeoutMs: 5e3 });
		const executable = command?.programArguments[0];
		if (executable && isNodeRuntime(executable)) {
			const runtime = await resolveNodeRuntimeInfo(executable, {
				...env,
				...command.environment
			});
			if (runtime.status === "probe-failed") throw runtime.error;
			const securityWarning = runtime.status === "supported" ? formatNodeSecurityWarning(runtime.version) : null;
			if (runtime.status === "unsupported" || securityWarning) {
				const layout = await summarizeGatewayServiceLayout(command);
				const owner = await readInstallOwner(layout?.packageRootReal ?? layout?.packageRoot ?? null);
				findings.push({
					checkId: CHECK_ID,
					severity: "warning",
					source: "gateway-service",
					message: securityWarning ? `SECURITY WARNING: Recorded Gateway service runtime: ${securityWarning}` : `Gateway service Node ${runtime.version ?? "unknown"} is unsupported. Required: ${SUPPORTED_NODE_VERSIONS}.`,
					requirement: securityWarning ? "recommended Node security patches" : SUPPORTED_NODE_VERSIONS,
					fixHint: owner ? formatInstallOwnerMessage(owner) : securityWarning ? "Upgrade the service Node.js runtime, then refresh the managed Gateway runtime selection and restart it. Compatible older Node remains usable." : [
						...runtime.capabilityError ? [runtime.capabilityError] : [],
						formatUnsupportedNodeVersionMessage(runtime.version),
						"After switching Node, refresh a managed Gateway with `openclaw gateway install --force`; for an externally managed service, have its deployment owner update the launcher."
					].join("\n")
				});
			}
		}
	} catch {
		findings.push({
			checkId: CHECK_ID,
			severity: "warning",
			source: "gateway-service",
			message: "The recorded Gateway service Node runtime could not be inspected.",
			fixHint: "Run `openclaw gateway status --deep` and check access to its recorded executable."
		});
	}
	return findings;
}
//#endregion
export { collectNodeRuntimeFindings as t };
