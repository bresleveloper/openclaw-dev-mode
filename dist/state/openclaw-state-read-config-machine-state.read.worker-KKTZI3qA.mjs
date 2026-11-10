import { r as readConfigMachineStateRowInDatabase } from "./openclaw-state-read-openclaw-state-read-handlers-BUnsgff9.mjs";
//#region src/state/config-machine-state.read.worker.ts
const machineStateReadOperations = { "machineState.read": (input, database) => ({
	type: "machineState.read",
	row: readConfigMachineStateRowInDatabase(database, input.key)
}) };
//#endregion
export { machineStateReadOperations };
