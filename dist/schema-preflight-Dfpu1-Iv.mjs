import { r as resolveStateDir } from "./state-dir-C8s3cOPX.mjs";
import { m as resolveConfigPath } from "./paths-orClZ-2Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { r as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHneg24Q.mjs";
import { c as resolveOpenClawStateSqlitePath } from "./openclaw-state-db.paths-D3nUb_uk.mjs";
import { o as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-QlwTsE6j.mjs";
import { n as isArtifactPreservingStateRead } from "./artifact-preserving-state-reads-CSUBkGbZ.mjs";
import "./openclaw-state-db-readonly-DPndG9sn.mjs";
import { t as createConfigIO } from "./io.factory-B5D3Sy_M.mjs";
import "./env-vars-BA28GJYb.mjs";
import { m as createUpdatePreflightFailure } from "./service-inspection-error-ozNMOrIE.mjs";
import "./io-DIF-KW3P.mjs";
import { o as resolveConfiguredAgentDatabaseCandidatePaths } from "./targets-DJGC6v85.mjs";
import { b as UpdatePreMutationError } from "./update-global-BlXQRfes.mjs";
import "./shared-DRiGAorf.mjs";
import { t as createUpdateConfigFailure } from "./update-command-config-failure-D1j4PRpI.mjs";
import { n as preflightOpenClawDatabaseSchemas } from "./openclaw-database-preflight-CRgNbhC3.mjs";
import fs from "node:fs";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/state/openclaw-database-preflight-contexts.ts
function canonicalDatabaseIdentity(database) {
	let canonical;
	try {
		canonical = fs.realpathSync.native(database.path);
	} catch {
		canonical = path.resolve(database.path);
	}
	const comparable = process.platform === "win32" ? canonical.toLowerCase() : canonical;
	return `${database.kind}\0${comparable}`;
}
/** Inspect one checkpoint's context union without granting migration ownership. */
async function preflightOpenClawDatabaseSchemaContexts(options) {
	const groups = [];
	for (const context of options.contexts) {
		const stateDir = resolveStateDir(context.env);
		const previous = groups.at(-1);
		if (previous?.env.OPENCLAW_STATE_DIR === stateDir) previous.configuredAgentDatabaseCandidatePaths.push(...context.configuredAgentDatabaseCandidatePaths);
		else {
			const env = cloneEnvWithPlatformSemantics(context.env);
			env.OPENCLAW_STATE_DIR = stateDir;
			groups.push({
				env,
				configuredAgentDatabaseCandidatePaths: [...context.configuredAgentDatabaseCandidatePaths]
			});
		}
	}
	const incompatible = /* @__PURE__ */ new Map();
	const indeterminate = /* @__PURE__ */ new Map();
	for (const group of groups) {
		const result = await preflightOpenClawDatabaseSchemas({
			env: group.env,
			supportedVersions: options.supportedVersions,
			preserveSourceArtifacts: options.preserveSourceArtifacts,
			configuredAgentDatabaseTargets: [],
			configuredAgentDatabaseCandidatePaths: [...new Set(group.configuredAgentDatabaseCandidatePaths)]
		});
		for (const database of result.incompatible) {
			const identity = canonicalDatabaseIdentity(database);
			incompatible.set(identity, incompatible.get(identity) ?? database);
			indeterminate.delete(identity);
		}
		for (const database of result.indeterminate) {
			const identity = canonicalDatabaseIdentity(database);
			if (!incompatible.has(identity) && !indeterminate.has(identity)) indeterminate.set(identity, database);
		}
	}
	return {
		incompatible: [...incompatible.values()],
		indeterminate: [...indeterminate.values()]
	};
}
//#endregion
//#region src/cli/update-cli/schema-preflight.ts
function assertReadableGitMetadata(metadataUnreadable, code = "target-git-metadata") {
	if (metadataUnreadable) {
		const failure = createUpdatePreflightFailure(code, metadataUnreadable);
		throw new UpdatePreMutationError("target-metadata-preflight", failure.message, { failureFacts: failure.failureFacts });
	}
}
function updateConfigSource(snapshot) {
	return {
		path: snapshot.path,
		exists: snapshot.exists,
		raw: snapshot.raw,
		hash: snapshot.hash,
		includedPaths: snapshot.includedPaths ?? [],
		includeProvenance: snapshot.includeProvenance ?? [],
		sourceConfig: snapshot.sourceConfig
	};
}
/** Candidate admission sees only the invoking process's config and shared-state selectors. */
function isCandidateAdmissionContextCovered(env, admissionEnv = process.env) {
	return resolveConfigPath(env) === resolveConfigPath(admissionEnv) && resolveOpenClawStateSqlitePath(env) === resolveOpenClawStateSqlitePath(admissionEnv);
}
function formatSchemaRefusalLines(schemas, dryRun = false) {
	const prefix = dryRun ? "Would refuse update" : "Update refused";
	return [
		...schemas.incompatible.map((database) => {
			const agent = database.agentId ? ` (agent ${database.agentId})` : "";
			return `${prefix}: ${database.kind} database${agent} ${database.path} has schema ${database.foundVersion}; target supports ${database.supportedVersion}; writer build ${database.writerAppVersion ?? "unknown"}.`;
		}),
		...schemas.indeterminate.map((database) => `${prefix}: could not inspect ${database.kind} database ${database.path}: ${database.reason}; check database access and free disk space, then retry the update.`),
		OPENCLAW_DATABASE_SCHEMA_DOCS_URL,
		"Installing manually via npm bypasses this guard; back up first and verify compatibility."
	];
}
async function captureTargetDatabaseSchemaContext(env, options) {
	const configValidation = options?.configValidation === "candidate" && isCandidateAdmissionContextCovered(env) ? "candidate" : void 0;
	const inspectionEnv = cloneEnvWithPlatformSemantics(env);
	const readEnv = cloneEnvWithPlatformSemantics(env);
	const { snapshot, writeOptions } = await createConfigIO({
		env: inspectionEnv,
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshotForWrite();
	const planned = options?.legacyConfigPlan;
	const before = planned?.snapshot;
	let legacyConfigPlan = before && isDeepStrictEqual(updateConfigSource(before), updateConfigSource(snapshot)) && ["includeFileHashesForWrite", "includeFileTargetsForWrite"].every((key) => isDeepStrictEqual(planned.includeIdentity[key] ?? {}, writeOptions[key] ?? {})) ? planned : void 0;
	if (before?.path === snapshot.path && !legacyConfigPlan && !snapshot.valid) {
		const { planLegacyConfigForUpdateChannel } = await import("./legacy-config-repair-D-NVEyEl.mjs");
		legacyConfigPlan = planLegacyConfigForUpdateChannel(snapshot, writeOptions);
	}
	if (!snapshot.valid && !legacyConfigPlan && configValidation !== "candidate" || snapshot.readError) throw createUpdateConfigFailure(snapshot);
	return {
		env: inspectionEnv,
		config: configValidation === "candidate" ? snapshot.sourceConfig : legacyConfigPlan?.config ?? snapshot.sourceConfig ?? snapshot.config,
		configSnapshot: snapshot,
		readEnv,
		...legacyConfigPlan ? { legacyConfigPlan } : {},
		...configValidation ? { configValidation } : {}
	};
}
/** Inspect the union of caller/service stores without granting migration ownership. */
async function checkTargetDatabaseSchemasForContexts(supportedVersions, contexts) {
	if (!supportedVersions) return {
		incompatible: [],
		indeterminate: []
	};
	return preflightOpenClawDatabaseSchemaContexts({
		contexts: contexts.map((context) => {
			try {
				return {
					env: context.env,
					configuredAgentDatabaseCandidatePaths: resolveConfiguredAgentDatabaseCandidatePaths(context.config, { env: context.env })
				};
			} catch (error) {
				throw new UpdatePreMutationError("database-schema-preflight", `Update refused: could not inspect configured database paths: ${formatErrorMessage(error)}`);
			}
		}),
		supportedVersions,
		preserveSourceArtifacts: isArtifactPreservingStateRead()
	});
}
function hasSchemaRefusal(schemas) {
	return schemas.incompatible.length > 0 || schemas.indeterminate.length > 0;
}
//#endregion
export { hasSchemaRefusal as a, formatSchemaRefusalLines as i, captureTargetDatabaseSchemaContext as n, isCandidateAdmissionContextCovered as o, checkTargetDatabaseSchemasForContexts as r, updateConfigSource as s, assertReadableGitMetadata as t };
