import { t as hasErrnoCode } from "./errno-FR4CRyya.mjs";
import { r as isPathInside } from "./path-guards-CH7noY0Z.mjs";
import { t as formatErrorMessage } from "./errors-DPfGDWk1.mjs";
import { t as readImmutableInstallRecord } from "./update-immutable-install-record-Cv2DpqET.mjs";
import { n as directoryIdentity, t as assertImmutableDescriptorCurrent } from "./update-immutable-layout-ADE3XUab.mjs";
import { i as readImmutableSchemaContracts } from "./update-immutable-generation-S0DUN-bf.mjs";
import fs from "node:fs/promises";
import path from "node:path";
import { isDeepStrictEqual } from "node:util";
//#region src/infra/update-immutable-inspection.ts
/** Read recorded preparation and live inventory only; never execute candidate code. */
async function inspectImmutableUpdateCoverage(params) {
	const result = {
		target: {
			sha: params.targetSha,
			preparation: "unknown"
		},
		unsupportedReasons: [],
		warnings: []
	};
	const record = await readImmutableInstallRecord(params.root);
	if (!record) throw new Error("Immutable adoption record is unavailable.");
	assertImmutableDescriptorCurrent(record.descriptor);
	const selected = record.prepared;
	if (selected && (!params.targetSha || selected.sha === params.targetSha)) {
		result.target.sha = selected.sha;
		try {
			if (directoryIdentity(selected.path) !== selected.identity) throw new Error("Prepared generation identity differs from its receipt.");
			const contracts = await readImmutableSchemaContracts(record);
			result.currentSchemaVersions = contracts.current;
			result.unsupportedReasons.push(...contracts.reasons);
			if (contracts.candidate && isDeepStrictEqual(contracts.candidate, selected.schemaVersions)) result.target = {
				sha: selected.sha,
				preparation: "prepared",
				schemaVersions: contracts.candidate
			};
		} catch (error) {
			result.warnings.push(formatErrorMessage(error));
		}
	}
	if (result.target.preparation === "unknown") result.unsupportedReasons.push("Target coverage is unknown: no matching readable preparation receipt and generation. Prepare the exact target with openclaw update --sha <commit> --no-restart, then inspect again.");
	if (!record.descriptor.activationEnabled) result.unsupportedReasons.push("This installation is adopted for preparation only; activation is disabled.");
	const { withArtifactPreservingStateReads, withOpenClawStateDatabaseReadSnapshot } = await import("./openclaw-state-db-readonly-DM1-BlkK.mjs");
	await withArtifactPreservingStateReads(async () => {
		try {
			const { readImmutableService } = await import("./update-immutable-service-DDiLj5tx.mjs");
			const { descriptor } = record;
			const { command } = await readImmutableService(descriptor.service, descriptor.root, descriptor.current.path, descriptor.runtime.path);
			const env = {
				...process.env,
				OPENCLAW_AGENT_DIR: void 0,
				PI_CODING_AGENT_DIR: void 0,
				...command.environment
			};
			const { createConfigIO } = await import("./io-Cwio_qp9.mjs");
			const snapshot = await createConfigIO({
				env,
				configPath: descriptor.service.configPath,
				observe: false,
				pluginValidation: "core-only"
			}).readConfigFileSnapshot();
			if (!snapshot.valid) throw new Error("Adopted service configuration is invalid; live resource coverage is unknown.");
			const stateDir = descriptor.service.stateDir;
			const config = snapshot.sourceConfig;
			const { readUpdateStateSchemaVersions, resolveUpdateStateContentVersion } = await import("./update-candidate-state-CV7O5yg_.mjs");
			let inventory = /* @__PURE__ */ new Map();
			const versions = await readUpdateStateSchemaVersions({
				stateDir,
				config,
				env,
				preserveSourceArtifacts: true,
				onInventory: (files) => {
					inventory = files;
				}
			});
			const byPath = new Map(versions.map((entry) => [entry.path, entry]));
			const shared = path.resolve(stateDir, "state", "openclaw.sqlite");
			result.databases = [...inventory.values()].map((discovery) => {
				const file = discovery.spellings[0];
				const version = byPath.get(file);
				if (!version) throw new Error(`Schema inspection omitted ${file}.`);
				const found = resolveUpdateStateContentVersion(version);
				const target = result.target.schemaVersions?.[file === shared ? "state" : "agent"];
				const coverage = found === null ? "absent" : target === void 0 ? "unknown" : found === target ? "matching-version" : found < target ? "migration-required" : "newer-than-candidate";
				return Object.assign({}, discovery, version, {
					external: !isPathInside(stateDir, file),
					targetVersion: target,
					coverage
				});
			});
			for (const database of result.databases) if (database.coverage === "migration-required" || database.coverage === "newer-than-candidate") result.unsupportedReasons.push(`${database.path}: schema ${resolveUpdateStateContentVersion(database)} → ${database.targetVersion} (${database.coverage}); immutable activation does not migrate live stores.`);
			const { preparePluginDoctorMigrationBackupResources } = await import("./doctor-contract-registry-DdkKEDky.mjs");
			const { createPluginCache, withPluginCache, retirePluginCache } = await import("./plugin-cache-B1jqWOmJ.mjs");
			const { withPluginSourceCaptureStorage } = await import("./plugin-source-capture-context-CB_IVkyg.mjs");
			const warnings = [];
			const cache = createPluginCache();
			let resources;
			try {
				resources = await withPluginCache(cache, () => withPluginSourceCaptureStorage({
					stateDir,
					placement: "temporary"
				}, () => withOpenClawStateDatabaseReadSnapshot(async () => {
					const prepared = await preparePluginDoctorMigrationBackupResources({
						config,
						env,
						stateDir,
						warnings
					});
					prepared.assertCurrent();
					return prepared.resources;
				}, { env })));
			} finally {
				result.warnings.push(...warnings.map((warning) => warning.message));
				const cleanup = await retirePluginCache(cache);
				result.warnings.push(...cleanup.failures.map((failure) => formatErrorMessage(failure.error)));
			}
			result.resources = await Promise.all(resources.map(async (resource) => ({
				path: resource.path,
				kind: resource.kind,
				present: await fs.stat(resource.path).then(() => true, (error) => {
					if (hasErrnoCode(error, "ENOENT")) return false;
					throw error;
				}),
				external: !isPathInside(stateDir, resource.path),
				coverage: "unknown"
			})));
		} catch (error) {
			result.warnings.push(`Live inventory inspection incomplete: ${formatErrorMessage(error)}`);
		}
	}, { agentDatabases: true });
	return result;
}
function formatImmutableUpdateCoverage(coverage) {
	return [
		`Target schema coverage: ${coverage.target.preparation}${coverage.target.sha ? ` (${coverage.target.sha})` : ""}.`,
		...coverage.unsupportedReasons,
		...(coverage.databases ?? []).map((database) => `Store ${database.path}: ${database.coverage}; schema ${database.contentVersion ?? database.userVersion ?? "absent"}${database.targetVersion === void 0 ? "" : ` → ${database.targetVersion}`}${database.external ? "; external" : ""}${database.registeredPaths?.length ? `; registered as ${database.registeredPaths.join(", ")}` : ""}.`),
		...(coverage.resources ?? []).map((resource) => `Plugin resource ${resource.path} (${resource.kind}): ${resource.present ? "present" : "absent"}${resource.external ? "; external" : ""}; migration coverage unknown.`),
		...coverage.warnings,
		"Inspection only: schema versions are not physical-schema, migration, backup, or activation readiness proof."
	];
}
//#endregion
export { formatImmutableUpdateCoverage, inspectImmutableUpdateCoverage };
