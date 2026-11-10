import { r as withArtifactPreservingStateReads } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import { r as captureOpenClawStateWorkerContext } from "./openclaw-state-worker-context-BDhKaXgP.mjs";
import { n as normalizeConfigMachineStateKey } from "./config-machine-state-row-BRr4hJIX.mjs";
import { t as executeExistingOpenClawStateRead } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { o as createAuthProfileCredentialWriteAdmission } from "./user-model-account-authority-DFFjC5J5.mjs";
//#region src/state/config-machine-state-async.ts
async function readConfigMachineStateAsync(key, options = {}, behavior = {}) {
	const read = () => executeExistingOpenClawStateRead(options, {
		type: "machineState.read",
		input: { key }
	});
	const result = await (behavior.artifactPreservingReadOnly ? withArtifactPreservingStateReads(read) : read());
	if (!result) return;
	return result.row ? JSON.parse(result.row.value_json) : void 0;
}
async function readVoiceWakeMachineState(key, options = {}) {
	const result = await executeExistingOpenClawStateRead(options, { type: key });
	if (!result) return;
	return result.row ? {
		value: JSON.parse(result.row.value_json),
		updatedAtMs: result.row.updated_at_ms
	} : void 0;
}
async function writeConfigMachineStateAsync(key, value, options = {}) {
	const { runOpenClawStateWorkerOperation } = await import("./openclaw-state-worker-store-1jCE83ab.mjs");
	const stateKey = normalizeConfigMachineStateKey(key);
	const context = captureOpenClawStateWorkerContext(options);
	return runOpenClawStateWorkerOperation(context, (scope) => scope.execute({
		type: "machineState.write",
		input: {
			key: stateKey,
			value
		}
	}), stateKey === "authProfiles.store" ? { createAdmission: createAuthProfileCredentialWriteAdmission(context) } : void 0);
}
//#endregion
export { readVoiceWakeMachineState as n, writeConfigMachineStateAsync as r, readConfigMachineStateAsync as t };
