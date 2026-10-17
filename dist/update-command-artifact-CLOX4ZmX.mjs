import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS } from "./constants-BLghGsId.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-DR7bHNl9.mjs";
import { f as createPrivateSqliteTempDirectory } from "./sqlite-snapshot-staging-BIgaAYlp.mjs";
import { r as hasCommandProcessCleanupError } from "./exec-result-s7WOth0N.mjs";
import { f as createUpdatePreflightFailure } from "./service-inspection-error-Bsltcpi4.mjs";
import { t as parseOpenClawSchemaVersions } from "./openclaw-schema-versions-C_DqZ7zz.mjs";
import { n as compareSemverStrings } from "./update-check-CWEQyown.mjs";
import { t as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./gateway-env-selection-B-LO0cRL.mjs";
import { t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-Cab7F5S1.mjs";
import { t as createUpdateProgress } from "./progress-BdyrcKI6.mjs";
import { r as removePathWithinRoot } from "./fs-safe-remove-DuP7yp5L.mjs";
import { i as stagePackageInstallUpdate } from "./update-command-package-BqeZr2Zr.mjs";
import { a as withUpdateInitializationCleanup } from "./update-command-initialization-g3rXNKok.mjs";
import fs from "node:fs";
import path from "node:path";
import fs$1 from "node:fs/promises";
import { assertDirectoryIdentitySync, readDirectoryIdentity } from "@openclaw/fs-safe/advanced";
import { valid } from "semver";
//#region src/cli/update-cli/update-command-artifact.ts
/** Candidate hooks may initialize their own profile, never the profile awaiting admission. */
async function withPrivateStagedPackageInstall(params, use) {
	const rootIdentity = await readDirectoryIdentity(resolvePreferredOpenClawTmpDir());
	const root = rootIdentity.realPath;
	const assertRoot = () => assertDirectoryIdentitySync(root, rootIdentity);
	assertRoot();
	const home = await createPrivateSqliteTempDirectory(root, "openclaw-update-artifact-");
	assertRoot();
	const homeIdentity = await readDirectoryIdentity(home);
	const assertWorkspace = () => {
		assertRoot();
		assertDirectoryIdentitySync(home, homeIdentity);
	};
	assertWorkspace();
	let retainWorkspace = false;
	return await withUpdateInitializationCleanup(async () => {
		try {
			const state = path.join(home, "state");
			const tmp = path.join(home, "tmp");
			await fs$1.mkdir(tmp);
			assertWorkspace();
			const env = { ...params.installEnv };
			for (const key of [
				...[...GATEWAY_CONFIG_SELECTION_ENV_KEYS].filter((selector) => selector.startsWith("OPENCLAW_") || selector === "PI_CODING_AGENT_DIR"),
				...GATEWAY_SERVICE_SELECTOR_ENV_KEYS,
				...SUPERVISOR_HINT_ENV_VARS,
				"STATE_DIRECTORY",
				"NODE_COMPILE_CACHE",
				"OPENCLAW_GATEWAY_SERVICE_PID",
				"OPENCLAW_SERVICE_MARKER",
				"OPENCLAW_SERVICE_KIND",
				"OPENCLAW_UPDATE_RUN_ID",
				"OPENCLAW_UPDATE_RUN_HANDOFF",
				"OPENCLAW_CONTROL_PLANE_UPDATE_SENTINEL_META",
				"OPENCLAW_UPDATE_POST_CORE",
				"OPENCLAW_UPDATE_POST_CORE_CHANNEL",
				"OPENCLAW_UPDATE_POST_CORE_RESULT_PATH",
				"OPENCLAW_UPDATE_POST_CORE_INSTALL_RECORDS_PATH",
				"OPENCLAW_UPDATE_POST_CORE_STARTED_AT_MS",
				"OPENCLAW_UPDATE_POST_CORE_REQUESTED_CHANNEL",
				"OPENCLAW_UPDATE_POST_CORE_SOURCE_CONFIG_PATH",
				"OPENCLAW_DIAGNOSTICS_TIMELINE_PATH"
			]) env[key] = void 0;
			Object.assign(env, {
				OPENCLAW_HOME: home,
				OPENCLAW_STATE_DIR: state,
				OPENCLAW_CONFIG_PATH: path.join(state, "openclaw.json"),
				TMPDIR: tmp,
				TMP: tmp,
				TEMP: tmp,
				NODE_DISABLE_COMPILE_CACHE: "1"
			});
			const stage = await stagePackageInstallUpdate({
				...params,
				installEnv: env
			});
			return await withUpdateInitializationCleanup(async () => {
				assertWorkspace();
				const manifest = JSON.parse(await fs$1.readFile(path.join(stage.root, "package.json"), "utf8"));
				assertWorkspace();
				return await use({
					stage,
					manifest
				});
			}, () => stage.close());
		} catch (error) {
			retainWorkspace = hasCommandProcessCleanupError(error);
			throw error;
		}
	}, async () => {
		if (retainWorkspace) return;
		await removePathWithinRoot({
			rootDir: root,
			relativePath: path.basename(home),
			recursive: true,
			symlinks: "unlink",
			assertBeforeMutation: () => {
				assertRoot();
				if (fs.lstatSync(home, {
					bigint: true,
					throwIfNoEntry: false
				})) assertDirectoryIdentitySync(home, homeIdentity);
			}
		});
	});
}
/** Explicit artifacts need their own declaration; a familiar version is not provenance. */
function readFreshUpdateArtifactMetadata(manifest) {
	if (!isRecord(manifest) || typeof manifest.version !== "string" || !valid(manifest.version)) return { failure: createUpdatePreflightFailure("target-version-resolution") };
	const schemas = isRecord(manifest.openclaw) ? parseOpenClawSchemaVersions(manifest.openclaw.schemaVersions) : void 0;
	if (!schemas) return { failure: createUpdatePreflightFailure("target-schema-metadata") };
	return {
		version: manifest.version,
		schemaVersions: schemas,
		nodeEngine: isRecord(manifest.engines) && typeof manifest.engines.node === "string" ? manifest.engines.node : null
	};
}
/** Bind the inspected artifact to the existing fresh-profile admission flow. */
async function runFreshUpdateArtifact(params, run) {
	const presentation = createUpdateProgress(!params.json);
	const { initialization } = params;
	const { target } = initialization;
	try {
		return await withPrivateStagedPackageInstall(params.stageParams(presentation), async ({ stage, manifest }) => {
			initialization.stagedPackage = stage;
			const metadata = readFreshUpdateArtifactMetadata(manifest);
			if (metadata.failure) return await target.refuseUpdate("target-metadata-preflight", metadata.failure.message, metadata.failure.failureFacts);
			const comparison = compareSemverStrings(target.currentVersion, metadata.version);
			target.downgradeRisk = comparison !== null && comparison > 0;
			target.packageAlreadyCurrent = false;
			target.targetVersion = metadata.version;
			target.packageTargetSchemaVersions = metadata.schemaVersions;
			target.packageRuntimeTarget = {
				version: metadata.version,
				nodeEngine: metadata.nodeEngine
			};
			return await run();
		});
	} finally {
		presentation.dispose();
	}
}
//#endregion
export { withPrivateStagedPackageInstall as n, runFreshUpdateArtifact as t };
