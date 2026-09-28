import { n as isNodeRuntime } from "./runtime-binary-Cy5Lhult.mjs";
import { o as isDefaultInstallIdentity } from "./paths-DehQwyE0.mjs";
import { n as SUPPORTED_NODE_VERSIONS, s as formatUnsupportedNodeVersionMessage } from "./node-version-DdJ6cN09.mjs";
import { a as nodeRuntimeNote, i as nodeRuntimeFailure } from "./node-sqlite-DWn4GVXM.mjs";
import { a as resolveNodeRuntimeInfo } from "./runtime-paths-DifTYoyV.mjs";
import { n as detectRuntime } from "./runtime-guard-QhifpZGP.mjs";
import { a as resolveGatewayService } from "./service-YFvztZiz.mjs";
//#region src/commands/node-runtime-diagnostics.ts
/** Read-only Node findings shared by Doctor and status commands. */
const CHECK_ID = "core/doctor/node-runtime";
function unsupportedNodeFinding(version, source, capabilityError) {
	return {
		checkId: CHECK_ID,
		severity: "warning",
		source,
		message: `${source === "cli" ? "CLI" : "Gateway service"} Node ${version ?? "unknown"} is unsupported. Required: ${SUPPORTED_NODE_VERSIONS}.`,
		requirement: SUPPORTED_NODE_VERSIONS,
		fixHint: [
			...capabilityError ? [capabilityError] : [],
			formatUnsupportedNodeVersionMessage(version),
			...source === "gateway-service" ? ["After switching Node, refresh a managed Gateway with `openclaw gateway install --force`; for an externally managed service, have its deployment owner update the launcher."] : []
		].join("\n")
	};
}
async function collectCurrentNodeRuntimeFindings() {
	const runtime = await detectRuntime();
	if (runtime.kind !== "node" || !runtime.sqliteProbe) return [];
	const failure = nodeRuntimeFailure(runtime.version, runtime.sqliteProbe);
	const message = failure ?? nodeRuntimeNote(runtime.version, runtime.sqliteProbe);
	return message ? [{
		checkId: CHECK_ID,
		severity: failure ? "error" : "info",
		source: "cli",
		message,
		requirement: SUPPORTED_NODE_VERSIONS,
		target: runtime.execPath ?? void 0,
		...failure ? { fixHint: formatUnsupportedNodeVersionMessage(runtime.version) } : {}
	}] : [];
}
/** Inspect the CLI and recorded service without starting or repairing the service. */
async function collectNodeRuntimeFindings(env = process.env) {
	return [...await collectCurrentNodeRuntimeFindings(), ...await collectServiceNodeRuntimeFindings(env)];
}
/** Inspect the recorded service executable without starting or repairing the service. */
async function collectServiceNodeRuntimeFindings(env = process.env) {
	const findings = [];
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
			if (runtime.status === "unsupported") findings.push(unsupportedNodeFinding(runtime.version, "gateway-service", runtime.capabilityError));
			else if (runtime.note) findings.push({
				checkId: CHECK_ID,
				severity: "info",
				source: "gateway-service",
				message: runtime.note,
				target: executable
			});
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
