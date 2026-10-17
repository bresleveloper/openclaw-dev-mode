import { n as containsAuthoredInclude } from "./include-migration-ownership-jJubBWXv.mjs";
import { n as validateConfigObjectRawWithPlugins } from "./validation-BeAnc62d.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import { i as resolveConfigIncludeWriteBoundary, r as replaceConfigFile } from "./mutate-BkuP-9_H.mjs";
import "./config-9720xhC5.mjs";
import { a as migrateLegacyConfig, i as restoreDoctorConfigEnvRefs, r as prepareDoctorConfigReferenceSource } from "./config-flow-steps-DJkdcxLn.mjs";
//#region src/commands/doctor/legacy-config-repair.ts
/** Plan without replacing the source: update checkpoints must retain the authored bytes. */
function planLegacyConfigForUpdateChannel(configSnapshot, includeIdentity = {}) {
	const hasAuthoredIncludes = containsAuthoredInclude(configSnapshot.parsed);
	const migrated = migrateLegacyConfig(configSnapshot.sourceConfig, {
		sourceConfigBeforeMigrations: configSnapshot.sourceConfigBeforeMigrations,
		context: {
			authoredRaw: configSnapshot.parsed,
			resolvedRaw: configSnapshot.sourceConfig
		}
	});
	if (!migrated.config && !migrated.warnings?.length) return;
	const nextConfig = migrated.sourceConfig ?? migrated.config ?? configSnapshot.sourceConfig;
	const validated = validateConfigObjectRawWithPlugins(migrated.config ?? nextConfig);
	if (!validated.ok) return;
	if (hasAuthoredIncludes && !resolveConfigIncludeWriteBoundary({
		snapshot: configSnapshot,
		nextConfig
	})) return;
	return {
		snapshot: configSnapshot,
		config: validated.config,
		nextConfig,
		changes: migrated.changes,
		...migrated.warnings?.length ? { warnings: migrated.warnings } : {},
		includeIdentity: {
			includeFileHashesForWrite: { ...includeIdentity.includeFileHashesForWrite },
			includeFileTargetsForWrite: { ...includeIdentity.includeFileTargetsForWrite }
		}
	};
}
/**
* Persist the prepared migration without rebasing it onto later source edits.
* Deferred callers seal/bind their checkpoint before invoking this writer;
* the plan itself is source data, not proof of exclusion or write authority.
*/
async function repairLegacyConfigForUpdateChannel(params) {
	const plan = params.plan ?? planLegacyConfigForUpdateChannel(params.configSnapshot);
	if (!plan) return {
		snapshot: params.configSnapshot,
		repaired: false
	};
	const diagnostics = plan.warnings?.length ? { warnings: plan.warnings } : {};
	if (plan.changes.length === 0) return {
		snapshot: params.configSnapshot,
		repaired: false,
		...diagnostics
	};
	if (params.plan && containsAuthoredInclude(plan.snapshot.parsed)) {
		const paths = plan.snapshot.includedPaths ?? [];
		if (paths.length === 0 || paths.some((includePath) => !plan.includeIdentity.includeFileHashesForWrite?.[includePath] || !plan.includeIdentity.includeFileTargetsForWrite?.[includePath])) throw new Error("Legacy config plan is missing include write identities.");
	}
	await replaceConfigFile({
		sourceConfig: restoreDoctorConfigEnvRefs(plan.nextConfig, prepareDoctorConfigReferenceSource(plan.snapshot)),
		baseHash: plan.snapshot.hash,
		writeOptions: {
			...params.plan ? plan.includeIdentity : params.configWriteOptions,
			expectedConfigPath: plan.snapshot.path,
			auditOrigin: "doctor",
			allowConfigSizeDrop: true,
			skipOutputLogs: params.jsonMode
		}
	});
	const snapshot = await readConfigFileSnapshot();
	return {
		snapshot,
		repaired: snapshot.valid,
		...diagnostics
	};
}
//#endregion
export { repairLegacyConfigForUpdateChannel as n, planLegacyConfigForUpdateChannel as t };
