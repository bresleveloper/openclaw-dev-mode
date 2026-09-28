import { K as applyLegacyDoctorMigrations } from "./io.snapshot-BXLTgjrd.mjs";
import { n as getDeferredPluginMigrationConfigFacts } from "./deferred-plugin-migration-config-BPsZd89G.mjs";
import { a as validateConfigObjectRawWithPlugins } from "./io.snapshot-preparation-E0KwwdW2.mjs";
//#region src/commands/doctor/shared/legacy-config-migrate.ts
/** Apply legacy migrations and validate the resulting OpenClaw config shape when possible. */
function migrateLegacyConfig(raw, options) {
	const { context } = options;
	const { next, changes, warnings } = applyLegacyDoctorMigrations(raw, options);
	const diagnostics = {
		changes,
		...warnings?.length ? { warnings } : {}
	};
	if (!next) return {
		config: null,
		...diagnostics
	};
	const resolvedCandidate = context ? applyLegacyDoctorMigrations(context.resolvedRaw, options).next ?? context.resolvedRaw : next;
	const validated = validateConfigObjectRawWithPlugins(resolvedCandidate, { deferredPluginMigrations: getDeferredPluginMigrationConfigFacts(context?.resolvedRaw ?? raw) });
	if (!validated.ok) {
		changes.push("Migration applied; other validation issues remain — run doctor to review.");
		return {
			config: next,
			...diagnostics,
			partiallyValid: true
		};
	}
	return {
		config: validated.config,
		sourceConfig: next,
		...diagnostics
	};
}
//#endregion
export { migrateLegacyConfig as t };
