import { n as sha256Hex } from "./node-crypto-BG4u3UnX.mjs";
import "./crypto-digest-y6oZN-_F.mjs";
import { a as hasGatewayServiceLauncherOverride } from "./service-types-CPk6CBn6.mjs";
import { c as projectDaemonServiceForJson } from "./shared-BiNxJvE7.mjs";
import { a as readDaemonRuntimePin } from "./runtime-pin-state-_Q5AuEC0.mjs";
//#region src/cli/daemon-cli/status.runtime-intent.ts
/** Diagnostics may run on unsupported Node or recover elsewhere; report the actual interpreter. */
async function inspectCliRuntime() {
	const { isCurrentRuntimeSupported } = await import("./runtime-guard-BZ53YTeZ.mjs");
	return {
		kind: process.versions.bun ? "bun" : process.versions.node ? "node" : "unknown",
		execPath: process.execPath,
		supported: await isCurrentRuntimeSupported()
	};
}
/** Deep inspection projects canonical intent; the revision is observation, never a write grant. */
async function inspectServiceRuntimeIntent(params) {
	if (!params.inspectionKnown) return { runtimeIntent: { status: "unknown" } };
	try {
		const pin = readDaemonRuntimePin({
			kind: params.kind,
			env: params.serviceEnv
		}, params.command);
		const capability = await params.service.readDefinitionMutationCapability?.({
			env: params.env,
			environment: params.serviceEnv
		});
		if (readDaemonRuntimePin({
			kind: params.kind,
			env: params.serviceEnv
		}, params.command).revision !== pin.revision) return { runtimeIntent: { status: "unknown" } };
		const { command } = projectDaemonServiceForJson({ command: params.command }, { includeDefinitionPaths: false });
		return {
			runtimeIntent: {
				status: "known",
				...pin
			},
			revision: sha256Hex(JSON.stringify([command, pin])),
			definitionMutation: capability?.kind ?? "unknown",
			launcherOverridden: hasGatewayServiceLauncherOverride(params.command)
		};
	} catch {
		return { runtimeIntent: { status: "unknown" } };
	}
}
//#endregion
export { inspectServiceRuntimeIntent as n, inspectCliRuntime as t };
