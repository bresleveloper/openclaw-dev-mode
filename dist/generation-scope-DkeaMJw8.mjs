import { a as runWithPluginExecutionFrame } from "./plugin-instance-invocation-CGmhv_zp.mjs";
import { n as getPluginRuntimeExecutionFrame, t as PluginRuntimeExecutionFrame } from "./execution-frame-BFVLVBaA.mjs";
import { a as runOutsidePluginRuntimeRegistryScope, t as createRegistryScope } from "./gateway-request-scope-BLBH-Gpf.mjs";
import { n as createPluginMetadataSnapshotFrame, s as runOutsidePluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BU2mC0-C.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty--vb91VWS.mjs";
import { n as runOutsidePluginRuntimeGenerationRegistryScope } from "./generation-state-Mkqqbxs_.mjs";
//#region src/plugins/runtime/generation-scope.ts
/** Carries one prepared plugin generation through all nested runtime lookups. */
function withPluginRuntimeGenerationScope(generation, run) {
	const pluginRegistry = generation.pluginRegistry ?? createEmptyPluginRegistry();
	const frame = createPluginMetadataSnapshotFrame(generation.metadataSnapshot, { trustConfigIdentity: true });
	return runWithPluginExecutionFrame(new PluginRuntimeExecutionFrame(frame, createRegistryScope(pluginRegistry, getPluginRuntimeExecutionFrame(frame)?.gatewayScope, generation.metadataSnapshot.declaredProviderOwners), pluginRegistry), run);
}
/** Re-admission drops the old generation while retaining the exact Gateway caller. */
function runOutsidePluginRuntimeGenerationScope(run) {
	return runOutsidePluginRuntimeGenerationRegistryScope(() => runOutsidePluginMetadataSnapshotScope(() => runOutsidePluginRuntimeRegistryScope(run)));
}
//#endregion
export { withPluginRuntimeGenerationScope as n, runOutsidePluginRuntimeGenerationScope as t };
