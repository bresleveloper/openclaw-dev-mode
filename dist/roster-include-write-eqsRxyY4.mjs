import { t as cloneConfigWithResolutionFacts } from "./resolution-facts-HH1cnmIY.mjs";
import { C as projectWebhookMigrationIncludeWrite } from "./io.warnings-Dz_nq5SM.mjs";
import { i as unsetConfigValueAtPath, r as setConfigValueAtPath } from "./config-paths-Bb7WEbv8.mjs";
import { i as resolveConfigIncludeWriteBoundary } from "./mutate-Br6nKTV_.mjs";
//#region src/commands/doctor/shared/roster-include-write.ts
/** Plan one guarded owner write and retain the exact paths still awaiting publication. */
function prepareDoctorConfigWriteStage(params) {
	const webhook = projectWebhookMigrationIncludeWrite(params.snapshot.sourceConfig, params.nextConfig);
	const remainingPaths = webhook?.paths ?? [];
	if (webhook) {
		const markerPath = [
			"meta",
			"migrations",
			"webhookListeners"
		];
		const previous = params.snapshot.sourceConfig.meta?.migrations?.webhookListeners;
		if (previous === void 0) unsetConfigValueAtPath(webhook.config, markerPath, params.snapshot.sourceConfig);
		else setConfigValueAtPath(webhook.config, markerPath, previous);
		remainingPaths.push(markerPath);
		if (resolveConfigIncludeWriteBoundary({
			...params,
			nextConfig: webhook.config
		})) return {
			config: webhook.config,
			remainingPaths,
			persistCanonicalAgentRoster: false
		};
	}
	if (!params.persistCanonicalAgentRoster || !params.installedPluginIdRecovery?.size) return;
	const includeCandidate = cloneConfigWithResolutionFacts(webhook?.config ?? params.nextConfig);
	includeCandidate.agents = params.snapshot.sourceConfig.agents;
	const boundary = resolveConfigIncludeWriteBoundary({
		snapshot: params.snapshot,
		nextConfig: includeCandidate,
		explicitSetPaths: params.explicitSetPaths?.filter(([key]) => key !== "agents")
	});
	if (!boundary || boundary.boundaryPath[0] !== "plugins") return;
	const rosterCandidate = cloneConfigWithResolutionFacts(params.snapshot.sourceConfig);
	rosterCandidate.agents = params.nextConfig.agents;
	return {
		config: rosterCandidate,
		remainingPaths: [["plugins"], ...remainingPaths],
		persistCanonicalAgentRoster: true
	};
}
/** Preview the same physical-owner sequence that the guarded Doctor writer uses. */
function canWriteDoctorInclude(snapshot, nextConfig, options, installedPluginIdRecovery) {
	return Boolean(resolveConfigIncludeWriteBoundary({
		snapshot,
		nextConfig,
		...options
	}) || prepareDoctorConfigWriteStage({
		snapshot,
		nextConfig,
		...options,
		installedPluginIdRecovery
	}));
}
//#endregion
export { prepareDoctorConfigWriteStage as n, canWriteDoctorInclude as t };
