import { r as resolveOpenClawPackageRootSync } from "./openclaw-root-CBoxhfke.mjs";
import { n as isTruthyEnvValue } from "./env-BBJTTIuE.mjs";
import { n as resolveCommitHash, t as gitCommitPrefixesMatch } from "./git-commit-eT_9FBYG.mjs";
import { n as readInstallOwner } from "./install-owner-ImshV9Dw.mjs";
import { r as readBuiltRuntimeCommit } from "./update-git-runtime-Cg4widap.mjs";
//#region src/commands/doctor-stale-runtime-build.ts
const STALE_RUNTIME_BUILD_CHECK_ID = "core/doctor/stale-runtime-build";
async function collectStaleRuntimeBuildFindings(params = {}) {
	const env = params.env ?? process.env;
	if (isTruthyEnvValue(env.OPENCLAW_UPDATE_IN_PROGRESS)) return [];
	const root = params.root ?? resolveOpenClawPackageRootSync({ moduleUrl: import.meta.url });
	if (!root || await readInstallOwner(root)) return [];
	const builtCommit = await readBuiltRuntimeCommit(root);
	if (!builtCommit) return [];
	const { GIT_COMMIT: _gitCommit, GIT_SHA: _gitSha, ...checkoutEnv } = env;
	const checkoutCommit = resolveCommitHash({
		cwd: root,
		env: checkoutEnv
	});
	if (!checkoutCommit || gitCommitPrefixesMatch(builtCommit, checkoutCommit)) return [];
	return [{
		checkId: STALE_RUNTIME_BUILD_CHECK_ID,
		severity: "warning",
		message: `Running build came from commit ${builtCommit.slice(0, 7)}, but the checkout is at ${checkoutCommit.slice(0, 7)}; the loaded runtime is older than its source.`,
		path: root,
		fixHint: "Run `openclaw update` to rebuild and restart through the update lifecycle. For a manual build, stop the Gateway before running `pnpm build`, then start it again."
	}];
}
//#endregion
export { collectStaleRuntimeBuildFindings };
