import { s as defineRetiredPluginStateMigration } from "../../runtime-doctor-migrations-4UZBewWQ.mjs";
import path from "node:path";
//#region extensions/device-pair/doctor-contract-api.ts
const stateMigrations = [defineRetiredPluginStateMigration({
	id: "device-pair-retired-state",
	label: "Device Pair retired notify state",
	intermediateVersion: "2026.9.5",
	findSources: ({ stateDir }) => [path.join(stateDir, "device-pair-notify.json")]
})];
//#endregion
export { stateMigrations };
