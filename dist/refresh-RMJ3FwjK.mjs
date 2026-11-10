import { o as writeRuntimeJson } from "./runtime-BazLsT0s.mjs";
import { t as ExpectedCliError } from "./failure-output-CpIKhMiV.mjs";
import { t as runWithLocalStateOwner } from "./local-state-owner-B_m2_iCc.mjs";
import { n as refreshRemoteModelCatalog } from "./remote-refresh-CA7iR0_e.mjs";
//#region src/commands/models/refresh.ts
async function modelsRefreshCommand(options, runtime) {
	const result = await runWithLocalStateOwner({
		method: "models.refresh",
		params: {},
		target: "remote model catalog",
		onForeignOwner: "refuse",
		runLocal: async ({ config, env, signal, assertCurrent }) => {
			assertCurrent();
			return await refreshRemoteModelCatalog({
				config,
				force: true,
				signal,
				databaseOptions: { env }
			});
		}
	});
	if (result.status === "error") {
		const message = `Remote catalog refresh failed: ${result.error}`;
		throw new ExpectedCliError({
			message,
			humanOutput: message,
			machineOutput: message
		});
	}
	if (options.json) {
		writeRuntimeJson(runtime, result, 0);
		return;
	}
	if (result.status === "disabled") {
		runtime.log("Remote catalog refresh is disabled (models.catalogRefresh.enabled=false)");
		return;
	}
	runtime.log(`Remote catalog refresh: ${result.status} (${result.providers} providers, ${result.models} models; generated ${new Date(result.generatedAt).toISOString()})`);
}
//#endregion
export { modelsRefreshCommand };
