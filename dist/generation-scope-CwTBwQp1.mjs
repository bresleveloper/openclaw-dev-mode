import { a as runWithPluginExecutionFrame } from "./plugin-instance-invocation-DjfKDZW8.mjs";
import { n as createRegistryScope, s as runOutsidePluginRuntimeRegistryScope } from "./gateway-request-scope-1BXD1G3l.mjs";
import { n as getPluginRuntimeExecutionFrame, t as PluginRuntimeExecutionFrame } from "./execution-frame-BIyHTHsH.mjs";
import { n as runOutsidePluginRuntimeGenerationRegistryScope } from "./generation-state-BWMrcMOM.mjs";
import { t as createEmptyPluginRegistry } from "./registry-empty-mS6HujHb.mjs";
import { n as createPluginMetadataSnapshotFrame, s as runOutsidePluginMetadataSnapshotScope } from "./current-plugin-metadata-snapshot-BK2DY7Lo.mjs";
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
