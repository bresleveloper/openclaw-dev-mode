import { o as asRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { r as assertConfigWriteAllowedInCurrentMode } from "./config-write-guard-DALlcipW.mjs";
import { t as ManagedPluginLifecycleError } from "./management-lifecycle-error-ySeX1uI2.mjs";
import { c as readConfigFileSnapshot, u as readConfigFileSnapshotForWrite } from "./io.runtime-CZWcIUDk.mjs";
import "./config-DryArA1l.mjs";
import { n as resolveInstallConfigMutationPreflights, r as selectInstallMutationWriteOptions } from "./install-config-mutation-COmtsyZD.mjs";
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
