import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { i as nodeRuntimeFailure, n as detectCurrentSqliteCapabilities } from "./node-sqlite-DWn4GVXM.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { l as resolveSystemNodeInfo } from "./runtime-paths-DifTYoyV.mjs";
import { o as nodeVersionSatisfiesEngine } from "./runtime-guard-QhifpZGP.mjs";
import path from "node:path";
//#region src/infra/update-runner-git-node-preflight.ts
const MAX_PACKAGE_JSON_BYTES = 1048576;
async function readCandidateNodeEngine(root) {
	const manifest = asNullableRecord(await tryReadJson(path.join(root, "package.json"), { maxBytes: MAX_PACKAGE_JSON_BYTES }));
	const engines = asNullableRecord(manifest?.engines);
	return normalizeNullableString(engines?.node);
}
/** Reports a proven candidate Node mismatch without changing the active runtime. */
async function checkGitCandidateNodeRuntime(root) {
	const startedAt = Date.now();
	const engine = await readCandidateNodeEngine(root);
	let currentVersion = process.versions.node;
	let currentPath = process.execPath;
	let capabilityError;
	let systemNode = null;
	if (process.versions.bun) {
		systemNode = await resolveSystemNodeInfo({ acceptNodeVersion: (version) => nodeVersionSatisfiesEngine(version, engine) !== false });
		currentPath = systemNode?.path ?? "system Node";
		currentVersion = systemNode?.status === "supported" || systemNode?.status === "unsupported" ? systemNode.version ?? "unknown" : "unavailable";
		capabilityError = systemNode === null ? "No system Node was found." : systemNode.status === "probe-failed" ? systemNode.error.message : systemNode.status === "unsupported" ? nodeRuntimeFailure(systemNode.version, systemNode.sqliteProbe) : null;
	} else capabilityError = nodeRuntimeFailure(currentVersion, await detectCurrentSqliteCapabilities());
	if (!capabilityError && nodeVersionSatisfiesEngine(currentVersion, engine) !== false) return null;
	systemNode ??= await resolveSystemNodeInfo({ acceptNodeVersion: (version) => nodeVersionSatisfiesEngine(version, engine) !== false });
	let systemDiagnostic;
	if (systemNode?.status === "probe-failed") systemDiagnostic = `System Node compatibility remains unknown because its probe failed: ${systemNode.error.message}`;
	else if (systemNode?.status === "supported" && nodeVersionSatisfiesEngine(systemNode.version, engine) !== false) systemDiagnostic = `OpenClaw did not select or activate another runtime. Existing compatible Node ${systemNode.version}: ${systemNode.path}`;
	else systemDiagnostic = "No compatible existing system Node was found.";
	return {
		name: "preflight-node-runtime",
		command: `check Node ${currentVersion} against engines.node ${engine}`,
		cwd: root,
		durationMs: Date.now() - startedAt,
		exitCode: 1,
		stdoutTail: `Node ${currentVersion} (${currentPath}); requires engines.node ${engine}`,
		stderrTail: `${capabilityError ? `${capabilityError}\n` : ""}Activate a compatible Node for the CLI, then retry. ${systemDiagnostic}`
	};
}
//#endregion
export { checkGitCandidateNodeRuntime as t };
