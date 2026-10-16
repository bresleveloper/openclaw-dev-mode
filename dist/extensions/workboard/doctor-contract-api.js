//#region extensions/workboard/doctor-contract-api.ts
const RECOVERY = "Workboard has retired pre-July 2026 plugin-state KV data. Install OpenClaw 2026.9.7 and run openclaw doctor --fix before upgrading; the retained legacy rows have not been changed.";
async function detectRetiredState(params) {
	const env = {
		...params.env,
		OPENCLAW_STATE_DIR: params.stateDir
	};
	for (const [namespace, maxEntries] of [
		["workboard.cards", 2e3],
		["workboard.boards", 200],
		["workboard.notify", 2e3],
		["workboard.attachments", 42e3]
	]) {
		const store = params.context.openPluginStateKeyedStore({
			namespace,
			maxEntries,
			env
		});
		if ((store.count ? await store.count() : (await store.entries()).length) > 0) return { preview: [RECOVERY] };
	}
	return null;
}
const stateMigrations = [{
	id: "workboard-28-kv-to-sqlite",
	label: "Workboard .28 plugin-state KV",
	detectLegacyState: detectRetiredState,
	async migrateLegacyState(params) {
		return {
			changes: [],
			warnings: (await detectRetiredState(params))?.preview ?? []
		};
	}
}];
//#endregion
export { stateMigrations };
