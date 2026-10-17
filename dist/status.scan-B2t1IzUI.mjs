import { r as withProgress } from "./progress-UTM8yfZa.mjs";
import { t as collectStatusScanOverview } from "./status.scan-overview-Dqg8vc6N.mjs";
import { t as executeStatusScanFromOverview } from "./status.scan-execute-xyarfNh9.mjs";
//#region src/commands/status.scan.ts
/** Runs the text status scan. */
async function scanStatus(opts) {
	return await withProgress({
		label: "Scanning status…",
		total: 9,
		enabled: true
	}, async (progress) => {
		const isDetailedScan = opts.deep === true;
		const overview = await collectStatusScanOverview({
			env: process.env,
			commandName: "status",
			opts,
			showSecrets: process.env.OPENCLAW_SHOW_SECRETS?.trim() !== "0",
			includeLiveChannelStatus: isDetailedScan,
			includeChannelSetupRuntimeFallback: isDetailedScan,
			fetchGitUpdate: isDetailedScan,
			includeRegistryUpdate: isDetailedScan,
			includeAdvertisedControlUiLinks: true,
			progress,
			labels: {
				loadingConfig: "Loading config…",
				checkingTailscale: "Checking Tailscale…",
				checkingForUpdates: "Checking for updates…",
				resolvingAgents: "Resolving agents…",
				probingGateway: "Probing gateway…",
				queryingChannelStatus: "Querying channel status…",
				summarizingChannels: "Summarizing channels…"
			}
		});
		progress.setLabel("Checking memory and sessions…");
		const result = await executeStatusScanFromOverview({
			overview,
			resolveMemory: async () => null,
			pluginCompatibility: []
		});
		progress.tick();
		progress.setLabel("Rendering…");
		progress.tick();
		return result;
	});
}
//#endregion
export { scanStatus };
