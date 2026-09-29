import { t as formatErrorMessage } from "./errors-DnjwnOju.mjs";
import { n as cloneEnvWithPlatformSemantics } from "./config-env-vars-BHI12YH5.mjs";
import { a as OPENCLAW_DATABASE_SCHEMA_DOCS_URL } from "./openclaw-state-db-contract-dESpOAuZ.mjs";
import "./env-vars-jrzBxc1h.mjs";
import { n as formatConfigIssueLines } from "./issue-format-BQNShMey.mjs";
import { t as createConfigIO } from "./io.factory-ChIex6Yh.mjs";
import "./io-DuIKUcsW.mjs";
import { o as resolveConfiguredAgentDatabaseCandidatePaths } from "./targets-Dmb8-YXN.mjs";
import { n as UpdatePreMutationError } from "./shared-Ca2ebFXK.mjs";
import { n as preflightOpenClawDatabaseSchemas } from "./openclaw-database-preflight-DfCl_gJ5.mjs";
import fs from "node:fs";
import { isDeepStrictEqual } from "node:util";
import path from "node:path";
//#region src/cli/update-cli/schema-preflight.ts
function formatSchemaRefusalLines(schemas, dryRun = false) {
	const prefix = dryRun ? "Would refuse update" : "Update refused";
	return [
		...schemas.incompatible.map((database) => {
			const agent = database.agentId ? ` (agent ${database.agentId})` : "";
			return `${prefix}: ${database.kind} database${agent} ${database.path} has schema ${database.foundVersion}; target supports ${database.supportedVersion}; writer build ${database.writerAppVersion ?? "unknown"}.`;
		}),
		...schemas.indeterminate.map((database) => `${prefix}: could not inspect ${database.kind} database ${database.path}: ${database.reason}; retry once the gateway releases it.`),
		OPENCLAW_DATABASE_SCHEMA_DOCS_URL,
		"Installing manually via npm bypasses this guard; back up first and verify compatibility."
	];
}
async function checkTargetDatabaseSchemas(supportedVersions, context) {
	let configuredAgentDatabaseCandidatePaths;
	try {
		configuredAgentDatabaseCandidatePaths = resolveConfiguredAgentDatabaseCandidatePaths(context.config, { env: context.env });
	} catch (error) {
		throw new UpdatePreMutationError("database-schema-preflight", `Update refused: could not inspect configured database paths: ${formatErrorMessage(error)}`);
	}
	return preflightOpenClawDatabaseSchemas({
		env: context.env,
		supportedVersions,
		configuredAgentDatabaseTargets: [],
		configuredAgentDatabaseCandidatePaths
	});
}
async function captureTargetDatabaseSchemaContext(env, options) {
	const inspectionEnv = cloneEnvWithPlatformSemantics(env);
	const readEnv = cloneEnvWithPlatformSemantics(env);
	const { snapshot, writeOptions } = await createConfigIO({
		env: inspectionEnv,
		observe: false,
		pluginValidation: "core-only"
	}).readConfigFileSnapshotForWrite();
	const planned = options?.legacyConfigPlan;
	const before = planned?.snapshot;
	const legacyConfigPlan = before && before.path === snapshot.path && before.exists === snapshot.exists && before.raw === snapshot.raw && before.hash === snapshot.hash && isDeepStrictEqual(before.includedPaths ?? [], snapshot.includedPaths ?? []) && isDeepStrictEqual(before.includeProvenance ?? [], snapshot.includeProvenance ?? []) && isDeepStrictEqual(before.sourceConfig, snapshot.sourceConfig) && isDeepStrictEqual(planned.includeIdentity.includeFileHashesForWrite ?? {}, writeOptions.includeFileHashesForWrite ?? {}) && isDeepStrictEqual(planned.includeIdentity.includeFileTargetsForWrite ?? {}, writeOptions.includeFileTargetsForWrite ?? {}) ? planned : void 0;
	if (before?.path === snapshot.path && !legacyConfigPlan) throw new UpdatePreMutationError("database-schema-preflight", `Update refused: planned configuration changed at ${snapshot.path}. Retry against the current source.`);
	if (!snapshot.valid && !legacyConfigPlan || snapshot.readError) throw new UpdatePreMutationError("invalid-config", [
		`Update refused: configuration is invalid or unreadable at ${snapshot.path}.`,
		...formatConfigIssueLines(snapshot.issues.map(({ path: issuePath, pathSegments }) => ({
			path: issuePath,
			pathSegments,
			message: "Invalid configuration field"
		})), "-", { normalizeRoot: true }),
		"Run `openclaw doctor --fix` to repair retired or unrecognized configuration fields, then correct any remaining errors before retrying."
	].join("\n"));
	return {
		env: inspectionEnv,
		config: legacyConfigPlan?.config ?? snapshot.sourceConfig ?? snapshot.config,
		configSnapshot: snapshot,
		readEnv,
		...legacyConfigPlan ? { legacyConfigPlan } : {}
	};
}
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
/** Inspect the union of caller/service stores without granting migration ownership. */
async function checkTargetDatabaseSchemasForContexts(supportedVersions, contexts) {
	if (!supportedVersions) return {
		incompatible: [],
		indeterminate: []
	};
	const incompatible = /* @__PURE__ */ new Map();
	const indeterminate = /* @__PURE__ */ new Map();
	for (const context of contexts) {
		const result = await checkTargetDatabaseSchemas(supportedVersions, context);
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
function hasSchemaRefusal(schemas) {
	return schemas.incompatible.length > 0 || schemas.indeterminate.length > 0;
}
//#endregion
export { hasSchemaRefusal as i, checkTargetDatabaseSchemasForContexts as n, formatSchemaRefusalLines as r, captureTargetDatabaseSchemaContext as t };
