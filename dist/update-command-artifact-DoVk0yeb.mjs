import { c as isRecord } from "./record-coerce-DItp3I4t.mjs";
import { a as GATEWAY_SERVICE_SELECTOR_ENV_KEYS } from "./constants-CJCmIHb-.mjs";
import { n as resolvePreferredOpenClawTmpDir } from "./tmp-openclaw-dir-BSb3HetY.mjs";
import { _ as GATEWAY_CONFIG_SELECTION_ENV_KEYS } from "./io.read-helpers-N26RjV2V.mjs";
import { l as createUpdatePreflightFailure } from "./update-failure-facts-DiyYJNo1.mjs";
import { t as tempWorkspace } from "./private-temp-workspace-DQFTMfun.mjs";
import { t as SUPERVISOR_HINT_ENV_VARS } from "./supervisor-markers-DL2AtFkv.mjs";
import { t as parseOpenClawSchemaVersions } from "./openclaw-schema-versions-PVhojTxP.mjs";
import { n as compareSemverStrings } from "./update-check-CtYi2ZDp.mjs";
import { t as createUpdateProgress } from "./progress-Duz1sEcD.mjs";
import { o as stagePackageInstallUpdate } from "./update-command-package-DTrSEnDD.mjs";
import { a as withUpdateInitializationCleanup } from "./update-command-initialization-DGcVKEKZ.mjs";
import path from "node:path";
import fs from "node:fs/promises";
import { valid } from "semver";
//#region src/cli/update-cli/update-command-artifact.ts
/** Candidate hooks may initialize their own profile, never the profile awaiting admission. */
async function withFreshUpdateArtifact(params, use) {
	const workspace = await tempWorkspace({
		rootDir: resolvePreferredOpenClawTmpDir(),
		prefix: "openclaw-update-artifact-"
	});
	return await withUpdateInitializationCleanup(async () => {
		const home = workspace.dir;
		const state = path.join(home, "state");
		const tmp = path.join(home, "tmp");
		await fs.mkdir(tmp);
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
			const manifest = JSON.parse(await fs.readFile(path.join(stage.root, "package.json"), "utf8"));
			return await use({
				stage,
				manifest
			});
		}, () => stage.close());
	}, async () => {
		await workspace.cleanup();
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
		return await withFreshUpdateArtifact(params.stageParams(presentation.progress), async ({ stage, manifest }) => {
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
export { runFreshUpdateArtifact };
