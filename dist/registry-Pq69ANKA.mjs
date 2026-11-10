//#region src/infra/database-engine/registry.ts
const stores = [
	{
		id: "state",
		label: "Shared state"
	},
	{
		id: "agent",
		label: "Agent data"
	},
	{
		id: "workboard",
		label: "Workboard",
		postgres: true
	},
	{
		id: "logbook",
		label: "Logbook"
	},
	{
		id: "quarantine",
		label: "Database quarantine"
	},
	{
		id: "managed-update",
		label: "Managed update handoffs"
	},
	{
		id: "package-activation",
		label: "Package activation journal"
	}
];
function listDatabaseEngineStores() {
	return stores;
}
function selectDatabaseEngine(store, config) {
	return config.database?.engine === "postgres" && store.postgres ? "postgres" : "sqlite";
}
//#endregion
export { selectDatabaseEngine as n, listDatabaseEngineStores as t };
