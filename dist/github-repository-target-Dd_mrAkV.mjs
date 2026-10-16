import { l as normalizeOptionalString } from "./string-coerce-1VuiLaaR.mjs";
import { c as isRecord } from "./record-coerce-TIsquoVR.mjs";
//#region src/gateway/github-repository-target.ts
function resolveGitHubForkParent(value) {
	if (!isRecord(value) || value.fork !== true || !isRecord(value.parent)) return;
	const parentOwner = isRecord(value.parent.owner) ? value.parent.owner : void 0;
	const owner = normalizeOptionalString(parentOwner?.login);
	const repo = normalizeOptionalString(value.parent.name);
	return owner && repo ? {
		owner,
		repo
	} : void 0;
}
/** Projects GitHub's repository response into the canonical push/head/base relationship. */
function resolveGitHubRepositoryTarget(value, push) {
	if (!isRecord(value)) return;
	const defaultBranch = normalizeOptionalString(value.default_branch);
	if (value.fork !== true) return defaultBranch ? {
		fork: false,
		push,
		pullRequest: {
			...push,
			defaultBranch
		}
	} : void 0;
	const parent = resolveGitHubForkParent(value);
	const parentRecord = isRecord(value.parent) ? value.parent : void 0;
	const parentDefaultBranch = normalizeOptionalString(parentRecord?.default_branch);
	return parent && parentDefaultBranch ? {
		fork: true,
		push,
		pullRequest: {
			...parent,
			defaultBranch: parentDefaultBranch
		}
	} : void 0;
}
//#endregion
export { resolveGitHubRepositoryTarget as n, resolveGitHubForkParent as t };
