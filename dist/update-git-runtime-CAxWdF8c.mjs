import { r as asNullableRecord } from "./record-coerce-DItp3I4t.mjs";
import { s as normalizeNullableString } from "./string-coerce-CIXf7egm.mjs";
import { p as tryReadJson } from "./json-files-C0HSMh2Z.mjs";
import { r as readPackageVersion } from "./package-json-skO3uhlG.mjs";
import { o as resolveControlUiAssetHealth } from "./control-ui-assets-C3-n9r4b.mjs";
import path from "node:path";
import fs from "node:fs/promises";
//#region src/infra/update-git-runtime.ts
async function collectGitRuntimeErrors(params) {
	const distRoot = path.join(params.root, "dist");
	const [buildInfo, buildStamp, runtimeStamp, entryExists, uiHealth] = await Promise.all([
		tryReadJson(path.join(distRoot, "build-info.json")),
		tryReadJson(path.join(distRoot, ".buildstamp")),
		tryReadJson(path.join(distRoot, ".runtime-postbuildstamp")),
		Promise.any([fs.stat(path.join(distRoot, "entry.js")), fs.stat(path.join(distRoot, "entry.mjs"))]).then(() => true, () => false),
		resolveControlUiAssetHealth({ root: params.root })
	]);
	const commit = normalizeNullableString(asNullableRecord(buildInfo)?.commit);
	const buildHead = normalizeNullableString(asNullableRecord(buildStamp)?.head);
	const runtimeHead = normalizeNullableString(asNullableRecord(runtimeStamp)?.head);
	return Boolean(params.sha) && commit === params.sha && buildHead === params.sha && runtimeHead === params.sha && entryExists && uiHealth.kind === "ready" ? [] : [`git runtime mismatch (build=${commit ?? "missing"}, buildStamp=${buildHead ?? "missing"}, runtimeStamp=${runtimeHead ?? "missing"}, entry=${entryExists}, ui=${uiHealth.kind}, expected=${params.sha ?? "missing"})`];
}
/**
* Commit the checkout's dist was built from, or null when no build exists.
* Comparing it to HEAD is how callers detect a checkout that pulled but never
* rebuilt, which otherwise runs old code while reporting the new source version.
*/
async function readBuiltRuntimeCommit(root) {
	const buildInfo = await tryReadJson(path.join(root, "dist", "build-info.json"));
	return normalizeNullableString(asNullableRecord(buildInfo)?.commit);
}
async function readBuiltGatewayBuildId(root) {
	const buildInfo = await tryReadJson(path.join(root, "dist", "build-info.json"));
	const buildId = normalizeNullableString(asNullableRecord(buildInfo)?.buildId);
	return buildId && buildId.length <= 96 ? buildId : null;
}
async function verifyGitUpdateRecovery(params) {
	const [version, buildId, errors] = await Promise.all([
		readPackageVersion(params.root),
		readBuiltGatewayBuildId(params.root),
		collectGitRuntimeErrors(params)
	]);
	return version && buildId && errors.length === 0 ? {
		serviceRestartSafe: true,
		version,
		buildId
	} : {
		serviceRestartSafe: false,
		reason: "runtime-verification-failed"
	};
}
//#endregion
export { verifyGitUpdateRecovery as i, readBuiltGatewayBuildId as n, readBuiltRuntimeCommit as r, collectGitRuntimeErrors as t };
