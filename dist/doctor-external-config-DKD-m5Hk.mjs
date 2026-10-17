import { S as resolveIsConfigReadOnly } from "./paths-DGIwWbpu.mjs";
import { t as redactConfigObject } from "./redact-snapshot-Ds6C-7Ba.mjs";
import { n as resolveConfigWidePluginManifestRegistry } from "./io.plugin-metadata-DdBZxRt7.mjs";
import { c as readConfigFileSnapshot } from "./io.runtime-BSum32pK.mjs";
import { n as createMergePatch } from "./merge-patch-C4XTCka4.mjs";
import "./config-9720xhC5.mjs";
import { i as restoreDoctorConfigEnvRefs } from "./config-flow-steps-DJkdcxLn.mjs";
import { t as buildRuntimeConfigSchemaFromRegistry } from "./runtime-schema-Ba7drZTV.mjs";
//#region src/flows/doctor-external-config.ts
/** Report the candidate without granting the authority of a committed config write. */
async function reportDoctorExternalConfigRepairs(ctx) {
	const snapshot = await readConfigFileSnapshot({ observe: false });
	const candidate = restoreDoctorConfigEnvRefs(ctx.cfg, ctx.configResult.referenceSource, ctx.configResult.explicitSetPaths);
	const before = ctx.externalConfigRepairsPending ? restoreDoctorConfigEnvRefs(ctx.cfgForPersistence, ctx.configResult.referenceSource) : ctx.configResult.referenceSource?.authored ?? snapshot.sourceConfigBeforeMigrations ?? snapshot.sourceConfig;
	const patch = createMergePatch(before, candidate);
	const registry = resolveConfigWidePluginManifestRegistry({
		config: ctx.cfg,
		env: ctx.env ?? process.env
	});
	const { uiHints } = buildRuntimeConfigSchemaFromRegistry(registry, ctx.cfg);
	ctx.runtime.log([
		`Config repairs pending in externally managed ${snapshot.path}; no config files were changed.`,
		"Apply this merge patch in the external deployment source (null removes a key; arrays replace the whole array). For $include-owned keys, edit the included source. Redacted values must be supplied externally, not copied from this report.",
		JSON.stringify(redactConfigObject(patch, uiHints), null, 2)
	].join("\n"));
	ctx.externalConfigRepairsPending = true;
	ctx.configResult.shouldWriteConfig = false;
	delete ctx.configResult.pendingChangePanels;
	delete ctx.configResult.retiredModelRefConfig;
	ctx.cfg = snapshot.config;
	ctx.cfgForPersistence = structuredClone(snapshot.config);
}
async function validateDoctorExternalConfigForStartup(runtime) {
	if (!resolveIsConfigReadOnly()) return true;
	const persisted = await readConfigFileSnapshot({ observe: false });
	if (persisted.valid && persisted.legacyIssues.length === 0) return true;
	for (const issue of [...persisted.issues, ...persisted.legacyIssues]) runtime.error(`- ${issue.path || "<root>"}: ${issue.message}`);
	runtime.error(`Gateway startup requires the pending config repairs. Apply the reported edits in the external source for ${persisted.path}, then redeploy. No config files were changed.`);
	return false;
}
//#endregion
export { reportDoctorExternalConfigRepairs, validateDoctorExternalConfigForStartup };
