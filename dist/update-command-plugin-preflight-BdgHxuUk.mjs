import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-CurpuyOg.mjs";
import { C as NpmChannelResolutionError, k as resolveNpmInstallSpecsForUpdateChannel } from "./official-external-plugin-catalog-CzZljLFK.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-Bwq1gZI1.mjs";
import { d as resolveRegistryUpdateChannel } from "./update-channels-BDINqyML.mjs";
import { t as checkMinHostVersion } from "./min-host-version-DRd0HJBG.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-C4wNdxxi.mjs";
import { l as withCommandProcessScope } from "./exec-spawn-B7redWCL.mjs";
import { i as readInstalledPackageManifest } from "./package-update-utils-Ds9d2bwt.mjs";
import { s as resolveNpmSpecMetadata } from "./install-source-utils-CeCvRCDR.mjs";
import { c as withOwnedManagedUpdateEnv } from "./update-command-service-env-a79RyIGw.mjs";
import "./installed-plugin-index-records-Clh203og.mjs";
import { t as collectConfiguredNpmPluginTargets } from "./missing-configured-plugin-install.targets-DQUS1iqs.mjs";
//#region src/cli/update-cli/update-command-plugin-preflight.ts
function incompatibleRequirement(metadata, targetVersion, installed = false) {
	const api = resolvePackagePluginApiRange(metadata);
	if (api.ok && api.range && !satisfiesPluginApiRange(targetVersion, api.range)) return `plugin API ${api.range}`;
	const install = isRecord(metadata) && isRecord(metadata.install) ? metadata.install : void 0;
	const host = checkMinHostVersion({
		currentVersion: targetVersion,
		minHostVersion: install?.minHostVersion,
		allowLegacyBareSemver: installed
	});
	return !host.ok && host.kind === "incompatible" ? `OpenClaw ${host.requirement.raw}` : void 0;
}
/** Report unavailable replacements without vetoing the core package update. */
async function preflightConfiguredNpmPluginTargets(params) {
	return await withCommandProcessScope(async () => {
		const targetVersion = params.targetVersion;
		if (!targetVersion) return [];
		return await withOwnedManagedUpdateEnv(params.env, async () => {
			const warnings = [];
			const installRecords = await loadInstalledPluginIndexInstallRecords({ env: params.env });
			const targets = await collectConfiguredNpmPluginTargets({
				...params,
				targetVersion,
				installRecords,
				channel: resolveRegistryUpdateChannel({
					configChannel: params.channel,
					currentVersion: targetVersion
				})
			});
			for (const target of targets) {
				const record = installRecords[target.pluginId];
				const manifest = record?.installPath ? readInstalledPackageManifest(record.installPath) : void 0;
				const requirement = incompatibleRequirement(manifest?.openclaw, targetVersion, true);
				if (!requirement || typeof manifest?.version !== "string") continue;
				let requiredSpec = target.spec;
				let failure;
				try {
					const selected = await resolveNpmInstallSpecsForUpdateChannel({
						...target,
						timeoutMs: params.timeoutMs
					});
					requiredSpec = selected.installSpec;
					const resolution = selected.npmResolution ? {
						ok: true,
						metadata: selected.npmResolution
					} : await resolveNpmSpecMetadata({
						spec: requiredSpec,
						timeoutMs: params.timeoutMs
					});
					if (!resolution.ok) failure = resolution.category === "metadata-env" ? `registry could not be reached: ${resolution.error}` : resolution.error;
					else {
						const candidateRequirement = incompatibleRequirement(resolution.metadata.packageOpenClaw, targetVersion);
						if (!candidateRequirement) continue;
						failure = `resolved plugin requires ${candidateRequirement}`;
					}
				} catch (error) {
					if (hasCommandProcessCleanupError(error)) throw error;
					if (!(error instanceof NpmChannelResolutionError)) throw error;
					failure = `registry could not be reached: ${formatErrorMessage(error)}`;
				}
				warnings.push({
					pluginId: target.pluginId,
					reason: `Installed ${manifest.version} requires ${requirement}; ${requiredSpec}: ${failure}`,
					message: `Plugin "${target.pluginId}" update availability could not be confirmed; the core update can continue.`,
					guidance: []
				});
			}
			return warnings;
		});
	});
}
//#endregion
export { preflightConfiguredNpmPluginTargets as t };
