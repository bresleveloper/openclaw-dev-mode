import { n as isNodeRuntime } from "./runtime-binary-BAwmhhZ0.mjs";
import { n as resolveOpenClawPackageRoot } from "./openclaw-root-CBoxhfke.mjs";
import { o as isDefaultInstallIdentity } from "./paths-DGIwWbpu.mjs";
import { n as SUPPORTED_NODE_VERSIONS, s as formatUnsupportedNodeVersionMessage } from "./node-version-DdJ6cN09.mjs";
import { a as nodeRuntimeNote, i as nodeRuntimeFailure } from "./node-sqlite-DWn4GVXM.mjs";
import { n as readInstallOwner, t as formatInstallOwnerMessage } from "./install-owner-ImshV9Dw.mjs";
import { n as detectRuntime } from "./runtime-guard-BoZCdLcu.mjs";
import { c as summarizeGatewayServiceLayout } from "./service-layout-BNLNn9Ng.mjs";
import { n as resolveGatewayService } from "./service-Cw6bpVrf.mjs";
import { o as resolveNodeRuntimeInfo } from "./runtime-paths-D7k3lrcM.mjs";
//#region src/commands/node-runtime-diagnostics.ts
/** Read-only Node findings shared by Doctor and status commands. */
const CHECK_ID = "core/doctor/node-runtime";
function unsupportedNodeFinding(version, capabilityError, ownerHint) {
	return {
		checkId: CHECK_ID,
		severity: "warning",
		source: "gateway-service",
		message: `Gateway service Node ${version ?? "unknown"} is unsupported. Required: ${SUPPORTED_NODE_VERSIONS}.`,
		requirement: SUPPORTED_NODE_VERSIONS,
		fixHint: ownerHint ?? [
			...capabilityError ? [capabilityError] : [],
			formatUnsupportedNodeVersionMessage(version),
			"After switching Node, refresh a managed Gateway with `openclaw gateway install --force`; for an externally managed service, have its deployment owner update the launcher."
		].join("\n")
	};
}
async function collectCurrentNodeRuntimeFindings() {
	const runtime = await detectRuntime();
	if (runtime.kind !== "node" || !runtime.sqliteProbe) return [];
	const failure = nodeRuntimeFailure(runtime.version, runtime.sqliteProbe);
	const message = failure ?? nodeRuntimeNote(runtime.version, runtime.sqliteProbe);
	const installOwner = failure ? await readInstallOwner(await resolveOpenClawPackageRoot({
		moduleUrl: import.meta.url,
		argv1: process.argv[1]
	})) : null;
	return message ? [{
		checkId: CHECK_ID,
		severity: failure ? "error" : "info",
		source: "cli",
		message,
		requirement: SUPPORTED_NODE_VERSIONS,
		target: runtime.execPath ?? void 0,
		...failure ? { fixHint: installOwner ? formatInstallOwnerMessage(installOwner) : formatUnsupportedNodeVersionMessage(runtime.version) } : {}
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
			if (runtime.status === "unsupported") {
				const layout = await summarizeGatewayServiceLayout(command);
				const owner = await readInstallOwner(layout?.packageRootReal ?? layout?.packageRoot ?? null);
				findings.push(unsupportedNodeFinding(runtime.version, runtime.capabilityError, owner ? formatInstallOwnerMessage(owner) : void 0));
			} else if (runtime.note) findings.push({
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
