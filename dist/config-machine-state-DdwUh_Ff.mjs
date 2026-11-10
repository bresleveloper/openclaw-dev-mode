import "./sqlite-schema-facts-C8u_9Af1.mjs";
import { i as readConfigMachineStateRowInDatabase } from "./config-machine-state-row-BRr4hJIX.mjs";
import { s as withExistingOpenClawStateDatabaseArtifactPreservingReadOnly, u as withExistingOpenClawStateDatabaseReadOnly } from "./openclaw-state-db-readonly-DPndG9sn.mjs";
//#region src/state/config-machine-state.ts
function readConfigMachineState(key, options = {}, behavior = {}) {
	const read = ({ db: database }) => {
		const row = readConfigMachineStateRowInDatabase(database, key);
		return row ? JSON.parse(row.value_json) : void 0;
	};
	return behavior.artifactPreservingReadOnly ? withExistingOpenClawStateDatabaseArtifactPreservingReadOnly(read, options) : withExistingOpenClawStateDatabaseReadOnly(read, options);
}
//#endregion
export { readConfigMachineState as t };
