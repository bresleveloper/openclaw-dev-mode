import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-Cb_mGBOW.mjs";
import { n as satisfiesPluginApiRange, t as resolvePackagePluginApiRange } from "./package-compat-AGqtJMV9.mjs";
import { C as NpmChannelResolutionError, k as resolveNpmInstallSpecsForUpdateChannel } from "./official-external-plugin-catalog-B5ALUbx8.mjs";
import { r as loadInstalledPluginIndexInstallRecords } from "./installed-plugin-index-record-reader-CE166Xp8.mjs";
import { u as resolveRegistryUpdateChannel } from "./update-channels-l0GQCX9n.mjs";
import { t as checkMinHostVersion } from "./min-host-version-DhjoqTWe.mjs";
import { d as withCommandProcessScope } from "./exec-spawn-Cn2m7YAI.mjs";
import { c as resolveNpmSpecMetadata } from "./install-source-utils-DCME3COX.mjs";
import "./installed-plugin-index-records-DTzp62mN.mjs";
import { l as withOwnedManagedUpdateEnv } from "./update-command-service-env-Bq_QrqHd.mjs";
import { i as readInstalledPackageManifest } from "./package-update-utils-BhTxVhIA.mjs";
import { t as collectConfiguredNpmPluginTargets } from "./missing-configured-plugin-install.targets-D-qPJ_Gb.mjs";
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
			const installRecords = params.installRecords ?? await loadInstalledPluginIndexInstallRecords({ env: params.env });
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
					if (hasCommandProcessCleanupError(error) || !(error instanceof NpmChannelResolutionError)) throw error;
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
