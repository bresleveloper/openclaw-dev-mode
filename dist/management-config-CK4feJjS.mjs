import { o as asRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-BBJ5cpXU.mjs";
import { l as readConfigFileSnapshotForWrite, s as readConfigFileSnapshot } from "./io.runtime-Ds5uC0Bf.mjs";
import "./config-B3oiWDlr.mjs";
import { i as selectInstallMutationWriteOptions, r as resolveInstallConfigMutationPreflights } from "./install-config-mutation-BiqWaAG2.mjs";
//#region src/plugins/management-config.ts
function readValidSourceConfig(snapshot) {
	if (!snapshot.valid) throw new ManagedPluginLifecycleError("Config invalid; run `openclaw doctor --fix` before managing plugins.");
	return snapshot.sourceConfig;
}
async function readPluginRuntimeConfig() {
	return readValidSourceConfig(await readConfigFileSnapshot({
		observe: false,
		isolateEnv: true
	}));
}
async function readPluginMutationSnapshot(env, beforePersistentApply) {
	try {
		assertConfigWriteAllowedInCurrentMode({ env });
	} catch (error) {
		throw new ManagedPluginLifecycleError(formatErrorMessage(error), { cause: error });
	}
	const { snapshot, writeOptions } = await readConfigFileSnapshotForWrite();
	const config = readValidSourceConfig(snapshot);
	const mutationWriteOptions = selectInstallMutationWriteOptions(writeOptions, beforePersistentApply);
	const { pluginMutation } = resolveInstallConfigMutationPreflights({
		parsed: asRecord(snapshot.parsed),
		snapshotPath: snapshot.path,
		writeOptions: mutationWriteOptions
	});
	if (pluginMutation.mode === "blocked") throw new ManagedPluginLifecycleError(pluginMutation.reason);
	return {
		config,
		baseHash: snapshot.hash,
		writeOptions: mutationWriteOptions
	};
}
//#endregion
export { readPluginRuntimeConfig as n, readPluginMutationSnapshot as t };
